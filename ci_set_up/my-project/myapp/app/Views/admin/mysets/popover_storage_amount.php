
<?php
$id = "popover_".$data["kitpack_id"];
$popover_html = 
'<div id = "'.$id.'">'.
	'<div>'.
		'<span style= "font-weight: bold;">'.
			'<span class="'.$data["storage_amount_class"].'">'.$data["storage_amount"].'</span>&nbsp;'.lang("kitpack_amount").'&nbsp;'.
			'<span class="'.$data["storage_amount_class"].'">'.E_ICONS::EXCLAMATION_CIRCLE.'</span>'.
		'</span>'.
	'</div>'.
	'<div>'.
		'<small>'.lang("storage_life").'</small>'.
	'</div>'.
	'<div>'.
		'<span class="'.$data["storage_life_class"].'">'.$data["storage_life"].'</span> &nbsp;&nbsp;'.
		'<span><button id="popover_'.$data["kitpack_id"].'" name="popover_'.$data["kitpack_id"].'" onclick="$.mysets.get_storage_life_table('.$data["kitpack_id"].')" type="button" value="1" class="btn btn-primary storage-life-btn btn-xs">&nbsp;anzeigen</button></span>'.
	'</div>'.
'</div>'
;

echo $popover_html;
?>




