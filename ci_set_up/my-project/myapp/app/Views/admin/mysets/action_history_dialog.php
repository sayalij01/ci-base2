<?php
$lang = $data["language"];
if (!isset($history_data))
{
    $history_data = $data["history_data"];
}
$history_data = $history_data->getData();
if (!isset($involded_components))
{
    $involded_components = $data["involded_components"];
}
$packages = array(1=>lang("folding_box"),3=>lang("paper_bag"));
//echo "<pre>".print_r($data["history_data"],true)."</pre>";
//echo "<pre>".print_r($data["involded_components"],true)."</pre>";
if($history_data != null && is_array($history_data) && count($history_data)>0)
{
    for($i=0;$i<count($history_data);$i++)
    {
        //echo renderHistory($history_data[$i]["changes"],strtotime($history_data[$i]["changed_at"]),$involded_components,$packages);
		echo T_Kitpack::renderHistory($history_data[$i]["changes"],strtotime($history_data[$i]["changed_at"]),$involded_components,$packages);
        echo "<br /><br />";
    }
}
else
{
    $message = lang("no_history_data");
    $html = "<label class=\"no_history_data\">".$message."</label>";
}

/*
function renderHistory($changes,$timestamp,$components,$packages)
{
    $html = "<b>".date("d.m.Y H:i:s",$timestamp).":</b><ol>";
    foreach($changes as $idx=>$change)
    {
        switch($change["change_type"])
        {
            case E_CHANGE_TYPES::CHANGE_KITPACK_PARAMS:
            case E_CHANGE_TYPES::COMPONENT_AMOUNT_CHANGED:
            case E_CHANGE_TYPES::COMPONENT_WRAPPING_CLOTH_CHANGED:
            case E_CHANGE_TYPES::COMPONENT_COMMENT_CHANGED:
                if($change["change_item"] != "" && $change["change_to_item"] != "")
                {
                    $itemFrom = json_decode($change["change_item"],true);
                    $itemTo = json_decode($change["change_to_item"],true);
                    $key = array_key_first($itemFrom);
                    $html .= "<li>".makeUserName($change,true)." ".lang($key).": \"".$itemFrom[$key]."\" ".lang("to")." \"".$itemTo[$key]."\" ".lang("changed")."</li>";
                }
                break;
            case E_CHANGE_TYPES::CHANGED_OPERATIONS:
                $html .= "<li>".makeUserName($change,true)." ".lang("operations_had_been_changed")."</li>";
                break;
            case E_CHANGE_TYPES::CHANGED_TECH_DISPLINES:
                $html .= "<li>".makeUsername($change,true)." ".lang("tech_disciplines_had_been_changed")."</li>";
                break;
            case E_CHANGE_TYPES::CHANGED_ANNUAL_PLANNING:
                $itemFrom = json_decode($change["change_item"],true);
                $itemTo = json_decode($change["change_to_item"],true);
                $key = array_key_first($itemFrom);
                if($key == "annual_requirement")
                {
                    $html .= "<li>".makeUserName($change,true)." ".lang($key).": \"".$itemFrom[$key]."\" ".lang("to")." \"".$itemTo[$key]."\" ".lang("changed")."</li>";
                }
                break;
            case E_CHANGE_TYPES::MOVE_COMPONENT:
                if(count($changes)>=($idx+1) && $changes[($idx+1)]["change_type"] == E_CHANGE_TYPES::ADD_COMPONENT)
                {
                    continue;
                }
                $component_id = $change["change_item"];
                $html .= "<li>".makeUserName($change,true).":<br />".lang("component_mat_no")." ".$components[$component_id]["material_number"]."<br />".$components[$component_id]["material_short_text"]."<br />".lang("moved_to")." ".($change["to_list_index"]+1)."</li>";
                break;
            case E_CHANGE_TYPES::ADD_COMPONENT:
                $component_id = $change["change_item"];
                if($component_id != "")
                {
                    if(strpos($component_id,"package_") !== false)
                    {
                        $component_id = str_replace("package_","",$component_id);
                    }
                    if(in_array(intval($component_id),array(1,3)))
                    {
                        $html .= "<li>".makeUserName($change,true).":<br />".$packages[intval($component_id)]."<br />".lang("remove_from_line")." ".($change["to_list_index"]+1)."</li>";
                    }
                    else
                    {
                        $html .= "<li>".makeUserName($change,true).":<br />".lang("component_mat_no")." ".$components[$component_id]["material_number"]."<br />".$components[$component_id]["material_short_text"]."<br />".lang("add_to_line")." ".($change["to_list_index"]+1)."</li>";
                    }
                }
                break;
            case E_CHANGE_TYPES::REMOVE_COMPONENT:
                $component_id = $change["change_item"];
                if($component_id != "")
                {
                    if(strpos($component_id,"package_") !== false)
                    {
                        $component_id = str_replace("package_","",$component_id);
                    }
                    if(in_array(intval($component_id),array(1,3)))
                    {
                        $html .= "<li>".makeUserName($change,true).":<br />".$packages[intval($component_id)]."<br />".lang("remove_from_line")." ".($change["to_list_index"]+1)."</li>";
                    }
                    else
                    {
                        $html .= "<li>".makeUserName($change,true).":<br />".lang("component_mat_no")." ".$components[$component_id]["material_number"]."<br />".$components[$component_id]["material_short_text"]."<br />".lang("remove_from_line")." ".($change["to_list_index"]+1)."</li>";
                    }
                }
                break;
        }
    }
    $html .= "</ol>";
    return $html;
}


function makeUserName($change,$withUsername)
{
    if(trim($change["changed_by_task"]) != "")
    {
        $name = trim($change["changed_by_task"]);
    }
    else
    {
        $name = "";
        if($withUsername)
        {
            $name = "(".$change["username"].") - ";
        }
        $name .= trim($change["firstname"]." ".$change["lastname"]);
    }
    return $name." - ";
}
*/
?>
<div class="row">
    <div class="col-xs-12"><?php echo $html;?></div>
</div>
