<?php

$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$btn_new = "";
//if ($data["permissions"]["create"] === true)
{
    $btn_new = new HTML_Button("btn_new", "btn_new", lang("warnings_create"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::USER_PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_new->setAnchor(base_url("admin/warnings/create"));
    $btn_new = $btn_new->generateHTML();
}

$tbl 			= new HTML_Datatable("tbl_warnings", $data["table_columns"], $data["table_data"]);
$pnl 			= new HTML_Panel("pnl_warnings", lang("warnings"), $page_alerts.$tbl->generateHTML(), $btn_new);

$comp_assignment = $this->load->view("admin/warnings/warnings_component_assignment", $data, true);


?>

<div class="row">
	<div class="col-xs-12">
		<ul id="tab-list" class="nav nav-tabs-normal">
			<li class="active">
				<a data-toggle="tab" href="#tab1"><?php echo lang("table_view"); ?></a>
			</li>
			<li class="">
				<a data-toggle="tab" href="#tab2"><?php echo lang("component_assigment"); ?></a>
			</li>			
		</ul>
	</div>
	<div id="tab-content" class="tab-content fadeInLeft col-xs-12">
		<div id="tab1" class="tab-pane fade active in">
            <div class="row button-row">
            	<div class="col-xs-12 ">
            		<?php echo $btn_new; ?>
            	</div>
            </div>		
			<?php echo $tbl->generateHTML();?>
		</div>
		<div id="tab2" class="tab-pane">
			<?php echo $comp_assignment; ?>
		</div>		
	</div>
</div>

<script>
	var tbl_columns_warnings = <?php echo json_encode($data["table_columns"]); ?>;
</script>