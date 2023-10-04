<?php if (ENVIRONMENT == E_ENVIRONMENT::DEVELOPMENT): ?>
	<div class="row">
		<div class="col-xs-12">
			<?php //echo buildPageAlerts($error, $success, $warning, $info); ?>
		</div>
	</div>
<?php endif; 

?>
<div class="row">
	<div class="col-xs-12">
		<div class="jumbotron">
			<h1>
				<?php
				if ($title)	echo $title;
				else echo lang("error");
				?>
			</h1>
  			<p><?php echo $error; ?></p>
			<br><br>
		</div>
	</div>
</div>