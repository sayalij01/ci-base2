<?php 
/**
 * Superuser clients controller
*/
namespace App\Controllers\root;
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
use App\Libraries\value_objects\T_Client;
use CodeIgniter\Validation\Rules;

class Clients extends BASE_Controller 
{
	const DEBUG_FILENAME = "root_clients.log";
	
	private $permissions		= array();
	private $table_columns = array();
	protected $client_model;
	
	/**
	 * Constructor for the clients controller
	 */
	public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger )
    {
        parent::initController($request, $response, $logger);

		// $this->load->library("value_objects/T_Client.php");
		// $this->load->model("client_model");
		$this->client_model = model('App\Models\Client_model');


		$this->permissions = array(
			"list" 		=> $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_CREATE),
			"create" 	=> $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_CREATE),
			"edit" 		=> $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_EDIT),
			"delete" 	=> $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_DELETE)
		);
		
    	$this->javascript		= array("clients.js");
    	
    	// $this->addPlugins(
    	// 	E_PLUGIN::DATATABLES,
    	// 	E_PLUGIN::SELECT2,
    	// 	E_PLUGIN::BS_TOGGLE,
    	// 	E_PLUGIN::FILE_INPUT
    	// );
    	
    	$this->table_columns = T_Client::get_table_columns();
    	
		write2Debugfile(self::DEBUG_FILENAME, "root/client", false);
	}
	
	/**
	 * default entry point. leads to the show method
	 */
	public function index() {
		self::show();
	}
	
	/**
	 * render view to create new client
	 *
	 * @version 1.2
	 * @param E_RENDERMODE $rendermode
	 */
	public function create($rendermode="FULLPAGE")
	{
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode")))){
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->breadcrump = "";
			
		if (is_array($this->request->getPost()) && $this->request->getPost("save") == 1)
		{	// only if we have a post, we try to save
			// note that the save method overwrites the client-viewdata
			self::save(false);
		}
		else
		{
			$this->setViewData("client", array());
		}

		write2Debugfile(self::DEBUG_FILENAME, "create new client\n".print_r($this->data, true));

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->render('root/client/client_form', $rendermode);
	}
	
	/**
	 * Ajax data-source for the datatable
	 * JSON-Rendermode
	 * 
	 * @version 1.2
	 */
	public function datatable()
	{
		
		$edit	= $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_EDIT);
		$delete	= $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_DELETE);
			
		$result = $this->client_model->datatable( $this->client_id, $this->table_columns, $edit, $delete);
		$result->data = json_decode($result->data);	// because the render method will encode it again
		
		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
	}
	
	/**
	 * load client data, set view data and render the clients form
	 *
	 * @version 1.2
	 *
	 * @param string $client_id 		>> client identifier
	 * @param E_RENDERMODE $rendermode 	>>
	 */
	public function edit($client_id=null, $rendermode="FULLPAGE")
	{
		if ($this->request->getPost("client_id") != ""){
			$client_id = $this->request->getPost("client_id");
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode")))){
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
	
		if ($client_id == null || $client_id == "")
		{
			$this->render(E_ERROR_VIEW::INVALID_PARAMS, $rendermode);
			return;
		}
		
		write2Debugfile(self::DEBUG_FILENAME, "edit client client_id[".$client_id."]", false);
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result_client = $this->client_model->load($client_id);
	
		if (count($result_client->getData()) == 1 && $result_client->getError() == "")
		{
			write2Debugfile(self::DEBUG_FILENAME, " - edit client [$client_id] -".print_r($result_client, true), true);
				
			$this->breadcrump = $result_client->data[0]->client_name;
				
			if (is_array($this->request->getPost()) && $this->request->getPost("save") == 1 )
			{	// if we have a post, we try to save
				// note that the save method sets the client-viewdata
				self::save(true);
			}
			else
			{
				$this->setViewData("client", $result_client->data[0]);
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "client[$client_id] NOT found", true);
			$this->breadcrump = $client_id;
			$this->setViewError(lang("msg_not_found"));
		}
	
		write2Debugfile(self::DEBUG_FILENAME, " - client-".print_r($result_client, true)."\n", true);
		
		$this->render('root/client/client_form', $rendermode);
	}
	
	/**
	 * Deletes a client. Accepts POST-data
	 * 
	 * @version 1.2
	 * 
	 * @param string $client_id			>> client, you want to delete
	 * @param bool $confirmed 			>> if true, the user has confirmed this action
	 * @param E_RENDERMODE $rendermode 	>> as usual
	 * 
	 * @return bool
	 */
	public function remove($client_id="", $confirmed=0, $rendermode="FULLPAGE")
	{
		if ($this->request->getPost("client_id") != "" && $client_id == ""){
			$client_id = $this->request->getPost("client_id");
		}
		if ($this->request->getPost("confirmed") == true && $confirmed == 0){
			$confirmed = 1;
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->request->getPost("rendermode")))){
			$rendermode = strtoupper($this->request->getPost("rendermode"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($client_id == null || $client_id == "") 
		{
			$this->render('errors/error_invalid_parameter', $rendermode);
			return; 
		}
		if($client_id == $this->config->item("root_client_id")){
			$this->setViewError(lang("msg_you_cant_delete_this_entry"));
			$this->render('errors/error_general', $rendermode);
			return;
		}
		
					
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result 		= new BASE_Result(false);	// action needs confirmation first
		$removed		= false;
		$result_client	= $this->client_model->load($client_id );
		
		write2Debugfile(self::DEBUG_FILENAME, "remove client[$client_id] - ".print_r($result_client, true));
		
		if (count($result_client->getData()) == 1 && $result_client->getError() == "")
		{
			$this->breadcrump = $result_client->data[0]->client_name;
			if ($confirmed == 1){
				$result	= $this->client_model->remove($client_id, $this->getSessionData(E_SESSION_ITEM::USER_ID));
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "client[$client_id] NOT found", true);
			$this->breadcrump = $client_id;
			$result = new BASE_Result(false, lang("msg_client_not_found"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		if ($result->data == true && $result->error == "")
		{
			$removed = true;
			$this->setViewSuccess(lang("client_has_been_deleted"));
			//self::show($rendermode);
			//return ;
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);
		$this->setViewData("client", $result_client->data);
		
		$this->render('root/client/client_delete', $rendermode);
		return $removed;
	}
	
	/**
	 * Saves a client after input validation and sets the viewdata
	 * Note: The permission is checked by validation callback
	 * 
	 * @version 1.2
	 * 
	 * @param bool $edit 	>> create or update action
	 * @return boolean  	>> returns the saved state
	 */
	private function save($edit)
	{
		write2Debugfile(self::DEBUG_FILENAME, "save client\n".print_r($this->request->getPost(), true), false);
		
    	//$post 	= $this->request->getPost();
    	$saved	= false;
    	
    	if ($this->request->getPost("client_id") != "" && $edit == false)
    	{	// correct wrong save mode
    		$edit = true;
    	}
    	
    	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    	// ..:: set validation rules
		$validation = \Config\Services::validation();
		$validation = service('validation');
		$rules = [
			'customer_number'=> 'trim|required|min_length[1]|max_length[255]',
    		'name'=> 'required|min_length[3]|max_length[255]',
    		'desc'=>'trim|max_length[255]',
    		'email'=>'trim|required|valid_email|max_length[255]',
    		// 'phone'=> 'trim|max_length[100]',
    		// 'fax'=> 'trim|max_length[100]',
    		'street'=> 'trim|required|min_length[5]|max_length[255]',
    		'house_nr'=> 'trim|required|max_length[5]',
    		'zipcode'=> 'trim|required|required|max_length[30]',
    		'location'=> 'trim|required|max_length[255]',
    		// 'logo'=> 'trim|max_length[255]',
    		// 'deleted'=> 'max_length[1]',
		];
    	$validation->setRules($rules);
    	
    	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    	$deleted_at = $this->request->getPost("deleted_at");
    	if ($this->request->getPost("deleted") == "1" && $this->request->getPost("deleted_at") == ""){
    		$deleted_at = time();
    	}
    	
    	$deleted_by = $this->request->getPost("deleted_by");
    	if ($this->request->getPost("deleted") == "1" && $this->request->getPost("deleted_by") == ""){
    		$deleted_by = $this->getSessionData(E_SESSION_ITEM::USER_ID);
    	}
    	
    	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    	if ($this->request->getPost("client_id") == ""){
    		$client_id = BASE_Model::generateUID(TBL_ROLES, "client_id", "", false, 20);
    	}else{
    		$client_id = $this->request->getPost("client_id");
    	}
    	
    	$data = array(
			"client_id" => $client_id,
    		"customer_number" => $this->request->getPost("customer_number"),
			"client_name" => $this->request->getPost("name"),
			"client_desc" => $this->request->getPost("desc"),
			"client_email" => $this->request->getPost("email"),
			// "client_phone" => $this->request->getPost("phone"),
			// "client_fax" => $this->request->getPost("fax"),
			"client_street" => $this->request->getPost("street"),
			"client_house_nr" => $this->request->getPost("house_nr"),
			"client_zipcode" => $this->request->getPost("zipcode"),
			"client_location" => $this->request->getPost("location"),
			"client_logo" => $this->request->getPost("logo"),
			"deleted" => ($this->request->getPost("deleted") == "1" ? 1:0),
    		"deleted_at" => $deleted_at,
    		"deleted_by" => $deleted_by
    	);
    
    	if ($this->request->getPost("created_at") == "" && $edit == false){
    		$data["created_at"] = time();
    	}
    	// print_r($data);
    	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if($validation->run($this->request->getPost()))
    	{
    		write2Debugfile(self::DEBUG_FILENAME, "\n - form validation passed...", true);
    		if ($edit == true)
    		{
    			$result = $this->client_model->update($client_id, $data );
    		}
    		else
    		{
				// echo "else";die;
    			$result = $this->client_model->create($data );
    		}
			
    	}
    	else {
    		$result = new BASE_Result(null, $validation->getError(), $validation->getErrors(), E_STATUS_CODE::ERROR);
    	}
		// die;
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data

		$this->setData($result);
		if ($result->error == "")
		{
			$this->setViewSuccess(lang("client_has_been_saved"));
			$saved = true;
		}
		else
		{
			if ($edit == false)
			{
				$data["client_id"] = "";
			}
		}
		$this->setViewData("client", $data); // fill the role with the given post data so the view can populate a filled out form
		$this->setViewData("saved", $saved);
		// $this->render('admin/role/role_form', "FULLPAGE");
		
		// write2Debugfile(self::DEBUG_FILENAME, "\nthis->data\n" . print_r($this->data, true));
		
		return $saved;


		// $this->setData($result);
		// echo "<pre>";
		// 		print_r($result);die;
		// if ($result->error == "")
		// {
		// 	$data["client_id"] = $client_id; 
			
		// 	$this->setViewSuccess(lang("client_has_been_saved"));
		// 	$saved = true;
		// }
		// $this->setViewData("client", $data);	// fill the client with the given post data so the view can populate a filled out form
		// $this->setViewData("saved", $saved);

    	// write2Debugfile(self::DEBUG_FILENAME, "\nthis->data\n".print_r($this->data, true));
		
    	
    	// return $saved;
	}
	
	/**
	 * render the client list
	 *
	 * @version 1.2
	 * @param E_RENDERMODE $rendermode
	 *
	 */
	public function show($rendermode="FULLPAGE")
	{
		$data = array();
		if ($this->getSessionData(E_SESSION_ITEM::JS_ENABLED) == false)
		{
			// load table data immediatly since the ajax way will not work without js
			// print_r($this->client_id);die;
			
			$edit			= $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_EDIT);
			$delete			= $this->hasPermission(E_PERMISSIONS::ROOT_CLIENT_DELETE);
			$modelResult 	= $this->client_model->datatable($this->client_id, $this->table_columns, $edit, $delete );
			// $data 			= json_decode($modelResult->getData())->data;
			$data =$modelResult->data;
		}
	
		write2Debugfile(self::DEBUG_FILENAME, " - admin/clients/show\n".print_r($data, true), false);
	
		
		$this->setViewData("table_data", $data);
		$this->setViewData("table_columns", $this->table_columns );
		$this->setViewData("permissions", $this->permissions);
		
		$this->render('root/client/client_list', $rendermode);
	}
}
