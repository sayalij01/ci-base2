<?php
$client_list = array();
foreach($data["clients"] as $idx=>$client)
{

    $client_name = $client->client_name;

    $client_id = $client->client_id;
    $checked = E_CHECKED::NO;
    if(in_array($client_id,$data["assigned_clients"]))
    {
        $checked = E_CHECKED::YES;
    }

    $cb_client = new HTML_Checkbox("cb_client_".$client_id,"client[]","",$checked,$client_id,E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array(),array());

    $client_list[] = "<li class=\"list-group-item client_item\"><div class='row'><div class='col-xs-9'>".$cb_client->generateHTML()."&nbsp;".trim($client_name)."</div><div class='col-xs-3'>".$client->customer_number."</div></li>";


}

?>

    <div class="input-group pull-right">
        <input id="client_search_term" type="text" class="form-control" placeholder="<?php echo lang("search")."..."; ?>" />
        <div class="input-group-btn">
            <button id="search_role_client_list" type="button" class="btn btn-primary" title="<?php echo lang("start_search_role_client");?>">
                <i class="fa fa-search"></i>
            </button>
            <button id="clear_role_client_list" type="button" class="btn btn-primary" title="<?php echo lang("clear_role_client_search");?>">
                <i class="fa fa-remove"></i>
            </button>
            <button id="add_all_role_clients" type="button" class="btn btn-primary" title="<?php echo lang("add_all_client_to_role");?>">
                <i class="fa fa-plus"></i>
            </button>
            <button id="remove_all_role_clients" type="button" class="btn btn-primary" title="<?php echo lang("remove_all_client_from_role");?>">
                <i class="fa fa-minus"></i>
            </button>
        </div>
    </div>

<div class ="row">
    <div id="scrollable_client_list" class="col-xs-12 nicescroll_container" style="height:30vh;overflow-y:hidden">
        <ul class="list-group checked-list-box">
            <?php echo implode("\n", $client_list); ?>
        </ul>
    </div>
</div>
