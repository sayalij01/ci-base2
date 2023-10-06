<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

	$btn_new = "";
	if (BASE_Controller::hasPermission(E_PERMISSIONS::ROOT_CONTRACT_CREATE) === true)
	{
		$btn_new = new HTML_Button("btn_new", "btn_new", lang("contract_create"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
		$btn_new->setAnchor(base_url("root/contracts/create"));
		$btn_new = $btn_new->generateHTML();
	}
    $general_settings_tabs = "display:none;";
	if(BASE_Controller::hasPermission(E_PERMISSIONS::ROOT_CONTRACT_GENERAL_SETTINGS) === true)
    {
        $general_settings_tabs = "";
    }

	$tbl 		= new HTML_Datatable("tbl_contract", $data["table_columns"], $data["table_data"] );
	//$pnl 		= new HTML_Panel("pnl_contract", lang("contract"), $page_alerts.$tbl->generateHTML(), $btn_new);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: Documents view
	$global_documents_data = array(
	    "data"=>array(
	        "contract" => $data["contract"],
	        "available_document_types" => $data["available_document_types"],
	        "document_editor" => $document_editor
	    )
	);
	$general_settings = array("data"=>$data["general_settings"]);

	$global_documents = $this->load->view("root/contract/contract_global_docs", $global_documents_data, true);
	$general_settings_view = $this->load->view("root/contract/general_settings", $general_settings, true);
?>
<div class="row">
	<div class="col-xs-12">
		<ul id="contract-tab-list" class="nav nav-tabs fadeInRight" style="">
			<li class="active">
				<a data-toggle="tab" href="#contracts"><?php echo lang("contracts"); ?></a>
			</li>
			<li class="">
				<a data-toggle="tab" href="#global_documents"><?php echo lang("global_documents"); ?></a>
			</li>
            <li class="" style="<?php echo $general_settings_tabs; ?>">
                <a data-toggle="tab" href="#general_settings"><?php echo lang("general_settings"); ?></a>
            </li>
		</ul>
		<div id="contract-tab-content" class="tab-content fadeInLeft" style="">
			<div id="contracts" class="tab-pane fade in active">
                <div class="row">
                	<?php echo $page_alerts;?>
                </div>
                <div class="row button-row">
                	<div class="col-xs-12 ">
                		<?php echo $btn_new; ?>
                	</div>
                </div>
                <div class="row">
                	<div class="col-xs-12">
                		<?php echo $tbl->generateHTML();?>
                	</div>
                </div>
            </div>
            <div id="global_documents" class="tab-pane fade">
            	<?php echo $global_documents;?>
            </div>
            <div id="general_settings" class="tab-pane fade" style="<?php echo $general_settings_tabs; ?>">
                <?php echo $general_settings_view; ?>
            </div>
        </div>
    </div>
</div>
<script>
	var tbl_columns_contract = <?php echo json_encode($data["table_columns"]); ?>;
</script>
