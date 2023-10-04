<?php
namespace App\Models;

use CodeIgniter\Model;
use App\core\BASE_Model;
use App\core\BASE_Result;
use App\Enums\E_SESSION_ITEM ,App\Enums\E_STATUS_CODE , App\Enums\E_SYSTEM_LOCK_REASONS;

class Role_model extends BASE_Model 
{
	const DEBUG_FILENAME = "role_model.log";
	
	/**
	 * Constructor for the role model
	 */
	protected $table = TBL_ROLES;

	function __construct()
	{	
		$this->db = \Config\Database::connect();
		$this->config = \Config\Services::config();
		$this->config = new \Config\App();
		write2Debugfile(self::DEBUG_FILENAME, "Role_model", false);
	}


	/**
	 * Add missing rights when saving the role (edit or create)
	 * @param string $client_id
	 * @param array $rights
	 * @param array &$queries Queries for transaction
	 *
	 */
	function getMissingRightsQueries($client_id, $rights, &$queries)
	{
		if (is_array($rights) && count($rights) > 0)
		{
			//if not root_client => add missing rights from root
			if ($client_id != $this->config->root_client_id)
			{
				//saved rights of the client:
				$where = array(
					"client_id"=>$client_id
				);
					
				$client_rights_result = $this->BASE_Select(TBL_RIGHTS, $where);
	
				$client_rights = array();
				foreach ($client_rights_result->getData() as $right)
				{
					$client_rights[] = $right->right_id;
				}
	
				//root rights
				$where 	= array(
					"client_id"=>$this->config->root_client_id,
					"active"=>1,
					"is_root_right" => 0
				);
					
				$root_rights_result = $this->BASE_Select(TBL_RIGHTS, $where);
				$root_rights = array();
				foreach ($root_rights_result->getData() as $right)
				{
					$root_rights[] = $right->right_id;
				}
	
				//compare and select missing rights for client:
				$add_rights = array();
				foreach ($root_rights as $right_id)
				{
					if (in_array($right_id, $rights) && !in_array($right_id, $client_rights))
					{
						$add_rights[] = $right_id;
					}
				}
	
	
				//add missing rights
				if (count($add_rights) > 0)
				{

					$query = $db->table(TBL_RIGHTS) // Replace 'rights' with your actual table name
					->select('*')
					->where('client_id', $this->config->root_client_id)
					->where('active', 1)
					->where('is_root_right', 0)
					->whereIn('right_id', $add_rights)
					->get();

	
					if (! $query){
						return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);

					}
					$rights_to_add = $query->getResultObject();
					foreach ($rights_to_add as $key => $right) {
						$right->client_id = $client_id;
						$queries[] = $db->table('rights')->insert($right);
					}
				}
			}
		}
	}
		
	/**
	 * creates a new role entry and stores it's assigned rights
	 * Because there are multiple inserts to run, this method utilizes transactions and perform a rollback on error
	 *
	 * @version 1.2
	 * 
	 * @param string $client_id
	 * @param array $data
	 * @param array $rights
	 * 
	 * @return BASE_Result
	 */
	function create($client_id, $data, $rights)
	{
		write2Debugfile(self::DEBUG_FILENAME, "client_id[".$client_id."] create role-".print_r($data, true));
		if ($data["role_id"] == ""){
			$data["role_id"] 	= BASE_Model::generateUID(TBL_ROLES, "role_id", "", false, 10);
		}
		$data["client_id"] = $client_id;
		
		$queries = array( $this->getInsertString(TBL_ROLES, $data) );

		 
		
		// return $this->db->table(TBL_ROLES)->insert($data);
		
		if (is_array($rights) && count($rights) > 0)
		{
			foreach ($rights as $index=>$right_id)
			{
				$queries[] = $this->getInsertString(TBL_ROLES_RIGHTS,
					array(
						"client_id"=>$client_id,
						"role_id"=>$data["role_id"],
						"right_id"=>$right_id
					)
				);
			}
			$this->getMissingRightsQueries($client_id, $rights, $queries);
		}
        // $result = new BASE_Result($return, $error, "", ($error == '' ? E_STATUS_CODE::SUCCESS : E_STATUS_CODE::ERROR));
	
		$return = $this->BASE_Transaction($queries);


		// write2Debugfile(self::DEBUG_FILENAME, count($queries) . " queries -\n" . $queries . "\n return-" . print_r($return));
		return $return;
	}
	
	/**
	 * load all roles for a given client id, utilizing the datatables library
	 * 
	 * @param string $client_id
	 * @param array $columns
	 * @param bool $btnEdit
	 * @param bool $btnDel
	 * @param bool $static_permission
	 * @param string $includeDeleted
	 * 
	 * @return BASE_Result >> containing an array or null
	 */
	function datatable($client_id, $columns, $btnEdit=false, $btnDel=false, $static_permission=false, $includeDeleted=false)
	{
		$builder = $this->db->table($this->table);
        // echo $client_id;die;
       
	/* 	$getFields = $this->getFieldNames($this->table);
		$fields = prepare_fields($columns, $getFields, ['is_static']);
        $builder->select('role_id, ' . $columns);
        $builder->where('client_id', $client_id);
		$query = $builder->get();
        $roles = $query->getResult('array'); */
// print_r($columns);
		$getFields = $this->getFieldNames($this->table);

		$fields = prepare_fields($columns, $getFields , array("is_static"));
		// print_r($fields);die;
		$builder->select('role_id, ' .$fields);
        $builder->where('client_id', $client_id);
        $builder->where('deleted',0);

		$query = $builder->get();
        $roles = $query->getResult('array');

        $result = [];

		foreach ($roles as $row) {
			// print_r($row);
            // Customize your data here as per your edit_column logic
            $row['role_name'] = $this->callback_build_role_buttons($row['role_id'], $row['role_name'], 'roles', true, true, $static_permission, $row['is_static']);
            $row['role_desc'] = callback_translate_if_static($row['is_static'], $row['role_desc']);
            $row['is_static'] = callback_integer2checkbox($row['role_id'], $row['is_static']);

            $result[] = $row;
			// print_r( $result);die;
			// echo $row['role_name'];die;
        }

		return new BASE_Result($result, "", $result, E_STATUS_CODE::SUCCESS);

	}
	
	/**
	 * Load data for a given role_id
	 *
	 * @param string $client_id 	>> client id
	 * @param string $role_id		>> role id
	 * @param bool $includeDeleted	>> 
	 *
	 * @return BASE_Result
	 */
	function load($client_id, $role_id=null, $includeDeleted=false)
	{
		$fields = "*";
		$where 	= array(
			"client_id"=>$client_id
		);
		// $where["client_id"] = $client_id;

		if ($role_id != null){
			$where["role_id"] = $role_id;
		}
		if ($includeDeleted === false){
			$where["deleted"] = "0";
		}

		$builder = $this->db->table(TBL_ROLES); 
		$builder->where($where);
		$query = $builder->get(); 
		$result = $query->getResult();
		$error 	= self::generateErrorMessage();
		$status = ($error != null ? E_STATUS_CODE::DB_ERROR : E_STATUS_CODE::SUCCESS);
		$return =new BASE_Result($result, $error, "", $status);
		// $return = $this->BASE_Select(TBL_ROLES, $where, $fields);
		// $lastQuery = $this->db->getLastQuery();
		// echo "<pre>";print_r( $lastQuery);die;
	
		write2Debugfile(self::DEBUG_FILENAME, " - load client_id[$client_id] role_id[$role_id]\n".$this->lastQuery()."\n".print_r($return, true) );
		return $return;
	}

	function getRole($client_id, $role_id=null, $includeDeleted=false){

		// $builder = $db->table('mytable');
		// $query   = $builder->get();
		$fields = "*";
		/* $where 	= array(
			"client_id"=>$client_id
		); */

		$where["client_id"] = $client_id;

	
		if ($role_id != null){
			$where["role_id"] = $role_id;
		}
		if ($includeDeleted === false){
			$where["deleted"] = "0";
		}

		$builder = $this->db->table(TBL_ROLES)->select($fields)->where($where);
		$query = $builder->get();
		$data = $query->getResultArray();
		$result = new BASE_Result($data, "", "", E_STATUS_CODE::SUCCESS);
		return $result;

	}

	
	/**
	 * Load rights for client
	 *
	 * @param string $client_id 	>> client id
	 * @param string $right_id		>> specific right/permission
	 * 
	 * @return BASE_Result
	 */

	public function loadRights($client_id, $right_id = null)
    {
        $builder = $this->db->table(TBL_RIGHTS);

        $builder->select('*');
        $builder->where('active', 1);
        $builder->where('client_id', $client_id);

        if ($client_id != config('App')->root_client_id) {
            $builder->where('is_root_right', 0);
        }

        if ($right_id != null) {
            $builder->where('right_id', $right_id);
        }

        $builder->orderBy('is_root_right', 'asc');
        $builder->orderBy('group_token', 'desc');
        $builder->orderBy('right_name', 'asc');

        $query = $builder->get();

        if (! $query) {
            return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
        }

        $return = new BASE_Result($query->getResult(), $this->generateErrorMessage(), null, E_STATUS_CODE::SUCCESS);
        
        // Note: You might need to adjust the logging mechanism as needed
        // write2Debugfile(self::DEBUG_FILENAME, " - loadRights clientID[$client_id] ID[$right_id]\n".$this->lastQuery()."\n".print_r($return, true));

        return $return;
    }
	
	/**
	 * load rights for a specific role
	 *
	 * @param string $client_id	>> client id
	 * @param string $role_id	>> role id
	 * @return BASE_Result 		>> containing an array with the rights or null
	 *
	 */
	function loadRoleRights($client_id, $role_id)
	{
		$fields = array(TBL_RIGHTS.".client_id",
			TBL_RIGHTS.".right_id",
			TBL_RIGHTS.".right_name",
			TBL_RIGHTS.".right_desc",
			TBL_RIGHTS.".is_root_right",
			TBL_RIGHTS.".active"
		);

		/* $builder = $db->table(TBL_ROLES_RIGHTS);
$builder->select('column1, column2');
$query = $builder->get(); */
		$builder = $this->db->table(TBL_ROLES_RIGHTS);
		// print_r($builder);die;
		$builder->select(implode(", ", $fields));
		// ->from( TBL_ROLES_RIGHTS )
		$builder->join( TBL_RIGHTS, 
				TBL_RIGHTS.".client_id = '".$client_id."' AND ".
				TBL_RIGHTS.".right_id = ".TBL_ROLES_RIGHTS.".right_id AND ".
				TBL_RIGHTS.".active = '1'  ", "inner");
				
				$builder->where(TBL_ROLES_RIGHTS.'.client_id', $client_id);
				$builder->where(TBL_ROLES_RIGHTS.'.role_id', $role_id);
				$builder->orderBy(TBL_RIGHTS.'.is_root_right, '.TBL_RIGHTS.'.group_token, '.TBL_RIGHTS.'.right_name ');
	
		$query = $builder->get();
	
		if (! $query){
			return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
		}
	
		$numRows	= $builder->countAllResults();
		$data_obj	= $query->getResult();
		$data		= array();
		foreach ($data_obj as $key => $value) {
			$data[] = $value->right_id;
		}
	
		$return = new BASE_Result($data, $this->generateErrorMessage(), null, E_STATUS_CODE::SUCCESS);

		//write2Debugfile(self::DEBUG_FILENAME, "loadRoleRights ".count($data)." rights loaded");
		return $return;
	}
	
	/**
	 * delete (or set deleted flag) a role and all its related data (uses transaction)
	 *
	 * @param string $client_id
	 * @param string $role_id
	 * @param string $deleted_by
	 * 
	 * @return BASE_Result
	 */
	function remove($client_id, $role_id, $deleted_by)
	{
		/* $builder = $this->db->table(TBL_ROLES); // Replace with your table name

		$builder->where('id', $id); // Replace 'id' with your column name and $id with the value to match

		$builder->delete();
		$result = new BASE_Result($data, $error_msg, $extra, $status);
 */
		$where = array(
			"client_id"=>$client_id,
			"role_id"=>$role_id
		);
		$return = $this->BASE_Delete(TBL_ROLES, $where );

		// print_r($return);die;
	
		write2Debugfile(self::DEBUG_FILENAME, "\ndelete role\n".print_r($return, true));
		return $return;
	}

	/**
	 * update an existing role and it's rights
	 * uses transactions
	 * 
	 * @param string $client_id
	 * @param string $role_id
	 * @param array $data
	 * @param array $rights
	 * 
	 * @return BASE_Result 
	 */
	function RoleUpdate($client_id, $role_id, $data, $rights)
	{
		// print_r($rights);die;
		$queries = array(
			$this->getUpdateString(TBL_ROLES, $data,  array("client_id" => $client_id, "role_id" => $role_id))
		); 
		
		if (is_array($rights) && count($rights) > 0)
		{

			// $queries[] = "DELETE FROM ".TBL_ROLES_RIGHTS." WHERE client_id = '".$client_id."' AND role_id = '".$role_id."' ";
			$sql= "DELETE FROM ".TBL_ROLES_RIGHTS." WHERE client_id = '".$client_id."' AND role_id = '".$role_id."' ";
			$query = $this->db->query($sql);
			// print_r($sql);die;
			
			foreach ($rights as $index=>$right_id)
			{
				// print_r($right_id);die;
				$right_data = array(
					"client_id"=>$data["client_id"],
					"role_id"=>$data["role_id"],
					"right_id"=>$right_id
				);
				$builder = $this->db->table(TBL_ROLES_RIGHTS);
				$builder->insert($right_data);
		
				// $queries[] = $this->getInsertString(TBL_ROLES_RIGHTS, $right_data);
			}
			
			// $this->getMissingRightsQueries($client_id, $rights, $queries);
		}
		
		$queries_string = "";
		foreach ($queries as $key => $query) {
			$queries_string .= "\n".$query.";";
		}
		
		$return = $this->BASE_Transaction($queries);

			// print_r($return);
		// return new BASE_Result( ($error == "" ? true:false), $error, null, $status);

		
		write2Debugfile(self::DEBUG_FILENAME, count($queries)." queries -\n".$queries_string."\nreturn-".print_r($return, true));
		return $return;
	}

	public function callback_build_role_buttons($id, $name, $class, $btn_edit=true, $btn_delete=true, $static_permission=false, $is_static=false, $encrypt=false)
{
	// write2Debugfile("callback_build_role_buttons.log", "\nid[$id] name[$name] class[$class] edit[$btn_edit] delete[$btn_delete] hasPermission4Static[$static_permission] isStatic[$is_static] encrypt[$encrypt]");
	if ($encrypt == true){
		$id = encrypt_string($id);
	}

	if ($is_static){
		$name=lang($name);
	}
	
	$buttons 	= "";

	if ($btn_delete){
		
		if ($is_static && $static_permission == false){
			$buttons .= '<label class="dtbt_remove btn btn-xs btn-danger disabled"><i class="fa fa-trash" title="\''.$name.'\'&nbsp;'.lang("delete").'"></i></label>&nbsp;';
		}
		else{
			// $buttons .= "delete";

			$buttons .= '<a href="'.base_url().'remove/'.$id.'" onclick="$.'.$class.'.remove(\''.$id.'\')" class=" btn btn-danger"><i class="fa fa-trash"></i></a>&nbsp;';
		}
	}

	if ($btn_edit){
		// $buttons .= "edit";
		// $buttons .='<a href="#">Edit</a>';
		$buttons .= '<a href="'.base_url().'edit/'.$id.'" onclick="$.'.$class.'.edit(\''.$id.'\')" class="dtbt_edit btn btn-xs btn-primary"><i class="fa fa-pencil" title="\''.$name.'\'&nbsp;'.lang("edit").'"></i></a>&nbsp;';

		// $buttons .= '<a href="'.base_url().'admin/'.$class.'/edit/'.$id.'" onclick="$.'.$class.'.edit(\''.$id.'\')" class="dtbt_edit btn btn-xs btn-primary"><i class="fa fa-pencil" title="\''.$name.'\'&nbsp;'.lang("edit").'"></i></a>&nbsp;';
	}
	// print_r($buttons );

	return $buttons. " ". $name;
}
} // End of Class

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Place your very custom callback functions here.  
// ..:: You can find common callbacks in the datatable_helper, so have a look there first 
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
/**
 * Datatable callback function for the 'name' and 'desc' column.
 * Since static roles have a translatable name beginning with '#', we call the lang()-method for this entries.
 * All others will be displayed as they have been saved.
 *
 * @category Model
 * @package application\models\role_model
 * @version 1.0
 *
 * @param int $static
 * @param string $str
 *
 * @return string
 */
function callback_translate_if_static($static, $str)
{
	if ($static == 1){
		return lang($str);
	}
	return $str;
}

/**
 * Create buttons (delete & edit) for role datatable.
 * This is custom because of static attribute
 *
 * @category helper
 * @package application\helpers\datatable_helper
 * @version 1.0
 *
 * @param string $id
 * @param string $name
 * @param string $class
 * @param bool $btn_edit		>> add edit button
 * @param bool $btn_delete		>> add delete button
 * @param bool $translate		>> if true, the name will be translated
 * @param bool $encrypt			>> if true, the id will be encrypted
 * @return string
 */

