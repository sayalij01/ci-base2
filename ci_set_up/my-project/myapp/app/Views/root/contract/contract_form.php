<?php
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create value object
	$contract = new T_Contract($data["contract"]);
	
	$read_only_view = $data["read_only_view"] == 1 ? 1 : 0;
	
	$available_document_types	= $data["available_document_types"];
	$available_subcountries		= $data["available_subcountries"];
	$available_characteristics	= $data["available_characteristics"];
	$available_costcarrier		= $data["available_costcarrier"];
	if(isset($data['workdays_until_delivery']) && is_array($data['workdays_until_delivery']) && !empty($data['workdays_until_delivery']))
	{
		$array_workdays_until_delivery = $data['workdays_until_delivery'];
	}
	else
	{
		$array_workdays_until_delivery = array('0'=>0, '1'=>1, '2'=>2, '3'=>3);
	}
	
	
	$restricted_subcountries	=  json_decode($contract->restriction_subcountry);
	$restricted_characteristic	=  json_decode($contract->restriction_characteristic);
	$product_groupse =  json_decode($contract->productgroup);
	$needed_delivery_proofs = json_decode($contract->proof_of_delivery_needed);
	//echome($needed_delivery_proofs);
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the contract form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_contract_name = new HTML_Input("i_contract_name", "contract_name", E_INPUTTYPE::TEXT, "", $contract->contract_name);
	$fi_contract_name = new HTML_FormItem(lang("contract_name"), "fi_contract_name", "i_contract_name", array(), E_REQUIRED::YES);
	$fi_contract_name->setValidationState(form_error("contract_name") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_contract_name->addComponent($i_contract_name);
	if ($read_only_view){
		$i_contract_name->setEnabled(E_ENABLED::NO);
    }
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_contract_desc = new HTML_TextArea("i_contract_desc", "contract_desc", $contract->contract_desc);
	$fi_contract_desc = new HTML_FormItem(lang("contract_desc"), "fi_contract_desc", "");
	$fi_contract_desc->setValidationState(form_error("contract_desc") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_contract_desc->addComponent($i_contract_desc);
	if ($read_only_view){
		$i_contract_desc->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_flatrate_aph_brutto = new HTML_Input("i_flatrate_aph_brutto", "flatrate_aph_brutto", E_INPUTTYPE::TEXT, "", $contract->flatrate_aph_brutto);
	$i_flatrate_aph_brutto->addClass('autonumericcurrency');
	$fi_flatrate_aph_brutto = new HTML_FormItem(lang("flatrate_aph_brutto"), "fi_flatrate_aph_brutto", "");
	$fi_flatrate_aph_brutto->setValidationState(form_error("flatrate_aph_brutto") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_aph_brutto->addComponent($i_flatrate_aph_brutto);
	if ($read_only_view){
		$i_flatrate_aph_brutto->setEnabled(E_ENABLED::NO);
	}
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_flatrate_bh_brutto = new HTML_Input("i_flatrate_bh_brutto", "flatrate_bh_brutto", E_INPUTTYPE::TEXT, "", $contract->flatrate_bh_brutto);
	$i_flatrate_bh_brutto->addClass('autonumericcurrency');
	$fi_flatrate_bh_brutto = new HTML_FormItem(lang("flatrate_bh_brutto"), "fi_flatrate_bh_brutto", "");
	$fi_flatrate_bh_brutto->setValidationState(form_error("flatrate_bh_brutto") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_bh_brutto->addComponent($i_flatrate_bh_brutto);
	if ($read_only_view){
		$i_flatrate_bh_brutto->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_flatrate_pd_brutto = new HTML_Input("i_flatrate_pd_brutto", "flatrate_pd_brutto", E_INPUTTYPE::TEXT, "", $contract->flatrate_pd_brutto);
	$i_flatrate_pd_brutto->addClass('autonumericcurrency');
	$fi_flatrate_pd_brutto = new HTML_FormItem(lang("flatrate_pd_brutto"), "fi_flatrate_pd_brutto", "");
	$fi_flatrate_pd_brutto->setValidationState(form_error("flatrate_pd_brutto") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_flatrate_pd_brutto->addComponent($i_flatrate_pd_brutto);
	if ($read_only_view){
		$i_flatrate_pd_brutto->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$fi_target_group = new HTML_FormItem(lang("target_group"), "fi_target_group", "target_group");
	$fi_target_group->setValidationState(form_error("target_group") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	foreach (E_TARGET_GROUPS::getConstants() as $name => $value)
	{
		$cb = new HTML_Checkbox("i_target_group_" . $name, $name, lang($value), (in_array($name, $contract->target_groups)));
		if ($read_only_view){
			$cb->setEnabled(E_ENABLED::NO);
		}
		$fi_target_group->addComponent($cb);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_contract_startdate = new HTML_Datepicker("i_contract_startdate", "contract_startdate", $contract->contract_startdate, '', lang('date_format_long'));
	$fi_contract_startdate = new HTML_FormItem(lang("contract_startdate"), "fi_contract_startdate", "", "", E_REQUIRED::YES);
	$fi_contract_startdate->setValidationState(form_error("contract_startdate") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_contract_startdate->addComponent($i_contract_startdate);
	if ($read_only_view){
		$i_contract_startdate->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_contract_enddate = new HTML_Datepicker("i_contract_enddate", "contract_enddate", $contract->contract_enddate, '', lang('date_format_long'));
	$fi_contract_enddate = new HTML_FormItem(lang("contract_enddate"), "fi_contract_enddate", "", "", E_REQUIRED::NO);
	$fi_contract_enddate->setValidationState(form_error("contract_enddate") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_contract_enddate->addComponent($i_contract_enddate);
	if ($read_only_view){
		$i_contract_enddate->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$fi_valid_area = new HTML_FormItem(lang("valid_area"), "fi_valid_area", "valid_area");
	$fi_valid_area->setValidationState(form_error("valid_area") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	foreach (E_VALID_AREA::getConstants() as $name => $value)
	{
		$cb = new HTML_Checkbox("i_valid_area_" . $name, $name, lang($value), (in_array($name, $contract->valid_area)));
		if ($read_only_view){
			$cb->setEnabled(E_ENABLED::NO);
		}
		$fi_valid_area->addComponent($cb);
	}
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// flatrate_contract
	$i_non_flatrate_contract = new HTML_Checkbox('i_non_flatrate_contract', 'non_flatrate_contract', lang('non_flatrate_contract'), ($contract->non_flatrate_contract == 1 ? true : false));
	$fi_non_flatrate_contract = new HTML_FormItem('', "fi_non_flatrate_contract", "non_flatrate_contract", "", E_REQUIRED::NO);
	$fi_non_flatrate_contract->setValidationState(form_error("non_flatrate_contract") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_non_flatrate_contract->addComponent($i_non_flatrate_contract);
	if ($read_only_view){
		$i_non_flatrate_contract->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// kv_requiered
	$i_kv_requiered = new HTML_Checkbox('i_kv_requiered', 'kv_requiered', lang('kv_requiered'), ($contract->kv_requiered == 1 ? true : false));
	$fi_kv_requiered = new HTML_FormItem('', "fi_kv_requiered", "kv_requiered", "", E_REQUIRED::NO);
	$fi_kv_requiered->setValidationState(form_error("kv_requiered") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_kv_requiered->addComponent($i_kv_requiered);
	if ($read_only_view){
		$i_kv_requiered->setEnabled(E_ENABLED::NO);
	}
	
	$enable_checkboxes_if_kv_requiered = ($contract->kv_requiered == 1 ? true : false);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..; 
	$i_kv_necessary_from_cost = new HTML_Input("i_kv_necessary_from_cost", "kv_necessary_from_cost", E_INPUTTYPE::TEXT, "", str_replace('.',',',$contract->kv_necessary_from_cost));
	$i_kv_necessary_from_cost->setAttributes (array(
		"data-a-sep" =>lang ("thousand_seperator"),
		"data-a-dec" => lang ("decimal_seperator"),
		"data-p-sign" => "s",
		"data-m-dec" => 2
	));
	$fi_kv_necessary_from_cost = new HTML_FormItem(lang("kv_necessary_from_cost"), "fi_kv_necessary_from_cost", "");
	$fi_kv_necessary_from_cost->setValidationState(form_error("kv_necessary_from_cost") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_kv_necessary_from_cost->addComponent($i_kv_necessary_from_cost);
	if ($read_only_view){
		$i_kv_necessary_from_cost->setEnabled(E_ENABLED::NO);
	}
	
	$i_kv_necessary_from_piece = new HTML_Input("i_kv_necessary_from_piece", "kv_necessary_from_piece", E_INPUTTYPE::NUMBER, "", $contract->kv_necessary_from_piece);
	$i_kv_necessary_from_piece->addAttribute('min', 0);
	$fi_kv_necessary_from_piece = new HTML_FormItem(lang("kv_necessary_from_piece"), "fi_kv_necessary_from_piece", "kv_necessary_from_piece");
	$fi_kv_necessary_from_piece->setValidationState(form_error("kv_necessary_from_piece") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_kv_necessary_from_piece->addComponent($i_kv_necessary_from_piece);
	if ($read_only_view){
		$i_kv_necessary_from_piece->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// allow_product_without_aidnr
	/*
	$i_allow_product_without_aidnr = new HTML_Checkbox('i_allow_product_without_aidnr', 'allow_product_without_aidnr', lang('allow_product_without_aidnr'), ($contract->allow_product_without_aidnr == 1 ? true : false));
	$fi_allow_product_without_aidnr = new HTML_FormItem('', "fi_allow_product_without_aidnr", "allow_product_without_aidnr", "", E_REQUIRED::NO);
	$fi_allow_product_without_aidnr->setValidationState(form_error("allow_product_without_aidnr") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_allow_product_without_aidnr->addComponent($i_allow_product_without_aidnr);
	*/
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// monthly_accounting
	$i_monthly_accounting = new HTML_Checkbox('i_monthly_accounting', 'monthly_accounting', lang('monthly_accounting'), ($contract->monthly_accounting == 1 ? true : false));
	$fi_monthly_accounting = new HTML_FormItem('', "fi_monthly_accounting", "monthly_accounting", "", E_REQUIRED::NO);
	$fi_monthly_accounting->setValidationState(form_error("monthly_accounting") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_monthly_accounting->addComponent($i_monthly_accounting);
	if ($read_only_view){
		$i_monthly_accounting->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// original_rz
	
	$i_original_rz = new HTML_Checkbox('i_original_rz', 'original_rz', lang('original_rz'), ($contract->original_rz == 1 ? true : false),1,E_ENABLED::YES);
	$fi_original_rz = new HTML_FormItem('', "fi_original_rz", "original_rz", "", E_REQUIRED::NO);
	$fi_original_rz->setValidationState(form_error("original_rz") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_original_rz->addComponent($i_original_rz);
	if ($read_only_view){
		$i_original_rz->setEnabled(E_ENABLED::NO);
	}
	
	// copy_rz
	$i_copy_rz = new HTML_Checkbox('i_copy_rz', 'copy_rz', lang('copy_rz'), ($contract->copy_rz == 1 ? true : false),1,E_ENABLED::YES);
	$fi_copy_rz = new HTML_FormItem('', "fi_copy_rz", "copy_rz", "", E_REQUIRED::NO);
	$fi_copy_rz->setValidationState(form_error("copy_rz") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_copy_rz->addComponent($i_copy_rz);
	if ($read_only_view){
		$i_copy_rz->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// original_gen
	$i_original_gen = new HTML_Checkbox('i_original_gen', 'original_gen', lang('original_gen'), ($contract->original_gen == 1 ? true : false),1,$enable_checkboxes_if_kv_requiered);
	$fi_original_gen = new HTML_FormItem('', "fi_original_gen", "original_gen", "", E_REQUIRED::NO);
	$fi_original_gen->setValidationState(form_error("original_gen") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_original_gen->addComponent($i_original_gen);
	if ($read_only_view){
		$i_original_gen->setEnabled(E_ENABLED::NO);
	}
	
	// copy_gen
	$i_copy_gen = new HTML_Checkbox('i_copy_gen', 'copy_gen', lang('copy_gen'), ($contract->copy_gen == 1 ? true : false),1,$enable_checkboxes_if_kv_requiered);
	$fi_copy_gen = new HTML_FormItem('', "fi_copy_gen", "copy_gen", "", E_REQUIRED::NO);
	$fi_copy_gen->setValidationState(form_error("copy_gen") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_copy_gen->addComponent($i_copy_gen);
	if ($read_only_view){
		$i_copy_gen->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// billing_not_supplied
	$i_billing_not_supplied = new HTML_Checkbox('i_billing_not_supplied', 'billing_not_supplied', lang('billing_not_supplied'), ($contract->billing_not_supplied == 1 ? true : false));
	$fi_billing_not_supplied = new HTML_FormItem('', "fi_billing_not_supplied", "billing_not_supplied", "", E_REQUIRED::NO);
	$fi_billing_not_supplied->setValidationState(form_error("billing_not_supplied") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_billing_not_supplied->addComponent($i_billing_not_supplied);
	if ($read_only_view){
		$i_billing_not_supplied->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// proof_of_delivery_needed
	/*
	$i_proof_of_delivery_needed = new HTML_Checkbox('i_proof_of_delivery_needed', 'proof_of_delivery_needed', lang('proof_of_delivery_needed'), ($contract->proof_of_delivery_needed == 1 ? true : false));
	$fi_proof_of_delivery_needed = new HTML_FormItem('', "fi_proof_of_delivery_needed", "proof_of_delivery_needed", "", E_REQUIRED::NO);
	$fi_proof_of_delivery_needed->setValidationState(form_error("proof_of_delivery_needed") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_proof_of_delivery_needed->addComponent($i_proof_of_delivery_needed);
	*/
	
	$opt_proof_of_delivery_needed = array();
	
	foreach (E_CONTRACT_DELIVERY_PROOF::getConstants() as $name => $value)
	{
		$opt_proof_of_delivery_needed[] = array("key"=>$name, "label"=>lang($value));
	}
	$options_proof_of_delivery_needed= HTML_Select::buildOptions($opt_proof_of_delivery_needed, 'key', 'label', $needed_delivery_proofs, lang('no_selection'), true, true);
	
	$i_proof_of_delivery_needed = new HTML_Select("i_proof_of_delivery_needed", "proof_of_delivery_needed[]", $options_proof_of_delivery_needed, true, lang('no'));
	$fi_proof_of_delivery_needed = new HTML_FormItem(lang("proof_of_delivery_needed"), "fi_proof_of_delivery_needed", "proof_of_delivery_needed", array(), E_REQUIRED::NO);
	$fi_proof_of_delivery_needed->setValidationState(form_error('proof_of_delivery_needed') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_proof_of_delivery_needed->addComponent($i_proof_of_delivery_needed);
	if ($read_only_view){
		$i_proof_of_delivery_needed->setEnabled(E_ENABLED::NO);
	}

    // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    // difference_first_follow_supply
    $i_ce_first_supply = new HTML_Checkbox('i_ce_first_supply', 'ce_first_supply', lang('ce_first_supply'), ($contract->ce_first_supply == 1 ? true : false));
    $fi_ce_first_supply = new HTML_FormItem('', "fi_ce_first_supply", "ce_first_supply", "", E_REQUIRED::NO);
    $fi_ce_first_supply->setValidationState(form_error("ce_first_supply") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
    $fi_ce_first_supply->addComponent($i_ce_first_supply);
    if ($read_only_view){
        $i_ce_first_supply->setEnabled(E_ENABLED::NO);
    }

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// difference_first_follow_supply
	$i_difference_first_follow_supply = new HTML_Checkbox('i_difference_first_follow_supply', 'difference_first_follow_supply', lang('difference_first_follow_supply'), ($contract->difference_first_follow_supply == 1 ? true : false));
	$fi_difference_first_follow_supply = new HTML_FormItem('', "fi_difference_first_follow_supply", "difference_first_follow_supply", "", E_REQUIRED::NO);
	$fi_difference_first_follow_supply->setValidationState(form_error("difference_first_follow_supply") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_difference_first_follow_supply->addComponent($i_difference_first_follow_supply);
	if ($read_only_view){
		$i_difference_first_follow_supply->setEnabled(E_ENABLED::NO);
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Kennzeichen-Eingrenzung	
	$options_difference_supply = HTML_Select::buildOptions($available_characteristics, 'aid_characteristic', 'new_description', $restricted_characteristic, lang('no_selection'), true, true);

	$i_restriction_characteristic = new HTML_Select("i_restriction_characteristic", "restriction_characteristic[]", $options_difference_supply, true, lang('no'));
	$fi_restriction_characteristic= new HTML_FormItem(lang("restriction_characteristic"), "fi_restriction_characteristic", "i_restriction_characteristic", array(), E_REQUIRED::NO);
	$fi_restriction_characteristic->setValidationState(form_error('restriction_characteristic') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_restriction_characteristic->addComponent($i_restriction_characteristic);
	if ($read_only_view){
		$i_restriction_characteristic->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// area_based_restriction
	$i_area_based_restriction = new HTML_Checkbox('i_area_based_restriction', 'area_based_restriction', lang('area_based_restriction'), ($contract->area_based_restriction == 1 ? true : false));
	$fi_area_based_restriction = new HTML_FormItem('', "fi_area_based_restriction", "area_based_restriction", "", E_REQUIRED::NO);
	$fi_area_based_restriction->setValidationState(form_error("area_based_restriction") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_area_based_restriction->addComponent($i_area_based_restriction);
	if ($read_only_view){
		$i_area_based_restriction->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// patient_documentation
	/*
	$i_patient_documentation = new HTML_Checkbox('i_patient_documentation', 'patient_documentation', lang('patient_documentation'), ($contract->patient_documentation == 1 ? true : false));
	$fi_patient_documentation = new HTML_FormItem('', "fi_patient_documentation", "patient_documentation", "", E_REQUIRED::NO);
	$fi_patient_documentation->setValidationState(form_error("patient_documentation") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_patient_documentation->addComponent($i_patient_documentation);
	*/
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// consultation
	/*
	$i_consultation = new HTML_Checkbox('i_consultation', 'consultation', lang('consultation'), ($contract->consultation == 1 ? true : false));
	$fi_consultation = new HTML_FormItem('', "fi_consultation", "consultation", "", E_REQUIRED::NO);
	$fi_consultation->setValidationState(form_error("consultation") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_consultation->addComponent($i_consultation);
	*/
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// days_until_billing
	$i_days_until_billing = new HTML_Input("i_days_until_billing", "days_until_billing", E_INPUTTYPE::NUMBER, "", $contract->days_until_billing);
	$i_days_until_billing->addAttribute('min', 0);
	$fi_days_until_billing = new HTML_FormItem(lang("days_until_billing"), "fi_days_until_billing", "days_until_billing");
	$fi_days_until_billing->setValidationState(form_error("days_until_billing") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_days_until_billing->addComponent($i_days_until_billing);
	if ($read_only_view){
		$i_days_until_billing->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// max_month_perma_prescription
	$i_max_month_perma_prescription = new HTML_Input("i_max_month_perma_prescription", "max_month_perma_prescription", E_INPUTTYPE::NUMBER, "", $contract->max_month_perma_prescription);
	$i_max_month_perma_prescription->addAttribute('min', 0);
	$fi_max_month_perma_prescription = new HTML_FormItem(lang("max_month_perma_prescription"), "fi_max_month_perma_prescription", "max_month_perma_prescription");
	$fi_max_month_perma_prescription->setValidationState(form_error("max_month_perma_prescription") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_max_month_perma_prescription->addComponent($i_max_month_perma_prescription);
	if ($read_only_view){
		$i_max_month_perma_prescription->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// alidity_recipe_in_days
	$i_alidity_recipe_in_days = new HTML_Input("i_alidity_recipe_in_days", "alidity_recipe_in_days", E_INPUTTYPE::NUMBER, "", $contract->alidity_recipe_in_days);
	$i_alidity_recipe_in_days->addAttribute('min', 0);
	$fi_alidity_recipe_in_days = new HTML_FormItem(lang("alidity_recipe_in_days"), "fi_alidity_recipe_in_days", "alidity_recipe_in_days");
	$fi_alidity_recipe_in_days->setValidationState(form_error("alidity_recipe_in_days") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_alidity_recipe_in_days->addComponent($i_alidity_recipe_in_days);
	if ($read_only_view){
		$i_alidity_recipe_in_days->setEnabled(E_ENABLED::NO);
	}
	
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// limit_of_months_protest_billing
	$i_limit_of_months_protest_billing = new HTML_Input("i_limit_of_months_protest_billing", "limit_of_months_protest_billing", E_INPUTTYPE::NUMBER, "", $contract->limit_of_months_protest_billing);
	$i_limit_of_months_protest_billing->addAttribute('min', 0);
	$fi_limit_of_months_protest_billing = new HTML_FormItem(lang("limit_of_months_protest_billing"), "fi_limit_of_months_protest_billing", "limit_of_months_protest_billing");
	$fi_limit_of_months_protest_billing->setValidationState(form_error("limit_of_months_protest_billing") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_limit_of_months_protest_billing->addComponent($i_limit_of_months_protest_billing);
	if ($read_only_view){
		$i_limit_of_months_protest_billing->setEnabled(E_ENABLED::NO);
	}
	
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// workdays_until_delivery 
	//OLD
	/*
	$i_workdays_until_delivery = new HTML_Input("i_workdays_until_delivery", "workdays_until_delivery", E_INPUTTYPE::NUMBER, "", $contract->workdays_until_delivery);
	$i_workdays_until_delivery->addAttribute('min', 0);
	$fi_workdays_until_delivery = new HTML_FormItem(lang("workdays_until_delivery"), "fi_workdays_until_delivery", "workdays_until_delivery");
	$fi_workdays_until_delivery->setValidationState(form_error("workdays_until_delivery") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_workdays_until_delivery->addComponent($i_workdays_until_delivery);
	*/
	$opt_workdays = array();
	
	foreach ($array_workdays_until_delivery as $name => $value)
	{
		$opt_workdays[] = array("key"=>$name, "label"=>$value);
	}
	$options_workdays_until_delivery= HTML_Select::buildOptions($opt_workdays, 'key', 'label', $contract->workdays_until_delivery, lang('no_selection'), true, true);
	$i_workdays_until_delivery = new HTML_Select("i_workdays_until_delivery", "workdays_until_delivery", $options_workdays_until_delivery, false, lang('please_choose'));
	$fi_workdays_until_delivery = new HTML_FormItem(lang("workdays_until_delivery"), "fi_workdays_until_delivery", "workdays_until_delivery", array(), E_REQUIRED::NO);
	$fi_workdays_until_delivery->setValidationState(form_error('workdays_until_delivery') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_workdays_until_delivery->addComponent($i_workdays_until_delivery);
	if ($read_only_view){
		$i_workdays_until_delivery->setEnabled(E_ENABLED::NO);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/*
	$additional_payments = array();
	foreach (E_ADDITIONAL_PAYMENT_OPTIONS::getConstants() as $name => $value)
	{
		$additional_payments[] = array("key"=>$name, "label"=>lang($value));
	}
	$options = HTML_Select::buildOptions($additional_payments, 'key', 'label', $contract->additional_payment_info, lang('no_selection'), true);
	
	$i_additional_payment_info = new HTML_Select("i_additional_payment_info", "additional_payment_info", $options, false, lang('please_choose') );
	$fi_additional_payment_info = new HTML_FormItem(lang("additional_payment_info"), "fi_additional_payment_info", "additional_payment_info", array(), E_REQUIRED::NO);
	$fi_additional_payment_info->setValidationState(form_error('additional_payment_info') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_additional_payment_info->addComponent($i_additional_payment_info);
	*/
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$productgroup_options = array();
	
	foreach (E_PRODUCT_GROUPS::getConstants() as $name => $value)
	{
		$productgroup_options[] = array("key"=>$name, "label"=>lang($value));
	}
	$options_pg = HTML_Select::buildOptions($productgroup_options, 'key', 'label', $product_groupse, lang('no_selection'), true, true);
	$i_productgroup = new HTML_Select("i_productgroup", "productgroup[]", $options_pg, true, lang('please_choose'));
	$fi_productgroup = new HTML_FormItem(lang("productgroup"), "fi_productgroup", "productgroup", array(), E_REQUIRED::YES);
	$fi_productgroup->setValidationState(form_error('productgroup') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_productgroup->addComponent($i_productgroup);
	if ($read_only_view){
		$i_productgroup->setEnabled(E_ENABLED::NO);
	}
	
	// LEGS contract_legs 
	$i_contract_legs = new HTML_Input("i_contract_legs", "contract_legs", E_INPUTTYPE::TEXT, "", $contract->contract_legs);
	$fi_contract_legs = new HTML_FormItem(lang("contract_legs"), "fi_contract_legs", "i_contract_legs", array(), E_REQUIRED::YES);
	$fi_contract_legs->setValidationState(form_error("contract_legs") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_contract_legs->addComponent($i_contract_legs);
	if ($read_only_view){
		$i_contract_legs->setEnabled(E_ENABLED::NO);
	}
	
	$btn_new_flatrate = "";
	if ($read_only_view == 0 && BASE_Controller::hasPermission(E_PERMISSIONS::ROOT_CONTRACT_CREATE) === true)
	{
		$btn_new_flatrate = new HTML_Button("btn_new_flatrate", "btn_new_flatrate", lang("create_flatrate"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
		$btn_new_flatrate = $btn_new_flatrate->generateHTML();
	}
	
	$tbl_flatrates = new HTML_Datatable("tbl_contract_flatrates", $contract->get_table_columns_flatrates(),array());
	
	// billable_until_months
	$i_billable_until_months = new HTML_Input("i_billable_until_months", "billable_until_months", E_INPUTTYPE::NUMBER, "", $contract->billable_until_months);
	$i_billable_until_months->addAttribute('min', 0);
	$fi_billable_until_months = new HTML_FormItem(lang("billable_until_months"), "fi_billable_until_months", "billable_until_months");
	$fi_billable_until_months->setValidationState(form_error("billable_until_months") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_billable_until_months->addComponent($i_billable_until_months);
	if ($read_only_view){
		$i_billable_until_months->setEnabled(E_ENABLED::NO);
	}
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Bundesländer
	$options_subcountry = HTML_Select::buildOptions($available_subcountries, 'reference_number', 'subdivision_name_native', $restricted_subcountries, lang('no_selection'), true, true);
	
	$i_restriction_subcountry = new HTML_Select("i_restriction_subcountry", "restriction_subcountry[]", $options_subcountry, true, lang('please_choose'));
	$fi_restriction_subcountry= new HTML_FormItem(lang("restriction_subcountry"), "fi_restriction_subcountry", "i_restriction_subcountry", array(), E_REQUIRED::NO);
	$fi_restriction_subcountry->setValidationState(form_error('restriction_subcountry') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_restriction_subcountry->addComponent($i_restriction_subcountry);
	if ($read_only_view){
		$i_restriction_subcountry->setEnabled(E_ENABLED::NO);
	}
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	//restriction_plz
	
	$i_restriction_plz = new HTML_Input("i_restriction_plz", "restriction_plz", E_INPUTTYPE::TEXT, lang('hint_plz_restriction'), $contract->restriction_plz);
	$fi_restriction_plz = new HTML_FormItem(lang("restriction_plz"), "fi_restriction_plz", "i_restriction_plz", array(), E_REQUIRED::NO);
	$fi_restriction_plz->setValidationState(form_error("restriction_plz") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_restriction_plz->addComponent($i_restriction_plz);
	if ($read_only_view){
		$i_restriction_plz->setEnabled(E_ENABLED::NO);
	}
	
	$i_hint_restriction_plz = new HTML_Alert("i_hint_restriction_plz", lang("info")." ".lang("restriction_plz"), lang("hint_plz_restriction"), E_COLOR::INFO, E_DISMISSABLE::NO);
	$fi_hint_restriction_plz = new HTML_FormItem('', "fi_hint_restriction_plz", "i_hint_restriction_plz", array(), E_REQUIRED::NO);
	$fi_hint_restriction_plz->addComponent($i_hint_restriction_plz);
	if ($read_only_view){
		$i_hint_restriction_plz->setEnabled(E_ENABLED::NO);
	}
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	
	$btn_submit_contract = new HTML_Button("bt_submit", "btn_save_contract", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit_contract->setAttributes(array("form" => "form_contract"));
	$btn_submit_contract->setType(E_BUTTON_TYPES::SUBMIT);
	
	$btn_reset_contract = new HTML_Button("bt_reset", "reset_contract", lang("undo"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset_contract->setAttributes(array("form" => "form_contract"));
	$btn_reset_contract->setType(E_BUTTON_TYPES::RESET);
	
	$fi_submit_contract = new HTML_FormItem("", "fi_submit_contract", "submit");
	$fi_submit_contract->addComponent($btn_submit_contract);
	
	$hidden_contract_id 		= new HTML_Input("i_contract_id", "contract_id", E_INPUTTYPE::HIDDEN, lang("contract_id"), $contract->contract_id);
	$hidden_contract_revision 	= new HTML_Input("i_contract_revision", "contract_revision", E_INPUTTYPE::HIDDEN, lang("revision"), $contract->contract_revision);
	$hidden_contract_name 		= new HTML_Input("i_contract_name", "contract_name_orig", E_INPUTTYPE::HIDDEN, lang("contract_name"), $contract->contract_name);
	$hidden_contract_save 		= new HTML_Input("i_save", "save_contract", E_INPUTTYPE::HIDDEN, lang("save"), 1);
	
	
        	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$form = new HTML_Form("form_contract_data", "form_contract_data", "#", lang("data_common"));
	$form->addFormItem($fi_contract_name);
	$form->addFormItem($fi_contract_desc);
	$form->addFormItem($fi_target_group);
	$form->addFormItem($fi_contract_startdate);
	$form->addFormItem($fi_contract_enddate);
	//$form->addFormItem($fi_valid_area);
	$form->addFormItem($fi_productgroup);
	$form->addFormItem($fi_contract_legs);
	$form->addFormItem($fi_non_flatrate_contract);
	
	$form->addFormItem($hidden_contract_id);
	$form->addFormItem($hidden_contract_revision);
	$form->addFormItem($hidden_contract_name);
	$form->addFormItem($hidden_contract_save);
	
	$form->addFormItem("<div id='div_for_flatrate_contract'>".HTML_FormItem::buildLegendItem(lang("flatrates"))."</div>");
	if ($contract->contract_id == null || $contract->contract_id == "")
	{
		$hint_save_contract_first = new HTML_Alert("hint_save_first", lang("info"), lang("msg_you_need_to_save_the_contract_first"), E_COLOR::INFO, E_DISMISSABLE::NO);
		$form->addFormItem($hint_save_contract_first);
	}
	else
	{
	 
		$form->addFormItem($btn_new_flatrate);
		$form->addFormItem($tbl_flatrates);
	}
	
	
	
	
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$form2 = new HTML_Form("form_contract_details", "form_contract_details", "#", lang("contract_details"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form2->addFormItem($fi_kv_requiered);
	$form2->addFormItem($fi_kv_necessary_from_cost);
	//$form2->addFormItem($fi_kv_necessary_from_piece);
	
	$form2->addFormItem($fi_monthly_accounting);
	$form2->addFormItem($fi_original_rz);
	$form2->addFormItem($fi_copy_rz);
	$form2->addFormItem($fi_original_gen);
	$form2->addFormItem($fi_copy_gen);
    $form2->addFormItem($fi_ce_first_supply);
	$form2->addFormItem($fi_difference_first_follow_supply);
	$form2->addFormItem($fi_restriction_characteristic);
	
	$form2->addFormItem($fi_proof_of_delivery_needed);
	$form2->addFormItem($fi_billing_not_supplied);
	$form2->addFormItem($fi_area_based_restriction);
	$form2->addFormItem($fi_restriction_subcountry);
	$form2->addFormItem($fi_restriction_plz);
	$form2->addFormItem($fi_hint_restriction_plz);
	
	//$form2->addFormItem($fi_patient_documentation);
	//$form2->addFormItem($fi_consultation);
	$form2->addFormItem($fi_days_until_billing);
	$form2->addFormItem($fi_workdays_until_delivery);
	$form2->addFormItem($fi_limit_of_months_protest_billing);
	$form2->addFormItem($fi_max_month_perma_prescription);
	$form2->addFormItem($fi_alidity_recipe_in_days);
	//$form2->addFormItem($fi_additional_payment_info);
	$form2->addFormItem($fi_billable_until_months);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: put all contract forms together
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$full_form_contract = new HTML_Form("form_contract", "form_contract", base_url("root/contracts/") . ($contract->contract_id == "" ? "create" : "edit"), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	// $full_form->setAttributes(array("enctype"=>"multipart/form-data"));
	
	
	$buttons = $read_only_view == 1 ? "" : $btn_reset_contract->generateHTML() . $btn_submit_contract->generateHTML();
    
    $full_form_contract->addFormItem(
		$page_alerts . '
		<div class="col-xs-12 ">'.$buttons.'</div>

		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">' . 
			$form->generateHTML(true). '
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">' . 
			$form2->generateHTML(true) . '
		</div>'
	);
	
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: Insurance view
	$insurance_data = array(
		"data"=>array(
			"contract" => $data["contract"],
			"available_costcarrier" => $available_costcarrier,
			"read_only_view" => $data["read_only_view"]
		)
	);
	
	$insurances = $this->load->view("root/contract/contract_insurances", $insurance_data, true);
	
	//$document_editor = $this->load->view("root/contract/contract_document_editor", array(), true);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: Documents view
	$documents_data = array(
		"data"=>array(
			"contract" => $data["contract"],
			"available_document_types" => $available_document_types,
		    "document_editor" => $document_editor,
		    "available_global_documents"=>$data["available_global_documents"],
            "read_only_view" => $data["read_only_view"]
		)
	);
	
	$documents = $this->load->view("root/contract/contract_documents", $documents_data, true);
	
	// further informations
	$contract_dat =array(
	 "data"=>array(
			"contract" => $data["contract"],
			"read_only_view" => $data["read_only_view"]
		)
	);
	$contract_further_information = $this->load->view("root/contract/contract_further_information", $contract_dat, true);;
	
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: Flatrates view
	$flatrate_data = array(
	    "data"=>array(
			"contract" => $data["contract"],
			"flatrate_articles" => $data["flatrate_articles"],
		)
	);
	$flatrates = $this->load->view("root/contract/contract_flatrates", $flatrate_data, true);
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: TAB-Settings
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$tabs = array(
		"contract" => "",
		"contract_health_insurances" => "",
		"contract_documents" => "",
		"debug" => ""
	);
	
?>
<div class="row button-row">
	<div class="col-xs-12 ">
	</div>
</div>
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<ul id="contract-tab-list" class="nav nav-tabs fadeInRight" style="">
			<li class="active">
				<a data-toggle="tab" href="#contract"><?php echo lang("data_general"); ?></a>
			</li>
			
			<?php if ($contract->contract_id != ""):?>
			<li class="">
				<a data-toggle="tab" href="#contract_health_insurances"><?php echo lang("health_insurances");?></a>
			</li>
			
			<li class="">
				<a data-toggle="tab" href="#contract_documents"><?php echo lang("documents");?></a>
			</li>
			<li class="">
				<a data-toggle="tab" href="#contract_further_information"><?php echo lang("further_information");?></a>
			</li>
			<?php endif;?>
			<!--  <li class=""><a data-toggle="tab" href="#debug"><?php //echo lang("info");?></a></li>-->
		</ul>

		<div id="contract-tab-content" class="tab-content fadeInLeft" style="">
			<div id="contract" class="tab-pane fade in active">
				<br><?php echo $full_form_contract->generateHTML(); ?>
			</div>
			
			<?php if ($contract->contract_id != ""):?>
			<div id="contract_health_insurances" class="tab-pane fade">
				<br><?php echo $insurances; ?>
			</div>

			<div id="contract_documents" class="tab-pane fade">
				<?php echo $documents;?>
			</div>
			<div id="contract_further_information" class="tab-pane fade">
				<?php echo $contract_further_information;?>
			</div>
			
			<?php endif;?>
			<!--  <div id="debug" class="tab-pane fade">
				<pre><?php //echo print_r($contract, true);?></pre>
			</div>
			-->
		</div>
	</div>
</div>
<script>
	var tbl_columns_flatrates = <?php echo json_encode($contract->get_table_columns_flatrates()); ?>;
	var read_only_view = <?php echo $read_only_view ?>;
</script>