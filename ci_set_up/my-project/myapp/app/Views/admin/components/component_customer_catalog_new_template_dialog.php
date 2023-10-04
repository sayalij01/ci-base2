<?php

$page_alerts = buildPageAlerts($error, $success, $warning, $info);

$i_template_name = new HTML_Input("i_catalog_template_name", "catalog_template_name", E_INPUTTYPE::TEXT, "", "");
$fi_template_name = new HTML_FormItem(lang("catalog_template_name"), "fi_template_name", "i_catalog_template_name", array(), E_REQUIRED::YES);
$fi_template_name->setValidationState( form_error("catalog_template_name") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fi_template_name->addComponent( $i_template_name );

$hidden_client_id 		= new HTML_Input("customer_catalog_new_template_client_id", "client_id", E_INPUTTYPE::HIDDEN, lang("client_id"), $client->client_id) ;


$btn_submit = new HTML_Button("btn_add_catalog_template", "submit_new_template", lang("add"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::ADD, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array() );
//$btn_submit->setAttributes(array("form"=>"form_clients"))->setValue(1)->setType(E_BUTTON_TYPES::SUBMIT);

$fi_submit 	= new HTML_FormItem("", "fi_submit", "submit");
$fi_submit->addComponent($btn_submit);


$form_new_catalog_template = new HTML_Form("form_new_catalog_template", "form_new_catalog_template", "#", "");
$form_new_catalog_template->addFormItem($fi_template_name)
                          ->addFormItem($hidden_client_id)
                          ->addFormItem($fi_submit);

?>
<div class="row">
	<div class="col-xs-12">
		<?php echo $form_new_catalog_template->generateHTML(); ?>
	</div>
</div>