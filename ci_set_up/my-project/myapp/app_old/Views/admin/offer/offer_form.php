<?php

$kitpack = new T_Kitpack($data["kitpack"]["kitpacks"][$idx]);
$label_head = "";
if (!is_null($kitpack->kpm_status) && array_key_exists($kitpack->kpm_status, $data["kpm_status"])){
    $label_head .= lang("offer_status").": ".$data["kpm_status"][$kitpack->kpm_status]["label"];
}

if (!is_null($kitpack->owner_id))
{
    foreach ($data["all_users_owner"] as $user){
        if ($user["user_id"] == $kitpack->owner_id)
        {
            if ($label_head != "")
            {
                $label_head .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            $label_head .= lang("offer_owner").": ".$user["displayString"];
        }
    }
}

$label_head = "<div class='text-primary'>".$label_head."</div>";
$ci = &get_instance();
//echo "<pre>".print_r($kitpack,true)."</pre>";

if ($data["copy_standard_kitpack"] == 1) {
    $kitpack->kitpack_name = lang("copy_of") . " " . $kitpack->kitpack_name;
    $kitpack->kitpack_desc = lang("copy_of") . " " . $kitpack->kitpack_desc;
}
$groupnames = $data["available_groupnames"];

//echo "idx: ".$idx."<br />";
//echo "<pre>".print_r($kitpack,true)."</pre>";
//echo "<pre style='height:600px;overflow:auto;'>".print_r($data,true)."</pre>";

/** *********************************************************************************************************************
 * Setup
 ************************************************************************************************************************/

$l_set_name = '<span id="l_set_name" class="text-success label-sm req"><strong>' . lang("kitpack_wizard_label_set_name") . '</strong></span>';
$l_set_name_subtext = '<span id="l_set_name_subtext" class="text-success label-xs">' . lang("kitpack_wizard_label_set_name_subtext") . '</span>';
$i_set_name = new HTML_Input("i_set_name", "set_name", E_INPUTTYPE::TEXT, lang("kitpack_wizard_set_name"), $kitpack->kitpack_name, "", "", true, true, array(), array("form-control-x4"), array());

$l_set_desc = '<span id="l_set_desc" class="text-success label-sm"><strong>' . lang("kitpack_wizard_set_desc") . '</strong></span>';
$l_set_desc_subtext = '<span id="l_set_desc_subtext" class="text-success label-xs">' . lang("kitpack_wizard_set_desc_subtext") . '</span>';
$i_set_desc = new HTML_TextArea("i_set_desc", "set_desc", $kitpack->kitpack_desc, lang("kitpack_description"), true, true, array("height" => "80px !important"), array("form-control-textarea-xl"), array());

$img_tab1 = "<img style=\"padding:0;margin:0;max-width:100%;max-height:100%;width:100%;\" src=\"" . base_url("resources/img/backgrounds/placeholder_img1.png") . "\" />";
$pnl_tab1_side = new HTML_Panel("pnl_tab1_side", lang("kitpack_tab1_panel_text"), $img_tab1, "", false, true, "default", "default", array("margin:" => "0", "padding" => "0"), array(), array());
$pnl_tab1_side->setTitleColor('success');
$pnl_tab1_side->setContentStyle(array("padding" => "0", "margin" => "0"));
$pnl_tab1_side->setTitleStyle(array("font-weight" => "normal", "padding" => "14px", "font-size" => "14px"));
$pnl_tab1_side->setPanelSubtitle(lang("kitpack_tab1_panel_subtext"));
$pnl_tab1_side->setPanelSubtitleSmall(false);

$img_tab2 = "<img style=\"padding:0;margin:0;max-width:100%;max-height:100%;width:100%;\" src=\"" . base_url("resources/img/backgrounds/placeholder_img2.png") . "\" />";
$pnl_tab2_side = new HTML_Panel("pnl_tab1_side", lang("kitpack_tab1_panel_text2"), $img_tab2, "", false, true, "default", "default", array("margin:" => "0", "padding" => "0"), array(), array());
$pnl_tab2_side->setTitleColor('success');
$pnl_tab2_side->setContentStyle(array("padding" => "0", "margin" => "0"));
$pnl_tab2_side->setTitleStyle(array("font-weight" => "normal", "padding" => "10px", "font-size" => "14px"));
$pnl_tab2_side->setPanelSubtitle(lang("kitpack_tab1_panel_subtext2"));
$pnl_tab2_side->setPanelSubtitleSmall(false);

$l_groupname = '<span id="l_groupname" class="text-success label-sm"><strong>' . lang("kitpack_wizard_label_groupname") . '</strong></span>';
$l_groupname_subtext = '<span id="l_groupname_subtext" class="text-success label-xs">' . lang("kitpack_wizard_label_groupname_subtext") . '</span>';

$options = HTML_Select::buildOptions($groupnames, "group_name", "group_name", is_null($kitpack->kitpack_group_name) ? "" : $kitpack->kitpack_group_name, "", true);
$i_groupname = new HTML_Select("i_groupname", "groupname", $options, false, lang("groupname"), E_VISIBLE::YES, E_ENABLED::YES, array("width" => "100%"), array("select-item"), array("data-tags" => "true"));

$all_disciplines = $data["all_disciplines"];
$all_specialization = $data["all_specialization"];

$tender_id = $data["kitpack"]["tender_id"];
$tender_name = $data["kitpack"]["tender_name"];
//$entry_id = $data["entry_id"];
$client = $data["client_data"];
$offer_typ = $kitpack->offer_type;
if($offer_typ == null || $offer_typ == "")
{
    $offer_typ = "standard";
}
$client_id = $kitpack->client_id;
$all_clients = $data["all_client"];
//echo "<pre>".print_r($offer_typ,true)."</pre>";
//echo "<pre>".print_r($data["all_offer_type"],true)."</pre>";

$newAllClientsArray = array();
foreach ($all_clients as $item) {
    $newAllClientsArray[$item['client_id']] = $item;
}
//echo "<pre>".print_r($newAllClientsArray,true)."</pre>";

$address = $client[0]["client_zipcode"] . " " . $client[0]["client_location"] . " " . $client[0]["client_street"] . " " . $client[0]["client_house_nr"];
$countries = $data["countries"];

$offer = $data["kitpack"]["kitpacks"][$idx];

$responsible_manager = $data["responsible_manager"];
$user_group = $data["user_groups"];

$kp_sap_material_no = $kitpack->kp_sap_materialnummer;
$kp_setnumber = $kitpack->kp_setnummer;
$version = $kitpack->version_counter;
$alternative = $kitpack->alternative_counter;
/*if($kp_sap_material_no == null || $kp_sap_material_no == "")
{
    $instance = new WebServices();
    // RequestSAPMatNumber($kitpack->kitpack_name,?string $based_on_set_mat_no=null,?string $debitor_cn=null);
    $instance->init();
    $kp_sap_material_no = $instance->RequestSAPMatNumber("New Kitpack");
    if(!$data["edit_kitpack"])
    {
        $kp_setnumber = $kp_sap_material_no;
        $version = "A";
        $alternative = "1";
    }
}*/
if($kitpack->offer_no != null && $kitpack->offer_no != "")
{
    $offer_number = $kitpack->offer_no;
}
else
{
    $offer_number = $this->offer_model->getNextOfferNumber($this->user_id);
}

/** *********************************************************************************************************************
 * Form Customer informations
 * aer 2023-03-21
 ************************************************************************************************************************/

$form_customer_informations = new HTML_Form("form_customer_informations", "form_customer_informations", "#", lang("fl_offer_title"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());

/*$fl_offer_title = new HTML_Label(lang(""), lang("fl_offer_title"), "black", array(), E_REQUIRED::YES);
$fl_offer_title->setStyles(["font-size" => "17px",]);
$fl_offer_title->addClass("offer-title");*/


$fl_tender_id = new HTML_Input("tender_id_".$idx, "tender_id", E_INPUTTYPE::HIDDEN, "", $tender_id);
$fl_client_id = new HTML_Input("offer_client_id_".$idx, "offer_client_id", E_INPUTTYPE::HIDDEN, "", $client_id);
//$fl_entry_id = new HTML_Input("", "entry_id", E_INPUTTYPE::HIDDEN, "", $entry_id);


//$fl_offer_customer = new HTML_FormItem(lang("offer_customer"), "fm_offer_customer", "offer_customer", array(), E_REQUIRED::YES);
//$fl_offer_customer->setValidationState(form_error('offer_customer') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
//$fl_offer_customer->addComponent(new HTML_Input("i_offer_customer", "offer_customer", E_INPUTTYPE::TEXT, lang("offer_customer"), $client["client_name"]));
////$fl_offer_customer->addClass("padding_top_20");

$fl_offer_customer = new HTML_FormItem(lang("offer_customer"), "fm_offer_customer", "offer_customer", array(), E_REQUIRED::YES);
$fl_offer_customer->setValidationState(form_error('offer_customer') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($all_clients, "client_id", "client_name",  $client["client_id"], lang("please_select"), true);
$fl_offer_customer->addComponent(new HTML_Select("i_offer_customer_".$idx, "client_id", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("offer_customer","select-item"),array("idx"=>$idx)));


//$fl_offer_company = new HTML_FormItem(lang("offer_company"), "fm_offer_company", "offer_company", array(), E_REQUIRED::YES);
//$fl_offer_company->setValidationState(form_error('offer_company') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
//$fl_offer_company->addComponent(new HTML_Input("i_offer_company", "offer_company", E_INPUTTYPE::TEXT, lang("offer_company"), $client["customer_number"]));

$fl_offer_company = new HTML_FormItem(lang("offer_company"), "fm_offer_company", "offer_company", array(), E_REQUIRED::YES);
$fl_offer_company->setValidationState(form_error('offer_company') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($all_clients, "client_id", "customer_number",  $client["client_id"], lang("please_select"), true);
$fl_offer_company->addComponent(new HTML_Select("i_offer_company_".$idx, "offer_customer", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("offer_company","select-item"),array("idx"=>$idx)));

$fl_offer_address = new HTML_FormItem(lang("offer_address"), "fm_offer_address", "offer_street", array(), E_REQUIRED::NO);
$fl_offer_address->setValidationState(form_error('offer_name') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fl_offer_address->addComponent(new HTML_Input("i_offer_street_".$idx, "offer_street", E_INPUTTYPE::TEXT, lang("offer_street"), $client["client_street"],"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array()));

$fl_offer_address_plz = new HTML_Input("i_client_plz_".$idx, "client_plz", E_INPUTTYPE::TEXT, lang("offer_Plz"), $client["client_zipcode"],"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array());
$fl_offer_address_city = new HTML_Input("i_client_city_".$idx, "client_city", E_INPUTTYPE::TEXT, lang("offer_city"), $client["client_location"],"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array());
$fl_offer_address_street = new HTML_Input("i_client_street_".$idx, "client_street", E_INPUTTYPE::TEXT, lang("offer_street"), $client["client_street"],"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array());
$fl_offer_address_house_nr = new HTML_Input("i_client_house_nr_".$idx, "client_house_nr", E_INPUTTYPE::TEXT, lang("offer_house_nr"), $client["client_house_nr"],"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array());

$fl_offer_address = new HTML_FormItem(lang("offer_plz_city"), "flsr_offer_plz", "offer_plz", array(), E_REQUIRED::NO);
$fl_offer_address->setValidationState(form_error('offer_plz_city') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fl_offer_address->addComponent(
    '<div class="row">
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="padding-right: 0px;">' .
    $fl_offer_address_street->generateHTML() . '
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" >' .
    $fl_offer_address_house_nr->generateHTML() . '
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" style="padding-top: 15px;padding-right: 0px;">' .
    $fl_offer_address_plz->generateHTML() . '
        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="padding-top: 15px">' .
    $fl_offer_address_city->generateHTML() . '
        </div>
    </div>');

$fl_offer_country = new HTML_FormItem(lang("offer_country"), "fm_offer_country", "offer_id_country", array(), E_REQUIRED::NO);
$fl_offer_country->setValidationState(form_error('offer_id_country') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($countries, "country", "country", is_null($client["client_country"]) ? -1 : $client["client_country"], lang("please_select"), true);
$fl_offer_country->addComponent(new HTML_Select("i_offer_country_".$idx, "offer_id_country",$options, false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("disabled","select-item"),array() ));

$form_customer_informations->addFormItem($fl_tender_id)
                           ->addFormItem($fl_client_id)
                            ->addFormItem($fl_offer_company)
                           ->addFormItem($fl_offer_customer)
//                           ->addFormItem($fl_offer_customer2)
//                           ->addFormItem($fl_offer_company)
                           ->addFormItem($fl_offer_address)
                           ->addFormItem($fl_offer_country);

/** *********************************************************************************************************************
 * Form sample data
 * aer 2023-03-21
 ************************************************************************************************************************/

$form_sample_data = new HTML_Form("form_sample_data", "form_sample_data", "#", lang("flsr_offer_title"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());

$yes = E_CHECKED::NO;
$no = E_CHECKED::YES;
if(count($kitpack->components)>0)
{
    $yes = E_CHECKED::YES;
    $no = E_CHECKED::NO;
}
$flsr_offer_parts_list = new HTML_FormItem(lang("offer_parts_list"), "flsr_offer_parts_list", "offer_parts_list", array(), E_REQUIRED::NO);
$flsr_offer_parts_list->setValidationState(form_error('offer_parts_list') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_offer_parts_list->addComponent(new HTML_Radio("i_offer_parts_list_yes_".$idx, "list_offer_parts", lang("offer_yes"), $yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_offer_parts_list->addComponent(new HTML_Radio("i_offer_parts_list_no_".$idx, "list_offer_parts", lang("offer_no"), $no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_offer_parts_list->addClass("radio_button_green padding_top_20");

$yes = E_CHECKED::NO;
$no = E_CHECKED::YES;
if(boolval($kitpack->unsterile_sample) !== false || boolval($kitpack->sterile_sample) !== false)
{
    $yes = E_CHECKED::YES;
    $no = E_CHECKED::NO;
}
$flsr_offer_requested = new HTML_FormItem(lang("offer_requested"), "flsr_offer_requested", "offer_requested", array(), E_REQUIRED::NO);
$flsr_offer_requested->setValidationState(form_error('offer_requested') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_offer_requested->addComponent(new HTML_Radio("i_offer_offer_requested_yes_".$idx, "list_offer_requested", lang("offer_yes"), $yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item','sample_request'),array()));
$flsr_offer_requested->addComponent(new HTML_Radio("i_offer_offer_requested_no_".$idx, "list_offer_requested", lang("offer_no"), $no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item','sample_request'),array()));
$flsr_offer_requested->addClass("radio_button_green");

$flsr_sterile_sample = new HTML_FormItem(lang("sterile_sample"), "flsr_sterile_sample", "sterile_sample", array(), E_REQUIRED::NO);
$flsr_sterile_sample->setValidationState(form_error('offer_requested') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_sterile_sample->addComponent(new HTML_Radio("i_sterile_sample_yes_".$idx, "sterile_sample", lang("offer_yes"), $yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_sterile_sample->addComponent(new HTML_Radio("i_sterile_sample_no_".$idx, "sterile_sample", lang("offer_no"), $no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_sterile_sample->addClass("radio_button_green");


//7332 Nachträgliches Muster, Nachträgliches sterile Muster
$checked_yes = E_CHECKED::NO;
$checked_no = E_CHECKED::YES;
if ((bool)$kitpack->later_unsterile_sample || (bool)$kitpack->later_sterile_sample)
{
    $checked_yes = E_CHECKED::YES;
    $checked_no = E_CHECKED::NO;
}
$flsr_later_unsteril_sample = new HTML_FormItem(lang("later_unsterile_sample"), "flsr_later_unsteril_sample", "later_unsteril_sample", array(), E_REQUIRED::NO);
$flsr_later_unsteril_sample->setValidationState(form_error('later_unsteril_sample') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_later_unsteril_sample->addComponent(new HTML_Radio("i_later_unsteril_sample_yes_".$idx, "later_unsteril_sample", lang("offer_yes"), $checked_yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item','later_unsteril_sample'),array()));
$flsr_later_unsteril_sample->addComponent(new HTML_Radio("i_later_unsteril_sample_no_".$idx, "later_unsteril_sample", lang("offer_no"), $checked_no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item','later_unsteril_sample'),array()));
$flsr_later_unsteril_sample->addClass("radio_button_green");

$checked_yes = E_CHECKED::NO;
$checked_no = E_CHECKED::YES;
if (!is_null($kitpack->later_sterile_sample) && (bool)$kitpack->later_sterile_sample)
{
    $checked_yes = E_CHECKED::YES;
    $checked_no = E_CHECKED::NO;
}
$flsr_later_sterile_sample = new HTML_FormItem(lang("later_sterile_sample"), "flsr_later_sterile_sample", "later_sterile_sample", array(), E_REQUIRED::NO);
$flsr_later_sterile_sample->setValidationState(form_error('later_sterile_sample') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_later_sterile_sample->addComponent(new HTML_Radio("i_later_sterile_sample_yes_".$idx, "later_sterile_sample", lang("offer_yes"), $checked_yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item','later_sterile_sample'),array()));
$flsr_later_sterile_sample->addComponent(new HTML_Radio("i_later_sterile_sample_no_".$idx, "later_sterile_sample", lang("offer_no"), $checked_no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item','later_sterile_sample'),array()));
$flsr_later_sterile_sample->addClass("radio_button_green");



	$sample_amount = 0;
if(boolval($kitpack->unsterile_sample) !== false || boolval($kitpack->sterile_sample) !== false)
{
    $sample_amount = intval($kitpack->sample_amount);
}
$flsr_offer_quantity = new HTML_FormItem(lang("offer_quantity"), "flsr_offer_quantity", "offer_quantity", array(), E_REQUIRED::NO);
$flsr_offer_quantity->setValidationState(form_error('offer_quantity') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_offer_quantity->addComponent(new HTML_Input("i_offer_quantity_".$idx, "offer_quantity", E_INPUTTYPE::TEXT, lang("offer_quantity"), $sample_amount,"","",E_ENABLED::YES,E_VISIBLE::YES));

$flsr_offer_adress = new HTML_Input("i_offer_adress_".$idx, "offer_adress", E_INPUTTYPE::TEXT, lang("offer_adress"), $kitpack->sample_address);
$flsr_offer_plz = new HTML_Input("i_offer_plz_".$idx, "offer_plz", E_INPUTTYPE::TEXT, lang("offer_Plz"), $kitpack->sample_zipcode);
$flsr_offer_city = new HTML_Input("i_offer_city_".$idx, "offer_city", E_INPUTTYPE::TEXT, lang("offer_city"), $kitpack->sample_location);
$flsr_offer_street = new HTML_Input("i_offer_street_".$idx, "offer_street", E_INPUTTYPE::TEXT, lang("offer_street"), $kitpack->sample_street);
$flsr_offer_house_nr = new HTML_Input("i_offer_house_nr_".$idx, "offer_house_nr", E_INPUTTYPE::TEXT, lang("offer_house_nr"), $kitpack->sample_house_no);

$flsr_offer_plz_city = new HTML_FormItem(lang("offer_plz_city"), "flsr_offer_plz", "offer_plz", array(), E_REQUIRED::NO);
$flsr_offer_plz_city->addComponent(
    '<div class="row">
        <div class="col-xs-12" style="padding-top:15px;">'.
    $flsr_offer_adress->generateHTML().'       
        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="padding-top: 15px; padding-right: 0px;">' .
    $flsr_offer_street->generateHTML() . '
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" style="padding-top: 15px;">' .
    $flsr_offer_house_nr->generateHTML() . '
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" style="padding-top: 15px;">' .
    $flsr_offer_plz->generateHTML() . '
        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="padding-top: 15px;">' .
    $flsr_offer_city->generateHTML() . '
        </div>
    </div>');

$sample_desired_delivery_date = "";
if($kitpack->sample_desired_delivery_date != "")
{
    $sample_desired_delivery_date = date(lang("date_format"),formatMySQLDate($kitpack->sample_desired_delivery_date));
}
$fr_offer_desired_sample_date = new HTML_FormItem(lang("offer_desired_sample_date"), "fm_offer_desired_sample_datert", "offer_desired_sample_date", array(), E_REQUIRED::NO);
$fr_offer_desired_sample_date->setValidationState(form_error('offer_desired_sample_date') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_desired_sample_date->addComponent(new  HTML_Datepicker("offer_desired_sample_date_".$idx, "offer_desired_sample_date", $sample_desired_delivery_date,"",lang("date_format_long"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$desired_delivery_date = "";
if($kitpack->sample_desired_delivery_date != "")
{
    $desired_delivery_date = date(lang("date_format"),formatMySQLDate($kitpack->desired_delivery_date));
}
$fr_offer_desired_date = new HTML_FormItem(lang("offer_desired_date"), "fm_offer_desired_datert", "offer_desired_date", array(), E_REQUIRED::NO);
$fr_offer_desired_date->setValidationState(form_error('offer_desired_date') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_desired_date->addComponent(new  HTML_Datepicker("offer_desired_date_".$idx, "offer_desired_date", $desired_delivery_date,"",lang("date_format_long"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$yes = E_CHECKED::NO;
$no = E_CHECKED::YES;
if(boolval($kitpack->sterile_sample_request_released) !== false)
{
    $yes = E_CHECKED::YES;
    $no = E_CHECKED::NO;
}
$flsr_offer_steriles_release = new HTML_FormItem(lang("offer_steriles_release"), "flsr_steriles_releases_list", "offer_steriles_release", array(), E_REQUIRED::NO);
$flsr_offer_steriles_release->setValidationState(form_error('offer_steriles_release') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_offer_steriles_release->addComponent(new HTML_Radio("i_offer_steriles_release_yes_".$idx, "list_offer_steriles_release", lang("offer_yes"), $yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_offer_steriles_release->addComponent(new HTML_Radio("i_offer_steriles_release_no_".$idx, "list_offer_steriles_release", lang("offer_no"), $no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_offer_steriles_release->addClass("radio_button_green padding_top_20");

$yes = E_CHECKED::NO;
$no = E_CHECKED::YES;
if(boolval($kitpack->performance_audit_ok) !== false)
{
    $yes = E_CHECKED::YES;
    $no = E_CHECKED::NO;
}
$flsr_offer_economics_ok = new HTML_FormItem(lang("offer_economics_ok"), "flsr_economics_oks_list", "offer_economics_ok", array(), E_REQUIRED::NO);
$flsr_offer_economics_ok->setValidationState(form_error('offer_economics_ok') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_offer_economics_ok->addComponent(new HTML_Radio("i_offer_economics_ok_yes_".$idx, "list_offer_economics_ok", lang("offer_yes"), $yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_offer_economics_ok->addComponent(new HTML_Radio("i_offer_economics_ok_no_".$idx, "list_offer_economics_ok", lang("offer_no"), $no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_offer_economics_ok->addClass("radio_button_green padding_top_20");

//->addFormItem($flsr_offer_parts_list)
$form_sample_data->addFormItem($flsr_offer_requested)
                 ->addFormItem($flsr_sterile_sample)
                ->addFormItem($flsr_later_unsteril_sample)
                ->addFormItem($flsr_later_sterile_sample)
                 ->addFormItem($flsr_offer_quantity)
                 ->addFormItem($flsr_offer_plz_city)
                 ->addFormItem($fr_offer_desired_sample_date)
                 ->addFormItem($fr_offer_desired_date)
                 ->addFormItem($flsr_offer_steriles_release)
                 ->addFormItem($flsr_offer_economics_ok);

/** *********************************************************************************************************************
 * Info KPM
 * aer 2023-03-21
 ************************************************************************************************************************/

$form_info_kpm = new HTML_Form("form_info_kpm", "form_info_kpm", "#", lang("fm_offer_title"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());

//die("<pre>".print_r($data["kpm_status"])."</pre><pre>".print_r($kitpack,true)."</pre>");
$disabled_status = "disabled";
if ($ci->hasPermission(E_PERMISSIONS::MYSETS_CHANGE_STATE))
{
    $disabled_status = "";
}
$fm_offer_status = new HTML_FormItem(lang("offer_status"), "fm_offer_status", "offer_status", array(), E_REQUIRED::YES);
$fm_offer_status->setValidationState(form_error('offer_id_brand') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($data["kpm_status"], "id", "label", $kitpack->kpm_status, lang("please_select"), true);
$fm_offer_status->addComponent(new HTML_Select("i_offer_status_".$idx, "offer_status", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item",$disabled_status),array()));

$fm_offer_brand = new HTML_FormItem(lang("offer_brand"), "fm_offer_brand", "offer_id_brand", array(), E_REQUIRED::YES);
$fm_offer_brand->setValidationState(form_error('offer_id_brand') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($data["kp_brands"], "label", "id", $kitpack->brand, lang("please_select"), true);
$fm_offer_brand->addComponent(new HTML_Select("i_offer_brand_".$idx, "offer_id_brand", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array()));


$frsr_offer_labels1 = new HTML_FormItem(lang("offer_label_text_row2"), "flsr_offer_labels_2", "offer_labels_2", array(), E_REQUIRED::YES);
$frsr_offer_labels1->setValidationState(form_error('offer_labels') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$frsr_offer_labels1->addComponent(new HTML_TextArea("offer_labels_2_".$idx, "offer_labels_2", $offer["label_text2"], lang("additions"), E_VISIBLE::YES, E_ENABLED::YES, array("width:100%;resize:none;"), array(), array()));

$frsr_offer_labels2 = new HTML_FormItem(lang("offer_label_text_row3"), "flsr_offer_labels_3", "offer_labels_3", array(), E_REQUIRED::NO);
$frsr_offer_labels2->setValidationState(form_error('offer_labels') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$frsr_offer_labels2->addComponent(new HTML_TextArea("offer_labels_3_".$idx, "offer_labels_3", $offer["label_text3"], lang("additions"), E_VISIBLE::YES, E_ENABLED::YES, array("width:100%;resize:none;"), array(), array()));

//echo "<pre>".print_r($data["operations"],true)."</pre>";
$l_op_li = '<span id="l_set_name_'.$idx.'" class="text-success label-sm"><strong>' . lang("kitpack_wizard_operation_label") . '</strong></span>';
$op_li = "<ul id=\"operations_checked_list_box_".$idx."\" name=\"operations\" class=\"list-group checked-list-box\">";
foreach ($data["operations"] as $i => $set) {
    if ($kitpack->operations != null && is_array($kitpack->operations)) {
        $checked = in_array($set["discipline_id"], $kitpack->operations) == TRUE ? E_CHECKED::YES : E_CHECKED::NO;
    }
    $cb = new HTML_Checkbox("cb_operation_" . $set["discipline_id"]."_".$idx, "cb_operation_" . $set["discipline_id"]."_".$idx, $set["translated"], $checked, $set["discipline_id"], E_ENABLED::YES, E_INLINE::NO, E_VISIBLE::YES,array(),array('operations-item'),array());
    $cb->setLabelStyle(array("margin" => "0", "padding" => "0 0 0 20px", "color" => "#999999", "font-size" => "12px"));
    $cb->setCheckboxStyle(array("margin" => "0"));
    $op_li .= "<li id=\"" . $set["discipline_id"]."_".$idx . "\" class=\"list-group-item\" style=\"border:none;padding-top:2px;padding-bottom:1px;\">
                    " . $cb->generateHTML() . "
               </li>";
}

$fm_offer_specialization = new HTML_FormItem(lang("offer_specialization"), "fm_offer_specialization", "offer_id_specialization", array(), E_REQUIRED::YES);
$fm_offer_specialization->setValidationState(form_error('offer_id_brand') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($data["operations"], "discipline_id", "translated", $kitpack->technical_disciplines, lang("please_select"), true);
$fm_offer_specialization->addComponent(new HTML_Select("i_offer_specialization_".$idx, "offer_id_specialization", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array()));

switch($kitpack->op_specialization)
{
    case "both":
        $status_op_checked = E_CHECKED::YES;
        $status_station_checked = E_CHECKED::YES;
        break;
    case "op":
        $status_op_checked = E_CHECKED::YES;
        $status_station_checked = E_CHECKED::NO;
        break;
    case "station":
        $status_op_checked = E_CHECKED::NO;
        $status_station_checked = E_CHECKED::YES;
        break;
    default:
        $status_op_checked = E_CHECKED::YES;
        $status_station_checked = E_CHECKED::NO;
        break;
}
$fm_offer_operation = new HTML_FormItem(lang("offer_operation"), "fm_offer_operation", "offer_operation", array(), E_REQUIRED::YES);
$fm_offer_operation->setValidationState(form_error('offer_operation') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fm_offer_operation->addComponent(new HTML_Radio("i_offer_operation_op_".$idx, "area_of_operation", lang("offer_status_op"), $status_op_checked, "op",
    E_ENABLED::YES, E_INLINE::YES, E_VISIBLE::YES, array(), array("assign_roles"), array()));
$fm_offer_operation->addComponent(new HTML_Radio("i_offer_operation_station_".$idx, "area_of_operation", lang("offer_status_station"), $status_station_checked, "station",
    E_ENABLED::YES, E_INLINE::YES, E_VISIBLE::YES, array(), array("assign_roles"), array()));
$fm_offer_operation->addClass("radio_button_green");

//die("<pre>".print_r($kitpack,true)."</pre>");
$fm_offer_discipline = new HTML_FormItem(lang("offer_discipline"), "fm_offer_discipline", "offer_id_discipline", array(), E_REQUIRED::NO);
$fm_offer_discipline->setValidationState(form_error('offer_id_brand') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($data["tech_disciplines"], "operations_id", "translated", $kitpack->operations, lang("please_select"), true);
$fm_offer_discipline->addComponent(new HTML_Select("i_offer_discipline_".$idx, "offer_id_discipline", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array()));

//echo "<pre>".print_r($data,true)."</pre>";
$fm_offer_responsibility = new HTML_FormItem(lang("offer_responsibility"), "fm_offer_responsibility", "offer_id_responsibility", array(), E_REQUIRED::NO);
$fm_offer_responsibility->setValidationState(form_error('offer_id_responsibility') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($data["all_users"], "user_id", "displayString", ($kitpack->responsibility_id=! null && $kitpack->responsibility_id != ""?$kitpack->responsibility_id:$data["user_id"]), lang("please_select"), false);
$fm_offer_responsibility->addComponent(new HTML_Select("i_offer_responsibility_".$idx, "offer_id_responsibility", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("disabled","select-item"),array()));

//7332 Besitzer
$fm_offer_owner = new HTML_FormItem(lang("offer_owner"), "fm_offer_owner", "offer_owner", array(), E_REQUIRED::NO);
$fm_offer_owner->setValidationState(form_error('offer_owner') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($data["all_users_owner"], "user_id", "displayString", ($kitpack->owner_id=! null && $kitpack->owner_id != ""?$kitpack->owner_id:$data["user_id"]), lang("please_select"), false);
$fm_offer_owner->addComponent(new HTML_Select("i_offer_owner_".$idx, "offer_owner", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("offer_owner", "select-item"),array()));

// todo: display sap mat no, not the kitpack_id
$fm_offer_copy = new HTML_FormItem(lang("offer_copy"), "fm_offer_copy", "offer_id_copy", array(), E_REQUIRED::NO);
$fm_offer_copy->setValidationState(form_error('offer_id_predecessor') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fm_offer_copy->addComponent(new HTML_Input("i_offer_copy_".$idx, "offer_id_copy", E_INPUTTYPE::TEXT, "", ($kitpack->copy_of_set==0?"":$kitpack->copy_of_set),"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array()));

// todo: display sap mat no, not the kitpack_id
$fm_offer_predecessor = new HTML_FormItem(lang("offer_predecessor"), "fm_offer_predecessor", "offer_id_predecessor", array(), E_REQUIRED::NO);
$fm_offer_predecessor->setValidationState(form_error('offer_id_predecessor') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fm_offer_predecessor->addComponent(new HTML_Input("i_offer_predecessor_".$idx, "offer_id_predecessor", E_INPUTTYPE::TEXT, "", ($kitpack->predecessor_id==0?"":$kitpack->predecessor_id),"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array()));

$sterilization = [
    "0" => [
        "value" => "standard",
        "show_value" => lang("standard")
    ],
    "1" => [
        "value" => "soft",
        "show_value" => lang("soft")
    ]
];
$fm_offer_sterilization = new HTML_FormItem(lang("offer_sterilization"), "fm_offer_sterilization", "offer_id_sterilization", array(), E_REQUIRED::NO);
$fm_offer_sterilization->setValidationState(form_error('offer_id_sterilization') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fm_offer_sterilization->addComponent(new HTML_Select("i_offer_sterilization_".$idx, "offer_id_sterilization", HTML_Select::buildOptions($sterilization, "value", "show_value", ($kitpack->sterilization != null && $kitpack->sterilization != ""?$kitpack->sterilization:"standard"), lang("please_select"), false), false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("disabled","select-item"),array()));

$form_info_kpm->addFormItem($fm_offer_status)
              ->addFormItem($fm_offer_brand)
              ->addFormItem($frsr_offer_labels1)
              ->addFormItem($frsr_offer_labels2)
              ->addFormItem($fm_offer_specialization)
              ->addFormItem($fm_offer_operation)
              ->addFormItem($fm_offer_discipline)
              ->addFormItem($fm_offer_responsibility);
	if ($ci->hasPermission(E_PERMISSIONS::MYSETS_ASSIGN_USER))
	{
		$form_info_kpm->addFormItem($fm_offer_owner);
	}

	$form_info_kpm
              ->addFormItem($fm_offer_copy)
              ->addFormItem($fm_offer_predecessor)
              ->addFormItem($fm_offer_sterilization);

/** *********************************************************************************************************************
 * Kitpack business flow
 * aer 2023-03-21
 ************************************************************************************************************************/

$form_business_flow = new HTML_Form("form_business_flow", "form_business_flow", "#", lang("fmsr_offer_title"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());

$workflow_types = array(array("key"=>E_WORKFLOW_TYPES::STANDARD_AWB_EXPORT,"label"=>lang(E_WORKFLOW_TYPES::STANDARD_AWB_EXPORT)),
                        array("key"=>E_WORKFLOW_TYPES::STANDARD_AWB_KUNDE,"label"=>lang(E_WORKFLOW_TYPES::STANDARD_AWB_KUNDE)),
                        array("key"=>E_WORKFLOW_TYPES::CLINICPARTNER,"label"=>lang(E_WORKFLOW_TYPES::CLINICPARTNER)),
                        array("key"=>E_WORKFLOW_TYPES::CHINA,"label"=>lang(E_WORKFLOW_TYPES::CHINA)),
                        array("key"=>E_WORKFLOW_TYPES::ANGIOKARD,"label"=>lang(E_WORKFLOW_TYPES::ANGIOKARD)));

$fmsr_workflow_type = new HTML_FormItem(lang("workflow_type"), "fm_workflow_type", "workflow_type", array(), E_REQUIRED::NO);
$fmsr_workflow_type->setValidationState(form_error('offer_id_responsible_manager') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options =  HTML_Select::buildOptions($workflow_types, "key", "label", $kitpack->workflow_type , lang("please_select"), true);
$fmsr_workflow_type->addComponent(new HTML_Select("i_workflow_type_".$idx, "workflow_type",$options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$fmsr_offer_responsible_manager = new HTML_FormItem(lang("offer_responsible_manager"), "fm_offer_responsible_manager", "offer_id_responsible_manager", array(), E_REQUIRED::NO);
$fmsr_offer_responsible_manager->setValidationState(form_error('offer_id_responsible_manager') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options =  HTML_Select::buildOptions($data["responsible_manager"], "lastname", "lastname", $kitpack->responsible_manager_id , lang("please_select"), true);
$fmsr_offer_responsible_manager->addComponent(new HTML_Select("i_offer_responsible_manager_".$idx, "offer_id_responsible_manager",$options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array()));

$fmsr_offer_responsible_sales_team = new HTML_FormItem(lang("offer_responsible_sales_team"), "fm_offer_responsible_sales_team", "offer_id_responsible_sales_team", array(), E_REQUIRED::NO);
$fmsr_offer_responsible_sales_team->setValidationState(form_error('offer_id_responsible_sales_team') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fmsr_offer_responsible_sales_team->addComponent(new HTML_Select("i_offer_responsible_sales_team_".$idx, "offer_id_responsible_sales_team", HTML_Select::buildOptions($user_group, "group_name", "group_name", null, lang("please_select"), true), false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array()));

$fmsr_offer_testing_components = new HTML_FormItem(lang("offer_testing_components"), "flsr_offer_testing_components", "offer_testing_components", array(), E_REQUIRED::NO);
$fmsr_offer_testing_components->setValidationState(form_error('offer_testing_components') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fmsr_offer_testing_components->addComponent(new HTML_Radio("i_offer_testing_components_yes_".$idx, "list_offer_testing_components_ok", lang("offer_yes"), E_CHECKED::NO, 1));
$fmsr_offer_testing_components->addComponent(new HTML_Radio("i_offer_testing_components_no_".$idx, "list_offer_testing_components_ok", lang("offer_no"), E_CHECKED::NO, 0));
$fmsr_offer_testing_components->addClass("radio_button_green padding_top_20");

$formatted_date = "";
if($kitpack->receipt_set_group != "")
{
    $formatted_date = formatMySQLDate($kitpack->receipt_set_group);
}
$fmsr_offer_date_receipt_setgruppe = new HTML_FormItem(lang("offer_date_receipt_setgruppe"), "fm_offer_date_receipt_setgruppert", "offer_date_receipt_setgruppe", array(), E_REQUIRED::NO);
$fmsr_offer_date_receipt_setgruppe->setValidationState(form_error('offer_date_receipt_setgruppe') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fmsr_offer_date_receipt_setgruppe->addComponent(new HTML_Input("offer_date_receipt_setgruppe_".$idx, "offer_date_receipt_setgruppe", E_INPUTTYPE::TEXT,"",$formatted_date,"","",E_ENABLED::NO,E_VISIBLE::YES,array(),array("disabled"),array()));

$formatted_date = "";
if($kitpack->receipt_slavkov != "")
{
    $formatted_date = formatMySQLDate($kitpack->receipt_slavkov);
}
$fmsr_offer_date_receipt_slavkov = new HTML_FormItem(lang("offer_date_receipt_slavkov"), "fm_offer_date_receipt_slavkov", "offer_date_receipt_slavkov", array(), E_REQUIRED::NO);
$fmsr_offer_date_receipt_slavkov->setValidationState(form_error('offer_date_receipt_slavkov') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fmsr_offer_date_receipt_slavkov->addComponent(new  HTML_Input("offer_date_receipt_slavkov_".$idx, "offer_date_receipt_slavkov", E_INPUTTYPE::TEXT,"",$formatted_date,"","",E_ENABLED::NO,E_VISIBLE::YES,array(),array("disabled"),array("disabled"=>"disabled")));

$formatted_date = "";
if($kitpack->receipt_back_office != "")
{
    $formatted_date = formatMySQLDate($kitpack->receipt_back_office);
}
$fmsr_offer_date_receipt_innendienst = new HTML_FormItem(lang("offer_date_receipt_innendienst"), "fm_offer_date_receipt_innendienst", "offer_date_receipt_innendienst", array(), E_REQUIRED::NO);
$fmsr_offer_date_receipt_innendienst->setValidationState(form_error('offer_date_receipt_innendienst') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fmsr_offer_date_receipt_innendienst->addComponent(new  HTML_Input("offer_date_receipt_innendienst_".$idx, "offer_date_receipt_innendienst", E_INPUTTYPE::TEXT,"",$formatted_date,"","",E_ENABLED::NO,E_VISIBLE::YES,array(),array("disabled"),array("disabled"=>"disabled")));

$formatted_date = "";
if($kitpack->contra_indication_date != "")
{
    $formatted_date = formatMySQLDate($kitpack->contra_indication_date);
}
$fmsr_offer_contraindication_date = new HTML_FormItem(lang("offer_contraindication_date"), "fm_offer_contraindication_date", "offer_contraindication_date", array(), E_REQUIRED::NO);
$fmsr_offer_contraindication_date->setValidationState(form_error('offer_contraindication_date') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
//$fmsr_offer_contraindication_date->addComponent(new  HTML_Input("offer_contraindication_date_".$idx, "offer_contraindication_date", E_INPUTTYPE::TEXT,"",$formatted_date,"","",E_ENABLED::NO,E_VISIBLE::YES,array(),array(),array("disabled"=>"disabled")));
$fmsr_offer_contraindication_date->addComponent(new  HTML_Datepicker("offer_contraindication_date_".$idx, "offer_contraindication_date", $formatted_date,"",lang("date_format_long"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$production_place = array(array("key"=>"slavkov","value"=>"Slavkov"),
                          array("key"=>"china","value"=>"China"));
$fmsr_offer_production_place = new HTML_FormItem(lang("offer_production_place"), "fm_offer_production_place", "offer_id_production_place", array(), E_REQUIRED::NO);
$fmsr_offer_production_place->setValidationState(form_error('offer_id_production_place') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fmsr_offer_production_place->addComponent(new HTML_Select("i_offer_production_place_".$idx, "offer_id_production_place", HTML_Select::buildOptions($production_place, "key", "value", null, lang("please_select"), false), false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array()));

$form_business_flow->addFormItem($fmsr_workflow_type)
                   ->addFormItem($fmsr_offer_responsible_manager)
                   ->addFormItem($fmsr_offer_responsible_sales_team)
                   //->addFormItem($fmsr_offer_testing_components)
                   ->addFormItem($fmsr_offer_date_receipt_setgruppe)
                   ->addFormItem($fmsr_offer_date_receipt_slavkov)
                   ->addFormItem($fmsr_offer_date_receipt_innendienst)
                   ->addFormItem($fmsr_offer_contraindication_date)
                   ->addFormItem($fmsr_offer_production_place);

/** *********************************************************************************************************************
 * offer positions
 * aer 2023-03-21
 ************************************************************************************************************************/

$form_offer_positions = new HTML_Form("form_offer_positions", "form_offer_positions", "#", lang("fr_offer_title"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());

$fi_offer_no = new HTML_FormItem(lang("offer_number"), "fi_offer_no", "offer_no", array(), E_REQUIRED::NO);
$fi_offer_no->addComponent(new HTML_Input("i_offer_no_".$idx, "i_offer_no", E_INPUTTYPE::TEXT, lang("offer_number"), $offer_number,"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array()));

$fr_offer_name_of = new HTML_FormItem(lang("offer_name_of"), "fm_offer_name_of", "offer_name_of", array(), E_REQUIRED::YES);
$fr_offer_name_of->setValidationState(form_error('offer_name_of') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_name_of->addComponent(new HTML_Input("i_set_name_".$idx, "offer_name_of", E_INPUTTYPE::TEXT, lang("offer_name_of"), $offer["kitpack_name"]));

$fi_sap_mat_no = new HTML_FormItem(lang("kitpack_sap_mat_no"), "fi_sap_mat_no", "sap_mat_no", array(), E_REQUIRED::NO);
$fi_sap_mat_no->addComponent(new HTML_Input("i_sap_mat_no_".$idx, "i_sap_mat_no", E_INPUTTYPE::TEXT, lang("kitpack_sap_mat_no"), $kp_sap_material_no,"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array()));

$fi_setnumber = new HTML_FormItem(lang("set_number"), "fi_setnumber", "setnumber", array(), E_REQUIRED::NO);
$fi_setnumber->addComponent(new HTML_Input("i_setnumber_".$idx, "i_setnumber", E_INPUTTYPE::TEXT, lang("set_number"), $kp_setnumber,"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array()));

$fi_version = new HTML_FormItem(lang("version"), "fi_version", "version", array(), E_REQUIRED::NO);
$fi_version->addComponent(new HTML_Input("i_version_".$idx, "i_version", E_INPUTTYPE::TEXT, lang("version"), $version.$alternative,"","",E_ENABLED::YES,E_VISIBLE::YES,array(),array("disabled"),array()));

$yes = E_CHECKED::NO;
$no = E_CHECKED::YES;
if(boolval($kitpack->is_angiokard) !== false)
{
    $yes = E_CHECKED::YES;
    $no = E_CHECKED::NO;
}
$flsr_is_angiokard = new HTML_FormItem(lang("use_angiokard_catalog"), "flsr_is_angiokard", "is_angiokard", array(), E_REQUIRED::NO);
$flsr_is_angiokard->setValidationState(form_error('offer_economics_ok') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$flsr_is_angiokard->addComponent(new HTML_Radio("i_is_angiokard_yes_".$idx, "is_angiokard", lang("offer_yes"), $yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$flsr_is_angiokard->addComponent(new HTML_Radio("i_is_angiokard_no_".$idx, "is_angiokard", lang("offer_no"), $no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));

//$fr_offer_offer = new HTML_FormItem(lang("offer_offer"), "fm_offer_offer", "offer_offer", array(), E_REQUIRED::NO);
//$fr_offer_offer->setValidationState(form_error('offer_offer') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
//$fr_offer_offer->addComponent(new HTML_Input("i_offer_offer", "offer_offer", E_INPUTTYPE::TEXT, lang("offer_offer"), (is_null($offer_typ) ? lang($offer["offer_type"]):"")));

$fr_offer_offer = new HTML_FormItem(lang("offer_offer"), "fm_offer_offer", "offer_offer", array(), E_REQUIRED::YES);
$fr_offer_offer->setValidationState(form_error('offer_offer') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$options = HTML_Select::buildOptions($data["all_offer_type"], "id", "label",  $offer_typ, lang("please_select"), true);
$fr_offer_offer->addComponent(new HTML_Select("i_offer_offer_".$idx, "offer_offer", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("offer_offer","select-item"),array("idx"=>$idx)));

$fr_offer_tender = new HTML_FormItem(lang("offer_tender"), "fr_offer_tender_".$idx, "offer_tender", array(), E_REQUIRED::YES);
$fr_offer_tender->setValidationState(form_error('offer_tender') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_tender->addComponent(new HTML_Input("i_offer_tender_".$idx, "offer_tender", E_INPUTTYPE::TEXT, lang("offer_tender"), ""));
//$fr_offer_tender->addClass("radio_button_green padding_top_20");

$fr_offer_contact = new HTML_FormItem(lang("offer_contact"), "fm_offer_contact", "offer_contact", array(), E_REQUIRED::NO);
$fr_offer_contact->setValidationState(form_error('offer_contact') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_contact->addComponent(new HTML_Input("i_offer_contact_".$idx, "offer_contact", E_INPUTTYPE::TEXT, lang("offer_contact"), $kitpack->contact));

$formatted_date = "";
if($kitpack->valid_from != "")
{
    $formatted_date = formatMySQLDate($kitpack->valid_from);
}
$fr_offer_valid_start = new HTML_FormItem(lang("offer_valid_start"), "fm_offer_valid_start", "offer_valid_start", array(), E_REQUIRED::NO);
$fr_offer_valid_start->setValidationState(form_error('offer_valid_start') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_valid_start->addComponent(new  HTML_Datepicker("offer_valid_start_".$idx, "offer_valid_start", $formatted_date,"",lang("date_format_long"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$formatted_date = "";
if($kitpack->valid_till != "")
{
    $formatted_date = formatMySQLDate($kitpack->valid_till);
}
$fr_offer_valid_end = new HTML_FormItem(lang("offer_valid_end"), "fm_offer_valid_start", "offer_valid_end", array(), E_REQUIRED::NO);
$fr_offer_valid_end->setValidationState(form_error('offer_valid_end') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_valid_end->addComponent(new  HTML_Datepicker("offer_valid_end_".$idx, "offer_valid_end", $formatted_date,"",lang("date_format_long"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$formatted_date = "";
if($kitpack->internal_delivery != "")
{
    $formatted_date = formatMySQLDate($kitpack->internal_delivery);
}
$fr_offer_internal_delivery = new HTML_FormItem(lang("offer_internal_delivery"), "fm_offer_internal_deliveryrt", "offer_internal_delivery", array(), E_REQUIRED::NO);
$fr_offer_internal_delivery->setValidationState(form_error('offer_internal_delivery') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_internal_delivery->addComponent(new  HTML_Datepicker("offer_internal_delivery_".$idx, "offer_internal_delivery", $formatted_date,"",lang("date_format_long"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$formatted_date = "";
if($kitpack->customer_delivery != "")
{
    $formatted_date = formatMySQLDate($kitpack->customer_delivery);
}
$fr_offer_customer_delivery = new HTML_FormItem(lang("offer_customer_delivery"), "fm_offer_customer_deliveryrt", "offer_customer_delivery", array(), E_REQUIRED::NO);
$fr_offer_customer_delivery->setValidationState(form_error('offer_customer_delivery') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_customer_delivery->addComponent(new  HTML_Datepicker("offer_customer_delivery_".$idx, "offer_customer_delivery", $formatted_date,"",lang("date_format_long"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array()));

$fr_offer_planned_annual_amount = new HTML_FormItem(lang("offer_planned_annual_amount"), "fm_offer_planned_annual_amount", "offer_planned_annual_amount", array(), E_REQUIRED::YES);
$fr_offer_planned_annual_amount->setValidationState(form_error('offer_contact') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fr_offer_planned_annual_amount->addComponent(new HTML_Input("i_offer_planned_annual_amount_".$idx, "offer_planned_annual_amount", E_INPUTTYPE::TEXT, lang("offer_planned_annual_amount"), $kitpack->yearly_quantity_planning["annual_requirement"]));

$hidden_kp_setnummer = new HTML_Input("i_hidden_kp_setnummer_".$idx,"hidden_kp_setnummer",E_INPUTTYPE::HIDDEN, "hidden_kp_setnummer", $kitpack->kp_setnummer);
$hidden_version_counter = new HTML_Input("i_hidden_version_counter_".$idx,"hidden_version_counter",E_INPUTTYPE::HIDDEN, "hidden_version_counter", $kitpack->version_counter);
$hidden_alternative_counter = new HTML_Input("i_hidden_alternative_counter_".$idx,"hidden_alternative_counter",E_INPUTTYPE::HIDDEN, "hidden_alternative_counter", $kitpack->alternative_counter);

$form_offer_positions->addFormItem($fi_offer_no)
    ->addFormItem($fr_offer_name_of)
    ->addFormItem($fi_sap_mat_no)
    ->addFormItem($fi_setnumber)
    ->addFormItem($fi_version)
    ->addFormItem($flsr_is_angiokard)
    ->addFormItem($fr_offer_offer)
    ->addFormItem($fr_offer_tender)
    /*->addFormItem($fr_offer_contact)
    ->addFormItem($fr_offer_valid_start)
    ->addFormItem($fr_offer_valid_end)
    ->addFormItem($fr_offer_internal_delivery)*/
    ->addFormItem($fr_offer_customer_delivery)
    ->addFormItem($fr_offer_planned_annual_amount)
    ->addFormItem($hidden_kp_setnummer)
    ->addFormItem($hidden_version_counter)
    ->addFormItem($hidden_alternative_counter);


/** *********************************************************************************************************************
 * notes
 * aer 2023-03-21
 ************************************************************************************************************************/

$form_notes = new HTML_Form("form_notes", "form_notes", "#", lang("frsr_offer_title"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());

$frsr_offer_notes = new HTML_FormItem(lang("offer_notes"), "flsr_offer_notes", "offer_notes", array(), E_REQUIRED::NO);
$frsr_offer_notes->setValidationState(form_error('offer_notes') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$frsr_offer_notes->addComponent(new HTML_TextArea("offer_notes_".$idx, "offer_notes", $offer["notes"], lang("additions"), E_VISIBLE::YES, E_ENABLED::YES, array("width:100%;resize:none;"), array(), array()));

$margin = new HTML_Input("calc_margin_".$idx, "", E_INPUTTYPE::HIDDEN, "", $kitpack->prvkp_marge);
$total_cost = new HTML_Input("calc_total_cost_".$idx, "", E_INPUTTYPE::HIDDEN, "", $kitpack->prvkp);

$form_notes->addFormItem($frsr_offer_notes)
           ->addFormItem($margin)
           ->addFormItem($total_cost);

/** *********************************************************************************************************************
 * kitpack finalization
 * aer 2023-05-01
 ************************************************************************************************************************/

$visibility = E_VISIBLE::NO;
$enabled = E_ENABLED::NO;
if($kitpack->kpm_status == E_KPM_STATE::FINALIZATION_BY_BACK_OFFICE)
{
    $visibility = E_VISIBLE::YES;
    $enabled = E_ENABLED::YES;
}
$form_finalization = new HTML_Form("fm_form_finalization", "form_finalization", "#", lang("fm_form_finalization"), E_FORMMETHOD::POST, $visibility, $enabled, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());

$obArr = array(array("key"=>E_ORDERING_BEHAVIOUS::BY_ORDERING,"label"=>lang(E_ORDERING_BEHAVIOUS::BY_ORDERING)),
               array("key"=>E_ORDERING_BEHAVIOUS::PERIODICALLY,"label"=>lang(E_ORDERING_BEHAVIOUS::PERIODICALLY)),
               array("key"=>E_ORDERING_BEHAVIOUS::SEASONAL,"label"=>lang(E_ORDERING_BEHAVIOUS::SEASONAL)),
               array("key"=>E_ORDERING_BEHAVIOUS::ONE_RETRIEVAL,"label"=>"1 ".lang("retrieval")),
               array("key"=>E_ORDERING_BEHAVIOUS::TWO_RETRIEVAL,"label"=>"2 ".lang("retrieval")),
               array("key"=>E_ORDERING_BEHAVIOUS::THREE_RETRIEVAL,"label"=>"3 ".lang("retrieval"))/*,
               array("key"=>E_ORDERING_BEHAVIOUS::FOUR_RETRIEVAL,"label"=>"4 ".lang("retrieval")),
               array("key"=>E_ORDERING_BEHAVIOUS::FIVE_RETRIEVAL,"label"=>"5 ".lang("retrieval"))*/);
$fi_ordering_behaviour = new HTML_FormItem(lang("ordering_behaviour"), "fi_ordering_behaviour", "ordering_behaviour", array(), E_REQUIRED::NO);
$options = HTML_Select::buildOptions($obArr, "key", "label",  $kitpack->ordering_behaviour, lang("please_select"), true);
$fi_ordering_behaviour->addComponent(new HTML_Select("i_ordering_behaviour_".$idx, "ordering_behaviour", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array("idx"=>$idx)));

$fi_reported_stock = new HTML_FormItem(lang("reported_stock"), "fi_reported_stock", "reported_stock", array(), E_REQUIRED::NO);
$fi_reported_stock->addComponent(new HTML_Input("i_reported_stock_".$idx, "reported_stock", E_INPUTTYPE::TEXT, lang("reported_stock"), $kitpack->reported_stock));

$fi_yearly_amount = new HTML_FormItem(lang("yearly_amount"), "fi_yearly_amount", "yearly_amount", array(), E_REQUIRED::NO);
$fi_yearly_amount->addComponent(new HTML_Input("i_yearly_amount_".$idx, "yearly_amount", E_INPUTTYPE::TEXT, lang("yearly_amount"), $kitpack->yearly_amount));

$fi_set_duration = new HTML_FormItem(lang("set_duration"), "fi_set_duration", "set_duration", array(), E_REQUIRED::NO);
$fi_set_duration->addComponent(new HTML_Input("i_set_duration_".$idx, "set_duration", E_INPUTTYPE::TEXT, lang("set_duration"), $kitpack->set_duration));

$yes = E_CHECKED::NO;
$no = E_CHECKED::YES;
if(boolval($kitpack->is_vip) !== false)
{
    $yes = E_CHECKED::YES;
    $no = E_CHECKED::NO;
}
$fi_is_vip = new HTML_FormItem(lang("is_vip"), "fi_is_vip", "is_vip", array(), E_REQUIRED::NO);
$fi_is_vip->addComponent(new HTML_Radio("i_is_vip_yes_".$idx, "is_vip", lang("offer_yes"), $yes, 1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));
$fi_is_vip->addComponent(new HTML_Radio("i_is_vip_no_".$idx, "is_vip", lang("offer_no"), $no, 0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array('radio-item'),array()));

$fi_initial_stock_quantity = new HTML_FormItem(lang("initial_stock_quantity"), "fi_initial_stock_quantity", "set_duration", array(), E_REQUIRED::NO);
$fi_initial_stock_quantity->addComponent(new HTML_Input("i_initial_stock_quantity_".$idx, "initial_stock_quantity", E_INPUTTYPE::TEXT, lang("initial_stock_quantity"), $kitpack->initial_stock_quantity));

$obArr = array(array("key"=>1,"label"=>lang("activate")),
               array("key"=>2,"label"=>lang("reject")),
               array("key"=>0,"label"=>lang("pending")));
$fi_activation_state = new HTML_FormItem(lang("activation_state"), "fi_activation_state", "activation_state", array(), E_REQUIRED::NO);
$options = HTML_Select::buildOptions($obArr, "key", "label",  $kitpack->activation_state, lang("please_select"), true);
$fi_activation_state->addComponent(new HTML_Select("i_activation_state_".$idx, "activation_state", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-item"),array("idx"=>$idx)));

$form_finalization->addFormItem($fi_ordering_behaviour)
                  ->addFormItem($fi_reported_stock)
                  ->addFormItem($fi_yearly_amount)
                  ->addFormItem($fi_set_duration)
                  ->addFormItem($fi_is_vip)
                  ->addFormItem($fi_initial_stock_quantity)
                  ->addFormItem($fi_activation_state);

/** *********************************************************************************************************************
 * assemble the forms
 * aer 2023-03-21
 ************************************************************************************************************************/

$form_left = new HTML_Form("form_offer_data1_".$idx, "form_offer_data1", "#", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());
$form_left->addFormItem($form_customer_informations)
          ->addFormItem($form_sample_data);

$form_middle = new HTML_Form("form_offer_data2_".$idx, "form_offer_data2", "", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());
$form_middle->addFormItem($form_info_kpm)
            ->addFormItem($form_business_flow);

$form_right = new HTML_Form("form_offer_data3_".$idx, "form_offer_data3", "#", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());
$form_right->addFormItem($form_offer_positions)
           ->addFormItem($form_notes)
           ->addFormItem($form_finalization);
//die("<pre>".print_r($kitpack->revisions,true)."</pre>");
$options = HTML_Select::buildOptions($kitpack->revisions, "revision_id", "revision_label",  null, lang("please_select"), true);
$fi_revisions = new HTML_Select("kitpack-revisions-".$idx, "kitpack-revisions", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array("select-revision"),array("idx"=>$idx,"data-kitpack-id"=>$kitpack->kitpack_id));
?>
<div class="row">
	<?php //echome($data); ?>
	<div class="col-xs-12">
        <?php echo $fi_revisions->generateHTML();?>
		<?php echo $label_head ?>
        <?php
			$btnRestore = new HTML_Button("btn-restore-revision-$idx", "btn-restore-revision", lang("restore"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::WINDOW_RESTORE, "left");
			$btnRestore->setVisible(E_VISIBLE::NO);
			$btnRestore->addClass("btn-restore-revision");
			$btnRestore->addAttribute("data-kitpack-id", $kitpack->kitpack_id);
			$btnRestore->addAttribute("data-idx", $idx);

			echo $btnRestore->generateHTML();
		?>
	</div>
</div>
<div class="row">

    <div class="col-xs-12">
        <div class="row" style="margin-top:2em;padding-left:2em;padding-right:2em;">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <?php echo $form_left->generateHTML(true) ?>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <?php echo $form_middle->generateHTML(true) ?>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4" id="name_area">
                <?php echo $form_right->generateHTML(true) ?>
            </div>
        </div>
    </div>
    <input type="hidden" id="offer_kitpack_id_<?php echo $idx;?>" value="<?php echo $kitpack->kitpack_id;?>">
</div>
<script>
    var all_clients = <?php echo json_encode($newAllClientsArray); ?>;
</script>
