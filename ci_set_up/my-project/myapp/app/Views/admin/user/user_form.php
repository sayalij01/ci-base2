<?php 
	// $page_alerts = buildPageAlerts($error, $success, $warning, $info);
use App\Libraries\value_objects\T_User;
use App\Helpers\HTML_Input , App\Helpers\HTML_Button,  App\Helpers\HTML_FormItem ,  
App\Helpers\HTML_TextArea, App\Helpers\HTML_Toggle,  App\Helpers\HTML_Checkbox,  App\Helpers\HTML_Form,   App\Helpers\HTML_Panel , App\Helpers\HTML_Select , App\Helpers\HTML_Image;
use App\Enums\E_THEMES;

	$all_locales= $data["available_languages"];
	$all_countries= $data["available_countries"];
	$all_teams		= $data["available_teams"];
	
	$all_themes= E_THEMES::getConstants();
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create user object
	$user = new T_User($data["user"]);
	
	if (! array_key_exists($user->language, $all_locales)){
		$user->language = "DE"; // DEFAULT
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the user form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$fi_username = new HTML_FormItem(lang("username"), "fi_username", "i_username", array(), E_REQUIRED::YES);
	
	$fi_username->setValidationState(service('validation')->hasError('username') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_username->addComponent(new HTML_Input("i_username", "username", E_INPUTTYPE::TEXT, lang("username"), $user->username) );

    $fi_employee_id = new HTML_FormItem(lang("employee_id"), "fi_employee_id", "i_employee_id", array(), E_REQUIRED::NO);
    $fi_employee_id->setValidationState(service('validation')->hasError('employee_id') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
    $fi_employee_id->addComponent(new HTML_Input("i_employee_id", "employee_id", E_INPUTTYPE::TEXT, lang("employee_id"), $user->employee_id) );

    $fi_firstname = new HTML_FormItem(lang("firstname"), "fi_firstname", "i_firstname", array(), E_REQUIRED::YES);
	$fi_firstname->setValidationState(service('validation')->hasError('firstname') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_firstname->addComponent(new HTML_Input("i_firstname", "firstname", E_INPUTTYPE::TEXT, lang("firstname"), $user->firstname) );
	
	$fi_lastname = new HTML_FormItem(lang("lastname"), "fi_lastname", "i_lastname", array(), E_REQUIRED::YES);
	$fi_lastname->setValidationState(service('validation')->hasError('lastname') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_lastname->addComponent(new HTML_Input("i_lastname", "lastname", E_INPUTTYPE::TEXT, lang("lastname"), $user->lastname) );
	
	$fi_street = new HTML_FormItem(lang("street"), "fi_street", "i_street", array(), E_REQUIRED::NO);
	$fi_street->setValidationState(service('validation')->hasError('street') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_street->addComponent(new HTML_Input("i_street", "street", E_INPUTTYPE::TEXT, lang("street"), $user->street) );
	
	$fi_house_nr = new HTML_FormItem(lang("house_nr"), "fi_house_nr", "i_house_nr", array(), E_REQUIRED::NO);
	$fi_house_nr->setValidationState(service('validation')->hasError('house_nr') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_house_nr->addComponent(new HTML_Input("i_house_nr", "house_nr", E_INPUTTYPE::TEXT, lang("house_nr"), $user->house_number) );
	
	$fi_zipcode = new HTML_FormItem(lang("zipcode"), "fi_zipcode", "i_zipcode", array(), E_REQUIRED::NO);
	$fi_zipcode->setValidationState(service('validation')->hasError('zipcode') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_zipcode->addComponent(new HTML_Input("i_zipcode", "zipcode", E_INPUTTYPE::TEXT, lang("zipcode"), $user->zipcode) );
	
	$fi_location = new HTML_FormItem(lang("location"), "fi_location", "i_location", array(), E_REQUIRED::NO);
	$fi_location->setValidationState(service('validation')->hasError('location') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_location->addComponent(new HTML_Input("i_location", "location", E_INPUTTYPE::TEXT, lang("location"), $user->location) );
	
	$fi_email = new HTML_FormItem(lang("email"), "fi_email", "i_email", array(), E_REQUIRED::YES);
	$fi_email->setValidationState(service('validation')->hasError('email') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_email->addComponent(new HTML_Input("i_email", "email", E_INPUTTYPE::EMAIL, lang("email"), $user->email) );
	
	$fi_phone = new HTML_FormItem(lang("phone"), "fi_phone", "i_phone", array(), E_REQUIRED::NO);
	$fi_phone->setValidationState(service('validation')->hasError('phone') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_phone->addComponent(new HTML_Input("i_phone", "phone", E_INPUTTYPE::TEXT, lang("phone"), $user->phone) );
	
	$fi_locale	= new HTML_FormItem(lang("language"), "fi_locale", "i_locale", array(), E_REQUIRED::YES);
	$fi_locale	->setValidationState(service('validation')->hasError('locale') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_locale->addComponent( new HTML_Select("i_locale", "locale", HTML_Select::buildOptions($all_locales, "locale_code", "locale_label", $user->language, "all", false), false, "", E_VISIBLE::YES ) );

    $fi_scanagent_computer_id = new HTML_FormItem(lang("scanagent_computer_id"), "fi_scanagent_computer_id", "i_scanagent_computer_id", array(), E_REQUIRED::NO);
    $fi_scanagent_computer_id->setValidationState(service('validation')->hasError('email') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
    $fi_scanagent_computer_id->addComponent(new HTML_Input("i_scanagent_computer_id", "scanagent_computer_id", E_INPUTTYPE::TEXT, lang("scanagent_computer_id"), $user->scanagent_computer_id) );

	$fi_country	= new HTML_FormItem(lang("country"), "fi_country", "i_country", array(), E_REQUIRED::YES);
	$fi_country->setValidationState(service('validation')->hasError('country') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_country->addComponent( new HTML_Select("i_country", "country", HTML_Select::buildOptions($all_countries, "iso_2", "country_label", $user->country, "all", false), false, "", E_VISIBLE::YES ) );
	
	$fi_accept= new HTML_FormItem("", "lbl_accept", "i_accept");
	$fi_accept->setValidationState(service('validation')->hasError('input_accept') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_accept->addComponent( new HTML_Toggle("i_accept", "input_accept", E_SELECTED::NO, lang("accept_tos_txt"), 1, E_SIZES::SM, E_ICONS::CHECK, E_ICONS::CIRCLE_WHITE_NOTCH_SPIN, E_COLOR::PRIMARY, E_COLOR::STANDARD) );
	
	$btn_submit = new HTML_Button("bt_submit", "submit_user", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit->setType(E_BUTTON_TYPES::SUBMIT)->setValue(1)->setAttributes(array("form"=>"form_user")); // since we place this button outside the form
	
	$btn_reset = new HTML_Button("bt_reset", "reset", lang("undo"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset->setAttributes(array("form"=>"form_user"))->setValue(1)->setType(E_BUTTON_TYPES::RESET);
	
	$fi_submit= new HTML_FormItem("", "fi_submit", "bt_submit");
	$fi_submit->addComponent( $btn_submit );
	
	$btn_send_user_mail = new HTML_Button("bt_send_user_mail", "send_user_mail", lang("send_activation_mail"), E_COLOR::STANDARD, E_SIZES::STANDARD, E_ICONS::EMAIL, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_send_user_mail->setAttributes(array("form" => "form_user"));
	$btn_send_user_mail->setType(E_BUTTON_TYPES::BUTTON);
	$fi_send_user_mail= new HTML_FormItem("", "fi_send_user_mail", "bt_send_user_mail");
	$fi_send_user_mail->addComponent( $btn_send_user_mail );
	
	$hidden_user_id= new HTML_Input("i_user_id", "user_id", E_INPUTTYPE::HIDDEN, lang("user_id"), ($user->user_id != "" ? $user->user_id : "")) ;
	$hidden_username= new HTML_Input("i_username_orig", "username_orig", E_INPUTTYPE::HIDDEN, lang("username"), $user->username) ;
	$hidden_save		= new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$form_user = new HTML_Form("form_userdata", "form_userdata", "#", lang("data_personal"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_user
	->addFormItem($fi_username)
	->addFormItem($fi_employee_id)
	->addFormItem($fi_firstname)
	->addFormItem($fi_lastname)
	->addFormItem($fi_email)
	->addFormItem($fi_phone)
	->addFormItem($fi_country)
	->addFormItem($fi_locale)
    ->addFormItem($fi_scanagent_computer_id)
	->addFormItem(HTML_FormItem::buildLegendItem(lang("data_address")))
	->addFormItem($fi_street)
	->addFormItem($fi_house_nr)
	->addFormItem($fi_zipcode)
	->addFormItem($fi_location)
	->addFormItem($hidden_user_id)
	->addFormItem($hidden_username)
	->addFormItem($hidden_save);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the roles form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$fi_team	= new HTML_FormItem(lang("team"), "fi_team", "i_team", array(), E_REQUIRED::NO);
	$fi_team->setValidationState(service('validation')->hasError('team') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_team->addComponent( new HTML_Select("i_team", "team", HTML_Select::buildOptions($all_teams, "team_id", "team_name", $user->team_id, lang("all"), true), false, lang("please_choose"), E_VISIBLE::YES ) );
	
	$user_roles = array();
	if (isset($data["user_roles"]) && is_array($data["user_roles"]))
	{
		foreach ($data["user_roles"] as $key => $user_role) {
			$user_roles[$user_role] = $user_role;
		}
	}
	
	$toggle_all	= "";
	$roles_li= "";
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
	}
	
	$fi_roles = new HTML_FormItem(lang("roles"), "fi_roles", "checked-list-box", array(), E_REQUIRED::YES);
	$fi_roles->setValidationState(service('validation')->hasError('role') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_roles->addComponent($roles_li);
	
	$form_roles = new HTML_Form("form_user_roles", "form_user_roles", "#", lang("assigned_roles"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
	$form_roles->addFormItem($fi_team);
	$form_roles->addFormItem($fi_roles);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the user settings form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$fi_locked	= new HTML_FormItem(lang("user_locked"), "fi_locked", "i_locked");
	$fi_locked->setValidationState(service('validation')->hasError('locked') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_locked->addComponent( new HTML_Toggle("i_locked", "locked", ($user->locked != "1" ? E_SELECTED::NO : E_SELECTED::YES), "", 1, E_SIZES::SM, E_ICONS::LOCK, E_ICONS::UNLOCK, E_COLOR::DANGER, E_COLOR::PRIMARY) );
	
	$form_settings = new HTML_Form("form_user_settings", "form_user_settings", "#", lang("settings"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
	$form_settings->addFormItem($fi_locked);
	if($user->user_id != null)
	{
		$form_settings->addFormItem($fi_send_user_mail)	;
	}
	
		
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the avatar upload form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// $src_avatar = HTML_Image::generatePlaceholderSVG(120, 120, lang("no_avatar"));
	// if ($user->avatar != "")
	// {
	//$path		= $this->config->item("root_path") . $this->config->item("upload_folder") . $user->client_id ."/user_files/". $user->user_id ."/avatar/" . $user->avatar;
	//$src_avatar	= HTML_Image::generateDataURIFromImage(append_to_filename($path, "_thumb"));
	// }
	
	// $img		= new HTML_Image("img_avatar", "img_avatar", $src_avatar, "", 120, 120);
	// $hidden_avatar	= new HTML_Input("i_avatar", "avatar", E_INPUTTYPE::HIDDEN, lang("avatar"), $user->avatar) ;
	
	// $fi_avatar = new HTML_FormItem(lang("user_avatar"), "fi_avatar", "img_avatar");
	// $fi_avatar->addComponent( $img );
	// if ($data["js_enabled"] == 1){
	//$fi_avatar->setVisible(false);
	// }
	
	// $fi_avatar_upload = new HTML_FormItem(lang("user_avatar_upload"), "fi_avatar_ul", "input_upload");
	// $fi_avatar_upload->addComponent('<input id="input_upload" name="upload[]" class="btn btn-block btn-default" type="file">' );
	
	// $form_upload_avatar = new HTML_Form("form_upload_avatar", "form_upload_avatar", "#", lang("data_avatar"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	
	// $form_upload_avatar
	// ->addFormItem($fi_avatar)
	// ->addFormItem($fi_avatar_upload)
	// ->addFormItem($hidden_avatar);
		
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: put all forms together 
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$action = ($user->user_id == null ? "create-users":"edit-users/".$user->user_id);
	$page_alerts="";
	$form = new HTML_Form("form_user", "form_user", base_url($action), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form->setAttributes(array("enctype"=>"multipart/form-data"));
	$form->addFormItem(
		$page_alerts.'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
			$form_user->generateHTML(true).'
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
			$form_roles->generateHTML(true).
			$form_settings->generateHTML(true).'
		</div>'
	);
	
	// .$form_upload_avatar->generateHTML(true)
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$panel= new HTML_Panel("pnl_user", ($user->user_id != "" ? lang("user_edit"):lang("user_create")) , "", "", E_DISMISSABLE::NO, E_VISIBLE::YES, E_COLOR::STANDARD, E_COLOR::STANDARD);
	$panel->setContent($form->generateHTML());
	$panel->setFooter($btn_submit->generateHTML()."&nbsp;".$btn_reset->generateHTML());
	/*
	
	 */
?>
<div class="row button-row">
	<div class="col-xs-12 ">
		<?php 
			echo $btn_reset->generateHTML()."&nbsp;";
			echo $btn_submit->generateHTML();
		?>
	</div>
</div>
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-10">
		<?php echo $form->generateHTML(); ?>
	</div>
	
	<!-- <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
		<?php //echo $panel_functions->generateHTML();?>
	</div> -->
</div>