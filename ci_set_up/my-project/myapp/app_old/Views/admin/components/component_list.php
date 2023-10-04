<?php
	$component_list = (array_key_exists("component_list", $data));
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

	$start = new HTML_Datepicker("date_start", "date_start", format_timestamp2date(time()));
	$start_html='<div class="input-group pull-left" style="width:200px; margin: 10px;">'.$start->generateHTML()."</div>";
	$end = new HTML_Datepicker("date_end", "date_end", format_timestamp2date(time()));
	$end_html = '<div class="input-group pull-left" style="width:200px; margin: 10px;">'.$end->generateHTML().'</div>';
	//$start->setStyles(array("width" => "100px"));


	$tbl = new HTML_Datatable("tbl_components", $data["table_columns"], $data["table_data"]);
	$pnl = new HTML_Panel("pnlcomponents", "");


	$btns_row1 = '<div id="filter_row1">'.$this->load->view("admin/components/component_filter", $data, true).'</div>';

	
	$btn_3month = '<button id="btn_3month" type="button" class="panel-title-button" >3 Monate</button>';
	$btn_6month = '<button id="btn_6month" type="button" class="panel-title-button" >6 Monate</button>';
	$btn_12month = '<button id="btn_12month" type="button" class="panel-title-button" >12 Monate</button>';
	$btns_row2 = '<span id="pnlcomponents-titleControl-row2" class="panel-titel-controls btn-group">'.
					$btn_3month.$btn_6month.$btn_12month.$start_html.$end_html.
				'</span>';

    $btns_row2 = '';
	
	//$pnl->addTitleControlElement($search_panel->generateHTML());
	//$pnl->addTitleControl("btn_quick", "btn_quick", E_ICONS::BOLT."&nbsp".lang("quick_edit"), "",  "", array("panel-title-button"));
	//$pnl->addTitleControl("btn_favorites", "btn_favorites", E_ICONS::STAR_BLACK."&nbsp".lang("favorites"), "",  "", array("panel-title-button"));
	//$pnl->addTitleControl("btn_non_contract", "btn_non_contract", E_ICONS::WARNING."&nbsp".lang("individual_component"), "",  "", array("panel-title-button"));
	//$pnl->addTitleControl("btn_individual", "btn_individual", E_ICONS::CHECK_CIRCLE_BLACK."&nbsp".lang("master-list"), "",  "", array("panel-title-button"));
	$pnl->addTitleControlElement($btns_row1);
	if ($component_list)
	{
		$pnl->addTitleControlElement($btns_row2);
	}
	
	//$pnl->addTitleControl("btn_filter1", "btn_filter1", E_ICONS::FILTER."&nbsp".lang("filter1"), "",  "", array("panel-title-button"));
	//$pnl->addTitleControl("btn_filter2", "btn_filter1", E_ICONS::FILTER."&nbsp".lang("filter1"), "",  "", array("panel-title-button"));
	
	
	$pnl->setTitleStyle(array("padding-bottom"=> 0));
	$pnl->setContent($tbl->generateHTML());
	$pnl->setCollapsed(false);
	
	$customer_catalog_view = "";
	$equivalences_view = "";
	$customer_catalog_content_view = "";
	$equivalences_content_view = "";
	if(!$data["permissions"]["customer_catalog"])
	{
	    $customer_catalog_view = " style=\"display:none;\"";
	    $customer_catalog_content_view = "display:none;";
	}
	if(!$data["permissions"]["equivalences"])
	{
	    $equivalences_view = " style=\"display:none;\"";
	    $equivalences_content_view = "display:none;";
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: Modal
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$modalID = "mdl_Documents";
	$modal = new HTML_Dialog($modalID, $modalID, lang("documents"), '<div id="component_documents_container"></div>');
	$modal->setColor(E_COLOR::PRIMARY);
	$modal->setSize(E_SIZES::STANDARD);
	$modal->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
	
	$modalID = "mdl_Details";
	$modal_details = new HTML_Dialog($modalID, $modalID, lang("detailed_view"), '<div id="component_details_container"></div>');
	$modal_details->setColor(E_COLOR::PRIMARY);
	$modal_details->setSize(E_SIZES::LG);
	$modal_details->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

	$modalID = "mdl_Images";
	$modal_images = new HTML_Dialog($modalID, $modalID, lang("images"), '<div id="component_images_container"></div>');
	$modal_images->setColor(E_COLOR::PRIMARY);
	$modal_images->setSize(E_SIZES::STANDARD);
	$modal_images->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

	/**
	 * Modal for Favorites
	 */
    $modalID_favorites = "mdl_favorites";
	$modal_favorites = new HTML_Dialog($modalID_favorites, $modalID_favorites, lang("favorite_lists"), '<div id="favorite_lists_container"></div>');
	$modal_favorites->setColor(E_COLOR::PRIMARY);
	$modal_favorites->setSize(E_SIZES::STANDARD);
	$modal_favorites->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

?>
<div class="row"><?php echo $page_alerts;?></div>

<div class="row">
    <ul id="tab-list" class="nav nav-tabs-normal fadeInRight">
        <li tab="1" class="tab_components_list active">
            <!--<a class="tab_links not_clickable" data-toggle="tab" pane="tab1" href="javascript:void(0)"><?php echo lang("components"); ?></a>-->
            <a data-toggle="tab" pane="tab1" href="#tab1"><?php echo lang("components"); ?></a>
        </li>
        <li tab="2"<?php echo $customer_catalog_view; ?>>
            <a data-toggle="tab" pane="tab2" href="#tab2"><?php echo lang("customer_catalog"); ?></a>
        </li>
        <li tab="3"<?php echo $equivalences_view; ?>>
            <a data-toggle="tab" pane="tab3" href="#tab3"><?php echo lang("equivalences"); ?></a>
        </li>        
    </ul>

    <div id="tab-content" class="tab-content fadeInLeft">
        <div id="tab1" class="tab-pane fade active in" style="padding:0;">
            <div>
				<?php echo $pnl->generateHTML();?>
            </div>
        </div>
        <div id="tab2" class="tab-pane fade in" style="padding:0;<?php echo $customer_catalog_content_view; ?>">
            <div>
                <div>
                    <?php echo $data["customer_catalog"];?>
                </div>
            </div>
        </div>

        <div id="tab3" class="tab-pane fade in" style="padding:0;<?php echo $equivalences_content_view; ?>">
            <div>
                <div>
                    <?php echo $data["equivalences"];?>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
	<div class="col-xs-12">
		<?php /*echo $tbl->generateHTML();*/?>
	</div>
    <div class="col-xs-12">
		<?php echo $modal->generateHTML(); ?>
    </div>
    <div class="col-xs-12">
		<?php echo $modal_images->generateHTML(); ?>
    </div>
    <div class="col-xs-12">
		<?php echo $modal_details->generateHTML(); ?>
	</div>
    <div class="col-xs-12">
		<?php echo $modal_favorites->generateHTML(); ?>
	</div>	
    
</div>
<div class="highslide-caption">

</div>

<script src="<?php echo base_url()."resources/cdn/datatables/jquery-1.11.0.min.js";?>"></script>
<script src="<?php echo base_url()."resources/cdn/datatables/jquery.dataTables.1.13.2.min.js";?>"></script>
<script src="<?php echo base_url()."resources/cdn/datatables/dataTables.buttons.2.3.4.min.js";?>"></script>
<script src="<?php echo base_url()."resources/cdn/datatables/jszip.min.js";?>"></script>
<script src="<?php echo base_url()."resources/cdn/datatables/pdfmake.min.js";?>"></script>
<script>
	var tbl_columns_components = <?php echo json_encode($data["table_columns"]); ?>;
</script>