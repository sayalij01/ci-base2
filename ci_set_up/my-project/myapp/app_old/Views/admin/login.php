<div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-4 col-md-6 col-sm-6">
        <div class="card shadow">
          <div class="card-title text-center border-bottom">
            <h2 class="p-3">Login</h2>
          </div>
          <div class="card-body">
		  	<?php echo form_open('login', array('id'=>'form_login', 'name'=>'form_login', 'class'=>'form form-horizontal'));?>
              <div class="mb-4" class="form-group required  <?php echo (service('validation')->hasError('username') ? E_VALIDATION_STATES::HAS_ERROR : ''); ?>">
                <!-- <label for="username" class="form-label">Username</label> -->
				<!-- <span class="input-group-addon input-group-prepend"><?php echo E_ICONS::USER_CIRCLE_WHITE; ?></span> -->
                <input type="text" class="form-control" id="i_username" name="username" placeholder="<?php echo lang("username")?>" />
              </div>
              <div class="mb-4"class="form-group required <?=(service('validation')->hasError('password') ? E_VALIDATION_STATES::HAS_ERROR:'');?>">
			  	<!-- <label for="password" class="form-label">Password</label> -->
			  	<!-- <span class="input-group-addon input-group-prepend"><?php echo E_ICONS::KEY; ?></span> -->
                <input type="password" class="form-control" id="i_password" name="password"  placeholder="<?php echo lang("password")?>" />
              </div>
              <!-- <div class="mb-4">
                <input type="checkbox" class="form-check-input" id="remember" />
                <label for="remember" class="form-label">Remember Me</label>
              </div> -->
              <div class="d-grid">
			  <button id="bt_login" name="authenticate" type="submit" value="1" class="btn btn-primary btn-block">&nbsp;<?php echo lang("log_in");?></button>
              </div>
			<?php echo form_close();?>
          </div>
        </div>
      </div>
    </div>
  </div>