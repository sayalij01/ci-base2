<?php
$list = array();
$show_long = true;
$html = "";
$last_mat_no = "";
foreach($data as $idx=>$warning)
{
    if($last_mat_no != "" && $last_mat_no != $warning["material_number"])
    {
       $html .= '<div class="row">
                	<div class="col-xs-12 pull-right">
                		'.$warning["material_number"].'&nbsp;'.$warning["material_short_text"].'
                	</div>
                </div>
                <div class="row">
                	<div class="col-xs-12">
                		'.implode("<br />",$list).'
                	</div>
                </div>';        
        $list = array();
    }
    if($show_long)
    {
        $list[] = $warning["warning_long"];
    }
    else
    {
        $list[] = $warning["warning_short"];
    }
    $last_mat_no = $warning["material_number"];
}
if(count($list)>0)
{
$html .= '<div class="row">
        	<div class="col-xs-12 pull-right">
        		'.$warning["material_number"].'&nbsp;'.$warning["material_short_text"].'
        	</div>
        </div>
        <div class="row">
        	<div class="col-xs-12">
        		'.implode("<br />",$list).'
        	</div>
        </div>';
}
echo $html;
?>
 
