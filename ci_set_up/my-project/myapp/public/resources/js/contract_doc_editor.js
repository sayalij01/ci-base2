if (typeof jQuery === "undefined") { 
	throw new Error("This JavaScript requires jQuery"); 
}

$.contract_doc_editor = {
		currPage: 1,
		numPages: 0,
		thePDF: null,
		stages: [],
		layers: [],
               
    table_global_documents:null
};

/**
 * open document editor with preselected document identified by id
 * @access public
 * @param int id
 */
$.contract_doc_editor.edit_doc = function(id)
{
	$.app.toConsole({"fkt":"$.contract_doc_editor.edit_doc", "id":id});
	
	$('#upload_and_uploaded').hide();
	$('#document_editor').show();
	
	$.contract_doc_editor.currPage = 1;
	$.contract_doc_editor.numPages = 0;
	$.contract_doc_editor.thePDF = null;
	$.contract_doc_editor.stages = [];
	$.contract_doc_editor.layers = [];	
	$.contract_doc_editor.init_doc_editor(id,$.contract_doc_editor.init_pdf_preview);	
}

/**
 * return to document selection
 * @access public
 */
$.contract_doc_editor.back_to_docs = function()
{
	$.app.toConsole({"fkt":"$.contract_doc_editor.back_to_docs", "id":null});
	
	$('#upload_and_uploaded').show();
	$('#document_editor').hide();
	$('#document_editor > div').eq(0).remove();
	$('#btn_return').off('click');
	$('#btn_save').off('click');
	$('#btn_delete_all').off('click');
	$('#btn_filter').off('click');
	$('#btn_filter_clear').off('click');
	$('#placeholder_filter').off('keypress');
}


/**
 * initialize doc editor and initialized with given id
 * @access public
 * @param int id
 */
$.contract_doc_editor.init_doc_editor = function(id,callback)
{
	$.app.toConsole({"fkt":"$.contract_doc_editor.init_doc_editor", "id":id});
	
	$('#document_editor').html("");
	$.app.sendAjaxRequest(baseUrl+"root/Contracts_editor/initdoceditor", 
						  {
							id:id,
							rendermode:"JSON"
						  },
						  function success(result)
						  {
								$.app.toConsole({"fkt":"callback $.contract_doc_editor.init_doc_editor", "data":result});
								if (result.error && result.error != "")
								{
									$.dialog.error($.lang.item("error"), result.error);
								}
								else
								{
									$('#document_editor').html(result.data.html);
									$('#btn_return').on('click',$.contract_doc_editor.back_to_docs);
									$('#btn_save').on('click', $.contract_doc_editor.save_doc_setup);
									$('#btn_delete_all').on('click', $.contract_doc_editor.delete_doc_setup);
									$('#placeholder_filter').on('keypress',$.contract_doc_editor.filter_keypress_handler);
									$('#btn_filter').on('click',$.contract_doc_editor.filter_button_click_handler);
									$('#btn_filter_clear').on('click',$.contract_doc_editor.clear_filter_handler);
									
									$.contract_doc_editor.get_doc_setup(id,callback);
								}
						  }, 
						  true, 
						  null, 
						  $.lang.item("init_doc_editor"));	
}

$.contract_doc_editor.filter_keypress_handler = function(e){
	var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
    	$('#btn_filter').trigger('click');
    	e.stopPropagation();
    }
}

$.contract_doc_editor.init_pdf_preview = function(id,result,callback)
{
	$.app.toConsole({"fkt":"$.contract_doc_editor.init_pdf_preview", "documentData":documentData});
	
	var url = documentData.url + documentData.filename;
	
	$.app.toConsole({"fkt":"$.contract_doc_editor.init_pdf_preview", "pdfjsLib":pdfjsLib});
	
	pdfjsLib.GlobalWorkerOptions.workerSrc = baseUrl +"resources/cdn/pdf-js/pdf.worker.js"

	$.app.toConsole({"fkt":"$.contract_doc_editor.init_pdf_preview", "docData":documentData.docDataB64});
	
	var loadingTask = pdfjsLib.getDocument({data: atob(documentData.docDataB64)});
	loadingTask.promise.then(function(pdf){
		
		$.contract_doc_editor.thePDF = pdf;
		
		$.contract_doc_editor.numPages = pdf.numPages;
		
		for(var i=0;i<$.contract_doc_editor.numPages;i++)
		{
			var page = $('<div id="canvas_holder_'+(i+1)+'" style="width:595px;height:841px;position:relative;z-index:997;"></div>');
			$('#canvas_holder').append(page);
			var canvas = $('<canvas class="canvas_area" id="canvas_page_'+(i+1)+'" style="position:absolute;z-index:998;" />');
			$(page).append( canvas );			
			var div = $('<div class="drop_area" id="div_page_'+(i+1)+'" myCanvas="canvas_page_'+(i+1)+'" style="width:595px;height:841px;border:1px solid black;position:absolute;z-index:999;"></div>');
			$(page).append(div);
			$('#canvas_holder').append($('<br />'));
		}
		pdf.getPage(1).then($.contract_doc_editor.handle_pages).then($.contract_doc_editor.init_placeholders).then(function(){
			if(result.extra.num_rows >0)
			{
				var item;
				for(var j=0;j<result.extra.num_rows;j++)
				{
					var d = result.data[j];
					$('#drag-items > div').each(function(){
						if($(this).attr('id') == d.placeholder)
						{
							item = $(this).clone().addClass('dropped').attr('field',$(this).attr('id')).removeAttr('id').draggable();
							$(item).css({'position': 'absolute', 'left': d.posX + 'px', 'top': d.posY + 'px','border':'none','padding':0,'margin':0})
							$(item).css({'font-size': d.fontsize+'px'});
							switch(d.fontfamily)
							{
								case "Arial":
									$(item).css('font-family',"Arial,Helvetica Neue,Helvetica,sans-serif");
									$(item).attr('fontfamily',"Arial");
									break;
								case "Calibri":
									$(item).css('font-family',"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif");
									$(item).attr('fontfamily',"Calibri");
									break;
								case "Tahoma":
									$(item).css('font-family',"Tahoma,Verdana,Segoe,sans-serif");
									$(item).attr('fontfamily',"Tahoma");
									break;
								case "Times New Roman":
									$(item).css('font-family',"TimesNewRoman,Times New Roman,Times,Baskerville,Georgia,serif");
									$(item).attr('fontfamily',"Times New Roman");							
							}
							switch(d.fontstyle)
							{
								case "bold":
									$(item).css('font-weight',"bold");
									$(item).attr("fontstyle","bold");
									break;
								case "italic":
									$(item).css('font-style',"italic");
									$(item).attr("fontstyle","italic");		
									break;
								case "underline":
									$(item).css("font-decoration","underline");
									$(item).attr("fontstyle","underline");
							}
							$(item).html($(item).attr('altText'));
							if($(item).attr('field').indexOf("bool") != -1)
							{
								$(item).html("X&nbsp;<sup style=\"color:red;\">"+$(item).attr("countId")+"</sup>");
							}							
							$('.drop_area').eq(d.page-1).append($(item));
						}
					});
				}
			}			
		}).then($.contract_doc_editor.validate_doc_setup).then(function(){
			if(callback != undefined && typeof callback == "function")
			{
				callback();
			}			
		});
	});
}

$.contract_doc_editor.init_placeholders = function(callback)
{
	$('.placeholder_draggable').draggable({
		helper: function(e,ui){
			var clone = $(this).clone(true);
			return clone; 
		}
	});
	$('.drop_area').droppable({
		drop: function(e, ui) {
			var parentOffset = $(this).offset();
			var canvas = document.getElementById($(this).attr('id'));
			let rect = canvas.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;
			
			if(!ui.draggable.hasClass("dropped"))
			{
				var item = $(ui.draggable).clone().attr('field',$(ui.draggable).attr('id')).removeAttr('id').draggable().addClass("dropped").css({'position': 'absolute', 'left': x + 'px', 'top': y + 'px','border':'none','padding':0,'margin':0});
				$.app.toConsole($(item).html());
				$(item).html($(item).attr('altText'));
				if($(item).attr('field').indexOf("bool") != -1)
				{
					$(item).html("X&nbsp;<sup style=\"color:red;\">"+$(item).attr("countId")+"</sup>");
				}
				$(this).append($(item));
			}
			$.contract_doc_editor.validate_doc_setup();
        }
	});
	$.contextMenu({
		selector: '.placeholder_draggable',
		callback: function(key, option)
		{
			$.app.toConsole("contextMenu clicked:" + key);
			$.contract_doc_editor.handle_context_menu(key, option, $(this), $.contract_doc_editor.validate_doc_setup );
		},
		items:{
			'remove': {name: $.lang.language.removeBtn, 
					   icon: "delete", 
					   disabled: function() { return !$(this).hasClass("dropped"); }},
			'fontsize': {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß"), 
						 icon: "", 
						 disabled: function() { return !$(this).hasClass("dropped"); }, 
						 items:{
							 "fontsize8": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 8"},
							 "fontsize9": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 9"},
							 "fontsize10": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 10"},
							 "fontsize11": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 11"},
							 "fontsize12": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 12"},
							 "fontsize13": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 13"},
							 "fontsize14": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 14"},
							 "fontsize15": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 15"},
							 "fontsize16": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 16"},
							 "fontsize17": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 17"},
							 "fontsize18": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 18"},
							 "fontsize19": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 19"},
							 "fontsize20": {name: $.lang.language.fontsize.replace("&ouml;","ö").replace("&szlig;","ß")+" 20"}
						 }},
			'fontface': {name: $.lang.language.fontfamily,
						 icon: "",
						 disabled: function() { return !$(this).hasClass("dropped"); }, 
						 items:{
							 "fontfamilyarial": {name: "Arial"},
							 "fontfamilycourier": {name: "Courier"},
							 "fontfamilytimes": {name: "Times New Roman"}
						 }},
			'fontstyle': {name: $.lang.language.fontStyle,
						  icon: "",
						  disabled: function(){ return !$(this).hasClass("dropped"); },
						  items:{
							  "fontstylebold": {name: $.lang.language.bold},
							  "fontstyleitalic": {name: $.lang.language.italic},
							//  "fontstyleunderline": {name: $.lang.language.underline},
							  "fontstylenone": {name: $.lang.language.none}
						  }}},
		zIndex:1100
	});
	$.contract_doc_editor.validate_doc_setup();
}

$.contract_doc_editor.handle_pages = function(page)
{
	var viewport = page.getViewport(1);
	
	var canvas = document.getElementById('canvas_page_'+$.contract_doc_editor.currPage);
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({canvasContext: context, viewport: viewport});

    $.contract_doc_editor.currPage++;
    if ( $.contract_doc_editor.thePDF !== null && $.contract_doc_editor.currPage <= $.contract_doc_editor.numPages )
    {
    	$.contract_doc_editor.thePDF.getPage( $.contract_doc_editor.currPage ).then($.contract_doc_editor.handle_pages);
    }		
}

$.contract_doc_editor.handle_context_menu = function(key, option, object, callback)
{
	$.app.toConsole(object);
	switch(key)
	{
	case "remove":
		$(object).remove();
		break;
	case "fontsize8":
	case "fontsize9":
	case "fontsize10":
	case "fontsize11":
	case "fontsize12":
	case "fontsize13":
	case "fontsize14":
	case "fontsize15":
	case "fontsize16":
	case "fontsize17":
	case "fontsize18":
	case "fontsize19":
	case "fontsize20":
		var size = parseInt(key.replace("fontsize",""));
		if(size == undefined || size == null || isNaN == size)
		{
			size = 14;
		}
		$(object).css('font-size',size);
		break;
	case "fontfamilyarial":
		$(object).css('font-family',"Arial,Helvetica Neue,Helvetica,sans-serif");
		$(object).attr('fontfamily',"Arial");
		break;
	case "fontfamilycourier":
		$(object).css('font-family',"Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace");
		$(object).attr('fontfamily',"Courier");
		break;
	case "fontfamilytimes":
		$(object).css('font-family',"TimesNewRoman,Times New Roman,Times,Baskerville,Georgia,serif");
		$(object).attr('fontfamily',"Times New Roman");
		break;
	case "fontstylebold":
		$(object).css("font-decoration","");
		$(object).css('font-style',"");
		$(object).css('font-weight',"bold");
		$(object).attr("fontstyle","bold");
		break;
	case "fontstyleitalic":
		$(object).css("font-decoration","");		
		$(object).css('font-style',"italic");
		$(object).css('font-weight',"");
		$(object).attr("fontstyle","italic");		
		break;
	case "fontstyleunderline":
		$(object).css("font-decoration","underline");
		$(object).css('font-style',"");
		$(object).css('font-weight',"");		
		$(object).attr("fontstyle","underline");
		break;
	case "fontstylenone":
		$(object).css("font-decoration","");
		$(object).css('font-style',"");
		$(object).css('font-weight',"");		
		$(object).attr("fontstyle","");		
		break;
	}
	if(callback != undefined && typeof callback == "function")
	{
		callback();
	}	
}

$.contract_doc_editor.validate_doc_setup = function(){
	var item_count = 0
	$('.drop_area').each(function(){
		$(this).find('.dropped').each(function(){

			item_count++;
		});
	});
	if(item_count>0)
	{
		$('#btn_save').removeAttr("disabled");
	}
	else
	{
		$('#btn_save').attr("disabled","disabled");
	}
}

$.contract_doc_editor.save_doc_setup = function(){
	var saveData = {
						rendermode: 'JSON',
						client_id: documentData.client_id,
						contract_id: documentData.contract_id,
						contract_revision: documentData.contract_revision,
						document_id: documentData.document_id,
						document_type: documentData.document_type,
						filename_original: documentData.filename_original,
						filename: documentData.filename,
						custom_document_name: documentData.custom_document_name,
						placeholders: []
					};
	$('.drop_area').each(function(){
		var page = $(this).attr('id').replace('div_page_','');
		$(this).find('.dropped').each(function(){
			var placeholder = {
				page: page,
				field: $(this).attr('field'),
				fontsize: $(this).css('font-size').replace('px',''),
				fontfamily: $(this).attr('fontfamily'),
                                                                        fontstyle:$(this).attr('fontstyle'),
				top: $(this).css('top').replace('px',''),
				left: $(this).css('left').replace('px','')
			};
			saveData.placeholders.push(placeholder);
		});
	});
	$.app.toConsole(saveData);
	$.app.sendAjaxRequest(baseUrl+"root/Contracts_editor/savedocsetup", 
			  saveData,
			  function success(result)
			  {
			        $.dialog.success($.lang.item("done"), $.lang.item("doc_setup_saved"), function callback()
			        {

			        });					
			  }, 
			  true, 
			  null, 
			  $.lang.item("save_doc_setup"));	
}

$.contract_doc_editor.delete_doc_setup = function(){
	var deleteData = {
			rendermode: 'JSON',
			client_id: documentData.client_id,
			contract_id: documentData.contract_id,
			contract_revision: documentData.contract_revision,
			document_id: documentData.document_id,
			document_type: documentData.document_type
		};
	$('.drop_area').each(function(){
		$(this).find('.dropped').each(function(){
			$(this).remove();
		});
	});
	$.app.toConsole(deleteData);
	$.app.sendAjaxRequest(baseUrl+"root/Contracts_editor/deletedocsetup", 
			  deleteData,
			  function success(result)
			  {
			        $.dialog.success($.lang.item("done"), $.lang.item("doc_setup_deleted"), function callback()
			        {

			        });					
			  }, 
			  true, 
			  null, 
			  $.lang.item("delete_doc_setup"));	
}

$.contract_doc_editor.get_doc_setup = function(id,callback){
		var docSetupData = {
			rendermode: 'JSON',
			client_id: documentData.client_id,
			contract_id: documentData.contract_id,
			contract_revision: documentData.contract_revision,
			document_id: documentData.document_id,
			document_type: documentData.document_type
		};
		$.app.toConsole(docSetupData);
		$.app.sendAjaxRequest(baseUrl+"root/Contracts_editor/getdocsetup", 
				  docSetupData,
				  function success(result)
				  {
					$.app.toConsole(result);
					if(callback != undefined && typeof callback == "function")
					{
						callback(id,result);
					}					
				  }, 
				  true, 
				  null, 
				  $.lang.item("get_doc_setup"));		
}

$.contract_doc_editor.clear_filter_handler = function(e){
	$('#placeholder_filter').val('');
	$('#btn_filter').trigger('click');
}

$.contract_doc_editor.filter_button_click_handler = function(e){
	var filter = $('#placeholder_filter').val().toLowerCase();
	$.app.toConsole({filter:filter});
	if(filter != "")
	{
		$('.placeholder_draggable').each(function(){
			$.app.toConsole({text:$(this).html(), filter:filter, match: $(this).html().indexOf(filter)});
			if(!$(this).hasClass('dropped'))
			{
				if($(this).html().toLowerCase().indexOf(filter) == -1)
				{
					$(this).hide();
				}
				else
				{
					$(this).show();
				}
			}
		});
	}
	else
	{
		$('.placeholder_draggable').each(function(){
			if(!$(this).hasClass('dropped'))
			{
				$(this).show();
			}
		});
	}
}
$.contract_doc_editor.init_filter_global_documents = function ()
{
    $('button[name=filter_assignments_global_documents]').each(function ()
    {
        $(this).on("click", function (e)
        {
            $('button[name=filter_assignments_global_documents]').removeClass("active");
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
                $.contract.table_global_documents.column(column).search(search).draw();
            });
        });
    });

    $('#i_document_type_filter').on('change', function ()
    {
        var search = "";
        if ($(this).val() != "ALL") {
            search = $("select[name=document_type_filter] option:selected").text();
        }
        $.contract.table_global_documents.column(5).search(search).draw();
    });
};

$.contract_doc_editor.init_table_global_documents = function (contract_id, contract_revision)
{
    if (contract_id != "" && $('#tbl_contract_global_documents').length >0)
    {
        var target = baseUrl + "root/contracts/datatable_documents/" + contract_id;
        var options = {
            rowId: 'document_id',
            destroy: 'true',
            deferRender: true,
            serverSide: false,
            order: [
                [4, "asc"]
            ]
        };

        $.contract.table_global_documents = $.app.datatable.initialize_ajax("tbl_contract_global_documents", target, tbl_columns_documents,
                $.app.datatable.callbacks.rowCallback,
                $.app.datatable.callbacks.initComplete,
                options
                );
    } else {
        // save contract before
    }
};
$.contract_doc_editor.init_global_docs = function()
{
    $.app.toConsole("initializing upload document");
    if ($("#i_upload_global_document").length > 0)
    {
        var target = baseUrl + "root/contracts/upload_contract_document/";
        var show_buttons = true;

        if ($("#i_contract_id").val() != "")
        {
            var on_success = function () {
                if($('#tbl_contract_global_documents').length >0)
                {
                    $.contract.table_global_documents.ajax.reload(); // reload the table 
                }
                 if($('#tbl_contract_documents').length >0)
                {
                   $.contract.table_documents.ajax.reload(); // reload the table 
                }
               
            }

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
            $.app.init_fileinput("#i_upload_global_document", target, ["pdf","jpg"], false, on_success, null, 1, 1, 40000, upload_extra, undefined, true, true, show_buttons, show_buttons, show_buttons, false, false);

            $('#i_upload_global_document').on('filecustomerror', function (event, params) {
                // params.abortData will contain the additional abort data passed
                // params.abortMessage will contain the aborted error message passed
                $.app.toConsole({"fkt": "filecustomerror", "event": event, "params": params});
            });

            $('#i_upload_global_document').on('filebatchpreupload', function (event, data, previewId, index, jqXHR)
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
    }
    // Tabellen am Schluss sinitialisieren
    $.contract_doc_editor.init_table_global_documents($("#i_contract_id_docs").val(), $("#i_contract_revision_docs").val());
    $.contract_doc_editor.init_filter_global_documents();
}