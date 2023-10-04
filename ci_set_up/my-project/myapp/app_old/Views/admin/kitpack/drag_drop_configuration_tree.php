<?php
	$kitpack =  new T_Kitpack($data["kitpack"]);
	//die("<pre>".print_r($data["permissions"],true)."</pre>");
	$available_packages = $data["available_packages"];
    //die("<pre>".print_r($available_packages,true)."</pre>");
	$addPackageListItems = T_Kitpack::addPackageListItems($available_packages);
	$componentDragDropGroupCopy = T_Kitpack::componentDragDropGroupCopy($available_packages,$data["permissions"]);
	
    $configurated_components_tree_result = T_Kitpack::components_tree_html($kitpack->components, $available_packages,$data["permissions"]);
    //die($configurated_components_tree_result->getData());
    $page_alerts = buildPageAlerts($configurated_components_tree_result->error, "", "", "");
    if ($configurated_components_tree_result->error == "")
    {
        $configurated_components_tree = $configurated_components_tree_result->getData();
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
    <input type="hidden" id="offer_mode" value="0"/>
	<div id="kitpack_drop_area" class="col-xs-12 drop_area" style="height:390px;overflow-x:hidden;overflow-y:auto;padding-bottom: 50px; margin-bottom:0.6em;">
		<!-- dropped items goes here -->
        <?php echo $configurated_components_tree; ?>
 	</div>
	<div class="col-xs-12">
		<div class="btn-group col-xs-12 nopadding">
			<button type="button" class="btn btn-default btn-block dropdown-toggle btn-lg nopadding" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="border:0;padding-top:10px !important;padding-bottom:10px !important;">
				<div class="grey" style="font-size:16px;font-weight:bold;"><?php echo E_ICONS::PLUS_CIRCLE; ?><br /><?php echo lang("btn_add_package"); ?></div>
				<div style="margin-top:5px;font-size:17px;"><?php echo lang("btn_nfo_may_contain_components"); ?></div>
			</button>
			<?php echo $addPackageListItems; ?>
		</div>
	</div>
	<?php echo $componentDragDropGroupCopy; ?>

