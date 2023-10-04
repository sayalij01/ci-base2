if (typeof jQuery === "undefined") {
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * order object
 */
$.orders = {
	/* order options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null,
	child_row_contents : [],
	table_article : null,
	table_preview: null,
	table_order_article: null,
	table_order_article_subsequent_delivery : null,
	table_order_sent_subsequent_delivery : null,
	
	debitor_delivery_accounts:{},
	deliveryAccountCustomValues:{},
	debitor_billing_accounts: {},

	initialized: false,
	USE_ALL_MONTH_FOR_START_DELIVERY: true
};

/**
 * edit order 
 */
$.orders.edit = function(id)
{
	localStorage.removeItem('prescription_selected_before');
	$.app.toConsole({"fkt":"$.orders.edit", "id":id});

	let params = $("#form_order").serializeArray();
		params.push({"name":"order_id", "value":id});
		params.push({"name":"rendermode", "value":"ajax"});

	let target = baseUrl+"admin/orders/edit/"+id;

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, () => {
				$.orders.init_form();
			}, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
};


/**
 * preview order
 */
$.orders.order_preview = function(id, fromDebitor)
{
	$.app.toConsole({"fkt":"$.orders.order_preview", "id":id});
	
	var params = [
		{"name":"order_id", "value":id},
		{"name":"rendermode", "value":"ajax"}
	];
	
	var target = baseUrl+"admin/orders/preview/"+id;
	
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, function(ev) {
					$.orders.init_form();

					if(fromDebitor == 1 && $('#debitor-orders-form').length > 0) {
						$('#bt_back_order, #bt_back_order_bottom').show();
						$('#debitor-orders-tabs a[href="#debitor-orders-form"]').tab('show');
						$('#bt_back_order, #bt_back_order_bottom').off("click").on("click", function () {
							$('#debitor-orders-tabs a[href="#debitor-orders-list"]').tab('show');
							$('#debitor-orders-form').html("");
						});
					}
					else {
						//$('#bt_back_order, #bt_back_order_bottom').show();
						$('#bt_back_order, #bt_back_order_bottom').hide();
					}

				}
				//, undefined, target);
				, (fromDebitor == 1 && $('#debitor-orders-form').length > 0 ? "debitor-orders-form" : null), target);
			//$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
};

/**
 * send subsequent delivery
 */
$.orders.send_subsequent_delivery = function (id)
{
	$.app.toConsole({"fkt":"$.orders.send_subsequent_delivery", "id":id});

	let loader_lang_id = "order_subsequent_delivery_send_progress";
	let finished_lang_id = "order_subsequent_delivery_has_been_sent";

	let debitor_id = $("#i_order_debitor_id").val();
	let order_parent = $("#i_order_parent").val();
	let subsequent_delivery = $('input[name="subsequent_delivery"]').val();

	let params = $("#form_subsequent_delivery").serializeArray();
	params.push({"name":"order_id", "value":id});
	params.push({"name":"order_parent", "value":order_parent});
	params.push({"name":"debitor_id", "value":debitor_id});
	params.push({"name":"save", "value":1});
	params.push({"name":"subsequent_delivery", "value":subsequent_delivery});
	params.push({"name":"rendermode", "value":"ajax"});

	let selected_articles 	= [];
	$("#tbl_order_articles_subsequent_delivery tbody tr").each(function(){
		let line_amount = $(this).find('.article-line-amount').length > 0 ? $(this).find('.article-line-amount').val() : '';
		selected_articles.push( {
			"article_id":$(this).attr("id"),
			"article_name":($(this).find('.article-name').text()),
			"article_number":$(this).find('.article-number').text(),
			"amount":$(this).find('.article-amount').val(),
			"unit_price":$(this).find('.article-price').autoNumeric("get"),
			"charges_apply":$(this).find('.article-charges-apply').is(':checked') ? 1 : 0,
			"unit_id":$(this).find('.article-unit-id').val(),
			"is_from_prescription":$(this).find('.article-is-prescription-flatrate-or-article').val() ? $(this).find('.article-is-prescription-flatrate-or-article').val() : 0,
			"is_additional_payment":$(this).find('.article-charges-apply').is(":checked") ? 1 : 0,
			"additional_amount":$(this).find('.article-additional-amount').length > 0 ? $(this).find('.article-additional-amount').autoNumeric("get") : 0,
			"supplier_key":$(this).find('.article-supplier-key').val(),
			"adjuvant_id":$(this).find('.article-adjuvant_id').length > 0 ? $(this).find('.article-adjuvant_id').val() : '',
			"copayment_amount":$(this).find('.article-copayment-amount').length > 0 ? $(this).find('.article-copayment-amount').val() : '',
			//"line_amount":$(this).find('.article-line-amount').length > 0 ? $(this).find('.article-line-amount').val() : '',
			"line_amount": line_amount,
		});
	});
	params.push({"name": "selected_articles", "value": JSON.stringify(selected_articles) });

	let target = baseUrl+"admin/orders/create_subsequent_delivery/"+id;

	if(selected_articles.length == 0)
	{
		$.dialog.error($.lang.item("no_articles_added"), result.error);
		return;
	}

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			let order_id = $("#i_order_id").val();
			if (order_id == "") {
				order_id = result.extra.order_id;
			}
			let debitor_id = $("#i_order_debitor_id").val();

			//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

			$.dialog.success($.lang.item("done"), $.lang.item(finished_lang_id), function callback() {

				// When this element is visible, we are in the global context.
				// Otherwise this script runs in debitor context
				if ($("#fi_order_debitor_id").is(":visible")) {
					$.app.redirect(baseUrl + "admin/orders/");
				} else {
					$('#debitor-orders-tabs a[href="#debitor-orders-list"]').tab('show');
					//$.debitors.init_table_debitor_orders($("#i_debitor_id").val());
					$.debitors.init_table_debitor_parent_orders($("#i_debitor_id").val());
				}
				$('#bt_order_now_order').prop('disabled', false);

				if ($.orders !== undefined && $.orders !== null) {
					if ($.orders.table != undefined && $.orders.table !== null) {
						//$.orders.table.ajax.reload(); // reload the table
						$.orders.child_row_contents = [];
					}
				}

				if ($.debitors !== undefined && $.debitors !== null) {
					if ($.debitors.table_debitor_orders != undefined && $.debitors.table_debitor_orders !== null) {
						//$.debitors.table_debitor_orders.ajax.reload();
						$.orders.child_row_contents = [];
					}
				}

				$.debitors.init_tabs_from_prescription();
			});
			/*
			$.app.replaceContent(result.data, () => {
				$.orders.init_form();
			}, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
			 */
		}
	}, true, null, $.lang.item(loader_lang_id) );
}

/**
 * create subsequent delivery
 */
$.orders.create_subsequent_delivery = function(id)
{
	//localStorage.removeItem('prescription_selected_before');
	$.app.toConsole({"fkt":"$.orders.create_subsequent_delivery", "id":id});

	let order_parent = $("#i_order_parent").val();

	let params = $("#form_order").serializeArray();
	params.push({"name":"order_id", "value":id});
	params.push({"name":"order_parent", "value":order_parent});
	params.push({"name":"rendermode", "value":"ajax"});

	let selected_articles 	= [];
	$("#tbl_order_articles_subsequent_delivery tbody tr").each(function(){
		let line_amount = $(this).find('.article-line-amount').length > 0 ? $(this).find('.article-line-amount').val() : '';
		selected_articles.push( {
			"article_id":$(this).attr("id"),
			"article_name":($(this).find('.article-name').text()),
			"article_number":$(this).find('.article-number').text(),
			"amount":$(this).find('.article-amount').val(),
			"unit_price":$(this).find('.article-price').autoNumeric("get"),
			"charges_apply":$(this).find('.article-charges-apply').is(':checked') ? 1 : 0,
			"unit_id":$(this).find('.article-unit-id').val(),
			"is_from_prescription":$(this).find('.article-is-prescription-flatrate-or-article').val() ? $(this).find('.article-is-prescription-flatrate-or-article').val() : 0,
			"is_additional_payment":$(this).find('.article-charges-apply').is(":checked") ? 1 : 0,
			"additional_amount":$(this).find('.article-additional-amount').length > 0 ? $(this).find('.article-additional-amount').autoNumeric("get") : 0,
			"supplier_key":$(this).find('.article-supplier-key').val(),
			"adjuvant_id":$(this).find('.article-adjuvant_id').length > 0 ? $(this).find('.article-adjuvant_id').val() : '',
			"copayment_amount":$(this).find('.article-copayment-amount').length > 0 ? $(this).find('.article-copayment-amount').val() : '',
			//"line_amount":$(this).find('.article-line-amount').length > 0 ? $(this).find('.article-line-amount').val() : '',
			"line_amount": line_amount,
		});
	});
	params.push({"name": "selected_articles", "value": JSON.stringify(selected_articles) });

	let target = baseUrl+"admin/orders/create_subsequent_delivery/"+id;

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, () => {
				$.orders.init_form();
			}, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
		}
	}, true, null, $.lang.item("msg_wait") );
}

function buildEditPreviewChangesParam()
{
	edit_preview_changes = {};

	$('#form_order_preview input').each(function (k, e) {
		let name = $(e).attr("id");
		if(name == undefined || name == null || name == false || name == "")
		{
			return;
		}
		let reg = /^i_change_copayment_([\d_]+)$/;
		let matches = name.match(reg);
		if(matches && matches[1])
		{
			let order_id = matches[1];
			if(!edit_preview_changes.hasOwnProperty(order_id))
			{
				edit_preview_changes[order_id] = {};
			}

			edit_preview_changes[order_id]["change_copayment"] = !$(e).is(':checked');
		}

		matches = name.match(/^i_change_articles_([\d_]+)$/);
		if(matches && matches[1])
		{
			let order_id = matches[1];
			if(!edit_preview_changes.hasOwnProperty(order_id))
			{
				edit_preview_changes[order_id] = {};
			}

			edit_preview_changes[order_id]["change_articles"] = !$(e).is(':checked');
		}

		matches = name.match(/^i_change_delivery_([\d_]+)$/);
		if(matches && matches[1])
		{
			let order_id = matches[1];
			if(!edit_preview_changes.hasOwnProperty(order_id))
			{
				edit_preview_changes[order_id] = {};
			}
			edit_preview_changes[order_id]["change_delivery"] = !$(e).is(':checked');
		}

		matches = name.match(/^i_change_supply_from_([\d_]+)$/);
		if(matches && matches[1])
		{
			let order_id = matches[1];
			if(!edit_preview_changes.hasOwnProperty(order_id))
			{
				edit_preview_changes[order_id] = {};
			}
			edit_preview_changes[order_id]["change_supply_from"] = !$(e).is(':checked');
		}

		matches = name.match(/^i_change_supply_to_([\d_]+)$/);
		if(matches && matches[1])
		{
			let order_id = matches[1];
			if(!edit_preview_changes.hasOwnProperty(order_id))
			{
				edit_preview_changes[order_id] = {};
			}
			edit_preview_changes[order_id]["change_supply_to"] = !$(e).is(':checked');
		}

		matches = name.match(/^i_change_delivery_date_([\d_]+)$/);
		if(matches && matches[1])
		{
			let order_id = matches[1];
			if(!edit_preview_changes.hasOwnProperty(order_id))
			{
				edit_preview_changes[order_id] = {};
			}
			edit_preview_changes[order_id]["change_delivery_date"] = !$(e).is(':checked');
		}

		matches = name.match(/^i_delivery_date_([\d_]+)$/);
		if(matches && matches[1])
		{
			let order_id = matches[1];
			if(!edit_preview_changes.hasOwnProperty(order_id))
			{
				edit_preview_changes[order_id] = {};
			}
			edit_preview_changes[order_id]["delivery_date"] = $(e).val();
		}
	});

	return edit_preview_changes;
}

$.orders.save_preview = function(theModal)
{
	$(theModal).modal('hide');

	let also_generate_order = $("#i_preview_also_generate_order").val();
	let fromButton = $("#i_preview_from_button").val();
	let fromDebitor = $("#i_preview_from_debitor").val();

	//$.orders.save(false, false, false);

	//$('#mdl_order_preview').modal('hide');


	//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Serialize the complete form including disabled
	if(also_generate_order == undefined)
	{
		also_generate_order = false;
	}

	else if(also_generate_order == 0)
	{
		also_generate_order = false;
	}

	else if(also_generate_order == 1)
	{
		also_generate_order = true;
	}

	if(fromDebitor == undefined)
	{
		fromDebitor = 1
	}

	if(fromButton == undefined)
	{
		fromButton = 0
	}

	edit_preview_changes = buildEditPreviewChangesParam();

	// get preview data changes
	$.orders.save(also_generate_order, fromButton, false, fromDebitor, edit_preview_changes);

	return;

	/*
	let target = baseUrl+"admin/orders/save_preview/"+id;

	let params	= $("#form_order_preview").serializeArray(true);
	params.push({"name":"also_generate_order", "value":(also_generate_order ? 1 : 0)});
	params.push({"name":"rendermode", "value":"json"});

	$.app.toConsole(params);

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback save preview order ajax", "data":result});

		$.app.setFormValidationStates("form_order", result.error, result.extra, null);

		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error, function(){
				$('#bt_order_now_order').prop('disabled',false);
			});
		}
		else {
			let order_id = $("#i_order_id").val();
			if (order_id == "") {
				order_id = result.extra.order_id;
			}
			let debitor_id = $("#i_order_debitor_id").val();
				$.app.replaceContent(result.data, function(ev) {
					//$.orders.init_edit_preview();

					if(fromDebitor == 1 && $('#debitor-orders-form').length > 0) {
						$('#bt_back_order, #bt_back_order_bottom').show();
						$('#debitor-orders-tabs a[href="#debitor-orders-form"]').tab('show');
						$('#bt_back_order, #bt_back_order_bottom').off("click").on("click", function () {
							$('#debitor-orders-tabs a[href="#debitor-orders-list"]').tab('show');
							$('#debitor-orders-form').html("");
						});
					}
					else {
						//$('#bt_back_order, #bt_back_order_bottom').show();
						$('#bt_back_order, #bt_back_order_bottom').hide();
					}
				},
			    (fromDebitor == 1 && $('#debitor-orders-form').length > 0 ? "debitor-orders-form" : null), target);
		}
	}, true, null, $.lang.item(loader_lang_id));
	 */
}

/**
 * save order
 * @param {boolean} also_generate_order
 *
 * @param {boolean} fromButton
 */
$.orders.save = function(also_generate_order, fromButton, edit_preview, fromDebitor, edit_preview_changes)
{
	//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Serialize the complete form including disabled
	if(edit_preview == undefined)
	{
		edit_preview = false;
	}

	if(fromDebitor == undefined)
	{
		fromDebitor = 1
	}

	let params	= $("#form_order").serializeArray(true);
	params.push({"name":"also_generate_order", "value":(also_generate_order ? 1 : 0)});

		if (edit_preview)
		{
			params.push({"name":"rendermode", "value":"ajax"});
		}
		else
		{
			params.push({"name":"rendermode", "value":"json"});
		}

		if(edit_preview_changes != undefined)
		{
			params.push({"name":"edit_preview_changes", "value":JSON.stringify(edit_preview_changes)});
		}

	$.app.toConsole(params);
	
	//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Collect order articles
	let selected_articles 	= [];
	$("#tbl_order_articles tbody tr").each(function(){
		let line_amount = $(this).find('.article-line-amount').length > 0 ? $(this).find('.article-line-amount').val() : '';
		/*
		let line_amount = $(this).find('.article-line-amount').val();
		if($(this).find('div.isAdditionalPaymentArticle').length > 0)
		{
			if($(this).find('.article-charges-apply').is(":checked"))
			{
				line_amount = $(this).find('.article-additional-amount').autoNumeric("get") * $(this).find('.article-amount').val();
			}
			else
			{
				line_amount = 0;
			}
		}
		*/
		selected_articles.push( {
			"article_id":$(this).attr("id"), 
			"article_name":($(this).find('.article-name').text()),
			"article_number":$(this).find('.article-number').text(),
        	"amount":$(this).find('.article-amount').val(),
        	"unit_price":$(this).find('.article-price').autoNumeric("get"),
        	"charges_apply":$(this).find('.article-charges-apply').is(':checked') ? 1 : 0,
        	"unit_id":$(this).find('.article-unit-id').val(),
        	"is_from_prescription":$(this).find('.article-is-prescription-flatrate-or-article').val() ? $(this).find('.article-is-prescription-flatrate-or-article').val() : 0,
        	"is_additional_payment":$(this).find('.article-charges-apply').is(":checked") ? 1 : 0,
			"additional_amount":$(this).find('.article-additional-amount').length > 0 ? $(this).find('.article-additional-amount').autoNumeric("get") : 0,
			//@todo add location when saving, depends on what html element it will be
        	"supplier_key":$(this).find('.article-supplier-key').val(),
			"adjuvant_id":$(this).find('.article-adjuvant_id').length > 0 ? $(this).find('.article-adjuvant_id').val() : '',
			"copayment_amount":$(this).find('.article-copayment-amount').length > 0 ? $(this).find('.article-copayment-amount').val() : '',
			//"line_amount":$(this).find('.article-line-amount').length > 0 ? $(this).find('.article-line-amount').val() : '',
			"line_amount": line_amount,
		});
	});
	params.push({"name": "selected_articles", "value": JSON.stringify(selected_articles) });
	
	let order_generate_file = order_generated_file_is_sample_pdf;
	if ($("#i_sample_order").parents('.toggle').hasClass('off')) {
		order_generate_file = order_generated_file_is_xml;
	}
	params.push({"name": "order_generate_file", "value": order_generate_file});
	params.push({"name": "edit_preview", "value": (edit_preview ? 1 : 0)});
	params.push({"name": "sample_order", "value": $("#i_sample_order").parents('.toggle').hasClass('off') == false ? 1 : 0 });
	params.push({"name": "continuous_delivery", "value": $("#i_continuous_delivery").is(':checked') ? 1 : 0 });
	params.push({"name": "fixed_date", "value": $("#i_fixed_date").is(':checked') ? 1 : 0 });
	params.push({"name": "retrieval_delivery", "value": $("#i_retrieval_delivery").is(':checked') ? 1 : 0 });

	//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$.app.toConsole({"fkt":"$.orders.save", "params":params});
	let target 	= $('#form_order').attr( 'action');

	let loader_lang_id = "order_save_progress";
	let finished_lang_id = "order_has_been_saved";
	if (also_generate_order) {
		loader_lang_id = "generate_order_progress";
		finished_lang_id = "order_generated";
	}
	
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback save order ajax", "data":result});
		
		$.app.setFormValidationStates("form_order", result.error, result.extra, null);
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error, function(){
				$('#bt_order_now_order').prop('disabled',false);
			});
		}
		else {

			let order_id = $("#i_order_id").val();
			if (order_id == "") {
				order_id = result.extra.order_id;
			}
			let debitor_id = $("#i_order_debitor_id").val();

			if(edit_preview == 1)
			{

				let table_html = '<div id="mdl_order_preview">'+result.data+'</div>';

				var on_opened = function(modal_id)
				{
					$.app.toConsole("dialog ["+modal_id+"] opened edit_preview");

					$("#conent_"+modal_id).append(table_html);
					$("#conent_"+modal_id).closest('.modal-dialog').css("width", "90%");

					$.orders.init_edit_preview();
				}
				$.dialog.show($.lang.item("msg_order_plan"), "", undefined, undefined, "info", "", $.lang.item("cancel"), true, "lg", on_opened);

				/*
				$.app.replaceContent(result.data, function(ev) {
						$.orders.init_edit_preview();

						if(fromDebitor == 1 && $('#debitor-orders-form').length > 0) {
							$('#bt_back_order, #bt_back_order_bottom').show();
							$('#debitor-orders-tabs a[href="#debitor-orders-form"]').tab('show');
							$('#bt_back_order, #bt_back_order_bottom').off("click").on("click", function () {
								$('#debitor-orders-tabs a[href="#debitor-orders-list"]').tab('show');
								$('#debitor-orders-form').html("");
							});
						}
						else {
							//$('#bt_back_order, #bt_back_order_bottom').show();
							$('#bt_back_order, #bt_back_order_bottom').hide();
						}


					},
					"mdl_order_preview",
					target);
				*/
					//, undefined, target);
					//, (fromDebitor == 1 && $('#debitor-orders-form').length > 0 ? "debitor-orders-form" : null), target);
				/*
				var on_content_replaced = function() {
					$("#mdl_order_preview").show();
					$.orders.init_edit_preview();
				}

				$.app.replaceContent(result.data, on_content_replaced, 'order_preview_container');
				*/

			/*
				$.dialog.info($.lang.item("order_preview"), $.lang.item("order_preview"), function callback()
 				{
 					var on_content_replaced = function() {
						$("#mdl_order_preview").show();
						$orders.init_edit_preview();
 					}
 					$.app.replaceContent(result.data, on_content_replaced, 'order_preview_container');
 				});
 				*/
			}

			//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
			else {
				$.dialog.success($.lang.item("done"), $.lang.item(finished_lang_id), function callback() {
					if (also_generate_order && fromButton) {   //open one or more files in new tab
						if (order_generate_file == order_generated_file_is_xml) {
							//$.each( result.extra.return_order_ids, function( key, order_id )
							//{
							//	window.open(baseUrl + "admin/orders/open_generated_order/" + order_id + "/" + order_generate_file+"/" + debitor_id);
							//});
						} else {
							window.open(baseUrl + "admin/orders/open_generated_order/" + order_id + "/" + order_generate_file + "/" + debitor_id);
						}
					}
					if (result.extra.k_file) {
						window.open(baseUrl + "admin/orders/open_generated_kundenanschreiben/" + order_id + "/" + result.extra.k_file);
					}

					// When this element is visible, we are in the global context.
					// Otherwise this script runs in debitor context
					if ($("#fi_order_debitor_id").is(":visible")) {
						$.app.redirect(baseUrl + "admin/orders/");
					} else {
						$('#debitor-orders-tabs a[href="#debitor-orders-list"]').tab('show');
						//$.debitors.init_table_debitor_orders($("#i_debitor_id").val());
						$.debitors.init_table_debitor_parent_orders($("#i_debitor_id").val());
					}
					$('#bt_order_now_order').prop('disabled', false);

					if ($.orders !== undefined && $.orders !== null) {
						if ($.orders.table != undefined && $.orders.table !== null) {
							//$.orders.table.ajax.reload(); // reload the table
							$.orders.child_row_contents = [];
						}
					}

					if ($.debitors !== undefined && $.debitors !== null) {
						if ($.debitors.table_debitor_orders != undefined && $.debitors.table_debitor_orders !== null) {
							//$.debitors.table_debitor_orders.ajax.reload();
							$.orders.child_row_contents = [];
						}
					}

					$.debitors.init_tabs_from_prescription();
				});
			}
		}
	}, true, null, $.lang.item(loader_lang_id));
};

$.orders.show_edit_preview = function(id)
{
	$.app.blockUI();

	//$('#bt_order_now_order').prop('disabled',true);
	$.orders.save(true, true, true);
}

$.orders.unlock = function(id)
{
	var params = [
		{"name":"order_id", "value":id},
		{"name":"rendermode", "value":"JSON"}
	];

	$.app.sendAjaxRequest(baseUrl+"admin/orders/unlockOrder/", params, function success(result)
	{
		$.app.toConsole({"fkt":"callback_ajax", "result":result});
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			if (result.status == "SUCCESS")
			{
				$.dialog.success($.lang.item("done"), $.lang.item("order_has_been_unlocked"), function callback_done()
				{
						window.location.reload();
				});
				if($.orders !== undefined && $.orders !== null)
				{
					if ($.orders.table != undefined && $.orders.table !== null){
						$.orders.table.ajax.reload(); // reload the table
						$.orders.child_row_contents = [];
					}
				}

				if($.debitors !== undefined && $.debitors !== null)
				{
					if ($.debitors.table_debitor_orders != undefined && $.debitors.table_debitor_orders !== null){
						$.debitors.table_debitor_orders.ajax.reload();
						$.orders.child_row_contents = [];
					}
				}
			}
		}
	}, true, null, $.lang.item("order_unlock_progress"));
}

$.orders.generate_sample_order_file = function()
{
	$.app.blockUI();

	const isMuster = $("#i_sample_order").is(":checked");
	const isHimiOrder = false;
	if (isMuster){
		const articlesToRemove = $(".isAdditionalPaymentArticle, .prescriptionFlatrateOrArticle") ;

		articlesToRemove.each(function () {
			const item = $(this).parent().parent()
			item.remove()
		})
	}
	else if(isHimiOrder)
	{
		const articlesToRemove = $(".isAdditionalPaymentArticle") ;

		articlesToRemove.each(function () {
			const item = $(this).parent().parent()
			item.remove()
		})
	}

	let d = $('#i_delivery_date').val().split(".");
	let dt = new Date(d[2]+"-"+d[1]+"-"+d[0]+"T00:00:00");
	let now = new Date();
    $.app.toConsole({d:d,timestamp:dt.getTime(),now:now.getTime()});

	if ($('#i_order_parent').val() != "") {
		$.app.sendAjaxRequest(baseUrl+"admin/orders/checkScheduledOrders/",
			{
				order_id: $('#i_order_id').val(),
				delivery_date: $('#i_delivery_date').val(),
			},
			function success(result)
			{
				$.app.toConsole({"fkt":"callback_ajax", "result":result});
				if(result.data.length==0)
				{
					$.app.unblockUI();
					$.dialog.confirm("Sicher ?","Das aktuelle Datum liegt weit vor dem festgelegten Lieferdatum. Wollen sie den Auftrag wirklich übertragen?",function(){
							$.app.blockUI();
							$('#bt_order_now_order').prop('disabled',true);
							$.orders.save(true,true);
						},
						function(){
							return;
						});
				}
				else
				{
					$('#bt_order_now_order').prop('disabled',true);
					$.orders.save(true,true);
				}
			}, true, null, $.lang.item("order_unlock_progress"));
	}
	else
	{
		$('#bt_order_now_order').prop('disabled',true);
		$.orders.save(true,true);
	}

	/*if(now.getTime()<=dt.getTime())
	{
		$.app.unblockUI();
		$.dialog.confirm("Sicher ?","Das aktuelle Datum liegt for dem festgelegten Lieferdatum. Wollen sie den Auftrag wirklich übertragen?",function(){
			$.app.blockUI();
			$('#bt_order_now_order').prop('disabled',true);
			$.orders.save(true,true);
		},
		function(){
			return;
		});
	}
	else
	{
		$('#bt_order_now_order').prop('disabled',true);
		$.orders.save(true,true);
	}*/
};

/**
 * @param {string} order_id
 * @param {string} order_generate_file
 * @param {string} debitor_id
 */
$.orders.open_generated_order_file = function(order_id, order_generate_file, debitor_id)
{
	window.open(baseUrl + "admin/orders/open_generated_order/" + order_id + "/" + order_generate_file+"/" + debitor_id);
};

$.orders.removeSendOrders = function(id, parentOrder)
{
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}

	var params = [
		{"name":"order_id", "value":id},
		{"name":"confirmed", "value":1},
		{"name":"rendermode", "value":"JSON"}
	];

	$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("parent_order_sure_delete"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"admin/orders/removeSendOrders/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("order_has_been_deleted"), function callback_done()
					{

					});
					if($.orders !== undefined && $.orders !== null)
					{
						if ($.orders.table != undefined && $.orders.table !== null){
							$.orders.table.ajax.reload(); // reload the table
							$.orders.child_row_contents = [];
						}
					}

					if($.debitors !== undefined && $.debitors !== null)
					{
						if ($.debitors.table_debitor_orders != undefined && $.debitors.table_debitor_orders !== null){
							$.debitors.table_debitor_orders.ajax.reload();
							$.orders.child_row_contents = [];
						}
					}
				}
			}
		}, true, null, $.lang.item("order_delete_progress"));
	}, null, $.lang.item("parent_order_delete"), $.lang.item("cancel"))
}
/**
 * remove order 
 */
$.orders.remove = function(id)
{
	$.app.toConsole({"fkt":"$.orders.remove", "id":id});
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}
	
	var params = [
  		{"name":"order_id", "value":id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("order_sure_delete"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"admin/orders/remove/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("order_has_been_deleted"), function callback_done()
					{
						
					});
					if($.orders !== undefined && $.orders !== null)
					{
						if ($.orders.table != undefined && $.orders.table !== null){
							$.orders.table.ajax.reload(); // reload the table
							$.orders.child_row_contents = [];
						}
					}

					if($.debitors !== undefined && $.debitors !== null)
					{
						if ($.debitors.table_debitor_orders != undefined && $.debitors.table_debitor_orders !== null){
							$.debitors.table_debitor_orders.ajax.reload();
							$.orders.child_row_contents = [];
						}
					}
				}
			}
		}, true, null, $.lang.item("order_delete_progress"));
	}, null, $.lang.item("order_delete"), $.lang.item("cancel"))
};

/**
 *
 * @param id
 * @param parentOrder
 */
$.orders.undelete = function(id) {
	$.app.toConsole({"fkt":"$.orders.undelete", "id":id});
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}

	var params = [
		{"name":"order_id", "value":id},
		{"name":"confirmed", "value":1},
		{"name":"rendermode", "value":"JSON"}
	];

	$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("order_sure_undelete"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"admin/orders/undelete/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("order_has_been_undeleted"), function callback_done()
					{

					});
					if($.orders !== undefined && $.orders !== null)
					{
						if ($.orders.table != undefined && $.orders.table !== null){
							$.orders.table.ajax.reload(); // reload the table
							$.orders.child_row_contents = [];
						}
					}

					if($.debitors !== undefined && $.debitors !== null)
					{
						if ($.debitors.table_debitor_orders != undefined && $.debitors.table_debitor_orders !== null){
							$.debitors.table_debitor_orders.ajax.reload();
							$.orders.child_row_contents = [];
						}
					}


				}
			}
		}, true, null, $.lang.item("order_undelete_progress"));
	}, null, $.lang.item("order_undelete"), $.lang.item("cancel"))
}

$.orders.reset_order = function(id)
{

	var params = [
		{"name":"rendermode", "value":"JSON"},
		{"name": "order_id", "value":id}
	];
	$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("order_sure_reset"), function callback_yes()
	{
		$.app.sendAjaxRequest(baseUrl+"admin/orders/reset_order/", params, function success(result)
		{
			$.app.toConsole({"fkt":"callback_ajax", "result":result});
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				if (result.status == "SUCCESS")
				{
					$.dialog.success($.lang.item("done"), $.lang.item("order_has_been_reset"), function callback_done()
					{

					});
					if($.orders !== undefined && $.orders !== null)
					{
						if ($.orders.table != undefined && $.orders.table !== null){
							$.orders.table.ajax.reload(); // reload the table
							$.orders.child_row_contents = [];
						}
					}

					if($.debitors !== undefined && $.debitors !== null)
					{
						if ($.debitors.table_debitor_orders != undefined && $.debitors.table_debitor_orders !== null){
							$.debitors.table_debitor_orders.ajax.reload();
							$.orders.child_row_contents = [];
						}
					}
				}
			}
		}, true, null, $.lang.item("order_reset_progress"));
	}, null, $.lang.item("order_reset"), $.lang.item("cancel"))

}
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: PRESCRIPTIONS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.orders.load_debitor_prescriptions = function()
{
	const orderId = $("#i_order_id").val()
	if ($("#i_order_debitor_id").val() != "")
	{
		var params = [
	  		{"name":"debitor_id", "value":$("#i_order_debitor_id").val()},
	  		{"name":"rendermode", "value":"JSON"},
			{"name": "order_id", "value":orderId}
	  	];
		
		$.app.sendAjaxRequest(baseUrl+"admin/orders/load_prescriptions_by_debitor/", params, function success(result)
		{
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				$.app.toConsole({"fkt":"$.orders.load_debitor_prescriptions", "result":result});


				$("#i_order_prescription_id").html('<option id="ALL" value="" title="" data-original-title=""></option>');
				
				$.each(result.data, function (index, prescription) 
				{
					/**
					 * @var prescription
					 * @type {Object}
					 * @property {string} contract_name
					 * @property {string} deceased_at
					 * @property {number} duration
					 * @property {number} ik_number
					 * @property {string} insurance_name
					 * @property {string|null} prescription_id_abena
					 * @property {string} prescription_date
					 * @property {string} prescription_valid_till
					 * @property {string} prescription_valid_from
					 * @property {string} sgb_nam_name2
					 * @property {string} sgb_nam_name3
					 */

					var selected = "";
					if (order_prescription_id == prescription.prescription_id)
					{
						selected = "selected";
					}
					//var prescription_label = prescription.prescription_date+' '+prescription.insurance_name+' '+prescription.sgb_nam_name2+' '+prescription.sgb_nam_name3+' '+prescription.contract_name+' '+prescription.prescription_id_abena;
					var prescription_label = (prescription.prescription_date || "")
						+' '+prescription.insurance_name
						+' '+prescription.sgb_nam_name2
						+' '+prescription.sgb_nam_name3
						+(prescription.prescription_id_abena ? (' '+prescription.prescription_id_abena) : "")
						+(prescription.ik_number ? ' ('+prescription.ik_number + ")" : "");
					var attributes = `prescription_valid_from="${prescription.prescription_valid_from}" prescription_valid_till="${prescription.prescription_valid_till}"`;

					$("#i_order_prescription_id").append('<option '+ attributes +' value="'+prescription.prescription_id+'" '+selected+'>'+prescription_label+' </option>');
	            });
				
				$("#i_order_prescription_id").trigger("change");

				$.orders.getDurationForPrescription()
					.then(() => {
						$("#i_select_month_count")
							.val(result.extra.order_combine_additional_orders || 0)
							.trigger("change");
				});
				
			}
		}, true, null, "");
	}
	else {
		$("#i_order_prescription_id").html('');
		$.orders.updatePrescriptionDuration();
	}
};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: BILLING ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
$.orders.load_debitor_billing_accounts = function()
{
	$.orders.debitor_billing_accounts = [];
	
	$("#i_order-additions-tab-billing--select-account").off("change").on("change", $.orders.fill_billing_form);
	$("#i_order-additions-tab-billing--select-account").empty().trigger("change");
	
	if ($("#i_order_debitor_id").val() != "")
	{
		var target 		= baseUrl + "admin/debitors/get_debitor_billing_data/"+$("#i_order_debitor_id").val();
		var params 		= {
			debitor_id: $("#i_order_debitor_id").val(),
			rendermode: "json"
		};
		
		$.app.sendAjaxRequest(target, params, function success(result)
		{
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			
			$("#order-additions-tab-billing--hint-no-debitor").hide();
			
			if (result.data.length == 1)	// length should be 1
			{
				$("#i_order-additions-tab-billing--select-account").append( $('<option>', {value: "",text: "Keine Auswahl"}));
			//	$("#i_order-additions-tab-billing--select-account").append( $('<option>', {value: "custom",text: "Individuell"}));
				
				$.each(result.data, function (index, data) 
				{
					result.data[index].virtual_id = $("#i_order_debitor_id").val();	// ATM this data is 1/1
					$.orders.debitor_billing_accounts["X"+result.data[index].virtual_id] = data;
					$("#i_order-additions-tab-billing--select-account").append( $('<option>', {
					    value: result.data[index].virtual_id,
					    text: "Debitor"
					}));
	            });
				
				if (result.data.length > 0){
					// only one element ....
					$('#i_order-additions-tab-billing--select-account').val(result.data[0].virtual_id).trigger("change");
				}
				
				
				$("#i_order-additions-tab-billing--select-account").select2('destroy');
				$.app.init_select2("#i_order-additions-tab-billing--select-account");
			}
			else{
				//$.dialog.error($.lang.item("error"), "Der Debitor hat keine Rechnungskonten");
			}
		}, true, "#order-additions-tab-billing", $.lang.item("msg_wait") );
	}
	else{
		$("#order-additions-tab-billing--hint-no-debitor").show();
	}
};

$.orders.fill_billing_form = function()
{
	var selected_account 	= $("#i_order-additions-tab-billing--select-account").val();
	var data 				= {};
	if ($.orders.debitor_billing_accounts["X"+selected_account] != undefined){
		data = $.orders.debitor_billing_accounts["X"+selected_account];
	}
	$.app.toConsole({"fkt":"$.orders.fill_billing_form", "data":data});
	
	$("#i_order-additions-tab-billing-sales_group").val(data.sales_group).trigger("change");
	$("#i_order-additions-tab-billing-price_group").val(data.price_group).trigger("change");
	$("#i_order-additions-tab-billing-payment").val(data.payment).trigger("change");
	$("#i_order-additions-tab-billing-payment_terms").val(data.payment_terms).trigger("change");
	$("#i_order-additions-tab-billing-s_account").val(data.skonto).trigger("change");
	$("#i_order-additions-tab-billing-bank_account").val(data.bank_account);
	$('#i_order-additions-tab-billing-payment_model').val(data.payment_model).trigger("change");
	
	if (data.payment_model == "bar"){
		$("#i_order-additions-tab-billing-s_account").addClass("required");
		$("#i_order-additions-tab-billing-bank_account").addClass("required");
	}
	else{
		$("#i_order-additions-tab-billing-s_account").removeClass("required");
		$("#i_order-additions-tab-billing-bank_account").removeClass("required");
	}
	
	if (selected_account == "custom"){
		$('#order-additions-tab-billing-form :input:not(.dont-disable)').prop('disabled', false);
		
		//$("#order-additions-tab-billing-form-left fieldset").removeAttr("disabled");
		//$("#order-additions-tab-billing-form-left .select2").removeClass("select2-container--disabled").prop("disabled", false).trigger("change");
	}else{
		$('#order-additions-tab-billing-form :input:not(.dont-disable)').prop('disabled', true);
		
		//$("#order-additions-tab-billing-form-left fieldset").attr("disabled", "disabled");
		//$("#order-additions-tab-billing-form-left .select2").addClass("select2-container--disabled").prop("disabled", true).trigger("change");
	}
	if(data.generate_payment_contract == 1)
	{
		$('#i_order-additions-tab-billing-generate_payment_contract').prop('checked',true);
	}
	else{
		$('#i_order-additions-tab-billing-generate_payment_contract').prop('checked',false);
	}

};

//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:: DELIVERY :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
//..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

/**
 * Gets triggered on init and debitor change
 * 
 * Load delivery accounts for selected debitor, fills the correponding dropdown.
 * Stores the data in '$.orders.debitor_delivery_accounts'
 */
$.orders.load_debitor_delivery_accounts = function(init)
{
	$.orders.debitor_delivery_accounts = [];
	$.orders.deliveryAccountCustomValues = [];

	if(init == undefined)
	{
		init = false;
	}

	$("#i_order-additions-tab-delivery--select-account").off("change").on("change", $.orders.fill_delivery_form);
	$("#i_order-additions-tab-delivery--select-account").empty().trigger("change");

	let order_id = $('#i_order_id').val();
	let selectedContact = 0;
	/*
		Get Values from orderhead ////////////////////
	 */
	let delivery_name1 = "";
	let delivery_name2 = "";
	let delivery_name3 = "";
	let delivery_street = "";
	let delivery_zipcode = "";
	let delivery_location = "";
	let delivery_subdivision = "";
	let delivery_country = "";
	let delivery_email = "";
	let delivery_service = "";
	let delivery_type = "";
	let delivery_storage_location = "";
	let delivery_cargo_informations = "";
	let delivery_storage_information = "";
	let delivery_external_notes = "";
	let delivery_contact_type = "";
	let delivery_contact_title = "";
	let delivery_contact_district = "";
	let delivery_lfs = "";
	let delivery_carry_consignment_1 = "";
	let delivery_carry_consignment_2 = "";
	let delivery_carry_consignment_3 = "";
	let delivery_lifting_platform = "";
	let delivery_carton_return = "";
	let delivery_pallet_delivery = "";
// i_additions_district additions_district
	/*
	///////////////////////////////////////////////////
	 */


	if(order_id)
	{

		var targetOrder 		= baseUrl + "admin/orders/loadDataFromCustomerOrderHead/"+order_id;
		var paramsOrder 		= {
			order_id: order_id,
			rendermode: "json",
		};

		$.ajax({
			'async': false,
			'type': "POST",
			'dataType': 'json',
			'url': targetOrder,
			'data': paramsOrder,
			'success': function (result) {
				if (result.error && result.error != null) {
					$.dialog.error($.lang.item('error'), result.error);
				} else {
					if (result.data.delivery_account_id != '') {
						$.orders.deliveryAccountCustomValues = result.data;
						selectedContact = result.data.delivery_account_id;
						delivery_contact_type = result.data.delivery_contact_type;
						delivery_contact_title = result.data.delivery_contact_title;
						delivery_contact_district = result.data.delivery_contact_district;
						delivery_name1 = result.data.delivery_name1;
						delivery_name2 = result.data.delivery_name2;
						delivery_name3 = result.data.delivery_name3;
						delivery_street = result.data.delivery_street;
						delivery_zipcode = result.data.delivery_zipcode;
						delivery_location = result.data.delivery_location;
						delivery_subdivision = result.data.delivery_subdivision;
						delivery_country = result.data.delivery_country;
						delivery_email = result.data.delivery_email;

						delivery_service = result.data.delivery_service;
						delivery_type = result.data.delivery_type;
						delivery_storage_location = result.data.delivery_storage_location;
						delivery_cargo_informations = result.data.delivery_cargo_informations;
						delivery_storage_information = result.data.delivery_storage_information;
						delivery_external_notes = result.data.external_notes;

						if(true)
						{
							delivery_lfs = result.data.delivery_lfs;
							delivery_carry_consignment_1 = result.data.delivery_carry_consignment_1;
							delivery_carry_consignment_2 = result.data.delivery_carry_consignment_2;
							delivery_carry_consignment_3 = result.data.delivery_carry_consignment_3;
							delivery_lifting_platform = result.data.delivery_lifting_platform;
							delivery_carton_return = result.data.delivery_carton_return;
							delivery_pallet_delivery = result.data.delivery_pallet_delivery;
						}
					}

				}
			}
		});

	}

	if ($("#i_order_debitor_id").val() != "")
	{
		let vdebitor_id = $("#i_order_debitor_id").val();
		var target0 		= baseUrl + "admin/debitors/get_debitor_data_for_delivery_custom/"+vdebitor_id;

		var params0 		= {
			debitor_id: vdebitor_id,
			rendermode: "json",
		};

		$.app.blockUI();
		$.ajax({
			'async': false,
			'type': "POST",
			'dataType': 'json',
			'url': target0,
			'data': params0,
			'success': function (result) {
				if (result.error && result.error != null){
					$.dialog.error($.lang.item('error'), result.error);
				}
				else {
					if(Object.keys($.orders.deliveryAccountCustomValues).length > 0)
					{
						$.orders.debitor_delivery_accounts["Xcustom"] = $.orders.deliveryAccountCustomValues;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_street 		= $.orders.deliveryAccountCustomValues.delivery_street;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_name1 		= $.orders.deliveryAccountCustomValues.delivery_name1;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_name2 		= $.orders.deliveryAccountCustomValues.delivery_name2;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_name3 		= $.orders.deliveryAccountCustomValues.delivery_name3;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_zipcode 		= $.orders.deliveryAccountCustomValues.delivery_zipcode;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_location 		= $.orders.deliveryAccountCustomValues.delivery_location;
						$.orders.debitor_delivery_accounts["Xcustom"].delivery_service		= $.orders.deliveryAccountCustomValues.delivery_service;
						$.orders.debitor_delivery_accounts["Xcustom"].delivery_type 		= $.orders.deliveryAccountCustomValues.delivery_type;
						$.orders.debitor_delivery_accounts["Xcustom"].storage_location 		= $.orders.deliveryAccountCustomValues.delivery_storage_location;
						$.orders.debitor_delivery_accounts["Xcustom"].cargo_information 	= $.orders.deliveryAccountCustomValues.delivery_cargo_informations;
						$.orders.debitor_delivery_accounts["Xcustom"].stock_information 	= $.orders.deliveryAccountCustomValues.delivery_storage_information;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_country 		= $.orders.deliveryAccountCustomValues.delivery_country;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_email 		= $.orders.deliveryAccountCustomValues.delivery_email;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_type 			= $.orders.deliveryAccountCustomValues.delivery_contact_type;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_salutation 	= $.orders.deliveryAccountCustomValues.delivery_contact_title;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_subdivision 	= $.orders.deliveryAccountCustomValues.delivery_subdivision;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_district 		= $.orders.deliveryAccountCustomValues.delivery_contact_district;
						$.orders.debitor_delivery_accounts["Xcustom"].contact_external_information 		= $.orders.deliveryAccountCustomValues.external_notes;
					}
					else
					{
						$.orders.debitor_delivery_accounts["Xcustom"] = result.data;
					}


					//deliveryAccountCustomValues
				}
			}
		});
		$.app.unblockUI();

		var target 		= baseUrl + "admin/debitors/get_contacts_by_type/"+vdebitor_id+"/type_delivery";
		var params 		= {
			debitor_id: vdebitor_id,
			contact_type: "type_delivery",
			rendermode: "json",
		};

		/*
								if (init == false) {
		 */
		$.app.sendAjaxRequest(target, params, function success(result)
		{
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			
			$("#order-additions-tab-delivery--hint-no-debitor").hide();
			
			if (result.data.length > 0)
			{
				$("#i_order-additions-tab-delivery--select-account").append( $('<option>', {value: "",text: "Keine Auswahl"}));
				$("#i_order-additions-tab-delivery--select-account").append( $('<option>', {value: "custom",text: "Individuell"}));
				
				$.each(result.data, function (index, data) 
				{
					$.orders.debitor_delivery_accounts["X"+data.contact_id] = data;
					
					$("#i_order-additions-tab-delivery--select-account").append( $('<option>', {
					    value: data.contact_id,
					  //  text: data.contact_firstname+" "+data.contact_lastname
						text: data.contact_name1
					}));
	            });
				
				if (result.data.length > 0){
					//$('#i_order-additions-tab-delivery--select-account').val(result.data[0].contact_id).trigger("change");
				}
				
				
				$("#i_order-additions-tab-delivery--select-account").select2('destroy');
				$.app.init_select2("#i_order-additions-tab-delivery--select-account");
				if(order_id)
				{
					//$("#i_order-additions-tab-delivery--select-account").val(selectedContact).trigger("change");
					$("#i_order-additions-tab-delivery-delivery_type").val(delivery_type).trigger("change");
					$("#i_order-additions-tab-delivery-delivery_service").val(delivery_service).trigger("change");
					$("#i_order-additions-tab-delivery-storage_location").val(delivery_storage_location).trigger("change");
					$("#i_order-additions-tab-delivery-cargo_information").val(delivery_cargo_informations);
					$("#i_order-additions-tab-delivery-stock_information").val(delivery_storage_information);
					$('#i_order-additions-tab-delivery-external_information').val(delivery_external_notes);


					$("#i_order-additions-tab-delivery-contact_type").val(delivery_contact_type).trigger("change");
					$("#i_order-additions-tab-delivery-contact_title").val(delivery_contact_title).trigger("change");
					$("#i_order-additions-tab-delivery-contact_country").val(delivery_country).trigger("change");
					$("#i_order-additions-tab-delivery-contact_email").val(delivery_email).trigger("change");
					$("#i_order-additions-tab-delivery-contact_subdivision").val(delivery_subdivision).trigger("change");

					$("#i_order-additions-tab-delivery-contact_name1").val(delivery_name1);
					$("#i_order-additions-tab-delivery-contact_name2").val(delivery_name2);
					$("#i_order-additions-tab-delivery-contact_name3").val(delivery_name3);
					$("#i_order-additions-tab-delivery-contact_street").val(delivery_street);
					$("#i_order-additions-tab-delivery-contact_zipcode").val(delivery_zipcode);

					$("#delivery_lfs").val(delivery_lfs);
					$("#delivery_carry_consignment_1").val(delivery_carry_consignment_1);
					$("#delivery_carry_consignment_2").val(delivery_carry_consignment_2);
					$("#delivery_carry_consignment_3").val(delivery_carry_consignment_3);
					$("#delivery_lifting_platform").val(delivery_lifting_platform);
					$("#delivery_carton_return").val(delivery_carton_return);
					$("#delivery_pallet_delivery").val(delivery_pallet_delivery);

					$("#i_additions_district").val(delivery_contact_district);


					// Auswahl des gespeicherten Kontakts per ID
					if (selectedContact != 0)
					{
						$("#i_order-additions-tab-delivery--select-account").val(selectedContact).trigger("change");
						if(selectedContact == 'custom' || selectedContact == null)
						{
							$("#i_order-additions-tab-delivery-delivery_type").val(delivery_type).trigger("change");
							$("#i_order-additions-tab-delivery-delivery_service").val(delivery_service).trigger("change");
							$("#i_order-additions-tab-delivery-storage_location").val(delivery_storage_location).trigger("change");
							$("#i_order-additions-tab-delivery-contact_type").val(delivery_contact_type).trigger("change");
							$("#i_order-additions-tab-delivery-contact_title").val(delivery_contact_title).trigger("change");
							$("#i_order-additions-tab-delivery-contact_country").val(delivery_country).trigger("change");
							$("#i_order-additions-tab-delivery-contact_email").val(delivery_email).trigger("change");
							$("#i_order-additions-tab-delivery-contact_subdivision").val(delivery_subdivision).trigger("change");

							$("#i_order-additions-tab-delivery-contact_name1").val(delivery_name1);
							$("#i_order-additions-tab-delivery-contact_name2").val(delivery_name2);
							$("#i_order-additions-tab-delivery-contact_name3").val(delivery_name3);
							$("#i_order-additions-tab-delivery-contact_street").val(delivery_street);
							$("#i_order-additions-tab-delivery-contact_zipcode").val(delivery_zipcode);
							$("#i_order-additions-tab-delivery-cargo_information").val(delivery_cargo_informations);
							$("#i_order-additions-tab-delivery-stock_information").val(delivery_storage_information);
							$('#i_order-additions-tab-delivery-external_information').val(delivery_external_notes);
							$("#i_additions_district").val(delivery_contact_district);
						}
					}
					else
					{
						let default_delivery_contact = $.orders.getDefaultDeliveryContact();
						if (default_delivery_contact == null)
						{
							$("#i_order-additions-tab-delivery--select-account").val("custom").trigger("change");
						}
						else
						{
							$("#i_order-additions-tab-delivery--select-account").val(default_delivery_contact.contact_id).trigger("change");
						}

						$.orders.fill_delivery_form(init);
					}
				}
				else
				{
					let default_delivery_contact = $.orders.getDefaultDeliveryContact();
					if (default_delivery_contact == null)
					{
						$("#i_order-additions-tab-delivery--select-account").val("custom").trigger("change");
					}
					else
					{
						$("#i_order-additions-tab-delivery--select-account").val(default_delivery_contact.contact_id).trigger("change");
					}

					$.orders.fill_delivery_form(init);
				}
			}
			else{
				$("#i_order-additions-tab-delivery--select-account").append( $('<option>', {value: "",text: "Keine Auswahl"}));
				$("#i_order-additions-tab-delivery--select-account").append( $('<option>', {value: "custom",text: "Individuell"}));
				//$.dialog.error($.lang.item("error"), "Der Debitor hat keine Lieferkonten");
				$("#i_order-additions-tab-delivery--select-account").select2('destroy');
				$.app.init_select2("#i_order-additions-tab-delivery--select-account");
				$("#i_order-additions-tab-delivery--select-account").val("custom").trigger("change");
				$.orders.fill_delivery_form(init);
			}
		}, true, "#order-additions-tab-delivery", $.lang.item("msg_wait") );
	}
	else{
		$("#order-additions-tab-delivery--hint-no-debitor").show();
	}
}

/**
 * Gets triggered when changeing the delivery account 
 * Fill out the delivery form 
 */
$.orders.fill_delivery_form = function(init)
{
	if(init == undefined)
	{
		init = false;
	}

	let order_id = $('#i_order_id').val();
	var selected_account 	= $("#i_order-additions-tab-delivery--select-account").val();
	/**
	 * @typedef AutoFillData
	 * @type {Object}
	 * @property {string|undefined|null} contact_street
	 * @property {string|undefined|null} contact_name1
	 * @property {string|undefined|null} contact_name2
	 * @property {string|undefined|null} contact_name3
	 * @property {string|undefined|null} contact_house_nr
	 * @property {string|undefined|null} contact_zipcode
	 * @property {string|undefined|null} contact_location
	 * @property {string|undefined|null} contact_district
	 * @property {string|undefined|null} contact_email
	 * @property {string|undefined|null} delivery_service
	 * @property {string|undefined|null} delivery_type
	 * @property {string|undefined|null} storage_location
	 * @property {string|undefined|null} cargo_information
	 * @property {string|undefined|null} stock_information
	 * @property {string|undefined|null} contact_external_information
	 * @property {string|undefined|null} contact_country
	 * @property {string|undefined|null} contact_type
	 * @property {string|undefined|null} contact_salutation
	 *
	 */

	/** @type {AutoFillData} */
	var data 				= {};
	if ($.orders.debitor_delivery_accounts["X"+selected_account] != undefined){
		data = $.orders.debitor_delivery_accounts["X"+selected_account];
	}
	$.app.toConsole({"fkt":"$.orders.fill_delivery_form", "data":data});
	
//	$("#i_order-additions-tab-delivery-contact_firstname").val(data.contact_firstname);
//	$("#i_order-additions-tab-delivery-contact_lastname").val(data.contact_lastname);
	$("#i_order-additions-tab-delivery-ax_delivery_account_id").val(data.account_delivery);
	$("#i_order-additions-tab-delivery-contact_street").val(data.contact_street);
	$("#i_order-additions-tab-delivery-contact_name1").val(data.contact_name1);
	$("#i_order-additions-tab-delivery-contact_name2").val(data.contact_name2);
	$("#i_order-additions-tab-delivery-contact_name3").val(data.contact_name3);
	$("#i_order-additions-tab-delivery-contact_house_nr").val(data.contact_house_nr);
	$("#i_order-additions-tab-delivery-contact_zipcode").val(data.contact_zipcode);
	$("#i_order-additions-tab-delivery-contact_location").val(data.contact_location);
	$("#i_order-additions-tab-delivery-contact_email").val(data.contact_email);
	$('#i_additions_district').val(data.contact_district);

	//if(init !== true)
	if($.orders.initialized == true)
	{
		$('#i_order-additions-tab-delivery-delivery_service').val(data.delivery_service).trigger("change");
		$('#i_order-additions-tab-delivery-delivery_type').val(data.delivery_type).trigger("change");
		$('#i_order-additions-tab-delivery-storage_location').val(data.storage_location).trigger("change");
		$('#i_order-additions-tab-delivery-cargo_information').val(data.cargo_information);
		$('#i_order-additions-tab-delivery-stock_information').val(data.stock_information);
		$('#i_order-additions-tab-delivery-external_information').val(data.contact_external_information);
	}
	else if(selected_account != null)
	{
		$.orders.initialized = true;
	}
	/*
	else if (!order_id)
	{
		let default_delivery_contact = $.orders.getDefaultDeliveryContact();
		if(default_delivery_contact) {
			selected_account = default_delivery_contact;
		}
	}
	 */

	$('#i_order-additions-tab-delivery-contact_country').val(data.contact_country).trigger("change");
	$("#i_order-additions-tab-delivery-contact_email").val(data.contact_email).trigger("change");
	$('#i_order-additions-tab-delivery-contact_type').val(data.contact_type).trigger("change");
	$('#i_order-additions-tab-delivery-contact_title').val(data.contact_salutation).trigger("change");


	$('#i_order-additions-tab-delivery-contact_country').on("change", function () {
		$('#i_order-additions-tab-delivery-contact_subdivision').empty();

		$.each(all_subdivisions[$(this).val()], function (index, subdivision) {
			$("#i_order-additions-tab-delivery-contact_subdivision").append("<option id=" + subdivision.subdivision_code + " value='" + subdivision.subdivision_code + "'>" + subdivision.subdivision_select_label + "</option>");
		})

	});

	$('#i_order-additions-tab-delivery-contact_subdivision').val(data.contact_subdivision).trigger("change");
        
	if (selected_account == "custom"){
		$('#order-additions-tab-delivery-form-left :input').prop('disabled', false);
		$('#order-additions-tab-delivery-form-right :input').prop('disabled', false);
		
		//$("#order-additions-tab-delivery-form-left fieldset").removeAttr("disabled");
		//$("#order-additions-tab-delivery-form-left .select2").removeClass("select2-container--disabled").prop("disabled", false);
		//$("#order-additions-tab-delivery-form-right fieldset").removeAttr("disabled");
		//$("#order-additions-tab-delivery-form-right .select2").removeClass("select2-container--disabled").prop("disabled", false);
	}else{
		$('#order-additions-tab-delivery-form-left :input').prop('disabled', true);
		$('#order-additions-tab-delivery-form-right :input').prop('disabled', false);
		//$('#i_order-additions-tab-delivery-delivery_type').prop('disabled', false);
		//$('#i_order-additions-tab-delivery-delivery_service').prop('disabled', false);
		
		//$("#order-additions-tab-delivery-form-left fieldset").attr("disabled", "disabled");
		//$("#order-additions-tab-delivery-form-left .select2").addClass("select2-container--disabled").prop("disabled", true);
		//$("#order-additions-tab-delivery-form-right fieldset").attr("disabled", "disabled");
		//$("#order-additions-tab-delivery-form-right .select2").addClass("select2-container--disabled").prop("disabled", true);
	}
	
};

$.orders.getDefaultDeliveryContact = function()
{
	let default_delivery_contact = null;
	for (const el in $.orders.debitor_delivery_accounts) {
		if($.orders.debitor_delivery_accounts[el].default_delivery == "1")
		{
			default_delivery_contact = $.orders.debitor_delivery_accounts[el];
			break;
		}
	}
	/*
	$.each($.orders.debitor_delivery_accounts, function () {
		if(this.default_delivery == "1")
		{
			default_delivery_contact = thi;
		}
	});
	 */

	return default_delivery_contact;
}

// ..:::::::::::::::::::::::::::::: external_information :::::::::::::::::::::..
$.orders.use_contact_external_phrase = function()
{
	let phrase 	= $('#i_order-additions-tab-delivery-external_phrases_selection option:selected').text();
	let id 		= $('#i_order-additions-tab-delivery-external_phrases_selection option:selected')[0].id;

	if($.trim(phrase)!='')
	{
		if($.trim($("#i_order-additions-tab-delivery-external_information").val()) == '')
		{
			$("#i_order-additions-tab-delivery-external_information").val(phrase);
		}
		else
		{
			$("#i_order-additions-tab-delivery-external_information").val($("#i_order-additions-tab-delivery-external_information").val()+"\n"+phrase);
		}
		if($.trim(id)=='')
		{
			$.orders.create_external_phrase(phrase);
		}
		else
		{
			$("#i_order-additions-tab-delivery-external_phrases_selection").val(null).trigger('change');
		}
	}

}

$.orders.create_external_phrase = function (phrase)
{
	let params = [
		{"name": "phrase", "value": phrase},
		{"name": "rendermode", "value": "JSON"}
	];
	$.app.sendAjaxRequest(baseUrl + "admin/debitors/set_external_note_phrases", params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			var newOption = '<option id="'+result.new_id+'" value="'+result.new_id+'" label="'+result.phrase+'" key="'+result.new_id+'" title="'+result.phrase+'">'+result.phrase+'</option>';
			$("#i_order-additions-tab-delivery-external_phrases_selection").val(null).trigger('change');
			$("#i_order-additions-tab-delivery-external_phrases_selection").append(newOption);

		}
	}, true, null, $.lang.item("in_progress"));
};

$.orders.clear_external_information = function()
{
	$("#i_order-additions-tab-delivery-external_information").val('');
}
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

$.orders.updateZZ = function () {
	const selectPerMonths = $("#i_select_month_count");
	const perQuartal = $("#i_number_of_months_per_contract").is(":checked");
	const isSampleOrder = $("#i_sample_order").parents('.toggle').hasClass('off') === false;

	const setPerQuartal = function () {
		// if null is passed to the save function, 3 will be saved to the db instead
		selectPerMonths.val(3);
		selectPerMonths.parent().hide();
	}
	const setDependingOnRecipe = function () {
		selectPerMonths.parent().hide();
		$.orders.getDurationForPrescription()
			.then(() => {
				selectPerMonths.parent().show();
				selectPerMonths.val(3);
			})
	}

	if (isSampleOrder) return selectPerMonths.parent().parent().hide();

	else selectPerMonths.parent().parent().show();

	perQuartal ? setPerQuartal() : setDependingOnRecipe();
}

$.orders.init_external_phrases_selection = function()
{
	$("#i_order-additions-tab-delivery-external_phrases_selection").select2({
		placeholder: $.lang.please_select,
		width: "100%",
		allowClear: false,
		language: $.lang.locale,
		//theme: "classic"
		theme: "bootstrap",
		dropdownAutoWidth : true,
		tags:true});
}


/**
 * initialize form 
 **/
$.orders.init_form = function() {
	$.app.toConsole("init_form: set initialized = false");
	$.orders.initialized = false;
	if ($("#form_order").length > 0) {
		localStorage.removeItem('prescription_selected_before');
		var order_id = $("#i_order_id").val();
		var order_parent = $("#i_order_parent").val();
		$.app.toConsole({"fkt": "$.orders.init_form"});
		$.orders.toggleOrderButton();
		$.app.init_select2();
		$.app.init_toggle();
		$.app.init_datepicker();
		$.orders.init_external_phrases_selection();

		$("#order_from_till_text").css('font-size', '100%'),

		$("#form_order").submit(function (e) {
			$.app.blockUI();

			// Use preview mode for existing parent order im saving
			if($('#i_edit_preview').val() == 1 && order_parent == "" && order_id != "")
			{
				$.orders.save(false, false, true);
			}
			else {
				$.orders.save(false, false);
			}

			e.preventDefault();
		});

		$.orders.load_debitor_prescriptions();
		$.orders.load_debitor_delivery_accounts(true);
		$.orders.load_debitor_billing_accounts();
		$("#i_order_debitor_id").off("change").on("change", function x(e) {
			$.orders.load_debitor_prescriptions();
			$.orders.load_debitor_delivery_accounts();
			$.orders.load_debitor_billing_accounts();

			if ($(this).val() != "") {
				$("#order-additions-tab-delivery--hint-no-debitor").hide();
				$("#order-additions-tab-billing--hint-no-debitor").hide();
			} else {
				$("#order-additions-tab-delivery--hint-no-debitor").show();
				$("#order-additions-tab-billing--hint-no-debitor").show();
			}
		});

		$("input:radio[name='how_many_month']").off("change").on("change", function x(e) {
			$.orders.init_how_many_month_start_delivery();
		});

		$('li a[href="#orders"]').off("click").on("click", function () {
			if ($('#form_order').length > 0) {
				$.orders.load_debitor_delivery_accounts();
				$.orders.load_debitor_billing_accounts();
			}
		});

		$.orders.init_order_articles_table(order_id);
		$.orders.init_order_articles_subsequent_delivery_table(order_id);
		if (order_action !== order_preview_action) {
			$.orders.init_articles_not_in_order_table(order_id);
		}

		$.orders.addOrderArticleRow(order_id);
		$.orders.removeOrderArticleRow();

		//initial fill
		$.orders.fillStatisticGroupDropdown();
		$("#i_article_group").off("change").on("change", function () {
			$.orders.fillStatisticGroupDropdown();
		});

		$("#i_article_group, #i_statistic_group").off("change").on("change", function () {
			$.orders.table_article.draw();
		});

		$("#i_sample_order").off("change").change($.orders.updateArticleList)

		$("#i_order_put_additonal_order_together").on("change", function (e) {
			if ($("#i_order_put_additonal_order_together").is(":checked")) {
				$("#fi_number_of_months_per_contract").hide();
				$("#i_select_month_count").parent().hide();
			} else {
				$("#fi_number_of_months_per_contract").show();
				if ($('#i_number_of_months_per_contract_lbl div.toggle.off').length > 0) {
					$("#i_select_month_count").parent().show();
				} else {
					$("#i_select_month_count").parent().hide();
				}
			}
			$.orders.select_default_piece();
			$.orders.select_default_piece("tbl_order_articles_subsequent_delivery");
		});

		//$("#i_order_prescription_id, #i_sample_order").off("change");
		$("#i_order_prescription_id, #i_sample_order").on("change", function (e) {

			$.orders.updateZZ();
			$.orders.updateDeliveryOptions();
			$.orders.updatePrescriptionDuration();

			if (e.target.id === 'i_order_prescription_id') {
				//console.log('change'+$(this).val());

				if ((localStorage.getItem('prescription_selected_before') !== $(this).val() && $(this).val() != '')) {
					if (!((localStorage.getItem('prescription_selected_before') == null) && $('#form_order').attr('data-saving-context') == 'edit')) {
						//	console.log('REZEPT'+$(this).val());
						//$("#i_order_count_of_months").val('');
						$("#i_order_count_of_prescription_orders").val('');
						$.orders.getCountMonthsFromPrescription();
						$.orders.removePauschaleOrArticleFromPrescription();
						$.orders.getDurationForPrescription();
						$.orders.addPauschaleOrArticleFromPrescription($(this).val());
					}
				} else if ($(this).val() == "") {
					$.orders.removePauschaleOrArticleFromPrescription($(this).val());
				}
				localStorage.setItem('prescription_selected_before', $(this).val());
			}
			$.orders.toggleOrderButton();

		});
		makeOrderAutoCompleter();
	}

	$("#i_delivery_option").off("change").change($.orders.updateDeliveryOptions);
	$.orders.updateDeliveryOptions();

	$("#i_number_of_months_per_contract").off("change").change($.orders.updateZZ);
	$.orders.updateZZ();

	//$("#i_order_prescription_id").off("change").change($.orders.getDurationForPrescription);
	$("#i_order_prescription_id").unbind('change', $.orders.getDurationForPrescription).change($.orders.getDurationForPrescription);

	$("#tbl_order_articles > tbody").off("change").change($.orders.onOrderArticleChange);

	$("#i_order-additions-tab-delivery-delivery_type").off("change").change($.orders.onDeliveryTypeChange);
	$("#i_order-additions-tab-delivery-delivery_service").off("change").change($.orders.onDeliveryServiceChange);

	$.orders.getDurationForPrescription();

	$("#fi_number_of_months_per_contract").off("hide").on('hide', function () {
		$("#i_select_month_count").parent().hide();
	});

	$("#fi_number_of_months_per_contract").off("show").on('show', function () {
		if ($('#i_number_of_months_per_contract_lbl div.toggle.off').length > 0) {
			$("#i_select_month_count").parent().show();
		} else {
			$("#i_select_month_count").parent().hide();
		}
	});

	if ($('#i_order_prescription_id').val() == "") {
		$("#fi_number_of_months_per_contract").hide();
		$("#i_select_month_count").parent().hide();
	}

	if ($("#i_order_parent").val() == "")
	{
		$.orders.updatePrescriptionDuration();
	}

	if ($("#form_order").length == 0)
	{
		$.orders.initialized = false;
	}

	/*
	$("#order-additions-tab-content").on("show", function (ev) {
		$("#i_order-additions-tab-delivery--select-account").off("change").on("change", $.orders.fill_delivery_form);
	});
	 */
};

$.orders.updateDeliveryOptions = function () {

	const isSampleOrder = $("#i_sample_order").parents('.toggle').hasClass('off') === false;

	const deliveryOptionsGroup = $("#i_delivery_option_continuous").parent().parent().parent().parent();
	const selectedDeliveryType = $('input[name="delivery_option"]:checked').val();
	const monthsGroup = $("#fi_how_many_month");
	const monthsStartChange = $("#fi_how_many_month_start_change");
	const monthsStartDelivery = $("#fi_how_many_month_start_delivery");
	const prescriptionId = $("#i_order_prescription_id").val();
	const fixDate = $("#fi_fixed_date");
	const isParentOrder = $("#i_order_parent").val() == "";
	const hasChildOrders = $("#i_has_child_orders").val() == 1;

	const showContinuousDeliveryOptions = function () {
		$.orders.init_how_many_month_start_delivery();
		monthsGroup.addClass("required");
		monthsGroup.show();
		if($('#i_order_id').val() != "" && isParentOrder && hasChildOrders) {
			monthsStartChange.show();
		}
		else {
			monthsStartChange.hide();
		}

		if(isParentOrder)
		{
			monthsStartDelivery.show();
		}
		else {
			monthsStartDelivery.hide();
		}

		if(		($.orders.USE_ALL_MONTH_FOR_START_DELIVERY == true
			|| ("input:radio[name='how_many_month']:checked").val() > 1)
				&& isParentOrder)
		{
			$("#i_how_many_month_start_delivery").show();
		}
		else
		{
			$("#i_how_many_month_start_delivery").hide();
		}

		fixDate.show();
	}

	const hideContinuousDeliveryOptions = function () {
		$.orders.init_how_many_month_start_delivery();
		monthsGroup.removeClass("required");
		monthsGroup.hide();
		//monthsStartChange.hide();
		//monthsStartDelivery.hide();
		fixDate.hide();

		if($('#i_order_id').val() != "" && isParentOrder && hasChildOrders) {
			monthsStartChange.show();
		}
		else {
			monthsStartChange.hide();
		}

		if(isParentOrder)
		{
			monthsStartDelivery.show();
		}
		else {
			monthsStartDelivery.hide();
		}

		if(		($.orders.USE_ALL_MONTH_FOR_START_DELIVERY == true
			|| ("input:radio[name='how_many_month']:checked").val() > 1)
			&& isParentOrder)
		{
			$("#i_how_many_month_start_delivery").show();
		}
		else
		{
			$("#i_how_many_month_start_delivery").hide();
		}
	}

	if (isSampleOrder || !prescriptionId) {
		deliveryOptionsGroup.hide();
		return hideContinuousDeliveryOptions();
	} else {
		deliveryOptionsGroup.show();
	}

	if (selectedDeliveryType == "1" ) {
		return showContinuousDeliveryOptions();
	}

	if (selectedDeliveryType == "2"){
		return hideContinuousDeliveryOptions();
	}
}

$.orders.removePauschaleOrArticleFromPrescription = function(prescription_id)
{
	let indexes = $.orders.table_order_article.rows().indexes().filter( function ( value, index ) {
		return $($.orders.table_order_article.row(value).data().article_number).hasClass('prescriptionFlatrateOrArticle') > 0;
	});
	$.orders.table_order_article.rows(indexes).remove().draw();
}

$.orders.addPauschaleOrArticleFromPrescription = function(prescription_id)
{

	let params = [
		{"name": "prescription_id", "value": prescription_id},
		{"name": "rendermode", "value": "JSON"}
	];
	$.app.sendAjaxRequest(baseUrl + "admin/orders/load_prescription_flatrate_and_product/", params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.orders.table_order_article.row.add(result.data).draw();
		}
	}, true, null, $.lang.item("loading_data"));
}


$.orders.checkAndAddAdditionalPaymentArticle = function(debitor_id) {

	let params = [
		{"name": "debitor_id", "value": debitor_id},
		{"name": "rendermode", "value": "JSON"}
	];

	var order_id = $('#i_order_id').val();
	var check = false;
	if(order_id == "")
	{
		check = true;
	}

	if (check == true)
	{
		$.app.sendAjaxRequest(baseUrl + "admin/orders/check_and_add_additional_payment_article/", params, function success(result) {
			if (result.error && result.error != "") {
				$.dialog.error($.lang.item("error"), result.error);
			} else {
				if (result.data.has_additional_payment == "1") {
					$.orders.table_order_article.row.add(result.data.additional_payment_article).draw();
				}

			}
		}, true, null, $.lang.item("loading_data"));
	}
}

$.orders.init_order_articles_table = function(order_id)
{
	if ($.orders.table_order_article != undefined){
		$.orders.table_order_article.destroy();
	}

	if ($("#tbl_order_articles").length > 0 && order_id != undefined)
	{
		let debitor_id = $("#i_order_debitor_id").val();

		let options = {
			rowId: 'article_id',
			destroy: 'true',
			deferRender: true,
			serverSide: false,
			searching:false,
			paging:false,
			processing:false,
			info:false,
			order: [[12, "desc"]],
		};

		let target = baseUrl+"admin/orders/datatable_articles/"+table_type_order_articles+"/"+order_id;
		let columns = tbl_columns_order_articles;

		if (order_action == order_preview_action || $('input[name="subsequent_delivery"]').val() > 0){
			target = baseUrl+"admin/orders/datatable_preview_articles/"+order_id;
			if ($('input[name="subsequent_delivery"]').val() > 0)
			{
				target += "/"+table_type_subsequent_delivery_articles;
			}
			columns = tbl_columns_preview_order_articles;
		}

		$.orders.table_order_article = $.app.datatable.initialize_ajax("tbl_order_articles", target, columns,
			function(row, data, index){
				$.app.toConsole({"fkt":"row_callback", "row":row, "data":data, "index":index});
				$(row).find("input.article-price").autoNumeric('init', $.app.autonumeric_options_currency);
				$(row).find("input.article-additional-amount").autoNumeric('init', $.app.autonumeric_options_currency)
				$(row).find("input.article-price").off("mouseleave").mouseleave($.orders.onOrderArticleChange);
				$(row).find("input.article-amount").off("mouseleave").mouseleave($.orders.onOrderArticleChange);
				$(row).find("input.article-additional-amount").off("mouseleave").mouseleave($.orders.onOrderArticleChange);
			},
			function (settings, json){
				$('#tbl_order_articles .dataTables_empty').parent().remove();
				$.app.toConsole({"fkt":"init_complete", "settings":settings, "json":json});
				$.orders.toggleOrderButton();
				$.app.init_select2();
				$.orders.select_default_piece();
				$.orders.init_external_phrases_selection();
				$.orders.onSampleOrderChange(null, true);

				/*
				if ($('#tbl_order_articles').find('.isAdditionalPaymentArticle').length == 0){
					$.orders.checkAndAddAdditionalPaymentArticle( $("#i_order_debitor_id").val());
				}
				*/
			},
			options
		);
	}
};

$.orders.init_order_articles_subsequent_delivery_table = function(order_id, subsequent_delivery)
{
	if ($.orders.table_order_article_subsequent_delivery != undefined){
		$.orders.table_order_article_subsequent_delivery.destroy();
	}

	if ($("#tbl_order_articles_subsequent_delivery").length > 0 && order_id != undefined)
	{
		let debitor_id = $("#i_order_debitor_id").val();

		let options = {
			rowId: 'article_id',
			destroy: 'true',
			deferRender: true,
			serverSide: false,
			searching:false,
			paging:false,
			processing:false,
			info:false,
			order: [[12, "desc"]],
			//serverside: false,
			//ajax: null,
		};

		let target = baseUrl+"admin/orders/datatable_articles/"+table_type_subsequent_delivery_articles+"/"+order_id;
		let columns = tbl_columns_order_articles_subsequent_delivery;

		$.orders.table_order_article_subsequent_delivery = $.app.datatable.initialize_ajax("tbl_order_articles_subsequent_delivery", target, columns,
			function(row, data, index){
				$.app.toConsole({"fkt":"row_callback_subsequent_delivery", "row":row, "data":data, "index":index});
				$(row).find("input.article-price").autoNumeric('init', $.app.autonumeric_options_currency);
				$(row).find("input.article-additional-amount").autoNumeric('init', $.app.autonumeric_options_currency)
			},
			function (settings, json){
				$('#tbl_order_articles_subsequent_delivery .dataTables_empty').parent().remove();
				$.app.toConsole({"fkt":"init_complete_subsequent_delivery", "settings":settings, "json":json});
				//$.orders.toggleOrderButton();
				$.app.init_select2();
				$.orders.select_default_piece("tbl_order_articles_subsequent_delivery");
				$.orders.init_external_phrases_selection();
				//$.orders.onSampleOrderChange(null, true);
			},
			options
		);
		//$('#tbl_order_articles_subsequent_delivery .dataTables_empty').parent().remove();
		//$.orders.select_default_piece("tbl_order_articles_subsequent_delivery");

	}

	if ($.orders.table_order_sent_subsequent_delivery != undefined){
		$.orders.table_order_sent_subsequent_delivery.destroy();
	}

	if ($("#tbl_order_sent_subsequent_delivery").length > 0 && order_id != undefined)
	{
		let debitor_id = $("#i_order_debitor_id").val();

		let options = {
			destroy: 'true',
			deferRender: true,
			serverSide: false,
			searching:false,
			paging:false,
			processing:false,
			info:false,
			order: [[2, "desc"]],
			columnDefs: [
				{className: "details-control", targets: 'details-control'},
			],
			rowId: "subsequent_delivery",
			createdRow: function (row, data, index) {
				$(row).closest("tr").addClass("dtrg-group-custom");
				/*if (data.count_children == 0) {
					$("td", row).eq(0).removeClass("details-control");
				}*/
			},
		};



		let target = baseUrl+"admin/orders/load_order_sent_subsequent_delivery_row/"+order_id;
		let columns = tbl_columns_sent_subsequent_delivery;

		$.orders.table_order_sent_subsequent_delivery = $.app.datatable.initialize_ajax("tbl_order_sent_subsequent_delivery", target, columns,
			function(row, data, index){
			/*
				$.app.toConsole({"fkt":"row_callback_subsequent_delivery", "row":row, "data":data, "index":index});
				$(row).find("input.article-price").autoNumeric('init', $.app.autonumeric_options_currency);
				$(row).find("input.article-additional-amount").autoNumeric('init', $.app.autonumeric_options_currency)
				*/

			},
			function (settings, json){
				// Add Event-Listener to expand child-rows
				$.orders.table_order_sent_subsequent_delivery.off('click', 'td.details-control').on('click', 'td.details-control', function (evt)
				{
					var tr 	= $(this).closest('tr');
					var row = $.orders.table_order_sent_subsequent_delivery.row( tr );

					$.orders.row_subsequent_delivery_details_articles(tr, row);
				});
			/*
				$('#tbl_order_articles_subsequent_delivery .dataTables_empty').parent().remove();
				$.app.toConsole({"fkt":"init_complete_subsequent_delivery", "settings":settings, "json":json});
				//$.orders.toggleOrderButton();
				$.app.init_select2();
				$.orders.select_default_piece("tbl_order_articles_subsequent_delivery");
				$.orders.init_external_phrases_selection();
				//$.orders.onSampleOrderChange(null, true);
				*/
			},
			options
		);
	}
};

$.orders.init_articles_not_in_order_table = function(order_id)
{
	if ($("#tbl_articles").length > 0)
	{
		$.app.toConsole({"fkt":"$.orders.init_articles_not_in_order_table"});

		let debitor_id = $("#i_order_debitor_id").val();
		var append_data_function = function (data) {
			data.order_table_articles = $.orders.getArticlesInOrdersTable();
			data.initial_load = ($.orders.table_article == undefined);
			data.filter_article_group = $("#i_article_group").val();
			data.filter_statistic_group = $("#i_statistic_group").val();
		};
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		var options = {
			rowId: 'article_id',
			destroy: 'true',
			deferRender: true,
			serverSide: true,
			order: [
				[10, "desc"],
				//[7, "asc"],
				//[4, "asc"]
			],
			"firstAjax": 		false,
			"iDeferLoading": 	0,
		};
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		var target = baseUrl+"admin/orders/datatable_articles/"+table_type_articles_not_in_order+"/"+order_id;
		
		$.orders.table_article = $.app.datatable.initialize_ajax("tbl_articles", target, tbl_columns_articles,
			function(row, data, index){
				$.app.toConsole({"fkt":"row_callback", "row":row, "data":data, "index":index});
				//$.orders.init_drag_and_drop(row);
			},
			function (settings, json){
				$.app.toConsole({"fkt":"init_complete", "settings":settings, "json":json});
				$.orders.table_article?.on( 'draw.dt', function () {
					$.app.unblockUI("#form_articles");
				} );
				$("#bt_order_now_order").removeAttr("disabled");
				if(!($('input[name="subsequent_delivery"]').val() > 0)) {
					$("#bt_submit_order, #bt_submit_order_bottom").removeAttr("disabled");
				}
				//$.orders.init_drag_and_drop_manipulation();
				$.orders.overwriteDefaultDatatableSearchBehaviour();
			},
			options,
			append_data_function
		);
	}
};

$.orders.init_edit_preview = function()
{
	$.app.toConsole("init_edit_preview:");
	if ($("#mdl_order_preview").length > 0) {
		//alert("tbl_preview_child_orders");
		//$("#tbl_preview_child_orders").DataTable();

		var options = {
			//rowId: 'order_id',
			destroy: 'false',
			deferRender: true,
			serverSide: false,
			order: [[ 4, 'desc']],
			lengthMenu: [[-1], ["Alles"]],
			columnDefs: [
				{className: "details-control", targets: 'details-control'},
				{type: "ddMmYyyy", targets: ['supply_from','supply_to' ]},
			],
			rowId: 'order_id_key',
			createdRow: function(row, data, index){
				$(row).closest('tr').addClass('dtrg-group-custom');
				if (data.count_children == 0){
					$('td',row).eq(0).removeClass( 'details-control');
				}
			}
		};



		// Open this row with details
		//row.child( result.data ).show();
		let table = $('#tbl_preview_child_orders').DataTable(options);
		$('#tbl_preview_child_orders').find("tr:has(.is_deleted)").addClass('is_deleted');

		// Add Event-Listener to expand child-rows
		$('#tbl_preview_child_orders').off('click', 'td.articles-details-control').on('click', 'td.articles-details-control', function (evt)
		{
			let item = $(this);
			let parent = item.parent();
			let a_row = table.row(parent);
			$.orders.row_details_articles(parent, a_row, 'orders', 'edit');
		});

		$('#tbl_preview_child_orders_length').hide();
		$('#tbl_preview_child_orders_filter').hide();
		$('#tbl_preview_child_orders_paginate').hide();

		$("#form_order_preview").submit(function (e) {
			$.app.blockUI();

			let theModal = $(this).closest("div.modal[role=dialog]");
			$.orders.save_preview(theModal);

			e.preventDefault();
		});

		$.app.init_datepicker();



		/*
		if ($('#tbl_preview_child_orders').length > 0)
		{
			$.orders.table_preview = $.app.datatable.initialize_ajax(
				"tbl_preview_child_orders",
				"",
				tbl_columns_order_preview,
				$.app.datatable.callbacks.rowCallback,
				$.app.datatable.callbacks.initComplete,
				options,

			);
		}

		 */

	}

	//$('#mdl_order_preview').modal('show');
}

$.orders.addOrderArticleRow = function(order_id)
{
	//use document because some rows will be hidden because of paging
	$(document).on("click", ".add-article-to-order", function (e)
	{
		var tr_article_id = $(this).parents('tr').attr('id');
		
		//extra check if article already is in orders, clicking too fast adds twice
		if ($.inArray(tr_article_id, $.orders.getArticlesInOrdersTable()) == -1)
		{
			var row_data = $.orders.table_article.row( $(this).parents('tr') ).data();
			
			// ..::::::::::: manipulate data :::::::::::::::::::::..
			
			// button switch
			var row_button = $(row_data.article_number);
			row_button.find('.add-article-to-order').hide();
			row_button.find('.remove-article-from-order').show();
			
			// amount
			var row_amount = $(row_data.amount);
			row_amount.attr("disabled", false);
			//row_amount.val("1");
			
			// price -> input with autonumeric init
			var row_price ='<input id="i_article_price_'+tr_article_id+'" name="price['+tr_article_id+'][]" type="text" '+
				//'article-price="0,00 €" '+
				//'sample-price="0,00 €" '+
				'value="'+row_data.unit_price+'" min="1" class="form-control article-price" style="width:100%;" placeholder="'+$.lang.item("price")+'">';
			
			// icon / checkbox switch
			var row_charges_apply = $(row_data.charges_apply);
			var row_article_unit = $(row_data.unit_id);

			if($("#i_sample_order").is(":checked"))
			{
				row_charges_apply.find('.charges-apply-cb').hide();
				row_charges_apply.find('.charges-apply-amount').hide();
				row_charges_apply.find('.charges-apply-display').hide();
				row_charges_apply.find('.charges-apply-cb').attr("checked", false);
				row_charges_apply.find('.article-charges-apply').attr("checked", false);
			}
			else
			{
				row_charges_apply.find('.charges-apply-cb').show();
				row_charges_apply.find('.charges-apply-amount').show();
				row_charges_apply.find('.charges-apply-display').hide();

				if ($('#i_generate_payment_contract').val() == "1"){
					row_charges_apply.find('.charges-apply-cb').attr("checked", true);
					row_charges_apply.find('.article-charges-apply').attr("checked", true);
				}
			}
			$.app.toConsole({item:row_article_unit});
			/*
			if(row_data.automatic_payment_model == 1)
			{
				row_data.additional_amount = row_data.unit_price * row_data.amount;
			}
			 */

			var row_additional_amount = '<input id="i_additional_amount_'+tr_article_id+'" name="additional_amount['+tr_article_id+'][]" type="text" is_new="1" '+
				'value="'+row_data.additional_amount+'" min="0" class="form-control article-additional-amount" style="width:100%;" placeholder="'+$.lang.item("additional_amount")+'">';



			var insert_row_data = {};
			insert_row_data["control_col"] = row_data.control_col;
			insert_row_data["draggable"] = row_data.draggable;
			insert_row_data["article_number"] = row_button.html();
			insert_row_data["article_name"] = row_data.article_name;
			insert_row_data["amount"] = row_amount[0].outerHTML;
			insert_row_data["price"] = row_price;
			insert_row_data["charges_apply"] = row_charges_apply.html();
			insert_row_data["unit_id"] = row_data.unit_id;
			insert_row_data["article_id"] = tr_article_id;
			insert_row_data["order_id"] = order_id;
			insert_row_data["article_id_abena"] = row_data.article_id_abena;
			insert_row_data["article_aidnumber"] = row_data.article_aidnumber;
			insert_row_data["location"] = row_data.location;
			insert_row_data["article_is_immutable"] = row_data.article_is_immutable;
			insert_row_data["additional_amount"] = row_additional_amount;
			insert_row_data["copayment_amount"] = row_data.copayment_amount;
			insert_row_data["line_amount"] = row_data.line_amount;
			insert_row_data["additional_payment_mode"] = "";
			insert_row_data["adjuvant_id"] = "";
			insert_row_data["subsequent_delivery_date_formatted"] = "";
			//insert_row_data["supplier_key"] = row_data.supplier_key;
			$.app.blockUI("#form_articles");
			if ($('input[name="subsequent_delivery"]').val() > 0)
			{
				$.orders.table_order_article_subsequent_delivery.row.add(insert_row_data).draw();
			}
			else {
				$.orders.table_order_article.row.add(insert_row_data).draw();
			}
			$("#tbl_order_articles > tbody").off("change").change($.orders.onOrderArticleChange);
			$('#i_article_price_'+tr_article_id).autoNumeric("init", $.app.autonumeric_options_currency);
			$('#i_additional_amount_'+tr_article_id).autoNumeric("init", $.app.autonumeric_options_currency);
			$('#i_article_amount_'+tr_article_id).val(1);
			$('#i_article_amount_'+tr_article_id).off("mouseleave").mouseleave($.orders.onOrderArticleChange);
			$('#i_article_price_'+tr_article_id).off("mouseleave").mouseleave($.orders.onOrderArticleChange);
			$('#i_additional_amount_'+tr_article_id).off("mouseleave").mouseleave($.orders.onOrderArticleChange);
			$.orders.setAdditionalPayment(row_data);
			$('.article-amount').eq(0).trigger("mouseleave");
			
			//$.app.blockUI("#form_articles");
			$.orders.table_article.row("#"+tr_article_id).remove().draw();
			$.orders.toggleOrderButton();

			var row_unit_id = $(row_data.unit_id);
			$.app.init_select2(row_unit_id.find('select').attr('id'));
			$.orders.select_default_piece();

			//$.orders.onSampleOrderChange(null, true);
			$.orders.onSampleOrderChange();
		}

		//just to be sure ¯\_(ツ)_/¯
		e.preventDefault();
		e.stopPropagation();
		e.cancelBubble = true;
		e.stopImmediatePropagation();
		$.orders.select_default_piece();
		//$('#i_unit_id_${tr_article_id}').trigger("change");
	});
};

$.orders.onSampleOrderChange = function (ev, edit)
{
	$('#tbl_order_articles .charges-apply-display').hide();
/*
	if($("#i_sample_order").is(":checked"))
	{
		$('#tbl_order_articles .charges-apply-cb').hide()
		$('#tbl_order_articles .charges-apply-cb').hide();
		$('#tbl_order_articles .charges-apply-amount').hide();
		$('#tbl_order_articles .charges-apply-display').hide();
		$('#tbl_order_articles .charges-apply-cb').attr("checked", false);
		$('#tbl_order_articles .article-charges-apply').attr("checked", false);
		$('#tbl_order_articles .article-price').val(function(){
			return $(this).attr("sample-price");
		});
	}
	else
	{
		$('#tbl_order_articles .charges-apply-cb').show();
		$('#tbl_order_articles .charges-apply-amount').show();
		$('#tbl_order_articles .charges-apply-display').hide();
		if (!edit){
			if ($('#i_generate_payment_contract').val() == "1"){
				$('#tbl_order_articles .charges-apply-cb').attr("checked", true);
				$('#tbl_order_articles .article-charges-apply').attr("checked", true);
			}
			else {
				$('#tbl_order_articles .charges-apply-cb').attr("checked", false);
				$('#tbl_order_articles .article-charges-apply').attr("checked", false);
			}
		}

		$('#tbl_order_articles .article-price').val(function(){
			return $(this).attr("article-price");
		});
	}
	*/

}

$.orders.removeOrderArticleRow = function()
{
	$(document).on("click", ".remove-article-from-order", function (e)
	{
		var atr_id = $(this).parents('tr').attr('id');
		var subsequent_delivery = $('#i_subsequent_delivery').val();
		
		$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("article_from_order_sure_remove"), function callback_yes()
		{
			if (subsequent_delivery > 0)
			{
				$.orders.table_order_article_subsequent_delivery.row("#"+atr_id).remove().draw();
			}
			else {
				$.orders.table_order_article.row("#"+atr_id).remove().draw();
			}
			$.orders.table_article.draw();
			$.orders.toggleOrderButton();
		}, null, $.lang.item("article_remove_from_order"), $.lang.item("cancel"));

		e.preventDefault();
		e.stopPropagation();
		e.cancelBubble = true;
		e.stopImmediatePropagation();
	});
	
};

$.orders.getArticlesInOrdersTable = function()
{
	var articles_in_order_table = [];

	if($('input[name="subsequent_delivery"]').val() > 0)
	{
		if($.orders.table_order_article_subsequent_delivery != null) {
			$.orders.table_order_article_subsequent_delivery.rows().nodes().to$().each(function (index, element) {
				articles_in_order_table.push(element.id)
			});
		}
	}
	else{
		if($.orders.table_order_article != null) {
			$.orders.table_order_article.rows().nodes().to$().each(function (index, element) {
				articles_in_order_table.push(element.id)
			});
		}
	}
	
	return JSON.stringify(articles_in_order_table);
};

$.orders.fillStatisticGroupDropdown = function()
{
	$("#i_statistic_group").html("<option></option>");
	
	if ($("#i_article_group").val() == "")
	{
		$.each(available_statistic_groups, function (indx, item)
		{
			$.each(item, function (index, statistic_group)
			{
				$("#i_statistic_group").append('<option value="'+statistic_group.group_id+'">'+statistic_group.group_name+' </option>');
			});
		});
	}
	else
	{

		$.each(available_statistic_groups[$("#i_article_group").val()], function (index, statistic_group)
		{
			$("#i_statistic_group").append('<option value="'+statistic_group.group_id+'">'+statistic_group.group_name+' </option>');
		});
	}
};

/**
 * @deprecated
 * @param order_parent
 * @param schedule_id
 */
// $.orders.save_date_change_to_scheduled_order = function(order_parent, schedule_id)
// {
// 	var params = [
// 		{"name": "order_parent", "value": order_parent},
// 		{"name": "schedule_id", "value": schedule_id},
// 		{"name": "order_date", "value": $("#i_scheduled_order_date").val()},
// 		{"name": "rendermode", "value": "ajax"}
// 	];
//
// 	var target = baseUrl + "admin/orders/save_date_change_to_scheduled_order/";
//
// 	$.dialog.confirm($.lang.item("msg_are_you_sure"), $.lang.item("save_date_change_to_scheduled_order"), function callback_yes()
// 	{
// 		$.app.sendAjaxRequest(target, params, function success(result)
// 		{
// 			$.app.toConsole({"fkt": "callback_ajax", "result": result});
// 			if (result.error && result.error != "")
// 			{
// 				$.dialog.error($.lang.item("error"), result.error);
// 			}
// 			else
// 			{
// 				$.dialog.success($.lang.item("done"), $.lang.item("saved"), function callback()
// 				{
// 					var on_content_replaced = function() {
// 						$.app.init_datepicker();
// 					}
// 					$.app.replaceContent(result.data, on_content_replaced, 'order-additions-tab-delivery-plan');
// 				});
// 			}
// 		}, true, null, "");
//
// 	}, null, $.lang.item("save_date_change"), $.lang.item("cancel"));
// }

/**
 * @deprecated
 * @param order_parent
 * @param schedule_id
 * @param new_state
 */
// $.orders.change_scheduled_order_state = function(order_parent, schedule_id, new_state)
// {
// 	var params = [
// 		{"name": "order_parent", "value": order_parent},
// 		{"name": "schedule_id", "value": schedule_id},
// 		{"name": "order_state", "value": new_state},
// 		{"name": "rendermode", "value": "ajax"}
// 	];
//
// 	var target = baseUrl + "admin/orders/change_scheduled_order_state/";
//
// 	var changed_state_text = "";
// 	if (new_state == scheduled_order_status_skipped){
// 		changed_state_text = $.lang.item("scheduled_order_skipped");
// 	}
//
// 	if (new_state == scheduled_order_status_cancelled){
// 		changed_state_text = $.lang.item("scheduled_order_cancelled");
// 	}
//
// 	$.dialog.confirm($.lang.item("msg_are_you_sure"), $.lang.item("change_state_scheduled_order"), function callback_yes()
// 	{
// 		$.app.sendAjaxRequest(target, params, function success(result)
// 		{
// 			$.app.toConsole({"fkt": "callback_ajax", "result": result});
// 			if (result.error && result.error != "")
// 			{
// 				$.dialog.error($.lang.item("error"), result.error);
// 			}
// 			else
// 			{
// 				$.dialog.success($.lang.item("done"), changed_state_text, function callback()
// 				{
// 					var on_content_replaced = function() {
// 						$.app.init_datepicker();
// 					}
// 					$.app.replaceContent(result.data, on_content_replaced, 'order-additions-tab-delivery-plan');
// 				});
// 			}
// 		}, true, null, "");
// 	}, null, $.lang.item("change_state_of_scheduled_order"), $.lang.item("cancel"))
// }

/**
 * Check if prescription needs a cost estimate or not and whether it's been approved or not
 */
$.orders.toggleOrderButton = function()
{
	let nrArticlesInOrder = 0;
	let prescription_id = $("#i_order_prescription_id").val();
	if ($.orders.table_order_article !== undefined){
		let articlesInOrder =  JSON.parse($.orders.getArticlesInOrdersTable());
		nrArticlesInOrder =  articlesInOrder.length;
	}
	if (nrArticlesInOrder >= 0 )
	{
		//if (order_action !== order_preview_action && !($('input[name="subsequent_delivey"]').val() > 0))
		if (order_action !== order_preview_action)
		{
			let sample_order = $("#i_sample_order").parents('.toggle').hasClass('off') === false;

			let params = [
				{"name": "prescription_id", "value": prescription_id},
				{"name": "order_id", "value": $('#i_order_id').val()},
				{"name": "rendermode", "value": "json"}
			];

			if (sample_order || prescription_id == null || prescription_id == '')
			{
				$("#fi_supply_mode").hide();
				$("#fi_supply_type").hide();
				$("#fi_continuous_delivery").hide();
				$("#fi_fixed_date").hide();
				$.orders.updateDeliveryOptions();
				$("#fi_can_not_be_ordered").hide();
				$("#fi_order_count_of_months").hide();
				$("#fi_order_count_of_prescription_orders").hide();
				$("#fi_order_put_additonal_order_together").hide();
				$("#fi_order_combine_additional_orders").hide();
				$("#fi_order_take_prescription_positions").hide();
				$("#fi_number_of_months_per_contract").hide();
				$("#i_select_month_count").parent().hide();
				if(sample_order)
				{
					$("#fi_order_now").show();
				}
				else
				{
					$("#fi_order_now").hide();
				}

				$("#fi_order_prescription_id").removeClass('required');
			}
			else
			{
				$("#fi_order_count_of_prescription_orders").show();
				$("#fi_order_put_additonal_order_together").show();
				$("#fi_order_combine_additional_orders").show();
				$("#fi_order_take_prescription_positions").show();
				$("#fi_order_count_of_months").show();
				$("#fi_number_of_months_per_contract").show();
				if($('#i_number_of_months_per_contract_lbl div.toggle.off').length > 0)
				{
					$("#i_select_month_count").parent().show();
				}
				else
				{
					$("#i_select_month_count").parent().hide();
				}

				$("#fi_order_prescription_id").addClass('required');
				if (prescription_id !== "" && prescription_id !== null)
				{
					$("#fi_supply_mode").show();
					$("#fi_supply_type").show();
					$("#fi_continuous_delivery").show();
					$("#fi_fixed_date").show();
					$.orders.updateDeliveryOptions();

					if($("#i_order_parent").val() == "" &&  $("#i_order_has_childs").val() == "1")
					{
						$("#fi_can_not_be_ordered").hide();
						$("#fi_order_now").hide();
					}
					else {
						$.app.sendAjaxRequest(baseUrl + "admin/orders/check_if_order_can_be_ordered/" + prescription_id, params, function success(result) {
							$.app.toConsole({"fkt": "callback_ajax", "result": result});
							if (result.error && result.error != "") {
								$.dialog.error($.lang.item("error"), result.error);
								$("#fi_can_not_be_ordered").show();
								$("#fi_order_now").hide();
							} else {
								if (result.data.order_can_be_ordered === false && sample_order === false) {
									$("#reason_not_orderable").html(result.extra[0]);
									$("#fi_can_not_be_ordered").show();
									$("#fi_order_now").hide();
								} else {
									$("#fi_can_not_be_ordered").hide();
									$("#fi_order_now").show();
								}

							}
						}, true, null, "");
					}
				}
				else
				{
					$("#fi_can_not_be_ordered").hide();
					$("#fi_order_now").hide();
				}
			}
		}
		else {
			$("#fi_can_not_be_ordered").hide();
			$("#fi_order_now").hide();
		}
	}
	else
	{
		if(prescription_id != '')
		{
			$("#fi_order_count_of_prescription_orders").show();
			$("#fi_order_put_additonal_order_together").show();
			$("#fi_order_combine_additional_orders").show();
			$("#fi_order_take_prescription_positions").show();
			$("#fi_order_count_of_months").show();
			$("#fi_order_now").hide();
			$("#fi_order_prescription_id").addClass('required');
		}
		else
		{
			$("#fi_supply_mode").hide();
			$("#fi_supply_type").hide();
			$("#fi_continuous_delivery").hide();
			$("#fi_fixed_date").hide();
			$.orders.updateDeliveryOptions();
			$("#fi_can_not_be_ordered").hide();
			$("#fi_order_count_of_months").hide();
			$("#fi_order_count_of_prescription_orders").hide();
			$("#fi_order_put_additonal_order_together").hide();
			$("#fi_order_combine_additional_orders").hide();
			$("#fi_order_take_prescription_positions").hide();
			$("#fi_order_prescription_id").removeClass('required');
			$("#fi_order_now").hide();
		}
	}
};

$.orders.getCountMonthsFromPrescription = function()
{
	let prescription_id = $("#i_order_prescription_id").val();
	if(prescription_id != '')
	{
		let params = [
			{"name": "prescription_id", "value": prescription_id},
			{"name": "rendermode", "value": "json"}
		];

		let target = baseUrl + "admin/prescriptions/get_count_months/"+prescription_id;

		$.app.sendAjaxRequest(target, params, function success(result)
		{
			$.app.toConsole({"fkt": "callback_ajax", "result": result});
			if (result.error && result.error != "") {
				$.dialog.error($.lang.item("error"), result.error);
			}
			else {
				if (result.data.length > 0){
					//$("#i_order_count_of_months").val(result.data[0].count_of_months);
					$("#i_order_count_of_prescription_orders").val(result.data[0].count_of_months);
				}
			}
		}, true, null, "");
	}


}

/**
 * initialize the order overview table
 **/
$.orders.init_table = function()
{
	if ($("#tbl_order").length > 0)
	{
		$.app.toConsole({"fkt":"$.orders.init_table"});
		
		var options = {
			//rowId: 'order_id',
			destroy: 'true',
			deferRender: true,
			serverSide: true,
			order: [[ 4, 'desc']],
			columnDefs: [
				{className: "details-control", targets: 'details-control'},
				{type: "ddMmYyyy", targets: ['supply_from','supply_to' ]},
			],
			rowId: 'order_id_key',
			createdRow: function(row, data, index){
				$(row).closest('tr').addClass('dtrg-group-custom');
				if (data.count_children == 0){
					$('td',row).eq(0).removeClass( 'details-control');
				}
			}
		};
		
		$.orders.table = $.app.datatable.initialize_ajax(
			"tbl_order",
			baseUrl+"admin/orders/datatable",
			tbl_columns_order,
			$.app.datatable.callbacks.rowCallback,
			$.app.datatable.callbacks.initComplete,
			options,
			function(data){
				data.order_params = $('#i_order_params').val();
			}
		);

		// Add Event-Listener to expand child-rows
		$.orders.table.off('click', 'td.details-control').on('click', 'td.details-control', function (evt)
		{
			var tr 	= $(this).closest('tr');
			var row = $.orders.table.row( tr );

			$.orders.row_details(tr, row, 'orders', 'edit');
		});
	}

}
/*
$.orders.init_table = function()
{
	if ($("#tbl_order").length > 0)
	{
		$.app.toConsole({"fkt":"$.orders.init_table"});

		var options = {
			//rowId: 'debitor_id',
			destroy: 'true',
			deferRender: true,
			serverSide: false,
			order: [[ 10, 'desc']],
			//orderFixed: [[10, 'desc']],
			//order: [[ 3, 'asc']],
			rowGroup: {
				startRender: $.orders.startRender,
				endRender: null,
				dataSrc: 'order_parent'
			}
		};
		
		$.orders.table = $.app.datatable.initialize_ajax("tbl_order", baseUrl+"admin/orders/datatable", tbl_columns_order,
			$.app.datatable.callbacks.rowCallback,
			$.app.datatable.callbacks.initComplete,
			options
		);
	}

}
*/

/**
 * Print Prescription duration "(dd.MM.yyyy - dd.MM.yyyy)".
 * @author Vincent Menzel
 */
$.orders.updatePrescriptionDuration = function () {
	try {
		// don't update if child order. Under race conditions sometimes this is called also for a child.
		if ($("#i_order_parent").val() != "")
		{
			return;
		}

		const prescriptionId = $("#i_order_prescription_id").val();
		const infoLabel = $("#i_order_prescription_id_infotext_duration");
		if (!prescriptionId || prescriptionId == '')
		{
			if (infoLabel.length != 0 ) {
				infoLabel.html('');
			}
			return;
		}


		const selectedOption = $(`#i_order_prescription_id > [value=${prescriptionId}]`)
		const validFrom = selectedOption.attr("prescription_valid_from");
		const validTill = selectedOption.attr("prescription_valid_till");
		const infoField = $("#i_order_prescription_id_infotext");

		$('#i_supply_from').val(validFrom);
		$('#i_supply_to').val(validTill);

		/**
		 * @param {Date} date
		 * @return {{month: string, year: string, day: string}}
		 */
		const extractFromDate = function (date) {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return {
				day: day < 10 ? `0${day}` : day.toString(),
				month: month < 10 ? `0${month}` : month.toString(),
				year: year.toString()
			};
		}

		/**
		 * @param {string|number} day
		 * @param {string|number} month
		 * @param {string|number} year
		 * @return {string}
		 */
		const format = ({day, month, year}) => `${day}.${month}.${year}`;

		const fromDate = new Date(Number(validFrom) * 1000);
		const tillDate = new Date(Number(validTill) * 1000);


		const infoContent =  `${format(extractFromDate(fromDate))} - ${format(extractFromDate(tillDate))}`;
		const infoHtml = `<div id="i_order_prescription_id_infotext_duration" class="text-info">${infoContent}</div>`;

		if (infoLabel.length === 0 ) {
			infoField.append(infoHtml);
		} else {
			infoLabel.html(infoContent);
		}

	} catch (e) {
		console.error(e)
	}
}

/**
 *
 * @returns {Promise<boolean>}
 */
$.orders.getDurationForPrescription =  function () {
	return new Promise((resolve, reject) => {
		// if ($("#select2-i_select_month_count-results").children().length <= 2) {
		// 	return resolve(false)
		// }

		const params = {
			prescriptionId: $("#i_order_prescription_id").val(),
		};

		if (!params.prescriptionId) {
			return resolve(false);
		}

		const target = `${baseUrl}/admin/orders/getPrescriptionDurationFromId`;
		$.app.sendAjaxRequest(target, params, function ({data}) {
			if (data.length === 0 || !Array.isArray(data)) return;

			const duration = Math.abs(data[0]);
			const currentMonth = Math.abs(data[1]);


			$("#i_select_month_count").html('<option id="ALL" value="" title="" data-original-title=""></option>');
			$("#i_select_month_count").append(`<option value="3" selected>3</option>`);

			for (let i = 1; i <= duration; i++) {

				if (12 % i !== 0 || i === 3) continue;

				$("#i_select_month_count").append(`<option value="${i}" >${i}</option>`);

			}

			let selectedMonth = $("#i_how_many_month_start_change").val()
			if(currentMonth > selectedMonth)
			{
				selectedMonth = currentMonth;
			}

			$("#i_how_many_month_start_change").html('');
			for (let i = 0; i < duration; i++) {
				let selected = '';
				if (selectedMonth == i)
				{
					selected = 'selected';
				}
				$("#i_how_many_month_start_change").append(`<option value="${i}" ${selected}>`+(i + 1)+'. '+$.lang.item('month')+'</option>');
			}

			if($.orders.USE_ALL_MONTH_FOR_START_DELIVERY == false) {
				$.orders.init_how_many_month_start_delivery();
			}
			else {
				let selectedDeliveryMonth = $("#i_how_many_month_start_delivery").val();
				let count_month_for_orders = parseInt($("#i_order_count_of_months").val());

				$("#i_how_many_month_start_delivery").html('');
				for (let i = 0; i < duration; i += count_month_for_orders) {
					let selected = '';
					if (selectedDeliveryMonth == i) {
						selected = 'selected';
					}
					$("#i_how_many_month_start_delivery").append(`<option value="${i}" ${selected}>` + (i + 1) + '. ' + $.lang.item('month') + '</option>');
				}
			}

			resolve(true);
		}, false, false, null, function () {
			resolve(false);
		});
	})
}

$.orders.init_how_many_month_start_delivery = function () {
	if($.orders.USE_ALL_MONTH_FOR_START_DELIVERY == false) {
		let continousDeliveryInterval = $("input:radio[name='how_many_month']:checked").val();
		let selectedDeliveryMonth = $("#i_how_many_month_start_delivery").val();

		$("#i_how_many_month_start_delivery").html('');

		let count_month_for_orders = parseInt($("#i_order_count_of_months").val());

		for (let i = 0; i < continousDeliveryInterval; i += count_month_for_orders) {
			let selected = '';
			if (selectedDeliveryMonth == i) {
				selected = 'selected';
			}
			$("#i_how_many_month_start_delivery").append(`<option value="${i}" ${selected}>` + (i + 1) + '. ' + $.lang.item('month') + '</option>');
		}

		if ($("input:radio[name='how_many_month']:checked").val() > 1) {
			$("#i_how_many_month_start_delivery").show();
		} else {
			$("#i_how_many_month_start_delivery").hide();
		}
	}
}

$.orders.updateArticleList = function () {
	const isMuster = $("#i_sample_order").is(":checked");
	const paymentArticles = $(".isAdditionalPaymentArticle, .prescriptionFlatrateOrArticle") ;

	paymentArticles.each(function () {
		const item = $(this).parent().parent()
		isMuster
			? item.hide()
			: item.show()
	})

	$.orders.onSampleOrderChange();
	//$.orders.onSampleOrderChange(null, true);
}

$.orders.select_default_piece = function (table) {
	if(table == undefined)
	{
		table = "tbl_order_articles";
	}
	try {
		$("#"+table+" > tbody > tr .article-unit-id").each(function () {

			if ($(this).prop("disabled")) return;
			if ($(this).val() !== "") return;

			$(this).val("STCK");
			$(this).trigger("change");

			console.log(`${$(this).selector} STCK autofilled`)
		})

	} catch (e) {
		console.error("couldn't select default piece", e);
	}

}

$.orders.startRender = function ( rows, order_parent ) {

	//create parent tr above the rows, and move the preview button here, works together with row callback
	/*var rowWithPreview = rows.data()[0];
    var previewButton = $("<div>"+rowWithPreview.order_id+"</div>").find('.btn-order-preview');

    var prevHTML = "";
    if (previewButton.length > 0){
        previewButton.addClass("moved-to-parent");
        prevHTML =  previewButton[0].outerHTML;
    } prevHTML+'&nbsp;'*/

	let send_child_order = 0;
	rows.data().each(function (x) {
		if (x.order_state_value != 0 && x.order_state_value != 1)
		{
			send_child_order++;
		}
	});

	let deleteButton = "";
	if(send_child_order == 0)
	{
		deleteButton = `
		<a onclick="$.orders.removeSendOrders('${order_parent}')" class="dtbt_remove btn btn-xs btn-danger">
			<i class="fa fa-trash" title="'${order_parent}'&nbsp;'+$.lang.item('delete')+'"></i>
		</a>`;
	}

	const editButton = `
		<a onclick="$.debitors.edit_debitor_order('${order_parent}')" class="dtbt_edit btn btn-xs btn-primary">
			<i class="fa fa-pencil" title="'${order_parent}'&nbsp;bearbeiten"></i>
		</a>`;
	const label = `<span>${$.lang.item("order_id")+': '+order_parent }</span>`;

	return label + deleteButton + editButton;
};

/**
 * Change default DataTable behaviour to only search if search string length > 3
 */
$.orders.overwriteDefaultDatatableSearchBehaviour = function () {
	const dataTable = $("#tbl_articles").DataTable();
	const searchInput = $("#tbl_articles_filter input")

	const searchValueChanged = (e) => {
		const  searchString = searchInput?.val()?.trim() || "";

		const doSearch = () => {
			dataTable?.search(searchString)?.draw();
			console.log("searching")
		}

		if(searchString.length >= 3 || e.keyCode === 13) {
			doSearch();
		}

		if (e.keyCode === 13) {
			e.preventDefault();
			return false;
		}

		return true;
	}

	searchInput
		.unbind()
		.bind("input", searchValueChanged)
		.keydown(searchValueChanged);
	dataTable
		.on( 'draw.dt', function () {
		$.app.unblockUI("#form_articles");
	} );
}

$.orders.setAdditionalPayment = function(tableRow) {

	let paymentModelType = $(tableRow).find('[id^=i_additional_amount_]').attr('paymentModelType');
	let salesPrice = $(tableRow).find('[id^=i_additional_amount_]').attr('salesPrice');

	if(paymentModelType == undefined)
	{
		return;
	}

	$.app.toConsole({"function": "setAdditionalPayment", "row": tableRow, "len": $(tableRow).find(`[id^=i_article_charges_apply_]`).length});

	if(paymentModelType == 2) // automatic
	{
		$(tableRow).find('[id^=i_additional_amount_]').attr('additional_amount_base', salesPrice);

		let additionalAmountField = $(tableRow).find(`[id^=i_additional_amount_]`);

		if($(tableRow).find(`[id^=i_article_charges_apply_]`).is(':checked'))
		{
			additionalAmountField.val(formatPrice(salesPrice * amountField.val()));
		}
		else {
			additionalAmountField.val(formatPrice(0));
		}
		$(tableRow).find(`[id^=i_additional_amount_]`).attr('readonly', 'readonly')
		$(tableRow).find(`[id^=i_article_charges_apply_]`).show();
		$(tableRow).find(`[id^=i_additional_amount_]`).show();
	}
	else if(paymentModelType == 1) // manual
	{
		$(tableRow).find(`[id^=i_additional_amount_]`).removeAttr('readonly')
		$(tableRow).find(`[id^=i_article_charges_apply_]`).show();
		$(tableRow).find(`[id^=i_additional_amount_]`).show();
	}
	else
	{
		$(tableRow).find(`[id^=i_additional_amount_]`).removeAttr('readonly')
		//$(tableRow).find(`[id^=i_article_charges_apply_]`).hide();
		//$(tableRow).find(`[id^=i_additional_amount_]`).hide();
		$(tableRow).find(`[id^=i_article_charges_apply_]`).show();
		$(tableRow).find(`[id^=i_additional_amount_]`).show();
	}
};

/**
 * @param {InputEvent} $event
 */
$.orders.onOrderArticleChange = async function ($event) {
	try {
		const hasFlatRateArticle = $("#tbl_order_articles .prescriptionFlatrateOrArticle").length > 0;
		const eventTarget = $($event.target);
		const tableRow = eventTarget.closest("tr");
		const chargesApply = $(tableRow).find(".article-charges-apply").is(":checked")
		const priceField = $(tableRow).find(`[id^=i_article_price_]`);
		const amountField = $(tableRow).find(`[id^=i_article_amount_]`);
		const articleId = tableRow.attr("id");
		const debitorId = $("#i_order_debitor_id").val();
		const unitId = $(tableRow).find('[id^=i_unit_id_]').val();//$event.target.value;
		const isChargesApplyChangeEvent = !($event.target.id.search("i_article_charges_apply_") === -1);
		const isUnitIdChangeEvent = !($event.target.id.search("i_unit_id_") === -1);
		const isAmountChangeEvent = !($event.target.id.search("i_article_amount_") === -1);


		if (!isUnitIdChangeEvent && !isChargesApplyChangeEvent && !isAmountChangeEvent) return;

		if (!unitId) return;
		if (!articleId) return;
		if (!debitorId) return;
		//if (priceField.is(":disabled")) return console.warn("priceField disabled");

		/**
		 * @param {string|number} price
		 * @return {string}
		 */
		const formatPrice = (price) => {
			return (Number(price) || 0)
				.toFixed(2)
				.replace(".", ",");
		}



		const payload = {
			unitId,
			articleId,
			debitorId
		}

		const target = `${baseUrl}/admin/articles/getPriceForArticleByDate`

		let {
				/** @type {({sales_price: number}|undefined)} */ data: {
				/** @type {number|undefined} */ sales_price: salesPrice = 0,
				/** @type {number|undefined} */ payment_model_type: paymentModelType = 0
			} = {}
		} = await new Promise((resolve, reject) => {
			$.app.sendAjaxRequest(
				target,
				payload,
				resolve,
				false,
				false,
				false,
				reject,
			);
		});

		if (isNaN(salesPrice)) {
			return console.error("invalid price couldn't autofill");
		}
		if (hasFlatRateArticle && (priceField.val().length === 0 || !chargesApply)) {
			priceField
				.val(formatPrice(0))
				.trigger("focusout");
			//return
		}else{
			priceField
				.val(formatPrice(salesPrice))
				.trigger("focusout");
		}

		$(tableRow).find('[id^=i_additional_amount_]').attr('salesPrice', salesPrice);
		$(tableRow).find('[id^=i_additional_amount_]').attr('paymentModelType', paymentModelType);

		if($(tableRow).find('[id^=i_additional_amount_]').attr('salesprice') > 0)
		{
			salesPrice = $(tableRow).find('[id^=i_additional_amount_]').attr('salesprice');
		}

		$.app.toConsole({"function": "onOrderArticleChange", "row": tableRow, "len": $(tableRow).find(`[id^=i_article_charges_apply_]`).length});
		if(paymentModelType == 2) // automatic
		{
			if (salesPrice == 0)
			{
				$(tableRow).find(`[id^=i_article_charges_apply_]`).prop('checked', false);
			}

			let additionalAmountField = $(tableRow).find(`[id^=i_additional_amount_]`);
			if($(tableRow).find(`[id^=i_article_charges_apply_]`).is(':checked'))
			{
				additionalAmountField.val(formatPrice(salesPrice * amountField.val()));
			}
			else
			{
				additionalAmountField.val(formatPrice(0));
			}
			$(tableRow).find(`[id^=i_additional_amount_]`).attr('readonly', 'readonly')
			$(tableRow).find(`[id^=i_article_charges_apply_]`).show();
			$(tableRow).find(`[id^=i_additional_amount_]`).show();
		}
		else if(paymentModelType == 1) // manual
		{
			/*
			if (salesPrice == 0)
			{
				$(tableRow).find(`[id^=i_article_charges_apply_]`).prop('checked', false);
			}
			 */
			$(tableRow).find(`[id^=i_additional_amount_]`).removeAttr('readonly');
			$(tableRow).find(`[id^=i_article_charges_apply_]`).show();
			$(tableRow).find(`[id^=i_additional_amount_]`).show();

			if($(tableRow).find(`[id^=i_additional_amount_]`).attr('is_new') == 1)
			{
				$(tableRow).find(`[id^=i_additional_amount_]`).removeAttr('is_new');
				$(tableRow).find(`[id^=i_article_charges_apply_]`).prop('checked', true);
			}
		}
		else
		{
			/*
			if (salesPrice == 0)
			{
				$(tableRow).find(`[id^=i_article_charges_apply_]`).prop('checked', false);
			}
			 */
			$(tableRow).find(`[id^=i_additional_amount_]`).removeAttr('readonly')
			$(tableRow).find(`[id^=i_article_charges_apply_]`).show();
			$(tableRow).find(`[id^=i_additional_amount_]`).show();
		}

		if($("#i_sample_order").is(":checked"))
		{
			$(tableRow).find('.article-price').val(function(){
				return $(this).attr("sample-price");
			});
		}
		else
		{
			$(tableRow).find('.article-price').val(function(){
				return $(this).attr("article-price");
			});
		}
	}
	catch (e) {
		console.error(e);
	}
}

/**
 * @typedef DeliveryService
 * @type {Object}
 * @property {string} delivery_service_id
 * @property {string} delivery_service_name
 * @property {string} delivery_service_description
 * @property {string} triggers_fixed_date
 */

/**
 * @type {Array<DeliveryService>}
 */
$.orders.deliveryServices = [];

/**
 * @typedef DeliveryType
 * @type {Object}
 * @property {string} delivery_option_id
 * @property {string} delivery_option_type
 * @property {string} delivery_option_description
 * @property {string} default_delivery_service
 * @property {string} default_storage_location
 * @property {int} check_lager_1
 */

/**
 * @type {Array<DeliveryType>}
 */
$.orders.deliveryTypes = [];

/**
 *	IIF Creates LoadDelivery
 * @desc IIF is used to prevent multiple requests running at the same time
 * @param {boolean} forceReload
 * @function
 */
$.orders.loadDeliveryTypes = (() => {

	let requestRunning = false;

	return async (forceReload = false) => {
		if ($.orders.deliveryTypes.length > 0 && !forceReload) {
			return console.warn("skipped loading deliveryTypes");
		}

		if (requestRunning) {
			return console.warn("loadDeliveryTypes already running")
		}

		requestRunning = true;

		try {
			const {
				/** @type {Array<DeliveryType>} */ data
			} = await new Promise((resolve, reject) => {
				$.ajax({
					url: `${baseUrl}/admin/orders/getDeliveryTypes`,
					success: resolve,
					error: reject
				})
			});

			if (typeof data === "object" && data.length > 0){
				$.orders.deliveryTypes = data;
			}

		} catch (e) {
			console.error(e);
		} finally {
			requestRunning = false
		}

	}
})();

/**
 *	IIF Creates LoadDelivery
 * @desc IIF is used to prevent multiple requests running at the same time
 * @param {boolean} forceReload
 * @param {string|null}  delivery_option_id
 * @param {function|null} callback
 * @function
 */
$.orders.loadDeliveryServices = (() => {

	let requestRunning = false;

	return async (forceReload = true, delivery_option_id = null, callback = null) => {
		if ($.orders.deliveryServices.length > 0 && !forceReload) {
			return console.warn("skipped loading deliveryServices");
		}

		/*
		if (requestRunning) {
			return console.warn("loadDeliveryServices already running")
		}
		 */
		requestRunning = true;

		try {
            let ajaxUrl = `${baseUrl}/admin/orders/getDeliveryServices`;
            if(delivery_option_id)
			{
				ajaxUrl = `${ajaxUrl}/${delivery_option_id}`;
			}
			const {
				/** @type {Array<DeliveryService>} */ data
			} = await new Promise((resolve, reject) => {
				$.ajax({
					url: ajaxUrl,
					success: resolve,
					error: reject
				})
			});

			if (typeof data === "object" && data.length > 0){
				$.orders.deliveryServices = data;

				if(callback)
				{
					callback();
			}
				else
				{
					$.orders.updateDeliveryServiceSelect();
				}

			}

		} catch (e) {
			console.error(e);
		} finally {
			requestRunning = false
		}

	}
})();

/**
 *
 */
$.orders.updateDeliveryServiceSelect = function () {

	let selectedValue = $("#i_order-additions-tab-delivery-delivery_service").val();
	let options = "";
	$.orders.deliveryServices.forEach(function(service, index, extras) {
		options += `<option value="${service.delivery_service_id}">${service.delivery_service_id}</option>`;
	}, null)


	$("#i_order-additions-tab-delivery-delivery_service").html(options);
	$("#i_order-additions-tab-delivery-delivery_service").val(selectedValue).trigger("change");
}

/**
 *	Delivery Type Change Event
 */
$.orders.onDeliveryTypeChange = async () => {
	const deliveryTypeSelect = $("#i_order-additions-tab-delivery-delivery_type");
	const deliveryServiceSelect = $("#i_order-additions-tab-delivery-delivery_service");

	if ($.orders.deliveryTypes.length === 0) {
		await $.orders.loadDeliveryTypes();
	}

	if (!deliveryTypeSelect.val()) return;

	// set default storage location
	$($.orders.deliveryTypes).each(function (k, v)
	{
		if(v.delivery_option_id == deliveryTypeSelect.val())
		{
			$("#i_order-additions-tab-delivery-storage_location").val(v.default_storage_location).trigger("change");
			return false;
		}
	});

	await $.orders.loadDeliveryServices(true, deliveryTypeSelect.val());
}

/**
 *	Delivery Service Change Event
 */
$.orders.onDeliveryServiceChange = async () => {
	const deliveryTypeSelect = $("#i_order-additions-tab-delivery-delivery_type");
	const deliveryOptionSelect = $("#i_order-additions-tab-delivery-delivery_service");
	const deliveryOptionContinuous = $("#i_delivery_option_continuous");
	const fixedDate = $("#i_fixed_date");
	const isDeliverySetToContinuous = deliveryOptionContinuous.is(":checked");

	//if (!deliveryOptionSelect.val()) return;
	let selectedValue = deliveryOptionSelect.val();

	if ($.orders.deliveryServices.length === 0) {
		await $.orders.loadDeliveryServices(true, deliveryTypeSelect.val());
	}

	let selectedDeliveryService = $.orders.deliveryServices
		.find((option) => option.delivery_service_id === selectedValue);

	if (!selectedDeliveryService) {
		let selectedDeliveryType = $.orders.deliveryTypes
			.find((option) => option.delivery_option_id === deliveryTypeSelect.val());

		if (selectedDeliveryType) {
			selectedDeliveryService = $.orders.deliveryServices
				.find((option) => option.delivery_service_id === selectedDeliveryType.default_delivery_service);

			if (selectedDeliveryService) {
				$("#i_order-additions-tab-delivery-delivery_service").val(selectedDeliveryService.delivery_service_id);
			}
		}
	}

	if (!selectedDeliveryService) {
		return console.warn("selectedDeliveryService not found");
	}

	if($.orders.initialized == true) {

		let order_id = $('#i_order_id').val();
		if(order_id == undefined || order_id == null || order_id == '') {
			$.app.toConsole("onDeliveryServiceChange: is initialized = true");

			const triggersFixedDate = Number(selectedDeliveryService.triggers_fixed_date);

			if (isNaN(triggersFixedDate)) {
				return console.warn("triggersFixedDate NaN");
			}
			const setFixedDateToTrue = Boolean(triggersFixedDate);

			if (!isDeliverySetToContinuous && setFixedDateToTrue) {
				deliveryOptionContinuous.prop("checked", true);
				deliveryOptionContinuous.trigger("change");
				console.debug("delivery set to continuous");
			}

			fixedDate.prop("checked", setFixedDateToTrue);
		}
	}
	else
	{
		//$.app.toConsole("onDeliveryServiceChange: set initialized = true");
		//$.orders.initialized = true;
	}
}


/**
 * Formatting function for row details (child-orders)
 * @param tr, row
 * */
$.orders.row_details = function (tr, row, js_class, js_edit_function, fromDebitor)
{
	var data = row.data();

	if (row.child.isShown())
	{
		// This row is already open - just close it
		row.child.hide();
		tr.removeClass('shown');
	}
	else
	{
		var idx_order_id_orig = 0;
		tbl_columns_order_children.findIndex(function(column,i){
			if (column.data=='order_id_orig') {
				idx_order_id_orig = i;
				return true
			}
		});
		var order_id = data.order_id_orig;
		var options = {
			//rowId: 'debitor_id',
			destroy: 'true',
			deferRender: true,
			pageLength: 25,
			columnDefs: [
				{targets: ['delivery_date','supply_from','supply_to' ],type: "ddMmYyyy"},
				{targets: ['order_id_orig' ],type: "childOrderId"},
				{ orderData:[idx_order_id_orig], targets: ['order_id'] }
			]
		};
		let details_cache	 = $.orders.child_row_contents.filter(function(obj) {
			return obj.key === order_id;
		});

		if (details_cache.length == 1)
		{	// Open this row with cached details
			row.child( details_cache[0].value ).show();
			$('#tbl_order_children_'+order_id).DataTable(options);
			tr.addClass('shown');
		}
		else
		{
			var params = {
				order_id: order_id,
				js_class: js_class,
				js_edit_function: js_edit_function,
				fromDebitor: (fromDebitor === true ? 1 : 0),
				rendermode: "ajax",
			};

			$.app.sendAjaxRequest(baseUrl+"admin/orders/load_order_child_row", params, function success(result)
			{
				if (result.error && result.error != ""){
					$.dialog.error($.lang.item('error'), result.error);
				}
				else
				{
					// Open this row with details
					row.child( result.data ).show();
					let table = $('#tbl_order_children_'+order_id).DataTable(options);
					//$.orders.child_row_contents.push({"key":order_id, "value":result.data}); // don't cahce order rows
					tr.addClass('shown');
					$('#tbl_order_children_'+order_id).find("tr:has(.is_deleted)").addClass('is_deleted');

					// Add Event-Listener to expand child-rows
					$('#tbl_order_children_'+order_id).off('click', 'td.articles-details-control').on('click', 'td.articles-details-control', function (evt)
					{
						let item = $(this);
						let parent = item.parent();
						let a_row = table.row(parent);
						//var a_tr = $(this).closest('tr');
						//var a_row = table.row( tr );
						$.orders.row_details_articles(parent, a_row, 'orders', 'edit');
						$.app.toConsole({'click':$(this).closest('tr')});
					});
				}
			}, true, "#"+$(tr).attr("id"), $.lang.item("loading_details"));
		}
	}
}

$.orders.row_subsequent_delivery_details_articles = function (tr, row)
{
	$.app.toConsole({tr:tr,row:row});
	var data = row.data();

	if (row.child.isShown())
	{
		// This row is already open - just close it
		row.child.hide();
		tr.removeClass('shown');
		/*if(tr.children().eq(1).hasClass("articles-details-control-open"))
		{
			tr.children().eq(1).removeClass("articles-details-control-open");
			tr.children().eq(1).addClass("articles-details-control-closed");
		}*/
	}
	else
	{
		//let sub_id = data[data.length-1];
		let sub_id = $('#i_order_id').val();
		let subsequent_id = data.subsequent_delivery;
		$.app.sendAjaxRequest(baseUrl+"admin/orders/load_order_subseqeuent_delivery_row_articles/null/"+subsequent_id,
			{
				sub_id: sub_id
			},
			function success(result)
			{
				if (result.error && result.error != ""){
					$.dialog.error($.lang.item('error'), result.error);
				}
				else
				{
					/*if(tr.children().eq(1).hasClass("articles-details-control-closed"))
					{
						tr.children().eq(1).addClass("articles-details-control-open");
						tr.children().eq(1).removeClass("articles-details-control-closed");
					}
					else
					{
						tr.children().eq(1).removeClass("articles-details-control-open");
						tr.children().eq(1).addClass("articles-details-control-closed");
					}*/
					// Open this row with details
					row.child( result.data ).show();
					$('#tbl_order_children_articles_'+sub_id).DataTable();
					//$.orders.child_row_contents.push({"key":sub_id, "value":result.data});
					tr.addClass('shown');
					//
				}
			}, true, "#"+$(tr).attr("id"), $.lang.item("loading_details"));
	}
}

/**
 * Formatting function for row details (child-orders)
 * @param tr, row
 * */
$.orders.row_details_articles = function (tr, row, js_class, js_edit_function, fromDebitor)
{
	$.app.toConsole({tr:tr,row:row,js_class:js_class,js_edit_function:js_edit_function,fromDebitor:fromDebitor});
	var data = row.data();

	if (row.child.isShown())
	{
		// This row is already open - just close it
		row.child.hide();
		tr.removeClass('shown');
		if(tr.children().eq(1).hasClass("articles-details-control-open"))
		{
			tr.children().eq(1).removeClass("articles-details-control-open");
			tr.children().eq(1).addClass("articles-details-control-closed");
		}
	}
	else
	{
		let sub_id = data[data.length-1];
		$.app.sendAjaxRequest(baseUrl+"admin/orders/load_order_child_row_articles",
							  {
									sub_id: sub_id
							  },
							  function success(result)
							  {
									if (result.error && result.error != ""){
										$.dialog.error($.lang.item('error'), result.error);
									}
									else
									{
										if(tr.children().eq(1).hasClass("articles-details-control-closed"))
										{
											tr.children().eq(1).addClass("articles-details-control-open");
											tr.children().eq(1).removeClass("articles-details-control-closed");
										}
										else
										{
											tr.children().eq(1).removeClass("articles-details-control-open");
											tr.children().eq(1).addClass("articles-details-control-closed");
										}
										// Open this row with details
										row.child( result.data ).show();
										$('#tbl_order_children_articles_'+sub_id).DataTable();
										//$.orders.child_row_contents.push({"key":sub_id, "value":result.data});
										tr.addClass('shown');
										$('#tbl_order_children_articles_'+sub_id).find("tr:has(.dtbt_undelete)").addClass('is_deleted');
									}
							  }, true, "#"+$(tr).attr("id"), $.lang.item("loading_details"));
	}
}

/**
 * show order per ajax
 */
$.orders.show = function(prescription_id)
{
	$.app.toConsole({"fkt":"$.orders.show", "prescription_id":prescription_id});

	let params = {};
	params.rendermode = "ajax";

	let target = baseUrl+"admin/orders/show?pid="+prescription_id;

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.app.replaceContent(result.data, $.orders.init_table, undefined, target);
			$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
			var go_back =
				'<a id="btn_go_back" name="btn_go_back" type="button" href="'+baseUrl+'admin/prescriptions/show" class="btn btn-default">&nbsp;' +
					'<i class="fa fa-arrow-circle-o-left"></i>&nbsp;<span class="hidden-xs">'+$.lang.item('back_to_prescriptions_overview')+'</span>\n' +
				'\t\t\t</a>';

				//$('<input type="button" value="'+$.lang.item('back')+'" class="btn"/>');
			$(go_back).appendTo($('#btn_new').closest('div'));
		}
	}, true, null, $.lang.item("msg_wait") );
};


$(document).ready(function()
{
	$.app.toConsole("order.js ready", "log");
	
	$.orders.init_table();
	$.orders.init_form();
});

$.orders.child_idAsInt = function(order_id)
{
	var childIdArray = $.trim(order_id).split('_');
	var childIdInt = 0;
	if (childIdArray[1] != undefined)
	{
		childIdInt = childIdArray[1] * 1;
	}
	if (childIdArray[2] != undefined)
	{
		childIdInt += childIdArray[2] * Math.pow(10, -6);
	}
	return childIdInt;
}

$.extend( $.fn.dataTableExt.oSort, {
	"childOrderId-asc": function(a, b) {
		var x, y;
		x = $.orders.child_idAsInt(a);
		y = $.orders.child_idAsInt(b);
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	},
	"childOrderId-desc": function(a, b) {
		var x, y;
		x = $.orders.child_idAsInt(a);
		y = $.orders.child_idAsInt(b);
		return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	},
} );