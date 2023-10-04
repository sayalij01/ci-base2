<?php

$page_alerts = buildPageAlerts($error, $success, $warning, $info);

$usergroup = new T_Usergroups($data["usergroups"][0]);
$all_active_users = $data["all_active_users"];

$usergroup_list = $this->load->view("admin/usergroups/usergroups_user_list", array("data"=>$data), true);
$form_users = new HTML_Form("form_usergroupsusers", "form_usergroupsusers", "#", lang("assigned_users"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
$form_users->addFormItem($usergroup_list);

$roles_li = $this->load->view("admin/usergroups/usergroups_role_list",$data,true);
$form_roles = new HTML_Form("form_usergroupsroles", "form_usergroupsroles", "#", lang("assigned_roles"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array(), array() );
$form_roles->addFormItem($roles_li);

$i_usergroup_id = new HTML_Input("i_group_id", "group_id", E_INPUTTYPE::HIDDEN, "", $usergroup->group_id);
$i_save = new HTML_Input("i_save", "save", E_INPUTTYPE::HIDDEN, "", 1);

$fi_usergroup_name = new HTML_FormItem(lang("usergroup_name"), "fi_usergroup_name", "group_name", array(), E_REQUIRED::YES);
$fi_usergroup_name->setValidationState( form_error('group_name') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fi_usergroup_name->addComponent(new HTML_Input("i_usergroup_name", "group_name", E_INPUTTYPE::TEXT, lang("usergroup_name"), $usergroup->group_name) );

$fi_usergroup_desc = new HTML_FormItem(lang("desc"), "fi_usergroup_desc", "group_desc", array(), E_REQUIRED::NO);
$fi_usergroup_desc->setValidationState( form_error('group_desc') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fi_usergroup_desc->addComponent(new HTML_TextArea("i_usergroup_desc", "group_desc", $usergroup->group_desc, lang("desc") ) );

$fi_usergroup_email = new HTML_FormItem(lang("emails"), "fi_usergroup_email", "emails", array(), E_REQUIRED::NO);
$fi_usergroup_email->setValidationState( form_error('emails') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE);
$fi_usergroup_email->addComponent(new HTML_TextArea("i_usergroup_email", "emails", $usergroup->emails, lang("emails") ) );

$fi_administrative_group = new HTML_FormItem("", "lbl_administrative_group", "administrative_group");
$fi_administrative_group->setValidationState( form_error('administrative_group') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
$fi_administrative_group->addComponent( new HTML_Checkbox("i_administrative_group", "administrative_group",lang("administrative_group"),$usergroup->administrative_group,"administrative_group",E_ENABLED::YES,E_INLINE::YES,E_VISIBLE::YES,array(),array(),array()));

$fi_group_leader = new HTML_FormItem(lang("group_leader"), "fi_group_leader", "user_id_group_leader", array(), E_REQUIRED::YES);
$fi_group_leader->setValidationState( form_error('user_id_group_leader') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
$fi_group_leader->addComponent( new HTML_Select("i_group_leader", "user_id_group_leader", HTML_Select::buildOptions($all_active_users, "user_id", "displayString", $usergroup->user_id_group_leader, lang("please_select"), true), false, "", E_VISIBLE::YES ) );

$fi_interim_group_leader = new HTML_FormItem(lang("interim_group_leader"), "fi_interim_group_leader", "user_id_interim_group_leader", array(), E_REQUIRED::NO);
$fi_interim_group_leader->setValidationState( form_error('user_id_interim_group_leader') != "" ? E_VALIDATION_STATES::HAS_ERROR : E_VALIDATION_STATES::NONE );
$fi_interim_group_leader->addComponent( new HTML_Select("i_interim_group_leader", "user_id_interim_group_leader", HTML_Select::buildOptions($all_active_users, "user_id", "displayString", $usergroup->user_id_interim_group_leader, lang("please_select"), true), false, "", E_VISIBLE::YES ) );

$form_left = new HTML_Form("form_usergroup_data1", "form_usergroup_data1", "#", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());
$form_left->addFormItem($fi_usergroup_name)
          ->addFormItem($fi_usergroup_desc)
          ->addFormItem($fi_usergroup_email)
          ->addFormItem($fi_administrative_group)
          ->addFormItem($fi_group_leader)
          ->addFormItem($fi_interim_group_leader);

$form_right = new HTML_Form("form_usergroup_data2", "form_usergroup_data2", "#", "", E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());
$form_right->addFormItem($form_users);
$form_right->addFormItem($form_roles);

$btn_submit = new HTML_Button("bt_submit", "submit_user", lang("save"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::SAVE, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array("value"=>"submit"), array());
$btn_submit->setType(E_BUTTON_TYPES::SUBMIT)->setValue("submit")->setAttributes(array("form"=>"form_usergroups")); // since we place this button outside the form

$btn_back = new HTML_Button("bt_back", "back", lang("back"), E_COLOR::PRIMARY, E_SIZES::STANDARD, E_ICONS::ARROW_RIGHT, "left", E_VISIBLE::YES, E_ENABLED::YES, array(), array(), array());
$btn_back->setAttributes(array("form"=>"form_usergroups"))->setValue(1)->setType(E_BUTTON_TYPES::BUTTON);

$action = (is_null($usergroup->group_id) ? "create":"edit/".$usergroup->group_id);

$form = new HTML_Form("form_usergroups", "form_usergroups", base_url("admin/usergroups/".$action), lang("usergroup_form"), E_FORMMETHOD::POST, E_VISIBLE::YES, E_ENABLED::YES, E_FORMLAYOUT::HORIZONTAL, array(), array("form"), array());
$form->setAttributes(array("enctype"=>"multipart/form-data"));
$form->addFormItem(
    $page_alerts.'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
            $form_left->generateHTML(true).'
		</div>
		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">'.
            $form_users->generateHTML(true).'<br>'.
            $form_roles->generateHTML(true).'<br>
		</div>');
$form->addFormItem($i_usergroup_id);
$form->addFormItem($i_save);
?>
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
