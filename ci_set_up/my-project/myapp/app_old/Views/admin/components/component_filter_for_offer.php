<?php


        // $component_list = (array_key_exists("component_list", $data));
        if (isset($data_for_filter) && !is_null($data_for_filter) && is_array($data_for_filter))
        {
            $data = $data_for_filter;
        }
            $view_suffix = "_"."kitpack";

            
            // echo '<pre>' . var_export($data["all_manufacturer"], true) . '</pre>';die;

?>
<?php if($layout == E_COMPONENT_LAYOUT::COMP_LAYOUT_VERTICAL )
    {?>
    <div id="pnlcomponents-titleControl-row1<?=$view_suffix ?>" class="panel-titel-controls btn-group" style="width: 100%">
        <div id="" style="overflow:scroll; height:300px;">
            <div class="row" style="margin-top:10px;">
                <div class="col-xs-4 "> <label for="manufacturer">Manufacturer:</label></div>
                <div class="col-xs-8">
                    <select name="manufacturer" id="manufacturer" style="width: 100%;">
                    <?php  foreach($data["all_manufacturer"] as $manufacturer){
                        if($manufacturer->manufacturer!= ""){?>
                        <option value="<?=$manufacturer->manufacturer?>"><?=$manufacturer->manufacturer?></option>
                    <?php }
                    }?>
                    </select>
                </div>
            </div><br>

            <div class="row">
                <div class="col-xs-4 "> <label for="productCategory">Product Category:</label></div>
                <div class="col-xs-8 ">
                    <select name="productCategory" id="productCategory" style="width: 100%;">
                    <?php  foreach($data["product_categories"] as $category){
                        if($category->product_category!= ""){?>
                        <option value="<?=$category->product_category?>"><?=$category->product_category?></option>
                    <?php }
                    }?>
                    </select>
                </div>
            </div><br>

            <div class="row" id="manufacture_numbers_div">
                <div class="col-xs-4 "> <label for="manufacture_numbers">Manufactur Number:</label></div>
                <div class="col-xs-8 ">
                    <select id="manufacture_numbers"  style="width: 100%;">
                    <?php  foreach($data["manufacture_numbers"] as $manufacture_number){
                        if($category->product_category!= ""){?>
                        <option value="<?=$manufacture_number->component_id?>"><?=$manufacture_number->manufacturer_product_number?></option>
                    <?php }
                    }?>
                </select>
                </div>
            </div>
        </div>
    </div>
        <?php } ?>

