if (typeof jQuery === "undefined") { 
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * prescriptions object
 */
$.scanagent = {
	max_pol_count: 30,
	poll_wait_time_ms: 1000,
	event_id: null,
	link: null,
	poll_count:0,
	dialog: null,
	poller: null
};

$.scanagent.init = function(){
	
	$('#bt_scanagent').off('click').on('click',function(){
		$.scanagent.requestScan();	
	});
	
	$('#bt_scanagent_bottom').off('click').on('click',function(){
		$.scanagent.requestScan();
	});
	$.app.toConsole("scanagent js functions initialized");
}

$.scanagent.requestScan = function(){
	if(parseInt($('#hidden_scan_prescription').val()) == 1)
	{
		$.scanagent.requestPrescriptionScan();
	}
	else
	{
		if($('#i_doc_type_upload').val() == "")
		{
			$.dialog.error($.lang.item("error"), $.lang.item('missing_document_type'));
		}
		else
		{
			$.scanagent.requestDocumentScan();
		}
	}
}

$.scanagent.requestDocumentScan = function(){
	let params = {
		scanDoc: 1,
		docType: $('#i_doc_type_upload').val()
	};

	$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/request_new_scan",
		params,
		function(result){
			$.app.toConsole({event_id:result.data.event_id,link:result.data.link});
			$.scanagent.event_id = result.data.event_id;
			$.scanagent.link = result.data.link;
			$.scanagent.poll_count = 0;
			$.scanagent.handleLink();
			$.scanagent.poll(1);
			$.scanagent.dialog = $.dialog.info("Warte auf Scanagent","Das Rezeptportal wartet auf Scanner-Daten, bitte warten oder den Vorgang abbrechen.",function(){
				clearTimeout($.scanagent.poller);
				$.scanagent.event_id = null;
				$.scanagent.link = null;
				$.scanagent.poll_count = 0;
				$.scanagent.dialog = null;
				$.scanagent.poller = null;
				$.dialog.info("Scanagent Import !","Der Vorgang wurde abgebrochen und es wurden keine Daten vom Scanner empfangen.");
			},undefined,"Abbrechen",undefined);
		},
		true,
		null,
		$.lang.item("msg_wait"));
}

$.scanagent.requestPrescriptionScan = function(){
	/*
	x1. DB Eintrag machen
	x2. Scanagent Link aufbauen und ausführen
	x3. Poll starten
	x4. Warten auf Daten
	5. Bei Dateneingang, daten laden
	6. Daten verarbeiten
	 */
	let params = {
		scanDoc: 0,
		docType: ""
	};

	$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/request_new_scan",
						params,
						function(result){
							$.app.toConsole({event_id:result.data.event_id,link:result.data.link});
							$.scanagent.event_id = result.data.event_id;
							$.scanagent.link = result.data.link;
							$.scanagent.poll_count = 0;
							$.scanagent.handleLink();
							$.scanagent.poll(0);
							$.scanagent.dialog = $.dialog.info("Warte auf Scanagent","Das Rezeptportal wartet auf Scanner-Daten, bitte warten oder den Vorgang abbrechen.",function(){
								clearTimeout($.scanagent.poller);
								$.scanagent.event_id = null;
								$.scanagent.link = null;
								$.scanagent.poll_count = 0;
								$.scanagent.dialog = null;
								$.scanagent.poller = null;
								$.dialog.info("Scanagent Import !","Der Vorgang wurde abgebrochen und es wurden keine Daten vom Scanner empfangen.");
							},undefined,"Abbrechen",undefined);
						},
					true,
			null,
						$.lang.item("msg_wait"));
}

$.scanagent.handleLink = function()
{
	let handle = window.open($.scanagent.link,'_blank');
	//handle.close();
}

$.scanagent.poll = function(scanDoc)
{
	if(scanDoc == undefined)
	{
		scanDoc = 0;
	}
	if($.scanagent.poll_count<$.scanagent.max_pol_count)
	{
		$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/check_for_scanagent_data",
			{
				event_id: $.scanagent.event_id
			},
			function(result){
				if(result.data.xml != false)
				{
					$('#'+$.scanagent.dialog+'-close').trigger('click');
					$.app.toConsole({poll_count:$.scanagent.poll_count,xml:result.data.xml});
					$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/handle_scanned_data",
						{
							event_id: $.scanagent.event_id,
							scanDoc: scanDoc,
							debitor_id: $('#i_debitor_id').val(),
							docType: $('#i_doc_type_upload').val(),
							prescription_id: $("#hidden_prescription_id").val(),
							docName: $('#i_doc_file_name').val()
						},
						function(result){
							if (result.error && result.error != "")
							{
								$.dialog.error($.lang.item("error"), result.error);
							}
							else
							{
								if(scanDoc == 0)
								{
									if($('#i_debitor_id').val() != undefined && $('#i_debitor_id').val() != null && $('#i_debitor_id').val() != "")
									{
										if(result.data.images.length >= 2)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);

											$("#img_prescription_backside").attr("src", result.data.base64[1]);
											$("#hidden_prescription_backside_filename").val(result.data.images[1]);
											$("#hidden_prescription_backside_filename_original").val(result.data.images[1]);
											$.prescriptions.init_uploader_backside();
											setTimeout(function(){ $('#backside_uploader').find('.file-input-ajax-new > div').eq(2).hide();
											$.prescriptions.ocr_detection();
											},1000);
										}
										else if(result.data.images.length == 1)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide();
											$.prescriptions.ocr_detection();
											},1000);
										}
										$('#'+$.scanagent.dialog+'-close').trigger('click');
										$.app.unblockUI(null);
										$.scanagent.event_id = null;
										$.scanagent.link = null;
										$.scanagent.poll_count = 0;
										$.scanagent.dialog = null;
										$.scanagent.poller = null;
									}
									else
									{
										if(result.data.images.length >= 2)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);

											$("#img_prescription_backside").attr("src", result.data.base64[1]);
											$("#hidden_prescription_backside_filename").val(result.data.images[1]);
											$("#hidden_prescription_backside_filename_original").val(result.data.images[1]);
											$.prescriptions.init_uploader_backside();
											setTimeout(function(){ $('#backside_uploader').find('.file-input-ajax-new > div').eq(2).hide();
											$.prescriptions.ocr_detection();
											},1000);
										}
										else if(result.data.images.length == 1)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide();
											$.prescriptions.ocr_detection();
											},1000);
										}
										$('#'+$.scanagent.dialog+'-close').trigger('click');
										$.app.unblockUI(null);
										$.scanagent.event_id = null;
										$.scanagent.link = null;
										$.scanagent.poll_count = 0;
										$.scanagent.dialog = null;
										$.scanagent.poller = null;
									}
								}
								else
								{
									$.each(result.data.scanned, function(idx,value){
										prescription_attachments.push(value);
									});
									// make array unique
									prescription_attachments = prescription_attachments.filter((v, i, a) => a.indexOf(v) === i);
									$.prescriptions.init_uploader_additionals(function(){
										$('#'+$.scanagent.dialog+'-close').trigger('click');
										$.app.unblockUI(null);
										$.scanagent.event_id = null;
										$.scanagent.link = null;
										$.scanagent.poll_count = 0;
										$.scanagent.dialog = null;
										$.scanagent.poller = null;
									});
								}
							}
						},
						true,
						null,
						$.lang.item("msg_wait"));
				}
				else
				{
					$.scanagent.poll_count++;
					$.scanagent.poller = setTimeout(function(){
						$.scanagent.poll(scanDoc);
					},$.scanagent.poll_wait_time_ms);
				}
			},
			false,
			null,
			"");
	}
	else
	{
		//$.app.toConsole($('#'+$.scanagent.dialog)+'-close');
		$('#'+$.scanagent.dialog+'-close').trigger('click');
		$.app.unblockUI(null);
		$.scanagent.event_id = null;
		$.scanagent.link = null;
		$.scanagent.poll_count = 0;
		$.scanagent.dialog = null;
		$.scanagent.poller = null;
		$.dialog.info("Scanagent Timeout !","Der Scanagent hat keine Daten über den definierten Zeitraum geliefert. Bitte versuchen sie es erneut.");
	}
}

$.scanagent.poll_old = function()
{
	if($.scanagent.poll_count<$.scanagent.max_pol_count)
	{
		$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/check_for_scanagent_data",
			{
				event_id: $.scanagent.event_id
			},
			function(result){
				if(result.data.xml != false)
				{
					$('#'+$.scanagent.dialog+'-close').trigger('click');
					$.app.toConsole({poll_count:$.scanagent.poll_count,xml:result.data.xml});
					$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/handle_scanned_data",
						{
							event_id: $.scanagent.event_id
						},
						function(result){
							if (result.error && result.error != "")
							{
								$.dialog.error($.lang.item("error"), result.error);
							}
							else
							{
								if($('#i_debitor_id').val() != undefined && $('#i_debitor_id').val() != null && $('#i_debitor_id').val() != "")
								{
									$.dialog.show($.lang.item("done"),$.lang.item("ocr_detection_success")+"<hr>"+result.data.ocr_result_table,function callback_done(id_modal){
										$.app.toConsole({fields:result.data.ocr_data,images:result.data.images});
										$.prescriptions.apply_data(result.data.ocr_data, true, true);
										let dataWindow = window.open("",escape("Datenübernahme"),"width=400,height=400");
										$.app.toConsole("<p>Rohdaten der OCR-Erkennung:</p>p><br /><div>"+result.data.ocr_data.all_data+"</div>");
										dataWindow.document.write("<p>Rohdaten der OCR-Erkennung:</p><br /><div>"+result.data.ocr_data.all_data+"</div>");
										if(result.data.images.length >= 2)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);

											$("#img_prescription_backside").attr("src", result.data.base64[1]);
											$("#hidden_prescription_backside_filename").val(result.data.images[1]);
											$("#hidden_prescription_backside_filename_original").val(result.data.images[1]);
											$.prescriptions.init_uploader_backside();
											setTimeout(function(){ $('#backside_uploader').find('.file-input-ajax-new > div').eq(2).hide(); },1000);
										}
										else if(result.data.images.length == 1)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);
										}
										$('#'+$.scanagent.dialog+'-close').trigger('click');
										$.app.unblockUI(null);
										$.scanagent.event_id = null;
										$.scanagent.link = null;
										$.scanagent.poll_count = 0;
										$.scanagent.dialog = null;
										$.scanagent.poller = null;
									}, function callback_abort(){
										if(result.data.images.length >= 2)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);

											$("#img_prescription_backside").attr("src", result.data.base64[1]);
											$("#hidden_prescription_backside_filename").val(result.data.images[1]);
											$("#hidden_prescription_backside_filename_original").val(result.data.images[1]);
											$.prescriptions.init_uploader_backside();
											setTimeout(function(){ $('#backside_uploader').find('.file-input-ajax-new > div').eq(2).hide(); },1000);
										}
										else if(result.data.images.length == 1)
										{
											$("#img_prescription").attr("src", result.data.base64[0]);
											$("#hidden_prescription_filename").val(result.data.images[0]);
											$("#hidden_prescription_filename_original").val(result.data.images[0]);
											$.prescriptions.init_uploader();
											setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);
										}
										$('#'+$.scanagent.dialog+'-close').trigger('click');
										$.app.unblockUI(null);
										$.scanagent.event_id = null;
										$.scanagent.link = null;
										$.scanagent.poll_count = 0;
										$.scanagent.dialog = null;
										$.scanagent.poller = null;
									}, "success", $.lang.item("take_over"), $.lang.item("cancel"), true, "", function on_open(id){
										//$("#"+id+" > .modal-dialog ").addClass("modal-lg");
									});
								}
								else
								{
									$.app.toConsole({fields:result.data.ocr_data,images:result.data.images});
									$.prescriptions.apply_data(result.data.ocr_data, true, true);
									let dataWindow = window.open("",escape("Datenübernahme"),"width=400,height=400");
									$.app.toConsole("<p>Rohdaten der OCR-Erkennung:</p>p><br /><div>"+result.data.ocr_data.all_data+"</div>");
									dataWindow.document.write("<p>Rohdaten der OCR-Erkennung:</p><br /><div>"+result.data.ocr_data.all_data+"</div>");

									if(result.data.images.length >= 2)
									{
										$("#img_prescription").attr("src", result.data.base64[0]);
										$("#hidden_prescription_filename").val(result.data.images[0]);
										$("#hidden_prescription_filename_original").val(result.data.images[0]);
										$.prescriptions.init_uploader();
										setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);

										$("#img_prescription_backside").attr("src", result.data.base64[1]);
										$("#hidden_prescription_backside_filename").val(result.data.images[1]);
										$("#hidden_prescription_backside_filename_original").val(result.data.images[1]);
										$.prescriptions.init_uploader_backside();
										setTimeout(function(){ $('#backside_uploader').find('.file-input-ajax-new > div').eq(2).hide(); },1000);
									}
									else if(result.data.images.length == 1)
									{
										$("#img_prescription").attr("src", result.data.base64[0]);
										$("#hidden_prescription_filename").val(result.data.images[0]);
										$("#hidden_prescription_filename_original").val(result.data.images[0]);
										$.prescriptions.init_uploader();
										setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);
									}
									$('#'+$.scanagent.dialog+'-close').trigger('click');
									$.app.unblockUI(null);
									$.scanagent.event_id = null;
									$.scanagent.link = null;
									$.scanagent.poll_count = 0;
									$.scanagent.dialog = null;
									$.scanagent.poller = null;
								}
							}
						},
						true,
						null,
						$.lang.item("msg_wait"));
				}
				else
				{
					$.scanagent.poll_count++;
					$.scanagent.poller = setTimeout(function(){
						$.scanagent.poll();
					},$.scanagent.poll_wait_time_ms);
				}
			},
			false,
			null,
			"");
	}
	else
	{
		//$.app.toConsole($('#'+$.scanagent.dialog)+'-close');
		$('#'+$.scanagent.dialog+'-close').trigger('click');
		$.app.unblockUI(null);
		$.scanagent.event_id = null;
		$.scanagent.link = null;
		$.scanagent.poll_count = 0;
		$.scanagent.dialog = null;
		$.scanagent.poller = null;
		$.dialog.info("Scanagent Timeout !","Der Scanagent hat keine Daten über den definierten Zeitraum geliefert. Bitte versuchen sie es erneut.");
	}
}

$.scanagent.requestScan_old = function(){
	var i;
	var initialPreview = undefined;
	$.app.sendAjaxRequest(baseUrl+"admin/prescriptions/negotiate_with_scanagent",
						  {
							 prescription_id: $("#hidden_prescription_id").val()
						  },
						  function(result){
					        if (result.error && result.error != "")
					        {
					            $.dialog.error($.lang.item("error"), result.error);
					        } 
							else
					        {
								$.app.toConsole({fields:result.data.ocr_data,images:result.data.images});
								$.prescriptions.apply_data(result.data.ocr_data, true, true);
								
								if(result.data.images.length == 2)
								{
									$("#img_prescription").attr("src", result.data.base64[0]);
									$("#hidden_prescription_filename").val(result.data.images[0]);
									$("#hidden_prescription_filename_original").val(result.data.images[0]);									
									$.prescriptions.init_uploader();
									setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);	

									$("#img_prescription_backside").attr("src", result.data.base64[1]);
									$("#hidden_prescription_backside_filename").val(result.data.images[1]);
									$("#hidden_prescription_backside_filename_original").val(result.data.images[1]);									
									$.prescriptions.init_uploader_backside();
									setTimeout(function(){ $('#backside_uploader').find('.file-input-ajax-new > div').eq(2).hide(); },1000);
								}
								else if(result.data.images.length == 1)
								{
									$("#img_prescription").attr("src", result.data.base64[0]);
									$("#hidden_prescription_filename").val(result.data.images[0]);
									$("#hidden_prescription_filename_original").val(result.data.images[0]);									
									$.prescriptions.init_uploader();
									setTimeout(function(){ $('#upload-prescription').find('.file-input-ajax-new > div').eq(2).hide(); },1000);									
								}
								
					        }
					      },
						  true,
						  null, 
						  $.lang.item("msg_wait"));
}

$(document).ready(function()
{
	$.app.toConsole("scanagent.js ready", "log");
	
	$.scanagent.init();
	
});