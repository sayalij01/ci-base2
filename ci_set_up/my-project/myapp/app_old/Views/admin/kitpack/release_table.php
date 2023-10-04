<?php
//die("<pre>".print_r($current_kitpack_data,true)."</pre>");

function renderRowsRecursivly($data,$available_packages,$language,&$count,&$flatten,$without_image)
{
    $i = 0;
    foreach ($data as $idx => $ds)
    {
        $display_name = "";
        if(intval($ds["is_package"]) == 1 && $ds["type"] == E_SET_COMPONENT_TYPE::STANDARD_PACKAGE)
        {
            $package = $available_packages[intval($ds["has_standard_package"])];
            //die("<pre>".print_r($package,true)."</pre>");
            if($package != null)
            {
                $image = file_get_contents(base_url("resources/".$package->image_path));
                if(strtolower($language) == "de")
                {
                    $display_name = $package->name_de;
                }
                else
                {
                    $display_name = $package->name_en;
                }
            }
        }

        $tmp = explode(".",$ds["nested_order"]);
        $add = "";
        $pad = "&nbsp;";
        $add = str_pad($add,(count($tmp)-1)*(strlen($pad)*3),$pad, STR_PAD_LEFT);
        $level = count($tmp);

        if($display_name != "")
        {
            if($without_image == 1)
            {
                $mat_name = $add.'<span class="containerText">'.$count.'</span>&nbsp;'.$display_name;
            }
            else
            {
                $mat_name = $add.'<span class="containerText">'.$count.'</span>&nbsp;&nbsp;'.$image.'&nbsp;'.$display_name;
            }
        }
        else
        {
            $image = dirname(__FILE__)."/../../../../resources/img/img_components/".$ds["material_number"].".jpg";
            if(file_exists($image))
            {
                $image = base_url("resources/img/img_components/".$ds["material_number"].".jpg");
                $img_short = $ds["material_number"];
            }
            else
            {
                $image = base_url("resources/img/app_icons/placeholder.jpg");
                $img_short = "";
            }
            $image = "<img src=\"".$image."\" style=\"width:24px;\">";

            $display_name = $ds["material_short_text"];
            if(strtolower(substr($ds["material_number"],0,3)) == "ind")
            {
                $display_name .= ", ".$ds["manufacturer"]. " ".$ds["manufacturer_product_number"];
                $display_name .= addDataFromProduct($ds,"product_category");
                $display_name .= addDataFromProduct($ds,"product_group");
                $display_name .= addDataFromProduct($ds,"subgroup");
                $display_name .= addDataFromProduct($ds,"brand");
                $display_name .= addDataFromProduct($ds,"size");
                $display_name .= addDataFromProduct($ds,"length");
                $display_name = trim($display_name);
            }
            if($without_image == 1)
            {
                $mat_name = $add.'<span class="containerText">'.$count.'</span>&nbsp;'.$display_name;
            }
            else
            {
                $mat_name = $add.'<span class="containerText">'.$count.'</span>&nbsp;&nbsp;'.$image.'&nbsp;'.$display_name;
            }
        }
        /*$service_fee = $_SESSION[E_SESSION_ITEM::CLIENT_SERVICE_FEE];
        $multiplier = (100+$service_fee)/100;*/
        //$price = ($ds["amount"]*$ds["unit_cost"])*$multiplier;
        $price = $ds["amount"]*$ds["unit_cost"];
        $price = format_currency($price,"EUR");
        $is_container = 0;
        if (array_key_exists("keys", $ds) && is_array($ds["keys"]) && count($ds["keys"]) > 0) {
            $is_container = 1;
        }
        if($i==0)
        {
            $row_id = "<a class=\"btn btn-xs btn-primary up\" style=\"\" href=\"javascript:void(0);\" index=\"".($count-1)."\" is_container=\"".$is_container."\" level=\"".$level."\" onclick=\"$.kitpack.moveItem($(this),'up');\"><i class=\"fa fa-arrow-up\"></i></a>
                       <a class=\"btn btn-xs btn-primary down\" href=\"javascript:void(0);\" index=\"".($count-1)."\" is_container=\"".$is_container."\" level=\"".$level."\" onclick=\"$.kitpack.moveItem($(this),'down');\"><i class=\"fa fa-arrow-down\"></i></a>";
        }
        else if($i==count($data)-1)
        {
            $row_id = "<a class=\"btn btn-xs btn-primary up\" href=\"javascript:void(0);\" index=\"".($count-1)."\" is_container=\"".$is_container."\" level=\"".$level."\" onclick=\"$.kitpack.moveItem($(this),'up');\"><i class=\"fa fa-arrow-up\"></i></a>
                       <a class=\"btn btn-xs btn-primary down\" style=\"\" href=\"javascript:void(0);\" index=\"".($count-1)."\" is_container=\"".$is_container."\" level=\"".$level."\" onclick=\"$.kitpack.moveItem($(this),'down');\"><i class=\"fa fa-arrow-down\"></i></a>";
        }
        else
        {
            $row_id = "<a class=\"btn btn-xs btn-primary up\" href=\"javascript:void(0);\" index=\"".($count-1)."\" is_container=\"".$is_container."\" level=\"".$level."\" onclick=\"$.kitpack.moveItem($(this),'up');\"><i class=\"fa fa-arrow-up\"></i></a>
                       <a class=\"btn btn-xs btn-primary down\" href=\"javascript:void(0);\" index=\"".($count-1)."\" is_container=\"".$is_container."\" level=\"".$level."\" onclick=\"$.kitpack.moveItem($(this),'down');\"><i class=\"fa fa-arrow-down\"></i></a>";
        }
        $row = array("level"=>$level,
                     "row_id"=>$row_id,
                     "material_name" => $mat_name,
                     "material_amount" => ($ds["type"] == "StandardPackage"?1:$ds["amount"]),
                     "material_unit" => lang("pieces"),
                     "material_price" => $price,
                     //"material_img" => "",
                     //"material_docs" => "",
                     "material_wrapping_cloth" => ($ds["wrapping_cloth"] == 1 ? lang("yes") : lang("no")),
                     "material_editor_comment" => $ds["editor_comment"]);
        $flatten[] = $row;
        $count++;
        if (array_key_exists("keys", $ds) && is_array($ds["keys"]) && count($ds["keys"]) > 0) {
            renderRowsRecursivly($ds["keys"],$available_packages,$language,$count, $flatten,$without_image);
        }
        $i++;
    }
}

function addDataFromProduct($ds,$field)
{
    if($ds[$field] != null && $ds[$field] != "")
    {
        return ", ".$ds[$field];
    }
    else
    {
        return "";
    }
}

$columns = array(
    new HTML_DTColumn("level","",E_SORTABLE::NO,E_VISIBLE::NO,E_SEARCHABLE::NO,null,array(),array("col_level"),array()),
    new HTML_DTColumn("row_id","",E_SORTABLE::NO,E_VISIBLE::YES,E_SEARCHABLE::NO,null,array(),array("col_row_id"),array()),
    new HTML_DTColumn("material_name",lang("name"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array("col_name"),array()),
    new HTML_DTColumn("material_amount",lang("amount"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    new HTML_DTColumn("material_unit",lang("material_unit"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    new HTML_DTColumn("material_price",lang("kitpack_price"),E_SORTABLE::YES,($show_prices==1?E_VISIBLE::YES:E_VISIBLE::NO),E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    //new HTML_DTColumn("material_img",lang("pictures"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array(),array()),
    //new HTML_DTColumn("material_docs",lang("data"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array(),array()),
    new HTML_DTColumn("material_wrapping_cloth",lang("wrapping_cloth"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    new HTML_DTColumn("material_editor_comment",lang("comment"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array(),array())
);

$flatten = array();
$count = 1;
renderRowsRecursivly($current_kitpack_data["components"],$available_packages,$language,$count,$flatten,$without_image);
//die("<pre>".print_r($flatten,true)."</pre>");
$dt = new HTML_Datatable("release_table",$columns,$flatten,null,E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array());

echo $dt->generateHTML();
?>
<table id="copy_temp_table" style="display:none;" />
