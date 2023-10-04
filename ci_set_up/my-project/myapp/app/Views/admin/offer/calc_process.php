<?php

$btn_back = new HTML_Button("bt_calc_process_back", "bt_calc_process_back", lang("back"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::ARROW_RIGHT, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
$kitpack_margins = [];
foreach ($data["kitpacks"] as $idx => $kitpack){
	if (!is_null($kitpack)){
		$kitpack_margins[$idx] = $kitpack->prvkp_marge;
    }
}

$min_marge = min($kitpack_margins);
$max_marge = max($kitpack_margins);

$html = "";
$columns  = 0;

$kitpack_html_arr = [];
foreach ($data["kitpacks"] as $idx => $kitpack)
{
	$kitpack_html = "";
    $display = "none";
	if (!is_null($kitpack))
	{
		$columns ++;
        $display = "block";
        $period = format_timestamp2date($kitpack->created_at);
		$header = lang("actual_kitpack");
		if ($idx < 3)
		{
			$header = lang("predecessor")."&nbsp;".(3 - $idx);
			if(!is_null($data["kitpacks"][$idx+1]) && !is_null($data["kitpacks"][$idx+1]->created_at) &&  trim($data["kitpacks"][$idx+1]->created_at) != "")
			{
				$period .= " - ".format_timestamp2date($data["kitpacks"][$idx+1]->created_at);
			}
		}

		$margin_label = make_marge_label($min_marge, $max_marge, $kitpack->prvkp_marge);

		if ($idx > 1 && !is_null($data["kitpacks"][$idx - 1] ))
		{
			$kitpack_html .= '<div class="col-md-1 arrow-calculation-process" style="height: 100%"><a style="align-items: center"><i class="fa fa-chevron-circle-right fa-2x" aria-hidden="true"></i></a></div>';
		}
        else
		{
            $kitpack_html .= '<div class="col-md-1 arrow-calculation-process"></div>';
        }

        if (!is_null($data["kitpacks_history_data"][$idx]))
		{
			$history_data["history_data"] = $data["kitpacks_history_data"][$idx];
			$history_data["involded_components"] = $data["kitpacks_involded_components"][$idx];
            $history_html = $this->load->view("admin/mysets/action_history_dialog", $history_data,true);
        }

		$kitpack_html .= "
		<div class='col-md-11'>
			<div class='panel panel-default panel-calculation-process'>
				<table>
					<thead>
						<th>
							<td><b>".$header."</b></td>
							<td></td>
						</th>				
					</thead>
					<tbody>
						<tr>
							<td>".lang("kitpack_number").":&nbsp;&nbsp;</td>
							<td>".$kitpack->kp_setnummer."</td>
						</tr>
						<tr>
							<td>".lang("kitpack_version").":&nbsp;&nbsp;</td>
							<td>".$kitpack->version_counter.$kitpack->alternative_counter."</td>
						</tr>
						<tr>
							<td>".lang("period").":&nbsp;&nbsp;</td>
							<td>".$period."</td>
						</tr>
						<tr>
							<td>".lang("sk_hk_plan").":&nbsp;&nbsp;</td>
							<td>".number_format($kitpack->prekp, 2,",", ".").$kitpack->prvkp_w."</td>
						</tr>
						<tr>
							<td>".lang("marge").":&nbsp;&nbsp;</td>
							<td>".$margin_label."&nbsp;&nbsp;</td>
						</tr>
						<tr>
							<td>".strtoupper(lang("vk")).":&nbsp;&nbsp;</td>
							<td>".number_format($kitpack->prvkp, 2,",", ".").$kitpack->prvkp_w."</td>
						</tr>
						<tr>
							<td>".lang("status").":</td>
							<td>".lang("kp_status_".$kitpack->kp_status)."&nbsp;&nbsp;</td>
						</tr>
					</tbody>
				</table>
			</div>
			
			<div class='panel panel-default panel-calculation-process-history'>
			    ".$history_html."
			</div>
		</div>
		";
		$kitpack_html_arr[] = $kitpack_html;
	}

}

$col_size = 12 / $columns;
foreach ($kitpack_html_arr as $kitpack_html)
{
    $html .= "<div class='col-md-".$col_size."'>";
    $html .= $kitpack_html;
    $html .= "</div>";
}


function make_marge_label($min_marge, $max_marge, $marge)
{
	$margin_label = number_format($marge, 2,",", ".")."&nbsp;%";
	if ($marge == $min_marge)
	{
		$marge_label_class = "label-success";
		if ($min_marge == 0)
		{
			$margin_label = "+/-".$margin_label;
		}
		else
		{
			$margin_label = "+".$margin_label;
		}
	}
	else if ($marge == $max_marge)
	{
		$marge_label_class = "label-danger";
		$margin_label .= '&nbsp;<i class="fa fa-arrow-up" aria-hidden="true"></i>';
		$margin_label = "+".$margin_label;
	}
	else
	{
		$marge_label_class = "label-warning";
		$margin_label .= '&nbsp;<i class="fa fa-arrow-up" aria-hidden="true"></i>';
		$margin_label = "+".$margin_label;
	}


	$margin_label = "<span class='label ".$marge_label_class."'>".$margin_label."</span>&nbsp;&nbsp;";
    return $margin_label;
}

?>
<div id="div_calc_process">
    <div class='row button-row'>
        <?php echo $btn_back->generateHTML(); ?>
    </div>
    <div class='row'>
        <?php echo $html; ?>
    </div>
</div>



