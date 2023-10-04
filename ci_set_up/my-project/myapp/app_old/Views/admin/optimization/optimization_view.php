<?php

$tile_data = $data["tile_data"];
$component_counter = $data["component_counter"];
$set_overview_items = $data["set_overview_items"];
$components_overview = $data["components_overview"];

$max_tiles_per_row 	= 2;
$col_size 			= intval(12 / $max_tiles_per_row);
//die(echome($data));
$tiles_output_components = '<div class="row" style="display: inline-block;" >';
$tiles_output_sets = '<div class="row" style="display: inline-block;">';
foreach ($tile_data as $index => $tiledata)
{
	
	if ($tiledata['text'] == 'individual'){
		$individual_html = '<table style="width:95%; ">';
			$individual_html .= '<tr>';
				$individual_html .= '<td><h3>'.$component_counter['count_ind'].'</h3></td>';
				$individual_html .= '<td>'.$component_counter['count_danger'].'</td>';
				$individual_html .= '<td>'.lang("exchangeable_component").'</td>';
			$individual_html .= '</tr>';
			$individual_html .= '<tr>';
				$individual_html .= '<td><p>'.lang("individual_component").'</p></td>';
				$individual_html .= '<td>'.$component_counter['count_warning'].'</td>';
				$individual_html .= '<td>'.lang('not_exchangeable_component').'</td>';
			$individual_html .= '</tr>';
		$individual_html .= '</table>';

/*        $individual_html = '<table style="width:95%; ">';
            $individual_html .= '<tr>';
                $individual_html .= '<td><h3>'.$component_counter['count_ind'].'</h3></td>';
                 $individual_html .= '<td><p>'.lang("individual_component").'</p></td>';
            $individual_html .= '</tr>';
        $individual_html .= '</table>';*/
		
		$tile = new HTML_TileBox("tile_$index", "", "", $tiledata["bgColor"], $tiledata["icon"]);
		$tile->setHTMLContent($individual_html);
	}
    elseif ($tiledata['text'] == "master-list__"){
        $master_list_html = '<table style="width:95%; ">';
            $master_list_html .= '<tr>';
                $master_list_html .= '<td><h3>'.$component_counter['count_good'].'</h3></td>';
                $master_list_html .= '<td><p>'.lang("master-list").'</p></td>';
            $master_list_html .= '</tr>';
        $master_list_html .= '</table>';

        $tile = new HTML_TileBox("tile_$index", "", "", $tiledata["bgColor"], $tiledata["icon"]);
        $tile->setHTMLContent($master_list_html);
    }
	else
	{
		$tile = new HTML_TileBox("tile_$index", $tiledata["count"], $tiledata["text"], $tiledata["bgColor"], $tiledata["icon"]);
	}
	$tile->setFooter( $tile->generateFooterLink("tile_bt_$index", lang("show_more"), $tiledata["url"], E_ICONS::ARROW_CIRCLE_RIGHT_BLACK ) );
	$tile->setLink($tiledata["url"]);
	
	// 8 % 4 == 0
	if ( ($index) % $max_tiles_per_row == 0 )
	{
	    if ($index <= (count($tile_data)-1)/2)
        {
	        $tiles_output_components .= '</div><div class="row tiles-assisstents-panel" >';
        }
		else
		{
			$tiles_output_sets .= '</div><div class="row tiles-assisstents-panel">';
        }
	}
	if ($index <= (count($tile_data)-1)/2)
	{
		$tiles_output_components .= '<div class="col-sm-'.$col_size.'">'.$tile->generateHTML().'</div>';
	}
	else
	{
		$tiles_output_sets .= '<div class="col-sm-'.$col_size.'">'.$tile->generateHTML().'</div>';
	}
	
}
$tiles_output_components .= '</div>';
$tiles_output_sets .= '</div>';

$sets_overview_table=
'<table class="table" style="width:100%; margin-bottom: 0.2em;">
    <thead style="background-color: #DCDCDC;">
        <tr>
            <th></th>
            <th>'.lang("name").'</th>
            <th>'.lang("type").'</th>
            <th>'.lang("potenzial").'</th>
        </tr>
    </thead>
    <tbody style="background-color: white;">';


foreach ($set_overview_items as $index => $set)
{
	$sets_overview_table.=
	'<tr>
        <td><span class="text-success">'.E_ICONS::SEARCH.'</span></td>
        <td>'.$set["kitpack_name"].'</td>
        <td>'.T_Kitpack::constructTypeLabel($set["type"]).'</td>
        <td>'.T_Kitpack::constructPotenzialLabel(E_POTENZIAL::PLACEHOLDER_WARNING).'</span></td>
    </tr>';
}

$sets_overview_table.=
'    </tbody>
</table>';


$components_overview_table =
'<table class="table" style="width:100%; margin-bottom: 0.2em;">
    <thead style="background-color: #DCDCDC;">
        <tr>
            <th></th>
            <th>'.lang("name").'</th>
            <th>'.lang("type").'</th>
            <th>'.lang("potenzial").'</th>
        </tr>
    </thead>
    <tbody style="background-color: white;">';
	
foreach ($components_overview as $i => $component)
{
    $components_overview_table .=
    '<tr>
        <td></td>
        <td>'.$component["material_short_text"]." ".$component["component_id"].'</td>
        <td>'.T_Kitpack::constructTypeLabel($component["component_type"]).'</td>
        <td>'.T_Kitpack::constructPotenzialLabel($component["component_potential"]).'</td>
    </tr>';
/*    $components_overview_table .=
    '<tr>
        <td></td>
        <td>'.$component["material_short_text"]." ".$component["component_id"].'</td>
        <td>'.T_Kitpack::constructTypeLabel($component["component_type"]).'</td>
    </tr>';*/
}

$components_overview_table .=
'   </tbody>
</table>';


$pull_right = "";
$col_left = 5;
if (array_key_exists("modal", $data) && $data["modal"])
{
	$pull_right = "pull-right";
	$col_left = 6;
}
$assistents_tab_content =
'
<div class="row assisstents-optimisation-row">
    <div id="components-usage" class="col-xs-12 col-sm-12 col-md-5 col-lg-'.$col_left.' assisstents-panel-tile-table">
        <br><span class="title-assisstents-panel-tile-table">'.lang("components_usage").'</span>
        <div style="position: relative;	text-align:justify;">
            '.$tiles_output_components.'
        </div>
        <div id="assisstents-optimisation-table-components" class="assisstents-panel-table">
            '.$components_overview_table.'
        </div>
    </div>
    <div id="sets-overview" class="col-xs-12 col-sm-12 col-md-5 col-lg-5 assisstents-panel-tile-table '.$pull_right.'">
        <br><span class="title-assisstents-panel-tile-table">'.lang("sets_overview").'</span>
        <div style="position: relative;	text-align:justify;">
            '.$tiles_output_sets.'
        </div>
        <div id="assisstents-optimisation-table-sets" class="assisstents-panel-table">
            '.$sets_overview_table.'
        </div>
    </div>
</div>';
echo $assistents_tab_content;
