if (typeof jQuery === "undefined") { 
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * articles object
 */
$.articles = {
	/* articles options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null,
	table_units_convert : null,
	table_article_price : null,
	table_article_inventory : null,
};

/**
 * edit articles 
 */
$.articles.edit = function(id)
{
	$.app.toConsole({"fkt":"$.articles.edit", "id":id});

	var params = $("#form_articles").serializeArray();
		params.push({"name":"article_id", "value":id});
		params.push({"name":"rendermode", "value":"ajax"});

	var target = baseUrl+"admin/articles/edit/"+id;
			
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, $.articles.init_form, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
}

/**
 * save articles 
 */
$.articles.save = function(e)
{
	$.app.toConsole({"fkt":"$.articles.save"});
	
	var params	= $("#form_articles").serializeArray();
		params.push({"name":"rendermode", "value":"json"})
	
	$.app.sendAjaxRequest(e.delegateTarget.action, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback save articles ajax", "data":result});
		
		$.app.setFormValidationStates("form_articles", result.error, result.extra, null);
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.dialog.success($.lang.item("done"), $.lang.item("articles_has_been_saved"), function callback()
			{
				$.app.redirect(baseUrl+"admin/articles/");
			});
		}
	}, true, null, $.lang.item("articles_save_progress"));
}

/**
 * remove articles 
 */
$.articles.remove = function(id)
{
	$.app.toConsole({"fkt":"$.articles.remove", "id":id});
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}
	
	var params = [
  		{"name":"article_id", "value":id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("articles_sure_delete"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"admin/articles/remove/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("articles_has_been_deleted"), function callback_done(){
						if($.articles !== undefined && $.articles !== null)
						{
							if ($.articles.table !== undefined && $.articles.table !== null)
							{
								$.articles.table.ajax.reload(); // reload the table
							}
						}

					});
				}
			}
		}, true, null, $.lang.item("articles_delete_progress"));
	}, null, $.lang.item("articles_delete"), $.lang.item("cancel"))
		
}

$.articles.export_bedarf = function()
{
	//
	var params = [
		{"name":"rendermode", "value":"JSON"}
	];

	var url = baseUrl+"admin/articles/generateReport/";
	$.app.sendAjaxRequest(url, params, function success(result)
	{
		if (result.error != undefined) {
			$.dialog.error($.lang.item("error"), result.error);
		} else {
			var target = baseUrl + "admin/articles/downloadreport/" + result.data.fileB64;

			$.ajax({
				type: 'GET',
				url: target,
				processData: false,
				success: function (data) {
					if (data.error == undefined) {
						window.location = target;
					} else {
						//
					}
				},
				error: function (xhr) {
					$.dialog.error($.lang.item("error"), JSON.stringify(xhr));
				}
			});
		}
	}, true, null, $.lang.item('creating_anamnesis_doc'));

}

/**
 * initialize form 
 **/
$.articles.init_form = function()
{
	if ($("#form_articles").length > 0)
	{
		$.app.toConsole({"fkt":"$.articles.init_form"});
		
		$.app.init_checked_list_box();
		$.app.init_toggle();
		
		$("#form_articles").submit(function(e) {
	        $.articles.save(e);
	        e.preventDefault();
		});
	}

	if($('#bt_return_to_article_overview').length >0)
	{
		$('#bt_return_to_article_overview').on('click', function(){
			$.app.redirect(baseUrl+"admin/articles/");
		});
	}
	if($('#i_article_id').length > 0 && $("#tbl_units_convert").length > 0)
	{
		$.articles.init_table_convert_units();
	}
	if($('#i_article_id').length > 0 && $("#tbl_article_price").length > 0)
	{
		$.articles.init_table_article_price();
	}
	if($('#i_article_id').length > 0 && $("#tbl_article_inventory").length > 0)
	{
		$.articles.init_table_article_inventory();
	}

	if($('#btn_export').length > 0)
	{
		$('#btn_export').on('click', function(){
			$.articles.export_bedarf();
		});
	}
}

/**
 * initialize table
 **/
$.articles.init_table = function()
{
	if ($("#tbl_articles").length > 0)
	{
		$.app.toConsole({"fkt":"$.articles.init_table"});
		
		var selected_rows = [];
		
		$.articles.table = $.app.datatable.initialize_ajax("tbl_articles", baseUrl+"admin/articles/datatable", tbl_columns_articles, 
			$.app.datatable.callbacks.rowCallback, 
			$.app.datatable.callbacks.initComplete
		);
	}
}

$.articles.init_table_convert_units = function()
{
	if ($("#tbl_units_convert").length > 0)
	{
		var article_id = $('#i_article_id').val();
		$.articles.table_units_convert = $.app.datatable.initialize_ajax("tbl_units_convert", baseUrl+"admin/articles/datatable_units_convert/" + article_id, tbl_columns_units_convert,
			$.app.datatable.callbacks.rowCallback,
			$.app.datatable.callbacks.initComplete
		);
	}
}

$.articles.init_table_article_price = function()
{
	if ($("#tbl_article_price").length > 0)
	{
		var options = {
			order: [
				[4, "desc"]
			]
		};

		var article_id = $('#i_article_id').val();
		$.articles.table_article_price = $.app.datatable.initialize_ajax("tbl_article_price", baseUrl+"admin/articles/datatable_arctile_price/" + article_id, tbl_columns_article_price,
			$.app.datatable.callbacks.rowCallback,
			$.app.datatable.callbacks.initComplete,
			options
		);
	}
}

$.articles.init_table_article_inventory = function()
{
	if ($("#tbl_article_inventory").length > 0)
	{
		var options = {

		};

		var article_id = $('#i_article_id').val();
		$.articles.table_article_inventory = $.app.datatable.initialize_ajax("tbl_article_inventory", baseUrl+"admin/articles/datatable_arctile_inventory/" + article_id, tbl_columns_article_inventory,
			$.app.datatable.callbacks.rowCallback,
			$.app.datatable.callbacks.initComplete,
			options
		);
	}
}

$(document).ready(function()
{
	$.app.toConsole("articles.js ready", "log");
	
	$.articles.init_table();
	$.articles.init_form();




});