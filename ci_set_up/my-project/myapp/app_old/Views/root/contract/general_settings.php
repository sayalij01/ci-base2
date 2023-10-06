<?php
/** @var array $data */

//die("<pre>".print_r($data,true)."</pre>");
$fi_delivery_lead_time = new HTML_FormItem(lang("delivery_lead_time")." (".lang("in_days").")", "fi_delivery_lead_time", "i_delivery_lead_time", array(), E_REQUIRED::NO);
$fi_delivery_lead_time->addComponent(new HTML_Input("i_delivery_lead_time", "delivery_lead_time", E_INPUTTYPE::NUMBER, lang("delivery_lead_time"), $data["client_delivery_lead_time"],"","", true, true,array("width" => "70px")));

$fi_username = new HTML_FormItem(lang("egeko_username"), "fi_egeko_username", "i_egeko_username", array(), E_REQUIRED::NO);
$fi_username->addComponent(new HTML_Input("i_egeko_username", "egeko_username", E_INPUTTYPE::TEXT, lang("egeko_username"), $data["client_egeko_username"]));

$fi_password = new HTML_FormItem(lang("egeko_password"), "fi_egeko_password", "i_egeko_password", array(), E_REQUIRED::NO);
$fi_password->addComponent(new HTML_Input("i_egeko_password", "egeko_password", E_INPUTTYPE::TEXT, lang("egeko_password"), $data["client_egeko_password"]));

$fi_egeko_name = new HTML_FormItem(lang("egeko_name"), "fi_egeko_name", "i_egeko_name", array(), E_REQUIRED::NO);
$fi_egeko_name->addComponent(new HTML_Input("i_egeko_name", "egeko_name", E_INPUTTYPE::TEXT, lang("egeko_name"), $data["client_egeko_name"]));

$btn_send_general_settings = new HTML_Button("bt_general_settings", "send_general_settings", lang("save"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::EMAIL, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
$btn_send_general_settings->setType(E_BUTTON_TYPES::BUTTON);

?>
<br />
<div class="row">
	<div class="col-xs-6">
		<?php echo $fi_delivery_lead_time->generateHTML(); ?>
	</div>
</div>
<br />
<div class="row">
    <div class="col-xs-6">
        <?php echo $fi_username->generateHTML(); ?>
    </div>
</div>
<br />
<div class="row">
    <div class="col-xs-6">
        <?php echo $fi_password->generateHTML(); ?>
    </div>
</div>
<br />
<div class="row">
    <div class="col-xs-6">
        <?php echo $fi_egeko_name->generateHTML(); ?>
    </div>
</div>
<br />
<div class="row">
    <div class="col-xs-6">
        <?php echo $btn_send_general_settings->generateHTML(); ?>
    </div>
</div>
<br />
