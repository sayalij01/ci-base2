<?php
$pnl_customercatalog = new HTML_Panel("pnlcustomercatalog", "");
$tbl_customercatalog = new HTML_Datatable("tbl_customercatalog", $tablecustomercatalog_columns, $tablecustomercatalog_data);

$pnl_customercatalog->setTitleStyle(array("padding-bottom" => 0));
$pnl_customercatalog->setContent($tbl_customercatalog->generateHTML());
$pnl_customercatalog->setCollapsed(false);

//$btn_upload = '<button id="btn_upload_customer_catalog" type="button" class="panel-title-button" >'.lang('upload_customer_catalog').'</button>';
//$btn_new_catalog_template = '<button id="btn_new_catalog_template" type="button" class="panel-title-button" >' . lang('new_catalog_template') . '</button>';


$options_catalog_templates = HTML_Select::buildOptions($available_catalog_templates, "catalog_template_id", "catalog_template_name", -1, lang("individal_customer_catalog"),true,true, false,"catalog_template_id");
$select_catalog_templates =
    '<select id="select_catalog_templates" name="select_catalog_templates" role="select" data-allow-clear="1" class="panel-control panel-title-button">
					'.$options_catalog_templates.'
	 </select>';

/*$btns_row1 = '<span id="pnl_equivalences-titleControl-row1" class="panel-titel-controls btn-group">'.
               $btn_new
              .'</span>';
              $pnl_customercatalog->addTitleControlElement($btns_row1);*/

$btns_row1 = '<div id="filter_row1_customer_catalog">'.$this->load->view("admin/components/component_filter", $data, true).
             //'<span class="panel-titel-controls btn-group">'.$select_catalog_templates.'</span>'.
             //'<span class="panel-titel-controls btn-group">'.$btn_new_catalog_template.'</span>'.
             //'<span class="panel-titel-controls btn-group">'.$btn_upload.'</span>'.
             '</div>';
$pnl_customercatalog->addTitleControlElement($btns_row1);

$modalID_upload_import = "mdl_upload_import";
$modal_upload_import = new HTML_Dialog($modalID_upload_import, $modalID_upload_import, lang("upload_customer_catalog"), '<div id="upload_import_container"></div>');
$modal_upload_import->setColor(E_COLOR::PRIMARY);
$modal_upload_import->setSize(E_SIZES::STANDARD);
$modal_upload_import->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

$modalID_new_catalog_template = "mdl_new_catalog_template";
$modal_new_catalog_template = new HTML_Dialog($modalID_new_catalog_template, $modalID_new_catalog_template, lang("new_catalog_template"), '<div id="new_catalog_template_container"></div>');
$modal_new_catalog_template->setColor(E_COLOR::PRIMARY);
$modal_new_catalog_template->setSize(E_SIZES::STANDARD);
$modal_new_catalog_template->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

echo $pnl_customercatalog->generateHTML();
?>
<div class="row">
    <div class="col-xs-12">
		<?php echo $modal_upload_import->generateHTML(); ?>
        <?php echo $modal_new_catalog_template->generateHTML(); ?>
	</div>	
</div> 
<script>
	var tbl_columns_customercatalog = <?php echo json_encode($tablecustomercatalog_columns); ?>;
</script>
