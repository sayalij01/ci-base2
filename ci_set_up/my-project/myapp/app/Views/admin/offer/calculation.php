<?php
$instance = new Calculation($data["permissions"]);
//echo "<pre>".print_r($data,true)."</pre>";
if(count($data["kitpack"]["kitpacks"])>0)
{
    foreach($data["kitpack"]["kitpacks"] as $idx=>$kp)
    {
        $panel = new HTML_Panel("pnl_kitpack_pricing_".$idx,$kp["kitpack_name"],"","",E_DISMISSABLE::NO,E_VISIBLE::YES,E_COLOR::PRIMARY,E_COLOR::PRIMARY,array(),array("kitpack_pricing_panel"),array("idx"=>$idx));
        $panel->setContent($instance->RenderCalculation($kp,$idx));
        $panel->setCollapseable(true);
        if($idx==0)
        {
            $panel->setCollapsed(false);
        }
        else
        {
            $panel->setCollapsed(true);
        }
        $calculation_html .= $panel->generateHTML();
    }
}
else
{
    $panel = new HTML_Panel("pnl_kitpack_pricing_0",lang("new_kitpack"),"","",E_DISMISSABLE::NO,E_VISIBLE::YES,E_COLOR::PRIMARY,E_COLOR::PRIMARY,array(),array("kitpack_pricing_panel"),array("idx"=>$idx));
    $panel->setContent($instance->RenderCalculation(array("user_client_id"=>$data["user_client_id"]),$idx));
    $panel->setCollapseable(true);
    if($idx==0)
    {
        $panel->setCollapsed(false);
    }
    else
    {
        $panel->setCollapsed(true);
    }
    $calculation_html .= $panel->generateHTML();
}

$modalID = "mdl_calculation_overview_sheets";
$mdl_datasheets = new HTML_Dialog($modalID, $modalID, lang("calculation_datasheets"), '<div id="calculation_datasheets"></div>');
$mdl_datasheets->setColor(E_COLOR::PRIMARY)
               ->setSize(E_SIZES::LG)
               ->setVisible(E_VISIBLE::NO);

$modalID = "mdl_access_form_data";
$mdl_access_form_data = new HTML_Dialog($modalID, $modalID, lang("access_form_data"), '<div id="access_form_data"></div>');
$mdl_access_form_data->setColor(E_COLOR::PRIMARY)
                     ->setSize(E_SIZES::LG)
                     ->setVisible(E_VISIBLE::NO);
?>
<div class="row">
    <div class="col-lg-12" style="margin-left:40px;">
       <div id="calc_nav">
           <a class="calc_dropdown-toggle" href="javascript:void(0);">
               <i class="fa fa-bars"> </i>
           </a>
           <ul class="calc_dropdown" style="z-index:9999;">
               <li>
                   <a href="javascript:void(0);" onclick="$.calculation.show_datasheet('<?php echo Calculation::DATASHEET_STERILIZATION_METHODS;?>');"><?php echo lang(Calculation::DATASHEET_STERILIZATION_METHODS);?></a>
               </li>
               <li>
                   <a href="javascript:void(0);" onclick="$.calculation.show_datasheet('<?php echo Calculation::DATASHEET_CALCULATION_FACTORS;?>');"><?php echo lang(Calculation::DATASHEET_CALCULATION_FACTORS);?></a>
               </li>
               <li>
                   <a href="javascript:void(0);" onclick="$.calculation.show_datasheet('<?php echo Calculation::DATASHEET_EXTRA_CHARGE;?>');"><?php echo lang(Calculation::DATASHEET_EXTRA_CHARGE);?></a>
               </li>
               <li>
                   <a href="javascript:void(0);" onclick="$.calculation.show_datasheet('<?php echo Calculation::DATASHEET_CURRENCY_FACTORS;?>');"><?php echo lang(Calculation::DATASHEET_CURRENCY_FACTORS);?></a>
               </li>
               <li>
                   <a href="javascript:void(0);" onclick="$.calculation.show_datasheet('<?php echo Calculation::DATASHEET_ROUTE_DEFINITIONS;?>');"><?php echo lang(Calculation::DATASHEET_ROUTE_DEFINITIONS);?></a>
               </li>
               <li>
                   <a href="javascript:void(0);" onclick="$.offer.show_documents();"><?php echo lang("show_documents");?></a>
               </li>
               <li>
                   <a href="javascript:void(0);" onclick="$.calculation.work_time_calculation();"><?php echo lang("work_time_calculation");?></a>
               </li>
               <li>
                   <a href="javascript:void(0);" onclick="$.calculation.export_calculation();"><?php echo lang("export_calculation");?></a>
               </li>
           </ul>
       </div>
    </div>
</div>
<div class="row" id="calculation_panels">
    <div class="col-lg-12">
        <?php echo $calculation_html;?>
    </div>
</div>
<div class="row" id="worktime_calculation_sheet" style="display:none;">
    <div class="col-xs-12" id="access_form_data_general"></div>
</div>
<div>
    <?php
    echo $mdl_datasheets->generateHTML();
    echo $mdl_access_form_data->generateHTML();
    ?>
    <div class="modal modal-message modal-primary fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Document List</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td><label>Abrufauftrag</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('abrufauftrag');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Aktualisierung_mit_logo</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('aktualisierung_mit_logo');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Aktualisierung_ohne_logo</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('aktualisierung_ohne_logo');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Angebot_mit_logo</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('angebot_mit_logo');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Angebot_ohne_logo</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('angebot_ohne_logo');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Anschreiben_Ohne_logo</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('anschreiben_ohne_logo');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Anschreiben_mit_logo</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('anschreiben_mit_logo');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Confirmation_b_braun_opthamologie</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('confirmation_b_braun_opthamologie');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Etiketten_text</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('etiketten_text');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Fiche_commerciale</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('fiche_commerciale');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Form_remainders</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('form_remainders');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Tv_confirmation</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('iv_confirmation');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Kalkulationsblatt</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('kalkulationsblatt');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Kurzangebot</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('kurzangebot');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                        <tr>
                            <td><label>Vertrag_lrf</label></td>
                            <td><a href="javascript:void(0);" onclick="$.offer.create_document('vertrag_lrf');" class="btn btn-success" role="button" style="margin-left: 150px;"><i class="fa fa-print" aria-hidden="true"></i></a></td>
                        </tr>
                    </table>

                </div>
            </div>
        </div>
    </div>
</div>

