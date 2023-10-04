<?php 
//die("<pre>".print_r($data,true)."</pre>");
$options_mat = HTML_Select::buildOptions($data["mats"], "component_id", "material_short_text", null, lang("select_material"),false,true,false);
$select_mat ='<select id="select_material" name="select_material" role="select" data-allow-clear="1" class="panel-control panel-title-button" style="width:100%">
                '.$options_mat.'
              </select>';

$options_warn = HTML_Select::buildOptions($data["warnings"], "warning_id", "warning_short", null, lang("select_warning"),false,true,false);
$select_warn ='<select id="select_warning" name="select_warning" role="select" data-allow-clear="1" class="panel-control panel-title-button" style="width:100%">
                '.$options_warn.'
              </select>';

?>
<div class="row">
	<div class="col-xs-6">
		<?php echo $select_mat; ?>
	</div>
	<!-- <div class="col-xs-2">
		<?php echo lang("equals"); ?>
	</div>-->
	<div class="col-xs-6">
		<?php echo $select_warn ?>
	</div>
</div>
<hr />
<div class="row">
	<div class="col-xs-12 text-right">
		<button id="btn_add_assignment" type="button" class="panel_title-button"><?php echo lang("add"); ?></button>
	</div>
</div>
