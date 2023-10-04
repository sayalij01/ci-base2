<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
	$component_id = $data["component_id"];
	$html1 = "";
    $html2 = "";
    $html3 = "";
    $component_name = "";
    $language = $data["language"];
	if (array_key_exists($component_id, $data))
	{
		$component_data = $data[$component_id];
		$t_component = new T_Component($component_data);
        //echo "<div><pre>".print_r($t_component,true)."</pre><br /><pre>".print_r( $data["attributesValues"],true)."</pre></div>";
		$technical_discipline = array();
		$attributes = array();
        $component_name = implode(" ", array($component_data["desc_1"],$component_data["desc_2"],$component_data["desc_3"],$component_data["desc_4"],$component_data["desc_5"]));
        $component_name = '<b><span class="text-default">'.$component_name.'</span></b>';

        $html1 .= ' <div class="row">
                        <div class="col-sm-1">&nbsp;</div>
                        <div class="col-sm-10 col-xs-12">
                            <div class="row">
                                <div class="col-sm-5 col-xs-12">
                                    <span class="text-default">'.lang("manufacturer").':&nbsp;&nbsp;</span>
                                </div>
                                <div class="col-sm-7 col-xs-12">
                                    <span>'.$t_component->manufacturer.'</span>
                                </div>
                           </div>                                        
                        </div>
                        <div class="col-sm-1">&nbsp;</div>
                    </div>
                    <br />';
        $html1 .= ' <div class="row">
                        <div class="col-sm-1">&nbsp;</div>
                        <div class="col-sm-10 col-xs-12">
                            <div class="row">
                                <div class="col-sm-5 col-xs-12">
                                    <span class="text-default">'.lang('material_number').':&nbsp;&nbsp;</span>
                                </div>
                                <div class="col-sm-7 col-xs-12">
                                    <span>'.$component_data["material_number"].'</span>
                                </div>
                           </div>                                        
                        </div>
                        <div class="col-sm-1">&nbsp;</div>
                    </div>
                    <br />';
        $html1 .= ' <div class="row">
                        <div class="col-sm-1">&nbsp;</div>
                        <div class="col-sm-10 col-xs-12">
                            <div class="row">
                                <div class="col-sm-5 col-xs-12">
                                    <span class="text-default">'.lang('product_group').':&nbsp;&nbsp;</span>
                                </div>
                                <div class="col-sm-7 col-xs-12">
                                    <span>'.$t_component->product_group.'</span>
                                </div>
                           </div>                                        
                        </div>
                        <div class="col-sm-1">&nbsp;</div>
                    </div>
                    <br />';
        $html1 .= ' <div class="row">
                        <div class="col-sm-1">&nbsp;</div>
                        <div class="col-sm-10 col-xs-12">
                            <div class="row">
                                <div class="col-sm-5 col-xs-12">
                                    <span class="text-default">'.lang('subgroup').':&nbsp;&nbsp;</span>
                                </div>
                                <div class="col-sm-7 col-xs-12">
                                    <span>'.$t_component->subgroup.'</span>
                                </div>
                           </div>                                        
                        </div>
                        <div class="col-sm-1">&nbsp;</div>
                    </div>
                    <br />';
 /*       $operations = "";
        if (count($t_component->operations) > 0)
        {
            foreach ($t_component->operations as $operation)
            {
                $operations .= lang($operation["operations_token"])."<br>";
            }
        }
        $html1 .= ' <div class="row">
                        <div class="col-xs-1">&nbsp;</div>
                        <div class="col-xs-10">
                            <div class="row">
                                <div class="col-xs-5">
                                    <span class="text-default">'.lang('operations').':&nbsp;&nbsp;</span>
                                </div>
                                <div class="col-xs-7">
                                    '.$operations.'
                                </div>
                           </div>                                        
                        </div>
                        <div class="col-xs-1">&nbsp;</div>
                    </div>
                    <br />';*/
        $debug = "<pre>".print_r($t_component,true)."</pre>";
        $debug = "";
        foreach ($t_component->attributes as $attribute)
        {
            //echo $language."<pre>".print_r($attribute,true)."</pre>";
            //echo $language."<pre>".print_r($data["attributesValues"],true)."</pre>";
            $value = $attribute["value"];
            if(strtolower($language) == "de")
            {
                $attrib = trim($attribute["attr_name"]);
            }
            else
            {
                $attrib = trim($attribute["attr_name_en"]);
            }
            if($attribute["is_boolean"] == 1)
            {
                if(strtolower($language) == "de")
                {
                    if($value === "0")
                    {
                        $value = "Nein";
                    }
                    else if($value === "1")
                    {
                        $value = "Ja";
                    }
                    else
                    {
                        $value = trim($value);
                    }
                }
                else
                {
                    if($value === "0")
                    {
                        $value = "No";
                    }
                    else if($value === "1")
                    {
                        $value = "Yes";
                    }
                    else
                    {
                        $value = trim($value);
                    }
                }
            }
            else
            {
                $attr_token = $attribute["attr_token"];
                if(is_numeric($value))
                {
                    $value = intval($value);
                }
                //echo $attr_token." - ".$value." - ".$language."<pre>".print_r($data["attributesValues"][strtolower(trim($attr_token))],true)."</pre>";
                if(array_key_exists($attr_token,$data["attributesValues"]) && array_key_exists($value,$data["attributesValues"][$attr_token]))
                {
                    if(strtolower($language) == "de")
                    {
                        $value = $data["attributesValues"][$attr_token][$value]["value"];
                    }
                    else
                    {
                        $value = $data["attributesValues"][$attr_token][$value]["value_en"];
                    }
                }
            }
            if ($attrib != "" && $value != "" && intval($attribute["active"]) == 1)
            {
                $html2 .= ' <div class="row">
                            <div class="col-sm-1">&nbsp;</div>
                            <div class="col-sm-10 col-xs-12">
                                <div class="row">
                                    <div class="col-sm-5 col-xs-12">
                                        <span class="text-default">'.$attrib.':&nbsp;&nbsp;</span>
                                    </div>
                                    <div class="col-sm-7 col-xs-12">
                                        '.$value.'
                                    </div>
                               </div>                                        
                            </div>
                            <div class="col-sm-1">&nbsp;</div>
                        </div>
                        <br />';

            }
        }

        $html3 .= ' <div class="row">
                            <div class="col-sm-1">&nbsp;</div>
                            <div class="col-sm-10 col-xs-12">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <span class="text-default">'.lang("examples").':&nbsp;&nbsp;</span>
                                    </div>
                               </div>                                        
                            </div>
                            <div class="col-sm-1">&nbsp;</div>
                        </div>
                        <br />';
        foreach ($t_component->technical_discipline as $discipline)
        {
            $html3 .= ' <div class="row">
                        <div class="col-sm-1">&nbsp;</div>
                        <div class="col-sm-10 col-xs-12">
                            <div class="row">
                                <div class="col-xs-12">
                                    <span class="text-default">'.lang($discipline["technical_discipline_token"]).':&nbsp;&nbsp;</span>
                                </div>
                           </div>                                        
                        </div>
                        <div class="col-sm-1">&nbsp;</div>
                    </div>';

        }

 /*       $html .= "<table>";
        $html .= '<tr><td><span class="text-default">'.lang('material_number').":&nbsp;&nbsp;</span></td><td>".$component_data["material_number"].'</td></tr>';
        if ($t_component->ft_class != "")
        {
            $html .= '<tr><td><span class="text-default">'.lang('ft_class').":&nbsp;&nbsp;</span></td><td>".lang($t_component->ft_class).'</td></tr>';
        }
        if ($t_component->product_group != "")
        {
            $html .= '<tr><td><span class="text-default">'.lang('product_group').":&nbsp;&nbsp;</span></td><td>".$t_component->product_group.'</td></tr>';
        }
        if ($t_component->subgroup != "")
        {
            $html .= '<tr><td><span class="text-default">'.lang('subgroup').":&nbsp;&nbsp;</span></td><td>".$t_component->subgroup.'</td></tr>';
        }
        if ($t_component->manufacturer != "")
		{
			$html .= '<tr><td><span class="text-default">'.lang('manufacturer').":&nbsp;&nbsp;</span></td><td>".$t_component->manufacturer.'</td></tr>';
		}
		if ($t_component->size != "")
		{
			$html .= '<tr><td><span class="text-default">'.lang('size').":&nbsp;&nbsp;</span></td><td>".$t_component->size.'</td></tr>';
		}
		if ($t_component->length != "")
		{
			$html .= '<tr><td><span class="text-default">'.lang('length').":&nbsp;&nbsp;</span></td><td>".$t_component->length.'</td></tr>';
		}
		$html .= "</table>";

		if (count($t_component->technical_discipline) > 0)
		{
			$html .= '<h5><span class="text-primary">'.lang("technical_disciplines").':</span></h5>';
			foreach ($t_component->technical_discipline as $discipline)
			{
				$html .= $discipline["technical_discipline_descr"]."<br>";
			}
		}

		$html_attributes = "";
		$attr_found = false;
		$html_attributes .= '<h5><span class="text-primary">'.lang("characteristics").':</span></h5>';
		$html_attributes .= "<table>";
		foreach ($t_component->attributes as $attribute)
		{
			if (trim($attribute["value"]) != "")
			{
				$attr_found = true;
				$html_attributes .= "<tr><td>".$attribute["attr_name"].":&nbsp;&nbsp;</td><td>".$attribute["value"]."</td></tr>";
			}
		}
		$html_attributes .= "</table>";
		if ($attr_found)
		{
            $html .= '<hr>';
            $html .= $html_attributes;
            $html .= '<span class="text-primary"><hr></span>';
		}*/

	}
	?>
    <div class="row">
        <div class="brand-red"></div>
        <div class="brand-green"></div>
    </div>
    <br />
    <?php echo $debug; ?><br />
    <div class="row">
        <div class="col-xs-12" style="font-size:16px;">
            <?php echo $component_name; ?>
        </div>
    </div>
    <br /><br />
	<div class="row">
	    <div class="col-xs-4">
            <div class="row">
                <div class="col-xs-1">&nbsp;</div>
                <div class="col-xs-10 details_components">
                    <?php echo "&nbsp;".lang("article_details"); ?>
                </div>
                <div class="col-xs-1">&nbsp;</div>
            </div>
            <br />
			<?php echo $html1; ?>
	    </div>
        <div class="col-xs-4" style="padding-left:5px !important;padding-right:5px !important;">
            <div class="row">
                <div class="col-xs-1">&nbsp;</div>
                <div class="col-xs-10 details_components">
                    <?php echo "&nbsp;".lang("characteristics"); ?>
                </div>
                <div class="col-xs-1">&nbsp;</div>
            </div>
            <br />
            <?php echo $html2; ?>
        </div>
        <div class="col-xs-4" style="padding-left:5px !important;padding-right:10px !important;">
            <div class="row">
                <div class="col-xs-1">&nbsp;</div>
                <div class="col-xs-10 details_components">
                    <?php echo "&nbsp;".lang("area_of_usage"); ?>
                </div>
                <div class="col-xs-1">&nbsp;</div>
            </div>
            <br />
            <?php echo $html3; ?>
        </div>
	</div>

