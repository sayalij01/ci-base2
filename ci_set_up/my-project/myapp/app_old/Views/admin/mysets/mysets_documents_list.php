<?php
	
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$gallery_links = '';
	$component_id = $data["kitpack_id"];
	$kitpack_documents = $data["kitpack_documents"];
	
	$this->load->library("BASE_Downloader");
	
	$downloader 					= new BASE_Downloader();
	
	if (count($kitpack_documents) > 0)
	{
		$return = '<ul style="line-height: 3em; list-style: inside;">';
		
		foreach ($kitpack_documents as $index => $document)
		{
			$btn_download 		= '<a onclick="$.mysets.download_document(\''.$document->document_id.'\')" class="btn btn-primary download-component-document">'.E_ICONS::DOWNLOAD.'&nbsp;'.$document->document_name.'</a>&nbsp;';
			
			$return .= '<li>&nbsp;&nbsp;&nbsp;'.$btn_download.'<br></li>';
		}
		
		$return .= '</ul>';
	}
	else
	{
		$return = lang("no_documents");
	}
	
	echo $return;
?>