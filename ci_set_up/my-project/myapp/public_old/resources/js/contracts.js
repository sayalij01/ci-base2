if (typeof jQuery === "undefined") {
    throw new Error("This JavaScript requires jQuery");
}

/**
 * contract object
 */
$.contract = {
    /* contract options. Modify these options to suit your implementation */
    options: {
        opt: false
    },
    table: null,
    table_documents: null,
    table_health_insurances: null,
    table_flatrates: null
};

/**
 * edit contract 
 */
$.contract.edit = function (id)
{
    $.app.toConsole({"fkt": "$.contract.edit", "id": id});

    var params = $("#form_contract").serializeArray();
    params.push({"name": "contract_id", "value": id});
    params.push({"name": "contract_revsion", "value": $("#i_contract_revision").val()});
    params.push({"name": "rendermode", "value": "ajax"});

    var target = baseUrl + "root/contracts/edit/" + id;

    $.app.sendAjaxRequest(target, params, function success(result)
    {
        if (result.error && result.error != "")
        {
            $.dialog.error($.lang.item("error"), result.error);
        } else
        {
            $.app.replaceContent(result.data, $.contract.init_form, undefined, target);
            $.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
        }
    }, true, null, $.lang.item("msg_wait"));
}

$.contract.edit_flatrate = function (contract_id, contract_revision, id)
{
    var id_modal = $.app.generateUUID();
    var params = {
        contract_id: contract_id,
        contract_revsion: contract_revision,
        flatrate_id: id,
        rendermode: "AJAX",
        as_modal: 1,
        id_modal: id_modal
    };

    if (id == undefined) {
        var target = baseUrl + "root/contracts/create_flatrate/" + contract_id + "/" + contract_revision;
    } else {
        var target = baseUrl + "root/contracts/edit_flatrate/" + contract_id + "/" + contract_revision + "/" + id +"/" + read_only_view;
    }


    $.app.toConsole({"fkt": "$.contract.edit_flatrate", "params": params});

    $.dialog.from_controller(target, params, function init_poopup() {
        $("#form_contract_flatrate").submit(function (e) {
            $.app.unblockUI();
            $('#bt_submit_flatrate').prop('disabled',true);
            $.contract.save_contract_flatrate(e, id_modal);
            e.preventDefault();
        });
        $.app.init_select2();
        $.app.init_datepicker();
    });
}
/**
 * save contract form
 */
$.contract.save = function (e, id)
{
    var params = $("#form_contract").serializeArray();
    params.push({"name": "rendermode", "value": "json"})
    params.push({"name": "kv_necessary_from_cost", "value":$("#i_kv_necessary_from_cost").autoNumeric("get")})

    $.app.toConsole({"fkt": "$.contract.save", "params": params});

    // Alle autoNumerics abholen und in params ergänzen (namen erhalten einfach den zusatz "_float") 
    $("#form_contract").find('input.autonumericcurrency').each(function () {
        params.push({"name": $(this).attr("name") + "_float", "value": $(this).autoNumeric('get')})
    });

    $.app.sendAjaxRequest(e.delegateTarget.action, params, function success(result)
    {
        $.app.toConsole({"fkt": "callback save contract ajax", "data": result});

        $.app.setFormValidationStates("form_contract", result.error, result.extra, null);

        if (result.error && result.error != "")
        {
            $.dialog.error($.lang.item("error"), result.error);
        } else
        {
            $.dialog.success($.lang.item("done"), $.lang.item("contract_has_been_saved"), function callback()
            {
                //Falls neu geladen werden soll, Kommentar entfernen
            	if ($("#i_contract_id").val() == ""){
            		$.app.redirect(baseUrl+"root/contracts/edit/"+result.data.contract.contract_id);
            	}
            });
        }
    }, true, null, $.lang.item("contract_save_progress"));
};

$.contract.save_contract_flatrate = function (e, id_modal)
{
    var params = $("#form_contract_flatrate").serializeArray();
    params.push({"name": "rendermode", "value": "json"});

    var target = $('#form_contract_flatrate').attr('action');
    $.app.sendAjaxRequest(target, params, function success(result)
    {
        $.app.toConsole({"fkt": "callback save flatrae ajax", "data": result});

        $.app.setFormValidationStates("form_contract_flatrate", result.error, result.extra, null);

        if($.contract !== undefined && $.contract !== null)
        {
            if ($.contract.table_flatrates !== undefined && $.contract.table_flatrates !== null)
            {
                $.contract.table_flatrates.ajax.reload(); // reload the table
            }
        }


        if (result.error && result.error !== "") {
            $.dialog.error($.lang.item("error"), result.error); 
            $('#bt_submit_flatrate').prop('disabled',false);
        } else {
            $.dialog.success($.lang.item("done"), $.lang.item("flatrate_has_been_saved"), function callback()
            {
                //$('#'+id_modal).modal({ show: false});
                $('#' + id_modal).modal('hide').data('bs.modal', null);
            });
        }
    }, true, null, $.lang.item("contract_flatrates_save_progress"));
   
}

$.contract.save_contract_further_informations = function (e, id_modal)
{
    var params = $("#form_contract_further_informations").serializeArray();
        params.push({"name": "contract_id", "value": $("#i_contract_id").val()});
        params.push({"name": "contract_revision", "value": $("#i_contract_revision").val()});
        params.push({"name": "rendermode", "value": "json"});
    
    
    $.app.sendAjaxRequest(e.delegateTarget.action, params, function success(result)
    {
        $.app.toConsole({"fkt": "callback save flatrae ajax", "data": result});

        $.app.setFormValidationStates("form_contract_further_informations", result.error, result.extra, null);

        //$.contract.table_flatrates.ajax.reload(); // reload the table

        if (result.error && result.error !== "") 
        {
            $.dialog.error($.lang.item("error"), result.error);
        } 
        else 
        {
            $.dialog.success($.lang.item("done"), $.lang.item("further_informations_has_been_saved"), function callback()
            {
                
            });
        }
    }, true, null, $.lang.item("further_informations_save_progress"));
}
/**
 * remove contract 
 */
$.contract.remove = function (id)
{
    $.app.toConsole({"fkt": "$.contract.remove", "id": id});
    if (id == undefined)
    {
        throw new Error($.lang.item("msg_missing_parameter"));
    }

    var params = [
        {"name": "contract_id", "value": id},
        {"name": "confirmed", "value": 1},
        {"name": "rendermode", "value": "JSON"}
    ];

    $.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("contract_sure_delete"), function callback_yes()
    {
        $.app.sendAjaxRequest(baseUrl + "root/contracts/remove/", params, function success(result)
        {
            $.app.toConsole({"fkt": "callback_ajax", "result": result});
            if (result.error && result.error != "")
            {
                $.dialog.error($.lang.item("error"), result.error);
            } else
            {
                if (result.status == "SUCCESS")
                {
                    $.dialog.success($.lang.item("done"), $.lang.item("contract_has_been_deleted"), function callback_done() {

                        if($.contract !== undefined && $.contract !== null)
                        {
                            if ($.contract.table !== undefined && $.contract.table !== null)
                            {
                                $.contract.table.ajax.reload(); // reload the table
                            }
                        }
                    });
                }
            }
        }, true, null, $.lang.item("contract_delete_progress"));
    }, null, $.lang.item("contract_delete"), $.lang.item("cancel"));
}
/**
 * remove flatrate 
 */
$.contract.remove_flatrate = function (contract_id, contract_revision, id)
{
    $.app.toConsole({"fkt": "$.contract.remove_flatrate", "flatrate_id": id});
    if (id == undefined)
    {
        throw new Error($.lang.item("msg_missing_parameter"));
    }

    var params = [
        {"name": "contract_id", "value": contract_id},
        {"name": "flatrate_id", "value": id},
        {"name": "contract_revision", "value": contract_revision},
        {"name": "confirmed", "value": 1},
        {"name": "rendermode", "value": "JSON"}
    ];

    $.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("flatrate_sure_delete"), function callback_yes()
    {
        $.app.sendAjaxRequest(baseUrl + "root/contracts/remove_flatrate/", params, function success(result)
        {
            $.app.toConsole({"fkt": "callback_ajax", "result": result});
            if (result.error && result.error != "")
            {
                $.dialog.error($.lang.item("error"), result.error);
            } else
            {
                if (result.status == "SUCCESS")
                {
                    $.dialog.success($.lang.item("done"), $.lang.item("flatrate_has_been_deleted"), function callback_done() {
                        if($.contract !== undefined && $.contract !== null)
                        {
                            if ($.contract.table_flatrates !== undefined && $.contract.table_flatrates !== null)
                            {
                                $.contract.table_flatrates.ajax.reload(); // reload the table
                            }
                        }
                    });
                }
            }
        }, true, null, $.lang.item("flatrate_delete_progress"));
    }, null, $.lang.item("flatrate_delete"), $.lang.item("cancel"))

}
/**
 * initialize form 
 **/

$.contract.copy_contract = function (contract_id)
{
    
    if (contract_id == undefined)
    {
        throw new Error($.lang.item("msg_missing_parameter"));
    }



        $.dialog.confirm($.lang.item("msg_are_you_sure"), $.lang.item("copy_contract"), function callback_yes()
        {
            var params = [
                {"name": "contract_id", "value": contract_id},  
                {"name": "confirmed", "value": 1},
                {"name": "new_copy_contract_name", "value": ""},
                {"name": "rendermode", "value": "JSON"}
            ];
            
            $.app.sendAjaxRequest(baseUrl + "root/contracts/copyContract/", params, function success(result)
            {
                if (result.error && result.error != "")
                {
                    $.dialog.error($.lang.item("error"), result.error);
                } 
                else
                {
                    if (result.status == "SUCCESS")
                    {
                        $.dialog.success($.lang.item("done"), $.lang.item("contract_has_been_copied"), function callback_done() {

                            if($.contract !== undefined && $.contract !== null)
                            {
                                if ($.contract.table !== undefined && $.contract.table !== null)
                                {
                                    $.contract.table.ajax.reload(); // reload the table
                                }
                            }

                        });
                    }
                }
            }, true, null, $.lang.item("contract_copy_progress"));
        }, null, $.lang.item("copy_contract"), $.lang.item("cancel"));
}
$.contract.init_form = function ()
{
    $.app.init_checked_list_box();
    $.app.init_toggle();
    $.app.init_select2();
    $.app.init_datepicker();

    $(".autonumericcurrency").autoNumeric('init', $.app.autonumeric_options_currency);

    if ($("#form_contract").length > 0)
    {
        $.app.toConsole({"fkt": "$.contract.init_form"});

        $("#btn_new_flatrate").on("click", function () {
            $.contract.edit_flatrate($("#i_contract_id").val(), $("#i_contract_revision").val());
        });

        $('#i_kv_requiered').on('click', function () {
            $.contract.setCheckboxesFor_kv_requiered();
        });

        $('#i_area_based_restriction').on('click', function () {
            $.contract.setArea_based_restriction();
        });


        $("#form_contract").submit(function (e) {
            $.contract.save(e, $("#i_contract_id").val());
            e.preventDefault();
        });

        $("#form_contract_health_insurance").submit(function (e) {
            $.contract.save_health_insurances(e);
            e.preventDefault();
        });

        // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
        if (localStorage.getItem('contract_last_selected_tab') != undefined) {
            $('.nav-tabs a[href="' + localStorage.getItem('contract_last_selected_tab') + '"]').tab('show');
        }

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            localStorage.setItem('contract_last_selected_tab', $(e.target).attr("href"))
            
            if ($(e.target).attr("href") == "#contract_further_information")
            {
                $('.text-area-synamic-resize').each(function() {
                    $(this).css('resize','none');
                    $(this).css('overflow','hidden');
                    $(this).css('height',$(this)[0].scrollHeight+'px');
                });
                $('.text-area-synamic-resize').on("keydown", function() {
                    $(this).css('height',$(this)[0].scrollHeight+'px');
                });
                $('.text-area-synamic-resize').on("paste", function() {
                    $(this).css('height',$(this)[0].scrollHeight+'px');
                });
            }
        });

        // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
        if ($("#i_upload_document").length > 0)
        {
            var target = baseUrl + "root/contracts/upload_contract_document/";
            var show_buttons = true;

            if ($("#i_contract_id").val() != "")
            {
                var on_success = function (event, data, previewId, index) {
                    if($.contract !== undefined && $.contract !== null)
                    {
                        if ($.contract.table_documents !== undefined && $.contract.table_documents !== null)
                        {
                            $.contract.table_documents.ajax.reload(); // reload the table
                        }
                    }


                    if($("#i_custom_document_name").length >0)
                    {
                        $("#i_custom_document_name").val('');
                    }
                    if( $("#i_document_type").length >0)
                    {
                        $("#i_document_type").val('');
                        $("#i_document_type").trigger('change');
                    }
                }; 

                var upload_extra = function () {
                    return {
                        start_doc_upload: 1,
                        rendermode: 'json',
                        contract_id: $("#i_contract_id_docs").val(),
                        custom_document_name: $("#i_custom_document_name").val(),
                        document_type: $("#i_document_type").val(),
                        available_bw: $("#i_available_bw").is(':checked'),
                        available_sn: $("#i_available_sn").is(':checked'),
                        billing_relevant: $("#i_billing_relevant").is(':checked'),
                        mandatory_to_complete: $("#i_mandatory_to_complete").is(':checked'),
                        to_be_signed_by_insured_person: $("#i_to_be_signed_by_insured_person").is(':checked')
                    };
                };

                //selector, upload_url,  allowedExt, multiple, onSuccess, onError, minFiles, maxFiles, maxSize, upload_extra, initialPreview, showCaption, showPreview, showRemove, showUpload, showCancel, showClose, showUploadedThumbs
                $.app.init_fileinput("#i_upload_document", target, ["pdf","jpg","jpeg"], false, on_success, null, 1, 1, 40000, upload_extra, undefined, true, true, show_buttons, show_buttons, show_buttons, false, false);
                
                $('#i_upload_document').on('filecustomerror', function (event, params) {
                    // params.abortData will contain the additional abort data passed
                    // params.abortMessage will contain the aborted error message passed
                    $.app.toConsole({"fkt": "filecustomerror", "event": event, "params": params});
                });

                $('#i_upload_document').on('filebatchpreupload', function (event, data, previewId, index, jqXHR)
                {
                    if ($("#i_document_type").val() == "")
                    {
                        // Raise a filecustomerror
                        return {
                            message: $.lang.item("msg_you_need_to_choose_a_document_type_before_uploading"),
                            data: {key1: 'Key 1', detail1: 'Detail 1'}
                        };
                    }
                });
            }
            if($('#bt_copy_document').length > 0)
            {
                $('#bt_copy_document').on('click',function()
                {
                    if($('#i_global_documents').length > 0)
                    {
                       $.contract.copy_global_to_contract();
                    }
                });
            }
        }

        if($("#form_contract_further_informations").length > 0)
        {
             $("#form_contract_further_informations").submit(function (e) {
                    $.contract.save_contract_further_informations(e);
                    e.preventDefault();
                });
        }
        
        $.contract.setArea_based_restriction();

        // Tabellen am Schluss sinitialisieren
        $.contract.init_table_flatrates($("#i_contract_id").val(), $("#i_contract_revision").val());
        $.contract.init_table_documents($("#i_contract_id").val(), $("#i_contract_revision").val());
        $.contract.init_filter_documents();

        $.contract.init_table_health_insurances($("#i_contract_id").val(), $("#i_contract_revision").val());
        $.contract.init_filter_health_insurances();

        if($("#i_non_flatrate_contract").length > 0)
        {
                $('#i_non_flatrate_contract').on('click', function () 
                {
                        $.contract.toggle_flatrates_container();
                });
                  if ($('#i_non_flatrate_contract').is(':checked'))
                {
                     $.contract.toggle_flatrates_container();
                }
        }
        
        $("#i_kv_necessary_from_cost").autoNumeric("init");
    }
};

$.contract.toggle_flatrates_container = function() 
{
    
     if ($('#i_non_flatrate_contract').is(':checked'))
        {
            $('#btn_new_flatrate').hide();
            $('#div_for_flatrate_contract').hide();
            $('#tbl_contract_flatrates_wrapper').hide();
        } 
        else
        {
            $('#btn_new_flatrate').show();
            $('#div_for_flatrate_contract').show();
            $('#tbl_contract_flatrates_wrapper').show();
        }
}

/**
 * Initialize the flatrates datatable 
 */
$.contract.init_table_flatrates = function (contract_id, contract_revision)
{
    if ($("#tbl_contract_flatrates").length > 0)
    {
        if (contract_id != "")
        {
            $.contract.table_flatrates = $.app.datatable.initialize_ajax("tbl_contract_flatrates", baseUrl + "root/contracts/datatable_flatrates/" + contract_id + "/" + contract_revision +"/"+read_only_view, tbl_columns_flatrates,
                    $.app.datatable.callbacks.rowCallback,
                    $.app.datatable.callbacks.initComplete
                    );
        } else {
            // save contract before
        }
    }
};


//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: HEALTH INSURANCES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
/**
 * Initialize filtering for the health insurance table
 */
$.contract.init_filter_health_insurances = function ()
{
    $('button[name=filter_assignments]').each(function ()
    {
        $(this).on("click", function (e)
        {
            $('button[name=filter_assignments]').removeClass("active");
            $(this).addClass("active");

            var search = "";
            if ($(this).val() == "assigned") {
                search = "yes";
            } else if ($(this).val() == "unassigned") {
                search = "no";
            }
            $.contract.table_health_insurances.column(1).search(search).draw();
            e.preventDefault();
        });
    });

    $("select[name=filter_costcarrier]").on("change", function () {
        var search = "";
        if ($(this).val() != "ALL") {
            search = $("select[name=filter_costcarrier] option:selected").text();
        }

        $.contract.table_health_insurances.column(8).search(search).draw();
    });
};

/**
 * Initialize the health insurance datatable with select options
 */
$.contract.init_table_health_insurances = function (contract_id, contract_revision)
{
    if (contract_id != "")
    {
        var update_enabled_state_for_input = function (read_only_view)
        {
            if (read_only_view==1){
                $.each($.contract.table_health_insurances.rows().data(), function (index, row_data) {
                    var ik = row_data.sgb_vkg_ik_verknuepf_partner;
                    $("#i_alternative_ik_" + ik).prop('disabled', true);
                    $("#i_legs_" + ik).prop('disabled', true);
                    $('#ekv_' + ik).prop('disabled', true);
                    $('#ece_conditions_' + ik).prop('disabled', true);
                });
            }
            else
            {
                $.each($.contract.table_health_insurances.rows({selected: true}).data(), function (index, row_data) {
                    var ik = row_data.sgb_vkg_ik_verknuepf_partner;
                    $("#i_alternative_ik_" + ik).prop('disabled', false);
                    $("#i_legs_" + ik).prop('disabled', false);
                    $('#ekv_' + ik).prop('disabled', false);
                    $('#ece_conditions_' + ik).prop('disabled', false);
                });
    
                $.each($.contract.table_health_insurances.rows({selected: false}).data(), function (index, row_data) {
                    var ik = row_data.sgb_vkg_ik_verknuepf_partner;
                    $("#i_alternative_ik_" + ik).prop('disabled', true);
                    $("#i_legs_" + ik).prop('disabled', true);
    
                    //$('#ekv_'+ik).prop('checked', false);
                    $('#ekv_' + ik).prop('disabled', true);
                    $('#ece_conditions_' + ik).prop('disabled', true);
                });
            }
        }

        // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
        var append_data_function = function (data) {
            data.filter_assignement = $('button[name=filter_assignments].active').val();
        };

        // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
        var target = baseUrl + "root/contracts/datatable_health_insurances/" + contract_id+ "/"+contract_revision;
        var options = {
            columnDefs: [
                {orderable: true, className: 'select-checkbox', targets: 2, 'checkboxes': {'selectRow': true}}
            ],
            select: {
                style: 'multi',
                selector: 'td:nth-child(2)'
            },
            rowId: 'sgb_vkg_ik_verknuepf_partner',
            destroy: 'true',
            deferRender: false,
            serverSide: false,
            order: [
                [1, "desc"],
                [7, "asc"],
                [4, "asc"]
            ]
        };

        // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
        $.contract.table_health_insurances = $.app.datatable.initialize_ajax("tbl_contract_insurances", target, table_columns_health_insurances,
            function(row, data, index){
                $.app.datatable.callbacks.rowCallback(row, data, index);
                setTimeout(function () {
                    $.app.init_select2();
                });
                //$.app.toConsole({"fkt":"rowCallback", "row":row, "data":data, "index":index});
            },
            function (settings, json)
            {
                // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
                // select assigned tests
                
				$.contract.table_health_insurances.rows().every(function (rowIdx, tableLoop, rowLoop)
                {
                    var data = this.data();   
                    //$.app.toConsole({"rowIdx":rowIdx, "tableLoop":tableLoop, "rowLoop":rowLoop, "data":data, "user-id":data.user_id, "username":data.username, "assigned":data.assigned});
                    if (data.assigned == "yes") {
                        this.select();
                    }
					$(this.node()).find('.ece_conditions').on("change",function(){
							//alert("123!")
					})
                    
                });

                // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
                // add event listener for row selection/deselection
                $.contract.table_health_insurances.on("click", "th.select-checkbox", function () {
                    if ($("th.select-checkbox").hasClass("selected")) {
                        $.contract.table_health_insurances.rows({search: 'applied'}).deselect();
                        $("th.select-checkbox").removeClass("selected");
                    } else {
                        $.contract.table_health_insurances.rows({search: 'applied'}).select();
                        $("th.select-checkbox").addClass("selected");
                    }
                });
                $.contract.table_health_insurances.on('select.dt select deselect.dt deselect', function (e, dt, type, indexes) {
                    $.app.toConsole({"fkt": "select/deselect", "e": e, "dt": dt, "type": type, "indexes": indexes});

                    if ($.contract.table_health_insurances.rows({
                        selected: true
                    }).count() !== $.contract.table_health_insurances.rows().count()) {
                        $("th.select-checkbox").removeClass("selected");
                    } else {
                        $("th.select-checkbox").addClass("selected");
                    }
                    //   alert(dt.row(indexes[0]).data().sgb_vkg_ik_verknuepf_partner);
                    var id = dt.row(indexes[0]).data().sgb_vkg_ik_verknuepf_partner;
                    update_enabled_state_for_input(read_only_view);
                });

                // Set inputs disabled, when insurance is not selected
                update_enabled_state_for_input(read_only_view);
            },
            options, append_data_function
        );
    }
};

/**
 * Save the health insurances for the contract
 */
$.contract.save_health_insurances = function (e)
{
    var params = $("#form_contract_health_insurance").serializeArray();
    params.push({"name": "rendermode", "value": "json"});

    if ($.contract.table_health_insurances !== undefined)
    {
        //var alternative_iks = [];
        var legs_tk = [];
        var legs_stk = [];

        var selected_health_insurances = [];
		
        $.each($.contract.table_health_insurances.rows({selected: true}).data(), function (index, row_data) {
            var ik_number = row_data.sgb_vkg_ik_verknuepf_partner;

            //alternative_iks[ik_number] = $("#i_alternative_ik_" + ik_number).val();
            legs_tk[ik_number] = $("#i_legs_tk_" + ik_number + " option:selected").val();
            legs_stk[ik_number] = $("#i_legs_stk_" + ik_number).val();
			
        });
        
		$.contract.table_health_insurances.rows({selected: true}).nodes().to$().each(function (index, element)
	   {
	   		   var ik_number = element.id;
	   		   var ece_condition = $(element).find(".ece_conditions option:selected").val();
	   		   var ekv = Number($(element).find('input[name="ekv[]"]').is(':checked'));
	   		   var alternative_iks = $(element).find('#i_alternative_ik_'+ik_number).val();
				selected_health_insurances.push(ik_number);
			   $.app.toConsole({"fkt":"save", "index":index, "element":element});
			   
			   params.push({"name": "ece_condition["+ik_number+"]", "value": ece_condition});
			   params.push({"name": "ekv["+ik_number+"]", "value": ekv});
			   params.push({"name": "alternative_iks["+ik_number+"]", "value": alternative_iks});
			   //params.push({"name": "selected_health_insurances[]", "value": ik_number});
	   }); 
        params.push({"name": "selected_health_insurances", "value": selected_health_insurances});
    }

    var target = $('#form_contract_health_insurance').attr('action');
    $.app.sendAjaxRequest(target, params, function success(result)
    {
        $.app.toConsole({"fkt": "callback save health insurances ajax", "data": result});

        $.app.setFormValidationStates("form_contract_health_insurance", result.error, result.extra, null);

        if (result.error && result.error !== "") {
            $.dialog.error($.lang.item("error"), result.error);
        } else {
            $.dialog.success($.lang.item("done"), $.lang.item("health_insurances_has_been_saved"), function callback()
            {
                //nach Speichern neu laden wegen Filterung über Buttons
                if($.contract !== undefined && $.contract !== null)
                {
                    if ($.contract.table_health_insurances !== undefined && $.contract.table_health_insurances !== null)
                    {
                        $.contract.table_health_insurances.ajax.reload();

                    }
                    $.contract.init_filter_health_insurances();
                }
            });
        }
    }, true, null, $.lang.item("contract_health_insurances_save_progress"));
};


$.contract.setCheckboxesFor_kv_requiered = function ()
{
    //var checkboxes = ['i_original_rz', 'i_copy_rz', 'i_original_gen', 'i_copy_gen'];
    var checkboxes = ['i_original_gen', 'i_copy_gen'];
    if ($('#i_kv_requiered').is(':checked'))
    {
        $.each(checkboxes, function (i, l)
        {
            $('#' + l + "_lbl").removeClass('disabled');
            $('#' + l + "_lbl").prop("disabled", false);
            $('#' + l).removeClass('disabled');
            $('#' + l).prop("disabled", false);
        });
    } else
    {
        $.each(checkboxes, function (i, l)
        {
            $('#' + l + "_lbl").addClass('disabled');
            $('#' + l + "_lbl").prop("disabled", true);
            $('#' + l).addClass('disabled');
            $('#' + l).prop("disabled", true);
            $('#' + l).removeAttr('checked');
        });

    }
};

$.contract.setArea_based_restriction = function ()
{

    var disable = false;

    if (disable == true)
    {
        if ($('#i_area_based_restriction').is(':checked'))
        {
            $("#i_restriction_subcountry").prop("disabled", false);
            $("#i_restriction_plz").prop("disabled", false);
        } else
        {
            $("#i_restriction_subcountry").prop("disabled", true);
            $("#i_restriction_plz").prop("disabled", true);
            /*
             //comment in if values should be empty.
             $("#i_restriction_subcountry").val('').change();
             $("#i_restriction_plz").val('');
             */
        }
    } else
    {
        if ($('#i_area_based_restriction').is(':checked'))
        {
            $('#fi_restriction_subcountry').show();
            $('#fi_restriction_plz').show();
            $('#i_hint_restriction_plz').show();

        } else
        {
            $('#fi_restriction_subcountry').hide();
            $('#fi_restriction_plz').hide();
            $('#i_hint_restriction_plz').hide();
            /*
             //comment in if values should be empty.
             $("#i_restriction_subcountry").val('').change();
             $("#i_restriction_plz").val('');
             */

        }

    }

}
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: DOCUMENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
/**
 * Initialize the documents datatable 
 */

$.contract.copy_global_to_contract = function()
{
    // SEL
    var global_document_id = $('#i_global_documents').find(":selected").val();
    if(global_document_id != '')
    {
        var params = [
                                {"name": "global_document_id", "value": global_document_id},
                                {"name": "contract_id", "value": $('#i_contract_id').val()},
                                {"name": "contract_revision", "value": $('#i_contract_revision').val()},
                                {"name": "rendermode", "value": "JSON"}
                            ];
        
        $.app.sendAjaxRequest(baseUrl + "root/contracts/copy_global_document/", params, function success(result)
        {
                if (result.error && result.error != "")
                {
                        $.dialog.error($.lang.item("error"), result.error);
                }
                else
                {
                        if (result.status == "SUCCESS")
                        {
                            if($.contract !== undefined && $.contract !== null)
                            {
                                if ($.contract.table_documents !== undefined && $.contract.table_documents !== null)
                                {
                                    $.contract.table_documents.ajax.reload(); // reload the table
                                }
                            }

                        }
                }
        }, true, null, $.lang.item("copy_global_document_progress"));  
    }
}

$.contract.init_table_documents = function (contract_id, contract_revision)
{
    if (contract_id != "" && $('#tbl_contract_documents').length >0)
    {
        var target = baseUrl + "root/contracts/datatable_documents/" + contract_id + "/" + contract_revision+"/" + read_only_view;
        var options = {
            rowId: 'document_id',
            destroy: 'true',
            deferRender: true,
            serverSide: false,
            order: [
                [4, "asc"]
            ]
        };

        $.contract.table_documents = $.app.datatable.initialize_ajax("tbl_contract_documents", target, tbl_columns_documents,
                $.app.datatable.callbacks.rowCallback,
                $.app.datatable.callbacks.initComplete,
                options
                );
    } else {
        // save contract before
    }
};

$.contract.init_filter_documents = function ()
{
    $('button[name=filter_assignments_documents]').each(function ()
    {
        $(this).on("click", function (e)
        {
            $('button[name=filter_assignments_documents]').removeClass("active");
            $(this).addClass("active");

            var search_column = undefined;
            var search = "";
            var cols = [7, 9, 11, 13, 15];

            if ($(this).attr('id') == 'btn_filter_assignments_available_bw') {
                search_column = cols[0];
            } else if ($(this).attr('id') == 'btn_filter_assignments_available_sn') {
                search_column = cols[1];
            } else if ($(this).attr('id') == 'btn_filter_assignments_billing_relevant') {
                search_column = cols[2];
            } else if ($(this).attr('id') == 'btn_filter_assignments_mandatory_to_complete')
            {
                search_column = cols[3];
            } else if ($(this).attr('id') == 'btn_filter_assignments_to_be_signed_by_insured_person')
            {
                search_column = cols[4];
            }

            $.each(cols, function (index, column)
            {
                if (column == search_column) {
                    search = 1;
                } else {
                    search = "";
                }
                $.contract.table_documents.column(column).search(search).draw();
            });
        });
    });

    $('#i_document_type_filter').on('change', function ()
    {
        var search = "";
        if ($(this).val() != "ALL") {
            search = $("select[name=document_type_filter] option:selected").text();
        }
        $.contract.table_documents.column(5).search(search).draw();
    });
};

/**
 * Download a document by its ID
 */
$.contract.download_contract_document = function (document_id)
{ 
    var target = baseUrl + "root/contracts/download_contract_document/" + document_id;
    
    $.ajax({
        type: 'GET',
        url: target,
        processData: false,
        success: function (data) {
            if(data == false)
            {
                $.dialog.error($.lang.item("error"),$.lang.item("file_does_not_exist"));
            }
            else
            {
                window.location = target;
            }
            
        },
        error: function (xhr) {
            $.dialog.error($.lang.item("error"), JSON.stringify(xhr));
        }
    });
};

/**
 * 
 * @param {type} document_id
 * @returns {undefined}
 */
$.contract.print_document = function(document_id)
{
	var data = { 
		debitor_id:$('#i_debitor_id').val()
	};
	
    $.ajax({
        'async': false,
        'type': "POST",
        'dataType': 'json',
        'url': baseUrl+"root/contracts/generate_contract_document/" + document_id,
        'data': data,
        'success': function (result)
	    {
            if (result.error != undefined) {
                $.dialog.error($.lang.item("error"), result.error);
            }
            else
            {
                var target = baseUrl + "root/contracts/downloaddocument/" + result.data.fileB64;
                $.ajax({
                    type: 'GET',
                    url: target,
                    processData: false,
                    success: function (data)
                    {
                        if (data.error == undefined) {
                            window.location = target;
                            if ($("#tbl_debitor_documents").length > 0) {
                                
                                $.debitors.table_debitor_documents.ajax.reload(function (){$.contract.table_debitor_documents_init_complete()});
                                
                            }
                            if ($('#tbl_debitor_history').length > 0) {
                               $.debitors.table_debitor_history.ajax.reload();
                            }
                        }
                        else {
                            //
                        }
                    },
                    error: function (xhr) {
                        $.dialog.error($.lang.item("error"), JSON.stringify(xhr));
                    }
                });
            }
        }
	});
};

$.contract.table_debitor_documents_init_complete = function()
{
        var count = $('.contract_document_must_generate').length;
        if(count >0)
        {
            $('#mandatory_doc_count').html("<b>"+count+"</b>");    
        }
}
//..::::::::::::::::::::::.
/**
 * Download a document by its ID
 */
$.contract.remove_contract_document = function (document_id)
{
    var params = [
        {"name": "document_id", "value": document_id},
        {"name": "confirmed", "value": 1},
        {"name": "rendermode", "value": "JSON"}
    ];

    $.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("contract_document_sure_delete"), function callback_yes()
    {
        $.app.sendAjaxRequest(baseUrl + "root/contracts/remove_contract_document/" + document_id, params, function success(result)
        {
            $.app.toConsole({"fkt": "callback_ajax", "result": result});
            if (result.error && result.error != "")
            {
                $.dialog.error($.lang.item("error"), result.error);
            } else
            {
                if (result.status == "SUCCESS")
                {
                    $.dialog.success($.lang.item("done"), $.lang.item("document_has_been_deleted"), function callback_done() {
if($('#tbl_contract_global_documents').length >0)        
{
      $.contract.table_global_documents.ajax.reload(); // reload the table 
}
else
{
    if($.contract !== undefined && $.contract !== null)
    {
        if ($.contract.table_documents !== undefined && $.contract.table_documents !== null)
        {
            $.contract.table_documents.ajax.reload(); // reload the table
        }
    }
}
                       
                    });
                }
            }
        }, true, null, $.lang.item("document_delete_progress"));
    }, null, $.lang.item("document_delete"), $.lang.item("cancel"))
};

$.contract.edit_contract_document_parameters = function (document_id)
{
    var tableRow = $('#btn_edit_document_parameter_' + document_id).closest('tr').index(); // GET TABLE ROW NUMBER
    if ($('#btn_edit_document_parameter_' + document_id).hasClass('btn-primary'))
    {
        $('#i_alternative_document_name_' + document_id).prop('disabled', false);

        $('#bww_' + document_id + '_lbl').removeClass('disabled');
        $('#bww_' + document_id).prop('disabled', false);
        $('#bww_' + document_id).removeClass('disabled');

        $('#snn_' + document_id + '_lbl').removeClass('disabled');
        $('#snn_' + document_id).prop('disabled', false);
        $('#snn_' + document_id).removeClass('disabled');

        $('#brr_' + document_id + '_lbl').removeClass('disabled');
        $('#brr_' + document_id).prop('disabled', false);
        $('#brr_' + document_id).removeClass('disabled');

        $('#mandatory_' + document_id + '_lbl').removeClass('disabled');
        $('#mandatory_' + document_id).prop('disabled', false);
        $('#mandatory_' + document_id).removeClass('disabled');
        
        $('#to_be_signed_' + document_id + '_lbl').removeClass('disabled');
        $('#to_be_signed_' + document_id).prop('disabled', false);
        $('#to_be_signed_' + document_id).removeClass('disabled');

        $('#btn_edit_document_parameter_' + document_id).removeClass('btn-primary');
        $('#btn_edit_document_parameter_' + document_id).addClass('btn-success');
        $('#btn_edit_document_parameter_' + document_id).find('i').removeClass('fa-pencil');
        $('#btn_edit_document_parameter_' + document_id).find('i').addClass('fa-save');
    } 
    else
    {
        let str = $('#i_alternative_document_name_' + document_id).val();
        let forbiddenString = false;
        if (str.indexOf("/") >= 0 || str.indexOf("\\") >= 0)
        {
            forbiddenString = true;
        }
        if(forbiddenString)
        {
            $.dialog.error($.lang.item("error"), 'Es sind keine "/" und "\\" im Dateinamen gestattet');return;
        }
        var params = [
            {"name": "contract_id", "value": $('#i_contract_id').val()},
            {"name": "document_id", "value": document_id},
            {"name": "custom_document_name", "value": $('#i_alternative_document_name_' + document_id).val()},
            {"name": "available_bw", "value": ($('#bww_' + document_id).is(':checked') ? 1 : 0)},
            {"name": "available_sn", "value": ($('#snn_' + document_id).is(':checked') ? 1 : 0)},
            {"name": "billing_relevant", "value": ($('#brr_' + document_id).is(':checked') ? 1 : 0)},
            {"name": "mandatory_to_complete", "value": ($('#mandatory_' + document_id).is(':checked') ? 1 : 0)},
            {"name": "to_be_signed_by_insured_person", "value": ($('#to_be_signed_' + document_id).is(':checked') ? 1 : 0)}
        ];

        $.app.sendAjaxRequest(baseUrl + "root/contracts/edit_contract_document_parameters/" + document_id, params, function success(result)
        {
            $.app.toConsole({"fkt": "callback_ajax", "result": result});
            if (result.error && result.error != "")
            {
                $.dialog.error($.lang.item("error"), result.error);
            } else
            {
                if (result.status == "SUCCESS")
                {

                }
            }
        }, true, null, $.lang.item("document_save_progress"));

        $('#i_alternative_document_name_' + document_id).prop('disabled', true);

        $('#bww_' + document_id + '_lbl').addClass('disabled');
        $('#bww_' + document_id).prop('disabled', true);
        $('#snn_' + document_id + '_lbl').addClass('disabled');
        $('#snn_' + document_id).prop('disabled', true);

        $('#brr_' + document_id + '_lbl').addClass('disabled');
        $('#brr_' + document_id).prop('disabled', true);

        $('#mandatory_' + document_id + '_lbl').addClass('disabled');
        $('#mandatory_' + document_id).prop('disabled', true);
        
        $('#to_be_signed_' + document_id + '_lbl').addClass('disabled');
        $('#to_be_signed_' + document_id).prop('disabled', true);
        
        $('#btn_edit_document_parameter_' + document_id).removeClass('btn-success');
        $('#btn_edit_document_parameter_' + document_id).addClass('btn-primary');
        $('#btn_edit_document_parameter_' + document_id).find('i').addClass('fa-pencil');
        $('#btn_edit_document_parameter_' + document_id).find('i').removeClass('fa-save');


        var valbw = 0;//Filtercolumn BW
        if ($('#bww_' + document_id).is(':checked')) {
            valbw = 1;
        }

        var valsn = 0;//Filtercolumn SN
        if ($('#snn_' + document_id).is(':checked')) {
            valsn = 1;
        }
        var valbr = 0;//Filtercolumn Abrechnungsrelevant
        if ($('#brr_' + document_id).is(':checked')) {
            valbr = 1;
        }
        var valmc = 0; //Filtercolumn Verpflichtend auszufüllen
        if ($('#mandatory_' + document_id).is(':checked')) {
            valmc = 1;
        }
        var valvu = 0; //Filtercolumn Verpflichtend auszufüllen
        if ($('#to_be_signed_' + document_id).is(':checked')) {
            valvu = 1;
        }

        $.contract.table_documents.cell(tableRow, 7).data(valbw);   //Filtercolumn BW
        $.contract.table_documents.cell(tableRow, 9).data(valsn);   //Filtercolumn SN
        $.contract.table_documents.cell(tableRow, 11).data(valbr);      //Filtercolumn Abrechnungsrelevant
        $.contract.table_documents.cell(tableRow, 13).data(valmc);      //Filtercolumn Verpflichtend auszufüllen
        $.contract.table_documents.cell(tableRow, 15).data(valvu);      //Filtercolumn Verpflichtend auszufüllen

        $('button[name=filter_assignments_documents]').each(function ()
        {
            if ($(this).hasClass("active"))
            {
                $(this).trigger('click');
            }
        });
    }
}

$.contract.tab_changed = function ()
{

};

/**
 * initialize table
 **/
$.contract.init_table = function ()
{
    if ($("#tbl_contract").length > 0)
    {
        $.app.toConsole({"fkt": "$.contract.init_table"});

        var selected_rows = [];

        $.contract.table = $.app.datatable.initialize_ajax("tbl_contract", baseUrl + "root/contracts/datatable", tbl_columns_contract,
            $.app.datatable.callbacks.rowCallback,
            $.app.datatable.callbacks.initComplete
        );
    }
};

$.contract.init_general_settings_tab = function(){
    $('#bt_general_settings').off('click').on('click', $.contract.save_general_settings);
}

$.contract.save_general_settings = function(){
    $.app.sendAjaxRequest(baseUrl + "root/contracts/save_general_settings/",
                        {
                                    username: $('#i_egeko_username').val(),
                                    password: $('#i_egeko_password').val(),
                                    egeko_name: $('#i_egeko_name').val(),
									delivery_lead_time: $('#i_delivery_lead_time').val()
                               },
                               function success(result)
                               {
                                   $.app.toConsole({"fkt": "callback_ajax", "result": result});
                                   if (result.error && result.error != "")
                                   {
                                       $.dialog.error($.lang.item("error"), result.error);
                                   }
                                   else
                                   {
                                       $.dialog.success($.lang.item("success"), $.lang.item("further_informations_has_been_saved"))
                                   }
                                },
                                true,
                                null,
                                $.lang.item("general_settings_save_progress"));
};

$(document).ready(function ()
{
    $.app.toConsole("contract.js ready", "log");

    $.contract.init_table();
    $.contract.init_form();
    $.contract_doc_editor.init_global_docs();
    $.contract.init_general_settings_tab();
});