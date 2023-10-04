<?php

$page_alerts = buildPageAlerts($error, $success, $warning, $info);

$uploader_placeholder = new HTML_Anchor("upload_customer_catalog", lang("select_file"), base_url("admin/components/upload_customer_catalog"));
$uploader_placeholder->addClass("btn btn-primary btn-block text-center")->setStyles(array("margin-left" => "1.5em;"));

$upload_btn = '<input id="input_upload_customer_catalog" name="upload_customer_catalog[]" multiple class="btn btn-block btn-default" type="file">';

?>
<input type="hidden" id="upload_customer_catalog_client_id" value="<?php echo $data["client_id"]; ?>" />
<input type="hidden" id="upload_customer_catalog_catalog_template_id" value="<?php echo $data["catalog_template_id"]; ?>" />
<div class="row">
	<div class="col-xs-12">
		<?php echo $upload_btn; ?>
	</div>
</div>