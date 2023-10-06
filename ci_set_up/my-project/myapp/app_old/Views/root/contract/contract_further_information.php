<?php
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create value object
	$contract						= new T_Contract($data["contract"]);
	$read_only_view = $data["read_only_view"] == 1 ? 1 : 0;
 
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$btn_submit_further_informations = new HTML_Button("bt_further_informations", "save_contract_further_informations", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit_further_informations->setAttributes(array("form" => "form_contract_further_informations"));
	$btn_submit_further_informations->setType(E_BUTTON_TYPES::SUBMIT);
	
	$btn_reset_flatrate = new HTML_Button("bt_reset_further_informations", "reset_contract_further_informations", lang("undo"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset_flatrate->setAttributes(array("form" => "form_contract_further_informations"));
	$btn_reset_flatrate->setType(E_BUTTON_TYPES::RESET);
	
	$hidden_save 				= new HTML_Input("i_hidden_save_further_informations", "save_further_informations", E_INPUTTYPE::HIDDEN, lang("save"), 1);
	$hidden_contract_id 		= new HTML_Input("i_contract_id_further_informations", "contract_id_further_informations", E_INPUTTYPE::HIDDEN, lang("contract_id"), $contract->contract_id);
	$hidden_contract_revision 	= new HTML_Input("i_contract_rev_further_informations", "contract_rev_further_informations", E_INPUTTYPE::HIDDEN, lang("contract_id"), $contract->contract_revision);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		
	// ..:::::::::::::::::: Allgemein/ Vertrag ::::::::::::::::::::::::::::..
	$i_general_information = new HTML_TextArea("i_general_information", "general_information",  $contract->general_information,"");
	$i_general_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_general_information->setEnabled(E_ENABLED::NO);
	}
	$fi_general_information = new HTML_FormItem(lang("general_information"), "fi_general_information", "i_general_information", array(), E_REQUIRED::NO);
	$fi_general_information->setValidationState(form_error("general_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_general_information->addComponent($i_general_information);
	// ..:::::::::::::::::: Beratung/Einweisung ::::::::::::::::::::::::::::..
	$i_consultation_admission = new HTML_TextArea("i_consultation_admission", "consultation_admission",  $contract->consultation_admission,"");
	$i_consultation_admission->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_consultation_admission->setEnabled(E_ENABLED::NO);
	}
	$fi_consultation_admission = new HTML_FormItem(lang("consultation_admission"), "fi_consultation_admission", "i_consultation_admission", array(), E_REQUIRED::NO);
	$fi_consultation_admission->setValidationState(form_error("consultation_admission") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_consultation_admission->addComponent($i_consultation_admission);
	// ..:::::::::::::::::: Rezept/ Dauerverordnung ::::::::::::::::::::::::::::..
	$i_prescription_information = new HTML_TextArea("i_prescription_information", "prescription_information",  $contract->prescription_information,"");
	$i_prescription_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_prescription_information->setEnabled(E_ENABLED::NO);
	}
	$fi_prescription_information = new HTML_FormItem(lang("prescription_information"), "fi_prescription_information", "i_prescription_information", array(), E_REQUIRED::NO);
	$fi_prescription_information->setValidationState(form_error("prescription_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_prescription_information->addComponent($i_prescription_information);
	// ..:::::::::::::::::: Kostenvoranschlag/ Genehmigung  ::::::::::::::::::::::::::::..
	$i_cost_estimate_information = new HTML_TextArea("i_cost_estimate_information", "cost_estimate_information",  $contract->cost_estimate_information,"");
	$i_cost_estimate_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_cost_estimate_information->setEnabled(E_ENABLED::NO);
	}
	$fi_cost_estimate_information = new HTML_FormItem(lang("cost_estimate_information"), "fi_cost_estimate_information", "i_cost_estimate_information", array(), E_REQUIRED::NO);
	$fi_cost_estimate_information->setValidationState(form_error("cost_estimate_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_cost_estimate_information->addComponent($i_cost_estimate_information);
	// ..:::::::::::::::::: Versorgung ::::::::::::::::::::::::::::..
	$i_supply_information = new HTML_TextArea("i_supply_information", "supply_information",  $contract->supply_information,"");
	$i_supply_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_supply_information->setEnabled(E_ENABLED::NO);
	}
	$fi_supply_information = new HTML_FormItem(lang("supply_information"), "fi_supply_information", "i_supply_information", array(), E_REQUIRED::NO);
	$fi_supply_information->setValidationState(form_error("supply_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_supply_information->addComponent($i_supply_information);
	// ..:::::::::::::::::: Produkte ::::::::::::::::::::::::::::..
	$i_product_information = new HTML_TextArea("i_product_information", "product_information",  $contract->product_information,"");
	$i_product_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_product_information->setEnabled(E_ENABLED::NO);
	}
	$fi_product_information = new HTML_FormItem(lang("product_information"), "fi_product_information", "i_product_information", array(), E_REQUIRED::NO);
	$fi_product_information->setValidationState(form_error("product_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_product_information->addComponent($i_product_information);
	// ..:::::::::::::::::: Belieferung ::::::::::::::::::::::::::::..
	$i_delivery_information = new HTML_TextArea("i_delivery_information", "delivery_information",  $contract->delivery_information,"");
	$i_delivery_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_delivery_information->setEnabled(E_ENABLED::NO);
	}
	$fi_delivery_information = new HTML_FormItem(lang("delivery_information"), "fi_delivery_information", "i_delivery_information", array(), E_REQUIRED::NO);
	$fi_delivery_information->setValidationState(form_error("delivery_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_delivery_information->addComponent($i_delivery_information);
	// ..:::::::::::::::::: Preise/ Pauschalen ::::::::::::::::::::::::::::..
	$i_flatrate_information = new HTML_TextArea("i_flatrate_information", "flatrate_information",  $contract->flatrate_information,"");
	$i_flatrate_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_flatrate_information->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_information = new HTML_FormItem(lang("flatrate_information"), "fi_flatrate_information", "i_flatrate_information", array(), E_REQUIRED::NO);
	$fi_flatrate_information->setValidationState(form_error("flatrate_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_information->addComponent($i_flatrate_information);
	// ..:::::::::::::::::: Abliefernachweis ::::::::::::::::::::::::::::..
	$i_proof_of_delivery_information = new HTML_TextArea("i_proof_of_delivery_information", "proof_of_delivery_information",  $contract->proof_of_delivery_information,"");
	$i_proof_of_delivery_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_proof_of_delivery_information->setEnabled(E_ENABLED::NO);
	}
	$fi_proof_of_delivery_information = new HTML_FormItem(lang("proof_of_delivery_information"), "fi_proof_of_delivery_information", "i_proof_of_delivery_information", array(), E_REQUIRED::NO);
	$fi_proof_of_delivery_information->setValidationState(form_error("proof_of_delivery_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_proof_of_delivery_information->addComponent($i_proof_of_delivery_information);
	// ..:::::::::::::::::: Abrechnung ::::::::::::::::::::::::::::..
	$i_billing_information = new HTML_TextArea("i_billing_information", "billing_information",  $contract->billing_information,"");
	$i_billing_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_billing_information->setEnabled(E_ENABLED::NO);
	}
	$fi_billing_information = new HTML_FormItem(lang("billing_information"), "fi_billing_information", "i_billing_information", array(), E_REQUIRED::NO);
	$fi_billing_information->setValidationState(form_error("billing_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_billing_information->addComponent($i_billing_information);
	// ..:::::::::::::::::: Aufzahlung ::::::::::::::::::::::::::::..
	$i_enumeration_information = new HTML_TextArea("i_enumeration_information", "enumeration_information",  $contract->enumeration_information,"");
	$i_enumeration_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_enumeration_information->setEnabled(E_ENABLED::NO);
	}
	$fi_enumeration_information = new HTML_FormItem(lang("enumeration_information"), "fi_enumeration_information", "i_enumeration_information", array(), E_REQUIRED::NO);
	$fi_enumeration_information->setValidationState(form_error("enumeration_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_enumeration_information->addComponent($i_enumeration_information);
	// ..:::::::::::::::::: Hinweise  ::::::::::::::::::::::::::::..
	$i_notes_information = new HTML_TextArea("i_notes_information", "notes_information",  $contract->notes_information,"");
	$i_notes_information->addClass("text-area-synamic-resize");
	if ($read_only_view){
		$i_notes_information->setEnabled(E_ENABLED::NO);
	}
	$fi_notes_information = new HTML_FormItem(lang("notes_information"), "fi_notes_information", "i_notes_information", array(), E_REQUIRED::NO);
	$fi_notes_information->setValidationState(form_error("notes_information") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_notes_information->addComponent($i_notes_information);	
	
	$form = new HTML_Form("form_further_informations_left", "form_further_informations_left", "#", lang("further_information"));	
	$form   ->addFormItem($fi_general_information)
			->addFormItem($fi_consultation_admission)
			->addFormItem($fi_prescription_information)
			->addFormItem($fi_cost_estimate_information)
			->addFormItem($fi_supply_information)
			->addFormItem($fi_product_information)
	;
	
	$form2 = new HTML_Form("form_further_informations_right", "form_further_informations_right", "#", "&nbsp;");
	$form2  ->addFormItem($fi_delivery_information)
			->addFormItem($fi_flatrate_information)
			->addFormItem($fi_proof_of_delivery_information)
			->addFormItem($fi_billing_information)
			->addFormItem($fi_enumeration_information)
			->addFormItem($fi_notes_information)
	;
	
	$target = base_url('root/contracts/save_contract_further_informations/');
	
	$form_contract_further_informations = new HTML_Form("form_contract_further_informations", "form_contract_further_informations", $target, "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_contract_further_informations
	->addFormItem($hidden_contract_id)
	->addFormItem($hidden_contract_revision)
	->addFormItem($hidden_save)
	->addFormItem(
		$page_alerts.'
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">' . 
			$form->generateHTML(true) . '
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">' . 
			$form2->generateHTML(true) . '
		</div>'
	);
	
	if ($read_only_view){
		$button = "";
	}
	else{
		$button = $btn_submit_further_informations->generateHTML();
	}
	
	$output = '
	<div class="row button-row">
		<div class="col-xs-12 ">'.
			$button.'
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'.
		$form_contract_further_informations->generateHTML().'
		</div>
	</div>';
	
	
	
	$mdl_new_flatrate = new HTML_Dialog($data["id_modal"], "mdl_flatrate", lang("flatrate"), $output, "");
	
	if ($data["as_modal"] == true){
		echo $mdl_new_flatrate->generateHTML();
	}
	else{
		echo $output;
	}
	
?>
