<?php
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create value object
	$contract 							= new T_Contract($data["contract"]);
	$available_document_types 			= $data["available_document_types"];
	$available_document_types_filter 	= $data["available_document_types"];
	array_unshift($available_document_types_filter, array("document_type"=>"ALL", "document_type_name"=>"show_all"));
	$available_global_documents			= $data['available_global_documents'];
	$read_only_view = $data["read_only_view"] == 1 ? 1 : 0;
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	
	
	$options = HTML_Select::buildOptions($available_document_types, 'document_type', 'document_type_name', null, lang('no_selection'), true, true, true);
	$options_filter = HTML_Select::buildOptions($available_document_types_filter, 'document_type', 'document_type_name', "ALL", lang('no_selection'), true, true, true);
	
	$options_for_global = HTML_Select::buildOptions($available_global_documents,'document_id', 'document_name', null, lang('no_selection'), true, true, false);
	
	$btn_submit_contract_doc = new HTML_Button("bt_submit_doc", "save_contract_doc", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit_contract_doc->setAttributes(array("form" => "form_upload_document"));
	$btn_submit_contract_doc->setType(E_BUTTON_TYPES::SUBMIT);
	
	$btn_reset_contract_doc = new HTML_Button("bt_reset_doc", "reset_contract", lang("undo"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset_contract_doc->setAttributes(array("form" => "form_upload_document"));
	$btn_reset_contract_doc->setType(E_BUTTON_TYPES::RESET);
	
	//.:::::::::::::::::::::::::::::::::::::................
	// custom filters
	$btn_reset	    = new HTML_Button("btn_filter_assignments_remove", "filter_assignments_documents", lang("show_all"), E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_reset->setValue("reset");
	
	$btn_available_bw	    = new HTML_Button("btn_filter_assignments_available_bw", "filter_assignments_documents", lang("available_bw"), E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_available_bw->setValue("available_bw");
	
	$btn_available_sn	    = new HTML_Button("btn_filter_assignments_available_sn", "filter_assignments_documents", lang("available_sn"), E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_available_sn->setValue("available_sn");
	
	$btn_billing_relevant    = new HTML_Button("btn_filter_assignments_billing_relevant", "filter_assignments_documents", lang("billing_relevant"), E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_billing_relevant->setValue("billing_relevant");
	
	$btn_mandatory_to_complete	    = new HTML_Button("btn_filter_assignments_mandatory_to_complete", "filter_assignments_documents", lang("mandatory_to_complete"), E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_mandatory_to_complete->setValue("mandatory_to_complete");
	
	$btn_to_be_signed_by_insured_person	    = new HTML_Button("btn_filter_assignments_to_be_signed_by_insured_person", "filter_assignments_documents", lang("to_be_signed_by_insured_person"), E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_to_be_signed_by_insured_person->setValue("to_be_signed_by_insured_person");
	
	
	$btngrp_filter_assigned_documents = new HTML_ButtonGroup("btngrp_filter_assignments_documents");
	$btngrp_filter_assigned_documents->addClass("btn-group-justified");
	$btngrp_filter_assigned_documents->setButtons(array(
		'<div class="btn-group" role="group">'.$btn_reset->generateHTML().'</div>',
		'<div class="btn-group" role="group">'.$btn_billing_relevant->generateHTML().'</div>',
		'<div class="btn-group" role="group">'.$btn_mandatory_to_complete->generateHTML().'</div>',
		'<div class="btn-group" role="group">'.$btn_to_be_signed_by_insured_person->generateHTML().'</div>'
	));
	
	$fi_filter_assigned_documents = new HTML_FormItem("", "fi_filter_assignments_documents", "btngrp_filter_assignments_documents", array(), E_REQUIRED::NO,array(2,5));
	$fi_filter_assigned_documents->addComponent($btngrp_filter_assigned_documents);
	$fi_filter_assigned_documents->setColumnRatio(array(0,12));
	
	$i_document_types_filter = new HTML_Select("i_document_type_filter", "document_type_filter", $options_filter, false, "" );
	$i_document_types_filter->setAllowClear(false);
	$fi_document_types_filter = new HTML_FormItem("", "fi_document_type_filter", "document_type_filter", array(), E_REQUIRED::NO,array(2,5));
	$fi_document_types_filter->setValidationState(form_error('document_type_filter') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_document_types_filter->addComponent($i_document_types_filter);
	$fi_document_types_filter->setColumnRatio(array(3,6));
	
	$form_filters_documents = new HTML_Form("form_filters_documents", "form_filters_documents", "#", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_filters_documents
	->addFormItem($fi_filter_assigned_documents)
	->addFormItem($fi_document_types_filter)    
	;
	
	
	
	//.:::::::::::::::::::::::::::::::::::::................
	$fi_submit_contract_doc = new HTML_FormItem("", "fi_submit_contract_doc", "submit");
	$fi_submit_contract_doc->addComponent($btn_submit_contract_doc);
	
	$i_document_types = new HTML_Select("i_document_type", "document_type", $options, false, lang("please_choose") );
	$fi_document_types = new HTML_FormItem(lang("document_type"), "fi_document_type", "document_type", array(), E_REQUIRED::YES);
	$fi_document_types->setValidationState(form_error('document_type') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_document_types->setColumnRatio(array(4,8));
	$fi_document_types->addComponent($i_document_types);
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	
	$i_global_documents = new HTML_Select("i_global_documents", "global_documents", $options_for_global );
	$fi_global_documents = new HTML_FormItem(lang("global_documents"), "fi_global_documents", "i_global_documents", array(), E_REQUIRED::NO);
	$fi_global_documents->setValidationState(form_error('global_documents') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_global_documents->setColumnRatio(array(4,8));
	$fi_global_documents->addComponent($i_global_documents);
	
	$btn_copy_document = new HTML_Button("bt_copy_document", "copy_document", lang("take_over"), E_COLOR::WARNING, E_SIZES::STANDARD, E_ICONS::ANGLE_DOUBLE_RIGHT, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array("btn-block"), array());
	$btn_copy_document->setAttributes(array("form" => "form_upload_document"));
	$btn_copy_document->setType(E_BUTTON_TYPES::BUTTON);
	
	$fi_global_documents_btn = new HTML_FormItem("", "fi_global_documents_btn", "i_global_documents", array(), E_REQUIRED::NO, array(4,8));
	$fi_global_documents_btn->addComponent($btn_copy_document);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: assigned/uploaded documents 
	$i_custom_document_name = new HTML_Input("i_custom_document_name", "custom_document_name", E_INPUTTYPE::TEXT, "");
	$fi_custom_document_name = new HTML_FormItem(lang("custom_document_name"), "fi_custom_document_name", "i_custom_document_name", array(), E_REQUIRED::NO);
	$fi_custom_document_name->setValidationState(form_error("custom_document_name") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_custom_document_name->setColumnRatio(array(4,8));
	$fi_custom_document_name->addComponent($i_custom_document_name);
	
	//$i_available_sn 	= new HTML_Checkbox("i_available_sn", "available[]", "<b>".lang("available_sn")."</b>", E_CHECKED::YES, "sn");
	//$i_available_bw 	= new HTML_Checkbox("i_available_bw", "available[]", "<b>".lang("available_bw")."</b>", E_CHECKED::YES, "bw");
	
	/*$fi_available_in 	= new HTML_FormItem(lang("range_of_validity"), "fi_document_type", "document_type", array(), E_REQUIRED::NO);
	$fi_available_in->setColumnRatio(array(4,8));
	$fi_available_in
	->addComponent($i_available_bw)
	->addComponent($i_available_sn);*/
	
	$i_billing_relevant 	= new HTML_Checkbox("i_billing_relevant", "billing_relevant", '<b>'.lang('billing_relevant').'</b>', E_CHECKED::NO, "br");
	$i_mandatory_to_complete = new HTML_Checkbox("i_mandatory_to_complete", "mandatory_to_complete", '<b>'.lang('mandatory_to_complete').'</b>', E_CHECKED::YES, "bw");
	$i_to_be_signed_by_insured_person = new HTML_Checkbox("i_to_be_signed_by_insured_person", "to_be_signed_by_insured_person", '<b>'.lang("to_be_signed_by_insured_person").'</b>', E_CHECKED::NO, "vu");
	
	$fi_other_settings 	= new HTML_FormItem(lang("other_settings"), "fi_other_settings", "other_settings", array(), E_REQUIRED::NO);
	$fi_other_settings->setColumnRatio(array(4,8));
	$fi_other_settings
	->addComponent($i_billing_relevant)
	->addComponent($i_mandatory_to_complete)
	->addComponent($i_to_be_signed_by_insured_person)
	;
	
	$fi_upload_document = new HTML_FormItem(lang("upload_document"), "fi_upload_document", "upload_document[]");
	$fi_upload_document->addComponent('<input id="i_upload_document" name="upload_document[]" class="btn btn-block btn-default" type="file">' );
	
	$hidden_contract_id 	= new HTML_Input("i_contract_id_docs", "contract_id_docs", E_INPUTTYPE::HIDDEN, lang("contract_id"), $contract->contract_id);
	$hidden_contract_save 	= new HTML_Input("i_save_contract_document", "save_contract_document", E_INPUTTYPE::HIDDEN, lang("save"), 1);
	
	$form_upload_document = new HTML_Form("form_upload_document", "form_upload_document", "#", lang("file_upload"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_upload_document
	->addFormItem($fi_document_types)
	->addFormItem($fi_global_documents)
	->addFormItem($fi_global_documents_btn)
		
	 ->addFormItem($fi_custom_document_name)
	
	->addFormItem($fi_other_settings)
	->addFormItem('<input id="i_upload_document" name="upload[]" class="btn btn-block btn-default" type="file">')
	->addFormItem($hidden_contract_id)
	->addFormItem($hidden_contract_save);
	
    //mku entfernen da kein BW mehr
    //->addFormItem($fi_available_in)
	
    // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: assigned/uploaded documents 
	$tbl = new HTML_Datatable("tbl_contract_documents", $contract->get_table_columns_documents(), array());	// $contract->assigned_documents
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: put all contract forms together
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	//<div class="col-xs-12 ">'.$btn_reset_contract_doc->generateHTML().$btn_submit_contract_doc->generateHTML().'</div>
	$full_form_contract_doc_upload = new HTML_Form("form_contract_doc", "form_contract_doc", base_url("root/contracts/") . ($contract->contract_id == "" ? "create" : "edit"), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$full_form_contract_doc_upload->setAttributes(array("enctype"=>"multipart/form-data"));
	if($read_only_view){
		$full_form_contract_doc_upload->addFormItem(
			$page_alerts . '
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'.
			$form_filters_documents->generateHTML().
			$tbl->generateHTML().'
		</div>'
		);
    }
	else
    {
	    $full_form_contract_doc_upload->addFormItem(
		    $page_alerts . '
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">'.
		    $form_upload_document->generateHTML().'
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-8">'.
		    $form_filters_documents->generateHTML().
		    $tbl->generateHTML().'
		</div>'
	    );
    }

?>
<div class="row">
	<div id="upload_and_uploaded" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<?php echo $full_form_contract_doc_upload->generateHTML(); ?>
	</div>
	<div id="document_editor" class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="display:none;">
	</div>
</div>
<script>
	var tbl_columns_documents = <?php echo json_encode($contract->get_table_columns_documents()); ?>;
</script>

