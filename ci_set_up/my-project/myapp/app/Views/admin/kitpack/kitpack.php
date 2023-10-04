<?php
$check = new HTML_Checkbox("remember_config_type","remember_config_type",lang("remember_configuration_type"),$data["remember_config_type"],$value="check_config",true,true,true,array(),array("grey"),array());
$saveEnabled = ($data["remember_config_type"]?"1":"0");
?>
<div class="row text-center">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 center">
		<h3 class="text-success"><strong><?php echo lang("kitpack_wizard_selection_title"); ?></strong></h3>
		<br />
		<div class="row">
    		<div class="col-xs-1 col-sm-1 col-md-2 col-lg-3">
    		</div>
			<div class="col-xs-5 col-sm-5 col-md-4 col-lg-3">
				<a class="kitpack-wizard-link" remember="<?php echo $saveEnabled ?>" href="<?php echo base_url("admin/kitpack/wizard/1/".$saveEnabled); ?>" style="text-decoration:none;">
    				<div class="panel panel-default kitpack-wizard-choice panel-fixed-height-265">
    					<div class="panel-body white">
    						<h4><strong><?php echo lang("kitpack_wizard_guided_configuration"); ?></strong></h4>
    						<br />
    						<div class="row">
    							<div class="col-xs-12 text-left">
    								<?php echo lang("kitpack_wizard_guided_configuration_desc"); ?>
    								<br /><br />&nbsp;
    							</div>
    						</div>						
    						<div class="row">
    							<div class="col-xs-12 text-right icon-lg">
    								<?php echo E_ICONS::TASKS; ?>
    							</div>
    						</div>
    					</div>
    				</div>
				</a>
			</div>
			<div class="col-xs-5 col-sm-5 col-md-4 col-lg-3">
				<a class="kitpack-wizard-link" remember="<?php echo $saveEnabled ?>" href="<?php echo base_url("admin/kitpack/wizard/0/".$saveEnabled); ?>" style="text-decoration:none;">
    				<div class="panel panel-default kitpack-wizard-choice panel-fixed-height-265">
    					<div class="panel-body white">
    						<h4><strong><?php echo lang("kitpack_wizard_free_configuration"); ?></strong></h4>
    						<br />
    						<div class="row">
    							<div class="col-xs-12 text-left">
    								<?php echo lang("kitpack_wizard_free_configuration_desc"); ?>
    								<br />&nbsp;	
    							</div>
    						</div>
    						<div class="row">
    							<div class="col-xs-12 text-right icon-lg">
    								<?php echo E_ICONS::TABLE; ?>
    							</div>
    						</div>
    					</div>					
    				</div>				
				</a>
			</div>
	   		<div class="col-xs-1 col-sm-1 col-md-2 col-lg-3">
    		</div>
		</div>
		<div class="row">
	   		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
	   			<?php echo $check->generateHTML(); ?>
    		</div>
		</div>
	</div>
</div>