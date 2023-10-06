<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
	
	$confirm = "";
	if (isset($data["confirmed"]) && $data["confirmed"] == 0 && $error == "")
	{
		$btn_delete 	= new HTML_Button("remove".$data["contract"]->contract_id, "confirmed", ucfirst(lang("delete")), E_COLOR::DANGER, E_SIZES::STANDARD, E_ICONS::TRASH_WHITE);
		$btn_delete->setAttributes(array("form"=>"form_delete_contract", "value"=>true))->setValue(1)->setType(E_BUTTON_TYPES::SUBMIT);
		
		$btn_cancel 	= new HTML_Button("cancel", "cancel", lang("cancel"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::CANCEL);
		$btn_cancel->setAnchor(base_url("admin/contract"));
		
		$fi_name = new HTML_FormItem(lang("contract_id").":", "fi_contract_id", "contract_id", HTML_FormItem::buildFormControl($data["contract"]->contract_id));
		
		$form = new HTML_Form("form_delete_contract", "form_delete_contract", "#");
		$form
		->addFormItem($fi_name->generateHTML(true))
		->addFormItem(new HTML_Input("contract_id", "contract_id", E_INPUTTYPE::HIDDEN, "", $data["contract"]->contract_id ))
		;
		
		$dlg_confirm 	= new HTML_Dialog("dlg_confirm_contract", "dlg_confirm_contract", lang("contract_sure_delete"), $form->generateHTML(false), $btn_cancel->generateHTML()."&nbsp;".$btn_delete->generateHTML(), E_COLOR::DANGER, E_VISIBLE::YES );
		$dlg_confirm->setDismissable(E_DISMISSABLE::NO);
		
		$confirm = $dlg_confirm->generateHTML(false);
	}
	
?>
<div class="row">
	<div class="col-xs-12">
		<?php echo $page_alerts.$confirm;?>
	</div>
</div>