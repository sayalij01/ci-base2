<?php
	$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);
	$hidden_link_id = "";
	$hidden_client_id = "";
	$hidden_user_id = "";
    if (is_array($data['user_data']) )
    {
        $user_data = $data['user_data'];
        if (!is_null($user_data['link_id']))
        {
    		$hidden_link_id = new HTML_Input("hidden_link_id", "link_id",E_INPUTTYPE::HIDDEN, "", $user_data['link_id']);
    		$hidden_link_id = $hidden_link_id->generateHTML();
        }
		$hidden_client_id = new HTML_Input("hidden_client_id", "client_id",E_INPUTTYPE::HIDDEN, "", $user_data['client_id']);
		$hidden_client_id = $hidden_client_id->generateHTML();
		$hidden_user_id = new HTML_Input("hidden_user_id", "user_id",E_INPUTTYPE::HIDDEN, "", $user_data['user_id']);
		$hidden_user_id = $hidden_user_id->generateHTML();
    }
?>
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
                <img src="<?php echo base_url()."/resources/img/app_icons/mykitpack_256x96.png";?>" style="width:450px" />
                <br />

                <div class="panel panel-default login-panel">

                    <div class="panel-body">

						<?php echo form_open('admin/change_password', array('id'=>'form_change_password', 'name'=>'form_change_password', 'class'=>'form form-horizontal'));?>

                        <legend style="color: white;"><?php echo lang("change_password")?></legend>
                        <p><?php echo $page_alerts;?></p>

                        <div id="lbl_password" class="form-group required <?php echo (form_error('password') != "" ? E_VALIDATION_STATES::HAS_ERROR:'');?>">
                            <div class="col-xs-12">
                                    <input id="i_password" name="password" value="" type="password" class="form-control" placeholder="<?php echo lang("password")?>">
                            </div>
                        </div>
                        <div id="lbl_password_repeat" class="form-group required <?php echo (form_error('password_repeat') != "" ? E_VALIDATION_STATES::HAS_ERROR:'');?>">
                            <div class="col-xs-12">
                                    <input id="i_password_repeat" name="password_repeat" value="" type="password" class="form-control" placeholder="<?php echo lang("password_repeat")?>">
                            </div>
                        </div>
                        <canvas id="canvas_captcha"></canvas>
                        <div id="lbl_captcha" class="form-group required <?php echo (form_error('captcha') != "" ? E_VALIDATION_STATES::HAS_ERROR:'');?>">
                            <div class="col-xs-12">
                                    <input id="i_captcha" name="captcha" value="" class="form-control" placeholder="<?php echo lang("captcha")?>">
                            </div>
                        </div>
                        <div id="lbl_submit" class="form-group">
                            <div class="col-xs-4"></div>
                            <div class="col-xs-4">
                                <button id="bt_change_password" name="authenticate" type="submit" value="1" class="btn btn-primary btn-block pull-right login-panel-btn"><strong>&nbsp;<?php echo lang("change_password");?></strong></button>
                            </div>
                        </div>
						<?php echo $hidden_link_id;?>
						<?php echo $hidden_client_id;?>
						<?php echo $hidden_user_id;?>

						<?php echo form_close();?>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-8 col-md-8 col-sm-8"></div>
</div>

