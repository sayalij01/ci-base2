<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
?>
<div class="row" style="color: #63B450;">
    <div class="col-xs-12">
        <div class="row">
            <div class="col-xs-2"></div>
            <div class="col-xs-8 col-sm-6 col-md-6 col-lg-4">
                <br /><br /><br /><br /><br />
                <!-- <h1><b>MyKit</b></h1> -->
                <!--<h2></h2>
                <h5><i></i></h5>-->
                <img src="<?php echo base_url()."/resources/img/app_icons/mykitpack_256x96.png";?>" style="width:450px" />

                <br />

                <div class="panel panel-default login-panel" id="password-recovery-panel">

                    <div class="panel-body">

						<?php echo form_open('admin/password_recovery/send_link', array('id'=>'form_password_recovery', 'name'=>'form_password_recovery', 'class'=>'form form-horizontal'));?>

                        <legend style="color: white;"><?php echo lang("title_password_vorgotten")?></legend>
                        <p><?php echo $page_alerts;?></p>

                        <div id="lbl_username" class="form-group required <?php echo (form_error('username') != "" ? E_VALIDATION_STATES::HAS_ERROR:'');?>">
                            <div class="col-xs-12">
                                <div class="input-group">
                                    <span class="input-group-addon input-group-prepend"><?php echo E_ICONS::USER_CIRCLE_WHITE; ?></span>
                                    <input id="i_username" name="username" value="" type="text" class="form-control" placeholder="<?php echo lang("username")?>" aria-describedby="basic-addon2">
                                </div>
                            </div>
                        </div>
                        <div id="msg_mail_sent_info"></div>
                        <div id="lbl_submit" class="form-group">
                            <div class="col-xs-4"></div>
                            <div class="col-xs-4">
                                <button id="bt_send_link" name="send_link" type="submit" value="1" class="btn btn-primary btn-block pull-right login-panel-btn"><strong>&nbsp;<?php echo lang("send_password_recovery_link");?></strong></button>
                            </div>
                        </div>

						<?php echo form_close();?>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-8 col-md-8 col-sm-8"></div>


    <div class="col-lg-4 col-md-2 col-sm-2">
		<?php
			//echome($this->session, true);
		?>

    </div>
</div>
