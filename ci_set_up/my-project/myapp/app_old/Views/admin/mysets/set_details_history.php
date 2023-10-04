<?php 

$current_kitpack_components = $data["current_kitpack_data"]["components"];
$previous_kitpack_components = $data["latest_kitpack_history_data"]["components"];
$show_price = $data["show_price"];
$available_packages = $data["available_packages"];
$lang = $data["language"];
if($show_price)
{
    $display_price = "";
}
else
{
    $display_price = " display:none;";
}

$header = "<dir class=\"row\">
                <div class=\"col-xs-12\">
                    <span class=\"compare_kitpack_header\">
                    ".$data["current_kitpack_data"]["head"]["kp_sap_materialnummer"].":&nbsp;".$data["current_kitpack_data"]["head"]["kitpack_name"]."
                    </span>
                </div>
           </div>";

$history_date = date(lang("date_format"),$data["latest_kitpack_history_data"]["head"]["created_at"]);

//$left = "<pre>".print_r($previous_kitpack_components,true)."</pre>";
$left = "";
//$right = "<pre>".print_r($data["current_kitpack_data"],true)."</pre>";
$right = "";

$i = 1;
foreach($previous_kitpack_components as $idx=>$component)
{
    if($component["is_package"])
    {
        $left .= renderPackageWithContentRecursivly($component,$available_packages,$lang,$i,$show_price);
    }
    else
    {
        $left .= renderItem($component,$i,$show_price);        
    }
}

$i = 1;
foreach($current_kitpack_components as $idx=>$component)
{
    if($component["is_package"])
    {
        $right .= renderPackageWithContentRecursivly($component,$available_packages,$lang,$i,$show_price);
    }
    else
    {
        $right .= renderItem($component,$i,$show_price);
    }
}

function renderPackageWithContentRecursivly($component,$available_packages,$lang,&$i, $show_price)
{
    if($component["type"] == E_SET_COMPONENT_TYPE::PACKAGE_COMPONENT)
    {
        $image = dirname(__FILE__)."/../../../../resources/img/img_components/".$component["material_number"].".jpg";
        if(file_exists($image))
        {
            $image = base_url("resources/img/img_components/".$component["material_number"].".jpg");
            $img_short = $component["material_number"];
        }
        else
        {
            $image = base_url("resources/img/app_icons/placeholder.jpg");
            $img_short = "";
        }
        $image = "<img src=\"".$image."\" style=\"width:24px;\" class=\"highslide\">";
        $display_name = $component["material_number"]."&nbsp;". $component["material_short_text"];
    }
    else
    {
        $package = $available_packages[$component["has_standard_package"]];
        if($package != null)
        {
            $image = file_get_contents(base_url("resources/".$package->image_path));
            if(strtolower($lang) == "de")
            {
                $display_name = $package->name_de;
            }
            else
            {
                $display_name = $package->name_en;
            }
        }
        else
        {
            $image = file_get_contents(base_url("resources/img/packaging/faltschachtel.svg"));
            $display_name = lang("abstract_package");
        }
    }

    $html = "<div style=\"border:1px solid #000000;text_align:center;padding:5px;\">
                <legend class=\"text-primary\">
                    &nbsp;&nbsp;".$image."&nbsp;&nbsp;".$display_name."
              </legend>";
    $i++;
    foreach($component["keys"] as $idx=>$cmp)
    {
        if($cmp["is_package"])
        {
            $html .= renderPackageWithContentRecursivly($cmp,$available_packages,$lang,$i,$show_price);
        }
        else
        {
            $html .= renderItem($cmp,$i,$show_price);
        }
    }
    //$html .= "</fieldset>";
    $html .= "</div>";
    return $html;
}

function renderItem($item,&$i,$show_price)
{
    $button_details = '<a href="#" onclick="$.components.show(\''.$item['component_id'].'\')" class="dtbt_show btn btn-xs btn-default"><i class="fa fa-eye" title="'.lang("view").'"></i>'.$label_show.'</a>&nbsp;';
    $link = base_url("resources/img/img_components/".$item["material_number"].".jpg");
    $image = "<a href=\"".$link."\" class=\"highslide\" onclick=\"return hs.expand(this)\">".$item["material_image"]."</a>";
    if($show_price)
    {
        $html = "<div class=\"component-detail-box text-primary\">
                    <div class=\"row no-margin no-padding\">
                        <a class=\"col-xs-2 bg-primary details-component-sort-box\" href=\"#\" ondblclick=\"$.components.show('".$item['component_id']."')\">
                            <i class=\"fa fa-ellipsis-v\"></i>
                            <div class=\"counter\">&nbsp;&nbsp;".$i."</div>
                        </a>
                        <div class=\"col-xs-7\" style=\"color: initial;\">
                             <div style=\"overflow:hidden;text-overflow: ellipsis;width:280px;white-space: nowrap;\">".$button_details.$image."&nbsp;".$item["material_number"]."&nbsp;".($item["material_short_text"])."</div>
                        </div>
                        <div class=\"col-xs-2\" style=\"color: initial;\">
                            ".format_currency($item["price"], "EUR")."
                        </div>
                        <div class=\"col-xs-1\" style=\"color: initial;\">
                            <span class=\"badge badge-light\">".$item["amount"]."</span>
                        </div>
                    </div>
                 </div>";
    }
    else
    {
        $html = "<div class=\"component-detail-box text-primary\">
                    <div class=\"row no-margin no-padding\">
                        <a class=\"col-xs-2 bg-primary details-component-sort-box\" href=\"#\" ondblclick=\"$.components.show('".$item['component_id']."')\">
                            <i class=\"fa fa-ellipsis-v\"></i>
                            <div class=\"counter\">&nbsp;&nbsp;".$i."</div>
                        </a>
                        <div class=\"col-xs-9\" style=\"color: initial;\">
                            <div style=\"overflow:hidden;text-overflow: ellipsis;width:335px;white-space: nowrap;\">".$button_details.$image."&nbsp;".$item["material_number"]."&nbsp;".($item["material_short_text"])."</div>
                        </div>
                        <div class=\"col-xs-1\" style=\"color: initial;\">
                            <span class=\"badge badge-light\">".$item["amount"]."</span>
                        </div>
                    </div>
                 </div>";
    }
    $i++;
    return $html;
}

?>
<?php echo $header; ?>
<div class="row">
	<div class="col-xs-6">
		<table class="table set_contents" style="width:100%; border: 1px solid #ddd; height:490px; max-height:490px; overflow-y:scroll;">
			<thead style="background-color: #DCDCDC;">
    			<tr>
    				<th colspan="<?php echo ($show_price?4:3); ?>"><?php echo lang("historized_kitpack").":&nbsp;".$history_date; ?></th>
    			</tr>
    			<tr>
    				<th><?php echo lang("kitpack_order"); ?></th>
    				<th><?php echo lang("kitpack_comp_mat_no"); ?>/<?php echo lang("kitpack_comp_name"); ?></th>
    				<?php if($show_price) { ?>
    				<th><?php echo lang("kitpack_comp_price"); ?></th>
    				<?php } ?>
    				<th><?php echo lang("kitpack_comp_amount"); ?></th>
    			</tr>
			</thead>
			<tbody style="background: white;">
    			<tr>
    				<td colspan="<?php echo ($show_price?4:3); ?>">
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="set_components_details">
                                    <?php echo $left; ?>
                                </div>
                            </div>
                        </div>
                    </td>
    			</tr>
			</tbody>
		</table>
	</div>
	<div class="col-xs-6">
		<table class="table set_contents" style="width:100%; border: 1px solid #ddd; height:490px; max-height:490px; overflow-y:scroll;">
			<thead style="background-color: #DCDCDC;">
    			<tr>
    				<th colspan="<?php echo ($show_price?4:3); ?>"><?php echo lang("current_kitpack"); ?></th>
    			</tr>
    			<tr>
    				<th><?php echo lang("kitpack_order"); ?></th>
    				<th><?php echo lang("kitpack_comp_mat_no"); ?>/<?php echo lang("kitpack_comp_name"); ?></th>
    				<?php if($show_price) { ?>
    				<th><?php echo lang("kitpack_comp_price"); ?></th>
    				<?php } ?>
    				<th><?php echo lang("kitpack_comp_amount"); ?></th>
    			</tr>
			</thead>
			<tbody style="background: white;">
    			<tr>
    				<td colspan="<?php echo ($show_price?4:3); ?>">
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="set_components_details">
                                    <?php echo $right; ?>
                                </div>
                            </div>
                        </div>
                    </td>
    			</tr>
			</tbody>
		</table>
	</div>
</div>