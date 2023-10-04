<?php
	$kitpack =  new T_Kitpack($data["kitpack"]);
	$ruleset = $data["ruleset"];
    //die("<pre>".print_r($data["wizard_type"],true)."</pre>");
	$steps_li = '<ul class="nav nav-pills nav-stacked" id="steps" >';
    $counter = 1;
	foreach($data["steps"] as $idx=>$set)
	{
	    if(intval($data["wizard_type"]) == 1)
        {
            $active = ($idx == 0 ? "active ":"");
        }
	    else
        {
            $active = "";
        }
		$steps_li .= "<li class=\"".$active."configure-set-step custom_text_umbruch\" value=\"".$set["token"]."\"><a class=\"configure_step_links\" href=\"#step-panels\" data-toggle=\"tab\" aria-expanded=\"true\"><b>".($counter).")</b> <b>".$set["label"]."</b></a></li>";
        $counter++;
    }
	$steps_li .= "</ul>";

	$search_panel = new HTML_Panel("search_panel",lang("component_search"),"","",E_DISMISSABLE::NO,E_VISIBLE::YES,"default","default",array(),array("nopadding"),array());
	$i_search_general = new HTML_Input("i_search_general", "i_search_general", E_INPUTTYPE::TEXT, lang("search_general"), "", "", "", true, true, array("width"=>"100%"), array("form-control-x3"), array());
	$btn_search_filters = new HTML_Button("btn_search_filters","btn_search_filters",lang("search_filters"),E_COLOR::STANDARD,E_SIZES::LG,E_ICONS::LISTING,"right",true,true,array("width"=>"100%","height"=>"48px","border"=>0),array(),array());

	$input = "<div class=\"input-group\" style=\"min-width:100%;\">
            ".$i_search_general->generateHTML()."
            <span class=\"input-group-btn\">
                <button id=\"btn_global_search\" class=\"btn btn-default btn-lg\" type=\"button\" style=\"border:0;\">
                    ".E_ICONS::SEARCH."
                </button>
            </span>
            <span class=\"input-group-btn\">
                <button id=\"btn_clear_global_search\" class=\"btn btn-default btn-lg\" type=\"button\" style=\"border:0;\">
                    ".E_ICONS::REMOVE."
                </button>
            </span>            
          </div>";

$adv_search_panel_state = new HTML_Input("adv_search_panel_state", "adv_search_panel_state", E_INPUTTYPE::HIDDEN, "", "0", "", "", true, true, array(), array(), array());
	$html = "<div class=\"col-xs-3 nopadding\">".$btn_search_filters->generateHTML()."</div><div class=\"col-xs-9 nopadding\">".$input."</div>";
	$search_panel->setPanelTitle($html.$adv_search_panel_state->generateHTML());
	$search_panel->setPanelSubtitleSmall(false);
	$search_panel->setDismissable(false);
	$search_panel->setTitleStyle(array("width"=>"100%","padding"=>0,"margin"=>0));
	$search_panel->setHeaderPanelStyle(array("padding"=>0,"margin"=>0,"border"=>0,"border-top-right-radius"=>0,"border-top-left-radius"=>0,"line-height"=>0));

	$adv_search_panel = new HTML_Panel("adv_search_panel","","","",E_DISMISSABLE::NO,E_VISIBLE::YES,"default","default",array(),array(),array());
	$adv_search_panel->setPanelTitle($this->load->view("admin/components/component_filter", $data["searchdata"], true));
	$adv_search_panel->setPanelSubtitleSmall(false);
	$adv_search_panel->setDismissable(false);
	$adv_search_panel->setTitleStyle(array("width"=>"100%","padding"=>0,"margin"=>0));
	$adv_search_panel->setHeaderPanelStyle(array("padding"=>0,"margin"=>0,"border"=>0,"border-top-right-radius"=>0,"border-top-left-radius"=>0,"line-height"=>0));

	$kitpack_panel = new HTML_Panel("panel_kitpack", lang("pack-reihe"), "", "", E_DISMISSABLE::NO, E_VISIBLE::YES,"default", "default", array(),array(),array());
	$kitpack_panel->addClass("panel-success");

	$packages_button = new HTML_Button("dropdow_packages", "dropdow_packages", lang("add_package"),E_COLOR::PRIMARY,"",E_ICONS::CARET_DOWN,"right");
	$packages_button->addClass("dropdown-toggle");
	$packages_button->addAttribute("data-toggle", "dropdown");
	$packages_button->addAttribute("aria-expanded", "true");
	$packages_li = '<ul class="dropdown-menu package-draggable" id="packages" aria-labelledby="dropdownMenu1">';
	foreach ($data["packages"] as $id=>$set)
	{
		$packages_li .= '<li class="li-packages packages-draggable" value="'.$id.'"><a href="#">'.$set["label"].'</a></li>';
	}
	$packages_li .= '</ul>';

	$drag_drop_configuration_tree = $this->load->view("admin/kitpack/drag_drop_configuration_tree", $data, true);

	$modalID = "mdl_Details";
	$modal_details = new HTML_Dialog($modalID, $modalID, lang("detailed_view"), '<div id="component_details_container"></div>');
	$modal_details->setColor(E_COLOR::PRIMARY);
	$modal_details->setSize(E_SIZES::MD);
	$modal_details->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

    $modalID = "mdl_request_component";
    $modal_request_component = new HTML_Dialog($modalID, $modalID, lang("request_component"), '<div id="request_component_container"></div>');
    $modal_request_component->setColor(E_COLOR::PRIMARY);
    $modal_request_component->setSize(E_SIZES::MD);
    $modal_request_component->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

    $modalID = "mdl_add_glue_points";
    $modal_add_glue_points = new HTML_Dialog($modalID, $modalID, lang("glue_point"), '<div id="add_glue_points_container"></div>');
    $modal_add_glue_points->setColor(E_COLOR::PRIMARY);
    $modal_add_glue_points->setSize(E_SIZES::MD);
    $modal_add_glue_points->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);

    //die("<pre>".print_r($data["searchdata"],true)."</pre>");

    /*$adv_search_panel = $this->load->view("admin/components/component_filter", $data["searchdata"], true);
    $modal_adv_search_panel = new HTML_Dialog("mdl_adv_search_panel", "mdl_adv_search_panel", lang("set_filter"), $adv_search_panel);
    $modal_adv_search_panel->setSize(E_SIZES::MD);
    $modal_adv_search_panel->setColor(E_COLOR::PRIMARY)->setVisible(E_VISIBLE::NO);*/
?>
<div class="row">
	<input type="hidden" id="ruleset_type" value="<?php echo $ruleset?>"/>
	<input type="hidden" id="ruleset_type_none" value="<?php echo E_RULESETS::RULESET_TYPE_NONE?>"/>
    <input type="hidden" id="ruleset_type_clinicpartner" value="<?php echo E_RULESETS::RULESET_TYPE_CLINICPARTNER?>"/">
    <div class="col-xs-12">
    	<div class="row">
            <?php
            $configuration_box_cols = "col-md-6";
            if ($data["wizard_type"] == E_WIZARD_TYPE::GUIDED)
            {
                echo '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 text-primary">';
                    echo '<div style="margin:10px 0 0 38px;font-size:20px;font-weight:bold;">'.lang("kitpack_configuration_steps").'</div>';
                echo '</div>';

                echo '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 text-primary">';
            }
            else
            {
                echo '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-primary">';
            }
            ?>
    			<div style="margin:10px 0 0 38px;font-size:20px;font-weight:bold;"><?php echo lang("set_name"); ?>:&nbsp;<span id="set_name_display"></span></div>
    		</div>
    		<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-primary">
        		<div id="set_desc_display" style="margin:10px 0 0 38px;font-size:14px;"></div>
    		</div>

    	</div>
    	<!--<?php //echo $adv_search_panel->generateHTML(); ?>-->
        <div style="background-color:transparent;margin:10px 20px 20px 20px;" class="display-flex">
            <?php
                $configuration_box_cols = "col-md-6";
                if ($data["wizard_type"] == E_WIZARD_TYPE::GUIDED)
                {
                    echo  '<div id="steps_scroll_container" class="col-md-2" style="max-height:400px;overflow:auto;width:250px;">'.$steps_li.'</div>';
                    $configuration_box_cols = "col-md-4";
                }
            ?>
            <div class="tab-content no-padding-left col-md-6" >
                <div id="search_panel">
                    <?php echo $search_panel->generateHTML(); ?>
                    <div id="adv_search_panel" class="panel panel-default nopadding" style="display:none;">
                    	<?php echo $this->load->view("admin/components/component_filter", $data["searchdata"], true).$adv_search_panel_state->generateHTML(); ?>
                    </div>
                </div>

                <div id="componnents_tables_scroll_container" style="height:400px;overflow:auto;">
                    <div id="step_panels" class="tab-pane" style="height: 100%;overflow:auto;"></div>
                </div>
            </div>

             <div id="kitpack_order" class="<?php echo $configuration_box_cols; ?>" style="height:400px;overflow:none;border:1px solid #ddd;padding-top:5px;padding-bottom:5px;">
                <?php echo $drag_drop_configuration_tree; ?>
             </div>
        </div>
    </div>
</div>
<?php
    /*if(count($kitpack->components)<=0)
    {
        echo "</div></div>";
    }*/
?>
        <?php echo $modal_details->generateHTML(); ?>
        <?php echo $modal_request_component->generateHTML(); ?>
        <?php echo $modal_add_glue_points->generateHTML(); ?>
    </div>
</div>
