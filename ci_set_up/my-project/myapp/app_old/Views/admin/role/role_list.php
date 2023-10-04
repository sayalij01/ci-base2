<?php
use App\core\BASE_Controller;
use App\Libraries\HTML_DTColumn;
use App\Helpers\HTML_Datatable , App\Helpers\HTML_Button;

// $page_alerts = buildPageAlerts($error, $success, $warning, $info);
// print_r($data["table_columns"]);die;
$btn_new = "";
if (BASE_Controller::hasPermission(E_PERMISSIONS::ROLE_CREATE))
{
	$btn_new = new HTML_Button("btn_new", "btn_new", lang("role_create"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::USER_PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_new->setAnchor(base_url("admin/roles/create"));
	$btn_new = $btn_new->generateHTML();
}

$tbl = new HTML_Datatable("tbl_roles", $data["table_columns"], $data["table_data"]);
// $pnl = new HTML_Panel("pnl_roles", lang("roles"), $page_alerts.$tbl->generateHTML(), $btn_new);

$btn_export = new HTML_Button("btn_export_list", "btn_export_list", lang("export_role_list"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::FILE_EXCEL, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
$btn_export = $btn_export->generateHTML();




?>
<div id="reset-button" style="float:right;display:none;">
    <a href="javascript:void(0);" onclick="$.roles.reset_filter();">
        <i class="fa fa-delete"> </i><?php echo lang("reset_filter");?>
    </a>
</div>
<div class="row button-row">
	<div class="col-xs-12 ">
		<?php echo $btn_new."&nbsp;".$btn_export; ?>
	</div>
</div>

<div class="row">
	<div class="col-xs-12">
		<?php echo $tbl->generateHTML();?>
	</div>
</div>

<script src="https://code.jquery.com/jquery-3.7.0.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>

<script>
	var tbl_columns_roles = <?php echo json_encode($data["table_columns"]); ?>;
	new DataTable('#tbl_roles');
</script>