<?php
$role_list = array();
//die("<pre>".print_r($data["user_roles"],true)."</pre>");
foreach($data["available_roles"] as $idx=>$role)
{
    $role_name = $role->role_name;
    if ($role->is_static)
    {
        $role_name = lang( $role->role_name )."&nbsp;(&nbsp;".E_ICONS::IS_STATIC." ".lang("protected")."&nbsp;)";
    }

    $role_id = $role->role_id;
    $checked = E_CHECKED::NO;
	if(in_array($role_id,$data["assigned_roles"]))
	{
		$checked = E_CHECKED::YES;
	}

    $cb_role = new HTML_Checkbox("cb_role_".$role_id,"roles_list_item[]","",$checked,$role_id,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array(),array());

    $role_list[] = "<li class=\"list-group-item role_item\">".$cb_role->generateHTML()."&nbsp;".trim($role_name)."</li>";
}

?>

    <div class="input-group pull-right">
        <input id="role_search_term" type="text" class="form-control" placeholder="<?php echo lang("search")."..."; ?>" />
         <div class="input-group-btn">
            <button id="search_role_list" type="button" class="btn btn-default">
                <i class="fa fa-search"></i>
            </button>
            <button id="clear_role_list" type="button" class="btn btn-default">
                <i class="fa fa-remove"></i>
            </button>
        </div>
    </div>

<div class ="row">
    <div id="scrollable_role_list" class="col-xs-12 nicescroll_container" style="height:30vh;overflow-y:hidden;">
        <ul class="list-group checked-list-box">
            <?php echo implode("\n", $role_list); ?>
        </ul>
    </div>
</div>
