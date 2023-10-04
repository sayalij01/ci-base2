<?php
    //$component_list = (array_key_exists("component_list", $data));
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    if (isset($data_for_filter) && !is_null($data_for_filter) && is_array($data_for_filter))
    {
        $data = $data_for_filter;
    }
//die(echome($data));
    $btn_quick = "";
	$btn_favorites = "";
	$btn_non_contract = "";
	$btn_individual = "";
	$btn_content_import = "";
	$btns_row1 = "";
	$btn_components_export = "";
	$select_favorites = "";
	$i_tbl_search = "";
    $i_tbl_search_name = "";
    $i_tbl_search_desc = "";
    $i_tbl_search_materialnumber = "";
    $i_tbl_search_manufacturer_product_number = "";
	$select_categories = "";
	$select_attributes = "";
	$select_value = "";
	$select_tech_disciplines = "";
	$btn_reset_filter = "";
	if($view_suffix != "")
	{
	    $view_suffix = "_".$view_suffix;
	}
   //die("<pre>".print_r($data,true)."</pre>");
	if ($component_list && ($flags & E_COMPONENT_FILTER::COMP_QUICK_EDIT))
	{
		$btn_quick = '<button id="btn_quick'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::BOLT.'&nbsp'.lang('quick_edit').'</button>';
	}
	if($flags & E_COMPONENT_FILTER::COMP_FAVORITE_LIST)
	{
     	if (E_MY_FAVORITES::USE_DEFALUT_USER_LIST)
		{
			$default_favoritelist_id = is_null($data["default_favoritelist"]) ? -1 : $data["default_favoritelist"];
			$select_favorites =
			'<label id="i_offer_operation_0_lbl" for="i_offer_operation_0" class="panel-title-button">
				<span >'.lang('favorites').'&nbsp;</span>		
				<input id="select_favorites'.$view_suffix.'" name="select_favorites'.$view_suffix.'" value="'.$default_favoritelist_id.'" type="checkbox" class="panel-control panel-title-button">
			</label>';
		}
		else
		{
			$available_favorites = $data["available_favoritelists"];
			$options_favorites = HTML_Select::buildOptions($available_favorites, "list_id", "list_name", 0, lang("select_favorite"),true,true,false,null);
			$select_favorites =
				'<select id="select_favorites'.$view_suffix.'" name="select_favorites'.$view_suffix.'" role="select" data-allow-clear="1" class="panel-control panel-title-button">
    					'.$options_favorites.'
    			</select>';
		}

	}

	if($flags & E_COMPONENT_FILTER::COMP_MASTER_LIST)
	{
	    $btn_non_contract = '<button id="btn_non_contract'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::WARNING.'&nbsp'.lang('individual_component').'</button>';
	}
	if($flags & E_COMPONENT_FILTER::COMP_INDIVIDUAL_LIST)
	{
	   $btn_individual = '<button id="btn_individual'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::CHECK_CIRCLE_BLACK.'&nbsp'.lang('master-list').'</button>';
	}

	if($flags & E_COMPONENT_FILTER::COMP_SEARCH_FIELD)
    {
	   $i_tbl_search = '<input id="tbl_search'.$view_suffix.'" name="tbl_search'.$view_suffix.'" type="text" value="" class="panel-title-button" placeholder='.lang('searchterm').'>';
    }

    if($flags & E_COMPONENT_FILTER::COMP_CATEGORIES)
	{
	    $available_categories = $data["available_categories"];
	    $options_categories = HTML_Select::buildOptions($available_categories, "product_category_id", "product_category_translation", -1, lang("select_category"),true,true, false,"product_category");
	    $select_categories =
	    '<select id="select_categories'.$view_suffix.'" name="select_categories'.$view_suffix.'" role="select" data-allow-clear="1" class="panel-control panel-title-button">
					'.$options_categories.'
	    </select>';
	    /*
        $available_categories = $data["available_categories"];
        $options_categories = HTML_Select::buildOptions($available_categories, "product_category_id", "product_category_translation", -1, lang("select_category"),true,true, false,"product_category");
        $filter_categories = new HTML_Select('select_categories'.$view_suffix, 'select_categories'.$view_suffix, $options_categories, false, "", E_VISIBLE::YES );
	*/
	}

	if($flags & E_COMPONENT_FILTER::COMP_ATTRIBUTES)
    {
    	$available_attributes = $data["available_attributes"];
    	$options_attributes = HTML_Select::buildOptions($available_attributes, "attr_id", "attr_name", 0, lang("select_attribute"));
    	$select_attributes = 
    	'<select id="select_attributes'.$view_suffix.'" name="select_attributes'.$view_suffix.'" role="select" data-allow-clear="1" class="panel-control panel-title-button" style="max-width:200px">
    					'.$options_attributes.'
    	</select>';
    }
    if($flags & E_COMPONENT_FILTER::COMP_VALUES)
    {
    	$options_value = HTML_Select::buildOptions(array(), "attr_id".$view_suffix, "attr_name".$view_suffix, 0, lang("select_value"));
    	$select_value =
    	'<select id="select_value'.$view_suffix.'" name="select_value'.$view_suffix.'" role="select" data-allow-clear="1" class="panel-control panel-title-button">
    					'.$options_value.'
    	</select>';
    }
    if($flags & E_COMPONENT_FILTER::COMP_TECH_DISCIPLINES)
    {
    	$available_tech_disciplines = $data["available_tech_disciplines"];
    	$options_tech_disciplines = HTML_Select::buildOptions($available_tech_disciplines, "discipline_id", "technical_discipline_name", 0, lang("select_tech_discipline"));
    	
    	$select_tech_disciplines =
    	'<select id="select_tech_disciplines'.$view_suffix.'" name="select_tech_disciplines" role="select" data-allow-clear="1" class="panel-control panel-title-button" style="max-width:200px;">
    					'.$options_tech_disciplines.' 
    	</select>';
    }

    if($flags & E_COMPONENT_FILTER::COMP_CONTENT_IMPORTER)
	{
	   $btn_content_import = '<button id="btn_content_import'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::FILE_EXCEL.'&nbsp;'.lang('content-importer').'</button>';
	}

	if($flags & E_COMPONENT_FILTER::COMP_CATALOG_EXCEL_EXPORT)
	{
		$btn_components_export = '<button id="btn_export_list'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::FILE_EXCEL.'&nbsp;'.lang('export_components_list'.$view_suffix).'</button>';
	}

    if($flags & E_COMPONENT_FILTER::COMP_CATALOG_TEMPLATE_LIST)
    {
        $options_catalog_templates = HTML_Select::buildOptions($data["available_catalog_templates"], "catalog_template_id", "catalog_template_name", -1, lang("individal_customer_catalog"),true,true, false,"catalog_template_id");
        $select_catalog_templates =
        '<select id="select_catalog_templates'.$view_suffix.'" name="select_catalog_templates" role="select" data-allow-clear="1" class="panel-control panel-title-button">
                        '.$options_catalog_templates.'
         </select>';
    }

    if($flags & E_COMPONENT_FILTER::COMP_CATALOG_TEMPLATE_NEW)
    {
        $btn_new_catalog_template = '<button id="btn_new_catalog_template'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::ADD.'&nbsp'.lang('new_catalog_template').'</button>';
    }

    $filters = $i_tbl_search."&nbsp;".$select_categories."&nbsp;".$select_attributes."&nbsp;".$select_value."&nbsp;".$select_tech_disciplines."&nbsp;";
    if($flags & E_COMPONENT_FILTER::COMP_RESET_FILTER)
    {
        $btn_reset_filter = '<button id="btn_reset_filter'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::REMOVE.'&nbsp;'.lang('reset_filter').'</button>';
    }

    if($flags & E_COMPONENT_FILTER::COMP_CATALOG_UPLOAD)
    {
        $btn_upload = '<button id="btn_upload'.$view_suffix.'" type="button" class="panel-title-button" >'.E_ICONS::UPLOAD.'&nbsp'.lang('upload_customer_catalog').'</button>';
    }

    if($layout == E_COMPONENT_LAYOUT::COMP_LAYOUT_VERTICAL )
    {
        $html = "<div id=\"pnlcomponents-titleControl-row1".$view_suffix."\" class=\"panel-titel-controls btn-group\" style=\"width: 100%;\">";
        $elements = array();
        if(trim($btn_quick) != "") $elements[] = $btn_quick;
        if(trim($select_favorites) != "") $elements[] = $select_favorites;
        if(trim($btn_non_contract) != "") $elements[] = $btn_non_contract;
        if(trim($btn_individual) != "") $elements[] = $btn_individual;
        if(trim($i_tbl_search) != "") $elements[] = $i_tbl_search;
        if(trim($select_categories) != "") $elements[] = $select_categories;
        if(trim($select_attributes) != "") $elements[] = $select_attributes;
        if(trim($select_value) != "") $elements[] = $select_value;
        if(trim($select_tech_disciplines) != "") $elements[] = $select_tech_disciplines;
        if(trim($btn_reset_filter) != "") $elements[] = $btn_reset_filter;
        if(trim($btn_content_import) != "") $elements[] = $btn_content_import;
        if(trim($select_catalog_templates) != "") $elements[] = $select_catalog_templates;
        if(trim($btn_new_catalog_template) != "") $elements[] = $btn_new_catalog_template;
        if(trim($btn_upload) != "") $elements[] = $btn_upload;
        $chunks = array_chunk($elements,3);
        foreach($chunks as $idx=>$chunk)
        {
            if(count($chunk)==3)
            {
                $html .= "<div class=\"row\"><div class=\"col-xs-4 panel-titel-controls btn-group\">".$chunk[0]."</div>".
                                            "<div class=\"col-xs-4 panel-titel-controls btn-group\">".$chunk[1]."</div>".
                                            "<div class=\"col-xs-4 panel-titel-controls btn-group\">".$chunk[2]."</div>".
                            "</div>";
            }
            elseif(count($chunk)==2)
            {
                $html .= "<div class=\"row\"><div class=\"col-xs-6 panel-titel-controls btn-group\">".$chunk[0]."</div>".
                                            "<div class=\"col-xs-6 panel-titel-controls btn-group\">".$chunk[1]."</div>".
                        "</div>";
            }
            else
            {
                $html .= "<div class=\"row\"><div class=\"col-xs-12 panel-titel-controls btn-group\">".$chunk[0]."</div></div>";   
            }
        }
        $html .= "</div>";
        echo $html;
    }
    else 
    {
        $btns_row1 = '<span id="pnlcomponents-titleControl-row1'.$view_suffix.'" class="panel-titel-controls btn-group">'.
    					$btn_quick.$select_favorites.$btn_non_contract.$btn_individual.$filters.$btn_reset_filter.$btn_content_import.$select_catalog_templates.$btn_new_catalog_template.$btn_upload.$btn_components_export.
    				'</span>';
    	echo $btns_row1;
    }
?>