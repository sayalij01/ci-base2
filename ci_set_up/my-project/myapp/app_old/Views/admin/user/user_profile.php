<?php 
	$page_alerts = buildPageAlerts($error, $success, $warning, $info);
	
	$all_locales 	= $data["available_languages"];
	$all_countries 	= $data["available_countries"];
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: create user object
	$user = new T_User($data["user"]);
	
	$user_id = "";
	if ($user->user_id != "")
	{
		$user_id = encrypt_string($user->user_id);
	}
	
	if (! array_key_exists($user->language, $all_locales)){
		$user->language = "EN"; // DEFAULT
	}
	
	if ($user->country == "" || $user->country == null){
		$user->country = $this->getSessionItem(E_SESSION_ITEM::CLIENT_COUNTRY);
	}
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: build the user form
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$fi_username = new HTML_FormItem(lang("username"), "fi_username", "i_username", array(), E_REQUIRED::YES);
	$fi_username->setValidationState( form_error('username') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_username->addComponent(new HTML_Input("i_username", "username", E_INPUTTYPE::TEXT, lang("username"), $user->username, "", "", E_ENABLED::NO) );
	
	$fi_firstname = new HTML_FormItem(lang("firstname"), "fi_firstname", "i_firstname", array(), E_REQUIRED::YES);
	$fi_firstname->setValidationState( form_error('firstname') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_firstname->addComponent(new HTML_Input("i_firstname", "firstname", E_INPUTTYPE::TEXT, lang("firstname"), $user->firstname) );
	
	$fi_lastname = new HTML_FormItem(lang("lastname"), "fi_lastname", "i_lastname", array(), E_REQUIRED::YES);
	$fi_lastname->setValidationState( form_error('lastname') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_lastname->addComponent(new HTML_Input("i_lastname", "lastname", E_INPUTTYPE::TEXT, lang("lastname"), $user->lastname) );
	
	$fi_email = new HTML_FormItem(lang("email"), "fi_email", "i_email", array(), E_REQUIRED::YES);
	$fi_email->setValidationState( form_error('email') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_email->addComponent(new HTML_Input("i_email", "email", E_INPUTTYPE::EMAIL, lang("email"), $user->email) );
	
	$fi_phone = new HTML_FormItem(lang("phone"), "fi_phone", "i_phone", array(), E_REQUIRED::YES);
	$fi_phone->setValidationState( form_error('phone') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_phone->addComponent(new HTML_Input("i_phone", "phone", E_INPUTTYPE::TEXT, lang("phone"), $user->phone) );
	
	$fi_street = new HTML_FormItem(lang("street"), "fi_street", "i_street", array(), E_REQUIRED::NO);
	$fi_street->setValidationState( form_error('street') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_street->addComponent(new HTML_Input("i_street", "street", E_INPUTTYPE::TEXT, lang("street"), $user->street) );
	
	$fi_house_nr = new HTML_FormItem(lang("house_nr"), "fi_house_nr", "i_house_nr", array(), E_REQUIRED::NO);
	$fi_house_nr->setValidationState( form_error('house_nr') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_house_nr->addComponent(new HTML_Input("i_house_nr", "house_nr", E_INPUTTYPE::TEXT, lang("house_nr"), $user->house_number) );
	
	$fi_zipcode = new HTML_FormItem(lang("zipcode"), "fi_zipcode", "i_zipcode", array(), E_REQUIRED::NO);
	$fi_zipcode->setValidationState( form_error('zipcode') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_zipcode->addComponent(new HTML_Input("i_zipcode", "zipcode", E_INPUTTYPE::TEXT, lang("zipcode"), $user->zipcode) );
	
	$fi_location = new HTML_FormItem(lang("location"), "fi_location", "i_location", array(), E_REQUIRED::NO);
	$fi_location->setValidationState( form_error('location') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_location->addComponent(new HTML_Input("i_location", "location", E_INPUTTYPE::TEXT, lang("location"), $user->location) );
	
	$fi_country	= new HTML_FormItem(lang("country"), "fi_country", "i_country", array(), E_REQUIRED::YES);
	$fi_country->setValidationState( form_error('country') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_country->addComponent( new HTML_Select("i_country", "country", HTML_Select::buildOptions($all_countries, "iso_2", "country_label", $user->country, "all", false), false, "", E_VISIBLE::YES ) );
	
	$fi_locale	= new HTML_FormItem(lang("language"), "fi_locale", "i_locale", array(), E_REQUIRED::YES);
	$fi_locale	->setValidationState( form_error('locale') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
	$fi_locale->addComponent( new HTML_Select("i_locale", "locale", HTML_Select::buildOptions($all_locales, "locale_code", "locale_label", $user->language, "all", false), false, "", E_VISIBLE::YES ) );
	
	
	$btn_togglePassword = new HTML_Button("btn_toggle_password", "btn_toggle_password", "Passwort ändern", E_COLOR::STANDARD, E_SIZES::MD, E_ICONS::USER_SECRET, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array("btn-block"), array("data-toggle"=>"collapse", "data-target"=>"#fi_password, #fi_password_repeat"));
	$fi_change_password = new HTML_FormItem("", "fi_change_password", "btn_toggle_password", array(), E_REQUIRED::NO);
	$fi_change_password->addComponent($btn_togglePassword);
	
	$fi_password = new HTML_FormItem(lang("password"), "fi_password", "i_password", array(), E_REQUIRED::YES);
	$fi_password->setValidationState( form_error('password') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_password->addComponent(new HTML_Input("i_password", "password", E_INPUTTYPE::PASSWORD, lang("password"), "" ) );
	
	if ($user->user_id != null && $data["js_enabled"] == 1)
	{
		$fi_password->setClasses(array("collapse"))->setRequired(E_REQUIRED::NO);
	}
	
	$fi_password_repeat = new HTML_FormItem(lang("password_repeat"), "fi_password_repeat", "i_password_repeat", array(), E_REQUIRED::YES);
	$fi_password_repeat->setValidationState( form_error('password_repeat') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
	$fi_password_repeat->addComponent(new HTML_Input("i_password_repeat", "password_repeat", E_INPUTTYPE::PASSWORD, lang("password_repeat"), "") );
	
	if ($user->user_id != null  && $data["js_enabled"] == 1)
	{
		$fi_password_repeat->setClasses(array("collapse"))->setRequired(E_REQUIRED::NO);
	}
	
	$btn_submit = new HTML_Button("bt_submit", "submit_user", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_submit->setType(E_BUTTON_TYPES::SUBMIT)->setValue(1)->setAttributes(array("form"=>"form_user")); // since we place this button outside the form
	
	$btn_reset = new HTML_Button("bt_reset", "reset", lang("undo"), E_COLOR::INFO, E_SIZES::STANDARD, E_ICONS::UNDO, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
	$btn_reset->setAttributes(array("form"=>"form_user"))->setValue(1)->setType(E_BUTTON_TYPES::RESET);
	
	$fi_submit 	= new HTML_FormItem("", "fi_submit", "bt_submit");
	$fi_submit->addComponent( $btn_submit );
	
	$hidden_user_id 	= new HTML_Input("i_user_id", "user_id", E_INPUTTYPE::HIDDEN, lang("user_id"), ($user->user_id != "" ? $user_id : "")) ;
	$hidden_save		= new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, lang("save"), 1) ;
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$form_user = new HTML_Form("form_userdata", "form_userdata", "#", lang("data_personal"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_user
	->addFormItem($fi_username)
	->addFormItem($fi_firstname)
	->addFormItem($fi_lastname)
	->addFormItem($fi_email)
	->addFormItem($fi_phone)
	->addFormItem($fi_country)
	->addFormItem($fi_locale);
	
	if ($user->user_id != null && $data["js_enabled"] == 1){
		$form_user->addFormItem($fi_change_password);
	}else{
		$form_user->addFormItem(HTML_FormItem::buildLegendItem(lang("change_password")));
	}
	$form_user
	->addFormItem($fi_password)
	->addFormItem($fi_password_repeat)
	->addFormItem($hidden_user_id)
	->addFormItem($hidden_save);
	
	$form_useraddress = new HTML_Form("form_useraddress", "form_useraddress", "#", lang("data_address"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	$form_useraddress
	->addFormItem($fi_street)
	->addFormItem($fi_house_nr)
	->addFormItem($fi_zipcode)
	->addFormItem($fi_location);
	
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
	
	
	$fi_avatar = new HTML_FormItem(lang("user_avatar"), "fi_avatar", "img_avatar");
	$fi_avatar->addComponent( $img );
	if ($data["js_enabled"] == 1){
		$fi_avatar->setVisible(false);
	}
	
	$fi_avatar_upload = new HTML_FormItem(lang("user_avatar_upload"), "fi_avatar_ul", "input_upload");
	$fi_avatar_upload->addComponent('<input id="input_upload" name="upload[]" class="btn btn-block btn-default" type="file">' );
	
	$form_upload_avatar = new HTML_Form("form_upload_avatar", "form_upload_avatar", "#", lang("data_avatar"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	
	$form_upload_avatar
	->addFormItem($fi_avatar)
	->addFormItem($fi_avatar_upload)
	->addFormItem($hidden_avatar);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: put all forms together 
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$form = new HTML_Form("form_user", "form_user", base_url("admin/profile"), "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array());
	//$form->setAttributes(array("enctype"=>"multipart/form-data"));
	
	$form->addFormItem(
		'<div class="col-xs-12">'.$page_alerts.'</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
			$form_user->generateHTML(true).'
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
			$form_useraddress->generateHTML(true).'
		</div>'
	);
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$panel 	= new HTML_Panel("pnl_user", lang("profile"), "", "", E_DISMISSABLE::NO, E_VISIBLE::YES, E_COLOR::STANDARD, E_COLOR::STANDARD);
	$panel->setContent($form->generateHTML());
	$panel->setFooter($btn_submit->generateHTML()."&nbsp;".$btn_reset->generateHTML());
	
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
	<div class="visible-lg col-lg-2">
	</div>
</div>