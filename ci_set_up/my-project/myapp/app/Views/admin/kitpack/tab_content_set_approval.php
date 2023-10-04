<?php

//die("<pre>".print_r($data["permissions"],true)."</pre>");

$kitpack =  new T_Kitpack($data["kitpack"]);
//die("<pre>".print_r($kitpack,true)."</pre>");
$columns = array(
    new HTML_DTColumn("material_name",lang("name"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array(),array()),
    new HTML_DTColumn("material_amount",lang("amount"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    new HTML_DTColumn("material_unit",lang("material_unit"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    new HTML_DTColumn("material_price",lang("kitpack_price"),E_SORTABLE::YES,($data["permissions"][E_PERMISSIONS::KITPACKS_SHOW_PRICES]?E_VISIBLE::YES:E_VISIBLE::NO),E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    new HTML_DTColumn("material_img",lang("pictures"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array(),array()),
    new HTML_DTColumn("material_docs",lang("data"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array(),array()),
    new HTML_DTColumn("material_wrapping_cloth",lang("wrapping_cloth"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array("width"=>"80px","min-width"=>"80px"),array(),array()),
    new HTML_DTColumn("material_editor_comment",lang("comment"),E_SORTABLE::YES,E_VISIBLE::YES,E_SEARCHABLE::YES,null,array(),array(),array())
);

$dt = new HTML_Datatable("release_table",$columns,array(),null,E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array());

$no_sample_checked = E_CHECKED::YES;
$unsterile_sample_checked = E_CHECKED::NO;
$sterile_sample_checked = E_CHECKED::NO;
if(intval($kitpack->unsterile_sample) == 1)
{
    $no_sample_checked = E_CHECKED::NO;
    $unsterile_sample_checked = E_CHECKED::YES;
}
if(intval($kitpack->sterile_sample) == 1)
{
    $no_sample_checked = E_CHECKED::NO;
    $sterile_sample_checked = E_CHECKED::YES;
}
/*$no_sample_checked = $kitpack->no_sample == "1" ? E_CHECKED::YES : E_CHECKED::NO;
$unsterile_sample_checked = $kitpack->unsterile_sample == "1" ? E_CHECKED::YES : E_CHECKED::NO;
$sterile_sample_checked = $kitpack->sterile_sample == "1" ? E_CHECKED::YES : E_CHECKED::NO;
$std_kitpack_checked = $kitpack->is_standard == "1" ? E_CHECKED::YES : E_CHECKED::NO;*/
if($data["permissions"]["no_samples"])
{
    $no_sample_visible = E_VISIBLE::NO;
    $unsterile_visible = E_VISIBLE::NO;
    $sterile_visible = E_VISIBLE::NO;
    $amount_visible = E_VISIBLE::NO;
    $delivery_date_sample_visible = E_VISIBLE::NO;
}
else
{
    if($data["permissions"]["no_unsterile_samples"])
    {
        $no_sample_visible = E_VISIBLE::YES;
        $unsterile_visible = E_VISIBLE::NO;
        $sterile_visible = E_VISIBLE::YES;
        $amount_visible = E_VISIBLE::YES;
        if($data["permissions"]["can_set_delivery_date"])
        {
            $delivery_date_sample_visible = E_VISIBLE::YES;
        }
        else
        {
            $delivery_date_sample_visible = E_VISIBLE::NO;
        }
    }
    else
    {
        if($data["permissions"]["no_sterile_samples"])
        {
            $no_sample_visible = E_VISIBLE::YES;
            $unsterile_visible = E_VISIBLE::YES;
            $sterile_visible = E_VISIBLE::NO;
            $amount_visible = E_VISIBLE::YES;
            if($data["permissions"]["can_set_delivery_date"])
            {
                $delivery_date_sample_visible = E_VISIBLE::YES;
            }
            else
            {
                $delivery_date_sample_visible = E_VISIBLE::NO;
            }
        }
        else
        {
            $no_sample_visible = E_VISIBLE::YES;
            $unsterile_visible = E_VISIBLE::YES;
            $sterile_visible = E_VISIBLE::YES;
            $amount_visible = E_VISIBLE::YES;
            if($data["permissions"]["can_set_delivery_date"])
            {
                $delivery_date_sample_visible = E_VISIBLE::YES;
            }
            else
            {
                $delivery_date_sample_visible = E_VISIBLE::NO;
            }
        }
    }
}
if($data["permissions"]["can_set_std_kit"])
{
    $std_kitpacks_visible = E_VISIBLE::YES;
}
else
{
    $std_kitpacks_visible = E_VISIBLE::NO;
}

if($data["permissions"]["can_set_delivery_date"])
{
    $delivery_date_visible = E_VISIBLE::YES;
    $account_delivery_date = 1;
}
else
{
    $delivery_date_visible = E_VISIBLE::NO;
    $account_delivery_date = 0;
}
$cb_no_sample = new HTML_Radio("cb_no_sample","cb_sample",lang("no_sample"),$no_sample_checked,0,E_ENABLED::YES,E_INLINE::YES,$no_sample_visible,array("hyphens"=>"none"),array('cb_sample'),array());
$cb_unsterile_sample = new HTML_Radio("cb_unsterile_sample","cb_sample",lang("unsterile_sample"),$unsterile_sample_checked,1,E_ENABLED::YES,E_INLINE::YES,$unsterile_visible,array("hyphens"=>"none"),array('cb_sample'),array());
$cb_sterile_sample = new HTML_Radio("cb_sterile_sample","cb_sample",lang("sterile_sample"),$sterile_sample_checked,2,E_ENABLED::YES,E_INLINE::YES,$sterile_visible,array("hyphens"=>"none"),array('cb_sample'),array());
$is_std_kitpack = new HTML_Checkbox("cb_is_std_kitpack", "cb_is_std_kitpack", lang("standard_kitpack"), $std_kitpack_checked, "std_kitpack", E_ENABLED::YES, E_INLINE::YES, $std_kitpacks_visible,array(),array(),array());
$ta_additional = new HTML_TextArea("ta_additions", "ta_additions", "", lang("additions"),E_VISIBLE::YES,E_ENABLED::YES,array("width:100%;resize:none;"),array(),array());

$if_amount = new HTML_Input("if_amount","if_amount",E_INPUTTYPE::NUMBER,"",$kitpack->sample_amount,"","",E_ENABLED::YES,$amount_visible,array("width"=>"60px"),array(),array());
$fi_amount_item = new HTML_FormItem(lang("amount"), "if_amount_item", "if_amount_item", array(), E_REQUIRED::NO, array(4,8), "", $amount_visible,E_ENABLED::YES,array("margin-bottom"=>0,"display"=>"none","hyphens"=>"none"),array(),array());
$fi_amount_item->setLabelStyles(array("font-weight"=>"normal !important","hyphens"=>"none"));
$fi_amount_item->addComponent($if_amount);

$if_delivery_date_sample = new HTML_Datepicker("if_delivery_date_sample","if_delivery_date_sample",date(lang("date_format"),strtotime('+9 day')),lang("delivery_date_sample"), lang("date_format_long"), $delivery_date_sample_visible, E_ENABLED::YES, array(), array(), array());
$if_delivery_date_sample->setDaysOfWeekDisabled(array());
$fi_delivery_date_sample_item = new HTML_FormItem(lang("delivery_date_sample"), "fi_delivery_date_sample_item", "fi_delivery_date_sample_item", array(), E_REQUIRED::NO, array(6,6), "", $delivery_date_sample_visible, array("width"=>"80px"),array(),array());
$fi_delivery_date_sample_item->setLabelStyles(array("font-weight"=>"normal !important","hyphens"=>"none"));
$fi_delivery_date_sample_item->addComponent($if_delivery_date_sample);

$if_delivery_date_order = new HTML_Datepicker("if_delivery_date_order","if_delivery_date_order",date(lang("date_format"),strtotime('+9 day')),lang("delivery_date_order"), lang("date_format_long"), $delivery_date_visible, E_ENABLED::YES, array(), array(), array());
$if_delivery_date_order->setDaysOfWeekDisabled(array());
$fi_delivery_date_order_item = new HTML_FormItem(lang("delivery_date_order"), "fi_delivery_date_order_item", "fi_delivery_date_order_item", array(), E_REQUIRED::NO, array(6,6), "", $delivery_date_visible, array("width"=>"80px"),array(),array());
$fi_delivery_date_order_item->setLabelStyles(array("font-weight"=>"normal !important","hyphens"=>"none"));
$fi_delivery_date_order_item->addComponent($if_delivery_date_order);

$hidden_account_delivery_date = new HTML_Input("i_account_delivery_date", "account_delivery_date", E_INPUTTYPE::HIDDEN, "", $account_delivery_date) ;

function SetStyle($param)
{
    if($param == E_VISIBLE::YES)
    {
        return "";
    }
    else
    {
        return " style=\"display:none;\"";
    }
}
?>
<?php echo $hidden_account_delivery_date->generateHTML(); ?>
<div class="row">
	<div class="col-lg-2 col-md-6 col-sm-6 col-xs-12 pull-left" id="additionals" style="display:none;">

	    <br />
        <div class=""><?php echo lang("additions"); ?>:</div>
        <div class="">
            <?php echo $ta_additional->generateHTML(); ?>
        </div>

	</div>

    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12" id="delivery_date" style="">
        <br />
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <?php echo $fi_delivery_date_sample_item->generateHTML(); ?>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <?php echo $fi_delivery_date_order_item->generateHTML(); ?>
            </div>
        </div>
    </div>

	<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 pull-right">
		<br />
		<div class="row">
			<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right" <?php echo SetStyle($amount_visible); ?>>
			<?php echo $fi_amount_item->generateHTML(); ?>
			</div>	
			<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right" <?php echo SetStyle($sterile_visible); ?>>
			<?php echo $cb_sterile_sample->generateHTML(); ?>
			</div>
			<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right" <?php echo SetStyle($unsterile_visible); ?>>
			<?php echo $cb_unsterile_sample->generateHTML(); ?>
			</div>			
			<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right" <?php echo SetStyle($no_sample_visible); ?>>
			<?php echo $cb_no_sample->generateHTML(); ?>
			</div>			
			<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right" <?php echo SetStyle($std_kitpacks_visible); ?>>
			<?php echo $is_std_kitpack->generateHTML(); ?>
			</div>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-xs-12">
		<?php echo $dt->generateHTML(); ?>
	</div>
</div>
