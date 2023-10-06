<?php
namespace App\Models;

use CodeIgniter\Model;
use App\core\BASE_Model;
use App\core\BASE_Result;
use App\Enums\E_SESSION_ITEM ,App\Enums\E_STATUS_CODE , App\Enums\E_SYSTEM_LOCK_REASONS ,App\Enums\E_ICONS;


class Client_model extends BASE_Model
{
	const DEBUG_FILENAME = "client_model.log";
	protected $table = TBL_CLIENTS;
	/**
	 * Constructor for the client model
	 */
	function __construct()
	{
		$this->db = \Config\Database::connect();
		$this->config = \Config\Services::config();
		$this->config = new \Config\App();
		write2Debugfile(self::DEBUG_FILENAME, "Client model", false);
	}

	/**
	 * count all clients
	 *
	 * @param bool $includeDeleted
	 * @return int
	 */
	function count_clients($includeDeleted=false)
	{
		$where = array();
		if ($includeDeleted === false){
			$where["deleted"] = 0;
		}

		$count = $this->count(TBL_CLIENTS, $where);

		write2Debugfile(self::DEBUG_FILENAME, "count system clients >> result[$count]" );
		return $count;
	}

	/**
	 * store a new client entry
	 *
	 * @param array $data
	 *
	 * @return BASE_Result
	 */
	function create($data)
	{
		$root_clientID = $this->config->root_client_id;
		if ($data["client_id"] == ""){
			$data["client_id"] 	= BASE_Model::generateUID(TBL_CLIENTS, "client_id", "", true, 12);
		}

		$client_id = $data["client_id"];

		write2Debugfile(self::DEBUG_FILENAME, "client_id[".$data["client_id"]."] create client-".print_r($data, true));

		$queries = array(
			$this->getInsertString(TBL_CLIENTS, $data)
		);

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// create the initial user with administrator role assigned
		$password_plain 	= $this->config->default_password;
		$salt				= "bdgdjfhy";
		$password_hashed	= hash_password($salt, $password_plain);
		$user_id 			= BASE_Model::generateUID(TBL_USER, "user_id", "init_", false, 12);
		$username 			= "admin_".$data["customer_number"];
		$country			= "DE";
		$language			= "DE";

		$userdata = array(
			"client_id" => $client_id, "user_id" => $user_id,
			"username" => $username, "password" => $password_hashed, "salt"=>$salt, "email"=>$data["client_email"],
			"firstname"=>"Admin", "lastname"=>$data["client_name"],
			"street"=>$data["client_street"], "house_number"=>$data["client_house_nr"], "zipcode"=>$data["client_zipcode"], "location"=>$data["client_location"],
			"country"=>$country, "language"=>$language, "failed_logins"=>0, "created_at"=>time(), "activated"=>1, "activated_at"=>time()
		);
		$queries[] = $this->getInsertString(TBL_USER, $userdata);

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// Get base roles from ROOT-CLIENT to copy
		$roles 	= $this->BASE_Select(TBL_ROLES, array("client_id"=>"$root_clientID", "is_static"=>1, "is_root"=>0, "deleted"=>0));
		foreach ($roles->data as $key => $role)
		{
			$role->client_id 	= $client_id;
			$role->created_at 	= time();

			$queries[] = $this->getInsertString(TBL_ROLES, $role);
			$queries[] = $this->getInsertString(TBL_USER_ROLES, array("client_id"=>$client_id, "user_id"=>$user_id, "role_id"=>$role->role_id));

			// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
			$roles_rights = $this->BASE_Select(TBL_ROLES_RIGHTS, array("client_id"=>"$root_clientID", "role_id"=>$role->role_id));
		//write2Debugfile(self::DEBUG_FILENAME, "- role rights:\n".$this->lastQuery());

			foreach ($roles_rights->data as $key => $roles_right) {
				$queries[] = $this->getInsertString(TBL_ROLES_RIGHTS, array("client_id"=>$client_id, "role_id"=>$role->role_id, "right_id"=>$roles_right->right_id));
			}
		}
		// write2Debugfile(self::DEBUG_FILENAME, "roles count[".count($roles->data)."]");

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// Get all rights from ROOT-CLIENT to copy
		$rights = $this->BASE_Select(TBL_RIGHTS, array("client_id"=>"0", "is_root_right"=>0));

		foreach ($rights->data as $key => $right)
		{
			$right->client_id = $client_id;
			$queries[] = $this->getInsertString(TBL_RIGHTS, $right);
		}
		write2Debugfile(self::DEBUG_FILENAME, "rights count[".count($rights->data)."]");

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$queries_string = "";
		foreach ($queries as $key => $query) {
			$queries_string .= "\n".$query.";";
		}


		write2Debugfile(self::DEBUG_FILENAME, count($queries)." queries -\n".$queries_string);
		// echo "<pre>";print_r($queries);die;

		$return = $this->BASE_Transaction($queries);

		if ($return->error == ""){
			// $return->messages = "initial-user: ".$username;
		}



		write2Debugfile(self::DEBUG_FILENAME, "return-".print_r($return, true));
		return $return;
	}

	/**
	 * load all clients utilizing the datatables library
	 *
	 * @param string $client_id		>> client identifier
	 * @param array $columns		>> the columns
	 * @param bool $btnEdit			>> include an edit button
	 * @param bool $btnDel			>> include a delete button
	 * @param bool $includeDeleted	>> show deleted entries
	 *
	 * @return BASE_Result >> containing an array or null
	 */
	function datatable($client_id, $columns, $btnEdit=false, $btnDel=false)
	{
		$builder = $this->db->table(TBL_CLIENTS);

        $getFields = $this->getFieldNames(TBL_CLIENTS);

		$btnEdit  = intval($btnEdit);

        $btnDel     = intval($btnDel);

        $fields = prepare_fields($columns, $getFields );

        // print_r($client_id);die;

        $builder->select($fields);

        // $builder->where('client_id', $client_id);

        $builder->where('deleted',0);

        $includeRoot = true;

        if ($includeRoot === false){

            $builder->where("client_id <> '".$this->config->root_client_id."'");

        }

        $query = $builder->get();

        $clients = $query->getResult('array');

        $result = [];

        foreach ($clients as $row) {

            // print_r($row);

            // Customize your data here as per your edit_column logic

            $row['client_id'] = $this->callback_build_buttons($row['client_id'], $row['client_name'], "clients", true, true, 0, 0, 0);

            $row['deleted'] = $this->callback_deleted_client($row['client_id'], $row['deleted']);

            $result[] = $row;

            // print_r( $result);die;

            // echo $row['role_name'];die;

        }

        return new BASE_Result($result, "", $result, E_STATUS_CODE::SUCCESS);
	}

	/**
	 * check if client_name is already used
	 *
	 * @param string $name
	 * @return boolean
	 */
	function exists_name($name)
	{
		$where = array(
				"client_name"=>$name
		);

		$return = $this->BASE_Select(TBL_CLIENTS, $where, array("client_id"));
		if ($return->getData()){
			return true;
		}
		return false;
	}

	/**
	 * Update client data
	 *
	 * @param string $client_id
	 * @param array $data
	 * @return BASE_Result
	 */
	function clientUpdate($client_id, $data)
	{
		write2Debugfile(self::DEBUG_FILENAME, "- update client_id[".$client_id."] data-".print_r($data, true));

        /*
		$queries = array(
			$this->getUpdateString(TBL_CLIENTS, $data,  array("client_id" => $client_id))
		);

		$return = $this->BASE_Transaction($queries);*/
        $return = $this->BASE_Update(TBL_CLIENTS, $data, array("client_id"=>$client_id));
		//write2Debugfile("zzzz_client.txt", $this->lastQuery()."\n\n\n".print_r($data,true));
		//write2Debugfile(self::DEBUG_FILENAME, count($queries)." queries executed".print_r($queries, true)."\nreturn-".print_r($return, true));
		return $return;
	}

	/**
	 * Load specific or all clients.
	 *
	 * @param string $client_id 	>> client id
	 * @param bool $includeDeleted	>>
	 * @return BASE_Result
	 */
	function load($client_id=null, $includeDeleted=true)
	{
		$fields = array("*");
		$where 	= array("client_id"=>$client_id);

        if($client_id != null)
        {
    		if ($client_id != $this->config->root_client_id){
    			//$where 	= array("client_id"=>$client_id);
    		}
        }
		if ($includeDeleted === false){
			$where["deleted"] = "0";
		}

		$return = $this->BASE_Select(TBL_CLIENTS, $where, $fields, array());

		write2Debugfile(self::DEBUG_FILENAME, " - load clientID[$client_id]\n".$this->lastQuery()."\n".print_r($return, true) );
		return $return;
	}

	/**
	 * Load specific or all clients.
	 *
	 * @param string $client_id 	>> client id
	 * @param bool $includeDeleted	>>
	 * @return BASE_Result
	 */
	function load_teams($client_id=null, $includeDeleted=true)
	{
		$this->db
		->from( TBL_TEAMS )
		->where('client_id', $client_id);

		$query = $this->db->get();
		if (! $query){
			return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
		}
		return new BASE_Result($query->result_array(), $this->generateErrorMessage());
	}


	/**
	 * delete (or set deleted flag) a client and all its related data
	 *
	 * @version 1.2
	 *
	 * @param string $client_id		>> client you want to delete
	 * @param string $deleted_by	>> username
	 *
	 * @return BASE_Result
	 */
	function remove($client_id, $deleted_by)
	{
		if ($client_id == $this->config->root_client_id){
			return new BASE_Result(false, lang("msg_you_cannot_delete_this_entry"));
		}

		$data = array(
			"deleted" => 1,
			"deleted_by" => $deleted_by,
			"deleted_at" => time()
		);

		$where = array(
			"client_id"=>$client_id,
		);
		$return1 = $this->BASE_Delete(TBL_USER, $where );
		$return2 = $this->BASE_Delete(TBL_CLIENTS, $where );

		// $return1 = $this->BASE_Update(TBL_USER, $data, array("client_id"=>$client_id));
		// $return2 = $this->BASE_Update(TBL_CLIENTS, $data, array("client_id"=>$client_id));

		//$return = $this->BASE_Transaction($queries);

		//write2Debugfile(self::DEBUG_FILENAME, "remove client. ".count($queries)." queries -\n".$queries_string."\nreturn-".print_r($return, true));

		return $return2;
	}

    /**
     * Load all the countries of users that share a client ID
     * @return array
     */
    function load_countries_by_client_users($langauge){

        $where 	= array(
            "deleted"=>0,
        );

        $fields = array(
            TBL_USER.".client_id",
            TBL_USER.".country",
            TBL_COUNTRIES_L18N.".country_name",
        );

        $this->db
            ->select( implode(", ", $fields) )
            ->from(TBL_USER)
            ->join(TBL_COUNTRIES_L18N, TBL_COUNTRIES_L18N.'.country_code = '.TBL_USER.'.country ', 'inner')
            ->where(TBL_COUNTRIES_L18N.".locale_code = '".$langauge."'")
            ->group_by( implode(", ", array(TBL_USER.".client_id", TBL_USER.".country")));
        $query = $this->db->get();

        $data_obj	= $query->result_object();
        $data		= array();
        foreach ($data_obj as $key => $value) {
            $data[$value->client_id][] = array("iso2"=>$value->country, "country_name" => $value->country_name);
        }

        write2Debugfile(self::DEBUG_FILENAME, " TEST-\n".$this->lastQuery()."\n".print_r($data, true) );

        return $data;
    }
	
	public function callback_deleted_client($id, $deleted)
	{
		list($deleted, $deleted_at, $deleted_by) = explode("#", $deleted);
		$com = ($deleted != 1 ?  E_ICONS::SQUARE_WHITE : E_ICONS::CHECK_SQUARE_WHITE." ".format_timestamp2date($deleted_at, '') );
		return $com;
	}

	public function callback_build_buttons($id, $name, $class, $btn_edit=true, $btn_delete=true, $static_permission=false, $is_static=false, $encrypt=false)
    {
		// echo $id ." ". $name." ".$class." ".$btn_edit." ".$btn_delete;die;
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
	
				$buttons .= '<a href="'.base_url().'remove-client/'.$id.'" onclick="$.'.$class.'.remove_(\''.$id.'\')" class=" btn btn-danger"><i class="fa fa-trash"></i></a>&nbsp;';
			}
		}
	
		if ($btn_edit){
			// $buttons .= "edit";
			// $buttons .='<a href="#">Edit</a>';
			$buttons .= '<a href="'.base_url().'edit-client/'.$id.'" onclick="$.'.$class.'.edit(\''.$id.'\')" class="dtbt_edit btn btn-xs btn-primary"><i class="fa fa-pencil" title="\''.$name.'\'&nbsp;'.lang("edit").'"></i></a>&nbsp;';
	
			// $buttons .= '<a href="'.base_url().'admin/'.$class.'/edit/'.$id.'" onclick="$.'.$class.'.edit(\''.$id.'\')" class="dtbt_edit btn btn-xs btn-primary"><i class="fa fa-pencil" title="\''.$name.'\'&nbsp;'.lang("edit").'"></i></a>&nbsp;';
		}
	
		return $buttons. " ". $id;

    }

}

