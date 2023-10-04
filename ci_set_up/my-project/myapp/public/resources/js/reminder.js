if (typeof jQuery === "undefined") { 
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * reminder object
 */
$.reminder = {
	/* reminder options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null
};

/**
 * edit reminder 
 */
$.reminder.edit = function(id)
{
	$.app.toConsole({"fkt":"$.reminder.edit", "id":id});

	var params = $("#form_reminder").serializeArray();
		params.push({"name":"reminder_id", "value":id});
		params.push({"name":"rendermode", "value":"ajax"});

	var target = baseUrl+"admin/reminder/edit/"+id;
			
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, $.reminder.init_form, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
}

/**
 * save reminder 
 */
$.reminder.save = function(e)
{
	$.app.toConsole({"fkt":"$.reminder.save"});
	
	var params	= $("#form_reminder").serializeArray();
		params.push({"name":"rendermode", "value":"json"})
	
	$.app.sendAjaxRequest(e.delegateTarget.action, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback save reminder ajax", "data":result});
		
		$.app.setFormValidationStates("form_reminder", result.error, result.extra, null);
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.dialog.success($.lang.item("done"), $.lang.item("reminder_has_been_saved"), function callback()
			{
				$.app.redirect(baseUrl+"admin/reminder/");
			});
		}
	}, true, null, $.lang.item("reminder_save_progress"));
}

$.reminder.remove_reminder_workstate= function(reminder_id)
{
    // state 0 = open, 1 = in work

    var params = [
  		{"name":"reminder_id", "value":reminder_id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"}
  	];
                $.dialog.confirm($.lang.item("msg_are_you_sure"), $.lang.item("change_reminder_workstate"), function callback_yes()
                {
                            $.app.sendAjaxRequest(baseUrl+"admin/reminder/remove_reminder_workstate/"+reminder_id, params, function success(result)
                            {
                                    $.app.toConsole({"fkt":"callback_ajax", "result":result});
                                    if (result.error && result.error != "")
                                    {
                                            $.dialog.error($.lang.item("error"), result.error);
                                    }
                                    else
                                    {
                                            if (result.status == "SUCCESS")
                                            {
                                                            $.reminder.init_table();

                                            }
                                    }
                            }, true, null, $.lang.item("reminder_workstate_change_progress"));

                }, null, $.lang.item("yes"), $.lang.item("cancel"))
}
/**
 * remove reminder 
 */
$.reminder.remove = function(id)
{
	$.app.toConsole({"fkt":"$.reminder.remove", "id":id});
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}
	
	var params = [
  		{"name":"reminder_id", "value":id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	$.dialog.confirm($.lang.item("msg_are_you_sure"), $.lang.item("reminder_sure_delete"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"admin/reminder/remove/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("reminder_has_been_deleted"), function callback_done(){
						$.reminder.table.ajax.reload(); // reload the table 
					});
				}
			}
		}, true, null, $.lang.item("reminder_delete_progress"));
	}, null, $.lang.item("reminder_delete"), $.lang.item("cancel"))
		
}

$.reminder.setReminderActive = function(reminder_id,active)
{
    var target = baseUrl+'admin/reminder/setReminderActive';
    var params = {
        reminder_id: reminder_id,
        reminder_state: active,
        rendermode: "json",
    }
    
    $.dialog.confirm($.lang.item("msg_are_you_sure"), $.lang.item("change_state_of_reminder"), function callback_yes()
   {
           $.app.sendAjaxRequest(target, params, function success(result)
           {
                   $.app.toConsole({"fkt":"callback setReminderActive ajax", "data":result});

                   //$.app.setFormValidationStates("form_debitor_delivery", result.error, result.extra, null);

                   if (result.error && result.error != ""){
                           $.dialog.error($.lang.item("error"), result.error);
                   }
                   else{
                           $.reminder.init_table();
                           $("#i_responsible_dropdown").trigger("change");
                            $("#i_filter_reminder").trigger("change");
                   }
           }, true, null, $.lang.item("msg_wait"));
   }, function callback_no(){ $.reminder.init_table();}, $.lang.item("change_state_of_reminder"), $.lang.item("cancel"))
};

$.reminder.fillPrescriptionDropdown = function(debitor_id,hiddenIdValue)
{
    let params = [
        {"name": "debitor_id", "value": debitor_id},
        {"name": "rendermode", "value": "JSON"}
    ];
    $.app.sendAjaxRequest(baseUrl + "admin/reminder/load_prescriptions_for_debitor", params, function success(result)
    {
        if (result.error && result.error != ""){
            $.dialog.error($.lang.item("error"), result.error);
        }
        else{
//
            $("#i_reminder_prescription").append('<option id="" value="" label="" title="" data-original-title=""></option>');
            $.each(result.data,function(index,value){
                console.log(index);
                console.log(value);
                let prescription_description = value.contract_name+" ("+value.prescription_date+")";
                  var newOption = '<option id="'+value.prescription_id+'" value="'+value.prescription_id+'" label="'+prescription_description+'" key="'+value.prescription_id+'" title="'+prescription_description+'">'+prescription_description+'</option>';
                    $("#i_reminder_prescription").val(null).trigger('change');
                    $("#i_reminder_prescription").append(newOption);
                    if(hiddenIdValue != undefined)
                    {
                        $("#i_reminder_prescription").val(hiddenIdValue).trigger('change');
                    }
            })
        }
    }, true, null, $.lang.item("in_progress"));

}

$.reminder.toggle_reminder_prescription_selection = function() {
    var selectedValue = $("#i_reminder_type").val();
    var arrVals=['reminder_check_prescription','reminder_get_followup_prescription'];
    if($.inArray(selectedValue, arrVals) > -1) {
        $('#fi_reminder_prescription').show();
        $.reminder.fillPrescriptionDropdown($('#i_reminder_debitor_id').val());
    }
    else {
        $('#fi_reminder_prescription').val('').trigger('change');
        $('#fi_reminder_prescription').hide();
    }
}
/**
 * initialize form 
 **/
$.reminder.init_form = function()
{
	if ($("#form_reminder").length > 0)
	{
		$.app.toConsole({"fkt":"$.reminder.init_form"});
		
		$.app.init_checked_list_box();
		$.app.init_toggle();
                                    $.app.init_select2();
		$.app.init_datepicker();
		$("#form_reminder").submit(function(e) {
	        $.reminder.save(e);
	        e.preventDefault();
		});

        $('#i_reminder_debitor_id').select2({
            ajax: {

                delay: 250, // wait 250 milliseconds before triggering the request
                url: baseUrl+'admin/debitors/get_debitor_by_name_or_ax_id',
                contentType: 'application/json',
                dataType: 'json',
                data: function(params) {
                    return {
                        search_term: params.term
                    };
                },
                processResults: function(result) {
                    if (result.error && result.error != null){
                        $.dialog.error($.lang.item('error'), result.error);
                    }
                    else {
                        var data = result.data.items.map(function (item) {
                            return {
                                id: item.id,
                                text: item.text,
                                insurance_no: item.insurance_number,
                                account_no: item.account_number
                            };
                        });
                        return { results: data };
                    }
                },
                cache: false,
                minimumInputLength: 3,
            },
            templateResult: (result) =>{ return result.text;},
            placeholder: $.lang.item("please_select"),
            width: "100%",
            allowClear: true,
            language: $.lang.locale,
            theme: "bootstrap",
            dropdownAutoWidth : true
        }).on('change',function(evt){
            $.app.toConsole($(evt.target).children("option:selected"));
            $('#i_reminder_prescription').empty().trigger("change");
            $.reminder.fillPrescriptionDropdown($('#'+evt.target.id).val())
        });
        $.reminder.toggle_reminder_prescription_selection();
        $("#i_reminder_type").on('change',function(){
            $.reminder.toggle_reminder_prescription_selection();
        });

        if($('#i_hidden_prescription_id').val() != 0 && $('#i_hidden_debitor_id').val() != 0)
        {
            $.reminder.fillPrescriptionDropdown($('#i_hidden_debitor_id').val(),$('#i_hidden_prescription_id').val())
        }
	}
        if($("#i_responsible_dropdown").length >0)
        {
            $("#i_responsible_dropdown").trigger("change");
            $(document).off("click",".checkbox-for-reminder");
            $(document).on("click",".checkbox-for-reminder",function()
            {
                    if($(this).hasClass('disabled')== true)
                    {
                        return;
                    }
                    var value_activate = 0;
                    if ($(this).is(':checked'))
                    {
                        value_activate = 1;
                    }
                    $.reminder.setReminderActive($(this).val(),value_activate);
            });
        }
}

/**
 * initialize table
 **/
$.reminder.init_table = function()
{
	if ($("#tbl_reminder").length > 0)
	{
            
		$.app.toConsole({"fkt":"$.reminder.init_table"});
                
                                    var options = {
                                    rowId: 'reminder_id',
                                    destroy: 'true',
                                    deferRender: true,
                                    serverSide: false,
                                        columnDefs: [
                                            { "orderData": [ 16 ], "targets": 7 }
                                        ]
                                    };
		
                $("#i_responsible_dropdown").on("change", function()
                {
                                var search = ($(this).val() != "" ? $("#i_responsible_dropdown option:selected").text() : "");	
                                //alert(search);
                                $.reminder.table.column(9).search('').draw(); 
                                $.reminder.table.column(10).search('').draw(); 
                                var searchColumn = 10;
                                if(search == 'Alle')
                                {
                                    
                                    search = '';
                                }
                                
                                if(search == 'selbst')
                                {
                                    searchColumn = 9;
                                    search = $.lang.item('self');
                                }
                                 $.reminder.table.column(searchColumn).search(search).draw(); 
                });
                //Filter TYP Reminder
                $("#i_filter_reminder").on("change", function()
                {
                  var search = ($(this).val() != "" ? $("#i_filter_reminder option:selected").text().split(' (')[0] : "");
                  //var search = ($(this).val());
                   var searchColumn = 2;
                     if(search == 'Alle')
                     {
                             search = '';
                     }
                     $.reminder.table.column(searchColumn).search(search).draw();
                });
		var selected_rows = [];
		
		$.reminder.table = $.app.datatable.initialize_ajax("tbl_reminder", baseUrl+"admin/reminder/datatable", tbl_columns_reminder, 
			$.app.datatable.callbacks.rowCallback, 
			$.app.datatable.callbacks.initComplete, options
		);
	}
}

$(document).ready(function()
{
	$.app.toConsole("reminder.js ready", "log");
	$.reminder.init_table();
	$.reminder.init_form();
	
});