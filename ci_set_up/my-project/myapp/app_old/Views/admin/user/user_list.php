<?php
use App\core\BASE_Controller;
use App\Libraries\HTML_DTColumn;
use App\Helpers\HTML_Datatable , App\Helpers\HTML_Button;

	// $page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
	
	$btn_new 		= "";
	// if (BASE_Controller::hasPermission(E_PERMISSIONS::USER_CREATE))
	// {
		$btn_new 		= new HTML_Button("btn_new", "btn_new", lang("user_create"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::USER_PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
		$btn_new->setAnchor(base_url("create-users"));		
		$btn_new = $btn_new->generateHTML();
	// }
	
	$tbl = new HTML_Datatable("tbl_users", $data["table_columns"], $data["table_data"]);
	//$pnl = new HTML_Panel("pnl_users", lang("user"), $tbl->generateHTML(), $btn_new);
?>
<div class="row">
	<?php //echo $page_alerts;?>	
</div>
<div class="row button-row">
	<div class="col-xs-12 ">
		<?php 
			echo $btn_new;
		?>
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
	var tbl_columns_user = <?php echo json_encode($data["table_columns"]); ?>;
	new DataTable('#tbl_users');
</script>
<!-- <script>
	var tbl_columns_user = <?php //echo json_encode($data["table_columns"]); ?>;
</script> -->