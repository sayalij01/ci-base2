<?php
    //echo "<pre>".print_r($data,true)."</pre>";
    $configurated_components_tree_result = "";
    if(count($data["kitpack"]["kitpacks"])==0)
    {
        $data["kitpack"]["kitpacks"][0] = array();
    }
	foreach($data["kitpack"]["kitpacks"] as $idx=>$kp)
    {
        //$kitpack =  new T_Kitpack($data["kitpack"]);
        $kitpack =  new T_Kitpack($kp);
		$label_head = "";
		if (!is_null($kitpack->kpm_status) && array_key_exists($kitpack->kpm_status, $data["kpm_status"])){
			$label_head .= lang("offer_status").": ".$data["kpm_status"][$kitpack->kpm_status]["label"];
		}

		if (!is_null($kitpack->owner_id))
		{
			foreach ($data["all_users_owner"] as $user){
				if ($user["user_id"] == $kitpack->owner_id)
				{
					if ($label_head != "")
					{
						$label_head .= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					$label_head .= lang("offer_owner").": ".$user["displayString"];
				}
			}
		}
		$label_head = "<div class='text-primary'>".$label_head."</div>";

		$available_packages = $data["available_packages"];
        $available_transport_packages = $data["available_transport_packages"];
        $addPackageListItems = T_Kitpack::addPackageListItems($available_packages,true);
        $componentDragDropGroupCopy = T_Kitpack::componentDragDropGroupCopy($available_packages,$data["permissions"],true);

        $configurated_components_tree_result = T_Kitpack::components_tree_html($kp,$kitpack->components, $available_packages,$available_transport_packages,$data["permissions"],true);
        //die($configurated_components_tree_result->getData());
        $page_alerts = buildPageAlerts($configurated_components_tree_result->error, "", "", "");
        if ($configurated_components_tree_result->error == "")
        {
            $options = [
                "price_label" => "price_label",
                "component_product_category" => "product_category",
                "component_wueStat" => "component_wueStat",
                "component_manufacturer_product_number" => "manufacturer_nr",
                "component_can_be_container" => "component_can_be_container",
                "component_use_in_pediatrics" => "component_use_in_pediatrics",
                "component_contains_latex" => "component_contains_latex",
                "component_inventar" => "component_inventar",
                "component_op_bekleidung" => "component_op_bekleidung",
                "component_set_einschlag" => "component_set_einschlag",
                "component_unterverpackung" => "component_unterverpackung",
                "component_verbrauch" => "component_verbrauch",
                "component_currently_not_deliverable" => "component_currently_not_deliverable",
                "component_select" => "component_select",
                "component_erlaubte_sterilisationsverfahren" => "component_erlaubte_sterilisationsverfahren",
            ];
            $optionsList = '';
            foreach ($options as $value => $label) {
                $optionsList .= '<li style="padding:0;">
                                    <input type="checkbox" style="width:18px;height:18px;" checked id="' . $value . '" name="' . $value . '" value="' . $value . '">
                                    <label style="font-weight:normal;font-size:12px;" for="' . $value . '">' . lang($label) . '</label>
                                </li>';
            }
            //die("<pre>".print_r($configurated_components_tree_result,true)."</pre>");
            $optsel = " <div class=\"dropdown-offer\" style=\"display:inline-block;width:14px;height:14px;\">
                           <a class=\"dropdown-menu-offer-toggle\" href=\"javascript:void(0);\">
                               <i class=\"fa fa-bars\"> </i>
                           </a>
                          <ul class=\"dropdown-menu-offer\">" .
                            $optionsList
                            . "
                          </ul>
                        </div>";
            $addPkg = "<div class=\"dropdown-packages\"  style=\"display:inline-block;width:14px;height:14px;padding-top:2px;\">
                            <div class=\"btn-group col-xs-12 nopadding\">
                                <!--<button type=\"button\" class=\"btn btn-default btn-block dropdown-toggle btn-lg nopadding\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" style=\"border:0;padding-top:10px !important;padding-bottom:10px !important;\">
                                    <div class=\"grey\" style=\"font-size:16px;font-weight:bold;\">" . E_ICONS::PLUS_CIRCLE . "<br />" . lang("btn_add_package") . "</div>
                                    <div style=\"margin-top:5px;font-size:17px;\">" . lang("btn_nfo_may_contain_components") . "</div>
                                </button>-->
                                <a class=\"dropdown-packages-menu-toggle\" href=\"javascript:void(0);\">
                                    <i class=\"fa fa-archive\"> </i>
                                </a>
                                <ul class=\"dropdown-packages-menu\" style=\"display:none;background-color:white;border:1px solid #4CAF50;\">
                                 " . $addPackageListItems . "
                                 </ul>
                            </div>
                        </div>";
                        //by sayali
            $optimport = " <div  class=\"import-offer\" style=\"display:inline-block;width:14px;height:14px;\">
                            <a id=\"btn_excel_import\" class=\"export\" href=\"javascript:void(0);\"><i class=\"fa fa-file-excel-o\"> </i></a>
                        </div>";

            $tpp = "<div class=\"transport_packages col-xs-12\">".$configurated_components_tree_result->extra["transport_packages"]."</div>";
            $tblHdr = "<table class=\"\" style=\"table-layout: fixed;\">
            <tr>
               <td style=\"width: 729px\"></td>
               <td class=\"table-head-component price_label header_padding\" \"><label class=\"truncateText\" for=\"price_label\">" . lang("price_label") . "</label></td>
               <td class=\"table-head-component component_product_category_style header_padding\"><label class=\"truncateText\" for=\"component_product_category\">" . lang("product_category") . "</label></td>
               <td class=\"table-head-component component_wueStat header_padding\"><label class=\"truncateText\" for=\"component_wueStat\">" . lang("component_wueStat") . "</label></td>
               <td class=\"table-head-component component_manufacturer_product_number header_padding\"><label class=\"truncateText\" for=\"component_manufacturer_product_number\">" . lang("manufacturer_product_number") . "</label></td>
               <td class=\"table-head-component component_can_be_container header_padding\"><label class=\"truncateText\" for=\"component_can_be_container\">" . lang("component_can_be_container") . "</label></td>
               <td class=\"table-head-component component_use_in_pediatrics header_padding\"><label class=\"truncateText\" for=\"component_use_in_pediatrics\">" . lang("component_use_in_pediatrics") . "</label></td>
               <td class=\"table-head-component component_contains_latex header_padding\"><label class=\"truncateText\" for=\"component_contains_latex\">" . lang("component_contains_latex") . "</label></td>
               <td class=\"table-head-component component_inventar header_padding\"><label class=\"truncateText\" for=\"component_inventar\">" . lang("component_inventar") . "</label></td>
               <td class=\"table-head-component component_op_bekleidung header_padding\"><label class=\"truncateText\" for=\"component_op_bekleidung\">" . lang("component_op_bekleidung") . "</label></td>
               <td class=\"table-head-component component_set_einschlag header_padding\"><label class=\"truncateText\" for=\"component_set_einschlag\">" . lang("component_set_einschlag") . "</label></td>
               <td class=\"table-head-component component_unterverpackung header_padding\"><label class=\"truncateText\" for=\"component_unterverpackung\">" . lang("component_unterverpackung") . "</label></td>
               <td class=\"table-head-component component_verbrauch header_padding\"><label class=\"truncateText\" for=\"component_verbrauch\">" . lang("component_verbrauch") . "</label></td>
               <td class=\"table-head-component component_currently_not_deliverable header_padding\"><label class=\"truncateText\" for=\"component_currently_not_deliverable\">" . lang("component_currently_not_deliverable") . "</label></td>
               <td class=\"table-head-component component_select header_padding\"><label class=\"truncateText\" for=\"component_select\">" . lang("component_select") . "</label></td>
               <td class=\"table-head-component component_erlaubte_sterilisationsverfahren header_padding\"><label class=\"truncateText\" for=\"component_erlaubte_sterilisationsverfahren\">" . lang("component_erlaubte_sterilisationsverfahren") . "</label></td>
            </tr>
        </table>";
            $panel = new HTML_Panel("pnl_kitpack_components_".$idx,$kitpack->kitpack_name,"","",E_DISMISSABLE::NO,E_VISIBLE::YES,E_COLOR::PRIMARY,E_COLOR::PRIMARY,array("width"=>"3500px;"),array("kitpack_component_panel"),array("idx"=>$idx,"data-parent"=>"#accordion"));
            $panel->setContent("$label_head<div>".$optsel."&nbsp;&nbsp;".$addPkg."&nbsp;&nbsp;".$optimport."</div>".$tblHdr.$tpp."<div id=\"kitpack_drop_area\" class=\"col-xs-12 drop_area kitpack_drop_area\" index=\"" . $idx . "\" style=\"overflow:auto;padding-bottom: 50px; margin-bottom:0.6em;\">

             

            " .
                $configurated_components_tree_result->getData() .
                "</div>
                <div class=\"kitpack_additionals col-xs-12\">
               
                </div>
                <input type=\"hidden\" id=\"kitpack_id_" . $idx . "\" class=\"kitpack_id\" idx=\"" . $idx . "\" value=\"" . $kitpack->kitpack_id . "\" />
                <input type=\"hidden\" id=\"component_volume_" . $idx . "\" class=\"component_volume\" idx=\"" . $idx . "\" value=\"0\" />");
            $panel->setCollapseable(true);
            if($idx==0)
            {
                $panel->setCollapsed(false);
            }
            else
            {
                $panel->setCollapsed(true);
            }
            $configurated_components_tree .= $panel->generateHTML();
            //$configurated_components_tree .= $configurated_components_tree_result->getData();

        }
    }

//die("<pre>".print_r($configurated_components_tree,true)."</pre>");
    echo $page_alerts;

    /*
     * Cleanup HTML by removing obsolete divs
     */
    /*if(is_array($kitpack->components) && count($kitpack->components)>0)
    {
        $remove = true;
        while($remove)
        {
            if(substr($configurated_components_tree,-6,6) == "</div>")
            {
                $configurated_components_tree = substr($configurated_components_tree,0,-6);
            }
            else
            {
                $remove = false;
            }
        }
        $configurated_components_tree .= "</div>";
    }*/
?>

    <input type="hidden" id="show_price_setconfig" value="<?php echo $data["permissions"]["show_price_setconfig"] == 1?1:0; ?>"/>
    <input type="hidden" id="show_matno_setconfig" value="<?php echo $data["permissions"]["show_matno_setconfig"] == 1?1:0; ?>"/>
    <input type="hidden" id="offer_mode" value="1"/>
    <?php echo $configurated_components_tree; ?>
	<?php echo $componentDragDropGroupCopy; ?>

