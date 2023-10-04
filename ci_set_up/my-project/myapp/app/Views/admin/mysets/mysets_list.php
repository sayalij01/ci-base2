<?php
//echo "<pre>".print_r($_SESSION,true)."</pre>";
$ci = &get_instance();
$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$clinic_partner = $data["clinic_partner"];
if (!$ci->hasPermission(E_PERMISSIONS::MYSETS_LIST_CLINICPARTNER))
{
	$clinic_partner = 0;
}

$tbl = new HTML_Datatable("tbl_mysets", $data["table_columns"], $data["table_data"]);
		$pnl = new HTML_Panel("pnl_mysets", "");
		//$pnl->addTitleControl("btn_storage_life", "btn_storage_life", E_ICONS::CLOCK_WHITE."&nbsp".lang("storage_life"), "", "", array("panel-title-button"));
		if ($ci->hasPermission(E_PERMISSIONS::MYSETS_OPTIMIZE))
		{
			$pnl->addTitleControl("btn_set_optimize", "btn_set_optimize", E_ICONS::LINE_CHART."&nbsp".lang("set_optimize"), "", "", array("panel-title-button"));
		}
		if ($ci->hasPermission(E_PERMISSIONS::MYSETS_LOCK))
		{
			$pnl->addTitleControl("btn_set_lock", "btn_set_lock", E_ICONS::TIMES_CIRCLE_BLACK."&nbsp".lang("set_lock"), "", "", array("panel-title-button","grey"),array("disabled"=>"disabled"));
		}
		if ($ci->hasPermission(E_PERMISSIONS::MYSETS_DELETE))
		{
			$pnl->addTitleControl("btn_set_delete_batch", "btn_set_delete_batch", E_ICONS::DELETE."&nbsp".lang("set_delete"), "", "", array("panel-title-button","grey"),array("disabled"=>"disabled"));
		}
		if($ci->hasPermission(E_PERMISSIONS::MYSETS_EXPORT))
		{
		    $pnl->addTitleControl("btn_set_export","btn_set_export",E_ICONS::FILE_EXCEL."&nbsp;".lang("export_kitpack"), "", "", array("panel-title-button","grey"),array("disabled"=>"disabled"));
		}
        if($ci->hasPermission(E_PERMISSIONS::MYSETS_EXPORT_MYSETS_LIST))
        {
            $pnl->addTitleControl("btn_set_export_list","btn_set_export_list",E_ICONS::FILE_EXCEL."&nbsp;".lang("export_kitpack_list"), "", "", array("panel-title-button"),array());
        }
		$pnl->setContent($tbl->generateHTML());
		$pnl->setCollapsed(false);


// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Modal
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_Documents";
$modal1 = new HTML_Dialog($modalID, $modalID, lang("documents"), '<div id="mysets_documents_container"></div>');
$modal1->setColor(E_COLOR::PRIMARY);
$modal1->setSize(E_SIZES::XS);
$modal1->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Set Details
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_set_details";
$modal2 = new HTML_Dialog($modalID, $modalID, lang("set_details"), '<div id="mysets_details_container"></div>');
$modal2->setColor(E_COLOR::PRIMARY);
$modal2->setSize(E_SIZES::LG);
$modal2->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Set Export
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_set_export";
$modal3 = new HTML_Dialog($modalID, $modalID, lang("set_details"), '<div id="mysets_export_container"></div>',"","default",E_VISIBLE::YES,array(),array(),array());
$modal3->setColor(E_COLOR::PRIMARY);
$modal3->setSize(E_SIZES::MD);
$modal3->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
	//$set_details = $this->load->view("admin/mysets/set_details", array(), true);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Action History
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_action_history";
$modal4 = new HTML_Dialog($modalID, $modalID, lang("action_history_title"), '<div id="action_history_container"></div>');
$modal4->setColor(E_COLOR::PRIMARY);
$modal4->setSize(E_SIZES::MD);
$modal4->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Clinicpartner Set Details
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_clinicpartner_set_details";
$modal5 = new HTML_Dialog($modalID, $modalID, lang("clinicpartner_set_details"), '<div id="clinicpartner_sets_details_container"></div>');
$modal5->setColor(E_COLOR::PRIMARY);
$modal5->setSize(E_SIZES::LG);
$modal5->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
	//echo $set_details;


$moreTabs = false;
$clinicpartner_table_columns = [];
$tab2 = "";
$tabcontent2 = "";
if ($clinic_partner) {
	$moreTabs = true;

	$tbl2 = new HTML_Datatable("tbl_mysets_clinicpartner", $data["clinicpartner_table_columns"], $data["clinicpartner_table_data"]);
	$pnl2 = new HTML_Panel("pnl_mysets_clinicpartner", "");
	$pnl2->setContent($tbl2->generateHTML());
	$pnl2->setCollapsed(false);

	$clinicpartner_table_columns = $data["clinicpartner_table_columns"];
	$tab2 =	'<li tab="2" class="tab_header">
				<a class="tab_links" data-toggle="tab" pane="tab2" href="#tab2">'.lang("clinicpartner_sets").'</a>
			</li>';

	$tabcontent2 = '<div id="tab2" class="tab-pane fade in" style="padding:0;">
				<div>
					'.$pnl2->generateHTML().'
				</div>
		</div>';
}


// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Action Component Details
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_Details";
$modal_details = new HTML_Dialog($modalID, $modalID, lang("detailed_view"), '<div id="component_details_container"></div>');
$modal_details->setColor(E_COLOR::PRIMARY);
$modal_details->setSize(E_SIZES::LG);
$modal_details->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
?>
<input type="hidden" id="handleDatasetLocked" value="0" />
<div class="row">
	<ul id="tab-list" class="nav nav-tabs fadeInRight">
		<li tab="1" class="tab_header active">
			<a class="tab_links <?php if (!$moreTabs) echo "not_clickable"; ?>" data-toggle="tab" pane="tab1"
			   href="<?php if (!$moreTabs) echo 'javascript:void(0)'; else echo '#tab1'; ?>"><?php echo lang("my_sets"); ?></a>
		</li>
		<?php echo $tab2; ?>
	</ul>

	<div id="tab-content" class="tab-content fadeInLeft">
		<div id="tab1" class="tab-pane fade active in" style="padding:0;">
				<div>
					<?php echo $pnl->generateHTML();?>
				</div>
		</div>
		<?php echo $tabcontent2; ?>
	</div>
</div>
<div class="col-xs-12">
	<?php echo $modal1->generateHTML(); ?>
	<?php echo $modal2->generateHTML(); ?>
	<?php echo $modal3->generateHTML(); ?>
    <?php echo $modal4->generateHTML(); ?>
    <?php echo $modal_details->generateHTML(); ?>
	<?php echo $modal5->generateHTML(); ?>
</div>
<script>
	var tbl_columns_mysets = <?php echo json_encode($data["table_columns"]); ?>;
	var tbl_columns_mysets_clinic_partner = <?php echo json_encode($data["clinicpartner_table_columns"]); ?>;
</script>
