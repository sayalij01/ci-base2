<?php if ( ! defined("BASEPATH")) exit("No direct script access allowed");
/**
 * Contracts controller
 *
 * @author Marco Eberhardt
 * @category controller
 * @package application/controllers/admin/contract
 * @version 1.0
 */
class Contracts_editor extends BASE_Controller
{
    const DEBUG_FILENAME = "Contracts_editor.log";

    public function __construct()
    {
        parent::__construct(true, false);
        
        $this->load->library("value_objects/T_Contract.php");
        $this->load->library("PDF/PDFLib", "PDFLib");
        
        $this->load->model("contract_model");
        $this->load->model("Health_insurance_model","Health_insurance_model");
        $this->load->model("contract_edit_model");
        $this->load->model("debitor_model");
        
        $this->javascript = array("contracts.js","contract_doc_editor.js");
        
        $this->addPlugins(
            E_PLUGIN::DATATABLES,
            E_PLUGIN::BS_TOGGLE,
            E_PLUGIN::BS_DATETIMEPICKER,
            E_PLUGIN::SELECT2,
            E_PLUGIN::FILE_INPUT,
            E_PLUGIN::PDF_JS,
            E_PLUGIN::CONTEXT_MENU
            );
        
        write2Debugfile(self::DEBUG_FILENAME, "application/controllers/admin/\ntable-columns-".print_r($this->table_columns, true), false);
    }
    
    public function index()
    {
        
    }
    
    public function initdoceditor()
    {
        $post = $this->input->post();
        $data = array("placeholder"=>array());
        foreach(E_CONTRACT_DOC_PLACEHOLDER::getConstants() as $key=>$value)
        {
            $data["placeholder"][$value] = lang("placeholder_".$value);
        }
        $data["document"] = $this->contract_edit_model->LoadDocument($post["id"]);
        
        $document = $this->load->view("root/contract/contract_document_editor", $data, true);
        
        $this->setViewData("html",$document);
        $this->render(null, E_RENDERMODE::JSON);
    }
    
    public function savedocsetup()
    {
        $post = $this->input->post();
        $result = $this->contract_edit_model->SaveDocSetup($post);

        /*$pdfSourceFilePath = $this->config->item("root_path")."uploads/contract_docs/".$post["contract_id"]."/".$post["filename"];
        $pdfTargetFilePath = $this->config->item("root_path")."uploads/contract_docs/".$post["contract_id"]."/placeholder_demo_data_".$post["filename"];
        
        $placeholderData = $this->debitor_model->load_and_prepare_anamnesis_for_printing($post["client_id"], 
                                                                                         1182671946, 
                                                                                         $post["contract_id"], 
                                                                                         $post["contract_revision"], 
                                                                                         $post["document_type"], 
                                                                                         $post["document_id"]);*/
        //die(print_r($placeholderData,true));
        //PDFLib::WritePlaceholderInPDF($pdfSourceFilePath,$pdfTargetFilePath,$placeholderData);
        /*$placeholderData = array(1=>array(array("placeholder"=>"firstname",
                                                "text"=>"Maximilian",
                                                "posX"=>189.75,
                                                "posY"=>149,
                                                "fontsize"=>14,
                                                "fontfamily"=>"Arial",
                                                "fontstyle"=>""),
                                          array("placeholder"=>"lastname",
                                                "text"=>"Mustermann",
                                                "posX"=>190.75,
                                                "posY"=>175,
                                                "fontsize"=>14,
                                                "fontfamily"=>"Arial",
                                                "fontstyle"=>""),
                                          array("placeholder"=>"phone",
                                                "text"=>"+49 7321 123456",
                                                "posX"=>410.75,
                                                "posY"=>219,
                                                "fontsize"=>14,
                                                "fontfamily"=>"Arial",
                                                "fontstyle"=>""),
                                          array("placeholder"=>"mobile",
                                                "text"=>"+49 7321 654321",
                                                "posX"=>191.75,
                                                "posY"=>219,
                                                "fontsize"=>14,
                                                "fontfamily"=>"Arial",
                                                "fontstyle"=>"")),
                                2=>array());
        PDFLib::WritePlaceholderInPDF($pdfSourceFilePath,$pdfTargetFilePath,$placeholderData);*/
        
        $this->setData($result);
        $this->render(null, E_RENDERMODE::JSON);
    }
    
    public function deletedocsetup()
    {
        $post = $this->input->post();
        $result = $this->contract_edit_model->DeleteDocSetup($post);
        
        $this->setData($result);
        $this->render(null, E_RENDERMODE::JSON);
    }
    
    public function getdocsetup()
    {
        $post = $this->input->post();
        $result = $this->contract_edit_model->GetDocSetup($post);
        
        $this->setData($result);
        $this->render(null, E_RENDERMODE::JSON);
    }
}
?>