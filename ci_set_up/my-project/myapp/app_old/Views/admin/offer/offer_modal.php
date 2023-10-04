<?php
$page_alerts = buildPageAlerts($error, $success, $warning, $info);

$title = new HTML_Label("", lang("offer_start_title"), "black");

$all_client = $data["all_client"];


$offer_type = new HTML_FormItem(lang("offer_type"), "offer_type", "offer_type", array(), E_REQUIRED::YES);
$offer_type->setValidationState(form_error('offer_type') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
//$flsr_offer_parts_list->addComponent(new HTML_Checkbox("i_offer_parts_list", "offer_parts_list[]", lang("offer_parts_yes") , false, null,
//    E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array("assign_roles"),array()));
//$flsr_offer_parts_list->addComponent(new HTML_Checkbox("i_offer_parts_list", "offer_parts_list[]", lang("offer_parts_no") , true, null,
//    E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array("assign_roles"),array()));
//$adjustment_assistant = new HTML_Anchor("adjustment_assistant", "<span>" . lang("adjustment") . "&nbsp;&nbsp;</span>" . $adjustment_assistant_label . " ", base_url("admin/adjustment_assistant"), "", $adjustment_visible, array(), array(), array());

$offer_type->addComponent(new HTML_Radio("i_offer_type_main", "offer_type", '<i class="fa fa-folder offer-fa" aria-hidden="true"></i><span>' . lang("i_offer_type_main") . '</span>', E_CHECKED::NO, "main_offer"));
$offer_type->addComponent(new HTML_Radio("i_offer_type_side_offer", "offer_type", '<i class="fa  fa-file-text offer-fa" aria-hidden="true"></i><span>' .lang("i_offer_type_side_offer"), E_CHECKED::YES, "side_offer", "", "", "", "", "offer-border"));
//$offer_type->addComponent(new HTML_Radio("i_offer_type_3", "offer_type",'<i class="fa fa-file offer-fa" aria-hidden="true"></i><span>' . lang("i_offer_type_3"), E_CHECKED::NO, 3));
$offer_type->addClass("radio_button_green  ");


//$offer_name = new HTML_FormItem(lang("offer_name"), "offer_name", "offer_name", array(), E_REQUIRED::YES);
//$offer_name->setValidationState(form_error('offer_name') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
//$offer_name->addComponent(new HTML_Input("i_offer_name", "offer_name", E_INPUTTYPE::TEXT, lang("offer_name"), null));


$offer_name = new HTML_Input("i_offer_name_modal", "offer_name_modal", E_INPUTTYPE::TEXT, lang("offer_name_modal"), null);
$offer_name_1 = new HTML_FormItem(lang("offer_name_modal"), "offer_name", "offer_name", array(), E_REQUIRED::YES);
$offer_name_1->setValidationState( form_error('offer_name') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$offer_name_1->addComponent(
    '<div class="row">
        <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5 " >'.
            $offer_name->generateHTML().'
        </div>
    </div>');
$offer_name_1->addClass("padding_top_20");
//$offer_name_1->setStyles(["display" => "none"]);



$main_offer = new HTML_Select("i_main_offer", "main_offer", HTML_Select::buildOptions(null, "main_offer", "displayString", null, lang("please_select"), true), false, "", E_VISIBLE::YES );
$main_offer_l = new HTML_FormItem(lang("main_offer_l"), "main_offer_l", "main_offer_l", array(), E_REQUIRED::NO);
$main_offer_l->setValidationState( form_error('main_offer_l') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$main_offer_l->addComponent(
    '<div class="row ">
        <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5 " >'.
            $main_offer->generateHTML().'
        </div>
    </div>');
//$main_offer_l->setStyles(["display" => "none"]);


$offer_name_customer = new HTML_Select("i_offer_name_customer", "offer_name_customer", HTML_Select::buildOptions($all_client, "client_id", "client_name", null, lang("please_select"), true), false, "", E_VISIBLE::YES );
$offer_name_customer_l = new HTML_FormItem(lang("i_offer_name_customer_l"), "i_offer_name_customer_l", "i_offer_name_customer_l", array(), E_REQUIRED::NO);
$offer_name_customer_l->setValidationState( form_error('i_offer_name_customer_l') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$offer_name_customer_l->addComponent(
    '<div class="row ">
        <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5 " >'.
            $offer_name_customer->generateHTML().'
        </div>
    </div>');
//$offer_name_customer_l->setStyles(["display" => "none"]);




$btn_submit = new HTML_Button("form_offer_modal", "submit_head_offer", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array("value"=>"submit"), array());
$btn_submit->setType(E_BUTTON_TYPES::SUBMIT)->setValue("submit")->setAttributes(array("form"=>"form_offer_modal")); // since we place this button outside the form

$btn_back = new HTML_Button("bt_back", "back", lang("back"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::ARROW_RIGHT, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
$btn_back->setAttributes(array("form"=>"form_offer"))->setValue(1)->setType(E_BUTTON_TYPES::BUTTON);

$action = "create";
$form = new HTML_Form("form_offer_modal", "form_offer_modal", base_url("admin/offer/".$action), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());
/*$form_left->addFormItem(...)
            ->addFormItem(...)
             ...; add form items here*/
$form->addFormItem($offer_type)
    ->addFormItem($offer_name_1)
    ->addFormItem($offer_name_customer_l)
    ->addFormItem($main_offer_l);

?>


<div class="row text-center">
    <br><br>
    <?php echo $title->generateHTML(); ?>
    <br><br><br>
    <div class="row no-margin">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <?php echo $form->generateHTML(); ?>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 padding_top_20">
            <?php
            echo $btn_back->generateHTML()."&nbsp;";
            echo $btn_submit->generateHTML();
            ?>
        </div>

    </div>
</div>
