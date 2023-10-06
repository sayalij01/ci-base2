<?php if ( ! defined("BASEPATH")) exit("No direct script access allowed");
/**
 * Costcarrier controller
 *
 * @author codenground
 * @category controller
 * @package application/controllers/admin/Costcarrier
 * @version 1.0
 */

class Costcarrier extends BASE_Controller
{
	const DEBUG_FILENAME = "costcarrier.log";
	
	/**
	 * Constructor for the costcarrier controller
	 */
	function __construct()
	{
		parent::__construct(true);
		$this->load->library("value_objects/T_Costcarrier.php");
		$this->load->model("costcarrier_model");
		$this->addPlugins(
			E_PLUGIN::DATATABLES,
			E_PLUGIN::BS_TOGGLE,
			E_PLUGIN::BS_DATETIMEPICKER,
			E_PLUGIN::SELECT2,
			E_PLUGIN::FILE_INPUT
		);		
		$this->javascript		= array("costcarrier.js");
	}
	
	/**
	 * default entry point. leads to the show method
	 */
	public function index() {
		if ($this->client_id == 0)
		{
			self::import_file();
		}
	}
	
		/**
	 * render the imported costcarrier files list
	 * @version 1.2
	 *
	 * @param E_RENDERMODE $rendermode
	 */
	public function show($rendermode="FULLPAGE")
	{
		
	}
	
	private function get_upload_path($costcarrier_id)
	{
		$upl_path	= $this->config->item("root_path") . $this->config->item("upload_folder");
		$upl_dir	= "costcarrier_files/". $costcarrier_id."/";
		$path		= $upl_path . $upl_dir;
			
		return $path;
	}
	
	/**
	 * render the costcarrier
	 * @version 1.0
	 *
	 * @param E_RENDERMODE $rendermode
	 */
	public function import_file($rendermode="FULLPAGE")
	{
		$sgb_costcarrier_id = null;
		if ($this->input->post("sgb_costcarrier_id") != ""){
			$sgb_costcarrier_id = $this->input->post("sgb_costcarrier_id");
		}
		if (is_array($this->input->post()) && $this->input->post("start_import") == 1 )
		{	// if we have a post, we try to save. Note that the save method sets viewdata
			self::import_costcarrierfile();
		}
		
		$imports_result = $this->costcarrier_model->load_imports($this->client_id);
		$costcarrier_imports["imports"] = array();
		$costcarrier_imports["costcarriers"] = array();
		$imports = array();
		
		if ($imports_result->getError() == "")
		{
			$costcarrier_imports["imports"] =  $imports_result->data;
		}
		$costcarrier_options = $this->costcarrier_model->get_costcarrier()->getData();
		$costcarrier_imports["costcarriers"] = $costcarrier_options;
		$this->setViewData("costcarrier_imports", $costcarrier_imports );
		
		
		$this->setViewData("sgb_costcarrier_id", $sgb_costcarrier_id );
		$this->render("root/costcarrier/costcarrier_form", $rendermode);
	}
	
	public function upload_costcarrier_file()
	{
		$imported	= false;
		$this->form_validation->set_rules("sgb_costcarrier_id", "costcarrier", "trim|required|max_length[20]");
		if ($this->form_validation->run() )
		{
			
			$costcarrier_id	= $this->input->post("sgb_costcarrier_id", true);
			write2Debugfile("import_costcarrier_file.log", "\n - form validation passed...", true);
			
			if (isset($_FILES['upload_costcarrier_file']['name'][0]) && $costcarrier_id != "" )
			{
				if ($this->config->item("upload_folder") == ""){
					show_error("missing upload path");
				}
			
				$path = $this->get_upload_path($costcarrier_id);
			
				if (! is_dir( $path )) {		// create the needed directories, if needed
					mkdir($path, 7777, true);
				}
			
				write2Debugfile("import_costcarrier_file.log", "\nupload-path: ".$path);
			
				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// start the upload
				$this->load->library("BASE_Uploader");
			
				$uploader 					= new BASE_Uploader();
				$uploader->renameFiles		= true;
				$uploader->UploadDirectory 	= $path;
				$uploader->Email			= $this->config->item("email_upload");
				$uploader->FileName			= safe_utf8_decode(basename($_FILES['upload_costcarrier_file']['name'][0]));
				$uploader->TempFileName		= $_FILES['upload_costcarrier_file']['tmp_name'][0];
				$uploader->IsImage			= true;
				$uploader->MaximumFileSize	= 10000000; // 10 MB max
				$uploader->ValidExtensions	= array("ke0","ke1","ke2","ke3","ke4","ke5","ke6","ke7","ke8","ke9");
			
				$result = $uploader->UploadFile();
			
				write2Debugfile("import_costcarrier_file.log", "\nupload-result: ".print_r($result, true));
			
				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				if ($result->data["file"] != "" && $result->data["filepath"] != "" && is_file($result->data["filepath"]))
				{
					write2Debugfile("import_costcarrier_file.log", "\n - file uploaded - saving data");
					$result->data["start_import"] = true;
					$result->data["filename_original"] = $_FILES['upload_costcarrier_file']['name'][0];
				}
			}
			else{
				$result->error	= lang("msg_nothing_to_upload");
			}			
			
		}
		else {
			$result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
			write2Debugfile("import_costcarrier_file.log", "\n - form validation failed...\n".print_r(validation_errors(), true), true);
		
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		write2Debugfile("import_costcarrier_file.log", "\nthis->data\n".print_r($this->data, true));
		$this->setData($result);
		$this->render("root/costcarrier/costcarrier_form", E_RENDERMODE::JSON);
	}
	
	public function import_costcarrier_file()
	{
		$costcarrier_id	= $this->input->post("sgb_costcarrier_id", true);
		$file_name	= $this->input->post("file_name", true);
		$filename_original = $this->input->post("filename_original", true);
		$path = $this->get_upload_path($costcarrier_id);
		$path_file = $path.$file_name;
		if (file_exists($path_file)) 
		{
			$result = $this->costcarrier_model->import_costcarrier_file($this->client_id, $path_file, $costcarrier_id, $filename_original);
		}
		else
		{
			$result = new BASE_Result(null, lang('file does not exist') );
		} 
		$this->setData($result);
		$this->render("root/costcarrier/costcarrier_form", E_RENDERMODE::JSON);
		
	}
	
	public function datatable_imports()
	{
		$imports_result = $this->costcarrier_model->load_imports($this->client_id);
		$this->setData($imports_result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
		
	}
}