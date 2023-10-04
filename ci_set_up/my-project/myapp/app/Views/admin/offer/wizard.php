
<?php
    //die("<pre>".print_r($data,true)."</pre>");
	$theme_colors_for_chart = $data["theme_colors_for_chart"];
	$kitpack =  new T_Kitpack($data["kitpack"]);
    $ruleset = $data["ruleset"];
    $do_approval = $data["do_approval"];

	//echome($data["kitpack"]);
	
	$state = new HTML_Input("current_state","current_state",E_INPUTTYPE::HIDDEN,"",1);
	
    $categories_li = "";
    /*
    foreach($data["categories"] as $idx=>$set)
    {
        $active = ($idx == 0 ? "active":"");
        $categories_li .= "<li class=\"configure-set\" value=\"".$set["ft_class_token"]."\"><a href=\"#step-panels\" data-toggle=\"tab\" aria-expanded=\"true\">".$set["translated"]."</a></li>";
    }
    */
    
    $tab_content_select_operations = $this->load->view("admin/offer/tab_content_select_operations", $data, true);
    
    $tab_content_configure_set = $this->load->view("admin/offer/tab_content_configure_set", $data, true);
    
//    $tab_content_quantity_planning = $this->load->view("admin/offer_test/tab_content_quantity_planning", $data, true);
//
//    $tab_content_set_approval = $this->load->view("admin/offer_test/tab_content_set_approval", $data, true);
    
    $translated_month_names = E_MONTHS::getConstantNames("", FALSE, TRUE);
    $past_values_comparison_placeholder = array(13, 3, 8, 8, 7, 9, 7, 12, 11, 7, 13, 13);
    
    $kitpack_standards = $this->load->view("admin/offer/kitpack_standards", $data, true);
    
	$hidden_wizard_type 	 = new HTML_Input("i_wizard_type", "wizard_type", E_INPUTTYPE::HIDDEN, lang("kitpack_id"), $data["wizard_type"]) ;
    $poweruser_search = $data["permissions"]["poweruser_search"]?1:0;
    $hidden_poweruser_search 	 = new HTML_Input("i_poweruser_search", "poweruser_search", E_INPUTTYPE::HIDDEN, "", $poweruser_search) ;
	$hidden_set_id 	 = new HTML_Input("i_kitpack_id", "kitpack_id", E_INPUTTYPE::HIDDEN, lang("kitpack_id"), ($kitpack->kitpack_id != "" ? $kitpack->kitpack_id : "")) ;
	$hidden_save	 = new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;
    $hidden_copy_standard_kitpack 	 = new HTML_Input("i_copy_standard_kitpack", "copy_standard_kitpack", E_INPUTTYPE::HIDDEN, "", $data["copy_standard_kitpack"]) ;
    $hidden_show_price = new HTML_Input("i_show_price","show_price",E_INPUTTYPE::HIDDEN, "show_price", $data["permissions"]["show_prices"]?1:0);
    $hidden_show_sample = new HTML_Input("i_show_sample","show_sample",E_INPUTTYPE::HIDDEN, "show_sample", $data["permissions"]["no_samples"]?0:1);

    $hidden_economic_check = new HTML_Input("i_economic_check","economic_check",E_INPUTTYPE::HIDDEN, "economic_check", $data["economic_check"]?1:0);
    $hidden_poweruser_check = new HTML_Input("i_poweruser_search","poweruser_search",E_INPUTTYPE::HIDDEN, "poweruser_search", 1);
	$hidden_copy_offer = new HTML_Input("i_copy_offer","copy_offer",E_INPUTTYPE::HIDDEN, "copy_offer", (isset($data["copy_offer"]) ? $data["copy_offer"] : 0));
	$hidden_copy_of_offer_id = new HTML_Input("i_copy_of_offer_id","copy_of_offer_id",E_INPUTTYPE::HIDDEN, "copy_of_offer_id", (isset($data["copy_of_offer_id"]) ? $data["copy_of_offer_id"] : 0));

	$action = (is_null($kitpack->kitpack_id) ? "wizard":"edit/".$kitpack->kitpack_id);
	
	$months = array_flip(E_MONTHS::getConstants());
	
	foreach ($months as $index => $month_name)
	{
        if (is_null($kitpack->kitpack_id)){
            $this_year_quantity[] = 0;}
        else{
            $this_year_quantity[] = (int)$kitpack->yearly_quantity_planning[strtolower($month_name)];
        }
        
    }

    // New Modal Packaging
    $modalPackagingID = "mdl_packaging";

    $modal_optimizationPackaging = new HTML_Dialog($modalPackagingID, $modalPackagingID, $img.lang("modal_packaging"),'<div id="optimization_container3" class="div_optimization_modal"></div>');
    $modal_optimizationPackaging->setColor(E_COLOR::PRIMARY);
    $modal_optimizationPackaging->setSize(E_SIZES::MD);
    $modal_optimizationPackaging->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

    // New Modal Component Alternative
    $modalComponentAlternativeID = "mdl_component_alternative";

    $modal_componentAlternative = new HTML_Dialog($modalComponentAlternativeID, $modalComponentAlternativeID, $img.lang("modal_component_alternative"),'<div id="alternative_component_container3" class="div_alternative_component_modal"></div>');
    $modal_componentAlternative->setColor(E_COLOR::PRIMARY);
    $modal_componentAlternative->setSize(E_SIZES::MD);
    $modal_componentAlternative->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);


/*$drag_placeholder_width = 534;
$drag_placeholder_height = 46;
$drag_placeholder = HTML_Image::generatePlaceholderSVG($drag_placeholder_width, $drag_placeholder_height,
    'Sie können den Artikel hier ablegen', adjustBrightness($theme_colors_for_chart->design_success, 0.7), 16);*/

?>

<div id="kitpack-wizard" class="row">
	<div class="col-xs-12">
        <form id="form_set" name="form_set" action="<?php echo base_url("admin/offer/".$action); ?>" method="POST" class="form form-horizontal set-form" data-user-type="">
            <input type="hidden" id="user-type" value="<?php echo $data["user_type"]; ?>" >
            <div class="row">
                <div class="col-lg-6 col-xs-12 col-sm-7">
                    <ul id="tab-list" class="nav nav-tabs fadeInRight">
                        <li tab="1" class="tab_header active">
                            <a id="link_tab1" class="tab_links not_clickable custom_text_umbruch" data-toggle="tab" pane="tab1" href="javascript:void(0)"><?php echo lang("kitpack_wizard_select_operations"); ?></a>
                        </li>
                        <li tab="2" class="tab_header">
                            <a id="link_tab2" class="tab_links not_clickable custom_text_umbruch" data-toggle="tab" pane="tab2" href="javascript:void(0)"><?php echo lang("kitpack_wizard_configure_set"); ?></a>
                        </li>
<!--                        <li tab="3" class="tab_header">-->
<!--                            <a id="link_tab3" class="tab_links not_clickable custom_text_umbruch" data-toggle="tab" pane="tab3" href="javascript:void(0)">--><?php //echo lang("kitpack_wizard_volume_planning"); ?><!--</a>-->
<!--                        </li>-->
<!--                        <li tab="4" class="tab_header">-->
<!--                            <a id="link_tab4" class="tab_links not_clickable custom_text_umbruch" data-toggle="tab" pane="tab4" href="javascript:void(0)">--><?php //echo lang("kitpack_wizard_release"); ?><!--</a>-->
<!--                        </li>-->
                    </ul>
                </div>
                <div class="col-lg-6 col-xs-12 col-sm-5">
                    <div class="row">
                    <div class="col-xs-3">
                            <button id="btn_history" name="btn_history" type="button" value="history" onclick="$.offer.show_history();" class="btn btn-default btn-primary btn-block text-primary custom_text_umbruch"><?php echo lang("action_history_title"); ?></button>
                        </div>
                        <div class="col-xs-3">
                            <button id="btn_cancel_offer" name="btn_cancel_offer" type="button" value="cancel" class="btn btn-default btn-block text-primary custom_text_umbruch"><?php echo lang("btn_cancel"); ?></button>
                        </div>
	                    <div class="col-xs-4">
		                    <button id="btn_save" name="btn_save" type="button" value="<?php echo E_SET_STATUS::CURRENTLY_IN_DEVELOPMENT; ?>" class="btn btn-default btn-primary btn-block custom_text_umbruch" style="color:white;"><?php echo lang("btn_save"); ?></button>
	                    </div>
                        <div class="col-xs-2">
                            <?php
                                if($ruleset == E_RULESETS::RULESET_TYPE_GERMAN_APPROVAL)
                                {
                                    echo '<button id="btn_next_offer" mode="'.$ruleset.'" do_approval ="'.$do_approval.'" name="btn_next_offer" type="button" value="'.E_SET_STATUS::WAITING_FOR_APPROVAL.'" class="btn btn-default btn-success btn-block custom_text_umbruch" style="color:white;">'.lang("btn_continue").'</button>';
                                }
                                else
                                {
                                    echo '<button id="btn_next_offer" mode="standard" name="btn_next_offer" type="button" value="'.E_SET_STATUS::WAITING_FOR_APPROVAL.'" class="btn btn-default btn-success btn-block custom_text_umbruch" style="color:white;">'.lang("btn_continue").'</button>';
                                }
                            ?>
                        </div>

                    </div>
                </div>
            
                <div id="tab-content" class="tab-content fadeInLeft col-xs-12">
                    <div id="tab1" class="tab-pane fade active in">
                        <?php echo $tab_content_select_operations; ?>
                    </div>
                    <div id="tab2" class="tab-pane fade" style="padding-left:0;">
                        <?php echo $tab_content_configure_set; ?>
                        <?php echo $modal_optimizationPackaging->generateHTML(); ?>
                        <?php echo $modal_componentAlternative->generateHTML(); ?>
                    </div>
<!--                    <div id="tab3" class="tab-pane fade">-->
<!--                        --><?php //echo $tab_content_quantity_planning; ?>
<!--                    </div>-->
<!--                    <div id="tab4" class="tab-pane fade">-->
<!--                        --><?php //echo $tab_content_set_approval; ?>
<!--                    </div>-->
                </div>
            </div>
            
            <?php
                echo $hidden_wizard_type->generateHTML();
                //echo $hidden_poweruser_search->generateHTML();
                echo $hidden_set_id->generateHTML();
                echo $hidden_save->generateHTML();
                echo $hidden_copy_standard_kitpack->generateHTML();
                echo $hidden_show_price->generateHTML();
                echo $hidden_show_sample->generateHTML();
                echo $hidden_economic_check->generateHTML();
                echo $hidden_poweruser_check->generateHTML();
				echo $hidden_copy_offer->generateHTML();
				echo $hidden_copy_of_offer_id->generateHTML();

			?>

        </form>
<!--        --><?php //echo $kitpack_standards; ?>
	</div>
</div>
<?php echo $state->generateHTML(); ?>
<div id="temp_container" style="display:none;">

</div>
<!-- Für Mengeplannung -->
<script>
	
	var quantityPlanningChartTrace1 = {
		x: <?php echo json_encode($translated_month_names); ?>,
		y: <?php echo json_encode($past_values_comparison_placeholder); ?>,
		type: 'bar',
		name: '<?php echo lang("last_year"); ?>',
		marker: {
			color: '<?php echo $theme_colors_for_chart->design_success; ?>',
			opacity: 0.5,
		},
		width: 0.18
	};
	
	var quantityPlanningChartTrace2 = {
		x: <?php echo json_encode($translated_month_names); ?>,
		y: <?php echo json_encode($this_year_quantity); ?>,
		type: 'bar',
		name: '<?php echo lang("this_year"); ?>',
		marker: {
			color: '<?php echo $theme_colors_for_chart->design_success; ?>',
			opacity: 1
		},
		width: 0.1
	};
	
	var quantityPlanningChartData = [quantityPlanningChartTrace1, quantityPlanningChartTrace2];
	
	var quantityPlanningChartOptions =
    {
        locale: 'de',
        responsive: true,
        scrollZoom: false,
        showLink: false,
        modeBarButtonsToRemove: [
            'sendDataToCloud',
            'zoom2d',
            'pan',
            'pan2d',
            //'autoScale2d',
            'lasso2d',
            'resetScale2d',
            'toggleSpikelines',
            //'dragmode'
        ],
        displaylogo: false,
        toImageButtonOptions: {
            format: 'png', // one of png, svg, jpeg, webp
            scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
    };
	
	var quantityPlanningChartLayout =
        {
		title: '',
		yaxis: {
			autorange: true,
			showgrid: false,
			zeroline: false,
			showline: false,
			autotick: true,
			ticks: '',
			showticklabels: false
		},
		barmode: 'group',
	        bargap: 0.71,
		bargroupgap: 0.1,
		showlegend: true,
		legend: {
			"orientation": "h"
		}
	};
	
 
	var wizard_types = <?php echo json_encode(E_WIZARD_TYPE::getConstants()); ?>;
	var wizard_type = <?php echo json_encode($data["wizard_type"]); ?>;
	var set_component_types = <?php echo json_encode(E_SET_COMPONENT_TYPE::getConstants()); ?>;
	var color_design_success = <?php echo json_encode( $theme_colors_for_chart->design_success); ?>;
	
</script>
<script type="text/javascript">
    var currency_matrix = <?php echo json_encode($data["currencyMatrix"]);?>
</script>