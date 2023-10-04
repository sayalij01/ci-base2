<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
	
	$btn_upload_ops = "";
    $uploadOPS = false;
	if (BASE_Controller::hasPermission(E_PERMISSIONS::UPLOAD_OPS_CODES))
	{
		//$btn_upload_ops = new HTML_Button("btn_upload_ops", "upload_ops", lang("upload_ops_codes"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::PLUS, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
		///$btn_upload_ops->setAnchor(base_url("admin/potential/create"));
		//$btn_upload_ops = $btn_upload_ops->generateHTML();
        $uploadOPS = true;
	}
		
	
	$tbl 		= new HTML_Datatable("tbl_potential", T_Potential::get_table_columns(), $data["table_data"] );
	
	$pnl 		= new HTML_Panel("pnl_potential", "", $page_alerts.$tbl->generateHTML(), $btn_upload_ops);
	$pnl->setCollapsed(false);
    $upload_btn = '<input id="input_upload_ops" name="upload[]" multiple class="btn btn-block btn-default" type="file">';
?>

<div class="row">

	<div class="col-xs-12">
		
		<ul id="tab-list-potential" class="nav nav-tabs fadeInRight">
			<li class="tab_header active">
				<a class="tab_links not_clickable" data-toggle="tab" href="#tab-potential">Potenzial</a>
			</li>
		</ul>
		
		<div class="tab-content">
			<div id="tab-potential" class="tab-pane fade in active no-padding">

				<div id="pnl_potential" name="pnl_potential" title="" class="panel panel-default" data-original-title="" style="margin-bottom: 0px">
					<div class="panel-heading" style="height: 75px;">
						<label class="panel-title" style="height: 100%; bottom: 0px;"><small></small><br>
							<span class="text-default"><?php echo sprintf("Es wurden %s Kitpacks für Ihre OPS vorgeschlagen.", 123);?></span>
							<span class="text-warning"><?php echo sprintf("Von %s OPS konnte kein Referenz-Set gefunden werden.", 10);?></span>
						</label>
                            <?php //button should only be available if right is set
                                    if ($uploadOPS)
                                    {
                            ?>

                                    <span id="pnl_potetial-titleControl" class="panel-titel-controls btn-group pull-right">
                                        <button id="btn_upload_ops" title="" type="button" class="panel-control panel-title-button " data-original-title="">
                                            <i class="fa fa-upload" aria-hidden="true"></i>&nbsp;
                                        </button>
                                    </span>
                             <?php
                                    }
                            ?>
					</div>
                            <?php //upload should only be available if right is set
                                if ($uploadOPS)
                                {
                            ?>
                            <div class="row">
                                <div class="col-lg-8"></div>
                                <div class="col-lg-4">
                                <div id="pnl_potential-upload" style=" background-color: inherit; " class="hidden">
                                    <p class="text-center"><label class="custom-file-label text-center" for="input_upload_ops"><?php echo lang("select_files"); ?></label></p>
                                    <?php echo $upload_btn; ?>
                                </div>

                                </div>
                            </div>
                            <?php
                                }
                            ?>
					<div id="pnl_potential-body" class="panel-body collapse in ">
						<?php echo $tbl->generateHTML();?>
					</div>
				</div>
				<div class="clearfix"></div>
			</div>
		</div>

	</div>

	<div class="col-xs-12">
		<ul id="tab-list" class="nav nav-tabs fadeInRight">
			<li tab="1" class="tab_header active">
				<a class="tab_links not_clickable" data-toggle="tab" pane="tab1" href="javascript:void(0)">Tipps: Übernehmen Sie ein Referenz-Set für Ihre Eingriffe</a>
			</li>
		</ul>
	
	</div>
</div>
<script>
	var tbl_columns_potential = <?php echo json_encode(T_Potential::get_table_columns()); ?>;
</script>
