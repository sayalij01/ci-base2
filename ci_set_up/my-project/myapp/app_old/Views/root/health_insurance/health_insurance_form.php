<?php 
	
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create value object	
	$health_insurance = new T_Health_insurance($data["health_insurance"]);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the health_insurance form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_insurance_id = new HTML_Input("i_insurance_id", "insurance_id", E_INPUTTYPE::TEXT, "", $health_insurance->insurance_id);
	$fi_insurance_id = new HTML_FormItem(lang("insurance_id"), "fi_insurance_id", "i_insurance_id", array(), E_REQUIRED::YES);
	$fi_insurance_id->setValidationState( form_error("insurance_id") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_insurance_id->addComponent( $i_insurance_id );

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_ik_number = new HTML_Input("i_ik_number", "ik_number", E_INPUTTYPE::TEXT, "", $health_insurance->ik_number,"","",true,true,array(),array(),array("maxlength"=>9));
	$fi_ik_number = new HTML_FormItem(lang("ik_number"), "fi_ik_number", "i_ik_number", array(), E_REQUIRED::YES);
	$fi_ik_number->setValidationState( form_error("ik_number") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_ik_number->addComponent( $i_ik_number );

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_insurance_name = new HTML_Input("i_insurance_name", "insurance_name", E_INPUTTYPE::TEXT, "", $health_insurance->insurance_name);
	$fi_insurance_name = new HTML_FormItem(lang("health_insurance_name"), "fi_insurance_name", "i_insurance_name", array(), E_REQUIRED::YES);
	$fi_insurance_name->setValidationState( form_error("insurance_name") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_insurance_name->addComponent( $i_insurance_name );

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_street = new HTML_Input("i_street", "street", E_INPUTTYPE::TEXT, "", $health_insurance->street);
	$fi_street = new HTML_FormItem(lang("street"), "fi_street", "i_street", array(), E_REQUIRED::NO);
	$fi_street->setValidationState( form_error("street") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_street->addComponent( $i_street );

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_zipcode = new HTML_Input("i_zipcode", "zipcode", E_INPUTTYPE::TEXT, "", $health_insurance->zipcode);
	$fi_zipcode = new HTML_FormItem(lang("zipcode"), "fi_zipcode", "i_zipcode", array(), E_REQUIRED::NO);
	$fi_zipcode->setValidationState( form_error("zipcode") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_zipcode->addComponent( $i_zipcode );

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_location = new HTML_Input("i_location", "location", E_INPUTTYPE::TEXT, "", $health_insurance->location);
	$fi_location = new HTML_FormItem(lang("location"), "fi_location", "i_location", array(), E_REQUIRED::NO);
	$fi_location->setValidationState( form_error("location") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_location->addComponent( $i_location );

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_phone = new HTML_Input("i_phone", "phone", E_INPUTTYPE::TEXT, "", $health_insurance->phone);
	$fi_phone = new HTML_FormItem(lang("phone"), "fi_phone", "i_phone", array(), E_REQUIRED::NO);
	$fi_phone->setValidationState( form_error("phone") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_phone->addComponent( $i_phone );

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$i_fax = new HTML_Input("i_fax", "fax", E_INPUTTYPE::TEXT, "", $health_insurance->fax);
	$fi_fax = new HTML_FormItem(lang("fax"), "fi_fax", "i_fax", array(), E_REQUIRED::NO);
	$fi_fax->setValidationState( form_error("fax") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_fax->addComponent( $i_fax );

	 
			
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$btn_submit = new HTML_Button("bt_submit", "save", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit->setAttributes(array("form"=>"form_health_insurance")); 
	$btn_submit->setType(E_BUTTON_TYPES::SUBMIT);
	
	$btn_reset = new HTML_Button("bt_reset", "reset", lang("undo"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset->setAttributes(array("form"=>"form_health_insurance"));
	$btn_reset->setType(E_BUTTON_TYPES::RESET);
	
	$fi_submit 	= new HTML_FormItem("", "fi_submit", "submit");
	$fi_submit->addComponent( $btn_submit );
	
	$hidden_ik_number 	= new HTML_Input("i_hidden_ik_number", "hidden_ik_number", E_INPUTTYPE::HIDDEN, lang("ik_number"), $health_insurance->ik_number) ;
	$hidden_health_insurance_name 	= new HTML_Input("i_health_insurance_name", "health_insurance_name_orig", E_INPUTTYPE::HIDDEN, lang("health_insurance_name"), $health_insurance->insurance_name) ;
	$hidden_save 					= new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;
			
	$form = new HTML_Form("form_health_insurance_common", "form_health_insurance_common", "#", lang("data_common"));
	$form->addFormItem($fi_ik_number);
	$form->addFormItem($fi_insurance_name);
	$form->addFormItem($fi_street);
	$form->addFormItem($fi_zipcode);
	$form->addFormItem($fi_location);
	$form->addFormItem($fi_phone);
	$form->addFormItem($fi_fax);
	$form->addFormItem($hidden_ik_number);
	$form->addFormItem($hidden_health_insurance_name);
	$form->addFormItem($hidden_save);
	
	
	$form_additions = new HTML_Form("form_health_insurance_additions", "form_health_insurance_additions", "#", lang("data_additional"));
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: put all forms together
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$full_form = new HTML_Form("form_health_insurance", "form_health_insurance", base_url("root/health_insurances/").($health_insurance->ik_number == "" ? "create":"edit"), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	//$full_form->setAttributes(array("enctype"=>"multipart/form-data"));
	$full_form->addFormItem(
		$page_alerts.' 
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
			$form->generateHTML(true).'
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
		'</div>'
	);
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: output panel
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$panel 	= new HTML_Panel("pnl_health_insurance", ($health_insurance->ik_number != "" ? lang("health_insurance_edit"):lang("health_insurance_create")) , "", date("d.m.Y"), E_DISMISSABLE::NO, E_VISIBLE::YES, E_COLOR::STANDARD, E_COLOR::STANDARD);
	$panel->setContent($page_alerts.$form->generateHTML());
	$panel->setFooter($btn_submit->generateHTML()."&nbsp;".$btn_reset->generateHTML());
	
?>
<div class="row button-row">
	<div class="col-xs-12 ">
		<?php 
			echo $btn_reset->generateHTML()."&nbsp;";
			echo $btn_submit->generateHTML();
		?>
	</div>
</div>
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<?php echo $full_form->generateHTML(); ?>
	</div>
</div>

