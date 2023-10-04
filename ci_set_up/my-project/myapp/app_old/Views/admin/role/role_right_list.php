<?php
$role_rights = array();
if (isset($data["role_rights"]) && is_array($data["role_rights"]))
{
    foreach ($data["role_rights"] as $key => $right_id) {
        $role_rights[$right_id] = $right_id;
    }

	foreach($data["available_rights"] as $right)
	{

		$right_name = $right->right_name;
		$right_id = $right->right_id;
		$checked = E_CHECKED::NO;
		if(in_array($right_id,$data["role_rights"]))
		{
			$checked = E_CHECKED::YES;
		}

		$cb_right = new HTML_Checkbox("cb_".$right_id,"right[]", "",$checked, $right_id,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array(),array());

		$color = "";
        if ($right->color != "")
		{
			$color = "data-color=\"#ffd39b\"";
        }
        $right_list[] = "<li class=\"list-group-item right_item\" ".$color."><div class='row'><div class='col-xs-9'>".$cb_right->generateHTML()."&nbsp;".trim(lang($right_name))."</div><div class='col-xs-3'>".$right->group_token."</div></li>";
	}
}



?>

    <div class="input-group pull-right">
        <input id="right_search_term" type="text" class="form-control" placeholder="<?php echo lang("search")."..."; ?>" />
        <div class="input-group-btn">
            <button id="search_role_right_list" type="button" class="btn btn-primary" title="<?php echo lang("start_search_role_right");?>">
                <i class="fa fa-search"></i>
            </button>
            <button id="clear_role_right_list" type="button" class="btn btn-primary" title="<?php echo lang("clear_role_right_search");?>">
                <i class="fa fa-remove"></i>
            </button>
            <button id="add_all_role_rights" type="button" class="btn btn-primary" title="<?php echo lang("add_all_right_to_role");?>">
                <i class="fa fa-plus"></i>
            </button>
            <button id="remove_all_role_rights" type="button" class="btn btn-primary" title="<?php echo lang("remove_all_right_from_role");?>">
                <i class="fa fa-minus"></i>
            </button>
        </div>
    </div>

<div class ="row">
    <div id="scrollable_right_list" class="col-xs-12 nicescroll_container" style="height:30vh;overflow-y:hidden">
        <ul class="list-group checked-list-box">
            <?php echo implode("\n", $right_list); ?>
        </ul>
    </div>
</div>
