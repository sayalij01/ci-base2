<?php if ( ! defined("BASEPATH")) exit("No direct script access allowed");
/**
 * Contracts controller
 *
 * @author Marco Eberhardt
 * @category controller
 * @package application/controllers/admin/contract
 * @version 1.0
 */
class Contracts extends BASE_Controller
{
	const DEBUG_FILENAME = "contract.log";

	/**
	 * @var array
	 */
	private $available_document_types		= array();
	private $available_costcarrier			= null;
	private $available_subcountries			= null;
	private $available_characteristics 		= null;
	private $available_global_documents		= array();
	private $workdays_until_delivery		= array();
	/**
	 * array of HTML_DTColumns for the various tables
	 * @var array
	 */
	private $table_columns						= array();
	private $table_columns_documents			= array();
	private $table_columns_health_insurances	= array();
	private $table_columns_flatrates	= array();
	/**
	 * Constructor for the contract controller
	 */
	private $contract_id = NULL;

	private $flatrate_articles 			= null;


	function __construct()
	{
		parent::__construct(true, false);

		$this->load->library("value_objects/T_Contract.php");

		$this->load->model("costcarrier_model");
		$this->load->model("contract_model");
		$this->load->model("Health_insurance_model");
		$this->load->model("debitor_model");
		$this->load->library("PDF/PDFLib", "PDFLib");
		$this->javascript		= array("contracts.js","contract_doc_editor.js");

		$this->addPlugins(
			E_PLUGIN::DATATABLES,
			E_PLUGIN::BS_TOGGLE,
			E_PLUGIN::BS_DATETIMEPICKER,
			E_PLUGIN::SELECT2,
		    E_PLUGIN::FILE_INPUT,
		    E_PLUGIN::PDF_JS,
		    E_PLUGIN::CONTEXT_MENU
		);

		$this->table_columns 					= T_Contract::get_table_columns();
		$this->table_columns_documents			= T_Contract::get_table_columns_documents();
		$this->table_columns_assigned_insurance = T_Contract::get_table_columns_health_insurances();
		$this->table_columns_flatrates 			= T_Contract::get_table_columns_flatrates();

		$this->available_document_types 	= $this->contract_model->getDocumentTypes()->data;
		$this->available_subcountries		= $this->contract_model->getSubCountries()->data;
		$this->available_characteristics	= $this->contract_model->getAvailableCharacteristics()->data;
		$this->available_costcarrier		= $this->costcarrier_model->get_costcarrier()->getData();
		$this->available_global_documents	= $this->contract_model->getGlobalDocuments($this->client_id);
		$this->workdays_until_delivery		= $this->contract_model->getWorkdaysUntilDelivery();

		$this->flatrate_articles		    = $this->contract_model->loadFlatratearticles()->data;


		write2Debugfile(self::DEBUG_FILENAME, "application/controllers/admin/\ntable-columns-".print_r($this->table_columns, true), false);
	}

	/**
	 * default entry point. leads to the show method
	 */
	public function index() {
		self::show();
	}

	/**
	 * render view to create new contract
	 *
	 * @version 1.2
	 * @param E_RENDERMODE $rendermode
	 */
	public function create($rendermode="FULLPAGE")
	{
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->breadcrump = "";

		if (is_array($this->input->post()) && $this->input->post("save_contract") == 1 )
		{	// only if we have a post, we try to save. Note that the save method also sets viewdata
			self::save(false);
		}
		else
		{
			$this->setViewData("contract", array());
		}

		write2Debugfile(self::DEBUG_FILENAME, "create new contract\n".print_r($this->data, true));

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->setViewData("available_document_types", $this->available_document_types );
		$this->setViewData("available_subcountries", $this->available_subcountries );
		$this->setViewData("available_characteristics", $this->available_characteristics );
		$this->setViewData("available_costcarrier", $this->available_costcarrier);
		$this->setViewData("workdays_until_delivery", $this->workdays_until_delivery);
		$this->setViewData("available_global_documents", $this->available_global_documents);
		write2Debugfile('CONTRACT__create.log', print_r($this->available_global_documents, true));
		$this->render("root/contract/contract_form", $rendermode);
	}

	/**
	 * Ajax data-source for the datatable.
	 * JSON-Rendermode
	 *
	 * @version 1.2
	 */
	public function datatable()
	{
		if ($this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_LIST))
		{
			$edit		= $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_EDIT);
			$delete	= $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_DELETE);
			$copy		= $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_EDIT);

			$result 		= $this->contract_model->datatable( $this->client_id, $this->table_columns, $edit, $delete,$copy);
			$result->data 	= json_decode($result->data);	// because the render method (JSON_DATA) will encode it again
			write2Debugfile(self::DEBUG_FILENAME, "\ncontract datatable edit[$edit] del[$delete] columns-".print_r($this->table_columns, true)."\n".print_r($result, true));
		}
		else{
			$result = new BASE_Result(json_encode(array()), lang("msg_no_permission"), null, E_STATUS_CODE::FORBIDDEN);
		}

		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
	}

	/**
	 * Ajax data-source for the datatable.
	 * JSON-Rendermode
	 *
	 * @version 1.2
	 */
	public function datatable_health_insurances($contract_id)
	{
	    //$this->contract_id

	    $filter = 'all';
	    if($this->input->post('filter_assignement'))
	    {
	        $filter = $this->input->post('filter_assignement');
	    }
		if ($this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_LIST) || $this->hasPermission(E_PERMISSIONS::DEBITOR_EDIT))
		{
			$result = $this->contract_model->datatable_health_insurances($this->client_id, $contract_id, T_Contract::get_table_columns_health_insurances() ,false,false,false,$filter );
		    $result->data = json_decode($result->data); // because the render method (JSON_DATA) will encode it again
		}
		else
		{
		    $result = new BASE_Result(json_encode(array()), lang("msg_no_permission"), null, E_STATUS_CODE::FORBIDDEN);
		}

		write2Debugfile(self::DEBUG_FILENAME, "\ndatatable_assigned_insurance columns-".print_r($result, true));

		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
	}

	/**
	 * Ajax data-source for the documents datatable.
	 * JSON-Rendermode
	 *
	 * @param $contract_id
	 * @param int $contract_revision
	 * @param int $read_only_view
	 * @throws Exception
	 * @version 1.2
	 */
	public function datatable_documents($contract_id, $contract_revision=1, $read_only_view=0): void
	{
		if ($this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_LIST)|| $this->hasPermission(E_PERMISSIONS::DEBITOR_EDIT))
        {
            $edit    = $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_EDIT);
            $delete    = $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_DELETE);

			$result 		= $this->contract_model->datatable_documents( $this->client_id, $contract_id, $contract_revision, $this->table_columns_documents, $edit, $delete, false, $read_only_view);
			$result->data 	= json_decode($result->data);	// because the render method (JSON_DATA) will encode it again
			write2Debugfile(self::DEBUG_FILENAME, "\ncontract documents datatable edit[$edit] del[$delete]");
		}
		else{
			$result = new BASE_Result(json_encode(array()), lang("msg_no_permission"), null, E_STATUS_CODE::FORBIDDEN);
		}

		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
	}


	/**
	 *
	 * @author Marco Eberhardt
	 * @version 1.0
	 *
	 * @param string $document_id
	 */
	public function download_contract_document($document_id)
	{
		$this->load->library("BASE_Downloader");
		$result_doc = $this->app_model->BASE_Select(TBL_CONTRACTS_DOCUMENTS, array("client_id"=>$this->client_id, "document_id"=>$document_id), "*", array(), 1)->data;
		$file	= upload_path()."contract_docs/". $result_doc->contract_id."/".$result_doc->filename;
		BASE_Downloader::download($file, $result_doc->filename_original, $this->client_id, true);
	}

	public function copy_global_document($global_document_id="",$contract_id="",$contract_revision="",$rendermode="FULLPAGE")
	{
		$post = $this->input->post();


		if ($this->input->post("global_document_id") != "" && $global_document_id == ""){
			$global_document_id = $this->input->post("global_document_id");
		}

		if ($this->input->post("contract_id") == true && $contract_id == 0){
			$contract_id = $this->input->post("contract_id");
		}

		if ($this->input->post("contract_revision") == true && $contract_revision == 0){
			$contract_revision = $this->input->post("contract_revision");
		}

		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if (($global_document_id == null || $global_document_id == "")||($contract_id == null || $contract_id == ""))
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return;
		}
		$result_global_document	= $this->app_model->BASE_Select(TBL_CONTRACTS_DOCUMENTS, array("document_id"=>$global_document_id, "client_id" => $this->client_id), "*", array(), 1)->data;
		$platzhalterarray			= $this->app_model->BASE_Select(TBL_CONTRACTS_DOC_PLACEHOLDER, array("document_id"=>$global_document_id, "client_id" => $this->client_id), "*", array(),null,null,1,true)->data;
		//$tablename, $where=array(), $fields="*", $orderBy=array(), $limit=null, $limitOffset=null, $returnObjectOnLimit_1=true, $resultAsArray=false
		$generated_document_id	= BASE_Model::generateUID(TBL_CONTRACTS_DOCUMENTS, "document_id");



		// Neuen Dateinamen zur Speicherung generieren, falls nötig reinnehmen.
		// $check = false;
		//	while($check === false)
		//	{
		//		$new_filename			= generate_uuid().'.pdf';
		//		if(BASE_MODEL::issetID($new_filename,TBL_CONTRACTS_DOCUMENTS,'filename')===false)
		//		{
		//			$check = true;
		//		}
		//	}

		// check for template file
		$source=upload_path()."contract_docs/". $result_global_document->contract_id."/".$result_global_document->filename;
		if(!is_file($source))
		{
			$result= new BASE_Result(false, lang('file_does_not_exist'), null,E_STATUS_CODE::ERROR) ;
		}
		else
		{
				$dataForInsertIntoContractDocuments = array(
				"client_id"				=> $this->client_id,
				"contract_id"			=> $contract_id,
				"contract_revision"			=> $contract_revision,
				"document_id"			=> $generated_document_id, //neu Generieren
				"document_type"			=> $result_global_document->document_type,
				"filename_original"		=> $result_global_document->filename_original,
				"filename"				=> $result_global_document->filename,
				"custom_document_name"	=> $result_global_document->custom_document_name,
				"available_bw"			=> $result_global_document->available_bw,
				"available_sn"			=> $result_global_document->available_sn,
				"billing_relevant"		=> $result_global_document->billing_relevant,
				"mandatory_to_complete"	=> $result_global_document->mandatory_to_complete,
				"to_be_signed_by_insured_person"=> $result_global_document->to_be_signed_by_insured_person,
				"uploaded_at"			=> time(),
				"uploaded_by"			=> $this->session->userdata(E_SESSION_ITEM::USER_ID)
			);
			$result = $this->app_model->BASE_Insert(TBL_CONTRACTS_DOCUMENTS, $dataForInsertIntoContractDocuments);
			if($result->error == '')
			{
				//..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::...
				// start - copy file process

				$destination_path = upload_path()."contract_docs/". $contract_id."/";
				// check for directory
				if(!file_exists($destination_path))
				{
				   mkdir($destination_path,0777,true);
				}
				$destination=$destination_path.$result_global_document->filename;
				//@
				copy($source,$destination);
				// end - copy file process
				//..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::...

				if(is_array($platzhalterarray) && !empty($platzhalterarray))
				{
					// contract_id, client_id, revision und document_id ersetzen.
					foreach($platzhalterarray as $platzhalterarray_key=>$platzhalterarray_value)
					{
						$dataForCopyToTemplate  = array(
							"client_id"=>$this->client_id,
							"contract_id"=>$contract_id,
							"contract_revision"=>$contract_revision,
							"document_type"=>$platzhalterarray_value['document_type'],
							"document_id"=>$generated_document_id,
							"placeholder_id"=>$platzhalterarray_value['placeholder_id'],
							"placeholder"=>$platzhalterarray_value['placeholder'],
							"page"=>$platzhalterarray_value['page'],
							"posX"=>$platzhalterarray_value['posX'],
							"posY"=>$platzhalterarray_value['posY'],
							"fontsize"=>$platzhalterarray_value['fontsize'],
							"fontfamily"=>$platzhalterarray_value['fontfamily'],
							"fontstyle"=>$platzhalterarray_value['fontstyle']
						);
						$result2 = $this->app_model->BASE_Insert(TBL_CONTRACTS_DOC_PLACEHOLDER, $dataForCopyToTemplate);
					}
				}
			}
		}


		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON);
		//write2Debugfile('copy_global_document.log', print_r($platzhalterarray,true)."\ndataForCopyToTemplate:\n".print_r($dataForCopyToTemplate,true)."\ndataForInsertIntoContractDocuments:\n".print_r($dataForInsertIntoContractDocuments,true));
	}
	/**
	 * Generiert PDF Dokumente für welche ein Template hinterlegt ist.
	 * @param string $document_id
	 */
	public function generate_contract_document($document_id)
	{
		$post = $this->input->post();

		$debitor_id = $post["debitor_id"];

		$result_doc = $this->app_model->BASE_Select(TBL_CONTRACTS_DOCUMENTS, array("client_id"=>$this->client_id, "document_id"=>$document_id), "*", array(), 1)->data;



		$pdfSourceFilePath = $this->config->item("root_path")."uploads/contract_docs/".$result_doc->contract_id."/".$result_doc->filename;
		if(!is_file($pdfSourceFilePath))
		{

			$result = new BASE_Result(false, lang('file_does_not_exist'), null,E_STATUS_CODE::ERROR) ;
			//$this->render("admin/anamnesis/anamnesis_form", E_RENDERMODE::JSON);
		}
		else
		{
			$path = $this->config->item("root_path")."uploads/generated/".$debitor_id."/";

			if(!file_exists($path))
			{
			   mkdir($path,0777,true);
			}

			// Leerstellen aus Filename raus
			$new_document_name = str_replace(" ","",trim($result_doc->custom_document_name));
			// prüfen ob am Ende Dateiendung, diese dann entfernen.
			$mandatory_id = "";
			if($result_doc->mandatory_to_complete == 1)
			{
				$mandatory_id = $document_id;
			}

			$newfilename = $new_document_name."_".$debitor_id."_".time().".pdf";

			$pdfTargetFilePath = $path.$newfilename;

			$placeholderData = $this->debitor_model->load_and_prepare_anamnesis_for_printing($this->client_id, $debitor_id, $result_doc->contract_id, $result_doc->contract_revision, $result_doc->document_type, $document_id);



			PDFLib::WritePlaceholderInPDF($pdfSourceFilePath,$pdfTargetFilePath,$placeholderData);

			$result =new BASE_Result(array( "file"=>$pdfTargetFilePath, "fileB64"=>urlencode(base64_encode($post["debitor_id"]."/".$newfilename)) ));

			if($result->error == '')
			{
				$this->saveDocumentToDebitor($this->client_id,$debitor_id,$newfilename,$path,$result_doc->document_type,$newfilename,$new_document_name,$mandatory_id,$document_id);
			}
		}

		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON);
	}

	public function downloaddocument($fileB64)
	{
	    $this->load->library("BASE_Downloader");
	    $file = $this->config->item("root_path")."uploads/generated/".base64_decode(urldecode($fileB64));
	    BASE_Downloader::download($file, basename($file), $this->client_id, true);

	}

	public function saveDocumentToDebitor($client_id,$debitor_id,$filename_original,$source_path,$document_type=E_DOCUMET_TYPES::MISCELLANEOUS,$filename='',$custom_document_name='',$mandatory_id="",$document_id_parent='')
	{
		if(trim($client_id) != '' && trim($debitor_id) != ''  && trim($filename_original) != '' )
		{
			if(is_file($source_path.$filename_original))
			{
				$target_path = $this->config->item("root_path")."uploads/debitor_docs/".$debitor_id."/";
				if(!file_exists($target_path))
				{
				   mkdir($target_path,0777,true);
				}


				$copyresult = copy ( $source_path.$filename_original , $target_path.$filename_original);

			}
			$doc_types_result = $this->debitor_model->getDocumentTypes();
			write2Debugfile('saveGeneratedDocumentToDebitor.log', print_r($target_path.$filename_original,true));
			$generated_custom_file_name = "";
			foreach($doc_types_result as $k=>$v)
			{
				if($v['document_type'] == $document_type)
				{
					$generated_custom_file_name = lang($v['document_type_name']);
				}
			}
			//$generated_custom_file_name .= " (".date(lang('date_format'),time()).")";
			$data = array(
				"client_id"				=> $client_id,
				"debitor_id"			=> $debitor_id,
				"document_id"			=> BASE_Model::generateUID(TBL_DEBITOR_DOCUMENTS, "document_id"),
				"document_type"			=> $document_type,
				"filename_original"		=> $filename_original,
				"filename"				=> ($filename != '' ? $filename : $filename_original),
				"uploaded_at"			=> time(),
				"uploaded_by"			=> $this->user_id,
				"mandatory_template_id"	=>$mandatory_id,
				"custom_document_name"	=>($custom_document_name != '' ? $custom_document_name :$generated_custom_file_name),
				"document_id_parent"	=>$document_id_parent
			);
			if($copyresult)
			{
				$result_update = $this->debitor_model->BASE_Update(TBL_DEBITOR_DOCUMENTS,array("deleted"=>1),array("client_id"=> $client_id,"debitor_id"=> $debitor_id,"document_id_parent" =>$document_id_parent,"document_id_parent !=" =>''));
				$result = $this->debitor_model->BASE_Insert(TBL_DEBITOR_DOCUMENTS, $data);
				$history_data = $data;
				if($result->error == '')
				{
					$this->app_model->InsertHistory($this->client_id, TBL_DEBITOR_DOCUMENTS, 'CREATED', array("client_id"=>$this->client_id, "debitor_id"=>$debitor_id), $history_data,array(),$this->session->userdata(E_SESSION_ITEM::USER_ID));

				}
			}
			else
			{
				$result = new BASE_Result(false, lang('file_does_not_exist'), null,E_STATUS_CODE::ERROR) ;
			}

		}
		else
		{
			$result = new BASE_Result(false, lang('msg_missing_parameter'), null,E_STATUS_CODE::ERROR) ;
		}

		return $result;
	}

	/**
	 * Ajax data-source for the flatrates datatable.
	 * JSON-Rendermode
	 *
	 * @param $contract_id
	 * @param $contract_revision
	 * @param $read_only_view
	 * @throws Exception
	 * @version 1.2
	 */
	public function datatable_flatrates($contract_id, $contract_revision, $read_only_view): void
	{
	    if ($this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_LIST) || $this->hasPermission(E_PERMISSIONS::DEBITOR_EDIT))
        {
            $edit    = $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_EDIT);
            $delete    = $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_DELETE);

            if ($read_only_view == 1){
			$delete = 0;
			$edit = 0;
	        }

			$result 		= $this->contract_model->datatable_flatrates( $this->client_id, $contract_id, $contract_revision, $this->table_columns_flatrates, $edit, $delete, false, $read_only_view);
			$result->data 	= json_decode($result->data);	// because the render method (JSON_DATA) will encode it again
			write2Debugfile(self::DEBUG_FILENAME, "RESULT:\n".print_r($result ,true));
	}
		else{
			$result = new BASE_Result(json_encode(array()), lang("msg_no_permission"), null, E_STATUS_CODE::FORBIDDEN);
		}

		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
	}

	/**
	 * load contract entry, set viewdata and render the form
	 *
	 * @version 1.2
	 * @param string $contract_id >> contract identifier
	 * @param E_RENDERMODE $rendermode
	 */
	public function edit($contract_id=null, $contract_revision=1, $rendermode="FULLPAGE")
	{
		if ($this->input->post("contract_id") != ""){
			$contract_id = $this->input->post("contract_id");

		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($contract_id == null || $contract_id == "")
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return;
		}
		else
		{
		    $this->setContractId($contract_id);
		}
		//$contract_id = decrypt_string($contract_id);	// decrypt the identifier

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result_contract = $this->contract_model->load( $this->client_id, $contract_id );

		if (count($result_contract->getData()) == 1 && $result_contract->getError() == "")
		{
			$this->breadcrump = $result_contract->data->contract_name;

			if (is_array($this->input->post()) && $this->input->post("save_contract") == 1 )
			{	// if we have a post, we try to save. Note that the save method sets viewdata
				self::save(true);
			}
			else
			{
			    $filter = 'all';
			    if($this->input->post('filter_assignement'))
			    {
			        $filter = $this->input->post('filter_assignement');
			    }
				$modelResult 	= $this->contract_model->datatable_health_insurances($this->client_id, $contract_id, T_Contract::get_table_columns_health_insurances(),false,false,false,$filter );
                $data           = json_decode($modelResult->getData())->data;
                $this->setViewData("table_data_assigned_insurance", $data);
                $this->setViewData("contract", $result_contract->data );
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "contract[$contract_id] NOT found", true);
			$this->breadcrump = $contract_id;
			$this->setViewError(lang("msg_not_found"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$articles = $this->contract_model->loadFlatratearticles();

		$this->setViewData("flatrate_articles", $articles);
		$this->setViewData("available_document_types", $this->available_document_types );
		$this->setViewData("available_subcountries", $this->available_subcountries );
		$this->setViewData("available_characteristics", $this->available_characteristics );
		$this->setViewData("available_costcarrier", $this->available_costcarrier);
		$this->setViewData("workdays_until_delivery", $this->workdays_until_delivery);
		$this->setViewData("available_global_documents", $this->available_global_documents);
        $this->setViewData("general_settings", $this->contract_model->getGeneralSettings($this->client_id));
		write2Debugfile('CONTRACT__edit.log', print_r($this->available_global_documents, true));
		$this->render("root/contract/contract_form", $rendermode);
	}

	/**
	 * load contract entry, set viewdata and render the form
	 *
	 * @param string $contract_id >> contract identifier
	 * @param string $contract_revision
	 * @param string $flatrate_id
	 * @param int $read_only_view
	 * @param string $rendermode
	 * @version 1.2
	 */
	public function edit_flatrate($contract_id=null, $contract_revision=null, $flatrate_id=null, $read_only_view=0, $rendermode="AJAX"): void
	{
		if ($this->input->post("flatrate_id") != ""){
			$flatrate_id = $this->input->post("flatrate_id");
		}

		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		//echome($this->input->post());
		//die($rendermode);
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($contract_id == null || $contract_id == "" || $contract_revision == null || $contract_revision == "" || $flatrate_id == null || $flatrate_id == "")
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return;
		}
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result_flatrate = $this->app_model->BASE_Select(TBL_CONTRACTS_FLATRATES, array(
			"client_id"=>$this->client_id,
			"contract_id"=>$contract_id,
			"contract_revision"=>$contract_revision,
			"flatrate_id"=>$flatrate_id
		),  "*", array(), 1);

		if (count($result_flatrate->getData()) == 1 && $result_flatrate->getError() == "")
		{
			$this->breadcrump = "Vertragsname";

			if (is_array($this->input->post()) && $this->input->post("save_flatrate") == 1 )
			{	// if we have a post, we try to save. Note that the save method sets viewdata
				self::save_flatrate(true);
			}
			else
			{
				$this->setViewData("read_only_view", $read_only_view );
				$this->setViewData("contract_flatrate", $result_flatrate->data );
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "contract[$contract_id] NOT found", true);
			$this->breadcrump = $contract_id;
			$this->setViewError(lang("msg_not_found"));
		}

		write2Debugfile("edit_flatrate.log", "contract_flatrate -".print_r($result_flatrate->data , true), false);

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->setViewData("as_modal", $this->input->post("as_modal"));
		$this->setViewData("id_modal", $this->input->post("id_modal"));
		$this->setViewData("flatrate_articles", $this->flatrate_articles);
		$this->setViewData("available_subcountries", $this->available_subcountries );
		$this->render("root/contract/contract_flatrates", $rendermode);
	}

	/**
	 * Deletes a entry. Acccepts also POST-Data.
	 *
	 * @version 1.2
	 *
	 * @param string $contract_id >> contract id, you want to delete.
	 * @param bool $confirmed >> if true, the user has already confirmed this action.
	 * @param E_RENDERMODE $rendermode
	 *
	 * @return bool >> true if the entry has been removed
	 */
	public function remove($contract_id="", $confirmed=0, $rendermode="FULLPAGE")
	{
		if ($this->input->post("contract_id") != "" && $contract_id == ""){
			$contract_id = $this->input->post("contract_id");
		}
		if ($this->input->post("confirmed") == true && $confirmed == 0){
			$confirmed = 1;
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($contract_id == null || $contract_id == "")
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return;
		}

		//$contract_id = decrypt_string($contract_id);	// decrypt the identifier

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result 		= new BASE_Result(false);	// action needs confirmation first
		$removed		= false;
		$result_contract 	= $this->contract_model->load( $this->client_id, $contract_id );

		write2Debugfile(self::DEBUG_FILENAME, "remove contract [$contract_id] -".print_r($result_contract, true), false);

		if (count($result_contract->getData()) == 1 && $result_contract->getError() == "")
		{
			$this->breadcrump = $result_contract->data->contract_id;

			if ($confirmed == 1) {
				$result	= $this->contract_model->remove($this->client_id, $contract_id, $this->getSessionData(E_SESSION_ITEM::USER_ID));
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "contract[$contract_id] NOT found", true);
			$this->breadcrump 	= $contract_id;
			$result 			= new BASE_Result(false, lang("msg_contract_not_found"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);

		if ($result->data == true && $result->error == "")
		{
			$removed = true;
			$this->setViewSuccess(lang("contract_has_been_deleted"));
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);
		$this->setViewData("contract", $result_contract->data);

		$this->render("root/contract/contract_delete", $rendermode);
		return $removed;
	}

	/**
	 * Deletes a contract document. Acccepts also POST-Data.
	 *
	 * @version 1.2
	 *
	 * @param string $document_id >> document id, you want to delete.
	 * @param bool $confirmed >> if true, the user has already confirmed this action.
	 * @param E_RENDERMODE $rendermode
	 *
	 * @return bool >> true if the entry has been removed
	 */
	public function remove_contract_document($document_id="", $confirmed=0, $rendermode="FULLPAGE")
	{
		if ($this->input->post("document_id") != "" && $document_id == ""){
			$document_id = $this->input->post("document_id");
		}
		if ($this->input->post("confirmed") == true && $confirmed == 0){
			$confirmed = 1;
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($document_id == null || $document_id == "")
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return;
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result 		= new BASE_Result(false);	// action needs confirmation first
		$removed		= false;
		$result_doc 	= $this->app_model->BASE_Select(TBL_CONTRACTS_DOCUMENTS, array("client_id"=>$this->client_id, "document_id"=>$document_id), "*", array(), 1);

		write2Debugfile(self::DEBUG_FILENAME, "remove document [$document_id] -".print_r($result_doc, true), false);

		if (count($result_doc->getData()) == 1 && $result_doc->getError() == "")
		{
			$this->breadcrump = $result_doc->data->filename_original;

			if ($confirmed == 1) {
				$result	= $this->app_model->BASE_Update(TBL_CONTRACTS_DOCUMENTS, array("deleted"=>1, "deleted_by"=>$this->user_id, "deleted_at"=>time()), array("document_id"=>$document_id));
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "document[$document_id] NOT found", true);
			$this->breadcrump 	= $document_id;
			$result 			= new BASE_Result(false, lang("msg_document_not_found"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);

		if ($result->data == true && $result->error == "")
		{
			$removed = true;
			$this->setViewSuccess(lang("docuemtns_has_been_deleted"));
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);

		$this->render("root/contract/document_delete", $rendermode);
		return $removed;
	}

	/**
	 * Saves a contract after input validation and sets the viewdata
	 * Note: The permission check is made via validation callback (@see BASE_Form_validation)
	 *
	 * @version 1.2
	 *
	 * @param bool $edit 	>> create or update action
	 * @return boolean  	>> returns the saved state
	 */
	private function save($edit)
	{
		write2Debugfile('save_contracts.log', "save contract\n".print_r($this->input->post(), true), false);

		//$post 	= $this->input->post();
		$saved	= false;

		if ($this->input->post("contract_id") != "" && $edit == false){
			// correct wrong save mode
			$edit = true;
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set validation rules
		$this->form_validation->set_rules("contract_name", "lang:contract_name", "trim|required|max_length[255]");
		$this->form_validation->set_rules("contract_desc", "lang:contract_desc", "trim|max_length[65535]");

		$this->form_validation->set_rules("productgroup[]", "lang:productgroup", "required");

		$this->form_validation->set_rules("created_at", "lang:created_at", "trim|integer");
		$this->form_validation->set_rules("created_by", "lang:created_by", "trim|max_length[20]");
		$this->form_validation->set_rules("deleted", "lang:deleted", "trim|integer");
		$this->form_validation->set_rules("deleted_at", "lang:deleted_at", "trim|integer");
		$this->form_validation->set_rules("deleted_by", "lang:deleted_by", "trim|max_length[20]");
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
        $this->form_validation->set_rules("contract_startdate", "lang:contract_startdate", "trim|required");
		$this->form_validation->set_rules("contract_enddate", "lang:contract_enddate", "trim");
        $this->form_validation->set_rules("days_until_billing", "lang:days_until_billing", "trim");
        $this->form_validation->set_rules("max_month_perma_prescription", "lang:max_month_perma_prescription", "trim");
        $this->form_validation->set_rules("alidity_recipe_in_days", "lang:alidity_recipe_in_days", "trim");
        $this->form_validation->set_rules("limit_of_months_protest_billing", "lang:limit_of_months_protest_billing", "trim");
        $this->form_validation->set_rules("workdays_until_delivery", "lang:workdays_until_delivery", "trim|integer");

        $this->form_validation->set_rules("target_group_hc", "lang:target_group_hc", "trim|integer");
        $this->form_validation->set_rules("target_group_ap", "lang:target_group_ap", "trim|integer");
        $this->form_validation->set_rules("target_group_bh", "lang:target_group_bh", "trim|integer");

        $this->form_validation->set_rules("dsa", "lang:dsa", "trim|integer");
        $this->form_validation->set_rules("dbw", "lang:dbw", "trim|integer");

//        $this->form_validation->set_rules("allow_product_without_aidnr", "lang:allow_product_without_aidnr", "trim|integer");
        $this->form_validation->set_rules("monthly_accounting", "lang:monthly_accounting", "trim|integer");
        $this->form_validation->set_rules("original_rz", "lang:original_rz", "trim|integer");
        $this->form_validation->set_rules("copy_rz", "lang:copy_rz", "trim|integer");

        $this->form_validation->set_rules("original_gen", "lang:original_gen", "trim|integer");
        $this->form_validation->set_rules("copy_gen", "lang:copy_gen", "trim|integer");

        if ($this->input->post("copy_gen", true) != "" || $this->input->post("copy_gen", true) != ""){

        	$this->form_validation->set_rules("kv_requiered", "lang:kv_requiered", "trim|integer|required");
        }
        else{
	        //$this->form_validation->set_rules("kv_requiered", "lang:kv_requiered", "trim|integer");
        }

        $this->form_validation->set_rules("proof_of_delivery_needed", "lang:proof_of_delivery_needed", "trim");
        $this->form_validation->set_rules("difference_first_follow_supply", "lang:difference_first_follow_supply", "trim|integer");
        $this->form_validation->set_rules("area_based_restriction", "lang:area_based_restriction", "trim|integer");
       // $this->form_validation->set_rules("patient_documentation", "lang:patient_documentation", "trim|integer");
       // $this->form_validation->set_rules("consultation", "lang:consultation", "trim|integer");
        $this->form_validation->set_rules("billable_until_months", "lang:billable_until_months", "trim|integer");
        $this->form_validation->set_rules("restriction_plz", "lang:restriction_plz", "trim|validate_plz_restriction[".$this->input->post('restriction_plz')."]");
        $this->form_validation->set_rules("contract_legs", "lang:contract_legs", "trim|required|exact_length[7]");
		$this->form_validation->set_rules("non_flatrate_contract", "lang:non_flatrate_contract", "trim|integer");
		$this->form_validation->set_rules("kv_necessary_from_cost", "lang:kv_necessary_from_cost", array('trim','regex_match[/^[0-9,]+$/]'));
		$this->form_validation->set_rules("kv_necessary_from_piece", "lang:kv_necessary_from_piece", "trim|integer");
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$deleted_at = $this->input->post("deleted_at");
		if ($this->input->post("deleted") == "1" && $this->input->post("deleted_at") == ""){
			$deleted_at = time();
		}

		$deleted_by = $this->input->post("deleted_by");
		if ($this->input->post("deleted") == "1" && $this->input->post("deleted_by") == ""){
			$deleted_by = $this->getSessionData(E_SESSION_ITEM::USER_ID);
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($this->input->post("contract_id") == ""){
			$contract_id = BASE_Model::generateUID(TBL_CONTRACTS, "contract_id", $this->client_id."#", false, 20);
			$contract_revision = 1;
		}else{
			$contract_id 		= $this->input->post("contract_id");
			$contract_revision 	= $this->input->post("contract_revision");
		}

		$data = array(
			"client_id" => $this->client_id,
			"deleted" => ($this->input->post("deleted") == "1" ? 1:0),
			"deleted_at" => $deleted_at,
			"deleted_by" => $deleted_by,
			"contract_id" => $contract_id,
			"contract_name" => $this->input->post("contract_name"),
			"contract_desc" => $this->input->post("contract_desc"),
			"created_by" => $this->input->post("created_by")
		);


		if ($this->input->post("created_at") == "" && $edit == false){
			$data["created_at"] = time();
		}


		if ($this->input->post("created_by") == "" && $edit == false){
			$data["created_by"] = $this->getSessionData(E_SESSION_ITEM::USER_ID);
		}
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

		if($this->input->post("contract_startdate") && $this->input->post("contract_startdate") !='')
		{
			$data["contract_startdate"] = format_date2timestamp($this->input->post("contract_startdate"));
		}

        if($this->input->post("contract_enddate") && $this->input->post("contract_enddate") !='')
        {
            $data["contract_enddate"] = format_date2timestamp($this->input->post("contract_enddate"));
        }

        $postarray = $this->input->post(null, true);

        // Wenn Gebietsbezogene Eingrenzung nicht gesetzt ist, values der Eingrenzungen nicht speichern.
        $areabaseRestriction	= (isset($postarray["area_based_restriction"]) ? 1:0);
        $restrictionSubcountry	=""; //Bundeslandeingrenzung
        $restrictionPlz	        = ""; // PLZ-Gebiet Eingrenzen
        if($areabaseRestriction == 1)
        {
        	$restrictionSubcountry	= (isset($postarray["restriction_subcountry"])?json_encode($postarray['restriction_subcountry']):'');
        	$restrictionPlz		= $postarray["restriction_plz"];
        }

       $kv_necessary_from_cost = 0;
	   if(isset($postarray["kv_necessary_from_cost"])&& $postarray["kv_necessary_from_cost"] != '')
	   {

		$kv_necessary_from_cost = str_replace(',','.',$postarray["kv_necessary_from_cost"]);
	   }

    	$contracts_details = array(
            "client_id"                         => $this->client_id,
            "contract_id"                       => $contract_id,
            "contract_revision"					=> $contract_revision,
            "target_group_hc"                   => (isset($postarray["HC"])? 1:0),
            "target_group_ap"                   => (isset($postarray["AP"]) ? 1:0),
            "target_group_bh"                   => (isset($postarray["BH"]) ? 1:0),
            "dsa"                               => (isset($postarray["DSA"]) ? 1:0),
            "dbw"                               => (isset($postarray["DBW"])? 1:0),
            "kv_requiered"                      => (isset($postarray["kv_requiered"]) ? 1:0),
            "monthly_accounting"                => (isset($postarray["monthly_accounting"]) ? 1:0),
            "original_rz"                       => (isset($postarray["original_rz"]) ? 1:0),
            "copy_rz"                           => (isset($postarray["copy_rz"]) ? 1:0),
            "original_gen"                      => (isset($postarray["original_gen"]) ? 1:0),
            "copy_gen"                          => (isset($postarray["copy_gen"]) ? 1:0),
            "billing_not_supplied"              => (isset($postarray["billing_not_supplied"]) ? 1:0),
            "proof_of_delivery_needed"          => (isset($postarray["proof_of_delivery_needed"])?json_encode($postarray['proof_of_delivery_needed']):''),
            "ce_first_supply"					=> (isset($postarray["ce_first_supply"]) ? 1:0),
            "difference_first_follow_supply"    => (isset($postarray["difference_first_follow_supply"]) ? 1:0),
            "area_based_restriction"            => $areabaseRestriction,
            "days_until_billing"                => (isset($postarray["days_until_billing"])?$this->input->post("days_until_billing"):0),
            "max_month_perma_prescription"      => (isset($postarray["max_month_perma_prescription"])?$this->input->post("max_month_perma_prescription"):0),
            "alidity_recipe_in_days"            => (isset($postarray["alidity_recipe_in_days"])?$this->input->post("alidity_recipe_in_days"):0),
            "limit_of_months_protest_billing"   => (isset($postarray["limit_of_months_protest_billing"])?$this->input->post("limit_of_months_protest_billing"):0),
            "workdays_until_delivery"           => (isset($postarray["workdays_until_delivery"])?$this->input->post("workdays_until_delivery"):0),
            // "additional_payment_info"           => (isset($postarray["additional_payment_info"])?$this->input->post("additional_payment_info"):''),
            // "patient_documentation"             => (isset($postarray["patient_documentation"]) ? 1:0),
            //  "consultation"                      => (isset($postarray["consultation"]) ? 1:0),
            // "allow_product_without_aidnr"       => (isset($postarray["allow_product_without_aidnr"]) ? 1:0),
            "productgroup"                      => (isset($postarray["productgroup"])?json_encode($this->input->post("productgroup")):''),
            "billable_until_months"             => (isset($postarray["billable_until_months"])?$this->input->post("billable_until_months"):0),
            "restriction_subcountry"            => $restrictionSubcountry,
            "restriction_characteristic"        => (isset($postarray["restriction_characteristic"])?json_encode($postarray['restriction_characteristic']):''),
            "restriction_plz"                   =>$restrictionPlz,
            "contract_legs"						=>(isset($postarray["contract_legs"]) ? $postarray["contract_legs"]:''),
		 "non_flatrate_contract"=>(isset($postarray["non_flatrate_contract"]) ? 1:0),
		 "kv_necessary_from_cost"=>$kv_necessary_from_cost,
		"kv_necessary_from_piece"             => (isset($postarray["kv_necessary_from_piece"])?$this->input->post("kv_necessary_from_piece"):0)
        );


		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($this->form_validation->run() )
		{
			write2Debugfile(self::DEBUG_FILENAME, "\n - form validation passed...", true);

			if ($edit == true){
			    $result = $this->contract_model->update($this->client_id, $this->input->post("contract_id"), $data,$contracts_details);
			}
			else{
			    $result = $this->contract_model->create($this->client_id, $data, $contracts_details );
			}
		}
		else {
			$result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
			write2Debugfile(self::DEBUG_FILENAME, "\n - form validation failed...\n".validation_errors(), true);

		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		if ($result->error == "")
		{
			$this->setViewSuccess(lang("contract_has_been_saved"));
			$saved = true;
		}
		$this->setViewData("contract", $data);	// fill the contract with the givven post data so the view can populate a filled out form
		$this->setViewData("saved", $saved);

		// $this->setViewData("additional_viewdata", array() );

		write2Debugfile(self::DEBUG_FILENAME, "\nthis->data\n".print_r($this->data, true));

		return $saved;
	}

	/**
	 * Saves the contract insurances after input validation
	 *
	 * @version 1.0
	 */
	public function save_health_insurances()
	{

		$this->form_validation->set_rules("contract_id_insurances", "lang:contract", "trim|required|max_length[20]");
		$this->form_validation->set_rules("contract_rev_insurances", "lang:revision", "trim|required|max_length[20]");
		$this->form_validation->set_rules("selected_health_insurances", "lang:health_insurances", "trim");


		if ($this->form_validation->run() )
		{
			$contract_id 		= $this->input->post("contract_id_insurances", true);
			$contract_revision 	= $this->input->post("contract_rev_insurances", true);

			$insurance_data	 	= $this->input->post("insurance_data", true);
			$ece_conditions = $this->input->post("ece_condition", true);
			$alternative_iks = $this->input->post("alternative_iks", true);
			$ekvs = $this->input->post("ekv", true);

			$ekv_data = $this->input->post("ekv", true);
			$data = array();
			if ($this->input->post("selected_health_insurances", true) != ""){
				$data = array_flip(explode(',',  $this->input->post("selected_health_insurances", true)));
			}

			$final = array();
			foreach (array_keys($data) as $ik)
			{
				if($ik == ""){
					continue; // just 2 be sure
				}


				$legs = $insurance_data[$ik]["legs"];
				/*
				$ekv = 0;
				if(in_array($ik,$ekv_data))
				{
				    $ekv = 1;
				}
				*/
				$ac	= substr($legs, 0, 2);	// Abrechnungscode
				$tk 	= substr($legs, 2, 2);	// Tarifkennzeichen
				$stk 	= substr($legs, 4, 3);	// Sondertarifkennzeichen

				//$legs_seperated = $ac."-".$tk."-".$stk;
				$legs_empty = "";
				$ece_condition = (array_key_exists($ik, $ece_conditions) ? $ece_conditions[$ik] : 0);
				$alternative_ik = (array_key_exists($ik, $alternative_iks) ? $alternative_iks[$ik] : "");
				$ekv = (array_key_exists($ik, $ekvs) ? $ekvs[$ik] : 0);

				$final[$ik] = array(
					"ik_number" => $ik,
					"alternative_insurance_id" => $alternative_ik,
					"legs" => $legs_empty,
					"electronic_cost_estimate"=>$ekv,
					"ece_condition"=>$ece_condition,
				);

			}

			write2Debugfile("save_health_insurances.log", "\n - form validation passed...".print_r($this->input->post(), true), true);

			$result = $this->contract_model->save_health_insurances($this->client_id, $contract_id, $contract_revision, $final );
		}
		else {
			$result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
			write2Debugfile("save_health_insurances.log", "\n - form validation failed...\n".validation_errors(), true);
		}


		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON);
	}

	/**
	 * render the contract list
	 * @version 1.2
	 *
	 * @param E_RENDERMODE $rendermode
	 */
	public function show($rendermode="FULLPAGE")
	{
		$data = array();
		if ($this->getSessionData(E_SESSION_ITEM::JS_ENABLED) == false)
		{
			// load table data immediatly since the ajax way will not work without js
			$edit			= $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_EDIT);
			$delete			= $this->hasPermission(E_PERMISSIONS::ROOT_CONTRACT_DELETE);
			$modelResult 	= $this->contract_model->datatable( $this->client_id, $this->table_columns, $edit, $delete );
			$data 			= json_decode($modelResult->getData())->data;
		}

		//global doc part

		$result_contract = $this->contract_model->load( $this->client_id, 1 );
		//die(echome($result_contract->data));

		$this->setViewData("available_document_types", $this->available_document_types );
		$this->setViewData("available_global_documents", $this->available_global_documents);
		$this->setViewData("contract", $result_contract->data );
		//$test = $this->contract_model->getEGEKOCredentials($this->client_id);
		//die("<pre>".print_r($test,true)."</pre>");
		$this->setViewData("general_settings", $this->contract_model->getGeneralSettings($this->client_id));


		//global doc part END

		write2Debugfile(self::DEBUG_FILENAME, " - root/contract/show\n".print_r($data, true), false);

		$this->setViewData("table_data", $data);
		$this->setViewData("table_columns", $this->table_columns );

		$this->render("root/contract/contract_list", $rendermode);
	}

	/**
	 * upload function for contract documents
	 *
	 * @param string $contract_id
	 * @param E_RENDERMODE $rendermode
	 */
	public function upload_contract_document()
	{
		$result = new BASE_Result(false, lang("missing_parameters") );

		write2Debugfile("upload_contract_document.log", "\n - try to upload document - ".print_r($_FILES, true), false);

		$this->form_validation->set_rules("contract_id", "lang:contract_desc", 'trim|required|max_length[20]|min_length[1]|validate_existance['.TBL_CONTRACTS.', contract_id, '.lang('unknown_contract').']');
		$this->form_validation->set_rules("document_type", "lang:document_type", 'trim|required|max_length[20]|min_length[1]|validate_existance['.TBL_DOCUMENT_TYPES.', document_type, '.lang('unknown_document_type').']');
		$this->form_validation->set_rules("custom_document_name", "lang:custom_document_name", 'trim|max_length[255]');

		if ($this->input->post("available_sn", true) == 0 && $this->input->post("available_bw", true) == 0){
			$this->form_validation->set_message('available', lang("range_of_validity_should_be_set"));
		}

		if ($this->form_validation->run() )
		{

			$contract_id 	= $this->input->post("contract_id", true);
			$document_type	= $this->input->post("document_type", true);
			$custom_document_name = $this->input->post("custom_document_name", true);
			write2Debugfile("upload_contract_document.log", "\n - form validation passed...", true);

			if (isset($_FILES['upload']['name'][0]) && $contract_id != "" && $document_type != "" )
			{
				if ($this->config->item("upload_folder") == ""){
					show_error("missing upload path");
				}

				$upl_path	= $this->config->item("root_path") . $this->config->item("upload_folder");
				$upl_dir	= "contract_docs/". $contract_id."/";
				$path		= $upl_path . $upl_dir;

				if (! is_dir( $path )) {		// create the needed directories, if needed
					mkdir($path, 0777, true);
				}

				write2Debugfile("upload_contract_document.log", "\nupload-path: ".$path);

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// start the upload
				$this->load->library("BASE_Uploader");

				$uploader 					= new BASE_Uploader();
				$uploader->renameFiles		= true;
				$uploader->UploadDirectory 	= $path;
				$uploader->Email			= $this->config->item("email_upload");
				$uploader->FileName			= safe_utf8_decode(basename($_FILES['upload']['name'][0]));
				$uploader->TempFileName		= $_FILES['upload']['tmp_name'][0];
				$uploader->IsImage			= true;
				$uploader->MaximumFileSize	= 40000000; // 10 MB max
				$uploader->ValidExtensions	= array("pdf","jpg","jpeg");

				$result = $uploader->UploadFile();

				write2Debugfile("upload_contract_document.log", "\nupload-result: ".print_r($result, true));

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				if ($result->data["file"] != "" && $result->data["filepath"] != "" && is_file($result->data["filepath"]))
				{
					write2Debugfile("upload_contract_document.log", "\n - file uploaded - saving data");
					$result->error	= "";

					$data = array(
						"client_id"			=> $this->client_id,
						"contract_id"		=> $contract_id,
						"contract_revision"		=> 1,
						"document_id"		=> BASE_Model::generateUID(TBL_CONTRACTS_DOCUMENTS, "document_id"),
						"document_type"		=> $document_type,
						"filename_original"		=> $_FILES['upload']['name'][0],
						"filename"			=> $result->data["file"],
						"available_sn"		=> ($this->input->post("available_sn", true) == "true" ? 1:0),
						"available_bw"		=> ($this->input->post("available_bw", true) == "true" ? 1:0),
						"uploaded_at"		=> time(),
						"uploaded_by"		=> $this->user_id,
						"custom_document_name"=>($custom_document_name != '' ? $custom_document_name : $_FILES['upload']['name'][0]),
						"billing_relevant"		=> ($this->input->post("billing_relevant", true) == "true" ? 1:0),
						"mandatory_to_complete"	=> ($this->input->post("mandatory_to_complete", true) == "true" ? 1:0),
						"to_be_signed_by_insured_person"	=> ($this->input->post("to_be_signed_by_insured_person", true) == "true" ? 1:0)
					);
					$result_update = $this->contract_model->BASE_Insert(TBL_CONTRACTS_DOCUMENTS, $data);

					write2Debugfile("upload_contract_document.log", "\nresult-update".print_r($result_update, true));

					if ($result_update->error != ""){
						$result->error = $result_update->error;
					}
				}
			}
			else{
				$result->error	= lang("msg_nothing_to_upload");
			}
		}
		else {
			$result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
			write2Debugfile("upload_contract_document.log", "\n - form validation failed...\n".validation_errors(), true);
		}

		$this->setData($result);
		$this->render("root/contract/contract_form", E_RENDERMODE::JSON);
	}



	function setContractId($id)
	{
	    $this->contract_id = $id;
	}

	function load_flatrate_articles()
	{
	   return $this->contract_model->loadFlatratearticles($this->client_id);
	}

	function create_flatrate($contract_id=null, $contract_revision=null, $rendermode="fullpage")
	{
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}
		if ($contract_id == null || $contract_id == "" || $contract_revision == null || $contract_revision == "" )
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return;
		}
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->breadcrump = "Vertragsname";

		if (is_array($this->input->post()) && $this->input->post("save_flatrate") == 1 )
		{	// only if we have a post, we try to save. Note that the save method also sets viewdata
			self::save_flatrate(false);
		}
		else
		{
			$this->setViewData("contract_flatrate", array(
				"client_id" => $this->client_id,
				"contract_id" => $contract_id,
				"contract_revision" => $contract_revision
			));
		}

		write2Debugfile(self::DEBUG_FILENAME, "create new flatrate\n".print_r($this->data, true));

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->setViewData("as_modal", $this->input->post("as_modal"));
		$this->setViewData("id_modal", $this->input->post("id_modal"));
		$this->setViewData("flatrate_articles", $this->flatrate_articles);
		$this->setViewData("available_subcountries", $this->available_subcountries);

		$this->render("root/contract/contract_flatrates", $rendermode);
	}


	private function save_flatrate($edit)
	{
		$saved = false;

		if ($this->input->post("flatrate_id") != "" && $edit == false){
			// correct wrong save mode
			$edit = true;
		}


		$this->form_validation->set_rules("contract_id_flatrates", 		"lang:contract_id", "trim|required|max_length[20]");
		$this->form_validation->set_rules("contract_rev_flatrates",	 	"lang:revision", "trim|required|max_length[10]");
		$this->form_validation->set_rules("flatrate_name", 				"lang:flatrate_name", "trim|required|max_length[255]");
		$this->form_validation->set_rules("flatrate_article", 			"lang:flatrate_article", "trim|required|max_length[20]");
		$this->form_validation->set_rules("flatrate_comment", 			"lang:flatrate_comment", "trim|max_length[65535]");
		$this->form_validation->set_rules("AF", 						"lang:af", "trim|integer");
		$this->form_validation->set_rules("AP", 						"lang:ap", "trim|integer");
		$this->form_validation->set_rules("STATIONARY", 				"lang:stationary", "trim|integer");
		$this->form_validation->set_rules("AMBULANT", 					"lang:ambulant", "trim|integer");
		$this->form_validation->set_rules("HANDYCAP", 					"lang:handycap", "trim|integer");
		//$this->form_validation->set_rules("flatrate_subcountry", 		"lang:contract_flatrate_subcountry", 'trim');
		$this->form_validation->set_rules("flatrate_age_from", 		"lang:flatrate_age_from", 'trim|integer');
		$this->form_validation->set_rules("flatrate_age_to", 		"lang:flatrate_age_to", 'trim|integer|greater_than['.$this->input->post("flatrate_age_from").']');

		$this->form_validation->set_rules("flatrate_valid_from", "lang:flatrate_valid_from", "trim");
		$this->form_validation->set_rules("flatrate_valid_to", "lang:flatrate_valid_to", "trim");

		if ($this->input->post("flatrate_id") == ""){
			$flatrate_id = BASE_Model::generateUID(TBL_CONTRACTS_FLATRATES, "flatrate_id", $this->client_id."#", false, 20);
		}else{
			$flatrate_id = $this->input->post("flatrate_id", true);
		}
		if ($this->form_validation->run() )
		{
			$contract_id		    = $this->input->post("contract_id_flatrates", true);
			$contract_revision	    = $this->input->post("contract_rev_flatrates", true);

			$flatrate_valid_from = NULL;
			if($timestampflatrate_valid_from =  strtotime($this->input->post("flatrate_valid_from", true)))
			{
				$flatrate_valid_from = $timestampflatrate_valid_from;
			}
			$flatrate_valid_to = NULL;
			if($timestampflatrate_valid_to =  strtotime($this->input->post("flatrate_valid_to", true)))
			{
				$flatrate_valid_to = $timestampflatrate_valid_to;
			}

			$postarray = $this->input->post();
			$data = array(
				'contract_id'		 	=> $contract_id,
				'contract_revision'		=> $contract_revision,
				'flatrate_id'			=> $flatrate_id,
				'flatrate_name'			=> $this->input->post("flatrate_name", true),
				'flatrate_comment'		=> $this->input->post("flatrate_comment", true),
				'flatrate_age_from'		=> ($this->input->post("flatrate_age_from", true) == "" ? null:$this->input->post("flatrate_age_from", true)) ,
				'flatrate_age_to'		=> ($this->input->post("flatrate_age_to", true) == "" ? null:$this->input->post("flatrate_age_to", true)),
				'flatrate_article'		=> $this->input->post("flatrate_article", true),
			//	'flatrate_subcountry'	=> $this->input->post("flatrate_subcountry", true),
				"af"				=> (isset($postarray["AF"]) ? 1:0),
				"ap"				=> (isset($postarray["AP"]) ? 1:0),
				"stationary"			=> (isset($postarray["STATIONARY"]) ? 1:0),
				"ambulant"			=> (isset($postarray["AMBULANT"]) ? 1:0),
				"handycap"			=> (isset($postarray["HANDYCAP"]) ? 1:0),
				"flatrate_valid_from"	=> $flatrate_valid_from,
				"flatrate_valid_to"		=> $flatrate_valid_to
			);

			write2Debugfile('save_flatrate.log', print_r($this->input->post(),true));

			if ($edit === true){
				$result = $this->contract_model->update_flatrates($this->client_id, $contract_id, $contract_revision, $flatrate_id,  $data);
			}
			else{
				$result = $this->contract_model->save_flatrates($this->client_id, $contract_id, $contract_revision, $data );
			}
		}
		else {
			$result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
			write2Debugfile('save_flatrate.log', "\n - form validation failed...\n".validation_errors(), true);
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		if ($result->error == "")
		{
			$this->setViewSuccess(lang("flatrate_has_been_saved"));
			$saved = true;
		}
		$this->setViewData("contract_flatrate", $data);	// fill the contract with the givven post data so the view can populate a filled out form
		$this->setViewData("saved", $saved);

		write2Debugfile(self::DEBUG_FILENAME, "\nthis->data\n".print_r($this->data, true));

		return $saved;
	}
	/**
	 * Deletes a entry. Acccepts also POST-Data.
	 *
	 * @version 1.2
	 *
	 * @param string $contract_id >> contract id.
	 * @param string $flatrate_id >> flatrate_id.
	 * @param string $revision >> revision.
	 * @param bool $confirmed >> if true, the user has already confirmed this action.
	 * @param E_RENDERMODE $rendermode
	 *
	 * @return bool >> true if the entry has been removed
	 */
	public function remove_flatrate($contract_id=null, $contract_revision=null, $flatrate_id="", $confirmed=0, $rendermode="FULLPAGE")
	{
		if ($this->input->post("contract_id") != "" && $contract_id == ""){
			$contract_id = $this->input->post("contract_id");
		}
		if ($this->input->post("flatrate_id") != "" && $flatrate_id == ""){
			$flatrate_id = $this->input->post("flatrate_id");
		}
		if ($this->input->post("contract_revision") != "" && $contract_revision == ""){
			$contract_revision = $this->input->post("contract_revision");
		}
		if ($this->input->post("confirmed") == true && $confirmed == 0){
			$confirmed = 1;
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($contract_id == null || $contract_id == "" || $contract_revision == null || $contract_revision == "" || $flatrate_id == null || $flatrate_id == "")
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return;
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result 			= new BASE_Result(false);	// action needs confirmation first
		$removed			= false;
		$result_contract 	= $this->contract_model->load_contract_flatrates( $this->client_id, $contract_id, $contract_revision, $flatrate_id,1,0);

		write2Debugfile("remove_flatrate.log", "remove contract [$contract_id] -".print_r($result_contract, true), false);

		if (count($result_contract->getData()) == 1 && $result_contract->getError() == "")
		{
		    if ($confirmed == 1)
		    {
		    	$result	= $this->contract_model->remove_flatrate($this->client_id, $contract_id, $contract_revision, $flatrate_id, $this->user_id);
		    	write2Debugfile("remove_flatrate.log", "remove contract [$flatrate_id] -".print_r($result, true), false);
		    }
		}
		else
		{
		    write2Debugfile(self::DEBUG_FILENAME, "contract[$contract_id] NOT found", true);
		    $result	    = new BASE_Result(false, lang("msg_flatrate_not_found"));
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);

		if ($result->data == true && $result->error == "")
		{
		    $removed = true;
		    $this->setViewSuccess(lang("flatrate_has_been_deleted"));
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);
		$this->setViewData("contract", $result_contract->data);

		$this->render("root/contract/contract_delete", $rendermode);
		return $removed;
	}

	/**
	 * Deletes a contract document. Acccepts also POST-Data.
	 *
	 * @version 1.2
	 *
	 * @param string $document_id >> document id, you want to delete.
	 * @param bool $confirmed >> if true, the user has already confirmed this action.
	 * @param E_RENDERMODE $rendermode
	 *
	 * @return bool >> true if the entry has been removed
	 */
	public function edit_contract_document_parameters($contract_id ="",$document_id="", $custom_document_name="", $available_bw=0, $available_sn=0, $billing_relevant=0, $mandatory_to_complete=0, $to_be_signed_by_insured_person=0,$rendermode="FULLPAGE")
	{
		if ($this->input->post("contract_id") != "" && $contract_id == ""){
			$contract_id = $this->input->post("contract_id");
		}
		if ($this->input->post("document_id") != "" && $document_id == ""){
			$document_id = $this->input->post("document_id");
		}
		if ($this->input->post("custom_document_name") != "" && $custom_document_name == ""){
			$custom_document_name = $this->input->post("custom_document_name");
		}
		if ($this->input->post("available_bw") != "" && $available_bw == 0){
			$available_bw = $this->input->post("available_bw");
		}
		if ($this->input->post("available_sn") != "" && $available_sn ==0){
			$available_sn = $this->input->post("available_sn");
		}
		if ($this->input->post("billing_relevant") != "" && $billing_relevant ==0){
			$billing_relevant = $this->input->post("billing_relevant");
		}
		if ($this->input->post("mandatory_to_complete") != "" && $mandatory_to_complete == 0){
			$mandatory_to_complete = $this->input->post("mandatory_to_complete");
		}
		if ($this->input->post("to_be_signed_by_insured_person") != "" && $to_be_signed_by_insured_person == 0){
			$to_be_signed_by_insured_person = $this->input->post("to_be_signed_by_insured_person");
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}
		 write2Debugfile('edit_contract_document_parameters.log', print_r($this->input->post() ,true), true);
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($contract_id == null || $contract_id == "" ||$document_id == null || $document_id == "")
		{
			$this->render("errors/error_invalid_parameter", E_RENDERMODE::JSON);
			return;
		}

		$updateData = array();
		$updateData['custom_document_name'] = $custom_document_name;
		$updateData['available_bw'] = ($available_bw);
		$updateData['available_sn'] = ($available_sn);
		$updateData['billing_relevant'] = ($billing_relevant);
		$updateData['mandatory_to_complete'] = ($mandatory_to_complete);
		$updateData['to_be_signed_by_insured_person'] = ($to_be_signed_by_insured_person);

		$result = $this->app_model->BASE_Update(TBL_CONTRACTS_DOCUMENTS, $updateData, array("client_id"=>$this->client_id,"document_id"=>$document_id));
		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON);

	}
	public function save_contract_further_informations($contract_id="", $contract_revision="", $rendermode="FULLPAGE")
	{
		if ($this->input->post("contract_id_further_informations") != "" && $contract_id == ""){
			$contract_id = $this->input->post("contract_id_further_informations");
		}
		if ($this->input->post("contract_rev_further_informations") != "" && $contract_revision == ""){
			$contract_revision = $this->input->post("contract_rev_further_informations");
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}
		$client_id = $this->client_id;
		$this->form_validation->set_rules("general_information", 			"lang:general_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("consultation_admission", 		"lang:consultation_admission", "trim|max_length[65535]");
		$this->form_validation->set_rules("prescription_information", 		"lang:prescription_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("cost_estimate_information",		"lang:cost_estimate_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("supply_information",				"lang:supply_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("product_information", 			"lang:product_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("delivery_information", 			"lang:delivery_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("flatrate_information",			"lang:flatrate_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("proof_of_delivery_information",	"lang:proof_of_delivery_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("billing_information",			"lang:billing_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("enumeration_information", 		"lang:enumeration_information", "trim|max_length[65535]");
		$this->form_validation->set_rules("notes_information",				"lang:notes_information", "trim|max_length[65535]");

		//TBL_CONTRACTS_FURTHER_INFO
		$result 		= new BASE_Result(false);	// action needs confirmation first
		$updated		= false;



		$data = array(
				"general_information"=>$this->input->post("general_information"),
				"consultation_admission"=>$this->input->post("consultation_admission"),
				"prescription_information"=>$this->input->post("prescription_information"),
				"cost_estimate_information"=>$this->input->post("cost_estimate_information"),
				"supply_information"=>$this->input->post("supply_information"),
				"product_information"=>$this->input->post("product_information"),
				"delivery_information"=>$this->input->post("delivery_information"),
				"flatrate_information"=>$this->input->post("flatrate_information"),
				"proof_of_delivery_information"=>$this->input->post("proof_of_delivery_information"),
				"billing_information"=>$this->input->post("billing_information"),
				"enumeration_information"=>$this->input->post("enumeration_information"),
				"notes_information"=>$this->input->post("notes_information")
		);

		if ($this->form_validation->run() )
		{
			$result_further_informations		    = $this->app_model->BASE_Select(TBL_CONTRACTS_FURTHER_INFO, array("client_id"=>$this->client_id, "contract_id"=>$contract_id, "contract_revision"=>$contract_revision), "*", array(), 1);
			if (count($result_further_informations->getData()) == 1 && $result_further_informations->getError() == "")
			{
				$result = $this->app_model->BASE_Update(TBL_CONTRACTS_FURTHER_INFO, $data, array("client_id"=>$client_id, "contract_id"=>$contract_id, "contract_revision"=>$contract_revision));
			}
			else
			{
				$data['client_id']		= $client_id;
				$data['contract_id']	= $contract_id;
				$data['contract_revision'] = $contract_revision;

				$result = $this->contract_model->BASE_Insert(TBL_CONTRACTS_FURTHER_INFO, $data);
			}
		}
		else
		{
			$result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		write2Debugfile('save_contract_further_informations.log', print_r($result ,true)."\nRendermode: ".$rendermode);
		if ($result->data == true && $result->error == "")
		{
			$updated = true;
			$this->setViewSuccess(lang("further_informations_changed"));
		}
		$this->setViewData("contract", $data);
		$this->setViewData("contract_revision", $contract_revision);

		$this->render("root/contract/contract_further_information", $rendermode);
		return $updated;


	}

	public function copyContract($contract_id='', $contract_revision="", $newContractName='', $rendermode='FULLPAGE')
	{
		$client_id = $this->client_id;

		if ($this->input->post("contract_id") != "" && $contract_id == "")
		{
			$contract_id = $this->input->post("contract_id");
		}

		if ($this->input->post("contract_revision") != "" && $contract_revision == "")
		{
			$contract_revision = $this->input->post("contract_revision");
		}

		if ($this->input->post("new_copy_contract_name") != "" && $newContractName == "")
		{
			$newContractName = $this->input->post("new_copy_contract_name",true);
		}

		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode"))))
		{
			$rendermode = strtoupper($this->input->post("rendermode"));
		}

		$newContractID = BASE_Model::generateUID(TBL_CONTRACTS, "contract_id");
		$copy_result = $this->contract_model->copyContract($client_id, $contract_id, $newContractID, $newContractName);
		/**
		 * $this->setData($result);

		if ($result->data == true && $result->error == "")
		{
		    $removed = true;
		    $this->setViewSuccess(lang("flatrate_has_been_deleted"));
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);
		$this->setViewData("contract", $result_contract->data);

		$this->render("root/contract/contract_delete", $rendermode);
		return $removed;
		 */

		$this->setData($copy_result);
		if ($copy_result->data == true && $copy_result->error == "")
		{
		    $copied = true;
		    $this->setViewSuccess(lang("flatrate_has_been_deleted"));
		}



		$this->setViewData("copied", $copied);
		$this->setViewData("confirmed", $confirmed);

		$this->render("root/contract/contract_delete", $rendermode);

		return $copy_result;
	}

	/**
	 * @throws Exception
	 */
	public function save_general_settings()
    {
        $update = array("client_egeko_username"=>$this->input->post("username"),
                        "client_egeko_password"=>$this->input->post("password"),
                        "client_egeko_name"=>$this->input->post("egeko_name"),
						"client_delivery_lead_time"=>$this->input->post("delivery_lead_time"));
        $result = $this->app_model->BASE_Update(TBL_CLIENTS, $update, array("client_id"=>$this->client_id));
        $this->setData($result);
        $this->render(null, E_RENDERMODE::JSON);
    }
}


?>
