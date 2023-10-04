<?php
	$kitpack =  new T_Kitpack($data["kitpack"]);
	$kitpack_quantity_planning = $kitpack->yearly_quantity_planning;
	
	$months = array_flip(E_MONTHS::getConstants());
	foreach ($months as $index => $month_name)
	{
		${"i_".$month_name."_quantity"} = new HTML_Input("i_".$month_name."_quantity", "quantity[".$month_name."]", E_INPUTTYPE::TEXT, "", $kitpack_quantity_planning[strtolower($month_name)]);
		${"i_".$month_name."_quantity"}->setAttributes (array(
			"data-a-sep" => "",
			"data-a-dec" => lang ("decimal_seperator"),
			"data-m-dec" => 0,
			"data-v-min" => 0
		));
		${"i_".$month_name."_quantity"}->addClass("month_quantity_input");
		//$transalted_month_names[] = lang($month_name);
	}
	
	$divide_button = new HTML_Button("divide_annual_requirement", "divide_annual_requirement", lang("divide"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SITEMAP, "right");
	$ii_annual_requirement = new HTML_Input("i_annual_requirement", "annual_requirement", E_INPUTTYPE::TEXT, lang("amount"), $kitpack_quantity_planning["annual_requirement"]);
	$ii_annual_requirement->setAttributes (array(
		"data-a-sep" => "",
		"data-a-dec" => lang ("decimal_seperator"),
		"data-m-dec" => 0,
		"data-v-min" => 0
	));
	
	$i_annual_requirement = new HTML_InputGroup("ig_annual_requirement", "ig_annual_requirement", E_INPUTTYPE::TEXT, lang("amount"));
	$i_annual_requirement->setButtonRight($divide_button->generateHTML());
	$i_annual_requirement->input = $ii_annual_requirement;
	
	$fi_annual_requirement = new HTML_FormItem(lang("annual_requirement"), "fi_annual_requirement", "annual_requirement", array(), E_REQUIRED::YES);
	$fi_annual_requirement->setValidationState( form_error('annual_requirement') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_annual_requirement->addComponent($i_annual_requirement);
	
	$annual_requirement = $fi_annual_requirement->generateHTML();
	
	$initial_annual_req =
	'<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div class="red" style="margin-top:25px;" text="'.lang("initial_amount").'" id="annual_requirement_initial"></div>
        <input type="hidden" id="i_initial_annual_requirement" name="initial_annual_requirement" value="'.$kitpack_quantity_planning["annual_requirement"].'"></input>
    </div>';

    $quantity_planning_view ='	
	<div class="row">
	    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
	        <br>
			'.$annual_requirement.'
	    </div>
        '.$initial_annual_req.'
	</div>
	<div class="row">
	    <div class="col-xs-12">
	        <div id="quantity_planning_chart"></div>
	    </div>
	</div>
	<div class="row" style="    margin-left: 70px;margin-right: 70px;">';
    foreach ($months as $key => $month_name)
    {
        $quantity_planning_view .= '<div class="col-xs-1"><br>';
        $quantity_planning_view .= ${"i_".$month_name."_quantity"}->generateHTML();
        $quantity_planning_view .= '</div>';
    }

    $quantity_planning_view .='
	</div>
	<br>';

echo $quantity_planning_view;