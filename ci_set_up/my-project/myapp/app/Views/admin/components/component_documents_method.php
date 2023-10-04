<?php
	
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$gallery_links = '';
	$component_id = $data["component_id"];
	$component_documents = $data["component_documents"];
	
	$this->load->library("BASE_Downloader");
	
	$downloader 					= new BASE_Downloader();
	
	if (count($component_documents) > 0)
	{
		$return = '<ul style="list-style: inside;">';
		
		foreach ($component_documents as $index => $document)
		{
			$btn_delete 		= '<a onclick="$.components.delete_document(\''.$component_id.'\',\''.$document->document_id.'\')" class="delete-component-document text-danger">'.E_ICONS::REMOVE.'</a>&nbsp;';
			$btn_download 		= '<a onclick="$.components.download_document(\''.$document->document_id.'\')" class="download-component-document">'.E_ICONS::DOWNLOAD.'&nbsp;'.$document->document_name.'</a>&nbsp;';
			
			$return .= '<li>&nbsp;&nbsp;&nbsp;'.$btn_delete.$btn_download.'<br></li>';
		}
		
		$return .= '</ul>';
	}
	else
	{
		$return = lang("no_documents");
	}
	
	
	$uploader_placeholder = new HTML_Anchor("upload_component_documents", lang("select_file"), "#");
	$uploader_placeholder->addClass("btn btn-primary btn-block text-center")->setStyles(array("margin-left" => "1.5em;"));
	
	$upload_btn = '<input id="input_upload_component_documents" name="upload_component_documents[]" multiple class="btn btn-block btn-default" type="file">';
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