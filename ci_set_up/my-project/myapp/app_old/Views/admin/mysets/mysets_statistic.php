<?php
$ci = &get_instance();	
$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);


// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: Modal
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$modalID = "mdl_Documents";
$modal1 = new HTML_Dialog($modalID, $modalID, lang("documents"), '<div id="mysets_statistic_documents_container"></div>');
$modal1->setColor(E_COLOR::PRIMARY);
$modal1->setSize(E_SIZES::XS);
$modal1->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

$modalID = "mdl_delivery_bottleneck";
$modal2 = new HTML_Dialog($modalID, $modalID, lang("documents"), '<div id="mysets_statistic_delivery_bottleneck_container"></div>');
$modal2->setColor(E_COLOR::PRIMARY);
$modal2->setSize(E_SIZES::XS);
$modal2->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
/*
$checkPDF = new HTML_Radio("cb_doc_type_pdf","cb_doc_type",E_ICONS::FILE_PDF."&nbsp;".lang("PDF"),E_CHECKED::YES,0,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array("hyphens"=>"none"),array('cb_sample'),array());
$checkXLSX = new HTML_Radio("cb_doc_type_excel","cb_doc_type",E_ICONS::FILE_EXCEL."&nbsp;".lang("Excel"),E_CHECKED::NO,1,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array("hyphens"=>"none"),array('cb_sample'),array());

$statisticType = new HTML_Input("i_statistic_type","i_statistic_type",E_INPUTTYPE::HIDDEN,"","","","",E_ENABLED::YES,E_VISIBLE::NO,array(),array(),array());
$dialogBTN = new HTML_Button("btn_confirm_doc_type","btn_confirm_doc_type",lang("confirm"),E_COLOR::PRIMARY,"","","left",E_VISIBLE::YES,E_ENABLED::YES,array(),array("pull-right"),array());

$dialog = "<div id=\"print_statistics_doc_type_select_container\">
            ".$statisticType->generateHTML()."
            <div class=\"row\">
                <div class=\"col-xs-1\"></div>
                <div class=\"col-xs-5\">
                    ".$checkPDF->generateHTML()."
                </div>
                <div class=\"col-xs-5\">
                    ".$checkXLSX->generateHTML()."
                </div>
                <div class=\"col-xs-1\"></div>
            </div>
            <div class=\"row\">
                <div class=\"col-xs-12\">&nbsp;</div>
            </div>
            <div class=\"row\">
                <div class=\"col-xs-12\">
                    ".$dialogBTN->generateHTML()."
                </div>
            </div>
           </div>";

$modalID = "mdl_docTypes";
$modal = new HTML_Dialog($modalID, $modalID, lang("doc_types"), $dialog);
$modal->setColor(E_COLOR::PRIMARY);
$modal->setSize(E_SIZES::XS);
$modal->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
*/
	//$set_details = $this->load->view("admin/mysets_statistic/set_details", array(), true);
	
	//echo $set_details;
$statistics = array();
//echo "<pre>".print_r($data["permissions"],true)."</pre>";
if ($data["permissions"][E_PERMISSIONS::SETS_STATISTIC] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_MY_SETS_STATISTIC]))
{
    $statistics[DocumentGenerator::TYPE_MY_SETS_STATISTIC] = "my_sets_statistic";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_SALES] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER]))
{
    $statistics[DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER] = "sales_statistics";
}

if ($data["permissions"][E_PERMISSIONS::STATISTIC_SALES_CUSTOMER] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER]))
{
    $statistics[DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER] = "sales_statistics_customer";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_SALES_CUSTOMER_MATERIAL] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER_MATERIAL]))
{
    $statistics[DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER_MATERIAL] = "sales_statistics_customer_material";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_SALES_ALL_CUSTOMER_MATERIAL] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER_ALL_MATERIAL]))
{
    $statistics[DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER_ALL_MATERIAL] = "sales_statistics_all_customer_material";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_SALES_COMPONENT] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT]))
{
    $statistics[DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT] = "sales_statistics_component";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_SALES_COMPONENT_MATERIAL] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT_MATERIAL]))
{
    $statistics[DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT_MATERIAL] = "sales_statistics_component_material";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_SALES_COMPONENT_MATERIAL_CUSTOMER] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT_MATERIAL_CUSTOMER]))
{
    $statistics[DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT_MATERIAL_CUSTOMER] = "sales_statistics_component_material_customer";
}
/*
 * OTHER SALES STATISCTICS GOES HERE !!!!! aer 22.02.2022
 */
if ($data["permissions"][E_PERMISSIONS::STATISTIC_ORDER] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_ORDER_STATISTIC]))
{
    $statistics[DocumentGenerator::TYPE_ORDER_STATISTIC] = "order_statistics";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_USER] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_USER_STATISTIC]))
{
    $statistics[DocumentGenerator::TYPE_USER_STATISTIC] = "user_statistics";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_CUSTOMER_USER] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_CUSTOMER_USER_STATISTIC]))
{
    $statistics[DocumentGenerator::TYPE_CUSTOMER_USER_STATISTIC] = "customer_user_statistics";
}
if ($data["permissions"][E_PERMISSIONS::STATISTIC_BOTTLENECKS] === true && isset($data["table_columns"]["tbl_statistic_".DocumentGenerator::TYPE_DELIVERY_BOTTLENECKS]))
{
    $statistics[DocumentGenerator::TYPE_DELIVERY_BOTTLENECKS] = "customer_delivery_bottlenecks";
}

$statistic_options = "";
$panels_statistics_html = "";

if (count($statistics) > 0)
{

    $selected = " selected";

    //echo "<pre>".print_r($statistics,true)."</pre>";

    foreach ($statistics as $id => $name)
    {
        //$start = new HTML_Datepicker("date_start_".$id, "date_start", format_timestamp2date(time()),"",lang("date_format_long"));
        $start = new HTML_Datepicker("date_start_".$id, "date_start", format_timestamp2date(strtotime('-2 month')),"",lang("date_format_long"));
        $start->addClass("datepicker-date_start");
        $start->addAttribute("statistic_id",$id);
        $start->clearBtn = true;
        $start_html='<div class="input-group pull-left" style="width:200px; margin: 10px;">'.$start->generateHTML()."</div>";

        $end = new HTML_Datepicker("date_end_".$id, "date_end", format_timestamp2date(time()),"",lang("date_format_long"));
        $end->addClass("datepicker-date_end");
        $end->addAttribute("statistic_id",$id);
        $end->clearBtn = true;
        $end_html = '<div class="input-group pull-left margin:10px;" style="width:200px; margin: 10px;">'.$end->generateHTML().'</div>';


        $r_kitpack_compact = new HTML_Radio("kitpack_compact_".$id, "kitpack_type", lang("kitpacks_compact"), E_SELECTED::NO, E_KITPACK_TYPES::KITPACK_COMPACT);
        $r_kitpack_compact->addAttribute("statistic_id",$id);
        $r_kitpack_select = new HTML_Radio("kitpack_select_".$id, "kitpack_type", lang("kitpacks_select"), E_SELECTED::NO, E_KITPACK_TYPES::KITPACK_SELECT);
        $r_kitpack_select->addAttribute("statistic_id",$id);
        $r_kitpack_all = new HTML_Radio("kitpack_all_".$id, "kitpack_type", lang("kitpacks_all"), E_SELECTED::YES, E_KITPACK_TYPES::KITPACK_ALL);
        $r_kitpack_all->addAttribute("statistic_id",$id);
        if($id != 7)
        {
            $kitpack_type_html = '<div class="input-group pull-left margin:10px;" style="width:300px; margin: 10px;">'.
                '<div class="radio radio-inline"></div>'. // this dummy div is needed that the first radio button is vertically aligned correctly
                $r_kitpack_compact->generateHTML().
                $r_kitpack_select->generateHTML().
                $r_kitpack_all->generateHTML().
                '</div>';
        }
        else
        {
            $kitpack_type_html = "";
        }

        /*
        $fi_kitpack_type = new HTML_FormItem("", "fi_kitpack_type", "i_kitpack_type", array(), E_REQUIRED::NO);
        $fi_kitpack_type->addComponent($kitpack_type_html);
        //$kitpack_type_html = $fi_kitpack_type->generateHTML();

        $form_kitpack = new HTML_Form("form_kitpack", "form_kitpack", "#", "");
        $form_kitpack->addFormItem($fi_kitpack_type);
        $kitpack_type_html = $form_kitpack->generateHTML();
        */


        $tbl_id = "tbl_statistic_".$id;
        $tbl = new HTML_Datatable($tbl_id, $data["table_columns"][$tbl_id], $data["table_data"]);
        $tbl->addClass("datatable-tbl_statistic");
        $tbl->addAttribute("statistic_id",$id);

        $pnl_statistic = new HTML_Panel("pnl_statistic_".$id,lang($name) );
        $pnl_statistic->addAttribute("statistic_id", $id);
        $pnl_statistic->addClass("pnl_statistic");
        switch ($id)
        {
            case DocumentGenerator::TYPE_MY_SETS_STATISTIC:

                //$pnl->addTitleControl("btn_set_search", "btn_set_search", E_ICONS::SEARCH."&nbsp".lang("search"), "",  "", array("panel-title-button"));
                $pnl_statistic->addTitleControl("btn_clinic", "btn_clinic", lang("clinic"), "",  "", array("panel-title-button"), array("statistic_id"=>$id));
                //$pnl_statistic->addTitleControl("btn_3month", "btn_3month", lang("3_month"), "",  "", array("panel-title-button"));
                //$pnl_statistic->addTitleControl("btn_6month", "btn_6month", lang("6_month"), "",  "", array("panel-title-button"));
                //$pnl_statistic->addTitleControl("btn_12month", "btn_12month", lang("12_month"), "",  "", array("panel-title-button"));
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                /*
                $pnl->addTitleControl("btn_consumption_statistics", "btn_consumption_statistics", lang("btn_consumption_statistics"), "",  "", array("panel-title-button"));
                $pnl->addTitleControl("btn_storage_statistics", "btn_storage_statistics", lang("btn_storage_statistics"), "",  "", array("panel-title-button"));
                $pnl->addTitleControl("btn_lot_statistics", "btn_lot_statistics", lang("btn_lot_statistics"), "",  "", array("panel-title-button"));
                */
                break;
            case DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER:
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                break;

            case DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER_MATERIAL:
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                break;

            case DocumentGenerator::TYPE_SALES_STATISTIC_CUSTOMER_ALL_MATERIAL:
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                break;

            case DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT:
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                break;

            case DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT_MATERIAL:
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                break;

            case DocumentGenerator::TYPE_SALES_STATISTIC_COMPONENT_MATERIAL_CUSTOMER:
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                break;

            case DocumentGenerator::TYPE_ORDER_STATISTIC:
                $pnl_statistic->addTitleControlElement($start_html.$end_html);
                break;
        }
        $pnl_statistic->addTitleControlElement($kitpack_type_html);

        $statistic_options .= '<option id="'.$id.'" value="'.$id.'" '.$selected.' title="'.strip_tags(lang($name)).'">'.lang($name).'</option>';

        $selected = "";

        $pnl_statistic->setContent($tbl->generateHTML());
        $pnl_statistic->setCollapsed(false);
        $pnl_statistic->setVisible(E_VISIBLE::NO);
        $panels_statistics_html .= $pnl_statistic->generateHTML();

    }

    $statistic_div = '<div class="row">';
    $statistic_div .= '</div>';
}

$select_statistic = new HTML_Select("select_statistic", "select_statistic",$statistic_options);
$select_statistic_html = '<div class="input-group pull-left" style="width:200px; margin: 10px;">'.$select_statistic->generateHTML().'</div>';


$pnl = new HTML_Panel("pnl_mysets_statistic", "",$panels_statistics_html);
$pnl->setCollapsed(false);
$pnl->addTitleControlElement($select_statistic_html);
//$pnl->addTitleControl("btn_doc_type_pdf", "btn_doc_type_pdf", lang("PDF"), "",  "", array("panel-title-button"));
$pnl->addTitleControl("btn_doc_type_excel", "btn_doc_type_excel", lang("Excel"), "",  "", array("panel-title-button"));

?>
<div class="row">
    <ul id="tab-list" class="nav nav-tabs fadeInRight">
        <li tab="1" class="tab_header active">
            <a class="tab_links not_clickable" data-toggle="tab" pane="tab1" href="javascript:void(0)"><?php echo lang("my_sets_statistic"); ?></a>
        </li>
    </ul>

    <div id="tab-content" class="tab-content fadeInLeft">
        <div id="tab1" class="tab-pane fade active in" style="padding:0;">
            <div>
                <?php echo $pnl->generateHTML();?>
            </div>
        </div>
    </div>
</div>
<div class="col-xs-12">
	<?php echo $modal1->generateHTML(); ?>
    <?php echo $modal2->generateHTML(); ?>
</div>
<script>
	var tbl_columns_mysets_statistic = <?php echo json_encode($data["table_columns"]); ?>;
    var tbl_columns = <?php echo json_encode($data["table_columns"]); ?>;
	var documentGeneratorConstants = <?php echo json_encode($data["documentGeneratorConstants"]); ?>;
</script>