<?php

namespace App\Controllers\admin;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\core\BASE_Controller;
use App\core\BASE_Enum;
use App\core\BASE_Permission;
use App\core\BASE_Model;
use App\core\BASE_Result;
use App\Enums\EnumCollection ;
use App\Enums\E_STATUS_CODE , App\Enums\E_PLUGINS_JS ,App\Enums\E_RENDERMODE,App\Enums\E_PERMISSIONS, App\Enums\E_PLUGIN,App\Enums\E_ENABLED,
App\Enums\T_Pseudo , App\Enums\E_SESSION_ITEM;
// use App\Libraries\value_objects\T_Role;
use App\Libraries\value_objects\T_User;
use CodeIgniter\Validation\Rules;

class Users extends BASE_Controller 
{
	const DEBUG_FILENAME = "users.log";
	
	/**
	 * array containing all available roles
	 * @var array
	 */
	private $permissions					= array();
	private $available_roles 		= null;
	
	/**
	 * array containing all available countries
	 * @var array
	 */
	private $available_countries	= null;
	
	/**
	 * @var array
	 */
	private $available_teams 	= array();
	protected $role_model;
	protected $client_model;
	protected $user_model;
	/**
	 * Constructor for the users controller
	 */
	public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger )
    {
		parent::initController($request, $response, $logger);
		
		$this->role_model = model('App\Models\Role_model');
		$this->client_model = model('App\Models\Client_model');
		$this->user_model = model('App\Models\User_model');
		helper('html_helper');

		$this->permissions = array(
			"list" 		=> $this->hasPermission(E_PERMISSIONS::USER_LIST),
			"create" 	=> $this->hasPermission(E_PERMISSIONS::USER_CREATE),
			"edit" 		=> $this->hasPermission(E_PERMISSIONS::USER_EDIT),
			"delete" 	=> $this->hasPermission(E_PERMISSIONS::USER_DELETE),
			"export"	=> $this->hasPermission(E_PERMISSIONS::USER_EXPORT)
		);

		$validation = \Config\Services::validation();
    	$this->javascript		= array("users.js");
    	$this->hasBreadcrump 	= true;
    	
    	 
		$this->available_roles 		= $this->role_model->load($this->client_id)->data;;
		$this->available_countries	= $this->app_model->getCountries($this->loaded_language)->data;	// db-cache is on for this one
		// echo "<pre>";print_r($this->available_countries);die;
		$this->available_teams		= $this->app_model->BASE_Select(TBL_TEAMS, array("client_id" => $this->client_id), "*", null,null,null,null,true)->data;
		
		
		write2Debugfile(self::DEBUG_FILENAME, "admin/users\n", false);
	}
	
	/**
	 * default entry point. leads to the show method
	 */
	public function index() {
		self::show();
	}
	
	/**
	 * Delete a user. 
	 *
	 * @version 1.0
	 *
	 * @param string $user_id >> user, you want to delete
	 * @param bool $confirmed >> if true, the user has confirmed this action
	 * @param E_RENDERMODE $rendermode
	 *
	 * @return bool >> return true if the user has been removed
	 */
	public function remove($user_id="", $confirmed=0, $rendermode="FULLPAGE")
	{
		if ($this->request->getPost("user_id") != "" && $user_id == ""){
			$user_id = $this->request->getPost("user_id");
		}
		if ($this->request->getPost("confirmed") == true && $confirmed == 0){
			$confirmed = 1;
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode")))){
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
	
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($user_id == null || $user_id == "")
		{
			$this->render('errors/error_invalid_parameter', $rendermode);
			return;
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result 		= new BASE_Result(false);	// action needs confirmation first
		$removed		= false;
		$result_user	= $this->user_model->load( $this->client_id, $user_id );
	
		if ($user_id == $this->getSessionData(E_SESSION_ITEM::USER_ID))
		{
			$result = new BASE_Result(false, lang("msg_cant_delete_own_user"));
		}
		else 
		{
			write2Debugfile(self::DEBUG_FILENAME, "remove user [$user_id] user-".print_r($result_user, true), false);
			
			if ($result_user->data != null && $result_user->getError() == "")
			{
				$this->breadcrump = $result_user->data->username;
				
				if ($confirmed == 1){
					$result	= $this->user_model->remove($this->client_id, $user_id, $this->getSessionData(E_SESSION_ITEM::USER_ID));
					$result = new BASE_Result(true);
				}
			}
			else {
				write2Debugfile(self::DEBUG_FILENAME, "user[$user_id] NOT found", true);
				$this->breadcrump = lang("entry_not_found");
				$result = new BASE_Result(false, lang("msg_user_not_found"));
			}
		}
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
	
		if ($result->data == true && $result->error == "")
		{
			$removed = true;
			$this->setViewSuccess(lang("user_has_been_deleted"));
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);
		$this->setViewData("user", $result_user->data);
	
		$this->render('admin/user/user_delete', $rendermode);
		return $removed;
	}
	
	/**
	 * render the user_form to create new user
	 * @version 1.0
	 * 
	 * @param E_RENDERMODE $rendermode
	 */
	public function create($rendermode="FULLPAGE")
	{
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode")))){
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->breadcrump = "";
	
		if (is_array($this->request->getPost()) && $this->request->getPost("save") == 1 )
		{	// only if we have a post, we try to save
			// note that the save method overwrites the user-viewdata and user_roles-viewdata
			self::save(false);
		}
		else
		{
			$this->setViewData("user", array());
			$this->setViewData("user_roles", array() );
		}
	
		write2Debugfile(self::DEBUG_FILENAME, "create new user\n".print_r($this->data, true));
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->setViewData("available_countries", $this->available_countries);
		$this->setViewData("available_languages", $this->available_languages);
		$this->setViewData("available_roles", $this->available_roles );
		$this->setViewData("available_teams", $this->available_teams);
	
		$this->render('admin/user/user_form', $rendermode);
	}
	
	
	/**
	 * Ajax data-source for the datatable
	 * JSON-Rendermode
	 *
	 * @version 1.0
	 */
	// public function datatable()
	// {
	// 	$result = $this->user_model->datatable( $this->client_id, $this->user_id, T_User::get_table_columns(), $this->hasPermission(E_PERMISSIONS::USER_EDIT), $this->hasPermission(E_PERMISSIONS::USER_DELETE));
	// 	$result->data = json_decode($result->data);	// because the render method will encode it again
			
	// 	write2Debugfile(self::DEBUG_FILENAME, "\nuser datatable\n".print_r($result, true));
		
	// 	$this->setData($result);
	// 	$this->render(null, E_RENDERMODE::JSON_DATA);
	// }

	public function datatable(BASE_Result $result_download = null)
	{
		$edit = $this->hasPermission(E_PERMISSIONS::USER_EDIT);
		$delete = $this->hasPermission(E_PERMISSIONS::USER_DELETE);
		// print_r($this->table_columns);die;
		$result = $this->user_model->datatable($this->client_id, $this->user_id ,T_User::get_table_columns(), $edit, $delete);
		$result->data = json_decode($result->data); // because the render method will encode it again
		if (!is_null($result_download) )
		{
			if ($result_download->error == "" && $result_download->data != "")
			{
				$result->data->filename = $result_download->data;
				$result->data->do_download = 1;
			}
			else
			{
				$result->data->error = $result_download->error;
			}
		}

		write2Debugfile(self::DEBUG_FILENAME, "\nuser datatable\n".print_r($result, true));
		
		$this->setData($result);
	}	
	
	/**
	 * load user data, set view data and render user form
	 *
	 * @param string $user_id 			>> user identifier; can be passed by parameter and also in post
	 * @param E_RENDERMODE $rendermode 	>> render mode
	 */
	public function edit($user_id=null, $rendermode="FULLPAGE")
	{
		if ($this->request->getPost("user_id") != ""){
			$user_id = $this->request->getPost("user_id");
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode")))){
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
	
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($user_id == null || $user_id == "")
		{
			$this->render(E_ERROR_VIEW::INVALID_PARAMS, $rendermode);
			return;
		}
			
		write2Debugfile(self::DEBUG_FILENAME, "edit user client_id[".$this->client_id."] user_id[$user_id]", false);
	
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result_user 		= $this->user_model->load( $this->client_id, $user_id);
	
		if ($result_user->data != null && $result_user->getError() == "")
		{
			$this->breadcrump = $result_user->data->username;
			
			if (is_array($this->request->getPost()) && $this->request->getPost("save") == 1 )
			{	// if we have a post, we try to save
				// note that the save method sets the user-viewdata and user_roles-viewdata
				self::save(true, $result_user->data);
			}
			else
			{
				$user_roles = $this->user_model->loadRoles($this->client_id, $user_id);
	
				$this->setViewData("user_roles", $user_roles->data );
				$this->setViewData("user", $result_user->data );
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "user[$user_id] NOT found", true);
			$this->setViewError(lang("msg_entry_not_found"));
		}
	
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->setViewData("available_countries", $this->available_countries);
		$this->setViewData("available_languages", $this->available_languages);
		$this->setViewData("available_roles", $this->available_roles);
		$this->setViewData("available_teams", $this->available_teams);
		
		$this->render('admin/user/user_form', $rendermode);
	}
	
	/**
	 * saves a user after input validation and sets some viewdata
	 * Note: The permission check is made via validation callback
	 * 
	 * @access private
	 * @version 1.0
	 *
	 * @param bool $edit 	>> create or update action
	 * @return bool 		>> returns the saved state
	 */

	
	private function save($edit)
	{
		write2Debugfile(self::DEBUG_FILENAME, "\nsave user\npost-".print_r($this->request->getPost(), true), true);
		$saved	= false;
		// print_r($this->request->getPost());die();
		$validation = \Config\Services::validation();
		$validation = service('validation');
		$rules = [
			'role[]'		=> 'required|min_length[1]',
			'employee_id'	=> 'trim',
			'email'			=> 'trim|required|valid_email|max_length[255]',
			'firstname'		=> 'trim|required|min_length[1]|max_length[255]',
			'lastname'		=> 'trim|required|min_length[1]|max_length[255]',
			'street'		=> 'trim|required|max_length[255]',
			'house_nr'		=>'trim|max_length[8]',
			'zipcode'		=> 'trim|max_length[20]',
			'location'		=> 'trim|max_length[255]',
			'phone' 		=> 'trim|max_length[100]',
			// 'country' 		=> 'required|exact_length[2]|validate_existance['.TBL_COUNTRIES.', country_code, '.lang('unknown_country').']',
			// 'locale'		=> 'required|exact_length[2]|validate_existance['.TBL_LOCALES.', locale_code, '.lang("unknown_locale").']',
			'locked'		=> 'max_length[1]',
		];
		$validation->setRules($rules);
		// 'username'	=>	 'required|min_length[3]|max_length[50]|validate_is_unique['.$this->request->getPost("username_orig").','.TBL_USER.',username,'.lang("user_already_exist").']',
		
			
		//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$locked_at = $this->request->getPost("locked_at");
		if ($this->request->getPost("locked") == 1 && $this->request->getPost("locked_at") == ""){
			$locked_at = time();
		}
			
		$locked_by = $this->request->getPost("locked_by");
		if ($this->request->getPost("locked") == "1" && $this->request->getPost("locked_by") == ""){
			$locked_by = $this->getSessionData(E_SESSION_ITEM::USER_ID);
		}
			
		$deleted_at = $this->request->getPost("deleted_at");
		if ($this->request->getPost("deleted") == "1" && $this->request->getPost("deleted_at") == ""){
			$deleted_at = time();
		}
			
		$deleted_by = $this->request->getPost("deleted_by");
		if ($this->request->getPost("deleted") == "1" && $this->request->getPost("deleted_by") == ""){
			$deleted_by = $this->getSessionData(E_SESSION_ITEM::USER_ID);
		}
		
		// // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($this->request->getPost("user_id") == ""){
			$user_id = BASE_Model::generateUID(TBL_USER, "user_id", "", false, 20);
		}else{
			$user_id = $this->request->getPost("user_id");
		}
		
		$data = array(
			"client_id" => $this->client_id,
			"user_id" => $user_id,
			"username" => $this->request->getPost("username"),
			"employee_id" => $this->request->getPost("employee_id"),
			"email" => $this->request->getPost("email"),
			"phone" => $this->request->getPost("phone"),
			"firstname" => $this->request->getPost("firstname"),
			"lastname" => $this->request->getPost("lastname"),
			"team_id"=> $this->request->getPost("team"),
			"street" => $this->request->getPost("street"),
			"house_number" => $this->request->getPost("house_nr"),
			"zipcode" => $this->request->getPost("zipcode"),
			"location" => $this->request->getPost("location"),
			
			"country" => $this->request->getPost("country"),
			"language" => $this->request->getPost("locale"),
			"scanagent_computer_id" => $this->request->getPost("scanagent_computer_id"),
			
			"locked" => ($this->request->getPost("locked") == "1" ? 1:0),
			"locked_at" => $locked_at,
			"locked_by" => $locked_by,
			"deleted" => ($this->request->getPost("deleted") == "1" ? 1:0),
			"deleted_at" => $deleted_at,
			"deleted_by" => $deleted_by
		);
		// print_r($data);die();
		if ($this->request->getPost("created_at") == "" && $edit == false)
		{
			$data["activated"]		= 0;
			$data["created_at"] 	= time();
		}
			
		if ($this->request->getPost("password") != ""){
			$data["password"] = $this->request->getPost("password");
		}
			
		// // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		/* if($validation->run($this->request->getPost()))
		{
			echo "hi";die; */
			write2Debugfile(self::DEBUG_FILENAME, "\n - form validation passed...", true);
			write2Debugfile(self::DEBUG_FILENAME, "data-".print_r($data, true)."\nFILES-".print_r($_FILES, true), true);
	
			if ($edit == true){
				$result = $this->user_model->Update($this->client_id, $user_id, $data, $this->request->getPost("role"));
			}
			else
			{
				$password_plain 	= $this->config->default_password;
				$data["user_id"] 	= $user_id;
				$data["salt"]		= BASE_Model::generateUID(TBL_USER, "salt", "", false, 8);
				$data["password"] 	= hash("sha256", $data["salt"] . APP_SALT_SEPERATOR . $password_plain);
				$result = $this->user_model->create($this->client_id, $data, $this->request->getPost("role") );
				// print_r($result);die;
				// $data["password"] 	= $this->request->getPost("password"); // reset to plain text value
	
				/* if ($result->error != ""){
					$data["user_id"] = "";
				}
				else{
					$result_mail = $this->sendmail_account_activation($this->client_id, $user_id);
				} */
			}
		/* }
		else
		{
			echo "hello";die;

			$result = new BASE_Result(null, $validation->getError(), $validation->getErrors(), E_STATUS_CODE::ERROR);
			// $result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
			// write2Debugfile(self::DEBUG_FILENAME, "\n - form validation failed...\n".validation_errors(), true);
		} */
			
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		if ($result->error == "")
		{
			$this->setViewSuccess(lang("user_has_been_saved"));
			
			if (isset($result_mail) && $result_mail->data == true)
			{
				$this->setViewSuccess(lang("user_has_been_saved_and_activation_mail_has_sent"));
			}
			
			$saved = true;
		}
		
		
		$this->setViewData("user", $data);
		$this->setViewData("user_roles", $this->request->getPost("role"));
		$this->setViewData("saved", $saved);
			
		write2Debugfile(self::DEBUG_FILENAME, "\nthis->data\n".print_r($this->data, true));
			
	
		if ($this->getSessionData(E_SESSION_ITEM::USER_ID) == $user_id)
		{
			// @todo update session data, if the own user has been edited
			
			$this->setSessionItem(E_SESSION_ITEM::USER_TEAM, $data["team_id"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_EMAIL, $data["email"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_PHONE, $data["phone"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_FIRSTNAME, $data["firstname"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_LASTNAME, $data["lastname"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_STREET, $data["street"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_HOUSE_NUMBER, $data["house_number"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_ZIPCODE, $data["zipcode"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_LOCATION, $data["location"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_COUNTRY, $data["country"]);
			$this->setSessionItem(E_SESSION_ITEM::USER_LANGUAGE, $data["language"]);
			
			
		}
		return $saved;
	}
	
	public function sendmail_account_activation($client_id, $user_id)
	{
		$this->load->model("client_model");
		
		$result_user 	= $this->user_model->load($client_id, $user_id, true)->data;
		$result_client 	= $this->client_model->load($client_id)->data[0];
		
		$message_sent = false;
		if ($result_user->deleted == 1 || $result_user->locked == 1)
		{
			return new BASE_Result(false, "user is locked or deleted. no mail has been sent");
		}
		else{
			$this->load->library("BASE_Links");
			$this->load->library("BASE_Mailer");
			
			$mailer = new BASE_Mailer();
			$mailer->setLanguage($result_user->language);
			
			$valid_till = time() + (30 * 60);
			$target		= "admin/activate/user/";
			$link_id 	= BASE_Links::generateLink($user_id, $target, array("user_id"=>$user_id, "client_id"=>$client_id), $valid_till);
			$link 		= new HTML_Anchor("activation", lang("activate"), base_url($target.$link_id));
			
			$data = array(
				"verification_link"=>$link->generateHTML(),
				"link_valid_time"=> "30 ".lang("minutes"),
				"portal_url"=>base_url(),
				"client_mail_footer"=>"",
				"client_name"=>$result_client->client_name,
				"client_email"=>$result_client->client_email,
				"client_street"=>$result_client->client_street,
				"client_zipcode"=>$result_client->client_zipcode,
				"client_location"=>$result_client->client_location,
				"client_phone"=>($result_client->client_phone != "" ? lang("phone_short")." ".$result_client->client_phone : "")
			);
			//write2Debugfile('sendmail_account_activation.log',"data".print_r($data,true), true);
			$message_sent = $mailer->send_emailFromTemplate(E_MAIL_TEMPLATES::ACCOUNT_ACTIVATION, $result_user->email, $data, array());
		}
		
		return new BASE_Result($message_sent);
	}
	
	/**
	 * Render the user list
	 * @version 1.0
	 * 
	 * @param E_RENDERMODE $rendermode
	 */
	public function show($rendermode="FULLPAGE")
	{
		$data 			= array();
		if ($this->getSessionData(E_SESSION_ITEM::JS_ENABLED) == E_ENABLED::NO)
		{
			// load table data immediatly since the ajax way will not work without js
			$edit			= $this->hasPermission(E_PERMISSIONS::USER_EDIT);
			$delete			= $this->hasPermission(E_PERMISSIONS::USER_DELETE);

			$modelResult 	= $this->user_model->datatable( $this->client_id, $this->user_id, T_User::get_table_columns(), $edit, $delete);
			$data 			= $modelResult->data;
		}
		
		$this->setViewData("table_data", $data);
		$this->setViewData("table_columns", T_User::get_table_columns() );
		$this->render('admin/user/user_list', $rendermode);
	}
	
	/**
	 * Unlock a user
	 * JSON-Rendermode 
	 * 
	 * @author Marco Eberhardt
	 * @version 1.0
	 *
	 */
	public function unlock()
	{
		$data = array(
			"locked"=>0,
			"locked_at" => null,
			"locked_by" => null,
			"locked_reason" => null
		);
		$result = $this->user_model->update($this->client_id, $this->request->getPost("user_id", true), $data);
		
		$this->setData($result);
		$this->render('admin/user/user_list', E_RENDERMODE::JSON);
	}
	
	public function sendActivationEmailAgain($user_id="", $rendermode="FULLPAGE")
	{
		$client_id = $this->client_id; 
		
		if ($this->request->getPost("user_id") != "" && $user_id == "")
		{
			$user_id = $this->request->getPost("user_id");
		}
		
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode"))))
		{
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
		
		if ($user_id == null || $user_id == "")
		{
			$this->render('errors/error_invalid_parameter', $rendermode);
			return;
		}
		//...:::::::::::::::::::::::::::::::::::::::::::::::::::::::::................
		$send = false;

		$result_user	= $this->user_model->load( $client_id, $user_id );

		if ($result_user->data != null && $result_user->getError() == "")
		{
			$data = array();
			$data["salt"]			= BASE_Model::generateUID(TBL_USER, "salt", "", false, 8);
			$data["password"] 		= hash("sha256", $data["salt"] . APP_SALT_SEPERATOR . $data["password"]);
			$data["activated"]		= 0;
			$data["activated_at"]	= NULL;

			$where = array("client_id"=>$client_id, "user_id"=>$user_id);


			$result = $this->user_model->BASE_Update(TBL_USER,$data, $where);
			if ($result->error == "")
			{
				$result_mail = $this->sendmail_account_activation($client_id, $user_id);
			}
		}
		else
		{
			$result = new BASE_Result(false, lang("msg_user_not_found"));	
		}

			//write2Debugfile('sendActivationEmailAgain.log',"GGGG".print_r($result_mail,true), true);
		// ALLES DURCH
		$this->setData($result);

		if (isset($result_mail) && $result_mail->data == true)
		{
			$send = true;
			$this->setViewSuccess(lang("activation_mail_has_been_sent"));
		}
		$this->setViewData("activation_send", $send);
		$this->setViewData("user", $result_user->data);

		$this->render('admin/user/user_form', $rendermode);

		return $send;

	}
}