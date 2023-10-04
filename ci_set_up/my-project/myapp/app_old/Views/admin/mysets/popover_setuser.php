<?php

$id = "popover_setuser_".$data["kitpack_id"];
$setuser_amount = (string)$data["setuser_amount"];

$table = '<table class="table table-striped table-advance table-hover table-full-width ">';
	$table .= '<tr>';
		$table .= '<th>Klinik<th>';
	$table .= '</tr>';
for($i = 0; $i < $setuser_amount; $i++)
{
	$nr =   $i+1;
	$table .= '<tr>';
	$table .= '<td>Klinik '.$nr.'</td>';
	$table .= '</tr>';
}

$table .= "</table>";

echo $table;
?>
