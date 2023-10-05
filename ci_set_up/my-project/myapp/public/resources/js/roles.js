if (typeof jQuery === 'undefined') { 
	throw new Error('This JavaScript requires jQuery'); 
}

$.roles = {
	/* user options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null
};

/* $.roles.edit = function(id)
{
	alert("in edit")

	//$.app.toConsole({"fkt":"$.roles.edit", "id":id});
	var params = [
  		{"name":"role_id", "value":id},
  		{"name":"rendermode", "value":"ajax"}
  	];

	var target = baseUrl+'edit/'+id;
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.update_browser_url(target);
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item('error'), result.error);
		}
		else{
			$.app.replaceContent(result.data, $.roles.init_form, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item('msg_wait') );
} */

$.roles.edit = function(id) {
    alert("in edit");

    // $.app.toConsole({"fkt":"$.roles.edit", "id":id});
    var params = [
        {"name":"role_id", "value":id},
        {"name":"rendermode", "value":"ajax"}
    ];

    var target = baseUrl + 'edit/' + id;

    $.ajax({
        url: target,
        type: 'POST', // Adjust the HTTP method if needed
        data: params,
        success: function(result) {
            $.app.update_browser_url(target);

            if (result.error && result.error !== "") {
                $.dialog.error($.lang.item('error'), result.error);
            } else {
                $.app.replaceContent(result.data, $.roles.init_form, undefined, target);
                $.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle AJAX error here
            console.error("AJAX error:", textStatus, errorThrown);
        },
        async: true, // Make sure it's asynchronous
        dataType: 'json', // Set the expected response data type
        beforeSend: function() {
            // Display a loading message or spinner if needed
            // $.app.loadingStart();
        },
        complete: function() {
            // Hide the loading message or spinner when the request is complete
            // $.app.loadingEnd();
        }
    });
};


$.roles.save = function(e)
{
	// //$.app.toConsole({"fkt":"$.roles.save"});
		var params	= $('#form_role').serializeArray();
		params.push({"name":"rendermode", "value":"json"})

		$.ajax({
			url: e.delegateTarget.action,
			type: 'POST', // Adjust the HTTP method if needed
			data: params,
			success: function(result) {
				alert("in ajax");
				console.log(result.data);
				$.app.setFormValidationStates("form_role", result.error, result.extra, null);
		
				if (result.error && result.error !== "") {
					alert("in if");
		
					$.dialog.error($.lang.item('error'), result.error);
				} else {
					$.roles.edit(result.data.role.role_id);
					$.app.redirect(baseUrl + "roles");

				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// Handle AJAX error here
				console.error("AJAX error:", textStatus, errorThrown);
			}
		});

}

$.roles.remove = function(id)
{
	//$.app.toConsole({"fkt":"$.roles.remove", "id":id});
	if (id == undefined){
		throw new Error($.lang.item('msg_missing_parameter'));
	}
	
	var params = [
  		{"name":"role_id", "value":id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	// $.dialog.confirm_delete($.lang.item('msg_are_you_sure'), $.lang.item('role_sure_delete'), function callback_yes()
	// {
		alert("result");

		$.ajax({
			url: baseUrl+"remove/", params,
			type: 'POST', // Adjust the HTTP method if needed
			data: params,

			success: function(result) {
				alert("result"+result);
				
		
				if (result.error && result.error !== "") {
					alert("in if");
		
					$.dialog.error($.lang.item('error'), result.error);
				} else {
						if (result.status == "SUCCESS")
						{
							$.roles.table.ajax.reload();
							// $.app.redirect(baseUrl + "roles");
						}
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// Handle AJAX error here
				console.error("AJAX error:", textStatus, errorThrown);
			}
		// });
		/* $.app.sendAjaxRequest(baseUrl+"admin/roles/remove/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item('error'), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.roles.table.ajax.reload(); // reload the table 
					
					$.dialog.success($.lang.item('done'), $.lang.item('role_deleted'), function callback_done(){
						
					});
				}
			}
		}, true, null, $.lang.item('role_delete_progress')); */
	}, null, $.lang.item('role_delete'), $.lang.item('cancel'))

		

		
}

/**
 * initialize form 
 **/
$.roles.init_form = function()
{
	if ($('#form_role').length > 0)
	{
		//$.app.toConsole({"fkt":"$.roles.init_form"});
		$.app.init_checked_list_box();
		$.app.init_toggle();
		
		$('#form_role').on('submit', function(e) {
			alert("in init");
	        $.roles.save(e);
	        e.preventDefault();
		});
		
		if ($('#toggle_all_rights').length > 0 && $(".cb_right").length > 0)
		{
			$('#toggle_all_rights').on('change', function(event){
				$(".cb_right").prop('checked', $(this).prop('checked'));
				$(".cb_right").each(function(){$(this).triggerHandler('change')});
			});
		}
	}
}



/**
 * initialize table
 **/
$.roles.init_table = function()
{
	if ($("#tbl_roles").length > 0)
	{
		//$.app.toConsole({"fkt":"$.roles.init_table"});
		
		var selected_rows = [];
		
		$.roles.table = $.app.datatable.initialize_ajax("tbl_roles", baseUrl+"roles/datatable", tbl_columns_roles, 
			$.app.datatable.callbacks.rowCallback, 
			$.app.datatable.callbacks.initComplete
		);
	}
}

$(function()
{
	//$.app.toConsole("roles.js ready", "log");
	
	$.roles.init_table();
	$.roles.init_form();
	
});

