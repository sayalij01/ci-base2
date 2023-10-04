<?php
$operations = "";
foreach($data["post"]["operations"] as $idx=>$operation)
{
    $operations .= $operation["name"].", ";
}
$operations = substr($operations,0,-2);

$tech_diciplines = "";
foreach($data["post"]["tech_diciplines"] as $idx=>$tech_dicipline)
{
    $tech_diciplines .= $tech_dicipline["name"].", ";
}
$tech_diciplines = substr($tech_diciplines,0,-2);


?>

<div class="row">
	<div class="col-xs-12 text-primary" style="font-size:1.2em;font-weight:bold;">
	Das Kitpack &quot;<?php echo $data["post"]["setName"]; ?>&quot; wurde angefragt.
	</div>
</div>

<!--
<br />
<div class="row">
	<div class="col-xs-12 text-primary" style="font-size:1.2em;font-weight:bold;">
	Beschreibung:
	</div>
	<div class="col-xs-12 grey" style="font-size:1em;">
	<?php //echo $data["post"]["setDesc"]; ?>
	</div>
</div>
<br />
<div class="row">
	<div class="col-xs-12 text-primary" style="font-size:1.2em;font-weight:bold;">
	Eingriffe:
	</div>
	<div class="col-xs-12 grey" style="font-size:1em;">
	<?php //echo $operations; ?>
	</div>	
</div>
<br />
<div class="row">
	<div class="col-xs-12 text-primary" style="font-size:1.2em;font-weight:bold;">
	Fachdisziplin:
	</div>
	<div class="col-xs-12 grey" style="font-size:1em;">
	<?php //echo $tech_diciplines; ?>
	</div>	
</div>
<br />
<div class="row">
	<div class="col-xs-12 text-primary" style="font-size:1.2em;font-weight:bold;">
	Unsteriles Muster: <?php //echo ($data["post"]["unsterile_sample"]==1?"Ja":"Nein"); ?>
	</div>
	<br /><br />
</div>
-->
<?php
/*
$ind_components_html = "";
foreach ($data["non_contract"] as $ind_component)
{
    $component_id = $ind_component["component_id"];
    $view_data = array("data" => array("component_id" => $component_id,$component_id => $ind_component, "email" => true));
    $value = $this->load->view("admin/components/component_details", $view_data, true);
    $ind_components_html .= "
        <div class=\"row\">
            <div class=\"col-xs-12 text-primary\" style=\"font-size:1.2em;font-weight:bold;\">
                Individual Komponent:
            </div>
            <div class=\"col-xs-12 grey\" style=\"font-size:1em;\">
                ".$value."
            </div>    
         </div>
         <br />
    ";


}
echo $ind_components_html;
*/
?>
<input type="hidden" id="release_table_requested" value="1"/>
<div class="row">
    <div class="col-xs-12">
        <?php echo $data["table_details"]; ?>
    </div>
</div>
<div class="row">
	<div class="col-xs-12">
	<?php echo $data["post"]["release_table"]; ?>
	</div>
</div>

