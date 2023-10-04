if (typeof jQuery === "undefined") { 
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * costcarrier object
 */
$.costcarrier = {
	/* costcarrier options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null
};


/**
 * initialize form 
 **/
$.costcarrier.init_form = function()
{
	
	if ($("#form_costcarrier").length > 0)
	{
		$.app.init_select2();
		$.app.toConsole({"fkt":"$.costcarrier.init_form"});
		if ($("#upload_costcarrier_file").length > 0)
		{
			var target 			= baseUrl+"root/costcarrier/upload_costcarrier_file/";
			var show_buttons 	= true;
			
			var upload_extra = function(){
				return {
					start_doc_upload: 1, 
					sgb_costcarrier_id:$("#i_sgb_costcarrier_id").val()
				};
			};
			//onSuccess(event, data, previewId, index);
			var onSuccess = function(event, data, previewId, index){
				$.app.toConsole({"fkt":"init_fileinput.onSuccess", "data":data});
				if (data.response.data != undefined && data.response.data.start_import)
				{
					$.costcarrier.start_import(data.response.data);
				}
				else
				{
					//fehler, nicht importieren
				}
			};
			//selector, upload_url,  allowedExt, multiple, onSuccess, onError, minFiles, maxFiles, maxSize, upload_extra, initialPreview, showCaption, showPreview, showRemove, showUpload, showCancel, showClose, showUploadedThumbs
			$.app.init_fileinput("#upload_costcarrier_file", target,  ["ke0","ke1","ke2","ke3","ke4","ke5","ke6","ke7","ke8","ke9"], false, onSuccess, null, 1, 1, 10000, upload_extra, undefined, true, false, show_buttons, show_buttons, show_buttons, false, false);
			$("#upload_costcarrier_file").on('filepreajax', function(event, previewId, index) {
				$.app.toConsole({"fkt":'filepreajax', "event":event});
		    });
			
			
			/*
			$("#i_upload_document").fileinput('destroy');
			$("#i_upload_document").fileinput({
				language: $.lang.item('locale_short'),
				allowedFileExtensions: ["pdf"],
			    uploadUrl: target,
			    showClose:false,
			    maxFileCount:1,
			    minFileCount:1,
			    hideThumbnailContent:true,
			    browseOnZoneClick: true
			});
			
			$('#i_upload_document').on('fileerror', function(event, data, msg) {
				$.dialog.error(msg);
			})
			*/
		}
		
		$.costcarrier.init_table_imports();
	}
};

$.costcarrier.init_table_imports = function()
{
	if($('#tbl_costcarrier_imports') != undefined)
	{
		var serverSide = false;
		
		var options = {
			destroy: 'true',
			ajax: baseUrl+ "root/costcarrier/datatable_imports/",
			deferRender: true,
			serverSide: serverSide,
			stateSave: false,
			columnDefs: [
				{  iDataSort: 6, targets: 5 }
			] ,
			order: []
		};
		
		if ($.costcarrier.table_costcarrier_imports != null && $.fn.dataTable.isDataTable('#tbl_costcarrier_imports'))
		{
			$('#tbl_costcarrier_imports').DataTable().clear().destroy();
			$.costcarrier.table_costcarrier_imports = null;
		}
		$.costcarrier.table_costcarrier_imports = $.app.datatable.initialize_ajax("tbl_costcarrier_imports", "", table_columns_imports,
					$.app.datatable.callbacks.rowCallback,
					$.app.datatable.callbacks.rowCallback,
					options
		);	
	
	}
}

$.costcarrier.start_import = function(data)
{
	$.app.toConsole({"fkt":"start_import", "data":data});
	var params = {};
	params = {
		sgb_costcarrier_id:$("#i_sgb_costcarrier_id").val(),
		file_name : data.file,
		filename_original: data.filename_original
	};
	var target 			= baseUrl+"root/costcarrier/import_costcarrier_file/";
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback start_import ajax", "data":result});
		
		
		if (result.error && result.error != "")
		{
			$.dialog.error($.lang.item("error"), result.error);
		}
		else
		{
			$.dialog.success($.lang.item("done"), $.lang.item("costcarriers_has_been_saved"), function callback()
			{
				//$.app.redirect(baseUrl+"root/costcarrier/import_file/");
				$.costcarrier.init_table_imports();
			});
		}
	}, true, null, $.lang.item("import_costcarriers_progress"));
}

$.costcarrier.init_table = function()
{
};


$(document).ready(function()
{
	$.app.toConsole("costcarrier.js ready", "log");
	
	$.costcarrier.init_table();
	$.costcarrier.init_form();
	
});