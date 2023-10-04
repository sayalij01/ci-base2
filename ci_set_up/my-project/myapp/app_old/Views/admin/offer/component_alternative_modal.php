<?php
$page_alerts = buildPageAlerts($error, $success, $warning, $info);

$title = new HTML_Label("", lang("offer_component_alternativ_title"), "black");

$all_client = $data["all_client"];




$tbl3 = new HTML_Datatable("tbl_component_alternative", $data["table_columns"], $data["table_data"]);
//$pnl2 = new HTML_Panel("pnl_packaging", lang("packaging"), $tbl->generateHTML());

$btn_back = new HTML_Button("bt_back", "back", lang("back"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::ARROW_RIGHT, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
//$btn_back->setAttributes(array("form"=>"form_offer"))->setValue(1)->setType(E_BUTTON_TYPES::BUTTON);


?>


<div class="row text-center">
    <br><br>
    <?php echo $title->generateHTML(); ?>
    <div class="row no-margin">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
            <?php echo $tbl3->generateHTML();?>
        </div>

    </div>
</div>
<script>
    var tbl_columns_alternative_component = <?php echo json_encode($data["table_columns"]); ?>//;
</script>