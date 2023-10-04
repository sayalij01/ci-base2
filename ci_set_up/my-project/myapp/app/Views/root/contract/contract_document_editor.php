<?php
    $btn_return = new HTML_Button("btn_return", "btn_return", "", E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::BACKWARD, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_return->setType(E_BUTTON_TYPES::BUTTON);
    
    $btn_save = new HTML_Button("btn_save", "btn_save", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_save->setType(E_BUTTON_TYPES::BUTTON);
    
    $btn_delete = new HTML_Button("btn_delete_all", "btn_delete_all", lang("delete"), E_COLOR::SUCCESS, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_delete->setType(E_BUTTON_TYPES::BUTTON);
    
    $placeholder_list = new HTML_Form("form_placeholder_list", "form_placeholder_list", "#", $btn_return->generateHTML()."&nbsp;".lang("place_holder_list"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
    //$placeholder_list->addFormItem('<div class="col-xs-12" style="margin:0;padding:0;margin-bottom:5px;">'.$btn_save->generateHTML()."&nbsp;".$btn_delete->generateHTML().'</div>');
    
    $searchfield = new HTML_Input("placeholder_filter", "placeholder_filter", E_INPUTTYPE::TEXT, lang("placeholder_filter"),"","","",true,true,array(),array(),array());
    
    $btn_filter = new HTML_Button("btn_filter", "btn_filter", "", E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SEARCH, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_filter->setType(E_BUTTON_TYPES::BUTTON);
    
    $btn_filter_clear = new HTML_Button("btn_filter_clear", "btn_filter_clear", "", E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::REMOVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_filter_clear->setType(E_BUTTON_TYPES::BUTTON);
    
    $placeholders = array();
    $i=1;
    foreach($placeholder as $identifier=>$placeholder_text)
    {
        $placeholders[] = "<div class=\"placeholder_draggable\" fontfamily=\"Arial\" style=\"color:#0025ff;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;border:1px solid black;padding:1px;margin:2px;z-index:1000\" countid=\"".$i."\" title=\"".$placeholder_text."\" altText=\"".str_replace(" ","&nbsp;",$placeholder_text)."\" id=\"".$identifier."\">".$i.".&nbsp;".str_replace(" ","&nbsp;",$placeholder_text)."</div>";
        $i++;
    }
?>
<div class="col-xs-12 col-sm-12 col-md-6 col-lg-3">
	<?php echo $btn_save->generateHTML()."&nbsp;".$btn_delete->generateHTML(); ?>
	<br />
	<?php echo $placeholder_list->generateHTML(); ?>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="input-group">
				<?php echo $searchfield->generateHTML(); ?>
        		<span class="input-group-btn">
        			<?php echo $btn_filter->generateHTML(); ?>
        		</span>
        		<span class="input-group-btn">
        			<?php echo $btn_filter_clear->generateHTML(); ?>
        		</span>        		
        	</div>
		</div>
	</div>
	<br />
	<div id="drag-items">
	<?php echo implode("\n",$placeholders); ?>		
	</div>
	<!-- <br />
	<br />
	<?php //echo $btn_save->generateHTML()."&nbsp;".$btn_delete->generateHTML(); ?>-->
</div>
<div class="col-xs-12 col-sm-12 col-md-6 col-lg-9">
	<div class="row">
    	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="canvas_holder">
    	</div>	
	</div>
	<!--<pre>
	<?php //echo print_r($placeholders,true); ?>
	<?php //echo print_r($document,true); ?>
	</pre>-->
</div>
<script type="text/javascript>">
    var documentData = <?php echo json_encode($document); ?>;
</script>