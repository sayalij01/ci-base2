
<?php
    $label_adjust = lang("adjust_set").'&nbsp;<span class="glyphicon glyphicon-sort fa-rotate-90"></span>';
    $label_order = lang("order_set").'&nbsp;'.E_ICONS::SHARE.'</span>';

	//echome($data);
	
	$table_sets_rows = "";
	$table_arrows_rows = "";
	$table_adjusted_rows = "";
	$table_set_components = [];

	foreach ($data['result_components'] as $set_id => $set_data)
	{
		$file_name = base64_decode($set_data['set_name']);
		$set_name = basename($file_name,'.csv');
		$components = $set_data["components"];
		
		$count_founded = 0;
		$set_price= 0;
		$article_not_found = false;
		
		$tbl_components_columns = array(
			new HTML_DTColumn("producer_material_number", lang("producer_material_number")),
			new HTML_DTColumn("producer_component_name", lang("producer_component_name")),
			new HTML_DTColumn("producer_name",lang("producer_name")),
			new HTML_DTColumn("component_name", lang("component_name")),
		);
		$tbl_components_data = array();
		foreach ($components as $component)
		{

			
			if (array_key_exists('component_id', $component))
			{
				$set_price += $component['material_price'] * $component['amount'];
				$count_founded++;
				$text_class = '';
				$component_name = trim($component['desc_1'].' '.$component['desc_2'].' '.$component['desc_3'].' '.$component['desc_4'].' '.$component['desc_5']).' ';
			}
			else
			{
				$article_not_found = true;
				$text_class = 'class="text-warning"'; 
				$component_name = '-';
			}
			$tbl_components_row = array(
				'producer_material_number' => '<span '.$text_class.'>'.$component['producer_material_number'].'</span>',
				'producer_component_name' => '<span '.$text_class.'>'.$component['producer_component_name'].'</span>',
				'producer_name' => '<span '.$text_class.'>'.$component['producer_name'].'</span>',
				'component_name' => '<span '.$text_class.'>'.$component_name.'</span>',
			);
			$tbl_components_data[] = $tbl_components_row;
		}
		$tbl_components[$set_id] = new HTML_Datatable("table_components_".$set_id, $tbl_components_columns, $tbl_components_data);
		
		
		$set_price = format_currency($set_price, 'EUR');
		$btn_color = E_COLOR::PRIMARY;
		if ($article_not_found)
		{
			$btn_color = E_COLOR::WARNING;
			//$set_price = $set_price.' ??';
		}
		
		$btn_adjust_set = new HTML_Button("adjust_set_".$set_id, "adjust_set_".$set_id, $label_adjust, $btn_color, E_SIZES::XS);
		$btn_adjust_set->addClass("btn_adjust_set");
		$btn_order_set = new HTML_Button("order_set_".$set_id, "order_set_".$set_id, $label_order, $btn_color, E_SIZES::XS);
		$btn_order_set->addClass("btn_order_set");
		
		$table_sets_rows .= '<tr>';
		$table_sets_rows .= '<td>'.$file_name.'</td>';
		$table_sets_rows .= '<td>'.$set_name.'</td>';
		$table_sets_rows .= '<td>'.count($components).'</td>';
		$table_sets_rows .= '</tr>';
		
		$table_arrows_rows .= '<tr><td><span class="glyphicon glyphicon-sort fa-rotate-90"></span></td></tr>';
		
		$table_adjusted_rows .= '<tr>';
		$table_adjusted_rows .= '<td>&nbsp;&nbsp;'.$count_founded.'&nbsp;&nbsp;&nbsp;'.
									'<button set_id='.$set_id.' onclick="$.adjustment_assistant.show_set_components(\''.$set_id.'\')">'.
										' <span class="glyphicon glyphicon-sort fa-rotate-90"></span>'.
											' <i class="fa fa-search"></i> '.
									'</button>'.
								'</td>'.
								'<td>'.$set_price.'</td>'.
								'<td>'.$btn_adjust_set->generateHTML().'</td>'.
								'<td>'.$btn_order_set->generateHTML().'</td>';
		$table_adjusted_rows .= '</tr>';
	}

	$table_sets = '<table class="table adjustment_assistant_table" style="border: 1px solid #ddd;">';
	$table_sets .= '<thead style="background-color: #DCDCDC;">
					<tr>
						<th>'.lang("file_name").'</th>
						<th>'.lang("set_name").'</th>
						<th>'.lang("components").'</th>
					</tr>
					</thead>';
	$table_sets .= '<tbody style="background: white;">';
	$table_sets .= $table_sets_rows;
	$table_sets .= '</tbody>';
	$table_sets.= '</table>';
	
	$table_arrows = '<table class="table borderless adjustment_assistant_table" style="text-align: center;">';
	$table_arrows .= '<tr><td>&nbsp;</td></tr>';
	$table_arrows .= $table_arrows_rows;
	$table_arrows .= '</table>';
	
	$table_adjusted = '<table class="table adjustment_assistant_table" style="border: 1px solid #ddd;">';
	$table_adjusted .= '<thead style="background-color: #DCDCDC;">
					<tr>
						<th>'.lang("automatically_assigned_components").'</th>
						<th>'.lang("price").'</th>
						<th>&nbsp;</th>
						<th><span class="pull-right">'.E_ICONS::TABLE." ".E_ICONS::LISTING.'</span></th>
					</tr>
					</thead>';
	$table_adjusted .= '<tbody style="background: white;">';
	$table_adjusted .= $table_adjusted_rows;
	$table_adjusted .= '</tbody>';	
	$table_adjusted .= '</table>';
	
	$btn_sets_order_all = new HTML_Button("btn_sets_order_all","btn_sets_order_all",lang('order_all'),'grey',E_SIZES::LG,null,"right",true,true,array("width"=>"100%","height"=>"48px","border"=>0),array(),array());

?>

<ul id="tab-list" class="nav nav-tabs fadeInRight">
	<li tab="1" class="tab_header active">
		<a class="tab_links not_clickable" data-toggle="tab" pane="tab1" href="javascript:void(0)">Umstellung-Assistent</a>
	</li>
</ul>

<div id="tab-content" class="tab-content fadeInLeft">
	<div id="tab1" class="tab-pane fade active in" style="padding: 3em; padding-left: 4em; padding-right: 4em;">
		<div class="row" style="background: white">
			<div class="col-xs-10 col-sm-5 col-md-5 col-lg-4" style=" background-color: inherit; padding-left: 3em;">
                <br>
                <strong><?php echo lang("table_sets");?></strong>
                <p></p>
                <?php echo $table_sets;?>
			</div>
            <div class="col-xs-2 col-sm-1 col-md-1 col-lg-1">
                <br><br><p></p>
                <?php echo $table_arrows;?>
            </div>
			<div class="col-xs-12 col-sm-5 col-md-5 col-lg-5" style=" background-color: inherit; ">
                <br>
                <strong><?php echo lang("rcommended_adjustment");?></strong>
                <p></p>
                <?php echo $table_adjusted;?>
			</div>
			<?php echo $btn_sets_order_all->generateHTML()?>
		</div>
		<div >
			<?php 
				
				foreach ($tbl_components as $set_id => $table_components)
				{
					$file_name = base64_decode($data['result_components'][$set_id]['set_name']);
					$set_name = basename($file_name,'.csv');
					$modalID = "mdl_set_components_".$set_id;
					
					$modal = new HTML_Dialog($modalID, $modalID, 'Set '.$set_name,'<div class="">'.$table_components->generateHTML().'</div>');
					$modal->setColor(E_COLOR::PRIMARY);
					$modal->setSize(E_SIZES::MD);
					$modal->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);
					
					echo $modal->generateHTML();
				}
			?>
		</div>
	</div>
</div>
