<!--<?php
$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$render = array(array(),array(),array());
renderClientLinks($data["client_id"],$data["clients"],$render);

?>
<div class="row" style="color: #63B450;">
    <div class="col-xs-12">
    	<h1><?php echo lang("available_clients"); ?></h1>
    </div>
</div>
<div class="row">
	<div class="col-xs-4">
    	<?php 
    	echo implode("<br /><br />",$render[0]);
    	?>	
	</div>
	<div class="col-xs-4">
    	<?php 
    	echo implode("<br /><br />",$render[1]);
    	?>	
	</div>
	<div class="col-xs-4">
    	<?php 
    	echo implode("<br /><br />",$render[2]);
    	?>	
	</div>
</div>-->
<?php
    //echo "<pre>".print_r($data["clients"],true)."</pre>";
    $rows = array();
    renderClientRows($data["client_id"],$data["clients"],$rows);
    foreach($rows as $idx=>&$row)
    {
        unset($row["children"]);
    }
    $dt = new HTML_Datatable("client_select_list",$data["columns"],$rows);
    //echo "<pre>".print_r($rows,true)."</pre>";
    echo $dt->generateHTML();
?>