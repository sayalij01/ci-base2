if (typeof jQuery === "undefined") {
  throw new Error("This JavaScript requires jQuery");
}

/**
 * debitor object
 */
$.debitors = {
  /* debitor options. Modify these options to suit your implementation */
  options: {
    store_last_selected_tab: true,
  },
  table: null,
  table_debitor_documents: null,
  table_debitor_history: null,
  table_debitor_contacts: null,
  table_debitor_orders: null, //table parent orders
  table_debitor_reminder: null,
  table_debitor_delivery_search: null,
  orders_for_prescription_id: null,
  workflowFromPrescription: null,
  table_debitor_contact_history: null,
  // hidden_delivery_debitor_id: ""
};

/**
 * edit debitor
 */
$.debitors.edit = function (id) {
  $.app.toConsole({ fkt: "$.debitors.edit", id: id });
  var params = $("#full_form_debitor").serializeArray();
  params.push({ name: "debitor_id", value: id });
  params.push({ name: "rendermode", value: "ajax" });
  var target = baseUrl + "admin/debitors/edit/" + id;

  $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/checkDatasetLocked",
    {
      id: id,
      type: "debitors",
    },
    function (result) {

      if (result.locked == 1) {
        $.dialog.info($.lang.item("dataset_is_worked_on_title"), result.msg);
      } else {
        $.app.sendAjaxRequest(
          target,
          params,
          function success(result) {
            if (result.error && result.error != "") {
              $.dialog.error($.lang.item("error"), result.error);
            } else {
              var on_content_replaced = function () {
                $.debitors.init_form();
                $.debitors.init_last_tab();
              };
              $.app.replaceContent(
                result.data,
                on_content_replaced,
                undefined,
                target
              );
              $.app.replaceContent(
                result.extra.breadcrumb,
                undefined,
                "breadcrumb"
              );
              makeDebitorAutoCompleter();
              registerIkSearch();

              var supervisor = $("#hidden_supervisor").val();
              var supervisor_id = $("#hidden_supervisor_id").val();
              if(supervisor == 1 ){
                $('#full_form_supervisor input,textarea').attr('readonly', false);
                $('#full_form_supervisor select').attr("disabled", false);
                $('#full_form_supervisor .checkbox-inline input').attr('disabled', false);
              }else if(!empty(supervisor_id)){
                $('#full_form_supervisor input,textarea').attr('readonly', true);
                $('#full_form_supervisor select').attr("disabled", true);
                $('#full_form_supervisor .checkbox-inline input').attr('disabled', true);
              }else{
                $('#supervisor_acount_tab').hide();
              }
              $.debitors.show_hide_supervisor();
              $('#i_debitor_statistic_group').change(function(){
                $.debitors.show_hide_supervisor();
              });

              //show hide debitor_as_delivery_block
              $('#i_debitor_as_delivery_account').change(function(){
                $.debitors.show_hide_debitor_as_delivery_block();
              });
              var debitor_id = localStorage.getItem("delivery_debitor_id");
              $.debitors.set_debitor_delivery_data(debitor_id);

              $.debitors.show_hide_debitor_as_delivery_block();


            }
          },
          true,
          null,
          $.lang.item("msg_wait")
        );
      }

    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.show_hide_supervisor = function(){
    var statisticGroup = $('#i_debitor_statistic_group').val();
    if(statisticGroup == '111' || statisticGroup == '112' || statisticGroup == '118') {
        $('#fi_supervisor_id').hide();
        $("#i_supervisor_id option[value='']").attr('selected', true)
    } else {
        $('#fi_supervisor_id').show();
    }
}

/* var show_hide_supervisor = function() {
  var statisticGroup = $('#i_debitor_statistic_group').val();
    if(statisticGroup == '111' || statisticGroup == '112' || statisticGroup == '118') {
        $('#fi_supervisor_id').hide();
        $("#i_supervisor_id option[value='']").attr('selected', true)
    } else {
        $('#fi_supervisor_id').show();
    }
}; */


$.debitors.show_hide_debitor_as_delivery_block = function(){
  var checked = $("#i_debitor_as_delivery_account").is(':checked');
  var i_delivery_account_id = $("#i_delivery_account_id").val();
  var debitor_id = localStorage.getItem("delivery_debitor_id");


  if(checked && i_delivery_account_id == "" && debitor_id == null){
    alert("in if")
    $('#delivery_account_right').show();
    $('#delivery_account_left').hide();
    
    $('#set_delivery_account_data_debitor select').attr("disabled", false);
    $('#set_delivery_account_data_debitor .checkbox-inline input').attr('disabled', false);
  }else if(i_delivery_account_id != "" && !checked && debitor_id != null){
    alert("in 1st else if")
    $('#set_delivery_account_data_debitor input').attr('readonly', true);
    $('#set_delivery_account_data_debitor select').attr("disabled", true);
    $('#set_delivery_account_data_debitor .checkbox-inline input').attr('disabled', true);
    $('#delivery_account_left').show();
    $('#delivery_account_right').show();

  }else{
    alert("in else")

    $('#delivery_account_right').hide();
    $('#delivery_account_left').hide();


  }
}



$.debitors.set_debitor_delivery_data = function (id) {
  // var debitor_id = $("#hidden_delivery_debitor_id").val(id);
  $.app.sendAjaxRequest(baseUrl+"admin/debitors/set_debitor_delivery_data",
            {
              debitor_id: id,
            },
            function success(result)
            {
              console.log(result.data);
              if(result && id != null){
                // $('#i_debitor_delivery_name,#i_debitor_delivery_name_2,#i_debitor_delivery_name_3,#i_debitor_delivery_location,#i_debitor_delivery_zipcode,#i_debitor_delivery_street,#i_debitor_delivery_district').attr('readonly', true);
                // $('#i_debitor_delivery_country_code').attr("disabled", true);
                  $('#set_delivery_account_data_debitor input').attr('readonly', true);
                  $('#set_delivery_account_data_debitor select').attr("disabled", true);
                  $('#set_delivery_account_data_debitor .checkbox-inline input').attr('disabled', true);
  
               
                $("#i_debitor_delivery_name").val(result.data.name_1);
                $("#i_debitor_delivery_name_2").val(result.data.name_2);
                $("#i_debitor_delivery_name_3").val(result.data.name_3);
                $("#i_debitor_delivery_country_code").val(result.data.country_code).change();
                $("#i_debitor_delivery_location").val(result.data.location);
                $("#i_debitor_delivery_zipcode").val(result.data.zipcode);
                $("#i_debitor_delivery_street").val(result.data.street);
                $("#i_debitor_delivery_district").val(result.data.district);

                $("#i_customer_delivery_type").val(result.data.customer_delivery_type).change();
                (result.data.carry_consignment_1 == 1 ? $('#i_carry_consignment_1').prop("checked", true) : $('#i_carry_consignment_1').prop("checked", false));
                (result.data.carry_consignment_2 == 1 ? $('#i_carry_consignment_2').prop("checked", true) : $('#i_carry_consignment_2').prop("checked", false));
                (result.data.carry_consignment_3 == 1 ? $('#i_carry_consignment_3').prop("checked", true) : $('#i_carry_consignment_3').prop("checked", false));
                (result.data.lifting_platform == 1 ? $('#i_lifting_platform').prop("checked", true) : $('#i_lifting_platform').prop("checked", false));
                (result.data.carton_return == 1 ? $('#i_carton_return').prop("checked", true) : $('#i_carton_return').prop("checked", false));
                (result.data.pallet_delivery == 1 ? $('#i_pallet_delivery').prop("checked", true) : $('#i_pallet_delivery').prop("checked", false));
                

              }else{
                $.debitors.show_hide_debitor_as_delivery_block();
              }
             

            },
            true,
            null,null
        );
};

$.debitors.get_debitor_delivery_id = function () {
  // var debitor_id = $("#i_debitor_id").val();
  var account_number = $("#i_delivery_account_id").val();

  alert(account_number)
  $.app.sendAjaxRequest(baseUrl+"admin/debitors/get_debitor_delivery_id",
            {
              account_number: account_number
            },
            function success(result)
            {
              console.log("resultresultresult"+  result.data);

              if(result && account_number != ""){
                alert("account_number    "+ result.data.debitor_id)
                $('#set_delivery_account_data_debitor input').attr('readonly', true);
                $('#set_delivery_account_data_debitor select').attr("disabled", true);
                $('#set_delivery_account_data_debitor .checkbox-inline input').attr('disabled', true);
  
               
                $("#i_debitor_delivery_name").val(result.data.name_1);
                $("#i_debitor_delivery_name_2").val(result.data.name_2);
                $("#i_debitor_delivery_name_3").val(result.data.name_3);
                $("#i_debitor_delivery_country_code").val(result.data.country_code).change();
                $("#i_debitor_delivery_location").val(result.data.location);
                $("#i_debitor_delivery_zipcode").val(result.data.zipcode);
                $("#i_debitor_delivery_street").val(result.data.street);
                $("#i_debitor_delivery_district").val(result.data.district);

                $("#i_customer_delivery_type").val(result.data.customer_delivery_type).change();
                (result.data.carry_consignment_1 == 1 ? $('#i_carry_consignment_1').prop("checked", true) : $('#i_carry_consignment_1').prop("checked", false));
                (result.data.carry_consignment_2 == 1 ? $('#i_carry_consignment_2').prop("checked", true) : $('#i_carry_consignment_2').prop("checked", false));
                (result.data.carry_consignment_3 == 1 ? $('#i_carry_consignment_3').prop("checked", true) : $('#i_carry_consignment_3').prop("checked", false));
                (result.data.lifting_platform == 1 ? $('#i_lifting_platform').prop("checked", true) : $('#i_lifting_platform').prop("checked", false));
                (result.data.carton_return == 1 ? $('#i_carton_return').prop("checked", true) : $('#i_carton_return').prop("checked", false));
                (result.data.pallet_delivery == 1 ? $('#i_pallet_delivery').prop("checked", true) : $('#i_pallet_delivery').prop("checked", false));
              }else{
              /*   $("#i_debitor_delivery_name").val("");
                $("#i_debitor_delivery_name_2").val("");
                $("#i_debitor_delivery_name_3").val("");
                $("#i_debitor_delivery_country_code").val("").change();
                $("#i_debitor_delivery_location").val("");
                $("#i_debitor_delivery_zipcode").val("");
                $("#i_debitor_delivery_street").val("");
                $("#i_debitor_delivery_district").val(""); */
                $.debitors.show_hide_debitor_as_delivery_block();
                
              }
             

            },
            true,
            null,null
        );
};

$.debitors.update_debitor_delivery_data = function (id) {
  var carry_consignment_1 =( $("#i_carry_consignment_1 ").is(':checked') && $("#i_carry_consignment_1 ").val()!= "" )? 1 : 0;
  var carry_consignment_2 =( $("#i_carry_consignment_2 ").is(':checked') && $("#i_carry_consignment_3 ").val()!= "") ?1 : 0;
  var carry_consignment_3 = ($("#i_carry_consignment_3 ").is(':checked') && $("#i_carry_consignment_3 ").val()!= "")? 1 : 0;
  var lifting_platform = ($("#i_lifting_platform ").is(':checked') && $("#i_lifting_platform ").val()!= "") ? 1 : 0;
  var carton_return = ($("#i_carton_return ").is(':checked') && $("#i_carton_return ").val()!= "") ? 1 : 0;
  var pallet_delivery = ($("#i_pallet_delivery ").is(':checked') && $("#i_pallet_delivery ").val()!= "" ) ? 1 : 0;
  alert(carton_return);

  $.app.sendAjaxRequest(baseUrl+"admin/debitors/update_debitor_delivery_data",
            {
              debitor_id: id,
              carry_consignment_1: carry_consignment_1,
              carry_consignment_2: carry_consignment_2,
              carry_consignment_3: carry_consignment_3,
              lifting_platform: lifting_platform,
              carton_return: carton_return,
              pallet_delivery: pallet_delivery,

            },
            function success(result)
            {
              console.log(result.data);
              if(result){

              }else{

              }
             

            },
            true,
            null,null
        );
};

$.debitors.edit_link = function (debitor_id,add_params)
{
    $.app.toConsole({ fkt: "$.debitors.edit", id: debitor_id });
    var params = $("#full_form_debitor").serializeArray();
    params.push({ name: "debitor_id", value: debitor_id });
    params.push({ name: "rendermode", value: "ajax" });
    var target = baseUrl + "admin/debitors/edit/" + debitor_id;
    if(add_params != undefined)
    {
        target += "?"+add_params;
    }
    $.app.toConsole({link:target});
    $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/checkDatasetLocked",
    {
        id: debitor_id,
        type: "debitors",
    },
    function (result) {
        if (result.locked == 1) {
            $.dialog.info($.lang.item("dataset_is_worked_on_title"), result.msg);
        } else {
            $.app.redirect(target);
        }
    });
}

/**
 * remove debitor
 */
$.debitors.remove = function (id) {
    $.app.toConsole({ fkt: "$.debitors.remove", id: id });
    if (id == undefined) {
        throw new Error($.lang.item("msg_missing_parameter"));
    }

    var params = [
        { name: "debitor_id", value: id },
        { name: "confirmed", value: 1 },
        { name: "rendermode", value: "JSON" },
    ];

    $.app.sendAjaxRequest(
        baseUrl + "admin/debitors/checkDatasetLocked",
        {
            id: id,
            type: "debitors",
        },
        function (result) {
            if (result.locked == 1) {
                $.dialog.info($.lang.item("dataset_is_worked_on_title"), result.msg);
            } else {
                $.dialog.confirm_delete(
                    $.lang.item("msg_are_you_sure"),
                    $.lang.item("debitor_sure_delete"),
                    function callback_yes() {
                        $.app.sendAjaxRequest(
                            baseUrl + "admin/debitors/remove/",
                            params,
                            function success(result) {
                                $.app.toConsole({fkt: "callback_ajax", result: result});
                                if (result.error && result.error != "") {
                                    $.dialog.error($.lang.item("error"), result.error);
                                } else {
                                    if (result.status == "SUCCESS") {
                                        $.dialog.success(
                                            $.lang.item("done"),
                                            $.lang.item("debitor_has_been_deleted"),
                                            function callback_done() {
                                                if ($.debitors !== undefined && $.debitors !== null) {
                                                    if (
                                                        $.debitors.table !== undefined &&
                                                        $.debitors.table !== null
                                                    ) {
                                                        $.debitors.table.ajax.reload(); // reload the table
                                                    }
                                                }
                                            }
                                        );
                                    }
                                }
                            },
                            true,
                            null,
                            $.lang.item("debitor_delete_progress")
                        );
                    },
                    null,
                    $.lang.item("debitor_delete"),
                    $.lang.item("cancel")
                );
            }
        },
        true,
        null,
        $.lang.item("msg_wait"));
};

/**
 * save debitor
 */
$.debitors.save = function (e) {
  $.app.toConsole({ fkt: "$.debitors.save" });

  var params = $("#full_form_debitor").serializeArray();
  params.push({ name: "rendermode", value: "json" });

  $.app.sendAjaxRequest(
    e.delegateTarget.action,
    params,
    function success(result) {
      $.app.toConsole({ fkt: "callback save debitor ajax", data: result });

      $.app.setFormValidationStates(
        "full_form_debitor",
        result.error,
        result.extra,
        null
      );

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        var checked = $('#i_debitor_as_delivery_account').is(':checked');
        if(!checked){
          alert("in checked")
          $.debitors.update_debitor_delivery_data(result.data.debitor.debitor_id);
        }

        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("debitor_has_been_saved"),
          
          function callback() {
            // $.app.redirect(baseUrl + "admin/debitors/");
            if ($("#hidden_new_debitor_flag_from_prescription").val() != 0) {
              //$.app.redirect(baseUrl + "admin/debitors/edit/" + result.data.debitor.debitor_id+"/"+$('#hidden_new_debitor_flag_from_prescription').val())
              location.reload();
            } else {
              $.app.redirect(
                baseUrl +
                  "admin/debitors/edit/" +
                  result.data.debitor.debitor_id
              );
            }
          }
        );
      }
    },
    true,
    null,
    $.lang.item("debitor_save_progress")
  );
};

$.debitors.new_prescription = function () {
  var target = baseUrl + "admin/prescriptions/create/";

  var params = [
    { name: "debitor_id", value: $("#i_hidden_debitor_id").val() },
    { name: "ik_number", value: $("#i_ik_number").val() },
    { name: "coming_from", value: "debitors" },
    //{"name":"insurance_number", "value":$("#i_insurance_number").val()},
    { name: "rendermode", value: "AJAX" },
  ];

  var on_content_replaced = function () {
    $.prescriptions.init_form();
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      $.app.toConsole({ fkt: "callback new_prescription ajax", data: result });

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          undefined,
          target
        );
        $.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
        setTimeout($.scanagent.init, 500);
      }
    },
    true,
    null,
    ""
  );
};

$.debitors.edit_prescription = function (id) {
  $.app.toConsole({ fkt: "$.prescriptions.edit", id: id });

  var params = $("#form_prescriptions").serializeArray();
  params.push({ name: "prescriptions_id", value: id });
  params.push({ name: "coming_from", value: "debitors" });
  params.push({ name: "rendermode", value: "ajax" });

  var target = baseUrl + "admin/prescriptions/edit/" + id;

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          $.prescriptions.init_form,
          undefined,
          target
        );
        $.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
        setTimeout($.scanagent.init, 500);
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: ANAMNESIS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

$.debitors.init_table_debitor_anamnesis = function (debitor_id) {
  if ($("#tbl_debitor_anamnesis").length > 0) {
    if (debitor_id != "") {
      var target =
        baseUrl + "admin/debitors/datatable_debitor_anamnesis/" + debitor_id;
      var options = {
        rowId: "debitor_id",
        destroy: "true",
        deferRender: true,
        serverSide: false,
        order: [[1, "asc"]],
      };

      $.debitors.table_debitor_anamnesis = $.app.datatable.initialize_ajax(
        "tbl_debitor_anamnesis",
        target,
        tbl_columns_debitor_anamnese,
        $.app.datatable.callbacks.rowCallback,
        $.app.datatable.callbacks.initComplete,
        options
      );
    }
  }
};

$.debitors.create_debitor_anamnesis = function () {
  var target = baseUrl + "admin/debitors/create_debitor_anamnesis/";
  var params = {
    debitor_id: $("#i_debitor_id").val(),
    rendermode: "AJAX",
  };

  var on_content_replaced = function () {
    $.app.init_checked_list_box();
    $.app.init_toggle();

    $('#debitor-anamnesis-tabs a[href="#debitor-anamnesis-form"]').tab("show");
    $("#bt_back_anamnesis, #bt_back_anamnesis_bottom")
      .off("click")
      .on("click", function () {
        $('#debitor-anamnesis-tabs a[href="#debitor-anamnesis-list"]').tab(
          "show"
        );
        $("#debitor-anamnesis-form").html("");
      });

    $("#form_anamnesis").off("submit");
    $("#form_anamnesis").submit(function (e) {
      $.debitors.save_anamnesis(e);
      e.preventDefault();
    });
        $.app.init_select2('#i_debitor_anamnesis_delivery_contact');
        $.app.init_select2('#i_debitor_anamnesis_billing_contact');
        $.debitors.handleDeliveryAndBillingAddressDropdowns(false);
        if($("#i_copayment_exemption").length > 0)
        {
            if($('#i_no_additional_payment').is(':checked')){
                $("#i_copayment_exemption").trigger('click');
            }
            else{
                $("#i_copayment_exemption_no").trigger('click');
            }
        }
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-anamnesis-form",
          undefined
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

/**
 * save anamnesis
 */
$.debitors.save_anamnesis = function (e) {
  $.app.toConsole({ fkt: "$.anamnesis.save" });
  var debitor_id = $("#i_debitor_id").val();
  var anamnese_id = $("#i_anamnese_id").val();

  var params = $("#form_anamnesis").serializeArray();
  params.push({ name: "rendermode", value: "json" });
  params.push({ name: "debitor_id", value: debitor_id });
  params.push({ name: "anamnese_id", value: anamnese_id });

  var target = e.delegateTarget.action + "/" + anamnese_id + "/" + debitor_id;

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      $.app.toConsole({ fkt: "callback save anamnesis ajax", data: result });

      $.app.setFormValidationStates(
        "form_anamnesis",
        result.error,
        result.extra,
        null
      );

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("anamnesis_has_been_saved"),
          function callback() {
            $('#debitor-anamnesis-tabs a[href="#debitor-anamnesis-list"]').tab(
              "show"
            );
            $("#debitor-anamnesis-form").html("");
            if ($.debitors !== undefined && $.debitors !== null) {
              if (
                $.debitors.table_debitor_anamnesis !== undefined &&
                $.debitors.table_debitor_anamnesis !== null
              ) {
                $.debitors.table_debitor_anamnesis.ajax.reload();
                setTimeout(function () {
                  $.debitors.init_tabs_from_prescription();
                }, 500);
              }
            }
          }
        );
      }
    },
    true,
    null,
    $.lang.item("anamnesis_save_progress")
  );
};

$.debitors.edit_debitor_anamnesis = function (anamnese_id) {
  var debitor_id = $("#i_debitor_id").val();
  var target =
    baseUrl +
    "admin/debitors/edit_debitor_anamnesis/" +
    anamnese_id +
    "/" +
    debitor_id;

  var params = {
    anamnese_id: anamnese_id,
    debitor_id: debitor_id,
    rendermode: "AJAX",
  };

  var on_content_replaced = function () {
    $.app.init_checked_list_box();
    $.app.init_toggle();

    $('#debitor-anamnesis-tabs a[href="#debitor-anamnesis-form"]').tab("show");
    $("#bt_back_anamnesis, #bt_back_anamnesis_bottom")
      .off("click")
      .on("click", function () {
        $('#debitor-anamnesis-tabs a[href="#debitor-anamnesis-list"]').tab(
          "show"
        );
        $("#debitor-anamnesis-form").html("");
      });

    $("#form_anamnesis").off("submit");
    $("#form_anamnesis").submit(function (e) {
      $.debitors.save_anamnesis(e);
      e.preventDefault();
    });
      $.app.init_select2('#i_debitor_anamnesis_delivery_contact');
      $.app.init_select2('#i_debitor_anamnesis_billing_contact');
      $.debitors.handleDeliveryAndBillingAddressDropdowns(true);
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-anamnesis-form"
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.remove_debitor_anamnesis = function (anamnese_id) {
  var debitor_id = $("#i_hidden_debitor_id").val();

  $.app.toConsole({
    fkt: "$.debitors.remove_debitor_anamnesis",
    id: anamnese_id,
  });
  if (anamnese_id == undefined || debitor_id == anamnese_id) {
    throw new Error($.lang.item("msg_missing_parameter"));
  }

  var params = [
    { name: "debitor_id", value: debitor_id },
    { name: "anamnese_id", value: anamnese_id },
    { name: "confirmed", value: 1 },
    { name: "rendermode", value: "JSON" },
  ];

  $.dialog.confirm_delete(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("debitor_anamnesis_sure_delete"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        baseUrl + "admin/debitors/remove_debitor_anamnesis/",
        params,
        function success(result) {
          $.app.toConsole({ fkt: "callback_ajax", result: result });
          if (result.error && result.error != "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            $.dialog.success(
              $.lang.item("done"),
              $.lang.item("debitor_anamnesis_has_been_deleted"),
              function callback_done() {
                if ($.debitors !== undefined && $.debitors !== null) {
                  if (
                    $.debitors.table_debitor_anamnesis !== undefined &&
                    $.debitors.table_debitor_anamnesis !== null
                  ) {
                    $.debitors.table_debitor_anamnesis.ajax.reload();
                  }
                }
              }
            );
          }
        },
        true,
        null,
        $.lang.item("msg_wait")
      );
    },
    null,
    $.lang.item("debitor_anamnesis_delete"),
    $.lang.item("cancel")
  );
};

/**
 * Print Anamnesis Document
 */
$.debitors.print_anamnesis = function (anamnese_id) {
  var data = {
    anamnese_id: anamnese_id,
    debitor_id: $("#i_debitor_id").val(),
  };

  $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/printanamnesis/",
    data,
    function success(result) {
      if (result.error != undefined) {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        var target =
          baseUrl + "admin/debitors/downloadanamnesis/" + result.data.fileB64;

        $.ajax({
          type: "GET",
          url: target,
          processData: false,
          success: function (data) {
            if (data.error == undefined) {
              $.debitors.init_table_debitor_documents($("#i_debitor_id").val());
              window.location = target;
            } else {
              //
            }
          },
          error: function (xhr) {
            $.dialog.error($.lang.item("error"), JSON.stringify(xhr));
          },
        });
      }
    },
    true,
    null,
    $.lang.item("creating_anamnesis_doc")
  );
};
$.debitors.handleDeliveryAndBillingAddressDropdowns = function(edit)
{
    if($('#i_debitor_anamnesis_delivery_contact').length > 0)
    {
        $('#i_debitor_anamnesis_delivery_contact').on('change',function()
        {
            var contact_id_delivery = $('#i_debitor_anamnesis_delivery_contact').find(":selected").val();
            $.debitors.get_values_from_contact(contact_id_delivery,1);

        });
        if($('#i_debitor_anamnesis_delivery_contact').children('option').length > 1)
        {

        }
        if($('#i_debitor_anamnesis_delivery_contact').children('option').length == 1)
        {
            if(edit == false)
            {
                $('#i_debitor_anamnesis_delivery_contact').trigger('change');
                $('#fi_debitor_anamnesis_delivery_contact').hide();
            }
        }
    }

    if($('#i_debitor_anamnesis_billing_contact').length > 0)
    {
        $('#i_debitor_anamnesis_billing_contact').on('change',function()
        {
            var text = $('#i_debitor_anamnesis_billing_contact').find(":selected").text();
            if($('#i_debitor_anamnesis_billing_contact').find(":selected").val() == '')
            {
                text = "";
            }
            //$('#i_bill_address').val(text);
            var contact_id_bill = $('#i_debitor_anamnesis_billing_contact').find(":selected").val();
            $.debitors.get_values_from_contact(contact_id_bill,2);
        });
        if($('#i_debitor_anamnesis_billing_contact').children('option').length > 1)
        {

        }
        if($('#i_debitor_anamnesis_billing_contact').children('option').length == 1)
        {
            if(edit == false)
            {
                $('#i_debitor_anamnesis_billing_contact').trigger('change');
                $('#fi_debitor_anamnesis_billing_contact').hide();
            }
        }
    }
}

$.debitors.get_values_from_contact = function(contact_id,type){

    if(contact_id == '')
    {
        if(type == 1)
        {
            $.debitors.set_anamnesis_billing_delivery_address(type);
        }
        else if(type == 2)
        {
            $.debitors.set_anamnesis_billing_delivery_address(type);
        }
        return;
    }

    var debitor_id = $("#i_hidden_debitor_id").val();
    var target = baseUrl + "admin/debitors/get_values_debitor_contact";

    var params = {
        debitor_id: debitor_id,
        contact_id: contact_id,
        rendermode: "JSON",
    };

    $.app.sendAjaxRequest(
        target,
        params,
        function success(result) {
            if (result.error && result.error != "")
            {
                $.dialog.error($.lang.item("error"), result.error);
            }
            else
            {
                $.debitors.set_anamnesis_billing_delivery_address(type,result.data);
            }
        },
        true,
        null,
        $.lang.item("msg_wait")
    );
}

$.debitors.set_anamnesis_billing_delivery_address = function(type, values){
    var name        = "";
    var street      = "";
    var zip         = "";
    var location    = "";
    var district    = "";
 if(values != undefined) {
     name           = values.name;
     street         = values.street;
     zip            = values.zipcode;
     location       = values.location;
     district       = values.district;
 }
     if(type == 1){
        $('#i_debitor_anamnesis_delivery_adress_name').val(name);
        $('#i_debitor_anamnesis_delivery_adress_street').val(street);
        $('#i_debitor_anamnesis_delivery_adress_zipcode').val(zip);
        $('#i_debitor_anamnesis_delivery_adress_location').val(location);
        $('#i_debitor_anamnesis_delivery_adress_district').val(district);
     }
     if(type == 2){
         $('#i_debitor_anamnesis_billing_adress_name').val(name);
         $('#i_debitor_anamnesis_billing_adress_street').val(street);
         $('#i_debitor_anamnesis_billing_adress_zipcode').val(zip);
         $('#i_debitor_anamnesis_billing_adress_location').val(location);
         $('#i_debitor_anamnesis_billing_adress_district').val(district);
     }
}
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: PRESCRIPTIONS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
/**
 * Initialize the prescription datatable
 */
$.debitors.init_table_prescriptions = function () {
  if ($("#tbl_debitor_prescriptions").length > 0) {
    $.app.toConsole({ fkt: "$.debitors.init_table_prescriptions" });

    var options = {
      rowId: "prescription_id",
      order: [[7, "desc"]], // Sortierung nach Gültig von Spalte
    };

    var selected_rows = [];
    $.debitors.table_prescriptions = $.app.datatable.initialize_ajax(
      "tbl_debitor_prescriptions",
      baseUrl +
        "admin/prescriptions/datatable/" +
        Math.random() +
        "/" +
        $("#i_debitor_id").val() +
        "/debitor",
      tbl_columns_prescriptions,
      function (row, data, index) {
        //$.app.datatable.callbacks.rowCallback
        $(row)
          .find(".dtbt_edit")
          .each(function () {
            if ($(this).attr("onclick")) {
              $(this).removeAttr("href");
            }
          });
        $(row)
          .find(".dtbt_remove")
          .each(function () {
            if ($(this).attr("onclick")) {
              $(this).removeAttr("href");
            }
          });

        $(row)
          .find(".kv-history-popover")
          .popover({
            html: true,
            placement: function () {
              return $(window).width() < 800 ? "right" : "top";
            },
            title:
              $.lang.item("cost_estimate") +
              " " +
              $.lang.item("history") +
              '<button type="button" id="close" class="close" onclick="$(&quot;.kv-history-popover&quot;).popover(&quot;hide&quot;)">&times;</button>',
            trigger: "manual",
            animation: true,
            container: "body",
            content: "",
          }) /*.bind('click', function(e) {
					e.preventDefault();
					$.prescriptions.kv_history_popover($(this).attr("prescription_id"), $(this).attr("debitor_id"));
				})*/;
      },
      $.app.datatable.callbacks.initComplete,
      options,
      function (data) {
        data.caller_class = "debitors";
      }
    );
  }
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: DOCUMENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
/**
 * Initialize the documents datatable
 */
$.debitors.init_table_debitor_documents = function (debitor_id) {
  if ($("#tbl_debitor_documents").length > 0) {
    if (debitor_id != "") {
      var target =
        baseUrl + "admin/debitors/datatable_debitor_documents/" + debitor_id;
      var options = {
        rowId: "debitor_id",
        destroy: "true",
        deferRender: true,
        serverSide: false,
        ajax: target,
        order: [[4, "asc"]],
      };

      $.debitors.table_debitor_documents = $.app.datatable.initialize_ajax(
        "tbl_debitor_documents",
        "",
        tbl_columns_debitor_documents,
        $.app.datatable.callbacks.rowCallback,
        $.debitors.table_debitor_documents_init_complete,
        options
      );

      //$.debitors.table_debitor_documents = $("#tbl_debitor_documents").DataTable(options);
    } else {
      // save debitors before
    }
  }
};

$.debitors.table_debitor_documents_init_complete = function () {
  var count = $(".contract_document_must_generate").length;
  if (count > 0) {
    $("#mandatory_doc_count").html("<b>" + count + "</b>");
  }
};
/**
 * Download a document by its ID
 */
$.debitors.download_debitor_document = function (document_id) {
  var target =
    baseUrl + "admin/debitors/download_debitor_document/" + document_id;

  $.ajax({
    type: "GET",
    url: target,
    processData: false,
    success: function (data) {
      window.open(target, "_blank");
      //window.location = target;
    },
    error: function (xhr) {
      $.dialog.error($.lang.item("error"), JSON.stringify(xhr));
    },
  });
};

$.debitors.remove_debitor_document = function (document_id) {
  var params = [
    { name: "document_id", value: document_id },
    { name: "confirmed", value: 1 },
    { name: "rendermode", value: "JSON" },
  ];

  $.dialog.confirm_delete(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("debitor_document_sure_delete"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        baseUrl + "admin/debitors/remove_debitor_document/" + document_id,
        params,
        function success(result) {
          $.app.toConsole({ fkt: "callback_ajax", result: result });
          if (result.error && result.error != "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            if (result.status == "SUCCESS") {
              $.dialog.success(
                $.lang.item("done"),
                $.lang.item("document_has_been_deleted"),
                function callback_done() {
                  $.debitors.init_table_debitor_documents(
                    $("#i_debitor_id").val()
                  );
                }
              );
            }
          }
        },
        true,
        null,
        $.lang.item("document_delete_progress")
      );
    },
    null,
    $.lang.item("document_delete"),
    $.lang.item("cancel")
  );
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: CONTACTS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.init_table_debitor_contacts = function (debitor_id) {
  if ($("#tbl_debitor_contacts").length > 0) {
    if (debitor_id != "") {
      var target =
        baseUrl + "admin/debitors/datatable_debitor_contacts/" + debitor_id;
      var options = {
        rowId: "debitor_id",
        destroy: "true",
        deferRender: true,
        serverSide: false,
        order: [[1, "asc"]],
      };

      $.debitors.table_debitor_contacts = $.app.datatable.initialize_ajax(
        "tbl_debitor_contacts",
        target,
        tbl_columns_debitor_contatcs,
        $.app.datatable.callbacks.rowCallback,
        $.app.datatable.callbacks.initComplete,
        options
      );
    } else {
      // save debitors before
    }
  }
};

$.debitors.save_debitor_contact = function (e) {
  var debitor_id = $("#i_hidden_debitor_id").val();
  var params = $("#form_debitor_contacts").serializeArray();
  params.push({ name: "rendermode", value: "json" });

  $.app.sendAjaxRequest(
    e.delegateTarget.action,
    params,
    function success(result) {
      $.app.toConsole({ fkt: "callback save debitor ajax", data: result });

      $.app.setFormValidationStates(
        "form_debitor_contacts",
        result.error,
        result.extra,
        null
      );

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("debitor_contact_has_been_saved"),
          function callback() {
            $('#debitor-contact-tabs a[href="#debitor-contact-list"]').tab(
              "show"
            );
            $.debitors.init_table_debitor_contacts(debitor_id);
            //$.app.replaceContent(result.data, $.debitors.init_form, undefined);
            setTimeout(function () {
              $.debitors.init_tabs_from_prescription();
            }, 500);
          }
        );
      }
    },
    true,
    null,
    $.lang.item("debitor_contact_save_progress")
  );
};

$.debitors.remove_debitor_contact = function (contact_id) {
  var debitor_id = $("#i_hidden_debitor_id").val();

  $.app.toConsole({ fkt: "$.debitors.remove", id: contact_id });
  if (contact_id == undefined || debitor_id == undefined) {
    throw new Error($.lang.item("msg_missing_parameter"));
  }

  var params = [
    { name: "debitor_id", value: debitor_id },
    { name: "contact_id", value: contact_id },
    { name: "confirmed", value: 1 },
    { name: "rendermode", value: "JSON" },
  ];

  $.dialog.confirm_delete(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("debitor_contact_sure_delete"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        baseUrl + "admin/debitors/remove_debitor_contact/",
        params,
        function success(result) {
          $.app.toConsole({ fkt: "callback_ajax", result: result });
          if (result.error && result.error != "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            if (result.status == "SUCCESS") {
              $.dialog.success(
                $.lang.item("done"),
                $.lang.item("debitor_contact_has_been_deleted"),
                function callback_done() {
                  $.debitors.init_table_debitor_contacts(debitor_id);
                }
              );
            }
          }
        },
        true,
        null,
        $.lang.item("debitor_delete_progress")
      );
    },
    null,
    $.lang.item("debitor_delete"),
    $.lang.item("cancel")
  );
};

$.debitors.create_debitor_contact = function () {
  var debitor_id = $("#i_hidden_debitor_id").val();
  var target = baseUrl + "admin/debitors/create_debitor_contact/" + debitor_id;

  var params = {
    debitor_id: debitor_id,
    rendermode: "AJAX",
  };

  var on_content_replaced = function () {
    $.app.init_toggle();
    $.app.init_select2();
    $.app.init_datepicker();

    $("#i_external_phrases_selection").select2({
      placeholder: $.lang.please_select,
      width: "100%",
      allowClear: false,
      language: $.lang.locale,
      //theme: "classic"
      theme: "bootstrap",
      dropdownAutoWidth: true,
      tags: true,
    });
    $('#debitor-contact-tabs a[href="#debitor-contact-form"]').tab("show");

    $("#bt_back_contact, #bt_back_contact_bottom")
      .off("click")
      .on("click", function () {
        $('#debitor-contact-tabs a[href="#debitor-contact-list"]').tab("show");
        $("#debitor-contact-form").html("");
      });

    $("#form_debitor_contacts").off("submit");
    $("#form_debitor_contacts").submit(function (e) {
      $.debitors.save_debitor_contact(e);
      e.preventDefault();
    });

    $("#bt_data_from_debitor, #bt_data_from_debitor_bottom")
      .off("click")
      .on("click", function () {
        if ($("#full_form_debitor").length > 0) {
          $.debitors.copyDataFromDebitor();
        }
      });

    if ($("#i_address_type_CONTACT_TYPE_DELIVERY").length > 0) {
      $("#i_address_type_CONTACT_TYPE_DELIVERY")
        .off("click")
        .on("click", function () {
          $.debitors.show_delivery_form();
        });
    }
    $("#i_contact_country").on("change", function () {
      $("#i_contact_subdivision").empty();

      $.each(all_subdivisions[$(this).val()], function (index, subdivision) {
        $("#i_contact_subdivision").append(
          "<option id=" +
            subdivision.subdivision_code +
            " value='" +
            subdivision.subdivision_code +
            "'>" +
            subdivision.subdivision_select_label +
            "</option>"
        );
      });
      $("#i_contact_subdivision").val("").change();
    });
    // init delivery contact form
    $("#i_delivery_service").change($.debitors.onContactDeliveryServiceChange);
    $("#i_delivery_type")
      .change($.debitors.onContactDeliveryTypeChange)
      .trigger("change");
  };

  // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-contact-form",
          undefined
        );
        makeContactAutoCompleter();
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.edit_debitor_contact = function (contact_id) {
  var debitor_id = $("#i_hidden_debitor_id").val();
  var target =
    baseUrl +
    "admin/debitors/edit_debitor_contact/" +
    debitor_id +
    "/" +
    contact_id;

  var on_content_replaced = function () {
    $.app.init_toggle();
    $.app.init_select2();
    $.app.init_datepicker();

    $("#i_external_phrases_selection").select2({
      placeholder: $.lang.please_select,
      width: "100%",
      allowClear: false,
      language: $.lang.locale,
      //theme: "classic"
      theme: "bootstrap",
      dropdownAutoWidth: true,
      tags: true,
    });

    $('#debitor-contact-tabs a[href="#debitor-contact-form"]').tab("show");
    $("#bt_back_contact, #bt_back_contact_bottom")
      .off("click")
      .on("click", function () {
        $('#debitor-contact-tabs a[href="#debitor-contact-list"]').tab("show");
        $("#debitor-contact-form").html("");
      });

    $("#form_debitor_contacts").off("submit");
    $("#form_debitor_contacts").submit(function (e) {
      $.debitors.save_debitor_contact(e);
      e.preventDefault();
    });

    $("#bt_data_from_debitor, #bt_data_from_debitor_bottom")
      .off("click")
      .on("click", function () {
        if ($("#full_form_debitor").length > 0) {
          $.debitors.copyDataFromDebitor();
        }
      });

    if ($("#i_address_type_CONTACT_TYPE_DELIVERY").length > 0) {
      $("#i_address_type_CONTACT_TYPE_DELIVERY")
        .off("click")
        .on("click", function () {
          $.debitors.show_delivery_form();
        });
    }
    $("#i_contact_country").on("change", function () {
      $("#i_contact_subdivision").empty();

      $.each(all_subdivisions[$(this).val()], function (index, subdivision) {
        $("#i_contact_subdivision").append(
          "<option id=" +
            subdivision.subdivision_code +
            " value='" +
            subdivision.subdivision_code +
            "'>" +
            subdivision.subdivision_select_label +
            "</option>"
        );
      });
      $("#i_contact_subdivision").val("").change();
    });

    // init delivery contact form
    $("#i_delivery_service").change($.debitors.onContactDeliveryServiceChange);
    $("#i_delivery_type")
      .change($.debitors.onContactDeliveryTypeChange)
      .trigger("change");
  };

  // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
  var params = {
    debitor_id: debitor_id,
    contact_id: contact_id,
    rendermode: "AJAX",
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-contact-form"
        );
        makeContactAutoCompleter();
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.copyDataFromDebitor = function () {
  $("#i_contact_firstname").val($("#i_firstname").val());
  $("#i_contact_lastname").val($("#i_lastname").val());
  $("#i_contact_name1").val($("#i_name_1").val());
  $("#i_contact_name2").val($("#i_name_2").val());
  $("#i_contact_name3").val($("#i_name_3").val());
  $("#i_contact_street").val($("#i_street").val());
  $("#i_contact_house_nr").val($("#i_house_nr").val());
  $("#i_contact_zipcode").val($("#i_zipcode").val());
  $("#i_contact_location").val($("#i_location").val());
  $("#i_contact_district").val($("#i_district").val());
  $("#i_contact_phone").val($("#i_phone").val());
  $("#i_contact_phone_mobile").val($("#i_cellular_phone").val());
  $("#i_contact_fax").val($("#i_fax").val());
  $("#i_contact_email").val($("#i_email").val());
  $("#i_contact_country")
    .val($("select[name=country] option:selected").val())
    .change();
  $("#i_contact_subdivision")
    .val($("select[name=subdivision] option:selected").val())
    .change();
  $("#i_delivery_type")
    .val($("select[name=debitor_delivery_type] option:selected").val())
    .change();
  $("#i_contact_additional_information").val(
    $("#i_base_data_additional_information").val()
  );
  $("#i_contact_title").val($("#i_title").val());
  $("#i_contact_salutation")
    .val($("select[name=salutation] option:selected").val())
    .change();
};
/**
 *
 */
$.debitors.updateContactDeliveryServiceSelect = function () {
  let selectedValue = $("#i_delivery_service").val();
  let options = "";
  $.orders.deliveryServices.forEach(function (service, index, extras) {
    options += `<option value="${service.delivery_service_id}">${service.delivery_service_id}</option>`;
  }, null);

  $("#i_delivery_service").html(options);
  $("#i_delivery_service").val(selectedValue).trigger("change");
};

/**
 *	Contact Delivery Type Change Event
 */
$.debitors.onContactDeliveryTypeChange = async () => {
  const deliveryTypeSelect = $("#i_delivery_type");
  const deliveryServiceSelect = $("#i_delivery_service");

  if ($.orders.deliveryTypes.length === 0) {
    await $.orders.loadDeliveryTypes();
  }

  if (!deliveryTypeSelect.val()) return;

  await $.orders.loadDeliveryServices(
    true,
    deliveryTypeSelect.val(),
    $.debitors.updateContactDeliveryServiceSelect
  );
};

/**
 *	Contact Delivery Service Change Event
 */
$.debitors.onContactDeliveryServiceChange = async () => {
  const deliveryTypeSelect = $("#i_delivery_type");
  const deliveryOptionSelect = $("#i_delivery_service");

  let selectedValue = deliveryOptionSelect.val();

  if ($.orders.deliveryServices.length === 0) {
    await $.orders.loadDeliveryServices(true, deliveryTypeSelect.val());
  }

  let selectedDeliveryService = $.orders.deliveryServices.find(
    (option) => option.delivery_service_id === selectedValue
  );

  if (!selectedDeliveryService) {
    let selectedDeliveryType = $.orders.deliveryTypes.find(
      (option) => option.delivery_option_id === deliveryTypeSelect.val()
    );

    if (selectedDeliveryType) {
      selectedDeliveryService = $.orders.deliveryServices.find(
        (option) =>
          option.delivery_service_id ===
          selectedDeliveryType.default_delivery_service
      );

      if (selectedDeliveryService) {
        $("#i_delivery_service").val(
          selectedDeliveryService.delivery_service_id
        );
      }
    }
  }

  if (!selectedDeliveryService) {
    return console.warn("selectedDeliveryService not found");
  }
};

$.debitors.show_delivery_form = function () {
  if ($("#i_address_type_CONTACT_TYPE_DELIVERY").is(":checked")) {
    $("#form_contact_delivery").removeClass("hidden").show();
    $("#fi_contact_firstname").addClass("required");
    $("#fi_street_house_nr").addClass("required");
    $("#fi_zipcode_and_location").addClass("required");
  } else {
    $("#form_contact_delivery").addClass("hidden").hide();
    $("#fi_contact_firstname").removeClass("required");
    $("#fi_street_house_nr").removeClass("required");
    $("#fi_zipcode_and_location").removeClass("required");
  }
};
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: ORDERS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.init_table_debitor_parent_orders = function (debitor_id) {
  var order_params = {};
  order_params.did = debitor_id;
  if ($.debitors.orders_for_prescription_id != null) {
    order_params.pid = $.debitors.orders_for_prescription_id;
    $.debitors.orders_for_prescription_id = null;
  }
  if ($("#tbl_debitor_orders").length > 0 && debitor_id != "") {
    var target =
      baseUrl + "admin/debitors/datatable_debitor_orders/" + debitor_id;

    var options = {
      //rowId: 'debitor_id',
      destroy: "true",
      deferRender: true,
      serverSide: true,
      order: [[ 4, 'desc']],
      columnDefs: [
        { className: "details-control", targets: ["details-control"] },
        { type: "ddMmYyyy", targets: ["supply_from", "supply_to"] },
      ],
      rowId: "order_id_key",
      createdRow: function (row, data, index) {
        $(row).closest("tr").addClass("dtrg-group-custom");
        if (data.count_children == 0) {
          $("td", row).eq(0).removeClass("details-control");
        }
      },
    };

    $.debitors.table_debitor_orders = $.app.datatable.initialize_ajax(
      "tbl_debitor_orders",
      target,
      tbl_columns_debitor_parent_orders,
      function (row, data, index) {
        /*				$.app.toConsole({"fkt": "row_callback", "row": row, "data": data, "index": index});

				$(row).find(".dtbt_edit").each(function () {
					if ($(this).attr("onclick")) {
						$(this).removeAttr("href");
					}
				});
				$(row).find(".dtbt_remove").each(function () {
					if ($(this).attr("onclick")) {
						$(this).removeAttr("href");
					}
				});*/
        /*$(row).find(".btn-order-preview").each(function(){
					if (!$(this).hasClass("moved-to-parent")){
						$(this).remove(); //delete the original preview button, a copy was appended to parent in rowGroup startRender
					}
				});*/
      },
      $.app.datatable.callbacks.initComplete,
      options,
      function (data) {
        data.order_params = order_params;
      }
    );

    // Add Event-Listener to expand child-rows
    $.debitors.table_debitor_orders
      .off("click", "td.details-control")
      .on("click", "td.details-control", function (evt) {
        /*if(!$(this).hasClass("articles-control"))
			{*/
        var tr = $(this).closest("tr");
        var row = $.debitors.table_debitor_orders.row(tr);

        $.orders.row_details(tr, row, "debitors", "edit_debitor_order", true);
        /*}
			else
			{
				var tr 	= $(this).closest('tr');
				var row = $.debitors.table_debitor_orders.row( tr );

				$.app.toConsole($.debitors.table_debitor_orders);

				$.orders.row_details_artciles(tr, row, 'debitors', 'edit_debitor_order', true);
			}*/
      });
  }
};

/*$.debitors.init_table_debitor_orders = function (debitor_id) {
	if ($("#tbl_debitor_orders").length > 0 && debitor_id != "") {
		var target = baseUrl + "admin/debitors/datatable_debitor_orders/" + debitor_id;

		var options = {
			//rowId: 'debitor_id',
			destroy: 'true',
			deferRender: true,
			serverSide: false,
			//order: [[10, 'desc']],
			orderFixed: [[11, 'desc']],
			order: [[9, 'asc']],
			rowGroup: {
				startRender: $.orders.startRender,
				endRender: null,
				dataSrc: 'order_parent'
			},
			columnDefs: [
				{className: "details-control", targets: 1},
			],
			rowId: 'order_id_key'
		};

		$.debitors.table_debitor_orders = $.app.datatable.initialize_ajax("tbl_debitor_orders", target, tbl_columns_debitor_parent_orders,
			function (row, data, index) {
				$.app.toConsole({"fkt": "row_callback", "row": row, "data": data, "index": index});

				$(row).find(".dtbt_edit").each(function () {
					if ($(this).attr("onclick")) {
						$(this).removeAttr("href");
					}
				});
				$(row).find(".dtbt_remove").each(function () {
					if ($(this).attr("onclick")) {
						$(this).removeAttr("href");
					}
				});

				//$(row).find(".btn-order-preview").each(function(){
				//	if (!$(this).hasClass("moved-to-parent")){
				//		$(this).remove(); //delete the original preview button, a copy was appended to parent in rowGroup startRender
				//	}
				//});
			},
			$.app.datatable.callbacks.initComplete,
			options
		);

		// Add Event-Listener to expand child-rows
		$.debitors.table_debitor_orders.on('click', 'td.details-control', function (evt)
		{
			var tr 	= $(this).closest('tr');
			var row = $.debitors.table_debitor_orders.row( tr );

			$.orders.row_details(tr, row);
		});
	}
};*/

/**
 * create subsequent delivery
 */
$.debitors.create_subsequent_delivery_order = function(id)
{
	localStorage.removeItem('prescription_selected_before');
	$.app.toConsole({"fkt":"$.orders.create_subsequent_delivery", "id":id});

	var debitor_id = $("#i_hidden_debitor_id").val();

	//let params = $("#form_order").serializeArray();
	let params = [];
	params.push({"name":"debitor_id", "value":debitor_id});
	params.push({"name":"order_id", "value":id});
	params.push({"name":"rendermode", "value":"ajax"});

	let target = baseUrl+"admin/orders/create_subsequent_delivery/"+id;

	//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	var on_content_replaced = function () {
		$('#debitor-orders-tabs a[href="#debitor-orders-form"]').tab("show");
		$("#bt_back_order, #bt_back_order_bottom").show();
		$("#fi_order_debitor_id").hide();
		$("#bt_to_debitor").hide();

		$.orders.init_form(); // Init the ORDERS-Form
		$("#bt_back_order, #bt_back_order_bottom")
			.off("click")
			.on("click", function () {
				$('#debitor-orders-tabs a[href="#debitor-orders-list"]').tab("show");
				$("#debitor-orders-form").html("");
			});
	};

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, on_content_replaced, "debitor-orders-form");
			//$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
}

$.debitors.edit_debitor_order = function (order_id, only_preview) {
  localStorage.removeItem("prescription_selected_before");
  var debitor_id = $("#i_hidden_debitor_id").val();

  var params = {
    debitor_id: debitor_id,
    order_id: order_id,
    rendermode: "AJAX",
  };

  var target = baseUrl + "admin/orders/create/";
  if (order_id !== undefined) {
    target = baseUrl + "admin/orders/edit/" + order_id;
  }
  if (only_preview !== undefined) {
    target = baseUrl + "admin/orders/preview/" + order_id;
  }

  //..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
  var on_content_replaced = function () {
    $('#debitor-orders-tabs a[href="#debitor-orders-form"]').tab("show");
    $("#bt_back_order, #bt_back_order_bottom").show();
    $("#fi_order_debitor_id").hide();
	$("#bt_to_debitor").hide();

    $.orders.init_form(); // Init the ORDERS-Form
    $("#bt_back_order, #bt_back_order_bottom")
      .off("click")
      .on("click", function () {
        $('#debitor-orders-tabs a[href="#debitor-orders-list"]').tab("show");
        $("#debitor-orders-form").html("");
      });
  };

  //..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-orders-form"
        );
        makeOrderAutoCompleter();
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: DELIVERY ADDRESSES :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
/**
 * Initialize the table for shipping addresses
 */
$.debitors.init_table_debitor_delivery = function (debitor_id) {
  if ($("#tbl_debitor_delivery").length > 0) {
    if (debitor_id != "") {
      var target =
        baseUrl + "admin/debitors/datatable_debitor_delivery/" + debitor_id;
      var options = {
        rowId: "debitor_id",
        destroy: "true",
        deferRender: true,
        serverSide: false,
        order: [[1, "asc"]],
      };

      $.debitors.table_debitor_contacts = $.app.datatable.initialize_ajax(
        "tbl_debitor_delivery",
        target,
        tbl_columns_delivery_data,
        $.app.datatable.callbacks.rowCallback,
        $.app.datatable.callbacks.initComplete,
        options
      );
    }
  }
};

$.debitors.create_debitor_delivery = function () {
  var debitor_id = $("#i_hidden_debitor_id").val();
  var target = baseUrl + "admin/debitors/create_debitor_delivery/" + debitor_id;

  var params = {
    debitor_id: debitor_id,
    rendermode: "AJAX",
  };

  var on_content_replaced = function () {
    $.app.init_toggle();
    $.app.init_select2();
    $.app.init_datepicker();

    $('#debitor-delivery-tabs a[href="#debitor-delivery-form"]').tab("show");
    $("#bt_back_delivery")
      .off("click")
      .on("click", function () {
        $('#debitor-delivery-tabs a[href="#debitor-delivery-list"]').tab(
          "show"
        );
        $("#debitor-delivery-form").html("");
      });

    $("#form_debitor_delivery").off("submit");
    $("#form_debitor_delivery").submit(function (e) {
      $.debitors.save_debitor_delivery(e);
      e.preventDefault();
    });
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-delivery-form",
          undefined
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.save_debitor_delivery = function (e) {
  var debitor_id = $("#i_hidden_debitor_id").val();
  var params = $("#form_debitor_delivery").serializeArray();
  params.push({ name: "rendermode", value: "json" });

  $.app.sendAjaxRequest(
    e.delegateTarget.action,
    params,
    function success(result) {
      $.app.toConsole({ fkt: "callback save debitor ajax", data: result });

      $.app.setFormValidationStates(
        "form_debitor_delivery",
        result.error,
        result.extra,
        null
      );

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("debitor_delivery_has_been_saved"),
          function callback() {
            $('#debitor-delivery-tabs a[href="#debitor-delivery-list"]').tab(
              "show"
            );
            $.debitors.init_table_debitor_delivery(debitor_id);
          }
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.remove_debitor_delivery = function (delivery_account_id) {
  var debitor_id = $("#i_hidden_debitor_id").val();

  $.app.toConsole({ fkt: "$.debitors.remove", id: delivery_account_id });
  if (delivery_account_id == undefined || debitor_id == undefined) {
    throw new Error($.lang.item("msg_missing_parameter"));
  }

  var params = [
    { name: "debitor_id", value: debitor_id },
    { name: "delivery_account_id", value: delivery_account_id },
    { name: "confirmed", value: 1 },
    { name: "rendermode", value: "JSON" },
  ];

  $.dialog.confirm_delete(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("debitor_delivery_sure_delete"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        baseUrl + "admin/debitors/remove_debitor_delivery/",
        params,
        function success(result) {
          $.app.toConsole({ fkt: "callback_ajax", result: result });
          if (result.error && result.error != "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            if (result.status == "SUCCESS") {
              $.dialog.success(
                $.lang.item("done"),
                $.lang.item("debitor_delivery_has_been_deleted"),
                function callback_done() {
                  $.debitors.init_table_debitor_delivery(debitor_id);
                }
              );
            }
          }
        },
        true,
        null,
        $.lang.item("msg_wait")
      );
    },
    null,
    $.lang.item("debitor_delivery_delete"),
    $.lang.item("cancel")
  );
};

$.debitors.edit_debitor_delivery = function (delivery_account_id) {
  var debitor_id = $("#i_hidden_debitor_id").val();
  var target =
    baseUrl +
    "admin/debitors/edit_debitor_delivery/" +
    debitor_id +
    "/" +
    delivery_account_id;

  var on_content_replaced = function () {
    $.app.init_toggle();
    $.app.init_select2();
    $.app.init_datepicker();

    $('#debitor-delivery-tabs a[href="#debitor-delivery-form"]').tab("show");
    $("#bt_back_delivery")
      .off("click")
      .on("click", function () {
        $('#debitor-delivery-tabs a[href="#debitor-delivery-list"]').tab(
          "show"
        );
        $("#debitor-delivery-form").html("");
      });

    $("#form_debitor_delivery").off("submit");
    $("#form_debitor_delivery").submit(function (e) {
      $.debitors.save_debitor_delivery(e);
      e.preventDefault();
    });
  };

  var params = {
    debitor_id: debitor_id,
    delivery_account_id: delivery_account_id,
    rendermode: "AJAX",
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-delivery-form"
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.setDeliveryActive = function (delivery_account_id) {
  var target = baseUrl + "admin/debitors/setDebitorDeliveryActive";

  var params = {
    debitor_id: $("#i_hidden_debitor_id").val(),
    delivery_account_id: delivery_account_id,
    rendermode: "json",
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      $.app.toConsole({ fkt: "callback setDeliveryActive ajax", data: result });

      //$.app.setFormValidationStates("form_debitor_delivery", result.error, result.extra, null);

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("debitor_delivery_has_been_saved"),
          function callback() {}
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: REMINDER ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.init_table_reminder = function (debitor_id) {
  if ($("#tbl_debitor_reminder").length > 0) {
    $.app.toConsole({ fkt: "$.debitors.init_table_reminder" });
    $.debitors.table_debitor_reminder = $.app.datatable.initialize_ajax(
      "tbl_debitor_reminder",
      baseUrl + "admin/debitors/datatable_debitor_reminder/" + debitor_id,
      tbl_columns_debitor_reminder,
      $.app.datatable.callbacks.rowCallback,
      $.app.datatable.callbacks.initComplete
    );
  }
};

$.debitors.create_debitor_reminder = function () {
  var reminder_id = 0;

  if ($("#i_hidden_reminder_id").length > 0) {
    //	reminder_id 	= $("#i_hidden_reminder_id").val();
  }
  var debitor_id = $("#i_hidden_debitor_id").val();
  var target =
    baseUrl + "admin/debitors/create_debitor_reminder/" + reminder_id;
  var params = {
    reminder_id: reminder_id,
    debitor_id: debitor_id,
    rendermode: "AJAX",
  };

  var on_content_replaced = function () {
    $.app.init_toggle();
    $.app.init_select2();
    $.app.init_datepicker();

    $('#debitor-reminder-tabs a[href="#debitor-reminder-form"]').tab("show");
    $("#bt_back_reminder, #bt_back_reminder_bottom")
      .off("click")
      .on("click", function () {
        $('#debitor-reminder-tabs a[href="#debitor-reminder-list"]').tab(
          "show"
        );
        $("#debitor-reminder-form").html("");
      });

    $("#form_debitor_reminder").off("submit");
    $("#form_debitor_reminder").submit(function (e) {
      $.debitors.save_debitor_reminder(e);
      e.preventDefault();
    });
    $.debitors.toggle_reminder_prescription_selection();
    $("#i_reminder_type").on("change", function () {
      $.debitors.toggle_reminder_prescription_selection();
    });
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-reminder-form",
          undefined
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.setReminderActive = function (reminder_id, active) {
  var target = baseUrl + "admin/debitors/setDebitorReminderActive";
  var params = {
    reminder_id: reminder_id,
    reminder_state: active,
    rendermode: "json",
  };

  $.dialog.confirm(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("change_state_of_reminder"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        target,
        params,
        function success(result) {
          $.app.toConsole({
            fkt: "callback setReminderActive ajax",
            data: result,
          });

          //$.app.setFormValidationStates("form_debitor_delivery", result.error, result.extra, null);

          if (result.error && result.error != "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            $.debitors.init_table_reminder($("#i_debitor_id").val());
          }
        },
        true,
        null,
        $.lang.item("msg_wait")
      );
    },
    function callback_no() {
      $.debitors.init_table_reminder($("#i_debitor_id").val());
    },
    $.lang.item("change_state_of_reminder"),
    $.lang.item("cancel")
  );
};

$.debitors.save_debitor_reminder = function (e) {
  var debitor_id = $("#i_debitor_id").val();
  var form = $("#form_debitor_reminder").get(0);
  var params = new FormData(form);
  params.append("rendermode", "json");
  params.append("debitor_id", debitor_id);

  $.app.sendAjaxRequest(
    e.delegateTarget.action,
    params,
    function success(result) {
      $.app.toConsole({ fkt: "callback save_debitor_reminder", data: result });

      $.app.setFormValidationStates(
        "form_debitor_reminder",
        result.error,
        result.extra,
        null
      );

      if (result.error && result.error !== null) {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("reminder_has_been_saved"),
          function callback() {
            $('#debitor-reminder-tabs a[href="#debitor-reminder-list"]').tab(
              "show"
            );
            $.debitors.init_table_reminder($("#i_debitor_id").val());
          }
        );
      }
    },
    true,
    null,
    $.lang.item("reminder_save_progress"),
    false,
    false,
    false
  );
};

$.debitors.edit_debitor_reminder = function (reminder_id) {
  var target = baseUrl + "admin/debitors/edit_debitor_reminder/" + reminder_id;
  var debitor_id = $("#i_debitor_id").val();

  var params = [];

  params.push({ name: "rendermode", value: "ajax" });
  params.push({ name: "debitor_id", value: debitor_id });
  params.push({ name: "reminder_id", value: reminder_id });

  var on_content_replaced = function () {
    $.app.init_toggle();
    $.app.init_select2();
    $.app.init_datepicker();

    $('#debitor-reminder-tabs a[href="#debitor-reminder-form"]').tab("show");
    $("#bt_back_reminder, #bt_back_reminder_bottom")
      .off("click")
      .on("click", function () {
        $('#debitor-reminder-tabs a[href="#debitor-reminder-list"]').tab(
          "show"
        );
        $("#debitor-reminder-form").html("");
      });

    $("#form_debitor_reminder").off("submit");
    $("#form_debitor_reminder").submit(function (e) {
      $.debitors.save_debitor_reminder(e);
      e.preventDefault();
    });
    $.debitors.toggle_reminder_prescription_selection();
    $("#i_reminder_type").on("change", function () {
      $.debitors.toggle_reminder_prescription_selection();
    });
  };

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.app.replaceContent(
          result.data,
          on_content_replaced,
          "debitor-reminder-form"
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

$.debitors.toggle_reminder_prescription_selection = function () {
  var selectedValue = $("#i_reminder_type").val();
  var arrVals = [
    "reminder_check_prescription",
    "reminder_get_followup_prescription",
  ];
  if ($.inArray(selectedValue, arrVals) > -1) {
    $("#fi_reminder_prescription").show();
  } else {
    $("#fi_reminder_prescription").hide();
  }
};

$.debitors.remove_debitor_reminder = function (reminder_id) {
  var params = [
    { name: "reminder_id", value: reminder_id },
    { name: "confirmed", value: 1 },
    { name: "rendermode", value: "JSON" },
  ];

  $.dialog.confirm_delete(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("reminder_sure_delete"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        baseUrl + "admin/debitors/remove_debitor_reminder/" + reminder_id,
        params,
        function success(result) {
          $.app.toConsole({ fkt: "callback_ajax", result: result });
          if (result.error && result.error != "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            if (result.status == "SUCCESS") {
              $.dialog.success(
                $.lang.item("done"),
                $.lang.item("reminder_has_been_deleted"),
                function callback_done() {
                  $.debitors.init_table_reminder($("#i_debitor_id").val());
                }
              );
            }
          }
        },
        true,
        null,
        $.lang.item("reminder_delete_progress")
      );
    },
    null,
    $.lang.item("reminder_delete"),
    $.lang.item("cancel")
  );
};

$.debitors.set_debitor_reminder_workstate = function (reminder_id) {
  var params = [
    { name: "reminder_id", value: reminder_id },
    { name: "confirmed", value: 1 },
    { name: "rendermode", value: "JSON" },
  ];
  $.dialog.confirm(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("change_reminder_workstate"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        baseUrl +
          "admin/debitors/set_debitor_reminder_workstate/" +
          reminder_id,
        params,
        function success(result) {
          $.app.toConsole({ fkt: "callback_ajax", result: result });
          if (result.error && result.error != "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            if (result.status == "SUCCESS") {
              $.debitors.init_table_reminder($("#i_debitor_id").val());
            }
          }
        },
        true,
        null,
        $.lang.item("reminder_workstate_change_progress")
      );
    },
    null,
    $.lang.item("yes"),
    $.lang.item("cancel")
  );
};
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: HISTORY ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.init_table_debitor_history = function (debitor_id) {
  if ($("#tbl_debitor_history").length > 0) {
    var target =
      baseUrl + "admin/debitors/datatable_debitor_history/" + debitor_id;

    var options = {
      info: false,
      paging: false,
      ordering: true,
      autoWidth: false,
      searching: false,
      serverSide: true,
      order: [[4, "desc"]],
    };

    $.debitors.table_debitor_history = $.app.datatable.initialize_ajax(
      "tbl_debitor_history",
      target,
      tbl_columns_debitor_history,
      $.app.datatable.callbacks.rowCallback,
      $.app.datatable.callbacks.initComplete,
      options,
        $.debitors.selectHistoryTab
    );
  }
};
$.debitors.selectHistoryTab = function()
{
    if($('a[href$="debitor_history"]').length >0 && $('#history-tab-list li.active').length <= 0)
    {
        $('a[href$="debitor_history"]').trigger('click');
    }
}

$.debitors.show_single_history = function (history_id) {
  if (history_id != undefined) {
    var params = [
      { name: "history_id", value: history_id },
      { name: "rendermode", value: "JSON" },
    ];

    $.app.sendAjaxRequest(
      baseUrl + "admin/debitors/get_history_details/" + history_id,
      params,
      function success(result) {
        if (result.error && result.error != "") {
          $.dialog.error($.lang.item("error"), result.error);
        } else {
          if (result.status == "SUCCESS") {
            $.dialog.info($.lang.item("history_detail"), result.data[0]);
          }
        }
      },
      true,
      null,
      $.lang.item("show_single_history_progress")
    );
  } else {
    $.dialog.error($.lang.item("error"), $.lang.item("msg_missing_parameter"));
  }
};

$.debitors.init_filter_documents = function () {
  $("button[name=filter_debitor_documents]").each(function () {
    $(this).on("click", function (e) {
      $("button[name=filter_debitor_documents]").removeClass("active");
      $(this).addClass("active");

      var search_column = undefined;
      var search = "";
      var cols = [8, 11];

      if (
        $(this).attr("id") ==
        "btn_filter_debitor_document_mandatory_to_complete"
      ) {
        search_column = cols[0];
      }

      if (
        $(this).attr("id") ==
        "btn_filter_debitor_document_prescription_document"
      ) {
        search_column = cols[1];
      }

      $.each(cols, function (index, column) {
        if (column == search_column) {
          search = 1;
        } else {
          search = "";
        }
        $.debitors.table_debitor_documents.column(column).search(search).draw();
      });
    });
  });

  $("#i_document_contract_filter").on("change", function () {
    var search = "";
    if ($(this).val() != "ALL") {
      search = $("select[name=document_contract_filter] option:selected").val();
    }
    $.debitors.table_debitor_documents.column(9).search(search).draw();
  });
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: DEBITOR CONTACT HISTORY ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.init_table_debitor_contact_history = function (debitor_id) {
    if ($("#tbl_debitor_history").length > 0) {
        var target =
            baseUrl + "admin/debitors/datatable_debitor_contact_history/" + debitor_id;

        var options = {
            info: false,
            paging: false,
            ordering: true,
            autoWidth: false,
            searching: true,
            serverSide: true,
            order: [[3, "desc"]],
        };

        $.debitors.table_debitor_contact_history = $.app.datatable.initialize_ajax(
            "tbl_debitor_contact_history",
            target,
            tbl_columns_debitor_contact_history,
            $.app.datatable.callbacks.rowCallback,
            $.app.datatable.callbacks.initComplete,
            options
        );
    }
};

$.debitors.create_debitor_contact_history = function () {
    var target = baseUrl + "admin/debitors/create_debitor_contact_history/";
    var params = {
        debitor_id: $("#i_debitor_id").val(),
        rendermode: "AJAX",
    };
    var on_content_replaced = function () {
        $('#debitor-contact_history-tabs a[href="#debitor-contact_history-form"]').tab("show");
        $("#bt_back_debitor_contact_history")
            .off("click")
            .on("click", function () {
                $('#debitor-contact_history-tabs a[href="#debitor-contact_history-list"]').tab("show");
                $("#debitor-contact_history-form").html("");
            });
        $.app.init_select2('#i_contact_kind');
        $.app.init_select2('#i_contact_action');
        $.app.init_select2('#i_contact_history_content');

        $("#full_debitor_contact_history_form").off("submit");
        $("#full_debitor_contact_history_form").submit(function (e) {
            $.debitors.save_debitor_contact_history(e);
            e.preventDefault();
        });
    };
    $.app.sendAjaxRequest(
        target,
        params,
        function success(result) {
            if (result.error && result.error != "") {
                $.dialog.error($.lang.item("error"), result.error);
            } else {
                $.app.replaceContent(
                    result.data,
                    on_content_replaced,
                    "debitor-contact_history-form",
                    undefined
                );
            }
        },
        true,
        null,
        $.lang.item("msg_wait")
    );

}

$.debitors.edit_debitor_contact_history = function (debitor_contact_history_id) {

    var target = baseUrl + "admin/debitors/edit_debitor_contact_history/";
    var params = {
        debitor_id: $("#i_debitor_id").val(),
        rendermode: "AJAX",
        debitor_contact_history_id: debitor_contact_history_id,
    };
    var on_content_replaced = function () {
        $('#debitor-contact_history-tabs a[href="#debitor-contact_history-form"]').tab("show");
        $("#bt_back_debitor_contact_history")
            .off("click")
            .on("click", function () {
                $('#debitor-contact_history-tabs a[href="#debitor-contact_history-list"]').tab("show");
                $("#debitor-contact_history-form").html("");
            });
        $.app.init_select2('#i_contact_kind');
        $.app.init_select2('#i_contact_action');
        $.app.init_select2('#i_contact_history_content');

        $("#full_debitor_contact_history_form").off("submit");
        $("#full_debitor_contact_history_form").submit(function (e) {

            $.debitors.save_debitor_contact_history(e);
            e.preventDefault();
        });
    };
    $.app.sendAjaxRequest(
        target,
        params,
        function success(result) {
            if (result.error && result.error != "") {
                $.dialog.error($.lang.item("error"), result.error);
            } else {
                $.app.replaceContent(
                    result.data,
                    on_content_replaced,
                    "debitor-contact_history-form",
                    undefined
                );
            }
        },
        true,
        null,
        $.lang.item("msg_wait")
    );
}

$.debitors.save_debitor_contact_history = function (e) {

    var debitor_id 					= $("#i_debitor_id").val();
    var debitor_contact_history_id	= $("#hidden_debitor_contact_history_id").val();
    var params 						= $("#full_debitor_contact_history_form").serializeArray();
    params.push({ name: "rendermode", value: "json" });
    params.push({ name: "debitor_id", value: debitor_id });
    params.push({ name: "debitor_contact_history_id", value: debitor_contact_history_id });

    var target = e.delegateTarget.action + "/" + debitor_contact_history_id + "/" + debitor_id;

    $.app.sendAjaxRequest(
        target,
        params,
        function success(result) {
            $.app.setFormValidationStates(
                "full_debitor_contact_history_form",
                result.error,
                result.extra,
                null
            );

            if (result.error && result.error != "") {
                $.dialog.error($.lang.item("error"), result.error);
            } else {
                $.dialog.success(
                    $.lang.item("done"),
                    $.lang.item("debitor_contact_history_been_saved"),
                    function callback() {
                        $('#debitor-contact_history-tabs a[href="#debitor-contact_history-list"]').tab("show");
                        $("#debitor-contact_history-form").html("");
                        $.debitors.init_table_debitor_contact_history(debitor_id);
                    }

                );
            }
        },
        true,
        null,
        $.lang.item("contact_history_save_progress")
    );
};

$.debitors.remove_debitor_contact_history = function (debitor_contact_history_id){
    var debitor_id = $("#i_hidden_debitor_id").val();
    if (debitor_contact_history_id == undefined) {
        throw new Error($.lang.item("msg_missing_parameter"));
    }
    var params = [
        { name: "debitor_id", value: debitor_id },
        { name: "debitor_contact_history_id", value: debitor_contact_history_id },
        { name: "confirmed", value: 1 },
        { name: "rendermode", value: "JSON" },
        ];

    $.dialog.confirm_delete(
        $.lang.item("msg_are_you_sure"),
        $.lang.item("debitor_contact_history_sure_delete"),
        function callback_yes() {
            $.app.sendAjaxRequest(
                baseUrl + "admin/debitors/remove_debitor_contact_history/",
                params,
                function success(result)
                {

                    if (result.error && result.error != "")
                    {
                        $.dialog.error($.lang.item("error"), result.error);
                    }
                    else
                    {
                        $.dialog.success(
                            $.lang.item("done"),
                            $.lang.item("debitor_contact_history_has_been_deleted"),
                            function callback_done() {
                                if ($.debitors !== undefined && $.debitors !== null) {
                                    $.debitors.init_table_debitor_contact_history(debitor_id);
                                }
                            }
                        );
                    }
                },
                true,
                null,
                $.lang.item("msg_wait")
            );
        },
        null,
        $.lang.item("debitor_contact_history_delete"),
        $.lang.item("cancel")
    );
}
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: Perform AX-Sync request ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.send_to_ax = function () {
  //window.open(baseUrl+'admin/debitors/send_to_ax/'+$("#i_hidden_debitor_id").val(), '_blank');

  var params = {
    debitor_id: $("#i_hidden_debitor_id").val(),
    rendermode: "json",
  };

  $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/send_to_ax/" + $("#i_hidden_debitor_id").val(),
    params,
    function success(result) {
      $.app.toConsole({ fkt: "$.debitors.send_to_ax", data: result });

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("request_sent_to_ax"),
          function callback() {}
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: Store new payment model ;;::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.store_new_payment_model = function (val) {
  var params = [
    { name: "payment_model", value: val },
    { name: "rendermode", value: "JSON" },
  ];

  $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/save_new_payment_model/",
    params,
    function success(result) {
      if (result.error && result.error !== "") {
        $.dialog.error($.lang.item("error"), result.error);
      }
    },
    false,
    null,
    $.lang.item("progress_store_payment_model")
  );
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
/**
 * Initialize the table for shipping addresses
 */
$.debitors.init_table_debitor_billing = function (debitor_id) {
  if ($("#tbl_billing_addresses").length > 0) {
    var target =
      baseUrl + "admin/debitors/datatable_debitor_billing/" + debitor_id;
    var options = {
      info: false,
      paging: false,
      ordering: true,
      autoWidth: false,
      searching: false,
      serverSide: true,
      order: [[2, "asc"]],
    };

    $.debitors.table_billing_adresses = $.app.datatable.initialize_ajax(
      "tbl_billing_addresses",
      target,
      tbl_columns_billing_data,
      $.app.datatable.callbacks.rowCallback,
      $.app.datatable.callbacks.initComplete,
      options
    );

    $("#tbl_billing_addresses tbody").on("click", "tr", function () {
      $.debitors.table_billing_adresses.$("tr.active").removeClass("active");
      $(this).addClass("active");
      $(this).find("input:radio").prop("checked", true);
    });
  }
};

$.debitors.save_debitor_billing = function (e) {
  $.app.toConsole({ fkt: "$.debitors.save_debitor_billing" });

  var params = $("#full_form_billing_data").serializeArray();
  params.push({ name: "rendermode", value: "json" });

  $.app.sendAjaxRequest(
    e.delegateTarget.action,
    params,
    function success(result) {
      $.app.toConsole({
        fkt: "callback save debitor billing ajax",
        data: result,
      });

      $.app.setFormValidationStates(
        "full_form_billing_data",
        result.error,
        result.extra,
        null
      );

      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("debitor_billing_has_been_saved"),
          function callback() {
            //$.app.redirect(baseUrl + "admin/debitors/");
          }
        );
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

/**
 * save billing address
 */
$.debitors.save_billing_address = function () {
  $.app.toConsole({ fkt: "$.debitors.save_billing_address" });

  var target = baseUrl + "admin/debitors/create_billing_address";

  var params = new FormData();
  params.append("debitor_id", $("#i_debitor_id").val());
  params.append("billing_name_1", $("#i_billing_name_1").val());
  params.append("billing_street", $("#i_billing_street").val());
  params.append("billing_house_nr", $("#i_billing_house_nr").val());
  params.append("billing_zipcode", $("#i_billing_zipcode").val());
  params.append("billing_location", $("#i_billing_location").val());
  params.append("rendermode", "JSON");

  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      $.app.toConsole({
        fkt: "callback save_billing_address ajax",
        data: result,
      });

      //	$.app.setFormValidationStates("form_billing_address", result.error, result.extra, null);

      if (result.error && result.error !== null) {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $.dialog.success(
          $.lang.item("done"),
          $.lang.item("address_has_been_saved"),
          function callback() {
            if ($.debitors !== undefined && $.debitors !== null) {
              if (
                $.debitors.table_billing_adresses !== undefined &&
                $.debitors.table_billing_adresses !== null
              ) {
                $.debitors.table_billing_adresses.ajax.reload();
              }
            }
          }
        );
      }
    },
    true,
    null,
    $.lang.item("address_save_progress"),
    false,
    false,
    false
  );
};

$.debitors.remove_billing_address = function (billing_account_id) {
  $.app.toConsole({
    fkt: "remove_billing_address",
    entry_id: billing_account_id,
  });

  if (billing_account_id == undefined) {
    throw new Error($.lang.item("msg_missing_parameter"));
  }

  var params = [
    { name: "billing_account_id", value: billing_account_id },
    { name: "confirmed", value: 1 },
    { name: "rendermode", value: "json" },
  ];

  $.dialog.confirm_delete(
    $.lang.item("msg_are_you_sure"),
    $.lang.item("address_sure_delete"),
    function callback_yes() {
      $.app.sendAjaxRequest(
        baseUrl + "admin/debitors/remove_billing_address/",
        params,
        function success(result) {
          $.app.toConsole({ fkt: "callback_ajax", result: result });
          if (result.error && result.error !== "") {
            $.dialog.error($.lang.item("error"), result.error);
          } else {
            $.dialog.success(
              $.lang.item("done"),
              $.lang.item("address_deleted"),
              function callback_done() {
                if ($.debitors !== undefined && $.debitors !== null) {
                  if (
                    $.debitors.table_billing_adresses !== undefined &&
                    $.debitors.table_billing_adresses !== null
                  ) {
                    $.debitors.table_billing_adresses.ajax.reload();
                  }
                }
                //$('a[entry_id='+entry_id+']').closest('tr').remove();
              }
            );
          }
        },
        true,
        null,
        $.lang.item("address_delete_progress")
      );
    },
    null,
    $.lang.item("address_delete"),
    $.lang.item("cancel")
  );

  $.debitors.address_dt_rowCallback();
};

$.debitors.address_dt_rowCallback = function () {
  $(".remove_delivery_address").each(function () {
    if ($(this).attr("onclick")) {
      $(this).removeAttr("href");
    }
  });
};

$.debitors.init_contract_info_button = function () {
  $("button[name=bt_contract_info]").each(function () {
    $(this).on("click", function (e) {
      var contract_id = $(this).attr("id");

      contract_id = contract_id.replace("bt_contract_info_", ""); //remove string

      if (contract_id != undefined) {
        var params = [
          { name: "contract_id", value: contract_id },
          { name: "rendermode", value: "AJAX" },
        ];

        $.app.sendAjaxRequest(
          baseUrl + "admin/debitors/get_full_contract_preview/" + contract_id,
          params,
          function success(result) {
            if (result.error && result.error != "") {
              $.dialog.error($.lang.item("error"), result.error);
            } else {
              $("#mdl_contract_preview").modal("show");
              var doAfterReplace = function () {
                $.contract.init_form();
                $.contract.init_table();
              };
              $.app.replaceContent(
                result.data,
                doAfterReplace,
                "contract_preview_container"
              );
            }
          },
          true,
          null,
          $.lang.item("show_contract_info_progress")
        );
      } else {
        $.dialog.error(
          $.lang.item("error"),
          $.lang.item("msg_missing_parameter")
        );
      }
    });
  });

  $.debitors.init_kv_history_popover = function () {
    $(document).on("click", ".kv-history-popover", function (e) {
      var prescription_id = $(this).attr("prescription_id");
      var debitor_id = $(this).attr("debitor_id");

      var popover = $(this).data("bs.popover");
      if (popover.tip().is(":visible")) {
        $(this).popover("hide");
      } else {
        if (popover.options.content == "") {
          var params = [
            { name: "debitor_id", value: debitor_id },
            { name: "prescription_id", value: prescription_id },
            { name: "rendermode", value: "json" },
          ];

          var target = baseUrl + "admin/prescriptions/get_kv_history/";

          //async false is a bad idea but I have no better idea
          popover.options.content = (function () {
            var tmp = null;
            $.ajax({
              async: false,
              type: "POST",
              dataType: "json",
              url: target,
              data: params,
              success: function (result) {
                if (result.error && result.error != null) {
                  $.dialog.error($.lang.item("error"), result.error);
                } else {
                  tmp = result.data;
                }
              },
            });
            return tmp;
          })();

          $(this).popover("show");
          e.preventDefault();
          e.stopPropagation();
          e.cancelBubble = true;
          e.stopImmediatePropagation();
        } else {
          $(this).popover("show");
          e.preventDefault();
          e.stopPropagation();
          e.cancelBubble = true;
          e.stopImmediatePropagation();
        }
      }
    });
  };
};

/**
 *
 */
$.debitors.setSupervisor = function () {
  //show or hide required on elements for IK and KK Number
  if ($("#i_supervisor").is(":checked")) {
    //$('#fi_ik_number').removeClass('required');
    //$('#fi_insurance_number').removeClass('required');
    $("#fi_supervisor_id").hide();
  } else {
    //$('#fi_ik_number').addClass('required');
    //$('#fi_insurance_number').addClass('required');
    $("#fi_supervisor_id").show();
  }
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.debitors.init_tab_customer = function () {
  if ($("#full_form_debitor").length > 0) {
    $.app.toConsole({ fkt: "$.debitors.init_form" });

    //$('#i_payment_model').select2('destroy').select2({tags: true});
    $("#i_payment_model").on("change", function (e) {
      var isNew = $(this).find('[data-select2-tag="true"]');
      if (isNew.length && $.inArray(isNew.val(), $(this).val()) === -1) {
        isNew.replaceWith(
          '<option selected value="' +
            isNew.val() +
            '">' +
            isNew.val() +
            "</option>"
        );
        $.debitors.store_new_payment_model(isNew.val());
      }
      if ($(this).val()) {
        $("#i_generate_payment_contract").prop("checked", true);
      } else {
        $("#i_generate_payment_contract").prop("checked", false);
      }
    });

    $("#i_firstname, #i_lastname").on("keyup", function () {
      $("#i_name_1").val(
        $("#i_firstname").val() + " " + $("#i_lastname").val()
      );
    });
    $("#i_firstname, #i_lastname").on("change", function () {
      $("#i_name_1").val(
        $("#i_firstname").val() + " " + $("#i_lastname").val()
      );
    });

    $("#i_country").on("change", function () {
      $("#i_subdivision").empty();
      $.each(all_subdivisions[$(this).val()], function (index, subdivision) {
        $("#i_subdivision").append(
          "<option id=" +
            subdivision.subdivision_code +
            " value='" +
            subdivision.subdivision_code +
            "'>" +
            subdivision.subdivision_select_label +
            "</option>"
        );
      });
      $("#i_subdivision").val("").change();
    });

    $("#i_locked").on("change", function () {
      $("#fi_lock_reason").toggle();
      $("#fi_locked_at").toggle();
      $("#fi_locked_till").toggle();
      $("#fi_locked_by").toggle();
      $("#fi_additional_lock_reason").toggle();
      if ($(this).parents(".toggle").hasClass("off") == false) {
        $("#i_locked_at").val(formated_today);
        //$('#i_locked_by').val(username);
      }
    });
    $("#i_is_deceased").on("change", function () {
      $("#fi_deceased_at").toggle();
      $("#fi_debitor_deceased").toggle();
    });

    $.debitors.setSupervisor();
    $("#i_supervisor").on("click", function () {
      $.debitors.setSupervisor();
    });

    $("#full_form_debitor").submit(function (e) {
      $.debitors.save(e);
      e.preventDefault();
    });

    // EDITED meb: Since contracts are a 1/n relation coming from prescriptions, this search is deprecated
    // $("#i_ik_number").on("change", function () {
    // $.prescriptions.search_contract_by_ik( $(this).val() );
    //})
  }
};
$.debitors.init_tab_contacts = function () {
  if ($("#full_form_debitor_contact").length > 0) {
    $("#btn_new_contact").on("click", function () {
      $.debitors.create_debitor_contact();
    });
    $.debitors.init_table_debitor_contacts($("#i_hidden_debitor_id").val());
  }
};
$.debitors.init_tab_anamnesis = function () {
  if ($("#full_form_debitor_anamnesis").length > 0) {
    if ($("#btn_new_anamnesis").length > 0) {
      $("#btn_new_anamnesis").on("click", function () {
        $.debitors.create_debitor_anamnesis();
      });
    }
    $.debitors.init_table_debitor_anamnesis($("#i_hidden_debitor_id").val());
    //$('#bt_generate_anamesis').on('click',$.debitors.print_anamnesis);
  }

  /*
	if ($("#form_anamnesis").length > 0) {
		$.app.toConsole({"fkt": "$.anamnesis.init_form"});

		$.app.init_checked_list_box();
		$.app.init_toggle();

		$("#form_anamnesis").submit(function (e) {
			$.debitors.save_anamnesis(e);
			e.preventDefault();
		});
	}
	*/
};
$.debitors.init_tab_prescriptions = function () {
  $.debitors.init_table_prescriptions();
};
$.debitors.init_tab_orders = function () {
  if ($("#full_form_debitor_orders").length > 0) {
    $("#btn_new_order").on("click", function () {
      $.debitors.edit_debitor_order(undefined);
    });
    //$.debitors.init_table_debitor_orders($("#i_debitor_id").val());
    $.debitors.init_table_debitor_parent_orders($("#i_debitor_id").val());
  }
};
$.debitors.init_tab_documents = function () {
  if ($("#i_upload_debitor_document").length > 0) {
    var target = baseUrl + "admin/debitors/upload_debitor_document/";
    var show_buttons = true;

    if ($("#i_debitor_id").val() != "") {
      var on_success = function () {
        $.debitors.init_table_debitor_documents($("#i_debitor_id").val());
        $("#i_custom_debitor_document_name").val("");
        $("#i_debitor_document_type").val("").change();
        $("#i_debitor_prescriptions").val("").change();
      };

      var upload_extra = function () {
        return {
          start_doc_upload: 1,
          rendermode: "json",
          debitor_id: $("#i_debitor_id").val(),
          custom_debitor_document_name: $(
            "#i_custom_debitor_document_name"
          ).val(),
          debitor_document_type: $("#i_debitor_document_type").val(),
          debitor_prescription_id: $("#i_debitor_prescriptions").val(),
        };
      };
      $.app.init_fileinput(
        "#i_upload_debitor_document",
        target,
        ["pdf", "jpg", "jpeg"],
        false,
        on_success,
        null,
        1,
        1,
        10000,
        upload_extra,
        undefined,
        true,
        true,
        show_buttons,
        show_buttons,
        show_buttons,
        false,
        false
      );
      $("#i_upload_debitor_document").on(
        "filepreajax",
        function (event, previewId, index) {
          $.app.toConsole({ fkt: "filepreajax", event: event });
        }
      );
    }
  }
  $.debitors.init_table_debitor_documents($("#i_debitor_id").val());
  $.debitors.init_filter_documents();
};
$.debitors.init_tab_reminder = function () {
  if ($("#btn_submit_reminder".length > 0)) {
    $("#form_debitor_reminder").submit(function (e) {
      $.debitors.save_debitor_reminder(e);
      e.preventDefault();
    });
  }

  if ($("#full_form_inhabitant_reminder".length > 0)) {
    // event erst wieder wegnehmen, sonst mehrere poups
    $(document)
      .off("click", ".checkbox-for-reminder")
      .on("click", ".checkbox-for-reminder", function () {
        if ($(this).hasClass("disabled") == true) {
          return;
        }
        var value_activate = 0;
        if ($(this).is(":checked")) {
          value_activate = 1;
        }
        $.debitors.setReminderActive($(this).val(), value_activate);
      });

    $.debitors.init_table_reminder($("#i_debitor_id").val());

    $("#btn_new_reminder").on("click", function () {
      $.debitors.create_debitor_reminder();
    });
  }
};
$.debitors.init_tab_history = function () {
  if ($("#form_history").length > 0) {
      if($('#tbl_debitor_history').length >0){
        $.debitors.init_table_debitor_history($("#i_debitor_id").val());
        $.debitors.init_table_debitor_contact_history($("#i_debitor_id").val());

           /* if($('a[href$="debitor_history"]').length >0 && $('#form_history li.active').length <= 0)
            {
                $('a[href$="debitor_history"]').trigger('click');
            }*/

          if ($("#btn_new_debitor_contact_history").length > 0) {
              $("#btn_new_debitor_contact_history").on("click", function (e) {
                  e.preventDefault();
                  $.debitors.create_debitor_contact_history();
              });
          }
      }

  }
};

$.debitors.init_tab = function (target) {
  switch (target) {
    case "#debitor":
      if (localStorage.getItem("init_tab_customer") != 1) {
        localStorage.setItem("init_tab_customer", 1);
        $.debitors.init_tab_customer();
      }

      break;
    case "#contact_info":
      $.debitors.init_tab_contacts();
      break;
    case "#anamnesis":
      $.debitors.init_tab_anamnesis();
      break;
    case "#overview_prescription":
      $.debitors.init_tab_prescriptions();
      break;
    case "#orders":
      //für rezeptId immer neue laden
      if ($.debitors.orders_for_prescription_id != null) {
        $.debitors.init_tab_orders();
        localStorage.setItem("init_tab_orders", 0);
      } else {
        if (localStorage.getItem("init_tab_orders") != 1) {
          localStorage.setItem("init_tab_orders", 1);
          $.debitors.init_tab_orders();
        }
      }
      break;
    case "#debitor_files":
      $.debitors.init_tab_documents();
      break;
    case "#reminder":
      $.debitors.init_tab_reminder();
      break;
    case "#history":
      $.debitors.init_tab_history();
      break;
    default:
      //console.log("unknown target");

      if (localStorage.getItem("init_tab_customer") != 1) {
        localStorage.setItem("init_tab_customer", 1);
        $.debitors.init_tab_customer();
      }

      break;
  }
};
//::::::::::::::::.............. DELIVERY ACCOUNT SEARCH WINDOW
$.debitors.search_delivery_account_window = function () {
  var id_modal = $.app.generateUUID();
  var params = {
    debitor_id: $("#i_debitor_id").val(),
    rendermode: "AJAX",
  };
  //var params = [{"name": "contract_id", "value": contract_id}, {"name": "rendermode", "value": "AJAX"}];

  $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/open_search_for_delivery/",
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        $("#mdl_debitor_delivery_account_search").modal("show");
        var doAfterReplace = function () {
          //what should happen after
          $("#bt_submit_search").on("click", function () {
            $.debitors.search_delivery_account();
          });
        };
        $.app.replaceContent(
          result.data,
          doAfterReplace,
          "search_debitor_delivery_container"
        );
      }
    },
    true,
    null,
    $.lang.item("loading_data")
  );
};

$.debitors.search_delivery_account = function () {
  /*
	if(
		$.trim($('#i_delivery_account_debitor_firstname').val()) == ''
	&& $.trim($('#i_delivery_account_debitor_lastname').val()) == ''
	&& $.trim($('#i_delivery_account_debitor_street').val()) == ''
	&& $.trim($('#i_delivery_account_debitor_location').val() )== ''
	&& $.trim($('#i_delivery_account_debitor_insurance_number').val()) == ''
	&& $.trim($('#i_delivery_account_debitor_zipcode').val()) == ''
	)
	*/
  if (
    $.trim($("#i_delivery_account_search_parameter").val()) == "" &&
    $.trim($("#i_delivery_account_debitor_number").val()) == ""
  ) {
    $.dialog.error(
      $.lang.item("error"),
      $.lang.item("please_insert_parameters")
    );
    return;
  }

  var seachvalues = $("#form_debitor_delivery_account_search").serializeArray();

  seachvalues.push({ name: "debitor_id", value: $("#i_debitor_id").val() });

  $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/search_for_delivery/",
    seachvalues,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
        $("#delivery_search_result").html("");
      } else {
        $.debitors.appendSearchResultDelivery_account(result.data);
      }
    },
    true,
    null,
    $.lang.item("loading_data")
  );
};

$.debitors.appendSearchResultDelivery_account = function (data) {
  let resultHTML = "<table width='100%'>";
  resultHTML += "<tr>";
  resultHTML += "<td width='5%'>";
  resultHTML += "";
  resultHTML += "</td>";
  resultHTML += "<td width='20%'>";
  resultHTML += "<b>" + $.lang.item("name_1") + "</b>";
  resultHTML += "</td>";
  resultHTML += "<td width='20%'> ";
  resultHTML += "<b>" + $.lang.item("name_2") + "</b>";
  resultHTML += "</td>";
  resultHTML += "<td width='20%'>";
  resultHTML += "<b>" + $.lang.item("street") + "</b>";
  resultHTML += "</td>";
  resultHTML += "<td width='25%'>";
  resultHTML +=
    "<b>" + $.lang.item("zipcode") + " " + $.lang.item("location") + "</b>";
  resultHTML += "</td>";
  resultHTML += "<td width='10%'>";
  resultHTML += "<b>" + $.lang.item("debitor_id") + "</b>";
  resultHTML += "</td>";
  resultHTML += "</tr>";
  $.each(data, function (key, value) {
    resultHTML += "<tr>";
    resultHTML += "<td>";
    resultHTML +=
      "<button type='button' style='width: 30px;' class='btn btn-xs btn-block btn-success p-1' onClick='$.debitors.changeDeliveryAccount(" +
      value.debitor_id +
      ',"' +
      value.account_number +
      "\")'>" +
      "<i class='fa fa-arrow-right'></i>" +
      "</button>";
    resultHTML += "&nbsp;&nbsp;</td>";
    resultHTML += "<td>";
    resultHTML += value.name_1;
    resultHTML += "</td>";
    resultHTML += "<td> ";
    resultHTML += value.name_2;
    resultHTML += "</td>";
    resultHTML += "<td>";
    resultHTML += value.street;
    resultHTML += "</td>";
    resultHTML += "<td>";
    resultHTML += value.zipcode + " " + value.location;
    resultHTML += "</td>";
    resultHTML += "<td>";
    resultHTML += value.account_number;
    resultHTML += "</td>";
    resultHTML += "</tr>";
  });
  resultHTML += "</table>";
  $("#delivery_search_result").html(resultHTML);
};

$.debitors.changeDeliveryAccount = function (id, account_number) {
  $("#i_delivery_account_id").val(account_number);
  $("#i_hidden_delivery_account_id").val(account_number);
  //$('#i_hidden_delivery_account_number').val(account_number);
  $("#mdl_debitor_delivery_account_search").modal("hide");
  $("#hidden_delivery_debitor_id").val(id);
  localStorage.setItem("delivery_debitor_id",id);
  $.debitors.set_debitor_delivery_data(id);
  $.debitors.show_hide_debitor_as_delivery_block();

};

$.debitors.remove_delivery_account_id = function () {
  $("#i_delivery_account_id").val("");
  $("#i_hidden_delivery_account_id").val("");
  $("#i_carry_consignment_1").val("");
  $("#i_carry_consignment_2").val("");
  $("#i_carry_consignment_3").val("");
  $("#i_lifting_platform").val("");
  $("#i_carton_return").val("");
  $("#i_pallet_delivery").val("");
  $("#i_pallet_delivery").val("");

  var i_debitor_id = $("#i_debitor_id").val();
  $("#hidden_delivery_debitor_id").val("");
  localStorage.removeItem('delivery_debitor_id');
  var debitor_id = localStorage.getItem("delivery_debitor_id");
  $.debitors.set_debitor_delivery_data(debitor_id);
  $.debitors.update_debitor_delivery_data(i_debitor_id);
  $.debitors.show_hide_debitor_as_delivery_block();



};

$.debitors.use_contact_external_phrase = function () {
  let phrase = $("#i_external_phrases_selection option:selected").text();
  let id = $("#i_external_phrases_selection option:selected")[0].id;

  if ($.trim(phrase) != "") {
    if ($.trim($("#i_contact_external_information").val()) == "") {
      $("#i_contact_external_information").val(phrase);
    } else {
      $("#i_contact_external_information").val(
        $("#i_contact_external_information").val() + "\n" + phrase
      );
    }
    if ($.trim(id) == "") {
      $.debitors.create_external_phrase(phrase);
    } else {
      $("#i_external_phrases_selection").val(null).trigger("change");
    }
  }
};

$.debitors.create_external_phrase = function (phrase) {
  let params = [
    { name: "phrase", value: phrase },
    { name: "rendermode", value: "JSON" },
  ];
  $.app.sendAjaxRequest(
    baseUrl + "admin/debitors/set_external_note_phrases",
    params,
    function success(result) {
      if (result.error && result.error != "") {
        $.dialog.error($.lang.item("error"), result.error);
      } else {
        var newOption =
          '<option id="' +
          result.new_id +
          '" value="' +
          result.new_id +
          '" label="' +
          result.phrase +
          '" key="' +
          result.new_id +
          '" title="' +
          result.phrase +
          '">' +
          result.phrase +
          "</option>";
        $("#i_external_phrases_selection").val(null).trigger("change");
        $("#i_external_phrases_selection").append(newOption);
      }
    },
    true,
    null,
    $.lang.item("in_progress")
  );
};

$.debitors.clear_external_information = function () {
  $("#i_contact_external_information").val("");
};

/**
 * initialize form
 **/
$.debitors.init_form = function () {
  $.app.init_checked_list_box();
  $.app.init_toggle();
  $.app.init_select2();
  $.app.init_datepicker();

  $.debitors.init_contract_info_button();
  $.debitors.init_kv_history_popover();

  $("#btn_for_contractreiter")
    .off("click")
    .on("click", function (e) {
      $("#documentenreiter a").trigger("click");
    });
  $("#btn_sync_with_ax").off("click").on("click", $.debitors.send_to_ax);

  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    var target = $(e.target).attr("href"); // activated tab
    $.app.toConsole("tab-switched >" + target);
    $.debitors.init_tab(target);
  });
  // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
  // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
  // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
  // ..:: BELOW CODE IS MOST LIKELY OUT OF DATE
  if ($("#full_form_debitor_delivery").length > 0) {
    $("#btn_new_delivery").on("click", function () {
      $.debitors.create_debitor_delivery();
    });
    $.debitors.init_table_debitor_delivery($("#i_debitor_id").val());

    $(document).on("click", ".checkbox-as-radio", function () {
      if ($(this).is(":checked")) {
        $(".checkbox-as-radio").prop("checked", false);
        $(this).prop("checked", true);
        $.debitors.setDeliveryActive($(this).val());
      }
    });
  }
  if ($("#full_form_billing_data").length > 0) {
    $.debitors.init_table_debitor_billing($("#i_debitor_id").val());
    $(".remove_billing_address").on("hover", function () {
      $.debitors.address_dt_rowCallback();
    });

    $("#btn_submit_new_billing_address").on("click", function (e) {
      $.debitors.save_billing_address();
      e.preventDefault();
    });

    $("#full_form_billing_data").submit(function (e) {
      $.debitors.save_debitor_billing(e);
      e.preventDefault();
    });
  }
    if ($("#i_upload_debitor_document").length > 0) {
        $.debitors.init_tab_documents();
    }

};

/**
 * initialize table
 **/
$.debitors.init_table = function () {
  if ($("#tbl_debitor").length > 0) {
    var options = {
      rowId: "debitor_id",
      destroy: "true",
      deferRender: true,
      serverSide: true,
      order: [[10, "desc"]],
    };

    let target = baseUrl + "admin/debitors/datatable";
    if ($("#global_debitor_search").length > 0) {
      target += "/" + $("#global_debitor_search").val().trim();
    }
    $.app.toConsole({ fkt: "$.debitors.init_table" });
    $.debitors.table = $.app.datatable.initialize_ajax(
      "tbl_debitor",
      target,
      tbl_columns_debitor,
      $.app.datatable.callbacks.rowCallback,
      $.app.datatable.callbacks.initComplete,
      options
    );
  }
};

$.debitors.init_last_tab = function () {

  if (
    $("#full_form_debitor").length > 0 &&
    $.debitors.options.store_last_selected_tab == true
  ) {

    var getparameter = "";
    var sUrl = window.location.search.substring(1).split("=");
    if (sUrl[0] == "pid") {
      if (sUrl[1] != "") {
        getparameter = sUrl[1];
      }
    }
    if (getparameter != "" && getparameter != undefined) {
      //$('.nav-tabs a[href="#orders"]').trigger('click');
      $.debitors.init_orders_tab(getparameter);
    } else {
      var key = "debitor_" + $("#i_debitor_id").val() + "_last_selected_tab";
      if (localStorage.getItem(key) != undefined) {
        $('.nav-tabs a[href="' + localStorage.getItem(key) + '"]').tab("show");
        $('.nav-tabs a[href="' + localStorage.getItem(key) + '"]').trigger(
          "click"
        ); // lets go with a click to trigger handlers
      } else {
        $('.nav-tabs a[href="#debitor"]').trigger("click");
      }
    }

    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
      if (
        $(this).attr("href") !== "#debitor-orders-form" &&
        $(this).attr("href") !== "#debitor-contact-form" &&
        $(this).attr("href") !== "#debitor-anamnesis-form"
      ) {
        localStorage.setItem(key, $(e.target).attr("href"));
      }
    });
  } else if (
    $("#full_form_debitor").length > 0 &&
    $.debitors.options.store_last_selected_tab == false
  ) {
    //$('.nav-tabs a[href="#debitor"]').trigger('click');
  }
};
$.debitors.init_orders_tab = function (prescription_id) {
  $.debitors.orders_for_prescription_id = prescription_id;
  $('.nav-tabs a[href="#orders"]').tab("show");
  $('.nav-tabs a[href="#orders"]').trigger("click"); // lets go with a click to trigger handlers
};

$.debitors.init_tabs_from_prescription = function () {
  if ($("#full_form_debitor").length > 0) {
    function sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
    var fromPrescription = $(
      "#hidden_new_debitor_flag_from_prescription"
    ).val();
    if (fromPrescription == 1) {
      $.debitors.options.store_last_selected_tab = false;
      if (
        localStorage.getItem("DebitorFromPrescriptionNew") == null &&
        !$.debitors.workflowFromPrescription
      ) {
        $.domNavigator.navigate('.nav-tabs a[href="#debitor"]');
        localStorage.setItem("DebitorFromPrescriptionNew", "debitor");
        localStorage.setItem(
          "initialUrlFromPrescription",
          window.location.href
        );
      } else {
        if (localStorage.getItem("DebitorFromPrescriptionNew") == "debitor") {
          localStorage.removeItem("DebitorFromPrescriptionNew");

          let promise = Promise.resolve().then(() => {
            return $.domNavigator.navigate('.nav-tabs a[href="#contact_info"]');
          });
          promise
            .then(function () {
              $.debitors.workflowFromPrescription = "contact";
              return $.domNavigator.navigate("#btn_new_contact");
            })
            .catch(console.error);
        } else if ($.debitors.workflowFromPrescription == "contact") {
          let promise = Promise.resolve().then(() => {
            return $.domNavigator.navigate('.nav-tabs a[href="#anamnesis"]');
          });
          $.debitors.workflowFromPrescription = "anamnesis";
          promise
            .then(function () {
              return $.domNavigator.navigate("#btn_new_anamnesis");
            })
            .catch(console.error);
        } else if ($.debitors.workflowFromPrescription == "anamnesis") {
          $("#hidden_new_debitor_flag_from_prescription").val(0);
          $.debitors.reminderDebitorFromPrescription($("#i_debitor_id").val());
          $.domNavigator.navigate(`.nav-tabs a[href="#debitor_files"]`);
        }
      }
    } else if (fromPrescription == 2) {
      $.debitors.options.store_last_selected_tab = false;
      if (
        localStorage.getItem("DebitorFromPrescriptionNewOld") == null &&
        !$.debitors.workflowFromPrescription
      ) {
        let promise = Promise.resolve().then(() => {
          return $.domNavigator.navigate(
            '.nav-tabs a[href="#overview_prescription"]'
          );
        });
        //localStorage.setItem('DebitorFromPrescriptionNewOld','order');
        $.debitors.workflowFromPrescription = "order";
      } else if ($.debitors.workflowFromPrescription == "order") {
        let promise = new Promise((resolve, reject) => {
          setTimeout(function () {
            $('.nav-tabs a[href="#overview_prescription"]').trigger("click");
            localStorage.removeItem("DebitorFromPrescriptionNewOld");

            const url = new URL(window.location.href);
            const id = url.pathname
              .split("/")
              .filter((v) => v != "" && !isNaN(+v))
              .shift();
            const index = url.toString().indexOf(id.toString());
            let newURL = url.toString().slice(0, index) + id;
            history.pushState({}, null, newURL);
            $("#hidden_new_debitor_flag_from_prescription").val(0);
            $("#hidden_new_prescription_id").val(0);
            resolve();
          }, 500);
        });
      } else {
      }
    } else {
      $.debitors.options.store_last_selected_tab = true;
    }
  }
};
$.debitors.reminderDebitorFromPrescription = function (debitor_id) {
  var target = baseUrl + "admin/debitors/generateDebitorReminderNewDebitor";
  var params = {
    debitor_id: debitor_id,
    rendermode: "json",
  };
  $.app.sendAjaxRequest(
    target,
    params,
    function success(result) {
      if (result.error && result.error != "") {
        //$.dialog.error($.lang.item("error"), result.error);
      } else {
        //$.debitors.init_table_reminder($("#i_debitor_id").val());
      }
    },
    true,
    null,
    $.lang.item("msg_wait")
  );
};

const makeDebitorAutoCompleter = function () {
  $("#customer_data_right :input").keyup(
    $.dhl.createHandler({
      renderPopupLocation: $("#i_district_infotext"),
      postalCode: $("#i_zipcode"),
      city: $("#i_location"),
      country: $("#i_country"),
      fullStreet: $("#i_street"),
      district: $("#i_district"),
      bundesland: $("#i_subdivision"),
    })
  );
};

const makeOrderAutoCompleter = function () {
  $("#order-additions-tab-delivery-form-left :input").keyup(
    $.dhl.createHandler({
      renderPopupLocation: $(
        "#fi_order-additions-tab-delivery-contact_subdivision"
      ),
      postalCode: $("#i_order-additions-tab-delivery-contact_zipcode"),
      city: $("#i_order-additions-tab-delivery-contact_location"),
      country: $("#i_order-additions-tab-delivery-contact_country"),
      fullStreet: $("#i_order-additions-tab-delivery-contact_street"),
      district: $("#i_additions_district"),
      bundesland: $("#i_order-additions-tab-delivery-contact_subdivision"),
    })
  );
};

const makeContactAutoCompleter = function () {
  $("#form_contact :input").keyup(
    $.dhl.createHandler({
      renderPopupLocation: $("#fi_contact_subdivision"),
      postalCode: $("#i_contact_zipcode"),
      city: $("#i_contact_location"),
      country: $("#i_contact_country"),
      fullStreet: $("#i_contact_street"),
      district: $("#i_contact_district"),
      bundesland: $("#i_contact_subdivision"),
    })
  );
};

function registerIkSearch() {
  if ($("#bt_search_contract").length > 0) {
    $("#bt_search_contract").on("click", function () {
      $.prescriptions.search_contract_by_ik($("#i_ik_number").val(), 0, true);
    });
    $("#i_ik_number").on("change", function () {
      $("#bt_search_contract").trigger("click");
    });
  }
}

$(document).ready(function() {



  $.app.toConsole("debitor.js ready", "log");
  localStorage.removeItem("init_tab_customer");
  localStorage.removeItem("init_tab_orders");

  $.debitors.init_table();
  $.debitors.init_form();

   //Show hide debitor as delivery account code
   $.debitors.show_hide_debitor_as_delivery_block();

   $('#i_debitor_as_delivery_account').change(function(){
     $.debitors.show_hide_debitor_as_delivery_block();
   });
   // $.debitors.show_hide_supervisor();
   $('#i_debitor_statistic_group').change(function(){
       $.debitors.show_hide_supervisor();
   });
   
   var debitor_id = localStorage.getItem("delivery_debitor_id");
   $.debitors.set_debitor_delivery_data(debitor_id);

    $.debitors.init_tabs_from_prescription();
    try {
        $.domNavigator.handleNavigationQuery()
            .then($.debitors.init_last_tab);

        registerIkSearch();
        makeDebitorAutoCompleter();
    }
    catch(e)
    {
        $.app.toConsole("not in debitor tab, might be in WV");
    }

    var supervisor = $("#hidden_supervisor").val();
    var supervisor_id = $("#hidden_supervisor_id").val();
    if(supervisor == 1 ){
      $('#full_form_supervisor input,textarea').attr('readonly', false);
      $('#full_form_supervisor select').attr("disabled", false);
      $('#full_form_supervisor .checkbox-inline input').attr('disabled', false);
    }else if(supervisor_id !=""){
      $('#full_form_supervisor input,textarea').attr('readonly', true);
      $('#full_form_supervisor select').attr("disabled", true);
      $('#full_form_supervisor .checkbox-inline input').attr('disabled', true);
    }else{
      $('#supervisor_acount_tab').hide();
    }
 /*    var id = $("#i_hidden_debitor_id").val();
    $.debitors.update_debitor_delivery_data(id); */



    
    

  // workflowFromPrescription  =
});
