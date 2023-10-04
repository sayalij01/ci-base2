<?php 
$pnl_equivalences = new HTML_Panel("pnlequivalences", "");
$tbl_equivalences = new HTML_Datatable("tbl_equivalences", $table_columns, $table_data);

$pnl_equivalences->setTitleStyle(array("padding-bottom" => 0));
$pnl_equivalences->setContent($tbl_equivalences->generateHTML());
$pnl_equivalences->setCollapsed(false);

$btn_new = '<button id="btn_new_equivalence" type="button" class="panel-title-button" >'.lang('new_equivalence').'</button>';
$btns_row1 = '<span id="pnl_equivalences-titleControl-row1" class="panel-titel-controls btn-group">'.
                $btn_new
             .'</span>';	
$pnl_equivalences->addTitleControlElement($btns_row1);
             
$modalID_equivalences = "mdl_equivalences";
$modal_equivalences = new HTML_Dialog($modalID_equivalences, $modalID_favorites, lang("add_new_equivalences"), '<div id="equivalences_container"></div>');
$modal_equivalences->setColor(E_COLOR::PRIMARY);
$modal_equivalences->setSize(E_SIZES::STANDARD);
$modal_equivalences->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);


echo $pnl_equivalences->generateHTML();
?>
<!--
<div class="row">
    <div class="col-xs-12">
		<?php /*echo $modal_equivalences->generateHTML(); */?>
	</div>	
</div>-->

<script>
	var tbl_columns_equivalences = <?php echo json_encode($table_columns); ?>;
</script>