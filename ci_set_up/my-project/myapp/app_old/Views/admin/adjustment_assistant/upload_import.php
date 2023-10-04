<?php
	$adjustment_assistant_hint_text = "<p>".lang('adjustment_assistant_hint_text')."</p>";
	$adjustment_assistant_hint = new HTML_Alert("i_adjustment_assistant_hint", lang("info"), $adjustment_assistant_hint_text, E_COLOR::TEXT_WHITE, E_DISMISSABLE::NO);
	$adjustment_assistant_hint->addClass("bg-white");
	
	
	
	$uploader_placeholder = new HTML_Anchor("upload_file", "Datei auswählen", base_url("admin/adjustment_assistant/set_adjustment"));
	$uploader_placeholder->addClass("btn btn-primary btn-block text-center")->setStyles(array("margin-left" => "1.5em;"));
	
	$upload_btn = '<input id="input_upload_adjustment" name="upload[]" multiple class="btn btn-block btn-default" type="file">';
	//<input id="input_upload_'.$key.'" class="theme_logo_upload" name="upload[]" class="btn btn-block btn-default" type="file" theme-client="'.$theme->client_id.'">
	
?>



<ul id="tab-list" class="nav nav-tabs fadeInRight">
    <li tab="1" class="tab_header active">
        <a class="tab_links not_clickable" data-toggle="tab" pane="tab1" href="javascript:void(0)">Umstellung-Assistent</a>
    </li>
</ul>

<div id="tab-content" class="tab-content fadeInLeft">
    <div id="tab1" class="tab-pane fade active in" style="padding:0;">
        <div class="row">
            <div class="col-xs-3" style=" background-color: inherit; ">
                <br>
                <p class="text-center"><label class="custom-file-label text-center" for="input_upload_adjustment"><?php echo lang("select_files"); ?></label></p>
                <?php echo $upload_btn; ?>
            </div>
            <div class="col-xs-9" style="background-color: inherit; ">
                <?php echo $adjustment_assistant_hint->generateHTML(); ?>
            </div>
        </div>
    </div>
</div>

