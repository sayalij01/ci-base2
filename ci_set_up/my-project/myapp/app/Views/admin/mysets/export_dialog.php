<?php

//echo "<b>Data:</b><br /><pre>".print_r($data,true)."</pre>";

$cbWithComponents = new HTML_Checkbox("cb_with_components","cb_with_components",lang("export_with_components"),E_CHECKED::NO,"cb_with_components",E_ENABLED::YES,E_INLINE::NO,E_VISIBLE::YES,array(),array(),array());
$cbWithoutComponents = new HTML_Checkbox("cb_without_components","cb_without_components",lang("export_without_components"),E_CHECKED::NO,"cb_without_components",E_ENABLED::YES,E_INLINE::NO,E_VISIBLE::YES,array(),array(),array());

$rbWithComponents = new HTML_Radio("cb_with_components","rb_export_components",lang("yes"),E_CHECKED::YES,"rb_with_documents",E_ENABLED::YES,E_INLINE::NO,E_VISIBLE::YES,array(),array(),array());
$rbWithoutComponents = new HTML_Radio("cb_with_components","rb_export_components",lang("no"),E_CHECKED::NO,"rb_without_documents",E_ENABLED::YES,E_INLINE::NO,E_VISIBLE::YES,array(),array(),array());

$rbWithDocuments = new HTML_Radio("rb_with_documents","rb_export_documents",lang("yes"),E_CHECKED::NO,"rb_with_documents",E_ENABLED::YES,E_INLINE::NO,E_VISIBLE::YES,array(),array(),array());
$rbWithoutDocuments = new HTML_Radio("rb_without_documents","rb_export_documents",lang("no"),E_CHECKED::YES,"rb_without_documents",E_ENABLED::YES,E_INLINE::NO,E_VISIBLE::YES,array(),array(),array());

$btnCancel = new HTML_Button("btn_cancel_export","btn_cancel_export",lang("cancel"),E_COLOR::DANGER,"",E_ICONS::CANCEL,"left",E_VISIBLE::YES,E_ENABLED::YES,array("width"=>"200px"),array(),array());
$btnExport = new HTML_Button("btn_start_export","btn_start_export",lang("export"),E_COLOR::PRIMARY,"",E_ICONS::FILE_EXCEL,"left",E_VISIBLE::YES,E_ENABLED::YES,array("width"=>"200px"),array(),array());

?>
<div class="row">
	<div class="col-xs-1"></div>
	<div class="col-xs-10">
		<?php echo lang("export_with_components")?>
	</div>
	<div class="col-xs-1"></div>
</div>
<div class="row">
	<div class="col-xs-1"></div>
	<div class="col-xs-3">
		<?php echo $rbWithoutComponents->generateHTML(); ?>
	</div>
	<div class="col-xs-8">
		<?php echo $rbWithComponents->generateHTML(); ?>
	</div>
</div>
<br />
<div class="row">
	<div class="col-xs-1"></div>
	<div class="col-xs-10">
		<?php echo lang("export_with_documents")?>
	</div>
	<div class="col-xs-1"></div>
</div>
<div class="row">
	<div class="col-xs-1"></div>
	<div class="col-xs-3">
		<?php echo $rbWithoutDocuments->generateHTML(); ?>
	</div>
	<div class="col-xs-8">
		<?php echo $rbWithDocuments->generateHTML(); ?>
	</div>
</div>
<br /><br />
<div class="row">
	<div class="col-xs-1"></div>
	<div class="col-xs-4">
		<?php echo $btnExport->generateHTML(); ?>
	</div>
	<div class="col-xs-4">
		<?php echo $btnCancel->generateHTML(); ?>
	</div>
	<div class="col-xs-3"></div>
</div>
<div style="display:none" id="export_data">
<?php echo json_encode($data["post"]);?>
</div>