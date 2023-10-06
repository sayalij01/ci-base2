<?php
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create value object
	$contract 					= new T_Contract($data["contract"]);
	$available_document_types	= $data["available_document_types"];
	$available_costcarrier		= $data["available_costcarrier"];
	$filter_assignment			= $data["filter_assignment"];
	$read_only_view             = $data["read_only_view"] == 1 ? 1 : 0;
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$btn_submit_insurance = new HTML_Button("bt_submit_insurance", "save_contract_insurance", '<span class="hidden-xs">'.lang("save").'</span>', E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit_insurance->setAttributes(array("form" => "form_contract_health_insurance"));
	$btn_submit_insurance->setType(E_BUTTON_TYPES::SUBMIT);
	
	$btn_reset_insurance = new HTML_Button("bt_reset_insurance", "reset_contract_insurance", lang("undo"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset_insurance->setAttributes(array("form" => "form_contract_health_insurance"));
	$btn_reset_insurance->setType(E_BUTTON_TYPES::RESET);
	
	$hidden_contract_id 		= new HTML_Input("i_contract_id_insurances", "contract_id_insurances", E_INPUTTYPE::HIDDEN, lang("contract_id"), $contract->contract_id);
	$hidden_contract_revision 	= new HTML_Input("i_contract_rev_insurances", "contract_rev_insurances", E_INPUTTYPE::HIDDEN, lang("contract_id"), $contract->contract_revision);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: CUSTOM FILTERS
	$btn_all 		= new HTML_Button("btn_filter_assignments_show_all", "filter_assignments", lang("all"), E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_all->setValue("all");
	
	$btn_assigned	= new HTML_Button("btn_filter_assignments_show_only_assigned", "filter_assignments", '<span class="hidden-xs">'.lang("assigned").'</span>', E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_assigned->setValue("assigned");
	
	$btn_unassigned	= new HTML_Button("btn_filter_assignments_show_only_unassigned", "filter_assignments", '<span class="hidden-xs">'.lang("unassigned").'</span>', E_COLOR::STANDARD, E_SIZES::STANDARD, "", "left", E_VISIBLE::YES, E_ENABLED::YES);
	$btn_unassigned->setValue("unassigned");
	
	if ($filter_assignment == "assigned"){
		$btn_assigned->addClass("active");
	}
	else if ($filter_assignment == "unassigned"){
		$btn_unassigned->addClass("active");
	}
	else{
		$btn_all->addClass("active");
	}
	
	$btngrp_filter_assigned = new HTML_ButtonGroup("btngrp_filter_assignments");
	$btngrp_filter_assigned->addClass("btn-group-justified");
	$btngrp_filter_assigned->setButtons(array(
		'<div class="btn-group" role="group">'.$btn_all->generateHTML().'</div>',
		'<div class="btn-group" role="group">'.$btn_assigned->generateHTML().'</div>',
		'<div class="btn-group" role="group">'.$btn_unassigned->generateHTML().'</div>'
	));
	
	
	$fi_filter_assignment 	= new HTML_FormItem("", "fi_filter_assignment", "btngrp_filter_assignments");
	$fi_filter_assignment->addComponent($btngrp_filter_assigned);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	array_unshift($available_costcarrier, array("sgb_costcarrier_id"=>"ALL", "sgb_costcarrier_name"=>lang("show_all_cost_carrier")));
	$options = HTML_Select::buildOptions($available_costcarrier, "sgb_costcarrier_id", "sgb_costcarrier_name", "ALL", lang('show_all'), true, true, false);
	
	$i_sgb_costcarrier 		= new HTML_Select("i_sgb_costcarrier_id", "filter_costcarrier", $options, false, lang("filter_costcarrier"));
	$i_sgb_costcarrier->setAllowClear(false);
	
	$fi_sgb_costcarrier 	= new HTML_FormItem("", "fi_sgb_costcarrier", "i_sgb_costcarrier_id");
	$fi_sgb_costcarrier->setValidationState( form_error("sgb_costcarrier_id") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_sgb_costcarrier->addComponent( $i_sgb_costcarrier );
	
	
	$form_filters = new HTML_Form("form_filters", "form_filters", "#", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_filters
	->addFormItem($fi_filter_assignment)
	->addFormItem($fi_sgb_costcarrier)
	;
	
	$filter_columns = '
	<div class="col-xs-12 col-md-8">'.$form_filters->generateHTML().'</div>
	<div class="col-xs-12 "></div>
	<div class="col-xs-12 "></div>
	';
	
	
	
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: assigned insurances
	$tbl = new HTML_Datatable("tbl_contract_insurances", $contract->get_table_columns_health_insurances(), $data['table_data_assigned_insurance']);
	
	if ($read_only_view){
	    $button = "";
    }
	else{
		$button = $btn_submit_insurance->generateHTML();
    }
	
	$form_health_insurances = new HTML_Form("form_contract_health_insurance", "form_contract_health_insurance", base_url("root/contracts/save_health_insurances"), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_health_insurances
	->addFormItem($hidden_contract_id)
	->addFormItem($hidden_contract_revision)
	->addFormItem(
		$page_alerts . '
		<div class="col-xs-2 col-md-2 ">'.$button.'</div>
		<div class="col-xs-10 col-md-10 ">'.$filter_columns.'</div>
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">'.
			$tbl->generateHTML().'
		</div>'
	);

?>
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<?php echo $form_health_insurances->generateHTML(); ?>
	</div>
</div>
<script>
	var table_columns_health_insurances = <?php echo json_encode($contract->get_table_columns_health_insurances()); ?>;
</script>

