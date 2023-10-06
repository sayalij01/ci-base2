<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
	
	$confirm = "";
	if (isset($data["confirmed"]) && $data["confirmed"] == 0 && $error == "")
	{
		$btn_delete 	= new HTML_Button("remove".$data["health_insurance"]->ik_number, "confirmed", ucfirst(lang("delete")), E_COLOR::DANGER, E_SIZES::STANDARD, E_ICONS::TRASH_WHITE);
		$btn_delete->setAttributes(array("form"=>"form_delete_health_insurance", "value"=>true))->setValue(1)->setType(E_BUTTON_TYPES::SUBMIT);
		
		$btn_cancel 	= new HTML_Button("cancel", "cancel", lang("cancel"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::CANCEL);
		$btn_cancel->setAnchor(base_url("admin/health_insurance"));
		
		$fi_name = new HTML_FormItem(lang("ik_number").":", "fi_ik_number", "ik_number", HTML_FormItem::buildFormControl($data["health_insurance"]->ik_number));
		
		$form = new HTML_Form("form_delete_health_insurance", "form_delete_health_insurance", "#");
		$form
		->addFormItem($fi_name->generateHTML(true))
		->addFormItem(new HTML_Input("ik_number", "ik_number", E_INPUTTYPE::HIDDEN, "", $data["health_insurance"]->ik_number ))
		;
		
		$dlg_confirm 	= new HTML_Dialog("dlg_confirm_health_insurance", "dlg_confirm_health_insurance", lang("health_insurance_sure_delete"), $form->generateHTML(false), $btn_cancel->generateHTML()."&nbsp;".$btn_delete->generateHTML(), E_COLOR::DANGER, E_VISIBLE::YES );
		$dlg_confirm->setDismissable(E_DISMISSABLE::NO);
		
		$confirm = $dlg_confirm->generateHTML(false);
	}
	
?>
<div class="row">
	<div class="col-xs-12">
		<?php echo $page_alerts.$confirm;?>
	</div>
</div>