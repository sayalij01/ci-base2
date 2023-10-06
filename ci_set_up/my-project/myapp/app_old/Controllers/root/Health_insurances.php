<?php if ( ! defined("BASEPATH")) exit("No direct script access allowed");
/**
 * Health-Insurances controller
 *
 * @author Marco Eberhardt
 * @category controller
 * @package application/controllers/admin/health_insurances
 * @version 1.0
 */
class Health_insurances extends BASE_Controller 
{
	const DEBUG_FILENAME = "health_insurance.log";
		
	/**
	 * array of HTML_DTColumns for the health_insurance table
	 * @var array
	 */
	private $table_columns		= array();
	
	/**
	 * Constructor for the health_insurance controller
	 */
	function __construct()
	{
		parent::__construct(true, false);
		
		$this->load->library("value_objects/T_Health_insurance.php");
		$this->load->model("health_insurance_model");

    	$this->javascript		= array("health_insurances.js");
    	
    	$this->addPlugins(
			E_PLUGIN::DATATABLES,
			E_PLUGIN::BS_TOGGLE
    	);
    	
    	$this->table_columns = T_Health_insurance::get_table_columns();
		
		write2Debugfile(self::DEBUG_FILENAME, "application/controllers/admin/\ntable-columns-".print_r($this->table_columns, true), false);
	}
	
	/**
	 * default entry point. leads to the show method
	 */
	public function index() {
        self::show();
	}
	
	/**
	 * render view to create new health_insurance
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

		$saved = false;
		if (is_array($this->input->post()) && $this->input->post("save") == 1 )
		{	// only if we have a post, we try to save. Note that the save method also sets viewdata
			$saved = self::save(false);
		}
		else
		{
			$this->setViewData("health_insurance", array());
		}

		write2Debugfile(self::DEBUG_FILENAME, "create new health_insurance\n".print_r($this->data, true));
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// $this->setViewData("additional_viewdata", array() );

		$this->render("root/health_insurance/health_insurance_form", $rendermode);
	}
	
	/**
	 * Ajax data-source for the datatable.
	 * JSON-Rendermode
	 *
	 * @version 1.2
	 */
	public function datatable()
	{
		if ($this->hasPermission(E_PERMISSIONS::ROOT_HEALTH_INSURANCE_LIST))
		{
			$edit	= $this->hasPermission(E_PERMISSIONS::ROOT_HEALTH_INSURANCE_EDIT);
			$delete	= $this->hasPermission(E_PERMISSIONS::ROOT_HEALTH_INSURANCE_DELETE);
				
			$result 		= $this->health_insurance_model->datatable( $this->client_id, $this->table_columns, $edit, $delete);
			$result->data 	= json_decode($result->data);	// because the render method (JSON_DATA) will encode it again
			write2Debugfile(self::DEBUG_FILENAME, "\nhealth_insurance datatable edit[$edit] del[$delete] columns-".print_r($this->table_columns, true)."\n".print_r($result, true));
		}
		else{
			$result = new BASE_Result(json_encode(array()), lang("msg_no_permission"), null, E_STATUS_CODE::FORBIDDEN);
		}
		
		$this->setData($result);
		$this->render(null, E_RENDERMODE::JSON_DATA);
	}
	
	/**
	 * load health_insurance entry, set viewdata and render the form
	 * 
	 * @version 1.2
	 * @param string $ik_number >> health_insurance identifier
	 * @param E_RENDERMODE $rendermode 
	 */
	public function edit($ik_number=null, $rendermode="FULLPAGE")
	{
		if ($this->input->post("ik_number") != ""){
			$ik_number = $this->input->post("ik_number");
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::.. wenn dann  hidden_ik_number
		if ($ik_number == null || $ik_number == "") 
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return; 
		}
			
		
		
		/*
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result_health_insurance = $this->health_insurance_model->load( $this->client_id, $ik_number );
		
		write2Debugfile(self::DEBUG_FILENAME, "edit health_insurance client_id[".$this->client_id."] ik_number[$ik_number] -".print_r($result_health_insurance, true));
		
		if (count($result_health_insurance->getData()) == 1 && $result_health_insurance->getError() == "")
		{
			$this->breadcrump = $result_health_insurance->data->insurance_name;
			
			$saved = false;
			if (is_array($this->input->post()) && $this->input->post("save") == 1 )
			{	// if we have a post, we try to save. Note that the save method sets viewdata 
			    
				$saved = self::save(true);
			}
			else
			{
				$this->setViewData("health_insurance", $result_health_insurance->data );
			}	
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "health_insurance[$ik_number] NOT found", true);
			$this->breadcrump = $ik_number;
			$this->setViewError(lang("msg_not_found"));
		}
		*/
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// $this->setViewData("additional_viewdata", array() );
			$saved = false;
			if (is_array($this->input->post()) && $this->input->post("save") == 1 )
			{	// if we have a post, we try to save. Note that the save method sets viewdata 
			    
				$saved = self::save(true);
			}
			else
			{
				$result_health_insurance = $this->health_insurance_model->load( $this->client_id, $ik_number );
		
					write2Debugfile('health_insurance_edit.log', "edit health_insurance client_id[".$this->client_id."] ik_number[$ik_number] -".print_r($result_health_insurance->data, true));
					
					if (count($result_health_insurance->getData()) == 1 && $result_health_insurance->getError() == "")
					{
						$this->breadcrump = $result_health_insurance->data->insurance_name;
						$this->setViewData("health_insurance", $result_health_insurance->data[0] );
						
					}
					else {
						write2Debugfile(self::DEBUG_FILENAME, "health_insurance[$ik_number] NOT found", true);
						$this->breadcrump = $ik_number;
						$this->setViewError(lang("msg_not_found"));
					}
			}	
		$this->render("root/health_insurance/health_insurance_form", $rendermode);
	}
	
	/**
	 * Deletes a entry. Acccepts also POST-Data.
	 * 
	 * @version 1.2
	 * 
	 * @param string $ik_number >> ik_number, you want to delete.
	 * @param bool $confirmed >> if true, the user has already confirmed this action.
	 * @param E_RENDERMODE $rendermode
	 * 
	 * @return bool >> true if the entry has been removed
	 */
	public function remove($ik_number="", $confirmed=0, $rendermode="FULLPAGE")
	{
		if ($this->input->post("ik_number") != "" && $ik_number == ""){
			$ik_number = $this->input->post("ik_number");
		}
		if ($this->input->post("confirmed") == true && $confirmed == 0){
			$confirmed = 1;
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($ik_number == null || $ik_number == "") 
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return; 
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$result 		= new BASE_Result(false);	// action needs confirmation first
		$removed		= false;
		$result_health_insurance 	= $this->health_insurance_model->load( $this->client_id, $ik_number );
		
		write2Debugfile(self::DEBUG_FILENAME, "remove health_insurance [$ik_number] -".print_r($result_health_insurance, true), false);
		
		if (count($result_health_insurance->getData()) == 1 && $result_health_insurance->getError() == "")
		{
			$this->breadcrump = $result_health_insurance->data->ik_number;
			
			if ($confirmed == 1) {
				$result	= $this->health_insurance_model->remove($this->client_id, $ik_number, $this->getSessionData(E_SESSION_ITEM::USER_ID));
			}
		}
		else {
			write2Debugfile(self::DEBUG_FILENAME, "health_insurance[$ik_number] NOT found", true);
			$this->breadcrump 	= $ik_number;
			$result 			= new BASE_Result(false, lang("msg_health_insurance_not_found"));
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		
		if ($result->data == true && $result->error == "")
		{
			$removed = true;
			$this->setViewSuccess(lang("health_insurance_has_been_deleted"));
		}
		$this->setViewData("removed", $removed);
		$this->setViewData("confirmed", $confirmed);
		$this->setViewData("health_insurance", $result_health_insurance->data);
		
		$this->render("root/health_insurance/health_insurance_delete", $rendermode);
		return $removed;
	}
	
	/**
	 * Saves a health_insurance after input validation and sets the viewdata
	 * 
	 * @version 1.2
	 * 
	 * @param bool $edit 	>> create or update action
	 * @return boolean  	>> returns the saved state
	 */
	private function save($edit)
	{
		write2Debugfile('44.log', "save health_insurance\n".print_r($this->input->post(), true), false);
		
	
		$post 	= $this->input->post();
		$saved	= false;
		
		if ($this->input->post("insurance_id") != "" && $edit == false){	
			// correct wrong save mode
			$edit = true;
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set validation rules
		$this->form_validation->set_rules("ik_number", "lang:ik_number", "trim|required|max_length[9]|validate_is_unique[".$this->input->post('hidden_ik_number').",".TBL_INSURANCES.",ik_number, ".lang("ik_already_exist")."]");
		$this->form_validation->set_rules("insurance_name", "lang:insurance_name", "trim|required|max_length[255]");
		$this->form_validation->set_rules("street", "lang:street", "trim|max_length[255]");
		$this->form_validation->set_rules("zipcode", "lang:zipcode", "trim|max_length[10]");
		$this->form_validation->set_rules("location", "lang:location", "trim|max_length[255]");
		$this->form_validation->set_rules("phone", "lang:phone", "trim|max_length[50]");
		$this->form_validation->set_rules("fax", "lang:fax", "trim|max_length[50]");
		$this->form_validation->set_rules("created_at", "lang:created_at", "trim|integer");
		$this->form_validation->set_rules("deleted", "lang:deleted", "trim|integer");
		$this->form_validation->set_rules("deleted_by", "lang:deleted_by", "trim|max_length[20]");
		$this->form_validation->set_rules("deleted_at", "lang:deleted_at", "trim|integer");

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
		
		$data = array(
			"client_id" => $this->client_id,
			"deleted" => ($this->input->post("deleted") == "1" ? 1:0),
			"deleted_at" => $deleted_at,
			"deleted_by" => $deleted_by,
			//"health_insurance_id" => $this->input->post("insurance_id"),
			"ik_number" => $this->input->post("ik_number"),
			"insurance_name" => $this->input->post("insurance_name"),
			"street" => $this->input->post("street"),
			"zipcode" => $this->input->post("zipcode"),
			"location" => $this->input->post("location"),
			"phone" => $this->input->post("phone"),
			"fax" => $this->input->post("fax"),
			"created_at" => $this->input->post("created_at")
		);
		
		if ($this->input->post("created_at") == "" && $edit == false){
			$data["created_at"] = time();
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($this->form_validation->run() )
		{
			write2Debugfile('formvalidationpassed.log', print_r($edit,true), true);
			
			if ($edit == true){
				$result = $this->health_insurance_model->update($this->client_id, $this->input->post("ik_number"), $data,$this->input->post('hidden_ik_number'));
			}
			else{
				$result = $this->health_insurance_model->create($this->client_id, $data );
			}
		}
		else {
			$result = new BASE_Result(null, validation_errors(), $this->form_validation->error_array() );
			write2Debugfile('formvalidationfailed.log', "\n - form validation failed...\n".validation_errors(), true);
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: set the view data
		$this->setData($result);
		if ($result->error == "")
		{
			$this->setViewSuccess(lang("health_insurance_has_been_saved"));
			$saved = true;
		}
		$this->setViewData("health_insurance", $data);	// fill the health_insurance with the given post data so the view can populate a filled out form
		$this->setViewData("saved", $saved);
		// $this->setViewData("additional_viewdata", array() );
	
		write2Debugfile(self::DEBUG_FILENAME, "\nthis->data\n".print_r($this->data, true));
		 
		return $saved;
	}
	
	/**
	 * render the health_insurance list
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
			$edit			= $this->hasPermission(E_PERMISSIONS::ROOT_HEALTH_INSURANCE_EDIT);
			$delete			= $this->hasPermission(E_PERMISSIONS::ROOT_HEALTH_INSURANCE_DELETE);
			$modelResult 	= $this->health_insurance_model->datatable( $this->client_id, $this->table_columns, $edit, $delete );
			$data 			= json_decode($modelResult->getData())->data;
		}

		write2Debugfile(self::DEBUG_FILENAME, " - root/health_insurance/show\n".print_r($data, true), false);

		$this->setViewData("table_data", $data);
		$this->setViewData("table_columns", $this->table_columns );

		$this->render("root/health_insurance/health_insurance_list", $rendermode);
	}
	
	public function get_health_insurance_details($ik_number="",$rendermode="FULLPAGE")
	{
		if ($this->input->post("ik_number") != "" && $ik_number == ""){
			$ik_number = $this->input->post("ik_number");
		}
		if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
			$rendermode = strtoupper($this->input->post("rendermode"));
		}
		if ($ik_number == null || $ik_number == "")
		{
			$this->render("errors/error_invalid_parameter", $rendermode);
			return; 
		}
		$client_id	= $this->client_id;
		
		$returnString	= "";
		$result		= $this->health_insurance_model->loadDetailDataForHealthinsurance($this->client_id,$ik_number);
		$used_for_adress = array();
		$adressTypeArray = array(
			'1'=>lang('health_insurance_home_address'),
			'2'=>lang('health_insurance_pobox_address'),
			'3'=>lang('health_insurance_great_customer_address')
		 );
		if($result->error == '')		
		{
			$result_data = $result->data;
			
			foreach($result_data as $result_data_k=>$result_data_v)
			{
				if(trim($returnString) =='')
				{
					$returnString .= "<b>".lang('contact')."&nbsp;".$result_data_v['ik_number']."&nbsp;".$result_data_v['sgb_arbeitsgeb_ansprechpartn'].":</b>";
				}
				else
				{
					$returnString .= "<br><b>".lang('contact')."&nbsp;".$result_data_v['ik_number']."&nbsp;".$result_data_v['sgb_arbeitsgeb_ansprechpartn'].":</b>";
				}
				$adressString = "";

				if(!in_array($result_data_v['ik_number'],$used_for_adress))
				{
					$adressarray  = $this->health_insurance_model->getAddressesForIK($result_data_v['ik_number'],$this->client_id);
					$used_for_adress[] = $result_data_v['ik_number'];
					foreach($adressarray as $adressarray_k=>$adressarray_v)
					{
						$adressString .= "<br><b>".$adressTypeArray[$adressarray_v['sgb_artanschrift']].":</b>";				//Typ Anschrift
						if(trim($adressarray_v['sgb_nr'] != ''))
						{
							$adressString .= "<br>".$adressarray_v['sgb_nr'];									//Straße, Postfach, etc.
						}
						$adressString .= "<br>". $adressarray_v['sgb_plz']. "&nbsp;". $adressarray_v['sgb_ort']."<br>";	// PLZ + Ort
					}
				}

				$returnString .=$adressString;
				$returnString .= (trim($result_data_v['sgb_name'])!=''?"<br>".lang('name').": ".$result_data_v['sgb_name']:"");
				$returnString .= "<br>".lang('phone').": ".$result_data_v['sgb_telefonnummer'];
				$returnString .= "<br>".lang('fax').": ".$result_data_v['sgb_fax']."<br>";
			}
			$return =	new BASE_Result($returnString);
			write2Debugfile('get_health_insurance_details.log', print_r($return, true));
		}
		else
		{
			  $return	= new BASE_Result(false, lang("msg_health_insurance_not_found"));
		}
		
		$this->setData($return);
		$this->render("root/health_insurances/get_health_insurance_details", $rendermode);
		return true;
	}

	public function get_health_insurance_billing($ik_number="",$rendermode="FULLPAGE")
    {
        if ($this->input->post("ik_number") != "" && $ik_number == ""){
            $ik_number = $this->input->post("ik_number");
        }
        if (E_RENDERMODE::isValidValue(strtoupper($this->input->post("rendermode")))){
            $rendermode = strtoupper($this->input->post("rendermode"));
        }
        if ($ik_number == null || $ik_number == "")
        {
            $this->render("errors/error_invalid_parameter", $rendermode);
            return;
        }
        $returnString	= "";
        $result		= $this->health_insurance_model->get_health_insurance_billing($this->client_id,$ik_number);

        if($result->error == '')
        {
            $result_data = $result->data;

            foreach($result_data as $result_data_k=>$result_data_v)
            {
                if(trim($returnString) =='')
                {
                    $returnString .= "".$result_data_v['billing_account_id']."&nbsp;".lang("PARAGRAPH_".$result_data_v['type'])."";
                }
                else
                {
                    $returnString .= "<br>".$result_data_v['billing_account_id']."&nbsp;".lang("PARAGRAPH_".$result_data_v['type'])."";
                }
            }
            $return =	new BASE_Result($returnString);
        }
        else
        {
            $return	= new BASE_Result(false, lang("msg_health_insurance_not_found"));
        }


        $this->setData($return);
        $this->render("root/health_insurances/get_health_insurance_billing", $rendermode);
        return true;
    }
}
?>