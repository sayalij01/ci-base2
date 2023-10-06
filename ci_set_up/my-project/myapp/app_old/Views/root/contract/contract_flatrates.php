<?php
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create value object
	$flatrate						= new T_ContractFlatrate($data["contract_flatrate"]);
	$available_flatrate_articles    = $data["flatrate_articles"];
	$read_only_view = $data["read_only_view"] == 1 ? 1 : 0;
	
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$btn_submit_flatrate = new HTML_Button("bt_submit_flatrate", "save_contract_flatrate", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit_flatrate->setAttributes(array("form" => "form_contract_flatrate"));
	$btn_submit_flatrate->setType(E_BUTTON_TYPES::SUBMIT);
	
	$btn_reset_flatrate = new HTML_Button("bt_reset_flatrate", "reset_contract_flatrate", lang("undo"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset_flatrate->setAttributes(array("form" => "form_contract_flatrate"));
	$btn_reset_flatrate->setType(E_BUTTON_TYPES::RESET);
	
	$hidden_save 				= new HTML_Input("i_hidden_save_flatrate", "save_flatrate", E_INPUTTYPE::HIDDEN, lang("save"), 1);
	$hidden_contract_id 		= new HTML_Input("i_contract_id_flatrates", "contract_id_flatrates", E_INPUTTYPE::HIDDEN, lang("contract_id"), $flatrate->contract_id);
	$hidden_flatrate_id 		= new HTML_Input("i_contract_flatrate_id ", "flatrate_id", E_INPUTTYPE::HIDDEN, lang("flatrate_id"), $flatrate->flatrate_id);
	$hidden_contract_revision 	= new HTML_Input("i_contract_rev_flatrates", "contract_rev_flatrates", E_INPUTTYPE::HIDDEN, lang("contract_id"), $flatrate->contract_revision);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: flateratetypes
	// Flatrate name
	$i_flatrate_name = new HTML_Input("i_flatrate_name", "flatrate_name", E_INPUTTYPE::TEXT, "", $flatrate->flatrate_name);
	if ($read_only_view){
		$i_flatrate_name->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_name = new HTML_FormItem(lang("flatrate_name"), "fi_flatrate_name", "i_flatrate_name", array(), E_REQUIRED::YES);
	$fi_flatrate_name->setValidationState(form_error("flatrate_name") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_name->addComponent($i_flatrate_name);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Artikelnummer aka flatrate
	//echome($available_flatrate_articles);
	
	$available_flatrate_article_options = array();
	foreach ($available_flatrate_articles as $name => $value)
	{
		$timeStringFrom = "";
		if($value->from_date > 0 && $value->from_date != null)
		{
			$timeStringFrom = lang('valid_from')." ".format_timestamp2date($value->from_date);
		}
		$timeStringTill = "";
		if($value->to_date > 0 && $value->to_date != null)
		{
			$timeStringTill = lang('valid_till')." ".format_timestamp2date($value->to_date);
		}
		$price_id = "";
		if($value->price_id != '')
		{
			$price_id = $value->price_id." - ";
		}
		$available_flatrate_article_options[] = array(
			//"key"=>$value->entry_id, /// 2021-03-01 Article statt Preiseintrag für Flatrate speichern
			"key"=>$value->article_id,
			//"label"=>$value->article_id_abena." (".$price_id.(($value->sales_price != '' && $value->sales_price != NULL)?format_currency($value->sales_price):'')." ) ".$value->article_name." ".$timeStringFrom." ".$timeStringTill  // 2021-03-01 Article statt Preiseintrag für Flatrate speichern
			"label"=>$value->article_id_abena." ".$value->article_name
		);
	}
	$options_flatrate_article = HTML_Select::buildOptions($available_flatrate_article_options, 'key', 'label', $flatrate->flatrate_article, lang('no_selection'), true, true);
	
	$i_flatrate_article = new HTML_Select("i_flatrate_article", "flatrate_article", $options_flatrate_article);
	if ($read_only_view){
		$i_flatrate_article->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_article= new HTML_FormItem(lang("flatrate_article"), "fi_flatrate_article", "flatrate_article", array(), E_REQUIRED::YES);
	$fi_flatrate_article->setValidationState(form_error('flatrate_article') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_article->addComponent($i_flatrate_article);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	//Flatrate Kommentar
	$i_flatrate_comment = new HTML_TextArea("i_flatrate_comment", "flatrate_comment", $flatrate->flatrate_comment);
	if ($read_only_view){
		$i_flatrate_comment->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_comment = new HTML_FormItem(lang("flatrate_comment"), "fi_flatrate_comment", "i_flatrate_comment", array(), E_REQUIRED::NO);
	$fi_flatrate_comment->setValidationState(form_error("flatrate_comment") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_comment->addComponent($i_flatrate_comment);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Alter von
	$i_flatrate_age_from = new HTML_Input("i_flatrate_age_from", "flatrate_age_from", E_INPUTTYPE::NUMBER, "", $flatrate->flatrate_age_from);
	$i_flatrate_age_from->addAttribute('min', 0);
	if ($read_only_view){
		$i_flatrate_age_from->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_age_from = new HTML_FormItem(lang("flatrate_age_from"), "fi_flatrate_age_from", "i_flatrate_age_from", array(), E_REQUIRED::NO);
	$fi_flatrate_age_from->setValidationState(form_error("flatrate_age_from") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_age_from->addComponent($i_flatrate_age_from);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Alter bis
	$i_flatrate_age_to = new HTML_Input("i_flatrate_age_to", "flatrate_age_to", E_INPUTTYPE::NUMBER, "", $flatrate->flatrate_age_to);
	$i_flatrate_age_to->addAttribute('min', 0);
	if ($read_only_view){
		$i_flatrate_age_to->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_age_to = new HTML_FormItem(lang("flatrate_age_to"), "fi_fflatrate_age_to", "i_flatrate_age_to", array(), E_REQUIRED::NO);
	$fi_flatrate_age_to->setValidationState(form_error("flatrate_age_to") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_age_to->addComponent($i_flatrate_age_to);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Aufzahlungsart
	$fi_additional_payment_group = new HTML_FormItem(lang("additional_payment_group"), "fi_additional_payment_group", "additional_payment_group");
	$fi_additional_payment_group->setValidationState(form_error("additional_payment_group") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	foreach (E_CONTRACT_ADDITIONAL_PAYMENT::getConstants() as $name => $value)
	{
		$selected 	= ($flatrate->$value == 1);
		
		$cb = new HTML_Checkbox("i_additional_payment_group_" . $name, $name, lang($value), $selected,1);
		if ($read_only_view){
			$cb->setEnabled(E_ENABLED::NO);
		}
		$fi_additional_payment_group->addComponent($cb);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Einrichtungstyp 
	$fi_flatrate_type_group = new HTML_FormItem(lang("flatrate_type_group"), "fi_flatrate_type_group", "flatrate_type_group");
	$fi_flatrate_type_group->setValidationState(form_error("flatrate_type_group") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	foreach (E_CONTRACT_FLATRATE_TYPE::getConstants() as $name => $value)
	{
		$selected 	= ($flatrate->$value == 1);
		
		$cb = new HTML_Checkbox("i_flatrate_type_group_".$name, $name, lang($value), $selected, 1);
		if ($read_only_view){
			$cb->setEnabled(E_ENABLED::NO);
		}
		$fi_flatrate_type_group->addComponent($cb);
	}
	
	
	
	$flatrate_valid_from = $flatrate->flatrate_valid_from != null ? format_timestamp2date($flatrate->flatrate_valid_from) : "";
	$i_flatrate_valid_from = new HTML_Datepicker("i_flatrate_valid_from", "flatrate_valid_from", $flatrate_valid_from, '', lang('date_format_long'));
	if ($read_only_view){
		$i_flatrate_valid_from->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_valid_from = new HTML_FormItem(lang("flatrate_valid_from"), "fi_flatrate_valid_from", "i_flatrate_valid_from", array(), E_REQUIRED::NO);
	$fi_flatrate_valid_from->setValidationState( form_error("flatrate_valid_from") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_valid_from->addComponent( $i_flatrate_valid_from );
	
	$flatrate_valid_to = $flatrate->flatrate_valid_to != null ? format_timestamp2date($flatrate->flatrate_valid_to) : "";
	$i_flatrate_valid_to = new HTML_Datepicker("i_flatrate_valid_to", "flatrate_valid_to", $flatrate_valid_to, '', lang('date_format_long'));
	if ($read_only_view){
		$i_flatrate_valid_to->setEnabled(E_ENABLED::NO);
	}
	$fi_flatrate_valid_to = new HTML_FormItem(lang("flatrate_valid_to"), "fi_flatrate_valid_to", "i_flatrate_valid_to", array(), E_REQUIRED::NO);
	$fi_flatrate_valid_to->setValidationState( form_error("flatrate_valid_to") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_valid_to->addComponent( $i_flatrate_valid_to );
	
	$fi_valid_from_to 	= new HTML_FormItem(lang("flatrate_valid_from_to"), "fi_flatrate_valid_from_to", "", array(), E_REQUIRED::NO);
	$fi_valid_from_to->addComponent(
		'<div class="row">
			<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 combined-inputs-left" style="padding-right:0px !important;" >
				'.$i_flatrate_valid_from->generateHTML().'
			</div>
			<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 combined-inputs-right" style="" >
				'.$i_flatrate_valid_to->generateHTML().'
			</div>
		</div>'
	); 
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: assigned flatrate
	$form = new HTML_Form("form_flatrate", "form_flatrate", "#", lang("flatrate"));	
	$form->addFormItem($fi_flatrate_name);
	$form->addFormItem($fi_flatrate_article);
	$form->addFormItem($fi_flatrate_comment);		
	$form->addFormItem($fi_flatrate_age_from);
	$form->addFormItem($fi_flatrate_age_to);
	$form->addFormItem($fi_additional_payment_group);
	$form->addFormItem($fi_flatrate_type_group);
	
	//$form->addFormItem($fi_flatrate_valid_from);
	//$form->addFormItem($fi_flatrate_valid_to);
	$form->addFormItem($fi_valid_from_to);
	
	
	if ($flatrate->flatrate_id == ""){
		$target = base_url('root/contracts/create_flatrate/'.$flatrate->contract_id."/".$flatrate->contract_revision);
	}else{
		$target = base_url('root/contracts/edit_flatrate/'.$flatrate->contract_id."/".$flatrate->contract_revision."/".$flatrate->flatrate_id);
	}
	
	$form_contract_flatrates = new HTML_Form("form_contract_flatrate", "form_contract_flatrate", $target, "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_contract_flatrates
	->addFormItem($hidden_contract_id)
	->addFormItem($hidden_contract_revision)
	->addFormItem($hidden_flatrate_id)
	->addFormItem($hidden_save)
	->addFormItem(
		$page_alerts.'
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">' . 
			$form->generateHTML(true) . '
		</div>'
	);
	
	
	if ($read_only_view){
		$button = "";
	}
	else{
		$button = $btn_submit_flatrate->generateHTML();
	}
	
	$output = '
	<div class="row button-row">
		<div class="col-xs-12 ">'.
		$button.'
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'.
		$form_contract_flatrates->generateHTML().'
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
