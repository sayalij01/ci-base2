<?php
$is_tender = false;
$is_new_kitpack = false;
if(count($data["kitpack"]["kitpacks"])>0)
{
    $header = "";
    $tabs = "";
    $html = "<div class=\"tender-tab col-xs-12 col-sm-12\">
            <ul id=\"tender-tab-list\" class=\"nav nav-tabs\">";
    foreach($data["kitpack"]["kitpacks"] as $idx=>$kitpack)
    {
        $active = "";
        if($idx==0)
        {
            $active = " active";
        }
        $label = $kitpack["kitpack_name"];
        if ($data["copy_offer"] == 1)
        {
			$label = lang("copy_kitpack");
        }
        $header .= "<li id=\"tender-tab".$idx."\" class=\"".$active."\">
                    <a id=\"tender_link_tab".$idx."\" class=\"\" data-toggle=\"tab\" pane=\"tender".$idx."\" href=\"#tender".$idx."\">".$label."</a>
                </li>";
        $tabs .= "<div id=\"tender".$idx."\" class=\"tab-pane fade".($active!=""?$active." in":"")."\">
            ".$this->load->view("admin/offer/offer_form",array("idx"=>$idx),true).
            "</div>";
    }
    $html .= $header;
    $html .= "        </ul>
          </div>
          <div id=\"tab-content\" class=\"tab-content tender-tab fadeInLeft col-xs-12\">";
    $html .= $tabs;
    $html .= "    </div>
          ";
}
else
{
    $header = "";
    $tabs = "";
    $idx=0;
    $html = "<div class=\"tender-tab col-xs-12 col-sm-12\">
            <ul id=\"tender-tab-list\" class=\"nav nav-tabs\">";
    $header .= "<li id=\"tender-tab".$idx."\" class=\"".$active."\">
                    <a id=\"tender_link_tab".$idx."\" class=\"\" data-toggle=\"tab\" pane=\"tender".$idx."\" href=\"#tender".$idx."\">".lang("new_kitpack")."</a>
                </li>";
    $tabs .= "<div id=\"tender".$idx."\" class=\"tab-pane fade active in\">
             ".$this->load->view("admin/offer/offer_form",array("idx"=>$idx),true).
             "</div>";
    $html .= $header;
    $html .= "        </ul>
          </div>
          <div id=\"tab-content\" class=\"tab-content tender-tab fadeInLeft col-xs-12\">";
    $html .= $tabs;
    $html .= "    </div>
          ";
}

?>
<div class="row">
    <?php echo $html;?>
</div>
