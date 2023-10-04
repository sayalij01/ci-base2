if (typeof jQuery === "undefined") { 
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * health_insurance object
 */
$.health_insurances = {
	/* health_insurance options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null
};

/**
 * edit health_insurance 
 */
$.health_insurances.edit = function(id)
{
	$.app.toConsole({"fkt":"$.health_insurances.edit", "id":id});

	var params = $("#form_health_insurance").serializeArray();
		params.push({"name":"ik_number", "value":id});
		params.push({"name":"rendermode", "value":"ajax"});

	var target = baseUrl+"root/health_insurances/edit/"+id;
			
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, $.health_insurances.init_form, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
}

/**
 * save health_insurance 
 */
$.health_insurances.save = function(e)
{
	$.app.toConsole({"fkt":"$.health_insurances.save"});
	
	var params	= $("#form_health_insurance").serializeArray();
		params.push({"name":"rendermode", "value":"json"})
	
	$.app.sendAjaxRequest(e.delegateTarget.action, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback save health_insurance ajax", "data":result});
		
		$.app.setFormValidationStates("form_health_insurance", result.error, result.extra, null);
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.dialog.success($.lang.item("done"), $.lang.item("health_insurance_has_been_saved"), function callback()
			{
				$.app.redirect(baseUrl+"root/health_insurances/");
			});
		}
	}, true, null, $.lang.item("health_insurance_save_progress"));
}

/**
 * remove health_insurance 
 */
$.health_insurances.remove = function(id)
{
	$.app.toConsole({"fkt":"$.health_insurances.remove", "id":id});
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}
	
	var params = [
  		{"name":"ik_number", "value":id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("health_insurance_sure_delete"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"root/health_insurances/remove/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("health_insurance_has_been_deleted"), function callback_done(){
						if($.health_insurances !== undefined && $.health_insurances !== null)
						{
							if($.health_insurances.table !== undefined && $.health_insurances.table !== null)
							{
								$.health_insurances.table.ajax.reload(); // reload the table
							}
						}
					});
				}
			}
		}, true, null, $.lang.item("health_insurance_delete_progress"));
	}, null, $.lang.item("health_insurance_delete"), $.lang.item("cancel"))
		
}

/**
 * initialize form 
 **/
$.health_insurances.init_form = function()
{
	if ($("#form_health_insurance").length > 0)
	{
		$.app.toConsole({"fkt":"$.health_insurances.init_form"});
		
		$.app.init_checked_list_box();
		$.app.init_toggle();
		
		$("#form_health_insurance").submit(function(e) {
	        $.health_insurances.save(e);
	        e.preventDefault();
		});
	}
}

$.health_insurances.show_insurance_details = function(ik_number)
{
    if(ik_number != undefined)
    {
        var params = [ {"name":"ik_number", "value":ik_number}, {"name":"rendermode", "value":"JSON"} ];
        
            $.app.sendAjaxRequest(baseUrl+"root/health_insurances/get_health_insurance_details/"+ik_number, params, function success(result)
            {
                if (result.error && result.error != "")
                {
                        $.dialog.error($.lang.item("error"), result.error);
                }
                else
                {
                        if (result.status == "SUCCESS")
                        {
                              $.dialog.info($.lang.item('health_insurance_detail')+" "+ik_number,result.data[0]);
                        }
                }
            }, true, null, $.lang.item("show_health_insurance_detail_progress"));
    }
    else
    {
        $.dialog.error($.lang.item("error"),$.lang.item('msg_missing_parameter') );
    }
}

$.health_insurances.show_insurance_billing_numbers = function(ik_number)
{
	if(ik_number != undefined)
	{
		var params = [ {"name":"ik_number", "value":ik_number}, {"name":"rendermode", "value":"JSON"} ];

		$.app.sendAjaxRequest(baseUrl+"root/health_insurances/get_health_insurance_billing/"+ik_number, params, function success(result)
		{
			if (result.error && result.error != "")
			{
				$.dialog.error($.lang.item("error"), result.error);
			}
			else
			{
				if (result.status == "SUCCESS")
				{
					$.dialog.info($.lang.item('health_insurance_billing_detail')+" "+ik_number,result.data[0]);
				}
			}
		}, true, null, $.lang.item("show_health_insurance_detail_progress"));
	}
	else
	{
		$.dialog.error($.lang.item("error"),$.lang.item('msg_missing_parameter') );
	}
}
/**
 * initialize table
 **/
$.health_insurances.init_table = function()
{
	if ($("#tbl_health_insurances").length > 0)
	{
		$.app.toConsole({"fkt":"$.health_insurances.init_table"});
		
		var selected_rows = [];
		
		$.health_insurances.table = $.app.datatable.initialize_ajax("tbl_health_insurances", baseUrl+"root/health_insurances/datatable", tbl_columns_health_insurance, 
			$.app.datatable.callbacks.rowCallback, 
			$.app.datatable.callbacks.initComplete
		);
	}
}

$(document).ready(function()
{
	$.app.toConsole("health_insurance.js ready", "log");
	
	$.health_insurances.init_table();
	$.health_insurances.init_form();
	
});