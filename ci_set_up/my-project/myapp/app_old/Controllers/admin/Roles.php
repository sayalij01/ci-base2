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
use App\Enums\E_STATUS_CODE , App\Enums\E_PLUGINS_JS ,App\Enums\E_RENDERMODE,App\Enums\E_PERMISSIONS, App\Enums\E_PLUGIN,
App\Enums\T_Pseudo , App\Enums\E_SESSION_ITEM;
use App\Libraries\value_objects\T_Role;
use CodeIgniter\Validation\Rules;

class Roles extends BASE_Controller
{
	const DEBUG_FILENAME = "roles.log";
	
	/**
	 * @var array
	 */
	private $permissions					= array();
	
	/**
	 * array containing all rights available
	 *
	 * @var array
	 */
	private $available_rights = array();
	
	/**
	 * array with DT_Columns for the roles table
	 *
	 * @var array
	 */
	private $table_columns = array();

	protected $role_model;
	protected $client_model;
	protected $user_model;


	/**
	 * Constructor for the roles controller
	 */

	 public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger )
    {
        parent::initController($request, $response, $logger);
		// $this->load->library("value_objects/T_Role.php");
		// $this->load->model("role_model");
		// $this->load->model("client_model");
		// $this->load->model("user_model");
		// $this->load->library("DocumentGenerator.php");
		// $this->load->library("BASE_Downloader.php");

		$this->role_model = model('App\Models\Role_model');
		$this->client_model = model('App\Models\Client_model');
		$this->user_model = model('App\Models\User_model');
		helper('html_helper');

		// $this->hasBreadcrump	= true;
		$this->permissions = array(
			"list" 		=> $this->hasPermission(E_PERMISSIONS::USER_LIST),
			"create" 	=> $this->hasPermission(E_PERMISSIONS::USER_CREATE),
			"edit" 		=> $this->hasPermission(E_PERMISSIONS::USER_EDIT),
			"delete" 	=> $this->hasPermission(E_PERMISSIONS::USER_DELETE),
			"export"	=> $this->hasPermission(E_PERMISSIONS::USER_EXPORT)
		);
    	$validation = \Config\Services::validation();
		
		$this->javascript = array("roles.js");
		
		$this->table_columns = T_Role::get_table_columns();
		
		$this->available_rights = $this->role_model->loadRights($this->client_id)->data;
		
		write2Debugfile(self::DEBUG_FILENAME, "admin/roles", false);

	}

	/**
	 * Default entry point.
	 * leads to the show method
	 */
	public function index()
	{
		self::show();

	}

	/**
	 * Render view to create new role
	 *
	 * @version 1.0
	 * @param E_RENDERMODE $rendermode        	
	 */
	public function create($rendermode = "FULLPAGE")
	{
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode"))))
		{
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->breadcrump = "";
		
		if (is_array($this->request->getPost()) && $this->request->getPost("save") == 1)
		{ // only if we have a post, we try to save
		  // note that the save method overwrites the user-viewdata and user_roles-viewdata
			self::save(false, null);
		}
		else
		{
			$this->setViewData("role", array());
			$this->setViewData("role_rights", array());
		}
		
		write2Debugfile(self::DEBUG_FILENAME, "create new role\n" . print_r($this->data, true));
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->setViewData("available_rights", $this->available_rights);
		
		$this->render('admin/role/role_form', $rendermode);
	}

	/**
	 * Ajax data-source for the datatable
	 * Rendermode is always JSON-DATA
	 *
	 * @version 1.0
	 */
	public function datatable(BASE_Result $result_download = null)
	{
		$edit = $this->hasPermission(E_PERMISSIONS::ROLE_EDIT);
		$delete = $this->hasPermission(E_PERMISSIONS::ROLE_DELETE);
		// print_r($this->table_columns);die;
		$result = $this->role_model->datatable($this->client_id, $this->table_columns, $edit, $delete);
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

		write2Debugfile(self::DEBUG_FILENAME, "\nuser datatable edit[$edit] del[$delete] columns-" . print_r($this->table_columns, true) . "\n" . print_r($result, true));
		
		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
	}

	/**
	 * load role data and set view data and render role form
	 *
	 * @version 1.0
	 * 
	 * @param string $role_id 			>> role identifier
	 * @param E_RENDERMODE $rendermode 	>>
	 */
	public function edit($role_id=null, $rendermode="FULLPAGE")
	{
		if ($this->request->getPost("role_id") != "" && $role_id == null)
		{
			$role_id = $this->request->getPost("role_id");
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode"))))
		{
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($role_id == null || $role_id == "")
		{
			$this->render('errors/error_invalid_parameter', $rendermode);
			return;
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		//$role_id 		= decrypt_string($role_id);
		$result_role 	= $this->role_model->load($this->client_id, $role_id);
		
		write2Debugfile(self::DEBUG_FILENAME, "edit role client_id[" . $this->client_id . "] role_id[$role_id] -" . print_r($result_role, true));
		
		if (count($result_role->getData()) == 1 && $result_role->getError() == "")
		{
			$name = ($result_role->data[0]->is_static == 1 ? lang($result_role->data[0]->role_name) : $result_role->data[0]->role_name);
			$this->breadcrump = $name;
			
			if (is_array($this->request->getPost()) && $this->request->getPost("save") == 1)
			{ // if we have a post, we try to save
			  // note that the save method sets the role-viewdata and role_rights-viewdata
				self::save(true);
			}
			else
			{







				$role_rights = $this->role_model->loadRoleRights($this->client_id, $role_id);
				$clients = $this->client_model->loadAllClients()->data;
				$assigned_clients = $this->role_model->getAssignedClients($role_id);
				$users = $this->role_model->getAvailableUsers();
				$assigned_users = $this->role_model->getAssignedUser($role_id);
				
				$this->setViewData("role_rights", $role_rights->getData());
				$this->setViewData("role", $result_role->data[0]);
				$this->setViewData("clients", $clients);
				$this->setViewData("assigned_clients", $assigned_clients);
				$this->setViewData("users", $users);
				$this->setViewData("assigned_users", $assigned_users);
			}
		}
		else
		{
			write2Debugfile(self::DEBUG_FILENAME, "role[$role_id] NOT found", true);
			$this->breadcrump = lang("msg_entry_not_found");
			$this->setViewError(lang("msg_entry_not_found"));
		}


		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

		$this->setViewData("available_rights", $this->available_rights);
		$this->setViewData("available_groupnames",$this->role_model->LoadAvailableGroupnames());
		$this->render('admin/role/role_form', $rendermode);
	}

	/**
	 * Deletes a role.
	 *
	 * @version 1.0
	 *         
	 * @param string $role_id
	 *        	>> role id, you want to delete
	 * @param bool $confirmed
	 *        	>> if true, the user has already confirmed this action
	 * @param E_RENDERMODE $rendermode        	
	 *
	 * @return bool >> true if the role has been removed
	 */
	public function remove($role_id = "", $confirmed = 0, $rendermode = "FULLPAGE")
	{
		if ($this->request->getPost("role_id") != "" && $role_id == "")
		{
			$role_id = $this->request->getPost("role_id");
		}
		if ($this->request->getPost("confirmed") == true && $confirmed == 0)
		{
			$confirmed = 1;
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode"))))
		{
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		//$role_id = decrypt_string($role_id);
		if ($role_id == null || $role_id == "")
		{
			$this->render('errors/error_invalid_parameter', $rendermode);
			return;
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result = new BASE_Result(false); // action needs confirmation first
		$removed = false;
		$result_role = $this->role_model->load($this->client_id, $role_id);
		
		write2Debugfile(self::DEBUG_FILENAME, "remove role [$role_id] -" . print_r($result_role, true), false);
		
		if (count($result_role->getData()) == 1 && $result_role->getError() == "")
		{
			$assigned_users = $this->role_model->getAssignedUser($role_id);
			if (count($assigned_users) > 0)
			{
				$data = ['assigned_users' => $assigned_users];
				$html_assigned_users = $this->load->view("admin/role/role_assigned_users",$data,true);
				$result = new BASE_Result(false, null, ["assigned_users" => $html_assigned_users], E_STATUS_CODE::ERROR);
			}
			else{
				$name = ($result_role->data[0]->is_static == 1 ? lang($result_role->data[0]->role_name) : $result_role->data[0]->role_name);
				$this->breadcrump = $name;

				if ($confirmed == 1)
				{
					$result = $this->role_model->remove($this->client_id, $role_id, $this->getSessionData(E_SESSION_ITEM::USERNAME));
				}
			}
		}
		else
		{
			$this->breadcrump = lang("msg_entry_not_found");
			$result = new BASE_Result(false, lang("msg_role_not_found"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		
		if ($result->data == true && $result->error == "")
		{
			$removed = true;
			$this->setViewSuccess(lang("role_has_been_deleted"));
			// self::show($rendermode);
			// return ;
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);
		$this->setViewData("role", $result_role->data);
		
		$this->render('admin/role/role_delete', $rendermode);
		return $removed;
	}

	/**
	 * Ajax-Method to delete a role
	 *
	 * @param string $role_id        	
	 */
	public function remove_ajax($role_id)
	{
		self::remove($role_id, 1, E_RENDERMODE::JSON);
	}

	/**
	 * Saves a role after input validation and sets the viewdata
	 *
	 * @version 1.0
	 *         
	 * @param bool $edit
	 *        	>> create or update action
	 * @return boolean >> returns the saved state
	 */
	private function save($edit)
	{
		write2Debugfile(self::DEBUG_FILENAME, "save role\n" . print_r($this->request->getPost(), true), false);
		
		//$post = $this->request->getPost(NULL, TRUE);
		$saved = false;
		
		if ($this->request->getPost("role_id") != "" && $edit == false)
		{	// correct wrong save mode
			$edit = true;
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set validation rules
		/* if ($edit){
			$this->form_validation->set_rules('name_orig', 'lang:role_name', 'trim|required|min_length[4]|max_length[50]');
		}
		else{
			$this->form_validation->set_rules('role_name', 'lang:role_name', 'trim|required|min_length[4]|max_length[50]|validate_is_unique[' . $this->request->getPost("name_orig") . ',' . TBL_ROLES . ',role_name,' . lang("role_already_exist") . ']');
		}
		
		$this->form_validation->set_rules('right[]', 'lang:rights', 'trim|required|min_length[1]');
		$this->form_validation->set_rules('role_desc', 'lang:role_desc', 'trim|max_length[255]');
		$this->form_validation->set_rules('deleted', 'lang:deleted', 'trim|max_length[1]'); */
    	// $validation = \Config\Services::validation();
		$validation = service('validation');
		$validation->setRules([
			// 'right[]' => 'trim|required|min_length[1]',
			// 'role_desc' => 'trim|max_length[255]',
			// 'deleted' => 'trim|max_length[1]',
			'right[]' => ['label' => 'lang:rights','rules' => 'trim|required|min_length[1]'],
			'role_desc' => ['label' => 'lang:role_desc','rules' => 'trim|max_length[255]'],
			'deleted' => ['label' => 'lang:deleted','rules' => 'trim|max_length[1]'],
		]);
		if ($edit) {
			$validation->setRule('name_orig', 'lang:role_name', 'trim|required|min_length[4]|max_length[50]');
		} else {
			$validation->setRule('role_name', 'lang:role_name', "trim|required|min_length[4]|max_length[50]|is_unique[" . TBL_ROLES . ".role_name,role_name," . lang("role_already_exist") . "]");
		}
			// $validationRules = [
			// 	'right[]' => [
			// 		'label' => 'lang:rights',
			// 		'rules' => 'trim|required|min_length[1]',
			// 	],
			// 	'role_desc' => [
			// 		'label' => 'lang:role_desc',
			// 		'rules' => 'trim|max_length[255]',
			// 	],
			// 	'deleted' => [
			// 		'label' => 'lang:deleted',
			// 		'rules' => 'trim|max_length[1]',
			// 	],
			// ];
		
		/* if ($edit) {
			// Editing an existing record
			$validationRules['name_orig'] = [
				'label' => 'lang:role_name',
				'rules' => 'trim|required|min_length[4]|max_length[50]',
			];
		} else {
			// Adding a new record
			$validationRules['role_name'] = [
				'label' => 'lang:role_name',
				'rules' => "trim|required|min_length[4]|max_length[50]|is_unique[" . TBL_ROLES . ".role_name,role_name," . lang("role_already_exist") . "]",
			];
		}
		 */
		// $this->validation->setRules($validationRules);
		
	/* 	if ($this->validation->run($this->request->getPost())) {
			// Validation passed
		} else {
			// Validation failed
			$errors = $this->validation->getErrors();
			// Handle errors as needed
		} */

		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$deleted_at = $this->request->getPost("deleted_at", TRUE);
		if ($this->request->getPost("deleted") == "1" && $this->request->getPost("deleted_at") == "")
		{
			$deleted_at = time();
		}
		
		$deleted_by = $this->request->getPost("deleted_by", TRUE);
		if ($this->request->getPost("deleted") == "1" && $this->request->getPost("deleted_by") == "")
		{
			$deleted_by = $this->getSessionData(E_SESSION_ITEM::USERNAME);
		}

		//$is_static = $this->request->getPost("is_static");
		//no static roles in project!
        // $is_static = $this->request->getPost("static");
		$is_static = 0;
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($this->request->getPost("role_id") == "")
		{
			$role_id = BASE_Model::generateUID(TBL_ROLES, "role_id", $this->client_id . "_", false, 20);
			$is_static = 0;
		}
		else
		{
			//$role_id = decrypt_string($this->request->getPost("role_id", TRUE));
			$role_id = $this->request->getPost("role_id", TRUE);
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$data = array(
			//"client_id" => $this->client_id,
            "client_id" => 0,
			"role_id" => $role_id,
			//"is_static" => ($this->request->getPost("is_static") == "1" ? 1 : 0),
            "is_static"=>$is_static,
			"deleted" => ($this->request->getPost("deleted") == "1" ? 1 : 0),
			"group_specific" => $this->request->getPost("groupname", true),
			"deleted_at" => $deleted_at,
			"deleted_by" => $deleted_by
		);
		
		if ($is_static == 0)
		{
			$data["role_name"] = $this->request->getPost("role_name", TRUE);
			$data["role_desc"] = $this->request->getPost("role_desc", TRUE);
		}
		
		/*
		 * if ($this->request->getPost("created_at") == "" && $edit == false){
		 * $data["created_at"] = time();
		 * }
		 */
        //die(print_r($data,true));
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($this->validation->run($this->request->getPost()))
		{
			write2Debugfile(self::DEBUG_FILENAME, "\n - form validation passed edit[$edit]...", true);
			$clients = $this->request->getPost("client", true);
			$users = $this->request->getPost("user_client", true);
			if ($edit == true)
			{
				$result = $this->role_model->update($this->client_id, $role_id, $data, $this->request->getPost("right", true), $clients, $users);
			}
			else
			{
				$result = $this->role_model->create($this->client_id, $data, $this->request->getPost("right", true), $clients, $users);
			}
		}
		else
		{
			$result = new BASE_Result(null, $this->validation->getError(), $this->validation->getErrors(), E_STATUS_CODE::ERROR);
			write2Debugfile(self::DEBUG_FILENAME, "\n - form validation failed...\n" . validation_errors(), true);
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		if ($result->error == "")
		{
			$this->setViewSuccess(lang("role_has_been_saved"));
			$saved = true;
		}
		else
		{
			if ($edit == false)
			{
				$data["role_id"] = "";
			}
		}
		$this->setViewData("role", $data); // fill the role with the given post data so the view can populate a filled out form
		$this->setViewData("role_rights", $this->request->getPost("right"));
		$this->setViewData("saved", $saved);
		
		write2Debugfile(self::DEBUG_FILENAME, "\nthis->data\n" . print_r($this->data, true));
		
		return $saved;
	}

	/**
	 * render the roles list
	 *
	 * @version 1.0
	 *         
	 * @param E_RENDERMODE $rendermode        	
	 */
	public function show($rendermode = "FULLPAGE")
	{
		$data = array();
		
		if ($this->getSessionData(E_SESSION_ITEM::JS_ENABLED) == false)
		{
			// load table data immediatly since the ajax way will not work without js
			$edit 	= $this->hasPermission(E_PERMISSIONS::ROLE_EDIT);
			$delete = $this->hasPermission(E_PERMISSIONS::ROLE_DELETE);
			$modelResult = $this->role_model->datatable($this->client_id, $this->table_columns, $edit, $delete);

			$data =$modelResult->data;

		}
		
		write2Debugfile(self::DEBUG_FILENAME, " - admin/roles/show\n" . print_r($data, true), false);
		// echo count($this->table_columns);die;
		$this->setViewData("table_data", $data);
		$this->setViewData("table_columns", $this->table_columns);
		$this->setViewData("permissions", $this->permissions);
		
		$this->render('admin/role/role_list', $rendermode);
	}

	public function export_roles_list()
	{
		$result = $this->role_model->export_roles_list($this->client_id, $this->table_columns);

		if ($result->error == "")
		{
			$columns = [];
			$data = $result->getData();
			foreach($this->table_columns as $col)
			{
				if($col->visible)
				{
					$columns[$col->data] = $col->label;
				}
			}
			$this->documentgenerator->CreateDocument(DocumentGenerator::EXCEL_DOCUMENT,"roles_list_export_");
			$this->documentgenerator->setDocData($data);
			$this->documentgenerator->setParams(array("columns"=>$columns,"locale"=>$this->getSessionData(E_SESSION_ITEM::USER_LANGUAGE)));
			$file = $this->documentgenerator->exportRolesTable();
			if (array_key_exists("file", $file) && is_file($file["file"]))
			{
				$filename = basename($file["filename"]);
				$result = new BASE_Result($filename);
			}
			else
			{
				$result = new BASE_Result(null,"File does not exist",null,E_STATUS_CODE::ERROR,null);
			}

		}
		else
		{
			$result = new BASE_Result(null,"Export error",null,E_STATUS_CODE::ERROR,null);
		}

		$this->datatable($result);
	}

	public function download_export($filename)
	{
		$path = $this->config->item("root_path").$this->config->item("upload_folder")."created_documents/".$filename;

		BASE_Downloader::download($path, $filename, 0, true);
	}
}