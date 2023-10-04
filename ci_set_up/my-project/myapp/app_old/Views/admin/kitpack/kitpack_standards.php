<?php

//echo "<pre>".print_r($data["permissions"],true)."</pre>";
$icons =
'<div id="price_stepper1" class="price_stepper_item price-stepper-icon inactive" title="15 Euro Mindestpreis">'.E_ICONS::DATABASE.'</div>
<div id="price_stepper2" class="price_stepper_item price-stepper-icon-separator bg-primary inactive"></div>
<div id="price_stepper3" class="price_stepper_item price-stepper-icon inactive" title="Ein Zubehör">'.E_ICONS::LISTING.'</div>
<div id="price_stepper4" class="price_stepper_item price-stepper-icon-separator bg-primary inactive"></div>
<div id="price_stepper5" class="price_stepper_item price-stepper-icon inactive" title="Eine OP Abdeckung">'.E_ICONS::FILE_WHITE.'</div>
<div id="price_stepper6" class="price_stepper_item price-stepper-icon-separator bg-primary inactive"></div>
<div id="price_stepper7" class="price_stepper_item price-stepper-icon inactive" title="Ein Kleidungsstück">'.E_ICONS::LEAF.'</div>
';
//echo $_SESSION[E_SESSION_ITEM::CLIENT_RULESET]. "= ".E_RULESETS::RULESET_TYPE_CLINICPARTNER;
if($_SESSION[E_SESSION_ITEM::CLIENT_RULESET] == E_RULESETS::RULESET_TYPE_CLINICPARTNER)
{
    $multiplier = (100+floatval($_SESSION[E_SESSION_ITEM::CLIENT_SERVICE_FEE]))/100;
}
else
{
    $multiplier = 1;
}

?>
<input type="hidden" id="price_multiplier" value="<?php echo $multiplier; ?>">
<div id="whole_tab_standards" class="row" style="margin:0;padding:0; background-color: #f5f5f5; padding-top: 2em;">

	<div class="col-lg-3 col-md-9 col-sm-9 col-xs-10 " style="margin:0;padding:0">
		<ul class="nav nav-tabs fadeInRight">
			<li id="tab_header_standards_hide" class="active" style="width:300px;display:flex;">
				<a class="tab_links clickable special_tab" data-toggle="tab"><?php echo lang("kitpack_standards_tab"); ?></a>
			</li>
			<li id="tab_header_standards_show" class="" style="width:300px;display:none;">
				<a class="tab_links clickable special_tab" data-toggle="tab"><?php echo lang("kitpack_standards_tab_fade_in"); ?></a>
			</li>
		</ul>
	</div>
    <div class="col-lg-2 col-md-5 col-sm-3 col-xs-12 select-glue-points" style="display: none;">
        <button id="btn_glue_points" type="button" class="btn btn-xs btn-default btn-block grey custom_text_umbruch" style="font-weight: bold; font-size: 1.4em;border:0;">
            <!--<i class="fa fa-circle"></i>-->
            <?php echo lang('glue_point')?>
        </button>
    </div>
	<div class="col-lg-2 col-md-5 col-sm-6 col-xs-12  inquire-new-component" style="display: none;">
		<button id="btn_request_button" type="button" class="btn btn-default btn-block grey custom_text_umbruch" style="font-weight: bold; font-size: 1.4em;border:0;">
        	<?php echo lang('request_component_button')?>
        </button>
	</div>
	<div class="col-lg-3 col-md-5 col-sm-6 col-xs-12 text-primary price-stepper" style="display: none;">
	    <?php echo $icons; ?>
	</div>


    <input id="hide_kitpack_price" type="hidden" value="<?php echo ($data["permissions"]["show_price_kitpack"]?"0":"1"); ?>">
	<div class="col-lg-2 col-md-6 col-sm-6 col-xs-12  text-primary price-stepper price-stepper2 text-center" style="font-size: 1.4em; display: none;">
        <span><?php echo lang("price_calculation"); ?></span><br>
        <span id="price" style="opacity: 80%;">0.00</span><span style="opacity: 80%;"> EUR </span>
	</div>
</div>
<div class="row" style="margin:0;padding:0; background-color: #f5f5f5; padding-top: 2em;">
	<div id="tab-content_standards" class="tab-content fadeInLeft">
		<div id="standards1" class="tab-pane fade active in">
			<div class="row" style="margin-top:4em;margin-left:-1.8em;padding-right:2em; background: white;">
				<div class="col-xs-12" id="standard_kitpacks">
				
				</div>
			</div>
		</div>
	</div>
</div>