<?php
	$change_action = array("Reihenfolge 1", "Reihenfolge 2","Austausch", "Entfernt");
    
    for ($i=0; $i<4;$i++)
    {
     
	    $componentsA["abwurfbeutel"][] = array(
		    "name" => "Comp ".($i+1),
		    "price" => $i+1,
		    "amount" => 2,
		    "img" => base_url()."/resources/img/app_icons/placeholder.jpg",
            "action" => $change_action[rand(0, count($change_action) - 1)]
	    );
	
	    if ($i < 2)
        {
	        $componentsA[] = array(
		        "name" => "Comp ".($i+1),
		        "price" => $i+1,
		        "amount" => 2,
		        "img" => base_url()."/resources/img/app_icons/placeholder.jpg",
		        "action" => $change_action[rand(0, count($change_action) - 1)]
	        );
		   
        }
	    
    }
    
    
    $left = "";
    $right = "";
	
    $i = 0;
	foreach ($componentsA as $index => $component)
	{
	    if (!is_numeric($index))
        {
            $left .=
            ' <fieldset>
                <legend class="text-primary">
                    &nbsp;&nbsp;'.file_get_contents(base_url("resources/img/packaging/abwurfbeutel.svg")).'&nbsp;&nbsp;'.$index.'&nbsp;&nbsp;
                </legend>
            ';
	        $removed = $component["action"] == "Entfernt" ? "removed" : "";
	        
	        $right .='<br><br>';
	        foreach ($component as $indx => $comp)
	        {
		        $text_class = $comp["action"] == "Entfernt" ? "text-danger" : "text-warning";
		        $removed = $comp["action"] == "Entfernt" ? "removed" : "";
		        $left .=
			        '<div class="component-detail-box text-primary '.$removed.'">
                        <div class="row no-margin no-padding">
                            <div class="col-sm-2 col-xs-12 bg-primary details-component-sort-box">
                                <i class=\'fa fa-ellipsis-v\'></i>
                                <div class="counter">&nbsp;&nbsp;'.($i+1).'</div>
                            </div>
                            <div class="col-sm-6 col-xs-12" style="color: initial;">
                                <div class="row">
                                    <div class="col-sm-4 col-xs-12">
                                    <img src="'.($comp["img"]).'" style="width:22px;" />
                                    </div>
                                    <div class="col-sm-8 col-xs-12">
                                    '.($comp["name"]).'
                                    </div>                                    
                                </div>
                            </div>
                            <div class="col-sm-2 col-xs-12" style="color: initial;">
                                '.format_currency($comp["price"], "EUR").'
                            </div>
                            <div class="col-sm-2 col-xs-12" style="color: initial;">
                                <span class="badge badge-light">'.$comp["amount"].'</span>
                            </div>
                        </div>
                    </div>';
		
		        $right .='<div class="component-action-box text-primary"><span class="'.$text_class.'">'.$comp["action"].'</span></div>';
	        }
	        $left .= "</fieldset>";
	        $right .='<div style="height: 10px;"></div>';
        }
	    else
        {
	        $removed = $component["action"] == "Entfernt" ? "removed" : "";
	        $left .=
            '<div class="component-detail-box text-primary '.$removed.'">
                <div class="row no-margin no-padding">
                    <div class="col-sm-2 col-xs-12 bg-primary details-component-sort-box">
                        <i class=\'fa fa-ellipsis-v\'></i>
                        <div class="counter">&nbsp;&nbsp;'.($i+1).'</div>
                    </div>
                    <div class="col-sm-6 col-xs-12" style="color: initial;">
                                <div class="row">
                                    <div class="col-sm-4 col-xs-12">
                                    <img src="'.($component["img"]).'" style="width:22px;" />
                                    </div>
                                    <div class="col-sm-8 col-xs-12">
                                    '.($component["name"]).'
                                    </div>                                    
                                </div>                    
                    </div>
                    <div class="col-sm-2 col-xs-12" style="color: initial;">
                        '.format_currency($component["price"], "EUR").'
                    </div>
                    <div class="col-sm-2 col-xs-12" style="color: initial;">
                        <span class="badge badge-light">'.$component["amount"].'</span>
                    </div>
                </div>
            </div>';
	        
	        $text_class = $component["action"] == "Entfernt" ? "text-danger" : "text-warning";
	        $right .='<div class="component-action-box text-primary"><span class="'.$text_class.'">'.$component["action"].'</span></div>';
        }
    }
    
?>

<div class="row">
	<div class="col-xs-12">
		<table class="table set_contents" style="width:100%; border: 1px solid #ddd; height:490px; max-height:490px; overflow-y:scroll;">
			<thead style="background-color: #DCDCDC;">
			<tr>
				<th>Pack-Reihe</th>
				<th>Komponenten Name</th>
				<th>Preis</th>
				<th>Stückzahl</th>
				<th>Änderung</th>
			</tr>
			</thead>
			<tbody style="background: white;">
			<tr>
				<td colspan="5">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="set_components_details">
                                <?php echo $left; ?>
                            </div>
                        </div>
                        <div class="col-xs-12 ">
                            <?php echo $right; ?>
                        </div>
                    </div>
                </td>
			</tr>
			</tbody>
		</table>
	</div>
	
	<div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <div class="set-changelog" style="background: #F5F5F5; padding: 1.5em; max-height:525px; overflow-y:scroll;">
            <strong>Changelog</strong>
            <br><br>
            Aktion: Artikel wurde von Position 3 auf 1 verschoben<br>
            Datum: 10.12.2020 09:36<br>
            Benutzer: Freigabe_User1<br>
            Betroffene Artikel:<br>
            - Raucodrape PRO + (Menge: 2)<br>
            <hr>
            Aktion: Artikel wurde von Position 2 auf 3 verschoben<br>
            Datum: 10.12.2020 09:37<br>
            Benutzer: Freigabe_User1<br>
            Betroffene Artikel:<br>
            - Disposima Kru 40x60/6 300Stk (Menge: 1)<br>
            <hr>
            Aktion: Artikel wurde von Position 3 auf 1 verschoben<br>
            Datum: 10.12.2020 09:36<br>
            Benutzer: Freigabe_User1<br>
            Betroffene Artikel:<br>
            - Raucodrape PRO + (Menge: 2)<br>
            <hr>
            Aktion: Artikel wurde von Position 2 auf 3 verschoben<br>
            Datum: 10.12.2020 09:37<br>
            Benutzer: Freigabe_User1<br>
            Betroffene Artikel:<br>
            - Raucodrape PRO + (Menge: 2)<br>
            <hr>
            Aktion: Artikel wurde von Position 2 auf 3 verschoben<br>
            Datum: 10.12.2020 09:37<br>
            Benutzer: Freigabe_User1<br>
            Betroffene Artikel:<br>
            - Disposima Kru 40x60/6 300Stk (Menge: 1)<br>
            <hr>
            Aktion: Artikel wurde von Position 3 auf 1 verschoben<br>
            Datum: 10.12.2020 09:36<br>
            Benutzer: Freigabe_User1<br>
            Betroffene Artikel:<br>
            - Raucodrape PRO + (Menge: 2)<br>
            <hr>
            Aktion: Artikel wurde von Position 2 auf 3 verschoben<br>
            Datum: 10.12.2020 09:37<br>
            Benutzer: Freigabe_User1<br>
            Betroffene Artikel:<br>
            - Raucodrape PRO + (Menge: 2)<br>
        </div>
	</div>
</div>