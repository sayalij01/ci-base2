<?php
$kitpack_id = $data["kitpack_id"];
$lang = $data["language"];
$history_data = $data["history_data"]->getData();
$packages = array(1=>lang("folding_box"),3=>lang("paper_bag"));
// echo "<pre/>";print_r($data["history_data"]);die;


?>

<div class="row">
    <a type="button" style="margin-top:30px;" href="<?=base_url("admin/offer/edit/".$kitpack_id)?>" class="btn btn-success"><i class="fa fa-chevron-circle-left" style="font-size:24px"></i> &nbsp;<?=lang("back")?></a>
</div>

<table class="table " style="width:100%">
  <thead>
    <tr>
        <th scope="col">Date</th>
        <th scope="col">Changed by</th>
        <th scope="col">Position</th>
        <th scope="col">Changes</th>
    </tr>
  </thead>
  <tbody>
    <?php 
    if($history_data != null && is_array($history_data) && count($history_data)>0){
        for($i=0;$i<count($history_data);$i++)
    {
        ?>
    <tr>
        <td><?=date("d.m.Y H:i:s",strtotime($history_data[$i]["changed_at"]))?></td>
        <td><i class="fa fa-user" style="font-size:24px" aria-hidden="true"></i>&nbsp;<?=makeUserName($history_data[$i]["changes"],true)?></td>
        <td><?=getPosition($history_data[$i]["changes"])?></td>
        <td style=" width: 40%;"><?=renderHistory($history_data[$i]["changes"],strtotime($history_data[$i]["changed_at"]),$data["involded_components"],$packages);?></td>
    </tr>
    <?php } 
    }?>
  </tbody>
</table>
<?php
function renderHistory($changes,$timestamp,$components,$packages)
{
    $html = "";
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
                    $html .= lang($key).": \"".$itemFrom[$key]."\" ".lang("to")." \"".$itemTo[$key]."\" ".lang("changed");
                }
                break;
            case E_CHANGE_TYPES::CHANGED_OPERATIONS:
                $html .= lang("operations_had_been_changed");
                break;
            case E_CHANGE_TYPES::CHANGED_TECH_DISPLINES:
                $html .= lang("tech_disciplines_had_been_changed");
                break;
            case E_CHANGE_TYPES::CHANGED_ANNUAL_PLANNING:
                $itemFrom = json_decode($change["change_item"],true);
                $itemTo = json_decode($change["change_to_item"],true);
                $key = array_key_first($itemFrom);
                if($key == "annual_requirement")
                {
                    $html .= lang($key).": \"".$itemFrom[$key]."\" ".lang("to")." \"".$itemTo[$key]."\" ".lang("changed");
                }
                break;
            case E_CHANGE_TYPES::MOVE_COMPONENT:
                if(count($changes)>=($idx+1) && $changes[($idx+1)]["change_type"] == E_CHANGE_TYPES::ADD_COMPONENT)
                {
                    continue;
                }
                $component_id = $change["change_item"];
                $html .= lang("component_mat_no")." ".$components[$component_id]["material_number"]."<br />".$components[$component_id]["material_short_text"]."<br />".lang("moved_to")." ".($change["to_list_index"]+1);
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
                        $html .= $packages[intval($component_id)]."<br />".lang("remove_from_line")." ".($change["to_list_index"]+1);
                    }
                    else
                    {
                        $html .= lang("component_mat_no")." ".$components[$component_id]["material_number"]."<br />".$components[$component_id]["material_short_text"]."<br />".lang("add_to_line")." ".($change["to_list_index"]+1);
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
                        $html .= $packages[intval($component_id)]."<br />".lang("remove_from_line")." ".($change["to_list_index"]+1);
                    }
                    else
                    {
                        $html .= lang("component_mat_no")." ".$components[$component_id]["material_number"]."<br />".$components[$component_id]["material_short_text"]."<br />".lang("remove_from_line")." ".($change["to_list_index"]+1);
                    }
                }
                break;
        }
    }
    // $html .= "</ol>";
    return $html;
}

function makeUserName($changes,$withUsername)
{
    foreach($changes as $idx=>$change)
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
        return $name;
    }
}

function getPosition($changes)
{
    foreach($changes as $idx=>$change)
    {
        if(($change["user_id"]) == 0){
            $position = "L&R employees";
        }else if((($change["user_id"]) != 0 )&& (($change["is_adm"]) == 1)){
            $position = "External sales person";
        }else if((($change["user_id"]) != 0 )&& (($change["is_executive"]) == 1)){
            $position = "Decision maker";
        }
       
        return $position;
    }
}
?>
