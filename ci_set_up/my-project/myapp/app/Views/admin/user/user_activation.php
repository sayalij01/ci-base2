<?php 
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	
	$fi_password = new HTML_FormItem(lang("password"), "fi_password", "i_password", array(), E_REQUIRED::YES);
	$fi_password->setValidationState( form_error('password') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_password->addComponent(new HTML_Input("i_password", "password", E_INPUTTYPE::PASSWORD, lang("password"), "" ) );
	
	$fi_password_repeat = new HTML_FormItem(lang("password_repeat"), "fi_password_repeat", "i_password_repeat", array(), E_REQUIRED::YES);
	$fi_password_repeat->setValidationState( form_error('password_repeat') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_password_repeat->addComponent(new HTML_Input("i_password_repeat", "password_repeat", E_INPUTTYPE::PASSWORD, lang("password_repeat"), "") );
	
	$btn_submit = new HTML_Button("bt_submit", "submit_user", lang("activate"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit->setType(E_BUTTON_TYPES::SUBMIT)->setValue(1)->setAttributes(array("form"=>"form_user_activation")); // since we place this button outside the form
	
	$btn_reset = new HTML_Button("bt_reset", "reset", lang("undo"), E_COLOR::INFO, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset->setAttributes(array("form"=>"form_user_activation"))->setValue(1)->setType(E_BUTTON_TYPES::RESET);
	
	$fi_submit 	= new HTML_FormItem("", "fi_submit", "bt_submit");
	$fi_submit->addComponent( $btn_submit );
	
	$hidden_user_id 	= new HTML_Input("i_user_id", "user_id", E_INPUTTYPE::HIDDEN, lang("user_id"), $_SESSION[E_SESSION_ITEM::LINK_DATA]->user_id);
	$hidden_save		= new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$form_user_activation = new HTML_Form("form_user_activation", "form_user_activation", "#", lang("data_password"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_user_activation
	->addFormItem($fi_password)
	->addFormItem($fi_password_repeat)
	->addFormItem($fi_submit)
	->addFormItem($hidden_user_id)
	->addFormItem($hidden_save);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$panel 	= new HTML_Panel("pnl_user", lang("account_activation"), "", "", E_DISMISSABLE::NO, E_VISIBLE::YES, E_COLOR::STANDARD, E_COLOR::STANDARD);
	
	if ($extra["hide_fields"] == true){
		$panel->setContent($page_alerts);
	}
	else{
		$panel->setContent($page_alerts.$form_user_activation->generateHTML());
	}
	
?>
<div class="row hidden-xs"><div style="height: 100px;"></div></div>

<div class="row">
	<div class="col-lg-4 col-md-2 col-sm-2"></div>

	<div class="col-lg-4 col-md-8 col-sm-8">
		<?php echo $panel->generateHTML(); ?>
	</div>

	<div class="col-lg-4 col-md-2 col-sm-2">
	
	</div>
</div>