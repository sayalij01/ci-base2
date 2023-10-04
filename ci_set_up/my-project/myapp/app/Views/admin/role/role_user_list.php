<?php
$user_list = array();
foreach($data["users"] as $idx=>$user)
{

    $user_name = $user["displayString"];
	$user_id = $user["user_id"];
    $client_id = $user["client_id"];
    $checked = E_CHECKED::NO;
    if(array_key_exists($user_id,$data["assigned_users"]))
    {
        $checked = E_CHECKED::YES;
    }

    $cb_user = new HTML_Checkbox("cb_user_".$user_id,"user[]","",$checked, $user_id,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array(),array());
	$cb_user->addAttribute("client_id", $user["client_id"]);
    $user_list[] = "<li class=\"list-group-item user_item\"><div class='row'><div class='col-xs-9'>".$cb_user->generateHTML()."&nbsp;".trim($user_name)."</div><div class='col-xs-3'>".$user["customer_number"]."</div></li>";
}

?>

    <div class="input-group pull-right">
        <input id="user_search_term" type="text" class="form-control" placeholder="<?php echo lang("search")."..."; ?>" />
        <div class="input-group-btn">
            <button id="search_role_user_list" type="button" class="btn btn-primary" title="<?php echo lang("start_search_role_user");?>">
                <i class="fa fa-search"></i>
            </button>
            <button id="clear_role_user_list" type="button" class="btn btn-primary" title="<?php echo lang("clear_role_user_search");?>">
                <i class="fa fa-remove"></i>
            </button>
            <button id="add_all_role_user" type="button" class="btn btn-primary" title="<?php echo lang("add_all_user_to_role");?>">
                <i class="fa fa-plus"></i>
            </button>
            <button id="remove_all_role_user" type="button" class="btn btn-primary" title="<?php echo lang("remove_all_user_from_role");?>">
                <i class="fa fa-minus"></i>
            </button>
        </div>
    </div>

<div class ="row">
    <div id="scrollable_client_list" class="col-xs-12 nicescroll_container" style="height:30vh;overflow-y:hidden">
        <ul class="list-group checked-list-box">
            <?php echo implode("\n", $user_list); ?>
        </ul>
    </div>
</div>
