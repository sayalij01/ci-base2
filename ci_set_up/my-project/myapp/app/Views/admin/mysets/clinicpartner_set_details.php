<?php

$set_components = $data["set_data"]["components"];
$lang = $data["language"];

$label_not_found = '<span style="color:red; font-weight:bold;">'.lang("not_found").'!</span>';

$header = renderHeader($data, $label_not_found);

$html = "";
$i = 1;
foreach($set_components as $idx=> $component)
{
	$html .= renderItem($component,$i);
}

function renderHeader($data, $label_not_found) : string
{
	//height:490px; max-height:490px; overflow-y:scroll;
	$html = '<table class="table set_contents" style="width:100%; border: 1px solid #ddd; ">
				<tbody style="background: white;">
					<tr>
						<td >
									<div class="set_components_details">
									 	<span class="compare_kitpack_header">
										'. lang("op_tray_number") .'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.$data["set_data"]["op_tray_number"].'
										</span>
									</div>
						</td>
						<td >
						</td>
					</tr>
					<tr>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'. lang("op_tray_name") .'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.$data["set_data"]["op_tray_name"].'
										</span>
									</div>
						</td>
						<td >
						</td>
					</tr>
					<tr>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'. lang("color_code") .'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.$data["set_data"]["color_code"].'
										</span>
									</div>
						</td>
						<td >
						</td>
					</tr>
					<tr>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'. lang("technical_discipline") .'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.$data["set_data"]["technical_discipline"].'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.($data["set_data"]["found_technical_discipline"] ? $data["set_data"]["found_technical_discipline"] : $label_not_found).'
										</span>
									</div>
						</td>
					</tr>
					<tr>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'. lang("intervention") .'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.$data["set_data"]["intervention"].'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.($data["set_data"]["found_intervention"] != "" ? $data["set_data"]["found_intervention"] : $label_not_found).'
										</span>
									</div>
						</td>
					</tr>
					<tr>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'. lang("clinic_name") .'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.$data["set_data"]["clinic_name"].'
										('.$data["set_data"]["clinic_id"].')
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.($data["set_data"]["found_clinic_id"] ? $data["set_data"]["found_clinic_id"] : $label_not_found).'
										</span>
									</div>
						</td>
					</tr>
					<tr>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'. lang("contract_amount") .'
										</span>
									</div>
						</td>
						<td >
									<div class="set_components_details">
										<span class="compare_kitpack_header">
										'.$data["set_data"]["contract_amount"].'
										</span>
									</div>
						</td>
						<td >
						</td>
					</tr>
				</tbody>
			</table>';
	return $html;
}

function renderItem($item,&$i) : string
{
	    $producerArticleName = $item["producer_component_name"];
		$materalNumber = $item["material_number"];
		$articleName = $item["material_short_text"];
		if($item["component_id"] == null)
		{
			//$producerArticleName = '<span style="color:red; font-weight:bold;">'.lang("component_not_found")."!</span>";
			$articleName = '<span style="color:red; font-weight:bold;">'.lang("component_not_found")."!</span>";
			$materalNumber = "";
		}

        $html = "<div class=\"component-detail-box text-primary\">
                    <div class=\"row no-margin no-padding\">
                        <div class=\"col-xs-1 bg-primary details-component-sort-box\">
                            <i class=\"fa fa-ellipsis-v\"></i>
                            <div class=\"counter\">&nbsp;&nbsp;".$i."</div>
                        </div>
                        <div class=\"col-xs-2\" style=\"color: initial;\">
                            <div style=\"overflow:hidden;text-overflow: ellipsis;width:335px;white-space: nowrap;\">".$item["material_image"]."&nbsp;".$item["producer_material_number"]."</div>
                        </div>
                        <div class=\"col-xs-4\" style=\"color: initial;\">
                            <div style=\"overflow:hidden;text-overflow: ellipsis;width:335px;white-space: nowrap;\">".$producerArticleName."</div>
                        </div>
                        <div class=\"col-xs-1\" style=\"color: initial;\">
                            <span class=\"badge badge-light\">".$item["amount"]."</span>
                        </div>
                         <div class=\"col-xs-1\" style=\"color: initial;\">
                            <div style=\"overflow:hidden;text-overflow: ellipsis;width:335px;white-space: nowrap;\">".$materalNumber."</div>
                        </div>
                        <div class=\"col-xs-3\" style=\"color: initial;\">
                            <div style=\"overflow:hidden;text-overflow: ellipsis;width:335px;white-space: nowrap;\">".$articleName."</div>
                        </div>

                    </div>
                 </div>";


    $i++;
    return $html;
}

?>
<form id="form_clinicpartner_set" name="form_set" action="<?php echo base_url("admin/mysets/create_clinicpartner_kitpack"); ?>" method="POST" class="form form-horizontal set-form">
	<div class="col-xs-2">
		<button id="btn_save" name="btn_save" type="submit" value="1" class="btn btn-default btn-primary btn-block custom_text_umbruch" style="color:white;"><?php echo lang("btn_save"); ?></button>
		<br>
		<input name="cp_set_id" type="hidden" value="<?php echo $data["cp_set_id"]; ?>"/>
	</div>
<?php echo $header; ?>
<div class="row">

		<div class="col-xs-12">
        <table class="table set_contents" style="width:100%; border: 1px solid #ddd; height:490px; max-height:490px; overflow-y:scroll;">
            <thead style="background-color: #DCDCDC;">
            <tr>
                <th colspan="6"><?php echo lang("clinicpartner_set").":&nbsp;"; ?></th>
            </tr>
            <tr>
                <th style="width:10%"><?php echo lang("kitpack_order"); ?></th>
				<th style="width:16%"><?php echo lang("cp_material_number"); ?></th>
				<th style="width:32%"><?php echo lang("cp_component_name"); ?></th>
				<th style="width:7%"><?php echo lang("kitpack_comp_amount"); ?></th>
                <th style="width:7%"><?php echo lang("landr_comp_mat_no"); ?></th>
				<th style="width:28%"><?php echo lang("landr_comp_name"); ?></th>
            </tr>
            </thead>
            <tbody style="background: white;">
            <tr>
                <td colspan="6">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="set_components_details">
                                <?php echo $html; ?>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>

</div>

</form>
