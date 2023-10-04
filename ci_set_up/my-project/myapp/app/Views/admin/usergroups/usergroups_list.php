<?php
$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$btn_new 		= "";
if (BASE_Controller::hasPermission(E_PERMISSIONS::USERGROUPS_CREATE))
{
    $btn_new = new HTML_Button("btn_new_usergroup", "btn_new_usergroup", lang("usergroup_create"), E_COLOR::PRIMARY, E_SIZES::STANDARD, "<i class=\"fa fa-users\" aria-hidden=\"true\"></i>", "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_new->setAnchor(base_url("admin/usergroups/create"));
    $btn_new = $btn_new->generateHTML();
}

$tbl = new HTML_Datatable("tbl_usergroups", $data["table_columns"], $data["table_data"]);
$pnl = new HTML_Panel("pnl_usergroups", lang("usergroups"), $tbl->generateHTML(), $btn_new);

$btn_export = new HTML_Button("btn_export_list", "btn_export_list", lang("export_usergroups_list"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::FILE_EXCEL, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
$btn_export = $btn_export->generateHTML();

?>
<div id="reset-button" style="float:right;display:none;">
    <a href="javascript:void(0);" onclick="$.usergroups.reset_filter();">
        <i class="fa fa-delete"> </i><?php echo lang("reset_filter");?>
    </a>
</div>
<div class="row button-row">
    <div class="col-xs-12 ">
        <?php
        echo $btn_new."&nbsp;".$btn_export;;
        ?>
    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        <?php echo $tbl->generateHTML();?>
    </div>
</div>

<script>
    var tbl_columns_usergroups = <?php echo json_encode($data["table_columns"]); ?>;
</script>