<?php
$page_alerts = buildPageAlerts($error, $success, $warning, $info);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: create client object
$warning = new T_Warnings($data["warning"]);
$all_locales = $data["available_languages"];

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: build the client form
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$fi_warning_short = new HTML_FormItem(lang("warning_short"), "fi_warning_short", "warning_short", array(), E_REQUIRED::YES);
$fi_warning_short->setValidationState( form_error('warning_short') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fi_warning_short->addComponent(new HTML_Input("i_warning_short", "warning_short", E_INPUTTYPE::TEXT, lang("warning_short"), $warning->warning_short, "", ""));

$fi_warning_long = new HTML_FormItem(lang("warning_long"), "fi_warning_long", "warning_long", array(), E_REQUIRED::YES);
$fi_warning_long->setValidationState( E_VALIDATION_STATES::NONE);
$fi_warning_long->addComponent(new HTML_Input("i_warning_long", "warning_long", E_INPUTTYPE::TEXT, lang("client"), $warning->warning_long) );

$fi_locale	= new HTML_FormItem(lang("language"), "fi_language", "language");
$fi_locale	->setValidationState( form_error('language') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
$fi_locale->addComponent( new HTML_Select("i_language", "language", HTML_Select::buildOptions($all_locales, "locale_code", "locale_name", $warning->language, "all", false), false, "", E_VISIBLE::YES ) );

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$btn_submit = new HTML_Button("bt_warning_submit", "submit_warning", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array() );
$btn_submit->setAttributes(array("form"=>"form_warning"))->setValue(1)->setType(E_BUTTON_TYPES::SUBMIT);

$btn_reset = new HTML_Button("bt_warning_reset", "reset", lang("undo"), E_COLOR::INFO, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
$btn_reset->setAttributes(array("form"=>"form_warning"))->setType(E_BUTTON_TYPES::RESET);

$fi_submit 	= new HTML_FormItem("", "fi_submit", "submit");
$fi_submit->addComponent($btn_submit);

$hidden_warning_id = new HTML_Input("i_warning_id", "warning_id", E_INPUTTYPE::HIDDEN, lang("warning_id"), $warning->warning_id) ;

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$form_warning = new HTML_Form("form_warning_data", "form_warning_data", "#", "");
$form_warning->addFormItem($fi_warning_short)
             ->addFormItem($fi_warning_long)
             ->addFormItem($fi_locale)
             ->addFormItem($hidden_warning_id);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: put all forms together
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$hidden_save = new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;


$form = new HTML_Form("form_warning", "form_warning_complete", base_url('admin/warnings/').($warning->warning_id == '' ? 'create':'edit'), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
$form->addFormItem($hidden_save);
$form->addFormItem($page_alerts.'
		           <div class="col-xs-12>
			         '.$form_warning->generateHTML(true).'
		           </div>')->addClass('client-form');
    
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$panel 	= new HTML_Panel("pnl_warning", ($warning->warning_id != "" ? lang("warning_edit"):lang("warning_create")) , "", date("d.m.Y"), E_DISMISSABLE::NO, E_VISIBLE::YES, E_COLOR::STANDARD, E_COLOR::STANDARD);
$panel->setContent($form->generateHTML());
$panel->setFooter($btn_submit->generateHTML()."&nbsp;".$btn_reset->generateHTML());
    
?>
<div class="row button-row">
		<div class="col-xs-6 ">
			<?php 
				echo $btn_reset->generateHTML()."&nbsp;";
				echo $btn_submit->generateHTML();
			?>
		</div>
	</div>
<div class="row">
	<div class="col-xs-6">
		<?php echo $form->generateHTML(); ?>
	</div>
</div>
