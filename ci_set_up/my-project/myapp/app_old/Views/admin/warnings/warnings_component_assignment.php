<?php
$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$btn_new = "";
//if ($data["permissions"]["create"] === true)
{
    $btn_new = new HTML_Button("btn_new_assignment", "btn_new_assignment", lang("assignment"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::USER_PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_new = $btn_new->generateHTML();
}

$tbl 			= new HTML_Datatable("tbl_warnings_assignment", $data["table_columns_assignment"], $data["table_data_assignment"]);

$modal_assignment = new HTML_Dialog("mdl_warning_assignment", "mdl_warning_assignment", lang("add_new_warning_assignment"), '<div id="warning_assignment_container"></div>');
$modal_assignment->setColor(E_COLOR::PRIMARY);
$modal_assignment->setSize(E_SIZES::STANDARD);
$modal_assignment->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

?>
<div class="row button-row">
	<div class="col-xs-12 ">
		<?php echo $btn_new; ?>
	</div>
</div>		
<?php echo $tbl->generateHTML();?>
<div class="row">
    <div class="col-xs-12">
		<?php echo $modal_assignment->generateHTML(); ?>
	</div>	
</div>
<script>
	var tbl_columns_warnings_assignment = <?php echo json_encode($data["table_columns_assignment"]); ?>;
</script>