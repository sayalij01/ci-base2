<?php
	use App\core\BASE_Controller;
	use App\Libraries\HTML_DTColumn;
	use App\Helpers\HTML_Datatable , App\Helpers\HTML_Button ,App\Helpers\HTML_ButtonGroup;
	use App\Helpers\HTML_FormItem ,App\Helpers\HTML_TextArea, App\Helpers\HTML_Toggle,  App\Helpers\HTML_Checkbox,  App\Helpers\HTML_Form,   App\Helpers\HTML_Panel;

	$btn_new = "";
	// if (BASE_Controller::hasPermission(E_PERMISSIONS::ROOT_CLIENT_CREATE))
	// {
		$btn_new = new HTML_Button("btn_new", "btn_new", lang("client_create"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::USER_PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
		$btn_new->setAnchor(base_url("create-clients"));
		$btn_new = $btn_new->generateHTML();
	// }
	
	$tbl 			= new HTML_Datatable("tbl_clients", $data["table_columns"], $data["table_data"]);
	//$pnl 			= new HTML_Panel("pnl_clients", lang("clients"), $page_alerts.$tbl->generateHTML(), $btn_new);
?>

<div class="row button-row">
	<div class="col-xs-12 ">
		<?php echo $btn_new; ?>
	</div>
</div>
<div class="row">
	<div class="col-xs-12">
		<?php echo $tbl->generateHTML();?>
	</div>
</div>
<script>
	var tbl_columns_clients = <?php echo json_encode($data["table_columns"]); ?>;
</script>