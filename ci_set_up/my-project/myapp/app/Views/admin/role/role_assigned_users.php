<?php
$user_list = array();
foreach($assigned_users as $user_id=>$user)
{

    $user_name = $user["firstname"].' '.$user["lastname"].' ('.$user["username"].') ';
	$user_id = $user["user_id"];
    $client_id = $user["client_id"];
    $user_list[] = "<li class=\"list-group-item assigned-users\"><div class='row'><div class='col-xs-9'>".trim($user_name)."</div><div class='col-xs-3'>".$user["customer_number"]."</div></li>";
}

?>

<div class ="row">
    <div id="scrollable_client_list" class="col-xs-12 nicescroll_container_modal" style="height:30vh;overflow-y:hidden">
        <ul class="list-group">
            <?php echo implode("\n", $user_list); ?>
        </ul>
    </div>
</div>
