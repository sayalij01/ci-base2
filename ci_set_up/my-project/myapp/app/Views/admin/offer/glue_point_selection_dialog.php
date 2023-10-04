<?php
//die("<pre>".print_r($data,true)."</pre>");
$glue_point_1 = new HTML_Select("glue_point_1", "glue_point_1",HTML_Select::buildOptions($data["glue_points"],"glue_point_id","glue_point_name","","",false,true,false,null),false,"",E_VISIBLE::YES,E_ENABLED::YES,array(),array("glue_point_selector"),array());
$glue_point_2 = new HTML_Select("glue_point_2", "glue_point_2",HTML_Select::buildOptions($data["glue_points"],"glue_point_id","glue_point_name","","",false,true,false,null),false,"",E_VISIBLE::YES,E_ENABLED::YES,array(),array("glue_point_selector"),array());
$glue_point_3 = new HTML_Select("glue_point_3", "glue_point_3",HTML_Select::buildOptions($data["glue_points"],"glue_point_id","glue_point_name","","",false,true,false,null),false,"",E_VISIBLE::YES,E_ENABLED::YES,array(),array("glue_point_selector"),array());

$positons_options_1 = HTML_Select::buildOptions(Kitpack_model::getGluePointPossiblePositions(1),"id","label","","",false,true,false,null);
$positons_options_2 = HTML_Select::buildOptions(Kitpack_model::getGluePointPossiblePositions(2),"id","label","","",false,true,false,null);
$positons_options_3 = HTML_Select::buildOptions(Kitpack_model::getGluePointPossiblePositions(3),"id","label","","",false,true,false,null);

$glue_point_positions = new HTML_Select("glue_point_position", "glue_point_position","",false,"",E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array());

$button = new HTML_Button("btn_take_glue_points","btn_take_glue_points",lang("apply"),E_COLOR::PRIMARY,"","",E_HORIZONTAL_POSITION::LEFT,E_VISIBLE::YES,E_ENABLED::YES,array("width"=>"100%"),array(),array());

?>
<div id="selected_gluepoints" style="display:none;"><?php echo JSON_ENCODE($data["selected_glue_points"]); ?></div>
<div id="positions_options_1" style="display:none;">
    <?php echo $positons_options_1; ?>
</div>
<div id="positions_options_2" style="display:none;">
    <?php echo $positons_options_2; ?>
</div>
<div id="positions_options_3" style="display:none;">
    <?php echo $positons_options_3; ?>
</div>
<div class="row">
    <div class="col-xs-3">
        <?php echo lang("glue_point")." 1:"; ?>
    </div>
    <div class="col-xs-6">
        <?php echo $glue_point_1->generateHTML(); ?>
    </div>
    <div class="col-xs-3">
    </div>
</div>
<div class="row">
    <div class="col-xs-3">
        <?php echo lang("glue_point")." 2:"; ?>
    </div>
    <div class="col-xs-6">
        <?php echo $glue_point_2->generateHTML(); ?>
    </div>
    <div class="col-xs-3">
    </div>
</div>
<div class="row">
    <div class="col-xs-3">
        <?php echo lang("glue_point")." 3:"; ?>
    </div>
    <div class="col-xs-6">
        <?php echo $glue_point_3->generateHTML(); ?>
    </div>
    <div class="col-xs-3">
    </div>
</div>
<div class="row">
    <div class="col-xs-3">
        <?php echo lang("glue_point_position")." :"; ?>
    </div>
    <div class="col-xs-6">
        <?php echo $glue_point_positions->generateHTML(); ?>
    </div>
    <div class="col-xs-3">
    </div>
</div>
<div class="row">
    <div class="col-xs-4">
    </div>
    <div class="col-xs-4">
        <br />
        <?php echo $button->generateHTML(); ?>
        <br />
    </div>
    <div class="col-xs-4">
    </div>
</div>