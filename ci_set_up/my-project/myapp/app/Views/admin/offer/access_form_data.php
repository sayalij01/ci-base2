<?php

$accesses_matrix = array();
foreach($data["accesses"] as $idx=>$row)
{
    $values = array("10pcs"=>$row["10pcs"],"5pcs"=>$row["5pcs"],"4pcs"=>$row["4pcs"],"3pcs"=>$row["3pcs"]);
    $item = new HTML_Input("i_access_".$row["amount_access"],"access_".$row["amount_access"],E_INPUTTYPE::HIDDEN,"","","","",E_ENABLED::YES,E_VISIBLE::NO,array(),array("access"),$values);
    $accesses_matrix[] = $item->generateHTML();
}
$packaging_variants = array();
foreach($data["packaging_variants"] as $idx=>$row)
{
    $values = array("uc"=>$row["uc"],"sc"=>$row["sc"],"tc"=>$row["tc"]);
    $item = new HTML_Input("i_".$row["type"],$row["type"],E_INPUTTYPE::HIDDEN,"","","","",E_ENABLED::YES,E_VISIBLE::NO,array(),array("variants"),$values);
    $packaging_variants[] = $item->generateHTML();
}
$swabs = array();
foreach($data["swabs"] as $idx=>$row)
{
    $item = new HTML_Input("i_swab_".$row["swab_amount"],"swab_".$row["swab_amount"],E_INPUTTYPE::HIDDEN,"",$row["price"],"","",E_ENABLED::YES,E_VISIBLE::NO,array(),array("swabs"),array());
    $swabs[] = $item->generateHTML();
}
$preps = array();
foreach($data["preps"] as $idx=>$row)
{
    $item = new HTML_Input("i_prep_".$row["amout_prepare_swabs"],"prep_".$row["amout_prepare_swabs"],E_INPUTTYPE::HIDDEN,"",$row["price"],"","",E_ENABLED::YES,E_VISIBLE::NO,array(),array("preps"),array());
    $preps[] = $item->generateHTML();
}
$access_value = new HTML_Input("i_access_value","access_value",E_INPUTTYPE::HIDDEN,"",$data["access_value"],"","",E_ENABLED::YES,E_VISIBLE::NO,array(),array(),array());

function getAFDInput(array $params, ?int $initial_amount, ?int $initial_access, ?float $initial_value, int $pos,array $cls=array(),array $attr=array()):string
{
    $return = "";
    list($piece,$piece_enabled,$access,$access_enabled,$single_price,$single_piece_enabled,$pos_price,$pos_price_enabled) = $params;
    if($piece)
    {
        $return .= "<td class='width90px'>".Calculation::GetInput("i_pos".$pos."_piece","pos".$pos."_piece", $initial_amount,$piece_enabled,array_merge(array("piece_input"),$cls),$attr)."</td>\n";
    }
    else
    {
        $return .= "<td class='width90px'></td>";
    }
    if($access)
    {
        $return .= "<td class='width90px'>".Calculation::GetInput("i_pos".$pos."_access","pos".$pos."_access", $initial_access,$access_enabled,array_merge(array("access_input"),$cls),$attr,false)."</td>\n";
    }
    else
    {
        $return .= "<td class='width90px'></td>";
    }
    if($single_price)
    {
        $return .= "<td class='width90px'>".Calculation::GetInput("i_pos".$pos."_single_price","pos".$pos."_single_price", $initial_value,$single_piece_enabled,array_merge(array("single_price_input"),$cls),$attr)."</td>\n";
    }
    else
    {
        $return .= "<td class='width90px'></td>";
    }
    if($pos_price)
    {
        $return .= "<td class='width90px'>".Calculation::GetInput("i_pos".$pos."_pos_price","pos".$pos."_pos_price", "",$pos_price_enabled,array_merge(array("pos_price_input"),$cls),$attr)."</td>\n";
    }
    else
    {
        $return .= "<td class='width90px'></td>";
    }
    return $return;
}

$btn_save = new HTML_Button("btn_save_access_form","save_access_form",lang("continue"),E_COLOR::STANDARD,E_SIZES::STANDARD,"",E_HORIZONTAL_POSITION::LEFT,E_VISIBLE::YES,E_ENABLED::YES,array(),array("pull-right"),array());

$kitpack_id = new HTML_Input("i_access_form_data_kitpack_id","access_form_data_kitpack_id",E_INPUTTYPE::HIDDEN,"",$data["kitpack_id"],"","",E_ENABLED::YES,E_VISIBLE::NO,array(),array(),array());
$value_id = new HTML_Input("i_access_form_data_value_id","access_form_data_value_id",E_INPUTTYPE::HIDDEN,"",$data["value_id"],"","",E_ENABLED::YES,E_VISIBLE::NO,array(),array(),array());

//die(print_r($data,true));
if(($data["saved_values"]["amount_items_plus_3_amount"] == null ||
    $data["saved_values"]["amount_items_plus_3_amount"] == 0 ||
    $data["saved_values"]["amount_items_plus_3_amount"] == "") &&
    $data["compCount"] != "")
{
    $data["saved_values"]["amount_items_plus_3_amount"] = $data["compCount"];
}


?>
<div class="row">
    <div class="col-lg-12 access_for_data_table_wrapper">
        <table id="tbl_access_form-data" class="access_form_data_table">
            <thead>
                <tr>
                    <th class="pos"></th>
                    <th class="bold left action width275px"><?php echo lang("ac_label_action");?></th>
                    <th class="bold left width300px"><?php echo lang("ac_label_info");?></th>
                    <th class="bold left width65px"><?php echo lang("ac_label_piece");?></th>
                    <th class="bold left width65px"><?php echo lang("ac_label_access");?></th>
                    <th class="bold left width65px"><?php echo lang("ac_label_single_price");?></th>
                    <th class="bold left width65px"><?php echo lang("ac_label_pos_price");?></th>
                </tr>
            </thead>
            <tbody>
            <tr>
                <td class="pos">1</td>
                <td class="action width275px"><?php echo lang("et_larger_120");?></td>
                <td rowspan="3" class="width300px"><?php echo lang("packaging_table_cover");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["et_larger_120cm_amount"],null,$data["et_larger_120cm"],1);?>
            </tr>
            <tr>
                <td class="pos">2</td>
                <td class="action width200px"><?php echo lang("et_to_120");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["et_till_120cm_amount"],null,$data["et_till_120cm"],2);?>
            </tr>
            <tr>
                <td class="pos">3</td>
                <td class="action"><?php echo lang("et_till_75");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["et_till_75cm_amount"],null,$data["et_till_75cm"],3);?>
            </tr>
            <tr>
                <td class="pos">4</td>
                <td class="action"><?php echo lang("pasteurfolding_from_100cm");?></td>
                <td rowspan="2"><?php echo lang("packaging_pasteur_folding");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["pasteur_folding_from_100cm_amount"],null,$data["pasteur_folding_from_100cm"],4);?>
            </tr>
            <tr>
                <td class="pos">5</td>
                <td class="action"><?php echo lang("pasteurfolding_until_90cm");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["pasteur_folding_till_90cm_amount"],null,$data["pasteur_folding_till_90cm"],5);?>
            </tr>
            <tr class="table-top-line table-bottom-line">
                <td class="pos">6</td>
                <td class="action"><?php echo lang("amount_components_without_gaze");?></td>
                <td><?php echo lang("amount");?></td>
                <?php echo getAFDInput(array(true,true,true,false,true,false,true,false),$data["saved_values"]["amount_items_plus_3_amount"],$data["saved_values"]["amount_items_plus_3_access"],$data["amount_items_plus_3"],6);?>
            </tr>
            <tr class="table-bottom-line">
                <td class="pos">7</td>
                <td class="action"><?php echo lang("folding_box");?></td>
                <td><?php echo lang("amount_folding_box");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["folding_box_amount"],null,$data["folding_box"],7);?>
            </tr>
            <tr>
                <td class="pos">8</td>
                <td class="action"><?php echo lang("gauze_compress");?></td>
                <td><?php echo lang("1access10");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["gauze_compress_amount"],null,0,8,array("pcs"),array("pcs"=>10));?>
            </tr>
            <tr>
                <td class="pos">9</td>
                <td class="action"><?php echo lang("vliwasoft_slit_compress");?></td>
                <td><?php echo lang("1access10");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["vliwasoft_slit_compress_amount"],null,0,9,array("pcs"),array("pcs"=>10));?>
            </tr>
            <tr>
                <td class="pos">10</td>
                <td class="action"><?php echo lang("swab_and_tampons");?></td>
                <td><?php echo lang("1access4");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["swab_or_tampons_amount"],null,0,10,array("pcs"),array("pcs"=>4));?>
            </tr>
            <tr>
                <td class="pos">11</td>
                <td class="action"><?php echo lang("preparation_swab_loose");?></td>
                <td><?php echo lang("1access4");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["preparation_swab_loose_amount"],null,0,11,array("pcs"),array("pcs"=>4));?>
            </tr>
            <tr>
                <td class="pos">12</td>
                <td class="action"><?php echo lang("stem_swab");?></td>
                <td><?php echo lang("1access3");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["stem_swab_amount"],null,0,12,array("pcs"),array("pcs"=>3));?>
            </tr>
            <tr>
                <td class="pos">13</td>
                <td class="action"><?php echo lang("tip_swab");?></td>
                <td><?php echo lang("1access5");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["tip_swab_amount"],null,0,13,array("pcs"),array("pcs"=>5));?>
            </tr>
            <tr>
                <td class="pos">14</td>
                <td class="action"><?php echo lang("toptext_only_10x20cm");?></td>
                <td><?php echo lang("1access10");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["toptex_only_10x20cm_amount"],null,0,14,array("pcs"),array("pcs"=>10));?>
            </tr>
            <tr>
                <td class="pos">15</td>
                <td class="action"><?php echo lang("toptext_belly_drape_all_sizes");?></td>
                <td><?php echo lang("1access5");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["toptex_belly_drape_all_sizes_amount"],null,0,15,array("pcs"),array("pcs"=>5));?>
            </tr>
            <tr>
                <td class="pos">16</td>
                <td class="action"><?php echo lang("eye_swab");?></td>
                <td><?php echo lang("1access4");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["eye_stick_amount"],null,0,16,array("pcs"),array("pcs"=>4));?>
            </tr>
            <tr>
                <td class="pos">17</td>
                <td class="action"><?php echo lang("vascular_swab");?></td>
                <td><?php echo lang("1access10");?></td>
                <?php echo getAFDInput(array(true,true,true,false,false,false,true,false),$data["saved_values"]["vascular_swab_amount"],null,0,17,array("pcs"),array("pcs"=>10));?>
            </tr>
            <tr class="table-top-line">
                <td class="pos">18</td>
                <td class="action"><?php echo lang("amount_paper_bags_without_swabs");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["paper_bags_without_swabs_amount"],null,$data["amount_fb_if_swabs_not_packed"],18);?>
            </tr>
            <tr>
                <td class="pos">19</td>
                <td class="action"><?php echo lang("amount_swabs_packed_in_paper_bags");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["swabs_packed_in_paper_bags_amount"],null,0,19);?>
            </tr>
            <tr class="table-bottom-line">
                <td class="pos">20</td>
                <td class="action"><?php echo lang("amount_preps_packed_in_single_counter_boxes");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["preps_packed_in_single_counter_boxes_amount"],null,0,20);?>
            </tr>
            <tr>
                <td class="pos">21</td>
                <td class="action"><?php echo lang("unfold_components");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["unfold_components_amount"],null,$data["unfold_components"],21);?>
            </tr>
            <tr>
                <td class="pos">22</td>
                <td class="action"><?php echo lang("meche_folded_1m_packing_for_france");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["meche_amount"],null,$data["meche"],22);?>
            </tr>
            <tr>
                <td class="pos">23</td>
                <td class="action"><?php echo lang("fold_components");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["fold_components_amount"],null,$data["fold_components"],23);?>
            </tr>
            <tr>
                <td class="pos">24</td>
                <td class="action"><?php echo lang("banding_mkp_placing_counting_grid_in_folding_box");?></td>
                <td><?php echo lang("register_amount_of_stacks");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["banding_mkp_amount"],null,$data["mkp_banding_place_counter_grid_in_fb"],24);?>
            </tr>
            <tr>
                <td class="pos">25</td>
                <td class="action"><?php echo lang("pt_cutting_edges_for_mkp_banding");?></td>
                <td><?php echo lang("register_amount_of_stacks");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["cut_banding_mkp_amount"],null,$data["cutting_pb_for_mkp_bandings"],25);?>
            </tr>
            <tr>
                <td class="pos">26</td>
                <td class="action"><?php echo lang("curafix_or_similar_measuring_and_cutting_100cm");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["curafix_measuring_and_cutting_100cm_amount"],null,$data["curafix_measure_and_cut_100cm"],26);?>
            </tr>
            <tr>
                <td class="pos">27</td>
                <td class="action"><?php echo lang("curafix_or_similar_measuring_and_cutting_50cm");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["curafix_measuring_and_cutting_50cm_amount"],null,$data["curafix_measure_and_cut_50cm"],27);?>
            </tr>
            <tr>
                <td class="pos">28</td>
                <td class="action"><?php echo lang("curafix_or_similar_measuring_and_cutting_30cm");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["curafix_measuring_and_cutting_30cm_amount"],null,$data["curafix_measure_and_cut_30cm"],28);?>
            </tr>
            <tr>
                <td class="pos">29</td>
                <td class="action"><?php echo lang("curafix_rolling_100cm");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["curafix_rolling_100cm_amount"],null,$data["curafix_roll_100cm"],29);?>
            </tr>
            <tr>
                <td class="pos">30</td>
                <td class="action"><?php echo lang("curafix_rolling_50cm");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["curafix_rolling_50cm_amount"],null,$data["curafix_roll_50cm"],30);?>
            </tr>
            <tr>
                <td class="pos">31</td>
                <td class="action"><?php echo lang("curafix_rolling_30cm");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["curafix_rolling_30cm_amount"],null,$data["curafix_roll_30cm"],31);?>
            </tr>
            <tr>
                <td class="pos">32</td>
                <td class="action"><?php echo lang("apply_rubber_ring");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["apply_rubber_ring_amount"],null,$data["apply_rubber_ring"],32);?>
            </tr>
            <tr>
                <td class="pos">33</td>
                <td class="action"><?php echo lang("apply_color_dots");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["apply_color_dots_amount"],null,$data["apply_color_dots"],33);?>
            </tr>
            <tr>
                <td class="pos">34</td>
                <td class="action"><?php echo lang("glue_color_dots_on_peel_flap")." (1 ".lang("piece").")";?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["glue_color_dots_on_peel_flap_1pcs_amount"],null,$data["glue_color_dot_to_peel_flap_1pcs"],34);?>
            </tr>
            <tr>
                <td class="pos">35</td>
                <td class="action"><?php echo lang("glue_color_dots_on_peel_flap")." (2 ".lang("piece").")";?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["glue_color_dots_on_peel_flap_2pcs_amount"],null,$data["glue_color_dot_to_peel_flap_2pcs"],35);?>
            </tr>
            <tr>
                <td class="pos">36</td>
                <td class="action"><?php echo lang("glue_color_dots_on_peel_flap")." (3 ".lang("piece").")";?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["glue_color_dots_on_peel_flap_3pcs_amount"],null,$data["glue_color_dot_to_peel_flap_3pcs"],36);?>
            </tr>
            <tr>
                <td class="pos">37</td>
                <td class="action"><?php echo lang("counting_card_color_markings_4pc_each");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["counting_card_color_markings_4pc_each_amount"],null,$data["counting_card_color_dots_4pcs"],37);?>
            </tr>
            <tr>
                <td class="pos">38</td>
                <td class="action"><?php echo lang("rip_tears");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["rip_tears_amount"],null,$data["rip_tears"],38);?>
            </tr>
            <tr>
                <td class="pos">39</td>
                <td class="action"><?php echo lang("attaching_marking_strips_to_scissors");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["attaching_marking_strips_to_scissors_amount"],null,$data["add_markings_to_scissor"],39);?>
            </tr>
            <tr>
                <td class="pos">40</td>
                <td class="action"><?php echo lang("attaching_marking_strips_to_tweezers");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["attaching_marking_strips_to_tweezers_amount"],null,$data["add_markings_to_tweezer"],40);?>
            </tr>
            <tr>
                <td class="pos">41</td>
                <td class="action"><?php echo lang("removing_adhesive_strip_from_or_insert_into_stockinette_insert_small_counting_card");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["removing_adhesive_strip_amount"],null,$data["stockinette_value"],41);?>
            </tr>
            <tr>
                <td class="pos">42</td>
                <td class="action"><?php echo lang("wrap_gauze_pad");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["wrap_gauze_pad_amount"],null,$data["wrap_gauze_compress"],42);?>
            </tr>
            <tr>
                <td class="pos">43</td>
                <td class="action"><?php echo lang("cut_drainage_tube");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["cut_drainage_tube_amount"],null,$data["cut_drainage_tube"],43);?>
            </tr>
            <tr class="table-top-line">
                <td class="pos">44</td>
                <td class="action"><?php echo lang("unpacking");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["unpacking_amount"],null,$data["unpacking"],44);?>
            </tr>
            <tr>
                <td class="pos">45</td>
                <td class="action"><?php echo lang("gauze_compress_access_amount");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["gauze_compress_access_amount_amount"],null,$data["gauze_compress_access_sum"],45);?>
            </tr>
            <tr>
                <td class="pos">46</td>
                <td class="action"><?php echo lang("remove_banding");?></td>
                <td></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["remove_banding_amount"],null,$data["remove_bandings"],46);?>
            </tr>
            <tr class="table-top-line">
                <td class="pos">47</td>
                <td class="action"><?php echo lang("label");?></td>
                <td><?php echo lang("fixed");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["labeling_amount"],null,$data["labels"],47);?>
            </tr>
            <tr>
                <td class="pos">48</td>
                <td class="action"><?php echo lang("protocol");?></td>
                <td><?php echo lang("fixed");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["protocol_amount"],null,$data["protocol"],48);?>
            </tr>
            <tr>
                <td class="pos">49</td>
                <td class="action"><?php echo lang("weld_flap_bag_or_stericlin");?></td>
                <td><?php echo lang("fixed");?></td>
                <?php echo getAFDInput(array(true,true,false,false,true,false,true,false),$data["saved_values"]["weld_peel_flap_or_stericlin_amount"],null,$data["weld_peel_flap_or_stericilin"],49);?>
            </tr>
            <tr class="table-top-line">
                <td class="pos"></td>
                <td class="action bold"><?php echo lang("assamble_set_for_100_packages");?></td>
                <td></td>
                <?php echo getAFDInput(array(false,false,true,false,false,false,true,false),null,null,0,50);?>
            </tr>
            <tr class="table-top-line">
                <td class="pos"></td>
                <td class="action"><?php echo lang("packages_for_100_packs");?></td>
                <td></td>
                <td><?php echo lang("uc_sc");?></td>
                <td><?php echo lang("sc_tc");?></td>
                <td><?php echo lang("uc_tc");?></td>
                <td></td>
            </tr>
            <tr>
                <td class="pos"></td>
                <td class="action"></td>
                <td><?php echo lang("variant_1_3SC");?></td>
                <?php echo getAFDInput(array(true,true,true,false,true,false,true,false),$data["saved_values"]["variant1_uc_amount"],3,3,51);?>
            </tr>
            <tr>
                <td class="pos"></td>
                <td class="action"></td>
                <td><?php echo lang("variant_2_1SC");?></td>
                <?php echo getAFDInput(array(true,true,true,false,true,false,true,false),$data["saved_values"]["variant2_uc_amount"],1,1,52);?>
            </tr>
            <tr class="table-top-line table-bottom-line">
                <td class="pos"></td>
                <td class="action bold"><?php echo lang("total");?></td>
                <td></td>
                <?php echo getAFDInput(array(false,false,false,false,false,false,true,false),null,null,null,53);?>
            </tr>
            </tbody>
        </table>
    </div>
</div>
<div class="row">
    <div class="col-lg-12">
        <?php echo $btn_save->generateHTML();?>
    </div>
</div>
<br /><br /><br />
<?php
    echo implode("\n",$accesses_matrix)."\n";
    echo implode("\n",$packaging_variants)."\n";
    echo implode("\n",$swabs)."\n";
    echo implode("\n",$preps)."\n";
    echo $access_value->generateHTML()."\n";
    echo $kitpack_id->generateHTML()."\n";
    echo $value_id->generateHTML();
?>

