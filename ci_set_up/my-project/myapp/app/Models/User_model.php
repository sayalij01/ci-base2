<?php
namespace App\Models;

use CodeIgniter\Model;
use App\core\BASE_Model;
use App\core\BASE_Result;
use App\Enums\E_SESSION_ITEM ,App\Enums\E_STATUS_CODE , App\Enums\E_SYSTEM_LOCK_REASONS;

class User_model extends BASE_Model 
{
	const DEBUG_FILENAME = "user_model.log";
	
	const MINUTES_TO_ALLOW_LOCKED_USER_TO_LOGIN = 15;

	protected $table = TBL_USER;
	protected $db;
	
	/**
	 * Constructor for the role model
	 */
	function __construct()
	{	 
		$this->db = \Config\Database::connect();
		$this->config = \Config\Services::config();
		$this->config = new \Config\App();
		write2Debugfile(self::DEBUG_FILENAME, "User_model", true);
	}
	
	/**
	 * When the user has been locked because of too many failed logins, he may can retry after a certain time.
	 *
	 * This method checks the dependencies to allow login for locked users and returns BOOL
	 * 	- account must be activated
	 *  - lock reason must be TOO_MANY_LOGIN_FAILS
	 *  - MINUTES_TO_ALLOW_LOCKED_USER_TO_LOGIN must not be NULL
	 *
	 * @author Marco Eberhardt
	 * @version 1.0
	 *
	 * @param int $locked
	 * @param int $locked_at
	 * @param string $locked_reason
	 * @param int $activated
	 *
	 * @return boolean
	 */
	private function allow_locked_user($locked, $locked_at, $locked_reason, $activated)
	{
		if ($locked == 1 && $activated == 1 && $locked_reason === E_SYSTEM_LOCK_REASONS::TOO_MANY_LOGIN_FAILS && self::MINUTES_TO_ALLOW_LOCKED_USER_TO_LOGIN !== null)
		{
			$locked_till = $locked_at + (self::MINUTES_TO_ALLOW_LOCKED_USER_TO_LOGIN * 60);
			if (time() >= $locked_till){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * try to authenticate with the user credentials
	 * 
	 * @param string $username		>> loginname
	 * @param string $password		>> password
	 * 
	 * @return BASE_Result 			>> contains the userdata-array on success
	 * 
	 */
	function authenticate($username, $password)
	{
		
		$builder = $this->db->table($this->table)
            ->select("{$this->table}.*, {$this->table}.created_at AS user_created_at, " . TBL_CLIENTS . ".*, " . TBL_CLIENTS . ".created_at AS client_created_at")
            ->join(TBL_CLIENTS, TBL_CLIENTS . ".client_id = " . $this->table . ".client_id AND " . TBL_CLIENTS . ".deleted = '0'", "inner")
            ->where('username', $username)
            ->where("{$this->table}.deleted", "0")
            ->limit(1);

        $query = $builder->get();


        if (!$query) {
            return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
        }

        $numRows = $query->getNumRows();
        $data = [];
        $error = lang("user_not_found"); // default error

        foreach ($query->getResultObject() as $row) {

            $allow_locked = $this->allow_locked_user($row->locked, $row->locked_at, $row->locked_reason, $row->activated);

            if ($row->locked == 0 && $row->activated == 1 || $allow_locked === true) {
                $login_attempts = $row->failed_logins;

                $user_password = $row->password;
                $user_salt = $row->salt;

                if (hash("sha256", $user_salt . APP_SALT_SEPERATOR . $password) == $user_password) {
                    $error = "";
                    $data = [
                        E_SESSION_ITEM::SESSION_ID => session_id(),
						E_SESSION_ITEM::IS_ROOT => ($row->client_id == $this->config->root_client_id ? true:false ),
						E_SESSION_ITEM::JS_ENABLED => $_SESSION[E_SESSION_ITEM::JS_ENABLED],
						E_SESSION_ITEM::LOGGED_IN => true,
						E_SESSION_ITEM::LOGGED_IN_AT => time(),
							
						E_SESSION_ITEM::CLIENT_ID => $row->client_id,
						E_SESSION_ITEM::CLIENT_CUSTOMER_NUMBER => $row->customer_number,
						E_SESSION_ITEM::CLIENT_NAME => $row->client_name,
						E_SESSION_ITEM::CLIENT_DESC => $row->client_desc,
						E_SESSION_ITEM::CLIENT_EMAIL => $row->client_email,
						E_SESSION_ITEM::CLIENT_FAX => $row->client_fax,
						E_SESSION_ITEM::CLIENT_PHONE => $row->client_phone,
						E_SESSION_ITEM::CLIENT_STREET => $row->client_street,
						E_SESSION_ITEM::CLIENT_HOUSE_NR => $row->client_house_nr,
						E_SESSION_ITEM::CLIENT_ZIPCODE => $row->client_zipcode,
						E_SESSION_ITEM::CLIENT_LOCATION => $row->client_location,
						E_SESSION_ITEM::CLIENT_COUNTRY => $row->country,
						E_SESSION_ITEM::CLIENT_LOGO => $row->client_logo,
						E_SESSION_ITEM::CLIENT_CREATED_AT => $row->client_created_at,
							
						E_SESSION_ITEM::USER_ID => $row->user_id,
						E_SESSION_ITEM::USERNAME => $row->username,
						E_SESSION_ITEM::USER_EMAIL => $row->email,
						E_SESSION_ITEM::USER_PHONE => $row->phone,
						E_SESSION_ITEM::USER_FIRSTNAME => $row->firstname,
						E_SESSION_ITEM::USER_LASTNAME => $row->lastname,
						E_SESSION_ITEM::USER_STREET => $row->street,
						E_SESSION_ITEM::USER_HOUSE_NUMBER => $row->house_number,
						E_SESSION_ITEM::USER_ZIPCODE => $row->zipcode,
						E_SESSION_ITEM::USER_LOCATION => $row->location,
						E_SESSION_ITEM::USER_COUNTRY => $row->country,
						E_SESSION_ITEM::USER_LANGUAGE => $row->language,
						E_SESSION_ITEM::USER_SCANAGENT_CLIENT => $row->scanagent_computer_id,
						E_SESSION_ITEM::USER_TEAM => $row->team_id,
						E_SESSION_ITEM::CREATED_AT => $row->user_created_at,
						E_SESSION_ITEM::LAST_LOGIN => $row->last_login,

						E_SESSION_ITEM::USER_PERMISSIONS => array(),
						E_SESSION_ITEM::USER_MENU => array(),
                    ];

					

                    $permissions = self::loadPermissions($row->client_id, $row->user_id);
                    if ($permissions->getError() == "") {
                        $data[E_SESSION_ITEM::USER_PERMISSIONS] = $permissions->getData();
                    }

                    $menu = self::loadMenu($row->client_id, $row->user_id, $permissions->getData());
                    if ($menu->getError() == "") {
                        $data[E_SESSION_ITEM::USER_MENU] = $menu->getData();
                    }

                    // ... (add other data processing here)
                } else { // Handle wrong password...
					
                    if ((1 + $login_attempts) >= $this->config->login_attempts_till_lock) {

                        // Lock the user
                        $result = $this->BASE_Update(TBL_USER, ["locked" => 1, "locked_at" => time(), "locked_by" => "SYSTEM", "locked_reason" => E_SYSTEM_LOCK_REASONS::TOO_MANY_LOGIN_FAILS], ["user_id" => $row->user_id]);

                        if ($result->getError() != "") {
                            log_message(E_LOGLEVEL::ERROR, " - error lock user " . $row->user_id . ":\n" . $result->getError());
                            // $error = $result->getError();
                        }

                        //$error = sprintf(lang("msg_user_locked"), format_timestamp2datetime( time() ) )." #1";
                        $error = lang("msg_user_has_been_locked");

                        if (self::MINUTES_TO_ALLOW_LOCKED_USER_TO_LOGIN !== NULL) {
                            $error .= "<br>" . sprintf(lang("msg_you_can_retry_to_login_after_x_minutes"), self::MINUTES_TO_ALLOW_LOCKED_USER_TO_LOGIN);
                        }

                        $data = [];
                    } else {
                        // increase failed login attempts
                        $result = $this->BASE_Update(TBL_USER, ["failed_logins" => (1 + $login_attempts)], ["user_id" => $row->user_id]);

                        if ($result->getError() != "") {
                            log_message(E_LOGLEVEL::ERROR, " - error increase failed login counter " . $row->user_id . ":\n" . $result->getError());
                            // $error = $result->getError();
                        }

                        $error = lang("msg_user_wrong_password");
                        //$error = lang("msg_login_failed");
                        $data = [];
                    }
                }
            } else {
                if ($row->locked == 1) {
                    $error = sprintf(lang("msg_user_locked"), format_timestamp2datetime($row->locked_at)) . " ";
                    $data = [];
                } else if ($row->activated == 0) {
                    $error = sprintf(lang("msg_user_not_activated_yet"));
                    $data = [];
                }
            }
        }


        $result = new BASE_Result($data, $error, "", ($error == '' ? E_STATUS_CODE::SUCCESS : E_STATUS_CODE::ERROR));

        write2Debugfile(self::DEBUG_FILENAME, "auth result error[$error] " . print_r($result, true));

        return $result;
	}
	
	/**
	 * creates a new user entry and stores it's assigned roles and entities.
	 * Uses transactions
	 *
	 * @version 1.0
	 *
	 * @param string $client_id	>> client identifier
	 * @param array $data		>> user data
	 * @param array $roles		>> user assigned roles
	 * @param array $entities	>> user assigned entities
	 *
	 * @return BASE_Result
	 */
	function create($client_id, $data, $roles, $entities=null)
	{
		write2Debugfile(self::DEBUG_FILENAME, "client_id[".$client_id."] create user-".print_r($data, true));
	
		$data["client_id"] = $client_id;
	
		if ($data["user_id"] == ""){
			$data["user_id"] 	= BASE_Model::generateUID(TBL_USER, "user_id", "", false, 25);
		}
	
		$address = array(
			"client_id"=>$data["client_id"] ,
			"user_id"=>$data["user_id"],
			"firstname"=>$data["firstname"],
			"lastname"=>$data["lastname"],
			"country"=>$data["country"],
		);
	
		$queries = array(
			$this->getInsertString(TBL_USER, $data)
		);
	
		if (is_array($roles) && count($roles) > 0)
		{
			foreach ($roles as $index=>$role_id)
			{
				$queries[] = $this->getInsertString(TBL_USER_ROLES,
					array(
						"client_id"=>$client_id,
						"user_id"=>$data["user_id"],
						"role_id"=>$role_id
					)
				);
			}
		}
		
		$return = $this->BASE_Transaction($queries);
		
		write2Debugfile(self::DEBUG_FILENAME, count($queries)." queries -\n".implode("\n", $queries)."\nreturn-".print_r($return, true));
		return $return;
	}
	
	/**
	 * load all users for a given client ID, utilizing the datatables library
	 *
	 * @param string $client_id		>> client identifier
	 * @param array $columns		>> array with the views column definition
	 * @param bool $btnEdit 		>> add edit button
	 * @param bool $btnDel 			>> add delete button
	 * @param bool $includeDeleted	>> show deleted entries
	 *
	 * @return BASE_Result >> containing an array or null
	 */
	// function datatable($client_id, $user_id, $columns, $btnEdit=false, $btnDel=false, $includeDeleted=false)
	// {
	// 	write2Debugfile(self::DEBUG_FILENAME, "\ndatatable\n\n");
		
	// 	$this->load->library('Datatables');
	// 	$this->load->helper('datatable');
	
	// 	$fields = prepare_fields($columns, array_merge($this->listFields(TBL_USER), $this->listFields(TBL_TEAMS)), array() );

			
	// 	$this->datatables->select(TBL_USER.".user_id, activated,activated_at, ".$fields );
	// 	$this->datatables->from(TBL_USER);
	// 	$this->datatables->where(TBL_USER.".client_id", $client_id);

	// 	$this->datatables->join(TBL_TEAMS,
	// 		TBL_TEAMS.'.client_id = '.$client_id.' AND '.
	// 		TBL_TEAMS.'.team_id = '.TBL_USER.'.team_id ',
	// 		'left');	// @todo should be a inner join since team is now a required field for users
		
		
	// 	$this->datatables->edit_column('control_col', '$1', "callback_build_buttons(user_id, '', admin, users, $btnEdit, $btnDel, 0, 0, 1)");
	// 	$this->datatables->edit_column('locked', '$1' , 'callback_locked(user_id,locked)');
	// 	$this->datatables->edit_column('activated', '$1' , 'callback_activated(user_id,activated,activated_at)');
	// 	$this->datatables->edit_column('deleted', '$1' , 'callback_deleted(user_id, deleted) ');
	// 	$this->datatables->edit_column('last_login', '$1' , 'format_timestamp2datetime(last_login) ');
	// 	$this->datatables->edit_column('created_at', '$1' , 'format_timestamp2datetime(created_at) ');
		
	
	// 	if ($includeDeleted === false){
	// 		$this->datatables->where(TBL_USER.".deleted", "0");
	// 	}
	
	// 	$result 		= $this->datatables->generate();
	// 	$result_json 	= json_decode($result);
	
	// 	write2Debugfile(self::DEBUG_FILENAME, "\n".print_r($this->db->queries, true)."\n\n".print_r(json_decode($result), true));
	// 	return new BASE_Result($result, "", json_decode($result), E_STATUS_CODE::SUCCESS);
	// }

	function datatable($client_id, $user_id, $columns, $btnEdit=false, $btnDel=false, $includeDeleted=false)
	{
		$builder = $this->db->table($this->table);
		
		$getFields = $this->getFieldNames($this->table);
		$teamsFields= $this->getFieldNames(TBL_TEAMS);
		$allFields = array_merge($getFields, $teamsFields);
		$fields = prepare_fields($columns, $allFields,array());
		
		// $fields = prepare_fields($columns, array_merge($getFields, $teamsFields), array() );
	
		$builder->select(TBL_USER . ".user_id, activated, activated_at, " . $fields);
		$builder->where(TBL_USER . ".client_id", $client_id);
		$builder->where('deleted', 0);
		$builder->join(TBL_TEAMS, TBL_TEAMS . '.client_id = ' . $client_id . ' AND ' . TBL_TEAMS . '.team_id = ' . TBL_USER . '.team_id', 'left');

		$query = $builder->get();
        $roles = $query->getResult('array');

        $result = [];

		foreach ($roles as $row) {
			// print_r($row);
            $row['control_col'] = callback_build_buttons($row['user_id'], '', 'admin', 'users', $btnEdit, $btnDel, 0, 0, 1);
	        $row['locked'] = callback_locked($row['user_id'], $row['locked']);
	        $row['activated'] = callback_activated($row['user_id'], $row['activated'], $row['activated_at']);
	        // $row['deleted'] = callback_deleted($row['user_id'], $row['deleted']);
	        $row['last_login'] = format_timestamp2datetime($row['last_login']);
	        // $row['created_at'] = format_timestamp2datetime($row['created_at']);


            $result[] = $row;
			
        }
		// print_r( $result);die;
		return new BASE_Result($result, "", $result, E_STATUS_CODE::SUCCESS);

	}
	
	/**
	 * Load data for a given user ID
	 *
	 * @version 1.0
	 * @param string $client_id
	 * @param string $user_id
	 * @param bool $includeDeleted
	 *
	 * @return BASE_Result >> containing the userdata or null
	 */
	function load($client_id, $user_id=null, $includeDeleted=false)
	{
		$fields = array("client_id", "user_id", "team_id", "username", "email", "phone", "firstname", "lastname", "street", "house_number", "zipcode",
			"location", "country", "language", "scanagent_computer_id", "created_at", "locked", "locked_at", "locked_by", "deleted", "deleted_at", "deleted_by", "activated", "activated_at",
			"failed_logins", "last_login","employee_id"
		);
		
		$where = array(
			"client_id"=>$client_id
		);
	
		if ($user_id != null){
			$where["user_id"] = $user_id;
		}
		if ($includeDeleted === false){
			$where["deleted"] = "0";
		}
	
		$return = $this->BASE_Select(TBL_USER, $where, $fields, array(), ($user_id != null ? "1":""));
		write2Debugfile(self::DEBUG_FILENAME, "load client_id[$client_id] user_id[$user_id]\n".$this->lastQuery()."\n".print_r($return->data, true) );
		return $return;
	}
	
	/**
	 * load menu entries for the user and creates an assoc array to build the menu/sidemenu
	 *
	 * @param string $cient_id		>> client identifier
	 * @param string $user_id		>> user identifier
	 * @param array $permissions 	>> users permissions
	 *
	 * @return BASE_Result
	 */
	function loadMenu($client_id, $user_id, $permissions=null)
	{
		if ($permissions == null) {
            $permissions = $this->loadPermissions($client_id, $user_id);
            if ($permissions->getError() != "") {
                return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
            }

            $permission = $permissions->getData();
        }


        $query = $this->db->table(TBL_APP_MENU)
            ->select('*')
            ->where("is_visible = '1' AND (right_id IS NULL OR right_id IN ('" . implode("', '", array_keys((array)$permissions)) . "'))")
            ->orderBy("menu_id_parent ASC, sort_order ASC")
            ->get();

        if (!$query) {
            return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
        }

        $data_obj = $query->getResultObject();
        $menu_array = [];
        $activeFound = false;

        foreach ($data_obj as $key => $value) {
            $value->items = []; // create a new entry
            $value->active = "";
            if (service('request')->uri->getPath() == $value->menu_ref && $activeFound == false) {
                $value->active = "active";
                $activeFound = true;
            }

            if ($value->menu_id_parent == null) {
                if (!array_key_exists($value->menu_id, $menu_array)) {
                    $menu_array[$value->menu_id] = [];
                    $menu_array[$value->menu_id]["items"] = [];
                }
                $menu_array[$value->menu_id]["menu_id"] = $value->menu_id;
                $menu_array[$value->menu_id]["menu_label"] = $value->menu_label;
                $menu_array[$value->menu_id]["menu_icon"] = $value->menu_icon;
                $menu_array[$value->menu_id]["menu_ref"] = $value->menu_ref;
                $menu_array[$value->menu_id]["right_id"] = $value->right_id;
                $menu_array[$value->menu_id]["active"] = $value->active;
            } else {
                if (!array_key_exists($value->menu_id_parent, $menu_array)) {
                    $menu_array[$value->menu_id_parent] = [];
                    $menu_array[$value->menu_id_parent]["items"] = [];
                }
                $menu_array[$value->menu_id_parent]["items"][] = $value;
                $menu_array[$value->menu_id_parent]["active"] = $value->active;
            }
        }

        $return = new BASE_Result($menu_array, $this->generateErrorMessage(), null, E_STATUS_CODE::SUCCESS);

        write2Debugfile(self::DEBUG_FILENAME, "loadMenu\n" . $this->db->getLastQuery() . "\nreturn-" . print_r($return, true) . "\n\n");
        return $return;
	
	}
	
	/**
	 * Load the password history for the specified user
	 * 
	 * @author Marco Eberhardt
	 * @version 1.0
	 * 
	 * @param string $user_id
	 * @return BASE_Result
	 */
	function load_password_history($user_id)
	{
		$this->db
		->select(
			TBL_USER_PW_HISTORY.".user_id, ".
			TBL_USER_PW_HISTORY.".password, ".
			TBL_USER_PW_HISTORY.".created_at")
		->from(TBL_USER_PW_HISTORY)
		->where("user_id", $user_id);
			
		$query = $this->db->get();
		
		if (! $query){
			return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
		}
		
		$history = array();
		foreach ($query->result_array() as $value) {
			/* 
			$value["password"] = decrypt_string($value["password"]);
			$history[] = $value;
			 * 
			 */
			$history[] = decrypt_string($value["password"]);
		}
			
		//write2Debugfile("load_password_history.log", $this->lastQuery());
		return new BASE_Result($history, $this->generateErrorMessage(), null, E_STATUS_CODE::SUCCESS);
	}
	
	/**
	 * Load the password blacklist.
	 * The blacklist includes also personal values from the user (username, address, mail) 
	 * 
	 * @author Marco Eberhardt
	 * @version 1.0
	 * 
	 * @param string $user_id
	 * @return BASE_Result
	 */
	function load_password_blacklist($user_id)
	{
		$result_blacklist 	= $this->BASE_Select(TBL_APP_PW_BLACKLIST)->data;
		$result_user		= $this->BASE_Select(TBL_USER, array("user_id"=>$user_id), array("username", "email", "firstname", "lastname", "street", "zipcode", "location"), array(), 1)->data;
		
		$blacklist 			= array_remap($result_blacklist, "entry_id", "blacklisted");
		foreach ((array)$result_user as $value) 
		{
			if (strlen($value) >= 4){	// We simply cannot add short words or single chars to the blacklist. otherwise the policy will reject nearly everything
				$blacklist[] = $value;
			}
		}
		return new BASE_Result($blacklist, $this->generateErrorMessage(), null, E_STATUS_CODE::SUCCESS);
	}
	
	/**
	 * Retrieve user permissions as assoc array
	 * 
	 * @param string $client_id >> client identifier
	 * @param string $user_id	>> user identifier
	 * 
	 * @return BASE_Result
	 */
	function loadPermissions($client_id, $user_id)
	{
		$return = new BASE_Result();

		$fields = [
            TBL_ROLES_RIGHTS . ".role_id",
            TBL_ROLES_RIGHTS . ".right_id",
            TBL_RIGHTS . ".right_name",
            TBL_RIGHTS . ".right_desc",
            TBL_RIGHTS . ".active"
        ];

        if ($client_id != "" && $user_id != "") {

            $builder = $this->db->table(TBL_USER_ROLES)
                ->select(implode(", ", $fields))
                ->join(TBL_ROLES_RIGHTS, TBL_ROLES_RIGHTS . '.client_id = ' . $client_id . ' AND ' .
                        TBL_ROLES_RIGHTS . '.role_id = ' . TBL_USER_ROLES . '.role_id ', 'inner')
                ->join(TBL_RIGHTS, TBL_RIGHTS . '.client_id = ' . $client_id . ' AND ' .
                        TBL_RIGHTS . '.right_id = ' . TBL_ROLES_RIGHTS . '.right_id AND ' .
                        TBL_RIGHTS . '.active = 1 ', 'inner')
                ->join(TBL_ROLES, TBL_ROLES . '.client_id = ' . $client_id . ' AND ' .
                        TBL_ROLES . '.role_id = ' . TBL_USER_ROLES . '.role_id AND ' .
                        TBL_ROLES . '.deleted = 0 ', 'inner')
                ->where(TBL_USER_ROLES . '.user_id', $user_id)
                ->groupBy(implode(", ", $fields));

            $query = $builder->get();

            if (!$query) {
                return new BASE_Result(null, $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
            }

            $numRows = $query->getNumRows();
            $dataObj = $query->getResultObject();
            $data = [];

            // Add virtual permission "is_root" to identify root user
            if ($client_id == $this->config->root_client_id) {
                $data[E_PERMISSIONS::IS_ROOT] = (object) [
                    "role_id" => "none",
                    "right_id" => "is_virtual_permission",
                    "right_name" => "root_user",
                    "active" => 1
                ];
            }

            foreach ($dataObj as $value) {
                $data[$value->right_id] = $value;
            }


			$lastQuery = $this->db->getLastQuery();
            $return = new BASE_Result($data, $this->generateErrorMessage(), null, E_STATUS_CODE::SUCCESS);
            write2Debugfile(self::DEBUG_FILENAME, "loadPermissions\n" . $lastQuery . "\n" . print_r($return, true));
        }

        return $return;
	}
	
	/**
	 * load user assigned roles
	 * 
	 * @param string $client_id		>> 
	 * @param string $user_id		>>
	 * @param bool $incPermissions	>> including permissions 
	 * @return BASE_Result
	 */
	function loadRoles($client_id, $user_id, $incPermissions=false)
	{
		$where 	= array(
			"client_id"=>$client_id,
			"user_id"=>$user_id
		);
		$result = $this->BASE_Select(TBL_USER_ROLES, $where, "role_id", array(), "", "", false, true);
		
		
		$return = array();
		
		$this->db->select("role_id")->from(TBL_USER_ROLES)->where("client_id", $client_id)->where("user_id", $user_id);
		
		$query = $this->db->get();
		if (! $query){
			return new BASE_Result(array(), $this->generateErrorMessage(), null, E_STATUS_CODE::DB_ERROR);
		}
		
		foreach ($query->result_array() as $key => $value) {
			$return[] = $value["role_id"];
		}
		
		if ($incPermissions === true)
		{
		}
		write2Debugfile(self::DEBUG_FILENAME, "loadRoles\n".$this->lastQuery()."\n".print_r($return, true));
		return new BASE_Result($return, "", array(), E_STATUS_CODE::SUCCESS);
	}
	
	/**
	 * update existing userdata, assigned roles 
	 * @version 1.0
	 *
	 * @param string $client_id
	 * @param string $user_id
	 * @param array $data
	 * @param array $roles
	 *
	 * @return BASE_Result
	 */
	
	
	/**
	 * Set user account activated
	 *
	 * @param string $user_id 		>> User identifier
	 * @param int $activation_state	>> 0 or 1
	 *
	 * @return BASE_Result 			>> contains the userdata-array on success
	 *
	 */
	function update_activation_state($user_id, $activation_state)
	{
		return $this->BASE_Update(TBL_USER, array("activated"=>$activation_state), array("user_id"=>$user_id));
	}
	
	/**
	 * Delete (set deleted flag) a user and all its related data
	 *
	 * @version 1.0
	 *
	 * @param string $client_id
	 * @param string $user_id
	 * @param string $deleted_by
	 *
	 * @return BASE_Result
	 */
	function remove($client_id, $user_id, $deleted_by)
	{
		$data = array(
			"deleted" => 1,
			"deleted_by" => $deleted_by,
			"deleted_at" => time()
		);
		$return = $this->BASE_Update(TBL_USER, $data, array("client_id"=>$client_id, "user_id"=>$user_id));
	
		write2Debugfile(self::DEBUG_FILENAME, "\ndelete user\n".print_r($return, true));
		return $return;
	}
	
	/**
	 * Here is the place for actions after successfull login.
	 * - Save the new last login timestamp and reset the counter for failed logins
	 * 
	 * @access private >> called by ::authenticate()-method
	 *
	 * @param string $user_id
	 * @return void
	 */
	private function post_login_actions($user_id)
	{
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: Save the new last login timestamp and reset the counter for failed logins
		$result = $this->BASE_Update(TBL_USER, array("last_login"=>time(), "failed_logins"=>0, "locked"=>0, "locked_at"=>NULL, "locked_by"=>NULL, "locked_reason"=>NULL), array("user_id"=>$user_id));
		if ($result->getError() != ""){
			log_message(E_LOGLEVEL::ERROR, " - error while saving last login time for user [".$user_id."]\n".$result->getError());
		}
	}
} // End of Class

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Place your very custom callback functions here.
// ..:: You can find common callbacks in the datatable_helper, so have a look there first
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

