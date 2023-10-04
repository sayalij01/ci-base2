<?php
	
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$component_id = $data["component_id"];
	$component_images = $data["component_images"];

	
	if (count($component_images) > 0)
	{
		$return = '<ul style="list-style: inside;">';
		
		foreach ($component_images as $image)
		{
			$btn_delete 		= '<a onclick="$.components.delete_image(\''.$component_id.'\',\''.$image->image_id.'\')" class="delete-component-image text-danger">'.E_ICONS::REMOVE.'</a>&nbsp;';
			$btn_download 		= '<a onclick="$.components.download_image(\''.$image->image_id.'\')" class="download-component-image">'.E_ICONS::DOWNLOAD.'&nbsp;'.$image->image_name.'</a>&nbsp;';
			
			$return .= '<li>&nbsp;&nbsp;&nbsp;'.$btn_delete.$btn_download.'<br></li>';
		}
		
		$return .= '</ul>';
	}
	else
	{
		$return = lang("no_images");
	}
	
	
	$uploader_placeholder = new HTML_Anchor("upload_component_image", lang("select_file"), base_url("admin/components/components_images_upload"));
	$uploader_placeholder->addClass("btn btn-primary btn-block text-center")->setStyles(array("margin-left" => "1.5em;"));
	
	$upload_btn = '<input id="input_upload_component_images" name="upload_component_images[]" multiple class="btn btn-block btn-default" type="file">';
	
?>
<div class="row">
	<div class="col-xs-12">
		<?php echo $return; ?>
	</div>
</div>
<div class="row">
	<div class="col-xs-12">
		<?php echo $upload_btn; ?>
	</div>
</div>