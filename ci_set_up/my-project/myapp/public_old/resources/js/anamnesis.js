if (typeof jQuery === "undefined") { 
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * anamnesis object
 */
$.anamnesis = {
	/* anamnesis options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null
};

/**
 * edit anamnesis 
 */
$.anamnesis.edit = function(id)
{
	$.app.toConsole({"fkt":"$.anamnesis.edit", "id":id});

	var params = $("#form_anamnesis").serializeArray();
		params.push({"name":"anamnesis_id", "value":id});
		params.push({"name":"rendermode", "value":"ajax"});

	var target = baseUrl+"admin/anamnesis/edit/"+id;
			
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, $.anamnesis.init_form, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
}

/**
 * save anamnesis 
 */
$.anamnesis.save_anamnesis = function(e)
{
	$.app.toConsole({"fkt":"$.anamnesis.save"});
	
	var params	= $("#form_anamnesis").serializeArray();
		params.push({"name":"rendermode", "value":"json"})
	console.log(params);return;
	$.app.sendAjaxRequest(e.delegateTarget.action, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback save anamnesis ajax", "data":result});
		
		$.app.setFormValidationStates("form_anamnesis", result.error, result.extra, null);
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.dialog.success($.lang.item("done"), $.lang.item("anamnesis_has_been_saved"), function callback()
			{
				$.app.redirect(baseUrl+"admin/anamnesis/");
			});
		}
	}, true, null, $.lang.item("anamnesis_save_progress"));
}

/**
 * remove anamnesis 
 */
$.anamnesis.remove = function(id)
{
	$.app.toConsole({"fkt":"$.anamnesis.remove", "id":id});
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}
	
	var params = [
  		{"name":"anamnesis_id", "value":id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	$.dialog.confirm($.lang.item("msg_are_you_sure"), $.lang.item("anamnesis_sure_delete"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"admin/anamnesis/remove/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("anamnesis_has_been_deleted"), function callback_done(){
						if($.anamnesis !== undefined && $.anamnesis !== null)
						{
							if ($.anamnesis.table !== undefined && $.anamnesis.table !== null)
							{
								$.anamnesis.table.ajax.reload(); // reload the table
							}
						}

					});
				}
			}
		}, true, null, $.lang.item("anamnesis_delete_progress"));
	}, null, $.lang.item("anamnesis_delete"), $.lang.item("cancel"))
		
}

/**
 * initialize form 
 **/
$.anamnesis.init_form = function()
{
	if ($("#form_anamnesis").length > 0)
	{
		$.app.toConsole({"fkt":"$.anamnesis.init_form"});
		
		$.app.init_checked_list_box();
		$.app.init_toggle();
		
		$("#form_anamnesis").submit(function(e) {
	        $.anamnesis.save_anamnesis(e);
	        e.preventDefault();
		});
	}
}

/**
 * initialize table
 **/
$.anamnesis.init_table = function()
{
	if ($("#tbl_anamnesis").length > 0)
	{
		$.app.toConsole({"fkt":"$.anamnesis.init_table"});
		
		var selected_rows = [];
		
		$.anamnesis.table = $.app.datatable.initialize_ajax("tbl_anamnesis", baseUrl+"admin/anamnesis/datatable", tbl_columns_anamnesis, 
			$.app.datatable.callbacks.rowCallback, 
			$.app.datatable.callbacks.initComplete
		);
	}
}

$(document).ready(function()
{
	$.app.toConsole("anamnesis.js ready", "log");
	
	$.anamnesis.init_table();
	$.anamnesis.init_form();
	
});