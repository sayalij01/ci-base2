<?php
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	$costcarrier = new T_Costcarrier($data["costcarrier_imports"]);
	//die(echome($costcarrier));
	$options = HTML_Select::buildOptions($costcarrier->costcarriers, "sgb_costcarrier_id", "sgb_costcarrier_name", "sgb_costcarrier_id", lang('no_selection'), true, true, false);
	$i_sgb_costcarrier = new HTML_Select("i_sgb_costcarrier_id", "sgb_costcarrier_id", $options,false,lang('please_choose'));
	$fi_sgb_costcarrier = new HTML_FormItem(lang("select_costcarrier"), "fi_sgb_costcarrier", "i_sgb_costcarrier_id",array(), E_REQUIRED::YES);
	$fi_sgb_costcarrier->setValidationState( form_error("sgb_costcarrier_id") != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_sgb_costcarrier->addComponent( $i_sgb_costcarrier );
	
	
	$i_file_upload = '<input id="upload_costcarrier_file" name="upload_costcarrier_file[]" class="btn btn-block btn-default" type="file">';
	$fi_upload = new HTML_FormItem(lang("select_costcarrier_file"), "fi_upload_costcarrier_file", "upload_costcarrier_file[]");
	$fi_upload->addComponent($i_file_upload);
	
	$hidden_save 			= new HTML_Input("i_save", "start_import", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;
	
	$btn_submit = new HTML_Button("bt_submit", "bt_submit", lang("start_import"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit->setAttributes(array("form"=>"form_costcarrier"));
	$btn_submit->setType(E_BUTTON_TYPES::SUBMIT);
	
	$btn_reset = new HTML_Button("bt_reset", "reset", lang("undo"), E_COLOR::INFO, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset->setAttributes(array("form"=>"form_costcarrier"));
	$btn_reset->setType(E_BUTTON_TYPES::RESET);
	
	$form = new HTML_Form("form_costcarrier_details", "form_costcarrier_details", "#", lang("costcarrierfile_import"));
	$form->addFormItem($fi_sgb_costcarrier);
	$form->addFormItem($fi_upload);
	$form->addFormItem($hidden_save);
	
	$tbl = new HTML_Datatable("tbl_costcarrier_imports", $costcarrier->get_table_columns_imports(), array());

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: put all forms together
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$full_form = new HTML_Form("form_costcarrier", "form_costcarrier", "#", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$full_form->setAttributes(array("enctype"=>"multipart/form-data"));
	$full_form->addFormItem(
		$page_alerts.'
		<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4">'.
			$form->generateHTML(true).'
		</div>
		<div class="col-xs-12 col-sm-12 col-md-7 col-lg-8">'.
			$tbl->generateHTML().
		'</div>'
	);

?>
<div class="row button-row">
	<div class="col-xs-12 ">
		<?php 
			//echo $btn_reset->generateHTML()."&nbsp;";
			//echo $btn_submit->generateHTML();
		?>
	</div>
</div>
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		<?php echo $full_form->generateHTML(true); ?>
	</div>
</div>
<div class="row">
	<?php 
		//echo $btn_submit->generateHTML();
		// echo nl2br(print_r($data, true));
	?>
</div>
<script>
	var table_columns_imports = <?php echo json_encode($costcarrier->get_table_columns_imports()); ?>;
</script>
