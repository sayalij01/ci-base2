<?php
//echo "<pre>".print_r($_SESSION,true)."</pre>";
$ci = &get_instance();
$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$tbl = new HTML_Datatable("tbl_offer", $data["table_columns"], $data["table_data"],null,E_VISIBLE::YES,E_ENABLED::YES,array());
$tbl->setShowFilterHeader(true);
$pnl = new HTML_Panel("pnl_offer", "");
if ($ci->hasPermission(E_PERMISSIONS::OFFER_CREATE))
{
    $pnl->addTitleControl("btn_modal_offer", "btn_new_offer", E_ICONS::ADD."&nbsp".lang("new_offer"), "", "", array("panel-title-button"),array());
}
if ($ci->hasPermission(E_PERMISSIONS::MYSETS_LOCK))
{
    $pnl->addTitleControl("btn_set_lock", "btn_set_lock", E_ICONS::TIMES_CIRCLE_BLACK."&nbsp".lang("set_lock"), "", "", array("panel-title-button","grey"),array("disabled"=>"disabled"));
}
if ($ci->hasPermission(E_PERMISSIONS::MYSETS_DELETE))
{
    $pnl->addTitleControl("btn_set_delete_batch", "btn_set_delete_batch", E_ICONS::DELETE."&nbsp".lang("set_delete"), "", "", array("panel-title-button","grey"),array("disabled"=>"disabled"));
}
if($ci->hasPermission(E_PERMISSIONS::MYSETS_EXPORT))
{
    $pnl->addTitleControl("btn_set_export","btn_set_export",E_ICONS::FILE_EXCEL."&nbsp;".lang("export_kitpack"), "", "", array("panel-title-button","grey"),array("disabled"=>"disabled"));
}
if($ci->hasPermission(E_PERMISSIONS::MYSETS_EXPORT_MYSETS_LIST))
{
    $pnl->addTitleControl("btn_set_export_list","btn_set_export_list",E_ICONS::FILE_EXCEL."&nbsp;".lang("export_kitpack_list"), "", "", array("panel-title-button"),array());
}
//$pnl->addTitleControl("btn_history","btn_history",lang("action_history_title"), "", "$.offer.show_history()", array("panel-title-button"),array());
$options = HTML_Select::buildOptions($data["filter_selector"], "value", "key", $_SESSION["filtered_list"], lang("please_select"), true);
$filter_selector = new HTML_Select("i_filter_selector", "filter_selector", $options , false, "", E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array());
$btn_new_filter = "<button id=\"btn_new_filter\" title=\"\" type=\"button\" class=\"panel-control panel-title-button\" data-original-title=\"\">".lang("new_filter")."</button>";

$html = "<div>".$filter_selector->generateHTML()."&nbsp;".$btn_new_filter."</div>";
$pnl->addTitleControl("fi_filter_selector","filter_selector",$html,"","",array("filter_selector"),array());



$pnl->setContent($tbl->generateHTML());
$pnl->setCollapsed(false);


// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Modal
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_Documents";
$modal1 = new HTML_Dialog($modalID, $modalID, lang("documents"), '<div id="mysets_documents_container"></div>');
$modal1->setColor(E_COLOR::PRIMARY);
$modal1->setSize(E_SIZES::XS);
$modal1->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Set Details
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_set_details";
$modal2 = new HTML_Dialog($modalID, $modalID, lang("set_details"), '<div id="mysets_details_container"></div>');
$modal2->setColor(E_COLOR::PRIMARY);
$modal2->setSize(E_SIZES::LG);
$modal2->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Set Export
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_set_export";
$modal3 = new HTML_Dialog($modalID, $modalID, lang("set_details"), '<div id="mysets_export_container"></div>',"","default",E_VISIBLE::YES,array(),array(),array());
$modal3->setColor(E_COLOR::PRIMARY);
$modal3->setSize(E_SIZES::MD);
$modal3->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
//$set_details = $this->load->view("admin/mysets/set_details", array(), true);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Action History
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_action_history";
$modal4 = new HTML_Dialog($modalID, $modalID, lang("action_history_title"), '<div id="action_history_container"></div>');
$modal4->setColor(E_COLOR::PRIMARY);
$modal4->setSize(E_SIZES::MD);
$modal4->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Clinicpartner Set Details
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_clinicpartner_set_details";
$modal5 = new HTML_Dialog($modalID, $modalID, lang("clinicpartner_set_details"), '<div id="clinicpartner_sets_details_container"></div>');
$modal5->setColor(E_COLOR::PRIMARY);
$modal5->setSize(E_SIZES::LG);
$modal5->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Action Component Details
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_Details";
$modal_details = new HTML_Dialog($modalID, $modalID, lang("detailed_view"), '<div id="component_details_container"></div>');
$modal_details->setColor(E_COLOR::PRIMARY);
$modal_details->setSize(E_SIZES::LG);
$modal_details->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

$modal_offer = new HTML_Anchor("modal_offer", lang("modal_offer"), "#","",E_VISIBLE::YES,array(),array(),array());


$modalID2 = "mdl_offer";

$notification_image_path = $this->config->item('notification_logo');
$client_notification_image = PATH_IMAGES.'logos/'.$this->client_id.'/site-logo_60x60.png';
if (file_exists($client_notification_image))
{
    $notification_image_path = $client_notification_image;
}
$img = '<img alt="'.lang("notifications").'" class="img_optimization_modal" src="'. HTML_Image::generateDataURIFromImage($notification_image_path).'"/>';

$modal_optimization = new HTML_Dialog($modalID2, $modalID2, $img.lang("modal_offer"),'<div id="optimization_container2" class="div_optimization_modal"></div>');
$modal_optimization->setColor(E_COLOR::PRIMARY);
$modal_optimization->setSize(E_SIZES::MD);
$modal_optimization->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Create new filter
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$fi_filter_name = new HTML_FormItem(lang("filter_name"), "fi_filter_name", "filter_name", array(), E_REQUIRED::NO);
$fi_filter_name->addComponent(new HTML_Input("i_filter_name", "filter_name", E_INPUTTYPE::TEXT, lang("filter_name"), ""));
$btn_save_filter = new HTML_Button("btn_save_filter","save_filter",lang("save_filter"),E_COLOR::PRIMARY,"","",E_HORIZONTAL_POSITION::LEFT,E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array());
$content = "<div id=\"create_new_filter_container\">
                ".lang("current_filter_will_be_saved_under_given_name")."<br /><br />
                ".$fi_filter_name->generateHTML()."<br /><br />
                <div style=\"text-align:center;width:100%\">
                ".$btn_save_filter->generateHTML()."
                </div>
            </div>";
$modalID = "mdl_create_new_filter";
$modal6 = new HTML_Dialog($modalID, $modalID, lang("create_new_filter"), $content);
$modal6->setColor(E_COLOR::PRIMARY);
$modal6->setSize(E_SIZES::SM);
$modal6->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

?>
<style>
    .dataTables_scrollHead {
        overflow-x: scroll !important;
        overflow-y: auto !important;
    }

    .dataTables_scrollBody {
        overflow-x: scroll;
        overflow-y: auto;
    }

    #tbl_offer{
        width: 6000px !important;

    }

    #table_overlay{
        position:absolute;
        left:0px;
        right:0px;
        top:212px;
        bottom:5px;
        background-color:#ffffff;
    }
</style>

<input type="hidden" id="handleDatasetLocked" value="0" />
<div id="reset-button" style="float:right;display:none;">
    <a href="javascript:void(0);" onclick="$.offer.reset_filter();">
        <i class="fa fa-delete"> </i><?php echo lang("reset_filter");?>
    </a>
</div>
<div class="row">
    <div id="tab-content" class="col-xs-12 tab-content fadeInLeft">
        <div>
            <?php echo $pnl->generateHTML();?>
        </div>
    </div>
</div>
<div class="col-xs-12">
    <?php echo $modal1->generateHTML(); ?>
    <?php echo $modal2->generateHTML(); ?>
    <?php echo $modal3->generateHTML(); ?>
    <?php echo $modal4->generateHTML(); ?>
    <?php echo $modal_details->generateHTML(); ?>
    <?php echo $modal5->generateHTML(); ?>
    <?php echo $modal6->generateHTML(); ?>
</div>

<div class="col-xs-12">
    <?php echo $modal_optimization->generateHTML(); ?>
</div>

<div id="table_overlay">
    &nbsp;
</div>

<script>
    var tbl_columns_offer = <?php echo json_encode($data["table_columns"]); ?>;
</script>
