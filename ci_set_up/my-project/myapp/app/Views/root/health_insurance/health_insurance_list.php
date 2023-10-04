<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
	
	$btn_new = "";
	if (BASE_Controller::hasPermission(E_PERMISSIONS::ROOT_HEALTH_INSURANCE_CREATE))
	{
		$btn_new = new HTML_Button("btn_new", "btn_new", lang("health_insurance_create"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
		$btn_new->setAnchor(base_url("root/health_insurances/create"));
		$btn_new = $btn_new->generateHTML();
	}
		
	$tbl 		= new HTML_Datatable("tbl_health_insurances", $data["table_columns"], $data["table_data"] );
	//$pnl 		= new HTML_Panel("pnl_health_insurances", lang("health_insurances"), $page_alerts.$tbl->generateHTML(), $btn_new->generateHTML());
?>
<div class="row">
	<?php echo $page_alerts;?>	
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
<script>
	var tbl_columns_health_insurance = <?php echo json_encode($data["table_columns"]); ?>;
</script>