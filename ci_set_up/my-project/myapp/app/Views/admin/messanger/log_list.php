<?php

$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$tbl 			= new HTML_Datatable("tbl_messanger_log_list", $data["table_columns"], array());
$pnl 			= new HTML_Panel("pnl_messanger_log_list", lang("messanger_log_list"), $page_alerts.$tbl->generateHTML());

?>
<div id="reset-button" style="float:right;display:none;">
    <a href="javascript:void(0);" onclick="$.clients.reset_filter();">
        <i class="fa fa-delete"> </i><?php echo lang("reset_filter");?>
    </a>
</div>
<div class="row">
    <div class="col-xs-12">
        <div id="tab1" class="tab-pane fade active in">
            <?php echo $tbl->generateHTML();?>
        </div>
    </div>
</div>

<script>
    var tbl_columns_messanger_log_list = <?php echo json_encode($data["table_columns"]); ?>;
</script>