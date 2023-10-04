<?php
$page_alerts 	= buildPageAlerts($error, $success, $warning, $info);

$info_alert = new HTML_Alert("alert_favorites_info", "", lang('delete_edit_favoriteslists').' '.lang('delete_edit_components'), E_COLOR::INFO, E_DISMISSABLE::YES);
//echome( $data["favorites"]);
$html_lists = "";
if (is_array($data) && array_key_exists("component_data", $data) && is_array($data["component_data"]))
{
	$component_data = $data["component_data"];
	$component_id = $data["component_id"];
	
	$t_component = new T_Component($component_data);
	$component_name = implode(" ", array($component_data["desc_1"],$component_data["desc_2"],$component_data["desc_3"],$component_data["desc_4"],$component_data["desc_5"]));
	$form_title = '<h4><span class="text-primary">'.$component_name.'('.$component_data["material_number"].')</span></h4>';
	//$html .= $title;
}
if (is_array($data) && array_key_exists("favorites", $data) && is_array($data["favorites"]))
{
	//echome($t_component);
	$form_favorite_lists = new HTML_Form("form_favorite_lists", "form_favorite_lists", "#", $title);
	
	foreach ($data["favorites"] as $row)
	{
		//$list_name = new HTML_Input("list_name_".$row["list_id"], "list_name_".$row["list_id"], E_INPUTTYPE::TEXT, lang("list_name"),$row["list_name"]) ;
		//$list_name->addAttribute("component_id", $component_id);
		//$list_name->addAttribute("list_id", $row["list_id"]);
		//$fi_list_name = new HTML_FormItem("", "fi_list_name_".$row["list_id"], "list_name_".$row["list_id"]);
		//$fi_list_name->addComponent($list_name);
		
		//Favoritelist name
		$list_name = $row["list_name"];
		if ( $data["right_client_favorites"])
		{
			$list_name .= ($row["list_type"] == E_FAVORITELIST_TYPE::TYPE_CLIENT?'&nbsp;<span title="'.lang("client_favorites").'">(G)</span>':'');
		}
		
		$list_name = '<span id="list_name_'.$row["list_id"].'">'.$list_name.'</span>';

		//Favoritelist add / delete component
		if ($row["in_list"] == 1)
		{
			$icon = E_ICONS::DELETE;
			$action = "delete";
			$title = lang("delete_component_form_favorite_list");
			$class='delete-component-from-list';
		}
		else
		{
			$icon = E_ICONS::ADD;
			$action = "add";
			$title = lang("add_component_to_favorite_list");
			$class='add-component-to-list';
		}
		$bt_component = new HTML_Anchor("list_".$row["list_id"], "<span>".$icon."</span>", "#","", E_VISIBLE::YES, array(), array($class));
		$bt_component->addAttribute("component_id", $component_id);
		$bt_component->addAttribute("list_id", $row["list_id"]);
		$bt_component->addAttribute("action", $action);
		$bt_component->addAttribute("title", $title);
		
		$cb_component = '<span id="cb_list_'.$row["list_id"].'" list_id="'.$row["list_id"].'" component_id="'.$component_id.'" action="'.$action.'" class="cb_list_component text-primary" style="display: none;">'.E_ICONS::CHECK.'</span>';
		
		//Delete favoritelist
		$class = "delete-favorite-list text-default";
		$bt_delete_list = new HTML_Anchor("delete_list_".$row["list_id"], E_ICONS::REMOVE, "#","", E_VISIBLE::YES, array(), array($class));
		$bt_delete_list->addAttribute("list_id", $row["list_id"]);
		$bt_delete_list->addAttribute("title", lang('delete_list'));
		
		
		//Edit favoritelist
		$class = "edit-favorite-list text-default";
		$bt_edit_list = new HTML_Anchor("edit_list_".$row["list_id"], E_ICONS::EDIT, "#","", E_VISIBLE::YES, array(), array($class));
		$bt_edit_list->addAttribute("list_id", $row["list_id"]);
		$bt_edit_list->addAttribute("title", lang('rename_list'));
		$i_edit_list = new HTML_Input("i_edit_list_".$row["list_id"], "i_edit_list_".$row["list_id"], E_INPUTTYPE::TEXT, "", $row["list_name"]);
		$i_edit_list->addClass("i-edit-favorite-list");
		
		
		$html_lists .=
		'<div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
					<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
						'.$bt_delete_list->generateHTML().'
					</div>
					<div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
						'.$bt_edit_list->generateHTML().'
					</div>
					<div class="col-xs-0 col-sm-0 col-md-6 col-lg-6">
					</div>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    '.$i_edit_list->generateHTML()."&nbsp;".$list_name.'
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                    '.$bt_component->generateHTML()."&nbsp".$cb_component.'
                </div>
                <div class="col-xs-0 col-sm-2 col-md-2 col-lg-2">
                </div>
            </div>';
		
	}
}

//Add new favoritelist
$i_new_list = new HTML_Input("i_new_list", "new_list", E_INPUTTYPE::TEXT, lang("new_list_name"));
$fi_new_list = new HTML_FormItem(lang("list_name"), "fi_new_list", "new_list", array(), E_REQUIRED::YES, array(4,8));
$fi_new_list->setValidationState( form_error('new_list') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fi_new_list->addComponent($i_new_list);

if ($data["right_client_favorites"])
{
	$r_user_list = new HTML_Radio("user_favorites", "list_type", lang("user_favorites"), E_CHECKED::YES, E_FAVORITELIST_TYPE::TYPE_USER);
	$r_client_list = new HTML_Radio("client_list", "list_type", lang("client_favorites"), E_CHECKED::NO, E_FAVORITELIST_TYPE::TYPE_CLIENT);
	$select_list_type = $r_user_list->generateHTML().$r_client_list->generateHTML();
}
else
{
	$hidden_list_type 		= new HTML_Input("new_list_type", "new_list_type", E_INPUTTYPE::HIDDEN, lang("user_favorites"),E_FAVORITELIST_TYPE::TYPE_USER) ;
	$select_list_type	= $hidden_list_type->generateHTML();
}

$bt_new_list = new HTML_Button("new_list", "new_list", "", E_COLOR::PRIMARY, E_SIZES::XS, E_ICONS::ADD, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array() );
$bt_new_list->addAttribute("component_id", $component_id);
$bt_new_list->addAttribute("list_id", "new");
$bt_new_list->addAttribute("action", "add");
$bt_new_list->addAttribute("title", lang(add_component_to_new_list));

$cb_new_component = '<span id="cb_list_new" list_id="new" component_id="'.$component_id.'" action="add" class="cb_list_component  text-primary" style="display: none;">'.E_ICONS::CHECK.'</span>';

$hidden_component_id = new HTML_Input("hidden_component_id", "hidden_component_id", E_INPUTTYPE::HIDDEN, lang("hidden_component_id"),$component_id) ;
/*
$fi_new_list = 		
			'<div class="row">
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                    '.lang("create_new_list").'
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-4">
                    '.$i_new_list->generateHTML().'
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
						'.$select_list_type.'
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-2">
						'.$bt_new_list->generateHTML()."&nbsp;&nbsp;".$cb_new_component.'
                </div>
            </div>';
*/
$fi_new_list =
'<div class="row">
                <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                    '.$fi_new_list->generateHTML().'
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
						'.$select_list_type.'
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
						'.$bt_new_list->generateHTML()."&nbsp;&nbsp;".$cb_new_component.'
                </div>
            </div>';

$btn_submit = new HTML_Button("submit_favorites", "submit_favorites", lang("save"), E_COLOR::PRIMARY, E_SIZES::SM, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array() );

$form_favorites = new HTML_Form("form_favorites", "form_favorites", "#", $form_title);
$form_favorites->addFormItem($html_lists);
$form_favorites->addFormItem("<hr>");
$form_favorites->addFormItem($fi_new_list);
$form_favorites->addFormItem($hidden_component_id);

$form_favorites->addFormItem($btn_submit);

?>
	<?php echo $info_alert->generateHTML()?>
	<div class="row">
	    <div class="col-xs-12">
			<?php echo $page_alerts.$form_favorites->generateHTML(true); ?>
	    </div>
	</div>
