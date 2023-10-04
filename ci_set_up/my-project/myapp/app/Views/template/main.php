<?php 
	/**
	 * This templates brings all parts together which will be placed within the "body-tag" by the skeleton template
	 * 
	 * - The template for the top navigation a.k.a the menu (template/menu)
	 * - The main container
	 *   - the page heading
	 *   - the breadcrump
	 *   - the content body which is filled with the view, we want to show
	 * - The footer template (templates/footer)
	 * 
	 * @author Marco Eberhardt
	 * @category View
	 * @package application\views\template\main
	 * @version 1.1
	 */
?>
<?php 
	$cls_hasNav 		= ($hasNav === true  ? 'has-fixed-nav' : '');			// will be recognized by global.css (ad padding when fixed)
	$cls_hasFooter 		= ($hasFooter === true  ? 'has-footer' : '');	// will be recognized by global.css (ad padding when fixed)
	$cls_hasSidebar 	= ($hasSidebar === true ? 'has-sidebar' : '');	// will be recognized by global.css
	
	$cls_app_container 	= ($sidebar_expanded == 1 ? ' expanded': '' );
	// $cls_app_container .= $bg_class;
	
	
	$cls_main_container = ('fluid_layout' ? "container-fluid" : "container");
	$cls_sidebody		= "side-body side-body-";
	
?>
<div id="app-container" class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
	<!-- <div class="row content-container"> -->
		
		<?php if (isset($menu)){ echo $menu; }?>
		
		<!-- Main container -->
			
				<?php 
					if (isset($pageHeading)){ 
						echo $pageHeading;
					}
					
				?>
				<?php 
					//echome("Expand [".$bg_class."]");
					//echo nl2br(print_r($_SESSION, true));
				?>	
				<div class="app-main">
					<div class="app-sidebar sidebar-shadow">
						<div class="app-header__logo">
						<!-- <div class="logo-src"></div> -->
						</div>
						<?php if (isset($sidebar)){ echo $sidebar; }?>

						
						</div>	
					<div class="app-main__outer">
							<div class="app-main__inner">
								
								<?php 
								if (isset($breadcrump)){
									echo $breadcrump;
								}
									if (isset($content_body)){
										echo $content_body;
									}
								?>
							</div>
						
					
		<?php if (isset($footer)){echo $footer;} ?>
	<!-- </div> -->
	
	<div class="device-size device-xs visible-xs" size="xs"></div>
	<div class="device-size device-sm visible-sm" size="sm"></div>
	<div class="device-size device-md visible-md" size="md"></div>
	<div class="device-size device-lg visible-lg" size="lg"></div>
	
</div>