<?php
$userlist = array();
foreach($data["all_active_users"] as $idx=>$user)
{
    $user_id = $user["user_id"];
    $checked = E_CHECKED::NO;
    if(in_array($user_id,$data["assigned_users"]))
    {
        $checked = E_CHECKED::YES;
    }

    $cb_user = new HTML_Checkbox("cb_user_".$user_id,"user_list_item[]","",$checked,$user_id,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array(),array());

    $userlist[] = "<li class=\"list-group-item user_item\">".$cb_user->generateHTML()."&nbsp;".trim($user["username"]." (".$user["firstname"]." ".$user["lastname"]).")</li>";
}

?>
<form class="form-inline">
    <div class="input-group pull-right">
        <input id="user_search_term" type="text" class="form-control" placeholder="<?php echo lang("search")."..."; ?>" />
        <div class="input-group-btn">
            <button id="search_user_list" type="button" class="btn btn-default">
                <i class="fa fa-search"></i>
            </button>
            <button id="clear_user_list" type="button" class="btn btn-default">
                <i class="fa fa-remove"></i>
            </button>
        </div>
    </div>
</form>
<div class ="row">
    <div id="scrollable_user_list" class="col-xs-12" style="height:50vh;overflow-y:hidden;">
        <ul class="list-group checked-list-box">
            <?php echo implode("\n", $userlist); ?>
        </ul>
    </div>
</div>