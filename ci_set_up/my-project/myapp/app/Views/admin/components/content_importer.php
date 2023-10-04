<?php

$uploader_placeholder = new HTML_Anchor("upload_component_documents", lang("select_file"), "#");
$uploader_placeholder->addClass("btn btn-primary btn-block text-center")->setStyles(array("margin-left" => "1.5em;"));

$upload_btn = '<input id="input_upload_content_importer" name="upload_content_importer[]" multiple class="btn btn-block btn-default" type="file">';
?>
<div class="row">
    <div class="col-xs-12">
        <?php echo lang("content_importer_instruction"); ?>
        <a href="<?php echo base_url().$this->config->item("static_files_folder")."content_template.csv"; ?>"><?php echo lang("csv_template") ?></a><br /><br />
    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        <?php echo $upload_btn; ?>
    </div>
</div>