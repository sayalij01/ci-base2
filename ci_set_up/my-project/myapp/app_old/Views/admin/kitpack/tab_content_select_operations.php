<?php
	
	$kitpack =  new T_Kitpack($data["kitpack"]);
    if ($data["copy_standard_kitpack"] == 1)
    {
        $kitpack->kitpack_name = lang("copy_of")." ".$kitpack->kitpack_name;
        $kitpack->kitpack_desc = lang("copy_of")." ".$kitpack->kitpack_desc;
    }
	$groupnames = $data["available_groupnames"];
	
	//echo "<pre>".print_r($kitpack,true)."</pre>";
	//echo "<pre>".print_r($data,true)."</pre>";
	
	$l_set_name = '<span id="l_set_name" class="text-success label-sm req"><strong>'.lang("kitpack_wizard_label_set_name").'</strong></span>';
	$l_set_name_subtext = '<span id="l_set_name_subtext" class="text-success label-xs">'.lang("kitpack_wizard_label_set_name_subtext").'</span>';
	$i_set_name = new HTML_Input("i_set_name", "set_name", E_INPUTTYPE::TEXT, lang("kitpack_wizard_set_name"), $kitpack->kitpack_name, "", "", true, true, array(), array("form-control-x4"), array());
	
	$l_set_desc = '<span id="l_set_desc" class="text-success label-sm"><strong>'.lang("kitpack_wizard_set_desc").'</strong></span>';
	$l_set_desc_subtext = '<span id="l_set_desc_subtext" class="text-success label-xs">'.lang("kitpack_wizard_set_desc_subtext").'</span>';
	$i_set_desc = new HTML_TextArea("i_set_desc", "set_desc", $kitpack->kitpack_desc, lang("kitpack_description"), true, true, array("height"=>"80px !important"), array("form-control-textarea-xl"), array());
	
	$img_tab1 = "<img style=\"padding:0;margin:0;max-width:100%;max-height:100%;width:100%;\" src=\"".base_url("resources/img/backgrounds/placeholder_img1.png")."\" />";
	$pnl_tab1_side = new HTML_Panel("pnl_tab1_side", lang("kitpack_tab1_panel_text"), $img_tab1, "", false, true, "default", "default", array("margin:"=>"0","padding"=>"0"),array(),array());
	$pnl_tab1_side->setTitleColor('success');
	$pnl_tab1_side->setContentStyle(array("padding"=>"0","margin"=>"0"));
	$pnl_tab1_side->setTitleStyle(array("font-weight"=>"normal","padding"=>"14px","font-size"=>"14px"));
	$pnl_tab1_side->setPanelSubtitle(lang("kitpack_tab1_panel_subtext"));
	$pnl_tab1_side->setPanelSubtitleSmall(false);
	
	$img_tab2 = "<img style=\"padding:0;margin:0;max-width:100%;max-height:100%;width:100%;\" src=\"".base_url("resources/img/backgrounds/placeholder_img2.png")."\" />";
	$pnl_tab2_side = new HTML_Panel("pnl_tab1_side", lang("kitpack_tab1_panel_text2"), $img_tab2, "", false, true, "default", "default", array("margin:"=>"0","padding"=>"0"),array(),array());
	$pnl_tab2_side->setTitleColor('success');
	$pnl_tab2_side->setContentStyle(array("padding"=>"0","margin"=>"0"));
	$pnl_tab2_side->setTitleStyle(array("font-weight"=>"normal","padding"=>"10px","font-size"=>"14px"));
	$pnl_tab2_side->setPanelSubtitle(lang("kitpack_tab1_panel_subtext2"));
	$pnl_tab2_side->setPanelSubtitleSmall(false);
	
	$l_groupname = '<span id="l_groupname" class="text-success label-sm"><strong>'.lang("kitpack_wizard_label_groupname").'</strong></span>';
	$l_groupname_subtext = '<span id="l_groupname_subtext" class="text-success label-xs">'.lang("kitpack_wizard_label_groupname_subtext").'</span>';
	
	$options = HTML_Select::buildOptions($groupnames, "group_name", "group_name", is_null($kitpack->kitpack_group_name)?"":$kitpack->kitpack_group_name,"",true);
	//__construct($id, $name, $options, $multiple=false, $placeholder="", $visible=true, $enabled=true, $styles=array(), $classes=array(), $attributes=array())
	$i_groupname = new HTML_Select("i_groupname","groupname", $options,false,lang("groupname"),E_VISIBLE::YES,E_ENABLED::YES,array("width"=>"100%"),array(),array("data-tags"=>"true"));
	//$fi_groupname->addComponent($i_groupname);
	
	$l_op_li = '<span id="l_set_name" class="text-success label-sm"><strong>'.lang("kitpack_wizard_operation_label").'</strong></span>';
	$op_li = "<ul id=\"operations_checked_list_box\" name=\"operations\" class=\"list-group checked-list-box\">";
	foreach($data["operations"] as $idx=>$set)
	{
        if($kitpack->operations != null && is_array($kitpack->operations))
        {
            $checked = in_array($set["operations_id"], $kitpack->operations) == TRUE ? E_CHECKED::YES : E_CHECKED::NO;
        }
	    
		$cb = new HTML_Checkbox("cb_operation_".$set["operations_id"], "operations[]", $set["translated"], $checked, $set["operations_id"], E_ENABLED::YES, E_INLINE::NO, E_VISIBLE::YES);
		$cb->setLabelStyle(array("margin"=>"0","padding"=>"0 0 0 20px","color"=>"#999999","font-size"=>"12px"));
		$cb->setCheckboxStyle(array("margin"=>"0"));
		$op_li .= "<li id=\"".$set["operations_id"]."\" class=\"list-group-item\" style=\"border:none;padding-top:2px;padding-bottom:1px;\">
                    ".$cb->generateHTML()."
               </li>";
	}
	$op_li .= "</ul>";
	
	$visible = "";
	if($data["config_type"]==2)
	{
	    $visible = " style=\"display:none;\""; 
	}
	
	$l_tech_discipline_li = '<span id="l_set_name" class="text-success label-sm req"><strong>'.lang("kitpack_wizard_tech_discipline_label").'</strong></span>';
	$tech_discipline_li = "<ul id=\"tech_disciplines_checked_list_box\" name=\"operations\" class=\"list-group checked-list-box\">";
	foreach($data["tech_disciplines"] as $idx=>$set)
	{
        if($kitpack->technical_disciplines != null && is_array($kitpack->technical_disciplines))
        {
            $checked = in_array($set["discipline_id"], $kitpack->technical_disciplines) == TRUE ? E_CHECKED::YES : E_CHECKED::NO;
        }
		
		$cb = new HTML_Checkbox("cb_discipline_".$set["discipline_id"], "discipline[]", $set["translated"], $checked, $set["discipline_id"], E_ENABLED::YES, E_INLINE::NO, E_VISIBLE::YES,array(),array("tech_discipline_cb"));
		$cb->setLabelStyle(array("margin"=>"0","padding"=>"0 0 0 20px","color"=>"#999999","font-size"=>"12px"));
		$cb->setCheckboxStyle(array("margin"=>"0"));
		$tech_discipline_li .= "<li id=\"".$set["discipline_id"]."\" class=\"list-group-item\" style=\"border:none;padding-top:2px;padding-bottom:1px;\">
                                ".$cb->generateHTML()."
                            </li>";
	}
	$tech_discipline_li .= "</ul>";
?>


<div class="row">
	<div class="col-xs-12">
		<div class="row"  style="margin-top:2em;padding-left:2em;padding-right:2em;">
			<div class="col-xs-12 col-sm-6 col-lg-4">
				<div class="row" id="name_area">
    				<div class="col-xs-12">
                    <?php
                        echo $l_set_name; //->generateHTML()
                        echo "<br />";
                        echo $l_set_name_subtext; //->generateHTML()
                        echo "<br />";
                        echo $i_set_name->generateHTML();
                        echo "<br />";
                        echo $l_groupname; //->generateHTML()
                        echo "<br />";
                        echo $l_groupname_subtext; //->generateHTML()
                        echo "<br />";
                        echo $i_groupname->generateHTML();
                        echo "<br />";
                        echo $l_set_desc;  //->generateHTML()
                        echo "<br />";
                        echo $l_set_desc_subtext;   //->generateHTML()
                        echo "<br />";
                        echo $i_set_desc->generateHTML();
                    ?>					
    				</div>
				</div>
			</div>
            <div class="col-xs-12 col-sm-6 col-lg-4">
                <div class="col-xs-12">
                    <div class="row" id="tech_diciples_area"<?php echo $visible; ?>>
                        <div class="col-xs-12">
                            <div id="tech_diciplins_list" class="row" style="margin:0;padding:0;">
                                <?php echo $l_tech_discipline_li; //->generateHTML() ?>
                                <br />

                                <div class="input-group" style="min-width:100%;margin-top:24px;">
                                    <input id="i_search_tech_diciplins_list" name="i_search_tech_diciplins_list" type="text" value="" class="form-control" style="width:100%;" placeholder="<?php echo lang("plh_tech_disciplines")?>">
                                    <span class="input-group-btn">
                                            <button id="btn_search_tech_diciplins_list" class="btn btn-default" type="button">
                                            	<i class="fa fa-search"></i>
                                            </button>
                                        </span>
                                </div>
                                <div class="col-xs-12" style="height:258px;overflow:auto;padding:0;">
                                    <?php echo $tech_discipline_li; ?>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-lg-4">
                <div class="col-xs-12">
                    <div class="row" id="operations_area">
                        <div class="col-xs-12">
                            <div id="operations_list" class="row" style="margin:0;padding:0;">
                                <?php echo $l_op_li; //->generateHTML(); ?>
                                <br />

                                <div class="input-group" style="min-width:100%;margin-top:24px;">
                                    <input id="i_search_operations_list" name="i_search_operations_list" type="text" value="" class="form-control" style="width:100%;" placeholder="<?php echo lang("plh_interventions")?>">
                                    <span class="input-group-btn">
                                            <button id="btn_search_operations_list" class="btn btn-default" type="button">
                                            	<i class="fa fa-search"></i>
                                            </button>
                                        </span>
                                </div>

                                <div class="col-xs-12" style="height:258px;overflow:auto;padding:0;">
                                    <?php echo $op_li; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
<!--			<div class="col-xs-8">-->
<!--				<div class="row">-->
<!--                --><?php
//                   // echo $pnl_tab1_side->generateHTML();
//                ?><!--				-->
<!--				</div>-->
<!--				<div class="row" style="margin-bottom:4px;">-->
<!---->
<!---->
<!--        			-->
<!---->
<!--        						-->
<!--				</div>				-->
<!--			</div>-->
		</div>
	</div>
</div>


<!--    <div class="col-xs-12">
        <div id="set_name_area" class="row" style="margin-top:2em;padding-left:2em;padding-right:2em;">
            <div class="col-xs-4">
                <?php
                    echo $l_set_name; //->generateHTML()
                    echo "<br />";
                    echo $l_set_name_subtext; //->generateHTML()
                    echo "<br />";
                    echo $i_set_name->generateHTML();
                    echo "<br />";
                    echo $l_set_desc;  //->generateHTML()
                    echo "<br />";
                    echo $l_set_desc_subtext;   //->generateHTML()
                    echo "<br />";
                    echo $i_set_desc->generateHTML();
                ?>
            </div>
            <div class="col-xs-8">
                <?php
                    echo $pnl_tab1_side->generateHTML();
                ?>
            </div>
        </div>
        <div id="operations_area" class="row" style="margin-top:2em;padding-left:2em;padding-right:2em;display:none;">
            <div class="col-xs-4">
                <div id="operations_list" class="row" style="margin:0;padding:0;">
                    <?php echo $l_op_li; //->generateHTML(); ?>
                    <br />
                    <div class="col-xs-12" style="height:148px;overflow:auto;padding:0;">
                        <?php echo $op_li; ?>
                    </div>
                </div>
                <br />
                <div id="tech_diciplins_list" class="row" style="margin:0;padding:0;">
                    <?php echo $l_tech_discipline_li; //->generateHTML() ?>
                    <br />
                    <div class="col-xs-12" style="height:148px;overflow:auto;padding:0;">
                        <?php echo $tech_discipline_li; ?>
                    </div>
                </div>
            </div>
            <div class="col-xs-8">
                <?php
                    echo $pnl_tab2_side->generateHTML();
                ?>
            </div>
        </div>
    </div>
</div>-->