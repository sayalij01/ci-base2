<?php 

//die("<pre>".print_r($data,true)."</pre>");
$options_all = HTML_Select::buildOptions($data["mats"], "material_number", "material_short_text", null, lang("select_material"),false,true,false);
$select_all ='<select id="select_material" name="select_material" role="select" data-allow-clear="1" class="panel-control panel-title-button" style="width:100%">
                '.$options_all.'
              </select>';

$options_eqv = HTML_Select::buildOptions($data["mats"], "material_number", "material_short_text", null, lang("select_material"),false,true,false);
$select_eqv ='<select id="select_equivalent_material" name="select_equivalent_material" role="select" data-allow-clear="1" class="panel-control panel-title-button" style="width:100%">
                '.$options_all.'
              </select>';

?>
<div class="row">
	<div class="col-xs-5">
		<?php echo $select_all; ?>
	</div>
	<div class="col-xs-2">
		<?php echo lang("equals"); ?>
	</div>
	<div class="col-xs-5">
		<?php echo $select_eqv ?>
	</div>
</div>
<hr />
<div class="row">
	<div class="col-xs-12 text-right">
		<button id="btn_add_equivalence" type="button" class="panel_title-button"><?php echo lang("add"); ?></button>
	</div>
</div>