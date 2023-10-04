<?php
    //echo "<pre>".print_r($_SESSION,true)."</pre>";

    $page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	$all_locales 	= $data["available_languages"];
    $all_component_locales = $data["available_component_languages"];
	$all_countries 	= $data["available_countries"];
	$approval_users = $data["approval_users"];
	$all_themes 	= E_THEMES::getConstants();
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create user object
	$user = new T_User($data["user"]);

	if (! array_key_exists($user->language, $all_locales)){
		$user->language = "DE"; // DEFAULT
	}

    if (! array_key_exists($user->language_components, $all_component_locales)){
        $user->language_components = "DE"; // DEFAULT
    }
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the user form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$fi_username = new HTML_FormItem(lang("username"), "fi_username", "username", array(), E_REQUIRED::YES);
	$fi_username->setValidationState( form_error('username') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_username->addComponent(new HTML_Input("i_username", "username", E_INPUTTYPE::TEXT, lang("username"), $user->username) );
	
	$fi_firstname = new HTML_FormItem(lang("firstname"), "fi_firstname", "firstname", array(), E_REQUIRED::YES);
	$fi_firstname->setValidationState( form_error('firstname') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_firstname->addComponent(new HTML_Input("i_firstname", "firstname", E_INPUTTYPE::TEXT, lang("firstname"), $user->firstname) );
	
	$fi_lastname = new HTML_FormItem(lang("lastname"), "fi_lastname", "lastname", array(), E_REQUIRED::YES);
	$fi_lastname->setValidationState( form_error('lastname') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_lastname->addComponent(new HTML_Input("i_lastname", "lastname", E_INPUTTYPE::TEXT, lang("lastname"), $user->lastname) );
	
	$fi_street = new HTML_FormItem(lang("street"), "fi_street", "street", array(), E_REQUIRED::NO);
	$fi_street->setValidationState( form_error('street') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_street->addComponent(new HTML_Input("i_street", "street", E_INPUTTYPE::TEXT, lang("street"), $user->street) );
	
	$fi_house_nr = new HTML_FormItem(lang("house_nr"), "fi_house_nr", "house_nr", array(), E_REQUIRED::NO);
	$fi_house_nr->setValidationState( form_error('house_nr') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_house_nr->addComponent(new HTML_Input("i_house_nr", "house_nr", E_INPUTTYPE::TEXT, lang("house_nr"), $user->house_number) );
	
	$fi_zipcode = new HTML_FormItem(lang("zipcode"), "fi_zipcode", "zipcode", array(), E_REQUIRED::NO);
	$fi_zipcode->setValidationState( form_error('zipcode') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_zipcode->addComponent(new HTML_Input("i_zipcode", "zipcode", E_INPUTTYPE::TEXT, lang("zipcode"), $user->zipcode) );
	
	$fi_location = new HTML_FormItem(lang("location"), "fi_location", "location", array(), E_REQUIRED::YES);
	$fi_location->setValidationState( form_error('location') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_location->addComponent(new HTML_Input("i_location", "location", E_INPUTTYPE::TEXT, lang("location"), $user->location) );
	
	$fi_country	= new HTML_FormItem(lang("country"), "fi_country", "country", array(), E_REQUIRED::YES);
	$fi_country->setValidationState( form_error('country') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_country->addComponent( new HTML_Select("i_country", "country", HTML_Select::buildOptions($all_countries, "iso_2", "country_label", $user->country, "all", false), false, "", E_VISIBLE::YES ) );
	
	$fi_email = new HTML_FormItem(lang("email"), "fi_email", "email", array(), E_REQUIRED::YES);
	$fi_email->setValidationState( form_error('email') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_email->addComponent(new HTML_Input("i_email", "email", E_INPUTTYPE::TEXT, lang("email"), $user->email) );

    $fi_sap_customernumber = new HTML_FormItem(lang("sap_customernumber"), "fi_sap_customernumber", "sap_customernumber", array(), E_REQUIRED::NO);
    $fi_sap_customernumber->addComponent(new HTML_Input("i_sap_customernumber", "sap_customernumber", E_INPUTTYPE::TEXT, lang("sap_customernumber"), $user->sap_customernumber) );

	$fi_accept 	= new HTML_FormItem("", "lbl_accept", "input_accept");
	$fi_accept->setValidationState( form_error('input_accept') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_accept->addComponent( new HTML_Toggle("i_accept", "input_accept", E_SELECTED::NO, lang("accept_tos_txt"), 1, E_SIZES::SM, E_ICONS::CHECK, E_ICONS::CIRCLE_WHITE_NOTCH_SPIN, E_COLOR::PRIMARY, E_COLOR::STANDARD) );
	
	
	$btn_togglePassword = new HTML_Button("btn_toggle_password", "btn_toggle_password", "Passwort ändern", E_COLOR::STANDARD, E_SIZES::MD, E_ICONS::USER_SECRET, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array("btn-block"), array("data-toggle"=>"collapse", "data-target"=>"#fi_password, #fi_password_repeat"));
	$fi_change_password = new HTML_FormItem("", "fi_change_password", "password", array(), E_REQUIRED::NO);
	$fi_change_password->addComponent($btn_togglePassword);
	
	$fi_password = new HTML_FormItem(lang("password"), "fi_password", "password", array(), E_REQUIRED::YES);
	$fi_password->setValidationState( form_error('password') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_password->addComponent(new HTML_Input("i_password", "password", E_INPUTTYPE::PASSWORD, lang("password"), "" ) );
	if ($user->user_id != null && $data["js_enabled"] == 1)
	{
		$fi_password
		->setClasses(array("collapse"))
		->setRequired(E_REQUIRED::NO);
	}
	
	$fi_password_repeat = new HTML_FormItem(lang("password_repeat"), "fi_password_repeat", "password_repeat", array(), E_REQUIRED::YES);
	$fi_password_repeat->setValidationState( form_error('password_repeat') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_password_repeat->addComponent(new HTML_Input("i_password_repeat", "password_repeat", E_INPUTTYPE::PASSWORD, lang("password_repeat"), "") );
	if ($user->user_id != null  && $data["js_enabled"] == 1)
	{
		$fi_password_repeat
		->setClasses(array("collapse"))
		->setRequired(E_REQUIRED::NO);
	}
	
	$btn_submit = new HTML_Button("bt_submit", "submit_user", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array("value"=>"submit"), array());
	$btn_submit->setType(E_BUTTON_TYPES::SUBMIT)->setValue("submit")->setAttributes(array("form"=>"form_user")); // since we place this button outside the form
	
	/*$btn_reset = new HTML_Button("bt_reset", "reset", lang("undo"), E_COLOR::INFO, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset->setAttributes(array("form"=>"form_user"))->setValue(1)->setType(E_BUTTON_TYPES::RESET);*/

    $btn_back = new HTML_Button("bt_back", "back", lang("back"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::ARROW_RIGHT, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
    $btn_back->setAttributes(array("form"=>"form_user"))->setValue(1)->setType(E_BUTTON_TYPES::BUTTON);

	$fi_submit 	= new HTML_FormItem("", "fi_submit", "submit");
	$fi_submit->addComponent( $btn_submit );
	
	$hidden_user_id 	= new HTML_Input("i_user_id", "user_id", E_INPUTTYPE::HIDDEN, lang("user_id"), ($user->user_id != "" ? $user->user_id : "")) ;
	$hidden_username 	= new HTML_Input("i_username_orig", "username_orig", E_INPUTTYPE::HIDDEN, lang("username"), $user->username) ;
	$hidden_save		= new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;

	$checked_none = E_SELECTED::NO;
	$checked_checker = E_SELECTED::NO;
	$checked_approver = E_SELECTED::NO;
    if(is_null($user->role_type))
    {
        $checked_none = E_SELECTED::YES;
    }
    elseif($user->role_type == E_APPROVER_ROLES::NONE) {
        $checked_none = E_SELECTED::YES;
    }
    elseif($user->role_type == E_APPROVER_ROLES::CHECKER) {
        $checked_checker = E_SELECTED::YES;
    }
    elseif($user->role_type == E_APPROVER_ROLES::APPROVER) {
        $checked_approver = E_SELECTED::YES;
    }

    $r_approver_role_none = new HTML_Radio("r_role_none", "approver_role", lang("role_none"), $checked_none, E_APPROVER_ROLES::NONE);
    $r_approver_role_checker = new HTML_Radio("r_role_checker", "approver_role", lang("role_checker"), $checked_checker, E_APPROVER_ROLES::CHECKER);
    $r_approver_role_approver = new HTML_Radio("r_role_approver", "approver_role", lang("role_approver"), $checked_approver, E_APPROVER_ROLES::APPROVER);
    $i_approver_role = $r_approver_role_none->generateHTML().$r_approver_role_checker->generateHTML().$r_approver_role_approver->generateHTML();
    $fi_approver_role = new HTML_FormItem(lang("approver_role"), "fi_approver_role", "i_approver_role", array(), E_REQUIRED::NO);
    $fi_approver_role->addComponent( $i_approver_role );

    $approver_user = array();
    $selected_approver = $user->approval_user_id;
    $fi_approver = new HTML_FormItem(lang("approver"), "fi_approver", "approver");
    $fi_approver->setValidationState( form_error('locale') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
    $approver_options = HTML_Select::buildOptions($approval_users, "key", "label", $selected_approver, "", false);
    $fi_approver->addComponent( new HTML_Select("i_approver", "approver",$approver_options , false, "", E_VISIBLE::YES ) );

    $client_visible = E_VISIBLE::YES;
    if($data["admin_client_id"] != 0)
    {
        $client_visible = E_VISIBLE::NO;
    }
    $selected_client_id = $data["user"]->client_id;
    $options = HTML_Select::buildOptions($data["all_clients"],"client_id","displayText",$selected_client_id,"",false,true,false,null);
    $i_client_id = new HTML_Select("i_client_id","client_id",$options,false,lang("client"),E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array());
    $fi_client_id = new HTML_FormItem(lang("client"),"fi_client_id","client_id",array(),E_REQUIRED::YES,array(4,8),"",$client_visible,E_ENABLED::YES,array(),array(),array());
    $fi_client_id->setValidationState( form_error('client_missing') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
    $fi_client_id->addComponent($i_client_id);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$form_user = new HTML_Form("form_userdata", "form_userdata", "#", lang("data_personal"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_user
    ->addFormItem($fi_client_id)
	->addFormItem($fi_username)
	->addFormItem($fi_firstname)
	->addFormItem($fi_lastname)
	->addFormItem($fi_street)
	->addFormItem($fi_house_nr)
	->addFormItem($fi_zipcode)
	->addFormItem($fi_location)
	->addFormItem($fi_country)
	->addFormItem($fi_email)
    ->addFormItem($fi_sap_customernumber);
	if ($user->user_id != null && $data["js_enabled"] == 1){
		$form_user->addFormItem($fi_change_password);	
	}else{
		$form_user->addFormItem(HTML_FormItem::buildLegendItem(lang("change_password")));
	}
	$form_user
	->addFormItem($fi_password)
	->addFormItem($fi_password_repeat)
	->addFormItem($hidden_user_id)
	->addFormItem($hidden_username)
	->addFormItem($hidden_save);

    $form_approval = new HTML_Form("form_approval", "form_approval", "#", lang("data_approval"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_approval
        ->addFormItem($fi_approver_role)
        ->addFormItem($fi_approver);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the roles form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$user_roles = array();
	if (isset($data["user_roles"]) && is_array($data["user_roles"]))
	{
		foreach ($data["user_roles"] as $key => $user_role) {
			$user_roles[$user_role] = $user_role;
		}
	}
	
/*	$toggle_all	= "";
	$roles_li 	= "";
	if (isset($data["available_roles"]) && is_array($data["available_roles"]))
	{
		$roles_li = '<ul id="checked-list-box" name="roles" class="list-group checked-list-box">';
		foreach ($data["available_roles"] as $key => $value) 
		{
			$checked = (array_key_exists($value->role_id, $user_roles) ? E_CHECKED::YES : E_CHECKED::NO);
			
			$role_name = $value->role_name;
			if ($value->is_static){
				$role_name = lang( $value->role_name )."&nbsp;(&nbsp;".E_ICONS::IS_STATIC." ".lang("protected")."&nbsp;)";
			}
			$cb = new HTML_Checkbox("cb_".$value->role_id, "role[]", $role_name, $checked, $value->role_id, E_ENABLED::YES, E_INLINE::NO, E_VISIBLE::YES);
			
			$roles_li .= '
			<li id="li_'.$value->role_id.'" class="list-group-item">
				'.$cb->generateHTML().'
			</li>';
		}
		$roles_li .= '</ul>';
	}*/
    $roles_li = $this->load->view("admin/user/user_role_list",$data,true);
	
	$fi_roles = new HTML_FormItem(lang("roles"), "fi_roles", "roles", array(), E_REQUIRED::YES);
	$fi_roles->setValidationState( form_error('role') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_roles->addComponent($roles_li);
	
	$form_roles = new HTML_Form("form_user_roles", "form_user_roles", "#", lang("assigned_roles"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
	$form_roles->addFormItem($fi_roles);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the clients form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/*$user_clients = array();
	$assigned_clients = array();
	if (isset($data["clients"]) && is_array($data["clients"]))
	{
        $user_clients = $data["clients"];
	}
	if (isset($data["assigned_clients"]) && is_array($data["assigned_clients"]))
	{
	    $assigned_clients = $data["assigned_clients"];
	}

	$toggle_all	   = "";
	$clients_li    = '<ul id="checked-list-box" name="clients" class="list-group checked-list-box">';
	//die("<pre>".print_r($assigned_clients,true)."</pre>");
	foreach($user_clients as $client_id=>$client)
	{
	    $checked = (in_array($client_id,$assigned_clients)?E_CHECKED::YES:E_CHECKED::NO);
	    $cb = new HTML_Checkbox("cb_".$client_id,"client[]", $client["client_name"], $checked, $client_id, E_ENABLED::YES, E_INLINE::NO, E_VISIBLE::YES, array(), array(), array());
	    $clients_li .= "<li id=\"li_".$client_id."\" class=\"list-group-item\">".$cb->generateHTML()."</li>";
	}
	$clients_li .= "</ul>";
	
	$fi_clients = new HTML_FormItem(lang("clients"), "fi_clients", "clients", array(), E_REQUIRED::NO);
	$fi_clients->setValidationState( form_error('client') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_clients->addComponent($clients_li);*/

    $clients_li = $this->load->view("admin/user/user_client_list",$data,true);

    $fi_clients = new HTML_FormItem(lang("clients"), "fi_clients", "clients", array(), E_REQUIRED::NO);
    $fi_clients->setValidationState( form_error('client') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
    $fi_clients->addComponent($clients_li);

	$form_clients = new HTML_Form("form_user_clients", "form_user_clients", "#", lang("assigned_clients"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
	$form_clients->addFormItem($fi_clients);

    // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    // ..:: build the usergroups form
    // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    $usergroups_li = $this->load->view("admin/user/user_usergroups_list",$data,true);

    $fi_usergroups = new HTML_FormItem(lang("usergroups"), "fi_usergroups", "usergroups", array(), E_REQUIRED::NO);
    $fi_usergroups->setValidationState( form_error('client') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
    $fi_usergroups->addComponent($usergroups_li);

    $form_usergroups = new HTML_Form("form_user_usergroups", "form_user_usergroups", "#", lang("assigned_usergroups"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
    $form_usergroups->addFormItem($fi_usergroups);

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the user settings form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
    $fi_is_adm	= new HTML_FormItem(lang("user_is_adm"), "fi_is_adm", "locked");
    if(intval($user->is_adm) == 1)
    {
        $checked = E_SELECTED::YES;
    }
	else
    {
        $checked = E_SELECTED::NO;
    }
    $cb_is_adm = new HTML_Checkbox("cb_is_adm", "is_adm", "", $checked, "1", E_ENABLED::YES, E_INLINE::NO, E_VISIBLE::YES, array(),array(),array());
    $fi_is_adm->addComponent( $cb_is_adm );

	$fi_locked	= new HTML_FormItem(lang("user_locked"), "fi_locked", "locked");
	$fi_locked->setValidationState( form_error('locked') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_locked->addComponent( new HTML_Toggle("i_locked", "locked", ($user->locked != "1" ? E_SELECTED::NO : E_SELECTED::YES), "", 1, E_SIZES::SM, E_ICONS::LOCK, E_ICONS::UNLOCK, E_COLOR::DANGER, E_COLOR::PRIMARY) );
	
	$themes		= array();
	foreach ($all_themes as $key => $value) {
		$themes[] = array(
			"label"=>$key,
			"key"=>$value		
		);
	}

	$fi_theme = new HTML_FormItem(lang("theme"), "fi_theme", "theme");
	$fi_theme->setValidationState( form_error('theme') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_theme->addComponent( new HTML_Select("i_theme", "theme", HTML_Select::buildOptions($themes, "key", "label", $user->theme, "all", false), false, "", E_VISIBLE::YES ) );
	
	$fi_locale	= new HTML_FormItem(lang("language"), "fi_locale", "locale");
	$fi_locale	->setValidationState( form_error('locale') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_locale->addComponent( new HTML_Select("i_locale", "locale", HTML_Select::buildOptions($all_locales, "locale_code", "locale_label", $user->language, "all", false), false, "", E_VISIBLE::YES ) );

    $fi_locale_components	= new HTML_FormItem(lang("language_components"), "fi_locale_components", "component_locale");
    $fi_locale_components	->setValidationState( form_error('component_locale') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
    $fi_locale_components->addComponent( new HTML_Select("locale_components", "component_locale", HTML_Select::buildOptions($all_component_locales, "locale_code", "locale_label", $user->language_components, "all", false), false, "", E_VISIBLE::YES ) );


    $form_settings = new HTML_Form("form_user_settings", "form_user_settings", "#", lang("settings"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
	$form_settings
        ->addFormItem($fi_is_adm)
        ->addFormItem($fi_locked)
        //->addFormItem($fi_theme)
        ->addFormItem($fi_locale)
        ->addFormItem($fi_locale_components);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the avatar upload form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$src_avatar = HTML_Image::generatePlaceholderSVG(120, 120, lang("no_avatar"));
	if ($user->avatar != "")
	{
		$path		= $this->config->item("root_path") . $this->config->item("upload_folder") . $user->client_id ."/user_files/". $user->user_id ."/avatar/" . $user->avatar;
		$src_avatar	= HTML_Image::generateDataURIFromImage(append_to_filename($path, "_thumb"));
		
	}
	
	$img = new HTML_Image("img_avatar", "img_avatar", $src_avatar, "", 120, 120);
	
	$hidden_avatar	= new HTML_Input("i_avatar", "avatar", E_INPUTTYPE::HIDDEN, lang("avatar"), $user->avatar) ;
	
	$fi_avatar = new HTML_FormItem(lang("user_avatar"), "fi_avatar", "avatar");
	$fi_avatar->addComponent( $img );
	if ($data["js_enabled"] == 1){
		$fi_avatar->setVisible(false);
	}
	
	$fi_avatar_upload = new HTML_FormItem(lang("user_avatar_upload"), "fi_avatar_ul", "upload[]");
	$fi_avatar_upload->addComponent('<input id="input_upload" name="upload[]" class="btn btn-block btn-default" type="file">' );
	
	$form_upload_avatar = new HTML_Form("form_upload_avatar", "form_upload_avatar", "#", lang("data_avatar"), E_FORMMETHOD::POST, E_VISIBLE::NO, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	
	$form_upload_avatar
	->addFormItem($fi_avatar)
	->addFormItem($fi_avatar_upload)
	->addFormItem($hidden_avatar);
		
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: put all forms together 
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$action = (is_null($user->user_id) ? "create":"edit/".$user->user_id);
	
	$form = new HTML_Form("form_user", "form_user", base_url("admin/users/".$action), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form->setAttributes(array("enctype"=>"multipart/form-data"));
	$form->addFormItem(
		$page_alerts.'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
			$form_user->generateHTML(true).
		    $form_approval->generateHTML(true).
			$form_settings->generateHTML(true).'
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
			$form_roles->generateHTML(true).
	        $form_clients->generateHTML(true).
            $form_usergroups->generateHTML(true).
			$form_upload_avatar->generateHTML(true).'
		</div>'
	);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$panel 	= new HTML_Panel("pnl_user", ($user->user_id != "" ? lang("user_edit"):lang("user_create")) , "", "", E_DISMISSABLE::NO, E_VISIBLE::YES, E_COLOR::STANDARD, E_COLOR::STANDARD);
	$panel->setContent($form->generateHTML());
	$panel->setFooter($btn_submit->generateHTML()."&nbsp;".$btn_back->generateHTML());
	/*
	
	 */
?>
<!--<pre>
    <?php echo print_r($assigned_clients,true); ?>
</pre>-->
<div class="row button-row">
	<div class="col-xs-12 ">
		<?php 
			echo $btn_back->generateHTML()."&nbsp;";
			echo $btn_submit->generateHTML();
		?>
	</div>
</div>
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-10">
		<?php echo $form->generateHTML(); ?>
	</div>
	
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
		<?php //echo $panel_functions->generateHTML();?>
	</div>
</div>