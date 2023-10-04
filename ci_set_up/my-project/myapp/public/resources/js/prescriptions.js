if (typeof jQuery === "undefined") {
	throw new Error("This JavaScript requires jQuery"); 
}

/**
 * prescriptions object
 */
$.prescriptions = {
	/* prescriptions options. Modify these options to suit your implementation */	
	options : {
		opt:false
	},
	table : null,
	icon_ok : '<span class="fa fa-check"></span>&nbsp;',
	icon_not_ok : '<span class="fa fa-warning"></span>&nbsp;',
	less_popups : true,
	auto_assign_flatrate: true,	// try to assign flatrate if only one has been found 
	storage_items: {},
	debitor_search_in_progress: false,
	dialog_handle: null
};

/**
 * Edit prescription. Loads the prescription form and insert it into the content container
 * @author Marco Eberhardt
 * @version 1.1
 * 
 * @param string id >> prescription identifier
 */
$.prescriptions.edit = function(id)
{
	$.app.toConsole({"fkt":"$.prescriptions.edit", "id":id});

	var params = $("#form_prescriptions").serializeArray();
		params.push({"name":"prescriptions_id", "value":id});
		params.push({"name":"rendermode", "value":"ajax"});

	var target = baseUrl+"admin/prescriptions/edit/"+id;

	$.app.sendAjaxRequest(baseUrl + "admin/debitors/checkDatasetLocked",
		{
			id: id,
			type: "prescription"
		},
		function (result) {
			if (result.locked == 1) {
				$.dialog.info($.lang.item("dataset_is_worked_on_title"),
					result.msg);
			}
			else {
				$.app.sendAjaxRequest(target, params, function success(result) {
					if (result.error && result.error != "") {
						$.dialog.error($.lang.item("error"), result.error);
					} else {
						$.app.replaceContent(result.data, $.prescriptions.init_form, undefined, target);
						$.app.replaceContent(result.extra.breadcrumb, undefined, "breadcrumb");
					}
				}, true, null, $.lang.item("msg_wait"));
			}
		},
		true,
		null,
		$.lang.item("msg_wait"));
}

$.prescriptions.edit_link = function(prescription_id,add_params) {
	$.app.toConsole({"fkt": "$.prescriptions.edit", "id": prescription_id});

	var params = $("#form_prescriptions").serializeArray();
	params.push({"name": "prescriptions_id", "value": prescription_id});
	params.push({"name": "rendermode", "value": "ajax"});

	var target = baseUrl + "admin/prescriptions/edit/" + prescription_id;
	if(add_params != undefined)
	{
		target += "?"+add_params;
	}

	$.app.sendAjaxRequest(baseUrl + "admin/debitors/checkDatasetLocked",
	{
		id: prescription_id,
		type: "prescription"
	},
	function (result) {
		if (result.locked == 1) {
			$.dialog.info($.lang.item("dataset_is_worked_on_title"),
				result.msg);
		} else {
			$.app.redirect(target);
		}
	});
}

$.prescriptions.save_success_handler = function(result)
{
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// if ($("#hidden_context").val() == "prescription")
	//{
	if (result.data.prescription.debitor_id != "" ) //  && $("#hidden_prescription_id").val() == ""
	{
		if($('#hidden_save_continue').val() != 1) {
			if (result.data.prescription.new_debitor_created == 1) {
				$.app.redirect(baseUrl + "admin/debitors/edit/" + result.data.prescription.debitor_id + "/" + 1);
			} else {
				$.app.redirect(baseUrl + "admin/debitors/edit/" + result.data.prescription.debitor_id + "/" + 2+ "/"+result.data.prescription.prescription_id);
				// Ask the user if he wants to switch into the debitor view.
				/*	$.dialog.show($.lang.item("done"), $.lang.item("prescription_has_been_saved")+"<br>"+$.lang.item("do_you_want_to_switch_to_the_debitor_view"),
						function callback_yes(id_modal){
							$.app.redirect(baseUrl+"admin/debitors/edit/"+result.data.prescription.debitor_id);
						},
						function callback_no(){
							$.app.redirect(baseUrl+"admin/prescriptions");
						},
						"success", $.lang.item("go_to_debitor"), $.lang.item("back_to_prescriptions"), true, "",
						function callback_open(id){
							//$("#"+id+" > .modal-dialog ").addClass("modal-lg");
						},
						function callback_close(id){
							if ($("#hidden_debitor_id").val() == "" || $("#hidden_prescription_id").val() == "")
							{
								$.app.redirect(baseUrl+"admin/prescriptions/edit/"+result.data.prescription.prescription_id);
							}
						}
					);*/
			}
		}
	}
	else
	{
		// no debitor assigned yet
		$.dialog.success($.lang.item("done"), $.lang.item("prescription_has_been_saved"),
			function callback(){
				if ($("#hidden_prescription_id").val() == "" && result.data.prescription.prescription_id != ""){
					$.app.redirect(baseUrl+"admin/prescriptions/edit/"+result.data.prescription.prescription_id);
				}
			},
			function callback_no(){
				$.app.redirect(baseUrl+"admin/prescriptions");
			}, $.lang.item("ok"), $.lang.item("back_to_prescriptions")
		);
	}
	if($('#hidden_save_continue').val() == 1){
		$.dialog.success($.lang.item("done"), $.lang.item("prescription_has_been_saved"),
			function callback(){
				$.app.redirect(baseUrl+"admin/prescriptions/edit/"+result.data.prescription.prescription_id);
			}
		);
	}
	$('#hidden_save_continue').val(0);
	//}// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/*else if ($("#hidden_context").val() == "debitor")
	{
		if ($("#hidden_prescription_id").val() == "")
		{
			if ($('#debitor_tab_action').val() == "")
			{
				$.dialog.success($.lang.item("done"), $.lang.item("prescription_has_been_saved"),
					function callback()
					{
						$.app.redirect(baseUrl+"admin/prescriptions/edit/"+result.data.prescription.prescription_id);
					},undefined, $.lang.item("ok")
				);
			}
		}
		else
		{
			$.dialog.success($.lang.item("done"), $.lang.item("prescription_has_been_saved"),
				function callback(){

				},
				function callback_no(){
					$.app.redirect(baseUrl+"admin/prescriptions");
				}, $.lang.item("ok"), $.lang.item("back_to_overview")
			);
		}
	}*/
}

$.prescriptions.checkOrderChanges = function(create_new_debitor, update_debitor, html)
{
	$.app.toConsole({"fkt":"$.prescriptions.checkOrderChanges"});

	$.dialog.confirm($.lang.item("order_changes_from_prescription"), html,
		function (e) {
		/*
			let order_changes = $("#dialog_hidden_order_changes").val();
			if(order_changes != "")
			{
				order_changes = JSON.parse($.app.base64.decode(order_changes));
			}

		 */

			$.prescriptions.save(create_new_debitor, update_debitor, false);
		},
		function (e) {
			let order_changes = $("#dialog_hidden_order_changes").val();
			if(order_changes != "")
			{
				order_changes_data = JSON.parse($.app.base64.decode(order_changes));
				order_changes = {};
				for(let i = 0; i < order_changes_data.length; ++i)
				{
					let order_id = order_changes_data.data_after.order_id;
					order_changes[order_id] = { "change_supply_from": false, "change_supply_to": false };
					//order_changes[i].change_supply_from = false;
					//order_changes[i].change_supply_to = false;
				}
			}

			$.prescriptions.save(create_new_debitor, update_debitor, false, order_changes);
		}
	);


	$("#bt_submit").show();
	$("#bt_submit_bottom").show();
}

/**
 * Save prescription and show result depending of the contect (prescription or debitor)
 * 
 * @author Marco Eberhardt
 * @version 1.4
 * 
 * @param bool create_new_debitor 	>> true creates also a new debitor and assigns the prescription to it
 * @param bool update_debitor 		>> true leads to an update for the debitor data (NOT in combination with "create_new_debitor"=>TRUE )
 */
$.prescriptions.save = function(create_new_debitor, update_debitor, check_order_changes, order_changes)
{
	$.app.toConsole({"fkt":"$.prescriptions.save"});

	if (check_order_changes == undefined)
	{
		check_order_changes = true;
	}

	if (check_order_changes == true && $('#hidden_order_changes').val() != "")
	{
		let html = $.app.base64.decode($('#hidden_order_changes').val());
		$.prescriptions.checkOrderChanges(create_new_debitor, update_debitor, html);
		return;
	}

	// Update fields if neccessary
	if($('#hidden_prescription_debitor_id').val() == "" && $('#i_debitor_id').val() != "")
	{
		$('#hidden_prescription_debitor_id').val($('#i_debitor_id').val());
	}
	if($('#hidden_prescription_ik_number').val() == "" && $('#i_ik_number').val() != "")
	{
		$('#hidden_prescription_ik_number').val($('#i_ik_number').val());
	}

	var form 	= $('#form_prescription').get(0);
	var params 	= new FormData(form);
		params.append('rendermode','json');
		
	if (create_new_debitor == true){
		params.append('create_new_debitor', 1);
	}
	
	if (update_debitor == true && create_new_debitor != true){
		params.append('update_debitor', 1);
	}

	if (order_changes != undefined)
	{
		params.append('order_changes', JSON.stringify(order_changes));
	}

	let products = [];
	$('#tbl_prescriptions_product_assignment > tbody > tr').each(function(){
		if($(this).find('td').eq(0).find('a').eq(0).hasClass("addPrescriptionProduct") == false) {
			let product = {};
			let cols = $(this).find('td');
			product.article_id = $(cols).eq(1).html().trim();
			product.isFlatRate = $(cols).eq(2).html().trim();
			product.productName = $(cols).eq(3).html().trim();
			if(parseInt(product.isFlatRate) == 1)
			{
				product.flatrate_id = $(cols).eq(3).find('.contract_id_flatrate').eq(0).val();
				product.contract_id = $(cols).eq(3).find('.flatrate_id_flatrate').eq(0).val();
				product.amount = 1;
				product.price = $(cols).eq(5).find('.FlatRateValue').eq(0).val();
			}
			else
			{
				product.flatrate_id = null;
				product.contract_id = null;
				product.amount = $(cols).eq(4).find('.productAmount').eq(0).val();
				product.price = $(cols).eq(5).html().trim();
			}
			products.push(product);
		}
	});

	params.append('products',JSON.stringify(products));

	$.app.toConsole({save:true,products:products,params:params});

	$.app.sendAjaxRequest($('#form_prescription').attr("action"), params, function success(result)
	{
		$.app.toConsole({"fkt":"callback save prescriptions ajax", "data":result});
		
		$.app.setFormValidationStates("form_prescription", result.error, result.extra, null);
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
			$("#bt_submit").show();
			$("#bt_submit_bottom").show();
		}
		else
		{
			$.prescriptions.save_success_handler(result);
		}
	}, true, null, $.lang.item("prescription_save_progress"), false, false, false);
};

/**
 * Assign a team to the given prescription
 * @author Marco Eberhardt
 * @version 1.0
 * 
 * @param string prescription_id
 */
$.prescriptions.change_team_for_prescription = function(event, prescription_id)
{
	var team_id = $("#i_team_"+prescription_id+" option:selected").val();
	var team_name = $("#i_team_"+prescription_id+" option:selected").text();
	
	$.app.toConsole({"fkt":"$.prescriptions.change_team_for_prescription", "prescription_id":prescription_id, "team_id":team_id});
	if (prescription_id == undefined || team_id == undefined){
		//throw new Error($.lang.item("msg_missing_parameter"));
		return false;
	}
	
	var params = [
  		{"name":"prescription_id", "value":prescription_id},
  		{"name":"team_id", "value":team_id},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	$.app.sendAjaxRequest(baseUrl+"admin/prescriptions/edit_prescription_team/", params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			if (result.status == "SUCCESS")
			{
				// @todo notification
				
				// Update the value for column 11 (raw team id) and trigger change event to re-apply the team filter
				var row_index = $("tr[id="+prescription_id+"]")[0]._DT_RowIndex;
				$.prescriptions.table.cell({row:row_index, column:12}).data(team_name);
				$("#i_filter_team").trigger("change"); 
			}
		}
	}, true, null, $.lang.item("prescription_save_team_progress"));
	
};

/**
 * Remove a prescription
 *  
 * @author Marco Eberhardt
 * @version 1.1
 * 
 * @param string id >> prescription identifier 
 */
$.prescriptions.remove = function(id,noXML)
{
	$.app.toConsole({"fkt":"$.prescriptions.remove", "id":id});
	if (id == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}
	if(noXML == undefined)
	{
		noXML = 0;
	}
	
	var params = [
  		{"name":"prescription_id", "value":id},
  		{"name":"confirmed", "value":1},
  		{"name":"rendermode", "value":"JSON"},
		{"name":"noXML", "value":(noXML?1:0)}
  	];

	$.app.sendAjaxRequest(baseUrl + "admin/debitors/checkDatasetLocked",
		{
			id: id,
			type: "prescription"
		},
		function (result) {
			if (result.locked == 1) {
				$.dialog.info($.lang.item("dataset_is_worked_on_title"),
					result.msg);
			}
			else {
				$.dialog.confirm_delete($.lang.item("msg_are_you_sure"), $.lang.item("prescriptions_sure_delete"), function callback_yes()
				{
					$.app.sendAjaxRequest(baseUrl+"admin/prescriptions/remove/", params, function success(result)
					{
						$.app.toConsole({"fkt":"callback_ajax", "result":result});
						if (result.error && result.error != ""){
							$.dialog.error($.lang.item("error"), result.error);
						}
						else{
							if (result.status == "SUCCESS")
							{
								$.dialog.success($.lang.item("done"), $.lang.item("prescriptions_has_been_deleted"), function callback_done(){
									if ($.prescriptions.table !== undefined && $.prescriptions.table !== null){
										$.prescriptions.table.ajax.reload(); // reload the table
									}
									if($.debitors !== undefined && $.debitors !== null) {
										if ($.debitors.table_prescriptions !== undefined && $.debitors.table_prescriptions !== null){
											$.debitors.table_prescriptions.ajax.reload(); // reload the table
										}
									}

								});
							}

						}
					}, true, null, $.lang.item("prescription_delete_progress"));
				}, null, $.lang.item("prescription_delete"), $.lang.item("cancel"))
			}
		},
		true,
		null,
		$.lang.item("msg_wait"));
}

/**
 * Run the OCR for the prescription file.
 * Ask the user to take over detected infos
 * 
 * @author Marco Eberhardt
 * @version 1.1
 */
$.prescriptions.ocr_detection = function()
{
	//if($('#hidden_prescription_imported').val() == 1) // 2021-01-21
	if($('#hidden_prescription_imported').val() == 1  || $('#hidden_prescription_id').val() != '')
	{
		return;
	}
	$.app.toConsole({"fkt":"$.prescription.ocr_detection"});

	var params = [
		{"name":"prescription_id", "value":$("#hidden_prescription_id").val()},
		{"name":"prescription_filename", "value":$("#hidden_prescription_filename").val()},
		{"name":"zonefile_alternative", "value":$("#i_zonefile_selector").val()},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	var target 	= baseUrl+"admin/prescriptions/run_ocr_detection/";
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback_ajax", "result":result});
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			if (result.status == "SUCCESS")
			{
				if ($.prescriptions.less_popups == true && coming_from != "debitors"){
					$.prescriptions.apply_data(result.data.ocr_data, true, true);
				}
				else{
					$.dialog.show($.lang.item("done"), $.lang.item("ocr_detection_success")+"<hr>"+result.data.ocr_result_table, 
						function callback_done(id_modal){
							$.prescriptions.apply_data(result.data.ocr_data, true, true);
						}, undefined, "success", $.lang.item("take_over"), $.lang.item("cancel"), true, "", function on_open(id){
							//$("#"+id+" > .modal-dialog ").addClass("modal-lg");
						} 
					);
				}
			}
		}
	}, true, null, $.lang.item("ocr_detection_progress"));
};

/**
 * Take over data into the form elements
 * @author Marco Eberhardt
 * @version 1.4
 * 
 * @param object data						>> data to apply
 * @param bool auto_search_insurance_number	>> this is set to "FALSE" when we come from "load_debitor_by_insurance_number" to avoid infinite recursion
 */
$.prescriptions.apply_data = function(data, auto_search_insurance_number, coming_from_ocr)
{
	if (auto_search_insurance_number == undefined){
		auto_search_insurance_number = true;
	}
	
	var infotext = function(input){
		return "";
		/*
		if (input == ""){
			return $.lang.item("ocr_no_characters_recognized");
		}else{
			return $.lang.item("ocr_characters_recognized")+": "+input;
		}
		*/
	};
//        console.log('apply_data');
//	console.log(data);
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	if ($("#i_ik_number option[value='"+data.ik_number+"']").length > 0 && data.ik_number != "")
	{	// seems we found the insurance
		if ($("#i_ik_number").val().trim() != data.ik_number || (!$("#hidden_flatrate_id").val().trim() != '' && coming_from != "debitors")){  // only change when the data is different, otherwise the flatrate pop=up comes too often
			$("#i_ik_number").val(data.ik_number).trigger("change");
			$("#i_ik_number_infotext").html( $.prescriptions.icon_ok + $.lang.item("insurance_found")).addClass("text-success").removeClass("text-danger");
		}
	}
	else{
		
		$("#i_ik_number_infotext").html( $.prescriptions.icon_not_ok + $.lang.item("insurance_not_found")+ ": "+data.ik_number).addClass("text-danger").removeClass("test-success");
		
		if (data.ik_number != ""){
			if (! $.validate.ik_number(data.ik_number)){
				$("#i_ik_number_infotext").append("<br>"+ $.prescriptions.icon_not_ok + $.lang.item("ik_number_invalid"));
			}
		}
	}
                // ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::.. Anrede setzen
                if ($("#i_salutation option[value='"+data.salutation+"']").length > 0 && data.salutation != "")
                {
                    $("#i_salutation").val(data.salutation).trigger("change");
                }

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	$("#i_insurance_number").val(data.insurance_number);	// !!! Important to have BEFORE 'calling search_debitor_by_insurance_number'
	if (auto_search_insurance_number){
		$.prescriptions.search_debitor_by_insurance_number();
	}
	else
	{
		// If this is set to FALSE, we came from "load_debitor_by_insurance_number" meaning we had already a valid insurance number (found in the dropdown).
		// We dont want to run the chain again and end in an infinite loop.
		// The data recived now, are from a stored debitor. In this case we just clear the info-texts

		if ($("#i_ik_number").val().trim() != data.ik_number || !$("#hidden_flatrate_id").val().trim() != ''){  // only remove when the data is different, otherwise the flatrate info is gone
			$("#i_ik_number_infotext").html("").removeClass("test-success").removeClass("text-danger");
		}
		// $("#i_insurance_number_infotext").html("").removeClass("text-success").removeClass("text-danger");
		$("#i_insurance_number_infotext").removeClass("text-success").removeClass("text-danger");
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	if(data.prescription_status != undefined && data.prescription_status != null && data.prescription_status != "")
	{
		$("#i_prescription_status").val(data.prescription_status);
	}
	if(data.status != undefined && data.status != null && data.status != "")
	{
		$("#i_prescription_status").val(data.status);
	}

	$("#i_firstname").val(data.firstname);
	$("#i_firstname_infotext").text(infotext(data.firstname));
	
	$("#i_lastname").val(data.lastname);
	$("#i_lastname_infotext").text(infotext(data.lastname));
	
	/*if (moment(data.birthday, $.lang.item("date_format_long").toUpperCase()).isValid()){
		$("#i_birthday").val(moment(data.birthday, $.lang.item("date_format_long").toUpperCase()).format($.lang.item("date_format_long").toUpperCase()));
	}
	else{
		$("#i_birthday").val(moment.unix(-315618480).format($.lang.item("date_format_long").toUpperCase()));
	}*/
	if(data.birthday != "")
	{
		$('#i_birthday').val(data.birthday);
	}

	if (coming_from_ocr){
		$("#i_prescription_street").val(data.street+' '+data.house_nr);
		$("#i_prescription_street_infotext").text(infotext(data.street+' '+data.house_nr));
	}
	else{
		$("#i_prescription_street").val(data.street);
		$("#i_prescription_street_infotext").text(infotext(data.street));
	}

	
	//$("#i_prescription_house_nr").val(data.house_nr);
	//$("#i_prescription_house_nr_infotext").text(infotext(data.house_nr));
	
	$("#i_prescription_zipcode").val(data.zipcode);
	$("#i_prescription_zipcode_infotext").text(infotext(data.zipcode));
	
	$("#i_prescription_location").val(data.location);
	$("#i_prescription_location_infotext").text(infotext(data.location));
	
	/*if (moment(data.prescription_date, $.lang.item("date_format_long").toUpperCase()).isValid())
	{
		$("#i_prescription_date").val(moment(data.prescription_date, $.lang.item("date_format_long").toUpperCase()).format($.lang.item("date_format_long").toUpperCase()));
		$("#i_prescription_date_infotext").text(infotext(data.prescription_date));
	}
	else{
	}*/
	if(data.prescription_date != undefined && data.prescription_date != null && data.prescription_date != "")
	{
		$('#i_prescription_date').val(data.prescription_date);
		$("#i_prescription_date_infotext").text(infotext(data.prescription_date));
	}

	$("#i_establishment_number").val(data.establishment_number);
	$("#i_establishment_number_infotext").text(infotext(data.establishment_number));
	
	$("#i_doctor_number").val(data.doctor_nr);
	$("#i_doctor_number_infotext").text(infotext(data.doctor_nr));

};

/**
 * There is a hidden select in the form which will be used to pre-search for insurance number on client side, which is 
 * way mor faster than sending ajax requests each time.
 * 
 * Triggers the change event for the debitor-dropdown to going futher
 * 
 * @author Marco Eberhardt
 * @version 1.1
 * 
 * @param string insurance_number
 */
$.prescriptions.search_debitor_by_insurance_number = function(insurance_number)
{
	//utr 2020-11-20 nur wenn nicht importiertes Rezept
	if($('#hidden_prescription_imported').length > 0 )
	{
		if($('#hidden_prescription_imported').val() == 1) // 2021-01-21
		//if($('#hidden_prescription_imported').val() == 1 || $('#hidden_prescription_id').val() != '') // 2021-10-06
		{
			return;
		}
	}
	$('#bt_search_debitor').addClass('disabled').attr("disabled",true);

	var insurance_number 	= $("#i_insurance_number").val().toUpperCase();	
	let debitor_id, debitor_text, option;
	//if (insurance_number != "" && $("#i_debitor_id option[insurance_number='"+insurance_number+"']").length > 0)
	if (insurance_number != "")
	{
		$.prescriptions.debitor_search_in_progress = true;
		$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/search_debitor_by_insurance_number",
							  {
									insurance_number: insurance_number
							  },
							  function success(result)
							  {
							  	$.app.toConsole({"fkt": "callback save contract ajax", "data": result});

								if (result.data != null && result.data.insurance_number == insurance_number)
								{
									option = $('<option>').attr("selected","selected").attr("insurance_number",result.data.insurance_number).val(result.data.debitor_id).text(result.data.account_number+" - "+result.data.firstname+" "+result.data.lastname);
									$('#i_debitor_id').empty();
									$('#i_debitor_id').append(option);
									debitor_text 	= $("#i_debitor_id option[insurance_number='"+insurance_number+"']").text();
									setTimeout(function(){
										$("#i_insurance_number").val(insurance_number);
										$("#i_insurance_number_infotext").html( $.prescriptions.icon_ok + $.lang.item("debitor_found")+ ": "+debitor_text ).addClass("text-success").removeClass("text-danger");
										$("#i_debitor_id").trigger("change");
										$('#bt_search_debitor').removeClass('disabled').attr("disabled",false);
									},300)
								}
								else
								{
									setTimeout(function(){
										$("#i_insurance_number").val(insurance_number);
										$("#i_insurance_number_infotext").html( $.prescriptions.icon_not_ok + $.lang.item("insurance_number_not_found") + ": "+insurance_number ).addClass("text-danger").removeClass("text-success");
										$("#i_debitor_id").val("").trigger("change");
										if(! insurance_number.match(/^[A-Z][0-9]{9}$/)) {
											$("#i_insurance_number_infotext").append('<br>' + $.prescriptions.icon_not_ok + $.lang.item("insurance_number_invalid"));
										}
										$('#bt_search_debitor').removeClass('disabled').attr("disabled",false);
									},300)
								}
							  },
							  false,
							  null,
							  "");


		// we found a insurant
		/*var debitor_id 		= $("#i_debitor_id option[insurance_number='"+insurance_number+"']").attr("debitor_id");
		var debitor_text 	= $("#i_debitor_id option[insurance_number='"+insurance_number+"']").text();*/
		
		// Note: Triggering 'i_debitor_id' automatically triggers >>> $.prescriptions.load_debitor_by_insurance_number(insurance_number); 
		/*$("#i_debitor_id").val(debitor_id).trigger("change");
		$("#i_insurance_number").val(insurance_number);
		$("#i_insurance_number_infotext").html( $.prescriptions.icon_ok + $.lang.item("debitor_found")+ ": "+debitor_text ).addClass("text-success").removeClass("text-danger");*/
	}
	else
	{
		/*if ($("#hidden_context").val() == "prescription"){
			$("#i_debitor_id").val("").trigger("change");	// <-- Note: Triggering 'i_debitor_id' automatically triggers >>> $.prescriptions.load_debitor_by_insurance_number(insurance_number); 
		}*/
		if(!$.prescriptions.debitor_search_in_progress)
		{
			setTimeout(function() {
				$("#i_debitor_id").val("").trigger("change");
				$("#i_insurance_number").val(insurance_number);
				$("#i_insurance_number_infotext").html($.prescriptions.icon_not_ok + $.lang.item("insurance_number_not_found") + ": " + insurance_number).addClass("text-danger").removeClass("text-success");

				if (!insurance_number.match(/^[A-Z][0-9]{9}$/)) {
					$("#i_insurance_number_infotext").append('<br>' + $.prescriptions.icon_not_ok + $.lang.item("insurance_number_invalid"));
				}
				$.prescriptions.debitor_search_in_progress = false;
				$('#bt_search_debitor').removeClass('disabled').attr("disabled",false);
			},300);
		}
	}
};

/**
 * Determinate contract(s) for the given IK
 * 
 * @author Marco Eberhardt
 * @version 1.2
 *
 * @param {string} ik_number
 * @param search_all_flatrates
 * @param {boolean} forDebitor
 */
$.prescriptions.search_contract_by_ik = function(ik_number,search_all_flatrates, forDebitor = false)
{
	//utr 2020-11_20 Suche nur wenn es sich um ein NICHT importiertes Rezept handelt.
	let prescription_is_imported = false;
	if($('#hidden_prescription_imported').length > 0)
	{
		if($('#hidden_prescription_imported').val() == 1) // 2021-01-21
		//if($('#hidden_prescription_imported').val() == 1  || $('#hidden_prescription_id').val() != '') // 2021-04-27
		{
			//prescription_is_imported = true;
		}
	}

	if ((ik_number == "" || ik_number == undefined)||prescription_is_imported)
	{
			return; // und tschüss
	}
                    
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// First, we clear the assigned contract and the flatrate 
	$("#hidden_contract_id").val("");
	$("#hidden_contract_name").val("");
	$("#hidden_flatrate_id").val("");
	
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	var target 	= baseUrl+"admin/debitors/get_contracts_by_ik_number/"+ik_number;
	var params 	= [
		{"name":"ik_number", "value":ik_number},
                                     {"name":"search_all_flatrates", "value":search_all_flatrates},
  		{"name":"rendermode", "value":"JSON"}
  	];
	
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback_ajax", "result":result});
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			if (result.status == "SUCCESS" )
			{
				var info_text = "";		// Will be displayed below the inusrance dropdown
				
				if (result.extra.num_rows == 0)
				{
					info_text = $.prescriptions.icon_not_ok + $.lang.item("msg_no_contract_found");
					$("#i_ik_number_infotext").html($.prescriptions.icon_not_ok + $.lang.item("msg_no_contract_found")).addClass("text-danger").removeClass("text-success");
					
					if ($.prescriptions.less_popups == false){
						$.dialog.warning($.lang.item("warning"), $.lang.item("msg_no_contract_found"));
					}
				}
				else
				{
					if (result.extra.num_rows > 0)
					{
						var suitable_flatrates	= [];	// Here we collect all suitable flatrates 
						
						// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
						// ..:: We got one or more contracts.  
						var debitor_age = parseInt( moment().diff( moment($("#i_birthday").val(), $.lang.item("date_format_long").toUpperCase() ), 'years'));  
						var markup 		= 
						'<table id="tbl_suitable_contracts" class="table table-full-width " border="0" style="padding:15px;display:none;" class="">'+
							'<thead>'+
								'<tr>'+
									'<td width="40%"><b>'+$.lang.item("contract")+':</b></td>'+
									'<td width="60%"><b>'+$.lang.item("flatrate")+':</b></td>'+
							    '</tr>'+    
						    '</thead>'+
						    '<tbody>'+
						    '</tbody>'+
						'</table>';
						
						var table = $(markup);
						$.each(result.data, function(key, value)
						{
							if (value.contract_id == undefined){	// thats not a contract
								return;
							}
							$.app.toConsole({"contract":value, "num-flatrates":value.assigned_flatrates.length});
							
							var debitor_zipcode 	= $("#i_prescription_zipcode").val();
							var zip_restrictions 	= value.restriction_plz != "" ? value.restriction_plz.split(';') : ["*****"]; // No Rule will be handled as no restriction
							
							// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
							// ..:: Validate zipcode restrictions from contract
							if ($.validate.zipcode_restrictions(debitor_zipcode, zip_restrictions ) == false){
								$.app.toConsole("- zipcode requirement not met");
								//return;
							}
							
							// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
							// ..:: Display product groups for each contracts
							var product_groups = $.map(JSON.parse(value.productgroup), function( val, i ){ 
								return '<span class="badge badge-pill badge-info">'+$.lang.item(val.toLowerCase())+'</span>'; 
							}).join("\n");
							$.app.toConsole({"product_groups":product_groups});

							
							// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
							// ..:: Loop through all flatrates and try to pre-select one
							var markup_flatrates 	= '<table id="tbl_contract_flatrates_'+value.contract_id+'" class="table table-full-width" border="0" style="margin-bottom:0px;"><tbody></tbody></table>';
							var table_flatrates 	= $(markup_flatrates);
							var row_flatrate		= "";
							var btn_take_over 		= "";
							
							if (value.assigned_flatrates.length > 0)
							{
								$.each(value.assigned_flatrates, function(key2, flatrate)
								{
									flatrate.contract_name 	= value.contract_name	// need to have the name in this object	
									flatrate.price			= $.app.format_number_currency(flatrate.sales_price);
									
									
									$.app.toConsole({"flatrate":flatrate});
									
									var age_from 	= (flatrate.flatrate_age_from 	!= null ? flatrate.flatrate_age_from 	: "0");
									var age_till	= (flatrate.flatrate_age_to 	!= null ? flatrate.flatrate_age_to	: "n");
									
									var ok 			= false;
									if (debitor_age >= parseInt(age_from) && (debitor_age <= parseInt(age_till) || age_till == "n") )
									{	
										suitable_flatrates.push(flatrate);
										ok = true;	// This flatrate matches the age restriction
									}
									if($("#i_birthday").val() == "")
									{
										suitable_flatrates.push(flatrate);
									}
									
									var name		= '<span class="'+(ok ? 'text-success':'text-danger')+'">'+(ok ? $.prescriptions.icon_ok : $.prescriptions.icon_not_ok)+'&nbsp;<b>'+flatrate.article_id_abena+'</b>&nbsp;'+flatrate.flatrate_name+' </span>';
									var button		= '<button type="button" value="'+value.contract_id+'-'+flatrate.flatrate_id+'" class="btn btn-xs btn-block '+(ok ? 'btn-success':'btn-danger')+'" onclick="$.prescriptions.select_contract_flatrate(\''+value.contract_id+'\', \''+value.contract_name+'\', \''+flatrate.flatrate_id+'\', \''+flatrate.price+'\', '+ forDebitor.toString() + ', ' + flatrate.article_id_abena +', \''+value.prescription_information.replace(/(\r\n|\n|\r|\"|\')/gm, "")+'\')" ><i class="fa fa-arrow-right"></i>&nbsp;'+$.lang.item("take_over")+'</button>'
									var age 		= '<span class="'+(ok ? 'text-success':'text-danger')+'">'+age_from +" - "+ age_till + " " + $.lang.item("years")+'</span>';;
									
									row_flatrate = 
									'<tr style="padding:0px;">'+
										'<td width="40%" style="'+(key2 == 0 ? "border-top:0px":"")+'">'+name+'</td>'+
										'<td width="40%" style="'+(key2 == 0 ? "border-top:0px":"")+'">'+age+'</td>'+
										'<td width="20%" style="'+(key2 == 0 ? "border-top:0px":"")+'">'+button+'</td>'+
									'</tr>';
									table_flatrates.append(row_flatrate);
								});
							}
							else
							{
								row_flatrate = 
								'<tr>'+
									'<td width="40%" style="border-top:0px">'+$.lang.item("no_flatrates_assigned")+'</td>'+
									'<td width="40%" style="border-top:0px"></td>'+
									'<td width="20%" style="border-top:0px"></td>'+
								'</tr>';
								table_flatrates.append(row_flatrate);
							}
							
							// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
							var row = 
							'<tr>'+
								'<td>'+value.contract_name+' (Rev. '+value.contract_revision+')<br>'+product_groups+'</td>'+
								'<td>'+table_flatrates[0].outerHTML+'</td>'+
							'</tr>';
							table.append(row);
						});
						
						var table_html = table[0].outerHTML;
						// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
						
						
						// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
						// ..:: Now lets check, if we exactly can determinate ONE Contract with ONE
						// ..:: flatrate or if the user has too choose one 						
						// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
						$.app.toConsole({"suitable_flatrates":suitable_flatrates});
						
						if (suitable_flatrates.length == 1 && $.prescriptions.auto_assign_flatrate == true)
						{	
							// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
							// ..:: best case. Found exactly one flatrate. Lets auto-assign it
							info_text = $.prescriptions.icon_ok + $.lang.item(suitable_flatrates[0].contract_name);
							
							$("#i_ik_number_infotext").html(info_text).addClass("text-success").removeClass("text-danger");

							if (forDebitor) {
								$("#hidden_debitor_contract_id").val(suitable_flatrates[0].contract_id);
								$("#hidden_debitor_contract_name").val(suitable_flatrates[0].contract_name);
								$("#hidden_debitor_flatrate_id").val(suitable_flatrates[0].flatrate_id);
								$("#hidden_debitor_flatrate_id_abena").val(suitable_flatrates[0].article_id_abena);
							} else {
								$("#hidden_contract_id").val(suitable_flatrates[0].contract_id);
								$("#hidden_contract_name").val(suitable_flatrates[0].contract_name);
								$("#hidden_flatrate_id").val(suitable_flatrates[0].flatrate_id);
							}
							$.prescriptions.getFlatrateArticle(suitable_flatrates[0].flatrate_id,suitable_flatrates[0].contract_id);
						}
						else if (suitable_flatrates.length > 1 || (suitable_flatrates.length == 1 && $.prescriptions.auto_assign_flatrate == false) )
						{
							// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
							// ..:: The user has to choose. Open the popup and append the previously built table
							var on_opened = function(modal_id)
							{
								$.app.toConsole("dialog ["+modal_id+"] opened ");
								
								$("#conent_"+modal_id).append("<br><br>"+table_html);
								$("#tbl_suitable_contracts").show().addClass("animated slideInLeft");
							}
							$.dialog.show($.lang.item("done"), $.lang.item("msg_multiple_contract_flatrates_determinated"), undefined, undefined, "success", "", $.lang.item("cancel"), true, "lg", on_opened);
						}
						else
						{	
							// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
							// ..:: NOT found any suitable flatrate
							info_text = $.prescriptions.icon_not_ok + $.lang.item("msg_n_contracts_found_but_no_flatrate_matches_the_requirements");
							$("#i_ik_number_infotext").html($.prescriptions.icon_not_ok + $.lang.item("msg_no_flatrates_found_in_contracts")).addClass("text-danger").removeClass("text-success");
							
							if ($.prescriptions.less_popups == false){
								$.dialog.warning($.lang.item("warning"), $.lang.item("msg_no_flatrates_found_in_contracts"));
							}
						}
					}
				}
				
				// info text is collected. now display it
				if ($("#hint_debitor_infos").length > 0){
					$("#debitor-info").html(info_text);
				}

				if ( $("#hidden_contract_id").val() !== ""){
					$.prescriptions.checkIfWeShowProposalAccountInput($("#i_ik_number").val(), $("#hidden_contract_id").val());
					//$.prescriptions.refillProposalAccountsSelect($("#i_ik_number").val(), $("#hidden_contract_id").val(), $("#hidden_flatrate_id").val());
				}
			}
		}
	}, true, null, $.lang.item("searching_contracts"));
};

/**
 * Select contract from the dropdown
 * @param {boolean}forDebitor
 */
$.prescriptions.select_contract_flatrate = function (contract_id, contract_name, flatrate_id, flatrate_price, forDebitor, flatrate_article_id_abena,prescription_information)
{

	if (forDebitor){
		var info_text = $.prescriptions.icon_ok + contract_name;
	}
	else{
		var info_text = $.prescriptions.icon_ok + contract_name+' '+'<button id="bt_contract_info_'+contract_id+'" name="bt_contract_info" type="button" value="1" class="btn btn-default btn-xs">&nbsp;<i class="fa fa-info"></i>&nbsp;</button>';
		var contract_info_text = prescription_information;
		info_text = info_text+'<br>'+contract_info_text;
	}
	
	$("#i_ik_number_infotext").html(info_text).addClass("text-success").removeClass("text-danger");

	if (forDebitor) {
		$("#hidden_debitor_contract_id").val(contract_id);
		$("#hidden_debitor_contract_name").val(contract_name);
		$("#hidden_debitor_flatrate_id").val(flatrate_id);
		$("#hidden_debitor_flatrate_id_abena").val(flatrate_article_id_abena);
	} else {
		$("#hidden_contract_id").val(contract_id);
		$("#hidden_contract_name").val(contract_name);
		$("#hidden_flatrate_id").val(flatrate_id);
	}
	$.prescriptions.getFlatrateArticle(flatrate_id,contract_id);

	
	// Search and close the parent modal
	$("button[value="+contract_id+"-"+flatrate_id+"]").closest('.modal-message').modal("toggle");

	$.prescriptions.checkIfWeShowProposalAccountInput($("#i_ik_number").val(), $("#hidden_contract_id").val());
	$.prescriptions.init_document_info_btn();
};

/**
 * Search a suitable team for the zipcode
 *  - Message, when no team could be found
 *  - Message, when multiple teams are found to let the user select one
 *  - Automatically assign Team, if only one has been found
 * 
 */
$.prescriptions.search_team_by_zipcode = function()
{
//utr 2020-11-20 nur wenn nicht importiertes Rezept
	if($('#hidden_prescription_imported').length > 0)
	{
		//if($('#hidden_prescription_imported').val() == 1) // 2021-01-21
		if($('#hidden_prescription_imported').val() == 1  || $('#hidden_prescription_id').val() != '')
		{
			return;
		}
	}
	var debitor_zipcode = $("#i_prescription_zipcode").val();
	
	if (debitor_zipcode == ""){
		$.app.toConsole({"fkt":"search_team_by_address", "result":"no zipcode available"});
		return false; // und tschüss
	}
	if (debitor_zipcode.length != 5){
		$("#i_prescription_zipcode").focus();
		$.dialog.warning($.lang.item("warning"), $.lang.item("zipcode_has_to_be_five_characters_long"));
		return false; // und tschüss
	}
	
	var possible_teams = [];
	$("#i_team_id > option").each(function()
	{
		$.app.toConsole({"fkt":"team-loop", "result":$(this).val()});
		if ($(this).val() != "")
		{
			var zip_restrictions 	= $(this).attr("zipcode_restriction").split(';');
			var match 				= $.validate.zipcode_restrictions(debitor_zipcode, zip_restrictions);	 
			if (match !== false){
				possible_teams.push({"team_id":$(this).val(), "team_name":$(this).text(), "matching_rule":match});
			}
		}
	});
	
	if (possible_teams.length == 0){
		// No team found
		$.dialog.warning($.lang.item("warning"), $.lang.item("msg_no_suitable_team_found"));
	}
	else if (possible_teams.length == 1){
		// found exactly one team. assign it
		var da_team = possible_teams[0];
		
		$.dialog.info($.lang.item("info"), $.lang.item("msg_one_suitable_team_found").replace("%s", "'"+da_team.team_name+"'"),
			function callback_yes(id_modal){
				$.prescriptions.select_team(da_team.team_id);
			}, 
			undefined, $.lang.item("yes"), $.lang.item("cancel")
		);
	}
	else if (possible_teams.length > 1)
	{	// multiple teams found. ask which one
		var on_opened = function(modal_id)
		{
			$.app.toConsole("dialog ["+modal_id+"] opened ");
			
			var markup 	= 
			'<table id="tbl_suitable_teams" class="table table-full-width " border="0" style="padding:15px;" class="">'+
				'<thead>'+
					'<tr>'+
						'<td width="80%"><b>'+$.lang.item("team")+':</b></td>'+
						'<td width="20%"></td>'+
				    '</tr>'+    
			    '</thead>'+
			    '<tbody>'+
			    '</tbody>'+
			'</table>';
			
			var table = $(markup);
			$.each(possible_teams, function(key, value)
			{
				var btn_take_over = '<button type="button" value="'+value.team_id+'" onclick="$.prescriptions.select_team(\''+value.team_id+'\', \''+modal_id+'\')" class="btn btn-success btn-xs btn-block"><i class="fa fa-arrow-right"></i>&nbsp;'+$.lang.item("take_over")+'</button>'
				var row = 
				'<tr>'+
					'<td>'+value.team_name+' ('+value.matching_rule+')</td>'+
					'<td>'+btn_take_over+'</td>'+
				'</tr>';
				table.append(row);
			});
			var table_html = table[0].outerHTML;
			$("#conent_"+modal_id).append("<br><br>"+table_html);
			$("#tbl_suitable_teams").show().addClass("animated slideInLeft");
		}
		
		$.dialog.show($.lang.item("done"), $.lang.item("msg_multiple_suitable_teams_found"), 
			function callback_yes(id_modal){
				
			}, 
			function callback_no(id_modal){
				
			}, 
			"success", "", $.lang.item("cancel"), true, "", on_opened
		);
	}
};

/**
 * Select Team from the dropdown
 */
$.prescriptions.select_team = function (team_id, modal_id)
{
	$("#i_team_id").val(team_id).trigger("change");

	if (modal_id != undefined) {	// remove modal window
		$("#"+modal_id).modal('toggle');
	}
};

/**
 * 
 */
$.prescriptions.validate_team = function()
{

//utr 2020-11-20 nur wenn nicht importiertes Rezept
	if($('#hidden_prescription_imported').length > 0)
	{
		//if($('#hidden_prescription_imported').val() == 1) // 2021-01-21
		if($('#hidden_prescription_imported').val() == 1  || $('#hidden_prescription_id').val() != '')
		{
			return;
		}
	}
	var selected_team 		= $("#i_team_id option:selected");
	var zipcode_restriction = $(selected_team).attr("zipcode_restriction");
	if(zipcode_restriction != undefined)
	{
		if (zipcode_restriction.includes(";"))
		{
			var zip_restrictions 	= zipcode_restriction.split(';');
			var match 				= $.validate.zipcode_restrictions($("#i_prescription_zipcode").val(), zip_restrictions);

			if (match == false){
				$.dialog.warning($.lang.item("warning"), $.lang.item("msg_selected_team_not_suitable_for_zipcode"),
					function callback_yes(id_modal){
						$.prescriptions.search_team_by_zipcode();
					}, undefined, $.lang.item("search_team"), $.lang.item("cancel")
				);
			}
		}
	}

};

/**
 * Load debitor data by a given ID
 * @author Marco Eberhardt
 * @version 1.0
 * 
 * @param string value 			>> value to search for
 * @param string field-val		>> "0" => search for debitor identifier / "1"=>Search for inusrance number
 * @param function callback		
 * 
 * @return void 	>> pass data to the given callback on success 
 * 
 */
$.prescriptions.load_debitor_data_by_unique_value = function(value, field, callback)
{
	if (value == undefined || value == "" || field == undefined || field == ""){
		//$.dialog.error($.lang.item("error"), $.lang.item("msg_missing_parameter"));
		return;
	}

	var target 	= baseUrl+"admin/debitors/load_debitor_data_by_unique_value/";

	var params	= [];
	params.push({"name":"rendermode", "value":"json"});
	params.push({"name":"value", "value":value});
	params.push({"name":"field", "value":field});

	$.app.toConsole({"fkt":"load_debitor_data_by_unique_value", "target":target, "params":params});
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (callback != undefined && typeof callback == 'function'){
			callback(result);
		}
	}, true, null, $.lang.item("debitor_load_progress"));
};

/**
 * Search debitor by a given insurance number and run the data comparsion.
 * 
 * @author Marco Eberhardt
 * @version 1.3
 * 
 * @param string insurance_number 	>> the number to search for
 */
$.prescriptions.load_debitor_by_insurance_number = function(insurance_number)
{
	if (insurance_number == undefined || insurance_number == ""){
		//$.dialog.error($.lang.item("error"), $.lang.item("msg_missing_parameter"));
		return;
	}
	
	$.app.toConsole({"fkt":"load_debitor_by_insurance_number", "insurance_number":insurance_number});
	
	$.prescriptions.load_debitor_data_by_unique_value(insurance_number, "1", function(result)
	{
		if (result.error && result.error != ""){
    		$.dialog.error($.lang.item("error"), result.error);
    	}
    	else
		{
    		if(result.extra.num_rows != 1){
                $.dialog.error($.lang.item("error"), $.lang.item("no_result"));
            }
            else
            {
	            if (!(coming_from == "debitors" && skipped_ik_search_popup == 0))
	            {
		            var display_data = $.prescriptions.compare_stored_data_with_form(result.data);
		            if($.prescriptions.dialog_handle == null)
					{
						if (display_data != "")
						{
							$.prescriptions.dialog_handle = $.dialog.show($.lang.item("done"), $.lang.item("msg_debitor_found_do_you_want_to_take_over") + "<hr>" + display_data, function callback_done(id_modal)
								{
									$.prescriptions.apply_data(result.data, false, false); // !! Important to give the second parameter=false
									$.prescriptions.dialog_handle = null;
								},
								function callback_no(id_modal)
								{
									$.prescriptions.dialog_handle = null;
									// do nothing
								}, "success", $.lang.item("take_over"), $.lang.item("cancel"), true, "", undefined);
						}
						else
						{
							if ($.prescriptions.less_popups == false)
							{
								$.dialog.info($.lang.item("info"), $.lang.item("no_changes_detected"));
							}
						}
					}
	            }
	            else
	            {
		            $.prescriptions.apply_data(result.data, false, false); // !! Important to give the second parameter=false
		            skipped_ik_search_popup++;
	            }
            }
		}
	});
};

/**
 * Compare "stored_data" with the values in the form.
 * Create a table on the fly showing the differences 
 * 
 * @author Marco Eberhardt
 * @version 1.3
 * 
 * @param object stored_data
 * @return string >> returns an table-string showing differences or an empty string if no changes have benn detected
 */
$.prescriptions.compare_stored_data_with_form = function(stored_data)
{
	// map keys from stored data with the input identifier from the form
	var compare_map = [
		{"datakey":"ik_number", "field":"i_ik_number"},
		{"datakey":"insurance_number", "field":"i_insurance_number"},
		{"datakey":"lastname", "field":"i_lastname"},
		{"datakey":"firstname", "field":"i_firstname"},
		{"datakey":"street", "field":"i_prescription_street"},
		//{"datakey":"house_nr", "field":"i_prescription_house_nr"},
		{"datakey":"zipcode", "field":"i_prescription_zipcode"},
		{"datakey":"location", "field":"i_prescription_location"},
		{"datakey":"birthday", "field":"i_birthday"},
        {"datakey":"salutation", "field":"i_salutation"},
        {"datakey":"status", "field":"i_prescription_status"},
        {"datakey":"doctor_id", "field":"i_doctor_number"},
        {"datakey":"business_premises", "field":"i_establishment_number"},
	];

	/*if($('#hidden_prescription_id').val() != '')
	{
		compare_map = [];
	}*/

	var markup 	= 
	'<table id="tbl_data_comparsion" class="table table-full-width " border="0" style="padding:15px">'+
		'<thead>'+
			'<tr>'+
				'<td width="20%"></td>'+
				'<td width="40%"><b>'+$.lang.item("data_form")+':</b></td>'+
				'<td width="40%"><b>'+$.lang.item("data_stored")+':</b></td>'+
		    '</tr>'+    
	    '</thead>'+
	    '<tbody>'+
	    '</tbody>'+
	'</table>';
	var table = $(markup);
	var found_changes = false;

	$.each(compare_map, function(key, value)
	{
		//$.app.toConsole({"key":key, "value":value, "store_data":stored_data[value.datakey], "form_data":$("#"+value.field).val()});
		var stored_data_value = stored_data[value.datakey];
		if(stored_data_value == null)
		{
			stored_data_value = '';
		}
		if (stored_data_value.trim() != $("#"+value.field).val().trim()){
			found_changes = true;
			var row = 
			'<tr>'+
				'<td><b>'+$.lang.item(value.datakey)+':</b></td>'+
				'<td>'+$.lang.item($("#"+value.field).val())+'</td>'+
				'<td>'+$.lang.item(stored_data[value.datakey])+'</td>'+
			'</tr>';
			table.append(row);
		}
	});
	
	if (found_changes == true){
		return table[0].outerHTML;
	}
	return "";
};

/**
 * Initialize the Uploader and register its handlers
 * 
 * @author Marco Eberhardt
 * @version 1.3
 */
$.prescriptions.init_uploader = function(callback)
{
	$.app.toConsole({"fkt":'$.prescriptions.init_uploader'});
	
	var target 			= baseUrl+"admin/prescriptions/upload_document_ajax/";
	var show_buttons 	= true;
	var upload_extra 	= function(){
		return {
			start_doc_upload: 1,
			prescription_id: $("#hidden_prescription_id").val(),
			rendermode: 'json',
		};
	};

	// define the upload template for the "mimimi, i need to scroll for the buttons" users
	var layoutTemplates = {
		main1:
			/*'<div class="row">'+
			'	<div class="col-xs-12">'+
			'      		{upload}\n' +
			'    		{remove}\n' +
			'			{cancel}\n' +
			'	</div>'+
			'</div><br>'+*/
			'{preview}\n' +
			'<div class="kv-upload-progress hide"></div>\n' +
			'<div class="row">'+
			'	<div class="col-xs-12">'+
			'		<div class="input-group {class} ">\n' +
			'   		{caption}\n' +
			'			<div id="grp-browse" class="input-group-btn">\n' +
			'       		{browse}\n' +
			'   		</div>\n' +
			'		</div>'+
			'	</div>'+
			'</div><br>'+
			'<div class="row">'/*+
			'	<div class="col-xs-12">'+
			'      		{upload}\n' +
			'    		{remove}\n' +
			'			{cancel}\n' +
			'	</div>'+
			'</div>'*/,
				actions:
		'<div class="file-actions">\n' +
		'    <div class="file-footer-buttons">\n' +
		'        {delete} {other}' +
		'    </div>\n' +
		'    {drag}\n' +
		'    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
		'    <div class="clearfix"></div>\n' +
		'</div>'
	};


	var on_success = function(event, data, previewId, index)
	{
		$("#img_prescription").attr("src", data.response.img_src);
		$("#hidden_prescription_filename").val(data.response.file);
		$("#hidden_prescription_filename_original").val(data.filenames[0]);
		//$(".file-preview-image").attr("src", data.response.img_src);
		if($('#bt_scanagent').is(':visible'))
		{
			$("#fi_run_ocr").hide();
		}
		else
		{
			$("#fi_run_ocr").show();
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($.prescriptions.less_popups == true)
		{	// autostart
			$.prescriptions.ocr_detection();	
		}
		else
		{	// ask the user
			$.dialog.success($.lang.item("done"), $.lang.item("file_has_been_uploaded"), function callback_done(){
				$.prescriptions.ocr_detection();
			}, undefined, $.lang.item("run_ocr_detection"), $.lang.item("cancel"));
		}
		/**
		 *	@todo delete image does not work
		 */
	};
	
    var initialPreview = undefined;
    if ($("#img_prescription").attr("src") != "")
	{
    	initialPreview = [
            '<img width="100%" src="'+$("#img_prescription").attr("src")+'" class="file-preview-image" alt="preview" title="preview">'
        ];
	}
    
    var initialPreviewConfig = [
        {
            caption: $.lang.item("prescription"), 
            width: '100%', 
            url: baseUrl+"admin/prescriptions/delete_document/", // server delete action 
            extra: {prescription_id: $("#hidden_prescription_id").val()}
        }
    ];
    
    var other_options = {}
    	other_options.initialPreviewConfig = initialPreviewConfig;
    	other_options.overwriteInitial = true;
		other_options.layoutTemplates = layoutTemplates;


	//selector, upload_url,  allowedExt, multiple, onSuccess, onError, minFiles, maxFiles, maxSize, upload_extra, initialPreview, showCaption, showPreview, showRemove, showUpload, showCancel, showClose, showUploadedThumbs
	$.app.init_fileinput("#i_upload_document", target,  ["tif","tiff", "jpg", "png", "gif", "jpeg"], false, on_success, null, 1, 1, 20000, upload_extra, initialPreview, true, true, show_buttons, show_buttons, show_buttons, false, false, other_options);
	$("#i_upload_document").off('filebatchselected').on('filebatchselected', function(event, files) {
		$("#i_upload_document").fileinput("upload"); // nach Auswahl des Dokumentes im Dateidialog hochgeladen werden. Es ergibt sich kein sichtbarer Mehrwert durch das zusätzliche Klicken auf „Hochladen„
		$.app.toConsole( {"fkt":"filebatchselected", "event":event, "files":files} );
	});
	$("#i_upload_document").off("filebatchuploadcomplete").on("filebatchuploadcomplete", function(){
		$("#i_upload_document").fileinput("destroy");
		$.prescriptions.init_uploader();	// Re-Initialize the whole thing
	});
	if (callback != undefined && typeof callback == 'function')
	{
		callback();
	}
};


/**
 * Initialize the Uploader and register its handlers
 *
 * @author Marco Eberhardt
 * @version 1.3
 */
$.prescriptions.init_uploader_backside = function(callback)
{
	$.app.toConsole({"fkt":'$.prescriptions.init_uploader_backside'});

	var target 			= baseUrl+"admin/prescriptions/upload_attachment_ajax/";
	var show_buttons 	= true;

	var upload_extra 	= function(){
		return {
			start_doc_upload: 1,
			prescription_id: $("#hidden_prescription_id").val(),
			is_prescription_backside: 1,
			rendermode: 'json',
		};
	};

	// define the upload template for the "mimimi, i need to scroll for the buttons" users
	var layoutTemplates = {
		main1:
			/*'<div class="row">'+
			'	<div class="col-xs-12">'+
			'      		{upload}\n' +
			'    		{remove}\n' +
			'			{cancel}\n' +
			'	</div>'+
			'</div><br>'+*/
			'{preview}\n' +
			'<div class="kv-upload-progress hide"></div>\n' +
			'<div class="row">'+
			'	<div class="col-xs-12">'+
			'		<div class="input-group {class} ">\n' +
			'   		{caption}\n' +
			'			<div id="grp-browse" class="input-group-btn">\n' +
			'       		{browse}\n' +
			'   		</div>\n' +
			'		</div>'+
			'	</div>'+
			'</div><br>'
			/*+'<div class="row">'+
			'	<div class="col-xs-12">'+
			'      		{upload}\n' +
			'    		{remove}\n' +
			'			{cancel}\n' +
			'	</div>'+
			'</div>'*/,
		actions:
			'<div class="file-actions">\n' +
			'    <div class="file-footer-buttons">\n' +
			'        {delete} {other}' +
			'    </div>\n' +
			'    {drag}\n' +
			'    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
			'    <div class="clearfix"></div>\n' +
			'</div>'
	};


	var on_success = function(event, data, previewId, index)
	{
		$("#img_prescription_backside").attr("src", data.response.img_src);
		$("#hidden_prescription_backside_filename").val(data.response.filename);
		$("#hidden_prescription_backside_filename_original").val(data.response.filename_orig);
	};

	var initialPreview = undefined;
	if ($("#img_prescription_backside").attr("src") != "")
	{
		initialPreview = [
			'<img width="100%" src="'+$("#img_prescription_backside").attr("src")+'" class="file-preview-image" alt="preview" title="preview">'
		];
	}

	var initialPreviewConfig = [];

	if ($("#hidden_prescription_id").val() != ''){
		$.each( prescription_attachments, function( index, value ){

			if (value.type === 'BACKSIDE'){

				$.app.toConsole({"fkt":'each.attachment', "index":index, "value":value});

				initialPreviewConfig.push({
					caption: $.lang.item("prescription_backside"),
					width: "100%",
					url: baseUrl+"admin/prescriptions/delete_attachment", // server delete action
					extra: {prescription_id: $("#hidden_prescription_id").val(), "file_id":value.file_id, "rendermode":"json","debitorDoc":0,"debitor_id":$('#i_debitor_id').val()},
				});
			}
			else{
				//@todo take this into account
			}

		});
	}
	else{

		initialPreviewConfig.push({
			caption: $.lang.item("prescription_backside"),
			width: "100%",
			url: baseUrl+"admin/prescriptions/delete_attachment", // server delete action
			extra: {prescription_id: $("#hidden_prescription_id").val(), "rendermode":"json"},
		});

	}



	var other_options = {}
	other_options.initialPreviewConfig = initialPreviewConfig;
	other_options.overwriteInitial = true;
	other_options.layoutTemplates = layoutTemplates;


	//selector, upload_url,  allowedExt, multiple, onSuccess, onError, minFiles, maxFiles, maxSize, upload_extra, initialPreview, showCaption, showPreview, showRemove, showUpload, showCancel, showClose, showUploadedThumbs
	$.app.init_fileinput("#i_upload_document_backside", target,  ["tif","tiff", "jpg", "png", "gif", "jpeg"], false, on_success, null, 1, 1, 20000, upload_extra, initialPreview, true, true, show_buttons, show_buttons, show_buttons, false, true, other_options);

	$("#i_upload_document_backside").off('filebatchselected').on('filebatchselected', function(event, files) {
		$("#i_upload_document_backside").fileinput("upload"); // nach Auswahl des Dokumentes im Dateidialog hochgeladen werden. Es ergibt sich kein sichtbarer Mehrwert durch das zusätzliche Klicken auf „Hochladen„
		$.app.toConsole( {"fkt":"filebatchselected", "event":event, "files":files} );
	});
	$("#i_upload_document_backside").off("filebatchuploadcomplete").on("filebatchuploadcomplete", function(){
		$("#i_upload_document_backside").fileinput("destroy");
		$.prescriptions.init_uploader_backside();	// Re-Initialize the whole thing
	});
	if (callback != undefined && typeof callback == 'function')
	{
		callback();
	}
};

$.prescriptions.init_uploader_additionals = function(callback)
{
	if ($("#hidden_prescription_id").val() == ""){
		
		return false;
	}
	
	
	var target 			= baseUrl+"admin/prescriptions/upload_attachment_ajax/";
	var show_buttons 	= true;
	
	var upload_extra 	= function(){
		return {
			start_doc_upload: 1,
			prescription_id: $("#hidden_prescription_id").val(),
			is_prescription_backside: 0,
			rendermode: 'json',
			debitor_id: $('#i_debitor_id').val(),
			docType: $('#i_doc_type_upload').val(),
			fileName: $('#i_doc_file_name').val()
		};
	};
	
	var initialPreview = [];
	var initialPreviewConfig = [];
	
	var onSuccess = function(event, data, previewId, index)
	{
		$.app.toConsole({onSuccess:data});
		$('#upload-prescription-additionals-content').hide();
		$('#upload-prescription-additionals-info').show();
		$.app.redirect(baseUrl+"admin/prescriptions/edit/"+$("#hidden_prescription_id").val()+"/1");
		var fname = data.files[index].name,
        out = '<li>' + 'Uploaded file # ' + (index + 1) + ' - '  +  fname + ' successfully.' + '</li>';
	    $('#kv-success-1 ul').append(out).fadeIn('slow');
        prescription_attachments = data.response.uploaded;
        $.prescriptions.init_uploader_additionals();
	}
	$.each( prescription_attachments, function( index, value ){

		if (value.type !== 'BACKSIDE'){

			$.app.toConsole({"fkt":'each.attachment', "index":index, "value":value});

			initialPreview.push(path_attachments + value.filename_original);

			initialPreviewConfig.push({
				type: "other",
				caption: value.filename_original,
				downloadUrl: path_attachments + value.filename,
				width: "100%",
				url: baseUrl+"admin/prescriptions/delete_attachment", // server delete action
				extra: {prescription_id: $("#hidden_prescription_id").val(), "file_id":value.document_id, "rendermode":"json","debitorDoc":1},
				key: (index+1)
			});
			prescription_attachments = prescription_attachments.filter((v, i, a) => a.indexOf(v) === i);
		}
		
	});
	$.app.toConsole(initialPreview);


	var allowed_extensions 	= ["pdf", "tiff", "jpg", "png", "gif", "doc", "docx", "xls", "xlsx", "txt", "jpeg"];
	var other_options 		= {
		overwriteInitial: false,
		allowedPreviewTypes :false, 	/* just show icons instead of preview */
		uploadAsync:true,
		initialCaption: "Your uploads",
		initialPreview : initialPreview,
		initialPreviewConfig : initialPreviewConfig,
		append: true,
		purifyHtml: true,
	    initialPreviewAsData: true, // identify if you are sending preview data only and not the raw markup
	    initialPreviewFileType: 'image', // image is the default and can be overridden in config below
	    showPreview:true,
	    preferIconicPreview:true
	}

	$.app.init_fileinput("#i_upload_additionals", target, allowed_extensions, false, onSuccess, null, 1, 10, 10000, upload_extra, undefined, true, true, show_buttons, show_buttons, show_buttons, false, false, other_options);
	
	$("#i_upload_additionals").on('filebatchpreupload', function(event, data, id, index) {
        $('#kv-success-1').html('<h4>Upload Status</h4><ul></ul>').hide();
    });
	$("#i_upload_additionals").off("filebatchuploadcomplete").on("filebatchuploadcomplete", function(event, files, extra){
		$("#i_upload_additionals").fileinput("refresh");

		/*if ($("#i_is_prescription_backside").is(':checked')){
			console.log(files);
			$.prescriptions.getBacksideImage($("#hidden_prescription_id").val());
		}
		$("#i_is_prescription_backside").prop("checked", false);*/
	});
	if (callback != undefined && typeof callback == 'function')
	{
		callback();
	}
};

/*$.prescriptions.getBacksideImage = function (prescription_id){
	var params	= [
		{"name":"prescription_id", "value":prescription_id},
		{"name":"rendermode", "value":"json"},
	];

	var target = baseUrl+"admin/prescriptions/get_backside_image/"+prescription_id;

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback get_backside_image ajax", "data":result});

		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$("#img_prescription_backside").replaceWith(result.data[0])
		}
	}, true, null, $.lang.item(""));
}*/

$.prescriptions.init_document_info_btn = function(){
	if($('button[name=bt_contract_info]').length >0)
	{
		$('button[name=bt_contract_info]').on("click", function (e) {
			var contract_id = $(this).attr('id');

			contract_id = contract_id.replace("bt_contract_info_", ""); //remove string
			if (contract_id != undefined) {
				var params = [{"name": "contract_id", "value": contract_id}, {"name": "rendermode", "value": "AJAX"}];

				$.app.sendAjaxRequest(baseUrl + "admin/debitors/get_full_contract_preview/" + contract_id, params, function success(result) {
					if (result.error && result.error != "") {
						$.dialog.error($.lang.item("error"), result.error);
					} else {
						$('#mdl_contract_preview_prescription').modal('show');
						var doAfterReplace = function () {
							$.contract.init_form();
							$.contract.init_table();
						}
						$.app.replaceContent(result.data, doAfterReplace, 'contract_preview_container_prescription');
						$('#img_prescription').show();
					}
				}, true, null, $.lang.item("show_contract_info_progress"));
			} else {
				$.dialog.error($.lang.item("error"), $.lang.item('msg_missing_parameter'));
			}
		});
	}

}

/**
 * Initialize the prescription form 
 * 
 * @author Marco Eberhardt
 * @version 1.7
 * 
 **/
$.prescriptions.init_form = function()
{
	$.app.toConsole({"fkt":"$.prescriptions.init_form"});

	$.app.init_toggle();
	$.app.init_select2();
	$.app.init_datepicker();
	$.prescriptions.dialog_handle = null;

	if ($("#form_prescription").length > 0)
	{
		//if($('#hidden_disable_debitor_search').val() != 0)
		{
			$('#i_debitor_id').select2({
				ajax: {
					minimumInputLength: 3,
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
							/*$.app.toConsole(result.data);
                            return {
                                results: result.data.items
                            };*/
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
					cache: false
				},
				templateResult: (result) =>{ return result.text;},
				placeholder: $.lang.item("please_select"),
				width: "100%",
				allowClear: true,
				language: $.lang.locale,
				theme: "bootstrap",
				dropdownAutoWidth : true
			}).on('change',function(evt){
				//$.app.toConsole($(evt.target).children("option:selected"));
				$.prescriptions.load_debitor_data_by_unique_value($(evt.target).val(), "0", function(result)
				{
					if (result.error && result.error != ""){
						$.dialog.error($.lang.item("error"), result.error);
					}
					else
					{
						if(result.extra.num_rows != 1){
							$.dialog.error($.lang.item("error"), $.lang.item("no_result"));
						}
						else
						{
							if (!(coming_from == "debitors" && skipped_ik_search_popup == 0))
							{
								var display_data = $.prescriptions.compare_stored_data_with_form(result.data);
								if($.prescriptions.dialog_handle == null)
								{
									if (display_data != "")
									{
										$.dialog.show($.lang.item("done"), $.lang.item("msg_debitor_found_do_you_want_to_take_over") + "<hr>" + display_data, function callback_done(id_modal)
											{
												$.prescriptions.apply_data(result.data, false, false); // !! Important to give the second parameter=false
												$.prescriptions.dialog_handle = null;
											},
											function callback_no(id_modal)
											{
												$.prescriptions.dialog_handle = null;
												// do nothing
											}, "success", $.lang.item("take_over"), $.lang.item("cancel"), true, "", undefined);
									}
									else
									{
										if ($.prescriptions.less_popups == false)
										{
											$.dialog.info($.lang.item("info"), $.lang.item("no_changes_detected"));
										}
									}
								}
							}
							else
							{
								$.prescriptions.apply_data(result.data, false, false); // !! Important to give the second parameter=false
								skipped_ik_search_popup++;
							}

						}
					}
				});
			});
		}

		$.prescriptions.init_uploader();
		$.prescriptions.init_uploader_backside();
		$.prescriptions.init_uploader_additionals();
		// 2021-01-20 - sperren upload maske für "alt"-Rezepte.
		//if($('#hidden_prescription_imported').val() ==1  || $('#hidden_prescription_id').val() != '')
		if($('#hidden_prescription_imported').val() ==1)
		{
			$('#upload-prescription').css({pointerEvents: "none"});
			$('#upload-prescription-additionals').css({pointerEvents: "none"});
		}
		$('#bt_save_continue').on('click',function(){
			$('#hidden_save_continue').val(1);
			$('#form_prescription').trigger('submit');
		});

		$("#form_prescription").off("submit"); 
		$("#form_prescription").submit(function(e) 
		{
        	e.preventDefault(); // stop form submission
        	e.stopImmediatePropagation();
        	$.app.toConsole({"fkt":"form_prescription.submit()"});

			if ($("#i_debitor_id").val() == "" || $("#i_debitor_id").val() == null)
			{
				$.prescriptions.save(true, false);
				/*$.dialog.info($.lang.item("question"), $.lang.item("do_you_want_to_create_a_new_debitor"),
					function callback_yes(){
						/!*$("#bt_submit").hide();
						$("#bt_submit_bottom").hide();*!/
						$("#bt_submit").show();
						$("#bt_submit_bottom").show();
						$.prescriptions.save(true, false);
					},
					function callback_no(){
						/!*$("#bt_submit").hide();
						$("#bt_submit_bottom").hide();*!/
						$("#bt_submit").show();
						$("#bt_submit_bottom").show();
						$.prescriptions.save(false, false);

					}, $.lang.item("yes_create_new_debitor"), $.lang.item("no_just_save_prescription")
				);*/
			}
			else
			{
				// We have a debitor id. First save-param is FALSE
				// Lets trigger the data comparsion before saving.
				$.prescriptions.load_debitor_data_by_unique_value($("#i_debitor_id").val(), "0", function(result)
				{
					var comparsion = $.prescriptions.compare_stored_data_with_form(result.data);

					if (comparsion == "")
					{	// presription and debitor data are the same. go ahead and save regulary
						/*$("#bt_submit").hide();
						$("#bt_submit_bottom").hide();*/
						$("#bt_submit").show();
						$("#bt_submit_bottom").show();
						$.prescriptions.save(false, true);
					}
					else
					{	// presription and debitor data are the same. go ahead and save regulary
						$.dialog.info($.lang.item("question"), $.lang.item("msg_found_differences_between_prescription_and_debitor__do_you_want_to_update_the_debitor")+"<hr>"+comparsion,
							function callback_yes(){
								/*$("#bt_submit").hide();
								$("#bt_submit_bottom").hide();*/
								$("#bt_submit").show();
								$("#bt_submit_bottom").show();
								$.prescriptions.save(false, true);
							},
							function callback_no(){
								/*$("#bt_submit").hide();
								$("#bt_submit_bottom").hide();*/
								$("#bt_submit").show();
								$("#bt_submit_bottom").show();
								$.prescriptions.save(false, false);
							}, $.lang.item("yes_update_debitor"), $.lang.item("no_dont_update_debitor")
						);
					}
				});
			}
		});

		$("#form_prescription").on("reset", function(e)
		{
			location.reload();
		});


		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// WELCHE KONSEQUENZEN ERGEBEN SICH ??? 06.10.2021
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		/*$("#i_debitor_id").on("change", function(){
			if ($("#i_debitor_id option:selected").attr("insurance_number") != "" && $("#i_debitor_id option:selected").attr("insurance_number") != undefined){
				$.prescriptions.load_debitor_by_insurance_number($("#i_debitor_id option:selected").attr("insurance_number"));
				if($("#i_followup_prescription").is(':checked'))
				{
					$("#i_followup_prescription").trigger('click');
				}
			}
		});*/
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#i_ik_number").on("change", function(){
			$("#i_ik_number_infotext").html("").removeClass("text-danger").removeClass("text-success");
			$.prescriptions.search_contract_by_ik( $(this).val(),0 );
		});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#i_insurance_number").on("change", function(){
			$.prescriptions.search_debitor_by_insurance_number( $(this).val() );
		});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#i_prescription_zipcode").on("change", function(){
			if ($("#i_team_id").val() == ""){
				// search a team if not already assigned
				$.prescriptions.search_team_by_zipcode();
			}else{
				$.prescriptions.validate_team();
			}
		})
		
		$("#bt_search_team").on("click", function(){
			$.prescriptions.search_team_by_zipcode();
		});

		// We need to Block 'bt_search_team' when entering the zipcode field, because 
		// when you leave the input by clicking this button "$.prescriptions.search_team_by_zipcode();" will be triggered twice
		$("#i_prescription_zipcode").on("focusin", function()
		{
			$("#bt_search_team").addClass("disabled");
			$("#bt_search_team").off("click");
		});
		$("#i_prescription_zipcode").on("focusout", function()
		{
			$("#bt_search_team").removeClass("disabled");
			$("#bt_search_team").on("click", function(){
				$.prescriptions.search_team_by_zipcode();
			});
		});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($("#hidden_contract_id").val() != "")
		{
			var info_text = $.prescriptions.icon_ok +$("#hidden_contract_name").val()+' '+'<button id="bt_contract_info_'+$("#hidden_contract_id").val()+'" name="bt_contract_info" type="button" value="1" class="btn btn-default btn-xs">&nbsp;<i class="fa fa-info"></i>&nbsp;</button>';
			info_text = info_text+'<br>'+$("#hidden_contract_prescription_information").val();
			$("#i_ik_number_infotext").html(info_text).addClass("text-success").removeClass("text-danger");
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#btn_run_ocr").on("click", function(){
			$.prescriptions.ocr_detection();
		});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#bt_search_debitor").on("click", function(){
			//$.prescriptions.search_debitor_by_insurance_number($("#i_insurance_number").val());
			$("#i_insurance_number").trigger("change");
		});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#bt_search_contract").on("click", function(){
			$.prescriptions.search_contract_by_ik($("#i_ik_number").val(),0);
		});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#i_team_id").on("change", function(){
			$.prescriptions.validate_team();
		});
		
		if (coming_from == "debitors" && skipped_ik_search_popup == 0){
			if ($("#hidden_prescription_id").val() == ""){
				$("#i_debitor_id").trigger("change");
			}
		}
		
		$("#hidden_contract_id").on("change", function()
		{
			$.prescriptions.checkIfWeShowProposalAccountInput($("#i_ik_number").val(), $(this).val());
			//$.prescriptions.refillProposalAccountsSelect($("#i_ik_number").val(), $(this).val(), $("#hidden_flatrate_id").val());
		});
		if(!($("#i_followup_prescription").is(':checked')))
		{
			$("#fi_parent_prescription").hide();
		}
		//
		if($("#i_followup_prescription").length > 0 )
		{
			//alert('i_followup_prescription');
			$("#i_followup_prescription").on('click',function(){
				if($("#fi_parent_prescription").length > 0 )
				{
					$.prescriptions.follow_up_prescription_select();
				}

			})
		}

		$('#i_prescription_valid_from').off('change').on('change',function(){
			$.prescriptions.calculatePrescriptionRuntime();
		});
		$('#i_prescription_valid_till').off('change').on('change',function(){
			$.prescriptions.calculatePrescriptionRuntime();
		});
		$('#i_prescription_valid_from').off('focusout').on('focusout',function(){
			$.prescriptions.calculatePrescriptionRuntime();
		});
		$('#i_prescription_valid_till').off('focusout').on('focusout',function(){
			$.prescriptions.calculatePrescriptionRuntime();
		});
		$('#i_prescription_valid_from').off('keyup').on('keyup',function(){
			$.prescriptions.calculatePrescriptionRuntime();
		});
		$('#i_prescription_valid_till').off('keyup').on('keyup',function(){
			$.prescriptions.calculatePrescriptionRuntime();
		});

		//redo breadcrump menu when debitor is set
		$.app.toConsole({"redo breadcrumb":$('#breadcrumb').find('li')});
		$('#breadcrumb').find('li').each(function(){
			if($(this).find('a').eq(0).attr('href').indexOf("debitors") != -1)
			{
				$.app.toConsole({"li-a-href":$(this).find('a').eq(0).attr('href'),"debitor_id":$('#i_debitor_id').val()});
				if($('#i_debitor_id').val() != undefined && $('#i_debitor_id').val() != null && $('#i_debitor_id').val() != "")
				{
					$(this).find('a').eq(0).attr('href',$(this).find('a').eq(0).attr('href') +"/edit/"+$('#i_debitor_id').val());
				}
			}
		});
		if($('#upload-prescription-additionals').length > 0 )
		{ //workaround for disabling prescription scann button if additional is active
			$('#prescription-tab-list').on('click',function(e){
				//alert(e.target);
				console.log(e.target);
				if(e.target.getAttribute('href') == '#upload-prescription-additionals')
				{
					$('#hidden_scan_prescription').val(0);
					// Do not disable scan button but change doc type scan
					/*$('#bt_scanagent').attr("disabled", true);
					$('#bt_scanagent_bottom').attr("disabled", true);*/
				}
				else{
					$('#hidden_scan_prescription').val(1);
					// Do not enable scan button but change doc type scan
					/*$('#bt_scanagent').attr("disabled", false);
					$('#bt_scanagent_bottom').attr("disabled", false);*/
				}
			});
		}
		$.prescriptions.init_document_info_btn();
		makePrescriptionAutoCompleter();
		$("#i_prescription_zipcode").trigger('change');
		setTimeout($.prescriptions.calculatePrescriptionRuntime,200);
	}
}

$.prescriptions.calculatePrescriptionRuntime = function(){
	if($("#i_prescription_valid_from").length ==0 && $("#i_prescription_valid_till").length==0)
	{
		return;
	}
	let strFrom, dateFrom, TSFrom, strTill, dateTill, TSTill,tmp, str, str2;

	if($("#i_prescription_valid_from").attr("entereddate") != undefined && !$("#i_prescription_valid_from").attr("entereddate").includes("."))
	{
		tmp = [];
		str = $("#i_prescription_valid_from").attr("entereddate");
		str2 = $('#i_prescription_valid_from').val();
		if(str != str2)
		{
			str = str2;
			$("#i_prescription_valid_from").attr("entereddate",str2);
			$.app.toConsole({from:1,str:str,str2:str2});
		}
		tmp[0] = str.substring(0,2);
		tmp[1] = str.substring(2,4);
		tmp[2] = str.substring(4,8);
		strFrom = tmp;
	}
	else
	{
		strFrom = $("#i_prescription_valid_from").val().split(".");
	}
	if($("#i_prescription_valid_till").attr("entereddate") != undefined && !$("#i_prescription_valid_till").attr("entereddate").includes("."))
	{
		tmp = [];
		str = $("#i_prescription_valid_till").attr("entereddate")
		str2 = $('#i_prescription_valid_till').val();
		if(str != str2)
		{
			str = str2;
			$("#i_prescription_valid_till").attr("entereddate",str2);
			$.app.toConsole({till:1,str:str,str2:str2});
		}
		tmp[0] = str.substring(0,2);
		tmp[1] = str.substring(2,4);
		tmp[2] = str.substring(4,8);
		strTill = tmp;
	}
	else
	{
		strTill = $("#i_prescription_valid_till").val().split(".");
	}
	dateFrom = new Date(strFrom[2],strFrom[1],strFrom[0]);
	TSFrom = dateFrom.valueOf()/1000;
	dateTill = new Date(strTill[2],strTill[1],strTill[0]);
	TSTill = dateTill.valueOf()/1000;

	$.app.toConsole({rawFrom:$("#i_prescription_valid_from").val(),rawTill:$("#i_prescription_valid_till").val(),enteredFrom:$("#i_prescription_valid_from").attr("entereddate"),enteredTill:$("#i_prescription_valid_till").attr("entereddate")});
	$.app.toConsole({strFrom:strFrom,dateFrom:dateFrom,TSFrom:TSFrom,strTill:strTill,dateTill:dateTill,TSTill:TSTill});
	$.app.toConsole({mTill:parseInt(strTill[1]),yTill:parseInt(strTill[2]),yFrom:parseInt(strFrom[2]),mFrom:parseInt(strFrom[1])});
	$.app.toConsole({year:(parseInt(strTill[2])-parseInt(strFrom[2]))*12,month:(parseInt(strTill[1])+1)-(parseInt(strFrom[1])+1)});

	let diff = ((parseInt(strTill[1])+1)+((parseInt(strTill[2])-parseInt(strFrom[2]))*12) - (parseInt(strFrom[1])+1))+1;
	$.app.toConsole({diff:diff});
	if(diff<1)
	{
		diff = 1;
	}
	$('#i_count_of_months').val(diff);
};

$.prescriptions.follow_up_prescription_select = function()
{
	if($("#i_followup_prescription").is(':checked'))
	{
		$.prescriptions.fill_parent_prescription();
		$("#fi_parent_prescription").show();
	}
	else
	{
		$.prescriptions.fill_parent_prescription();
		$("#fi_parent_prescription").hide();
	}
}

$.prescriptions.fill_parent_prescription = function()
{
	var params	= [
		{"name":"prescription_id", "value":$("#hidden_prescription_id").val()},
		{"name":"debitor_id", "value":$("#i_debitor_id").val()},
		{"name":"rendermode", "value":"json"},
	];

	var target = baseUrl+"admin/prescriptions/getAvailableParentPrescriptions";

	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$('#i_parent_prescription').empty();

			$.app.toConsole(result.data);
			if(result.data !== false)
			{
				$.each(result.data, function(key, value)
				{
					let text = value.prescription_valid_from+" - "+value.prescription_valid_till;
					if(value.prescription_id_abena != undefined && value.prescription_id_abena != null && value.prescription_id_abena !="")
					{
						text += "("+value.prescription_id_abena+")";
					}
					if(value.copayment_type != undefined && value.copayment_type != null && value.copayment_type != "")
					{
						text += " "+value.copayment_type;
					}
					$("#i_parent_prescription").append('<option value="'+value.prescription_id+'">'+text+'</option>');
					//$("#i_parent_prescription").append('<option value="'+value.prescription_id+'">'+value.prescription_id_abena+'('+value.prescription_id+')'+'</option>');
					
				});
			}

		}
	}, true, null, $.lang.item("show_contract_info_progress"));
}
/**
 * Initialize prescription table with custom filtering
 * 
 * @author Marco Eberhardt
 * @version 1.2
 **/
$.prescriptions.init_table = function()
{
	if ($("#tbl_prescriptions").length > 0)
	{
		$.app.toConsole({"fkt":"$.prescriptions.init_table"});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: Init additional filters
		$('button[name=filter_debitor_assignments]').each(function ()
	    {
	        $(this).on("click", function (e)
	        {
	        	$('button[name=filter_debitor_assignments]').removeClass("active");
	        	$(this).addClass("active");
	             
	        	var search = "";
	        	if ($(this).val() >= 0){
	        		search = $(this).val(); 
	        	}
	        	localStorage.setItem('prescriptions_last_filtered_debitor_assignments', $(this).val());
				//$.prescriptions.table.column(11).search(search).draw();
	        	//$.prescriptions.table.column('.debitor_found_hidden').search(search).draw();
				$.prescriptions.table.draw();
	        });
	    });
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$("#i_filter_team").on("change", function(){
			$.app.toConsole({"fkt":"filter-team", "value":$(this).val()});
			//$.prescriptions.table.column(12).search($(this).val()).draw();	// by team-id
			
			// by team-name
			//var search = ($(this).val() != "" ? $("#i_filter_team option:selected").val() : "");
			var search = $(this).val() ;
			localStorage.setItem('prescriptions_last_filtered_team', $(this).val());
			//$.prescriptions.table.column(12).search(search).draw();
			//$.prescriptions.table.column('.team_id').search(search).draw();
			$.prescriptions.table.column('.team_id').search(search).draw();

		});
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		var options = {
            rowId: 'prescription_id',
            destroy: 'true',
            deferRender: true,
            serverSide: true,
            order: [
                [8, "desc"]
            ],
            /*columnDefs:[
            	// trick the table > sort column by another column using "orderData"
            	// aer 21.10.2021 does not work. switching back to normal sorting
            	{'orderData':[10], 'targets':[6]},	// birthday
            	{'orderData':[10], 'targets':[7]},	// uploaded_at
            	{'orderData':[11], 'targets':[8]},	// assigned to debitor
            	{'orderData':[12], 'targets':[9]}	// team
            ]*/
			
        };
		
		var selected_rows = [];
		$.prescriptions.table = $.app.datatable.initialize_ajax("tbl_prescriptions", baseUrl+"admin/prescriptions/datatable", tbl_columns_prescriptions,
			function(row, data, index){
				$.app.datatable.callbacks.rowCallback(row, data, index);
				setTimeout(function () {
					$.app.init_select2();
				});
				//$.app.toConsole({"fkt":"rowCallback", "row":row, "data":data, "index":index});
			},
			function(settings, json)
			{
				$.app.init_select2();
				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				if (localStorage.getItem('prescriptions_last_filtered_debitor_assignments') != null){
					$(".filter_debitor_assignments[value="+localStorage.getItem('prescriptions_last_filtered_debitor_assignments')+"]").trigger("click");
				}else{
					$(".filter_debitor_assignments[value='0']").trigger("click"); 		// defaults to show only unassigned
				}
				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				if (localStorage.getItem('prescriptions_last_filtered_team') != null){
						$("#i_filter_team").val(localStorage.getItem('prescriptions_last_filtered_team')).trigger("change");
				}else{
					$("#i_filter_team").val($("#i_user_team").val()).trigger("change");	// defaults to own team
				}
			},
			options,
			function(data){

				var filter_debitor_assignments_val = localStorage.getItem('prescriptions_last_filtered_debitor_assignments');
				var filter_team_val = localStorage.getItem('prescriptions_last_filtered_team');
				if (filter_debitor_assignments_val == null)
				{
					filter_debitor_assignments_val = 0;
				}
				if (filter_team_val == null)
				{
					filter_team_val = $("#i_user_team").val();
				}

				data.caller_class = 'prescriptions';
				data.filter_debitor_assignments = filter_debitor_assignments_val;
				data.filter_team =filter_team_val;
			}
		);
		$('#btn_batch_scan').off('click').on('click',$.prescriptions.batch_scan);
	}
};


/**
 * Set status to rejected, partially approved, fully approved or reset back to requested
 *
 * @param prescription_id
 * @param kv_type
 * @param kv_status
 */
$.prescriptions.change_kv_state = function(prescription_id, kv_type, kv_status)
{
	if (prescription_id == undefined || kv_type == undefined || kv_status == undefined){
		throw new Error($.lang.item("msg_missing_parameter"));
	}
	$.app.blockUI();
	var params	= [
		{"name":"prescription_id", "value":prescription_id},
		{"name":"debitor_id", "value":$("#i_hidden_debitor_id").val()},
		{"name":"confirmed", "value":1},
		{"name":"kv_type", "value":kv_type},
		{"name":"rendermode", "value":"json"}
	];
	
	//var target = baseUrl+"admin/prescriptions/change_kv_state/";
	var target = baseUrl+"admin/prescriptions/change_kv_state_new_dialog/";

	var content = ""; var progress_text = ""; var question_yes_text = ""; var done_text = "";
	
	switch (parseInt(kv_status))
	{
		case kv_status_reset_to_requested:
			content             = $.lang.item("kv_state_sure_reset");
			progress_text       = "kv_state_reset_progress";
			question_yes_text   = "reset_to_requested";
			done_text           = "kv_state_resetted";
		break;
		
		case kv_status_rejected:
		case kv_status_approved:
			progress_text       = "kv_state_change_progress";
			question_yes_text   = "kv_state_change";
			done_text           = "change_kv_state_changed";
			
			content             = $.lang.item("change_kv_state_sure_change");
			
			var params2	= [
				{"name":"prescription_id", "value":prescription_id},
				{"name":"debitor_id", "value":$("#i_hidden_debitor_id").val()},
				{"name":"kv_status", "value": kv_status},
				{"name":"rendermode", "value":"ajax"}
			];
			var target2 = baseUrl+'admin/prescriptions/kv_state_change_info';
			
			//async false is a bad idea but I'm not re-building these inputs in js now
			content += function () {
				var tmp = null;
				$.ajax({
					'async': false,
					'type': "POST",
					'dataType': 'json',
					'url': target2,
					'data': params2,
					'success': function (result) {
						if (result.error && result.error != null){
							$.dialog.error($.lang.item('error'), result.error);
						}
						else {
							tmp = result.data;
						}
					}
				});
				return tmp;
			}();
		break;
	}
	
	/*var kv_state_date_param_val = "";
	$(document).on("change", "#i_status_change_date_"+prescription_id, function (){
		kv_state_date_param_val = $(this).val();
	});
	var rejection_reason_param_val = "";
	$(document).on("change", "#i_rejection_reason_"+prescription_id, function (){
		rejection_reason_param_val = $(this).val();
	});
	$(document).on("change", "#i_partially_approved_"+prescription_id, function (){
		if ($(this).is(':checked')){
			kv_status = kv_status_partially_approved;
		}
	});
	var approved_cost_param_val = "";
	$(document).on("change", "#i_approved_cost_"+prescription_id, function (){
		approved_cost_param_val = $(this).autoNumeric("get");
	});*/

	let status_cost_estimate_param_val = $("#i_status_cost_estimate_"+prescription_id).val();
	$(document).on('change',"#i_status_cost_estimate_"+prescription_id, function(){
		status_cost_estimate_param_val = $(this).val();
	});

	let approval_token_param_val = $("#i_approval_token_"+prescription_id).val();
	$(document).on('change',"#i_approval_token_"+prescription_id, function(){
		approval_token_param_val = $(this).val();
	});

	let approval_date_param_val = $("#i_approval_date_"+prescription_id).val();
	$(document).on('change',"#i_approval_date_"+prescription_id, function(){
		approval_date_param_val = $(this).val();
	});

	let approval_type_param_val = $("#i_approval_type_"+prescription_id).val();
	$(document).on('change',"#i_approval_type_"+prescription_id, function(){
		approval_type_param_val = $(this).val();
	});

	$.app.unblockUI();
	$.dialog.confirm($.lang.item("msg_are_you_sure"), content, function callback_yes()
	{
		/*params.push({"name":"kv_status", "value": kv_status});
		params.push({"name":"kv_state_date", "value":kv_state_date_param_val});
		params.push({"name":"rejection_reason", "value":rejection_reason_param_val});
		params.push({"name":"approved_cost", "value":approved_cost_param_val});*/
		params.push({name:"status_ce", value: $("#i_status_cost_estimate_"+prescription_id).val()});
		params.push({name:"approval_token", value: $("#i_approval_token_"+prescription_id).val()});
		params.push({name:"approval_date", value: $("#i_approval_date_"+prescription_id).val()});
		params.push({name:"approval_type", value: $("#i_approval_type_"+prescription_id).val()});
		
		$.app.sendAjaxRequest(target, params, function success(result)
		{
			$.app.toConsole({"fkt":"callback change_kv_state ajax", "data":result});
			
			if (result.error && result.error != ""){
				$.dialog.error($.lang.item("error"), result.error);
			}
			else{
				$.dialog.success($.lang.item("done"), $.lang.item(done_text), function callback()
				{
					if($.debitors !== undefined && $.debitors !== null)
					{
						if ($.debitors.table_prescriptions !== undefined && $.debitors.table_prescriptions !== null)
						{
							$.debitors.table_prescriptions.ajax.reload(); // reload the table
						}

						if ($.debitors.table_debitor_reminder !== undefined && $.debitors.table_debitor_reminder !== null)
						{
							$.debitors.table_debitor_reminder.ajax.reload();
						}

						if ($.debitors.table_debitor_history !== undefined && $.debitors.table_debitor_history !== null)
						{
							$.debitors.table_debitor_history.ajax.reload();
						}
					}

				});
			}
		}, true, null, $.lang.item(progress_text));
	}, null, $.lang.item(question_yes_text), $.lang.item("cancel"), function callback_open(){
		$.app.init_datepicker();
		if (kv_status == kv_status_approved || kv_status == kv_status_partially_approved) {
			$("#i_approved_cost_"+prescription_id).autoNumeric("init");
		}
		$("#i_status_change_date_"+prescription_id).trigger("change");
	});
}

$.prescriptions.open_latest_cost_estimate_file = function(prescription_id)
{
	window.open(baseUrl+"admin/prescriptions/open_latest_cost_estimate_file/"+prescription_id);
};

$.prescriptions.open_a_cost_estimate_file = function(fullpath, filename)
{
	window.open(baseUrl+"admin/prescriptions/download_file/"+fullpath+"/"+filename+"/1/1");
};

$.prescriptions.generate_cost_estimate_manual = function(prescription_id)
{
	var params	= [
		{"name":"prescription_id", "value":prescription_id},
		{"name":"debitor_id", "value":$("#i_hidden_debitor_id").val()},
		{"name":"rendermode", "value":"json"},
	];
	
	var target = baseUrl+"admin/prescriptions/generate_cost_estimate_manual/"+prescription_id;
	
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback generate_cost_estimate_manual ajax", "data":result});
		
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.dialog.success($.lang.item("done"), $.lang.item("cost_estimate_manual_has_been_generated"), function callback()
			{
				$.prescriptions.open_latest_cost_estimate_file(prescription_id);

				if($.debitors !== undefined && $.debitors !== null)
				{
					if ($.debitors.table_prescriptions !== undefined && $.debitors.table_prescriptions !== null)
					{
						$.debitors.table_prescriptions.ajax.reload(); // reload the table
					}
					if ($.debitors.table_debitor_documents !== undefined && $.debitors.table_debitor_documents !== null)
					{
						$.debitors.table_debitor_documents.ajax.reload(); // reload the table
					}
					if ($.debitors.table_debitor_reminder !== undefined && $.debitors.table_debitor_reminder !== null)
					{
						$.debitors.table_debitor_reminder.ajax.reload(); // reload the table
					}
				}
			});
		}
	}, true, null, $.lang.item("manual_cost_estimate_generate_progress"));
}

$.prescriptions.send_cost_estimate_electronic = function(prescription_id)
{
	var params	= [];
	params.push({"name":"debitor_id", "value":$("#i_hidden_debitor_id").val()});
	params.push({"name":"prescription_id", "value":prescription_id});
	params.push({"name":"rendermode", "value":"json"});
	
	var target = baseUrl+"admin/prescriptions/generate_cost_estimate_electronic/"+prescription_id;
	
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		$.app.toConsole({"fkt":"callback generate_cost_estimate_electronic ajax", "data":result});
		
		if (result.error && result.error != "")
		{
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.dialog.success($.lang.item("done"), $.lang.item("cost_estimate_electronic_has_been_generated"), function callback()
			{
                if($.debitors !== undefined && $.debitors !== null)
                {
					if ($.debitors.table_prescriptions !== undefined && $.debitors.table_prescriptions !== null){
						$.debitors.table_prescriptions.ajax.reload(); // reload the table
					}
				}

			});
		}
	}, true, null, $.lang.item("electronic_cost_estimate_generate_progress"));
	//alert('send_cost_estimate_electronic '+prescription_id);
}


$.prescriptions.export_prescription = function(prescription_id, debitor_id)
{
	//window.open(baseUrl+"admin/prescriptions/export_prescription/"+prescription_id+"/"+debitor_id);

	var params = {
		debitor_id: debitor_id,
		prescription_id: prescription_id,
		rendermode: "json"
	};

	$.app.sendAjaxRequest(baseUrl+'admin/prescriptions/export_prescription/'+prescription_id+"/"+debitor_id, params, function success(result)
	{
		$.app.toConsole({"fkt":"$.debitors.send_to_ax", "data":result});

		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else{
			$.dialog.success($.lang.item("done"), $.lang.item("request_sent_to_ax"), function callback() {});
		}
	}, true, null, $.lang.item("msg_wait"));
};

/**
 *
 * @param {string|undefined} ik_number
 * @param {string|undefined} contract_id
 */
$.prescriptions.checkIfWeShowProposalAccountInput= function(ik_number, contract_id)
{
	$.app.toConsole({"fkt":"$.prescriptions.checkIfWeShowProposalAccountInput", "ik_number":ik_number});
	
	var params = [];
	params.push({"name":"ik_number", "value":ik_number});
	if (contract_id !== undefined){
		params.push({"name":"contract_id", "value":contract_id});
	}
	params.push({"name":"rendermode", "value":"json"});
	
	var target = baseUrl+"admin/prescriptions/get_kv_type_from_contract/";
	
	$.app.sendAjaxRequest(target, params, function success(result)
	{
		if (result.error && result.error != ""){
			$.dialog.error($.lang.item("error"), result.error);
		}
		else
		{
			if(result.data.length > 0)
			{
				let res_data = result.data[0];
				if (res_data.kv_required == 1)
				{
					if (typeof kv_type_egeko !== "undefined" && res_data.kv_type == kv_type_egeko)
					{
						$("#i_proposal_account").val(proposal_account_egeko);
						$("#i_proposal_account").prop('readonly', true);
					}
					else
					{
						$("#i_proposal_account").prop('readonly', false);
					}
				}
				else
				{
					$("#i_proposal_account").val("");
					$("#i_proposal_account").prop('readonly', true);
				}

			}
			else
			{
				$("#i_proposal_account").prop('readonly', false);
			}
		}
	}, true, null, $.lang.item("msg_wait") );

};

$.prescriptions.removePrescriptionProduct = function(item){

	$(item).closest('tr').remove();

	//$('#tbl_prescriptions_product_assignment > tbody > tr').eq(idx).remove();
};

$.prescriptions.addPrescriptionProduct = function(){
	$.prescriptions.initPrescriptionProductAssignmentTable(function(){
		$('#mdl_prescription_product_selection').modal('show');
	});
};

$.prescriptions.initPrescriptionProductAssignmentTable = function(callback){

	let options = {
		serverSide: true
	};

	$.app.datatable.initialize_ajax("tbl_prescription_product_assignment_selection",
									baseUrl+"admin/prescriptions/datatable_product_assignment",
									tbl_columns_prescriptions_product_selection,
									$.app.datatable.callbacks.rowCallback,
									$.app.datatable.callbacks.initComplete,
									options
	);


	if (callback != undefined && typeof callback == 'function'){
		callback();
	}
};

$.prescriptions.takeProduct = function(row){
	let cols = $(row).children();
	let idx = 0;
	$('#tbl_prescriptions_product_assignment > tbody > tr').each(function(){
		if($(this).find('td').eq(0).find('a').eq(0).hasClass("addPrescriptionProduct") == false)
		{
			$.app.toConsole($(this).find('td').eq(0).find('a').eq(0));
			idx++;
		}
	});
	//$.app.toConsole({cols:cols});
	let html = '<tr>' +
		'			<td class="control sortable_disabled" style="width:23px; min-width:23px;" data-field="control_col">' +
		'				<a href="javascript:void(0);" onclick="$.prescriptions.removePrescriptionProduct($(this));"><i class="fa fa-remove red"> </i></a>' +
		'			</td>' +
		'			<td class="hidden sortable_disabled article_id" style="display:none;" data-field="article_id">' +
		$(cols).eq(2).html() +
		'				</td>' +
		'				<td class="hidden sortable_disabled" style="display:none;" data-field="isFlatRate">' +
		'0' +
		'</td>' +
		'			<td class="sortable_disabled" data-field="article">' +
		$(cols).eq(3).html() +
		'			</td>' +
		'			<td class="sortable_disabled" style="width:73px; min-width:73px;" data-field="amount">' +
		'			<input class="productAmount" type="text" style="width:70px;" value="1" />' +
		'			</td>' +
		'			<td class="sortable_disabled productPrice" style="width:73px; min-width:73px;" data-field="price">' +
		+ $(cols).eq(5).html() +
		'			</td>' +
		'</tr>';
	//$.app.toConsole({idx:idx,html:html,target:$('#tbl_prescriptions_product_assignment > tbody > tr').eq(idx)});
	$('#tbl_prescriptions_product_assignment > tbody > tr').eq(idx).before(html);
	$('#mdl_prescription_product_selection').modal('hide');
};

$.prescriptions.getFlatrateArticle = function(flatrate_id,contract_id){
	$.app.sendAjaxRequest(baseUrl+'admin/prescriptions/getFlatrateArticle',
					  {
							contract_id: contract_id,
							flatrate_id: flatrate_id
						  },
						  function success(result)
						  {
							  let idx = 0;
							  $.prescriptions.removeOtherFlatrateArticles();
							  $('#tbl_prescriptions_product_assignment > tbody > tr').each(function(){
								  if($(this).find('td').eq(0).find('a').eq(0).hasClass("addPrescriptionProduct") == false)
								  {
									  //$.app.toConsole({row:$(this).find('td').eq(0).find('a').eq(0)});
									  idx++;
								  }
							  });
							  for(let i=0;i<result.data.length;i++)
							  {
							  	item = result.data[i];
								  //$.app.toConsole({itemData:item});
								  if(!$.prescriptions.articleAlreadyInTable(item.article_id))
								  {
									  let html = '<tr>' +
										  '			<td class="control sortable_disabled" style="width:23px; min-width:23px;" data-field="control_col">' +
										  '				<a href="javascript:void(0);" onclick="$.prescriptions.removePrescriptionProduct($(this));"><i class="fa fa-remove red"> </i></a>' +
										  '			</td>' +
										  '			<td class="hidden sortable_disabled article_id" style="display:none;" data-field="article_id">' +
										  item.article_id +
										  '				</td>' +
										  '				<td class="hidden sortable_disabled" style="display:none;" data-field="isFlatRate">' +
										  '1' +
										  '</td>' +
										  '			<td class="sortable_disabled" data-field="article">' +
										  item.article_name +
										  '				<input class="contract_id_flatrate" type="hidden" style="width:70px;" value="'+contract_id+'" />' +
										  '				<input class="flatrate_id_flatrate" type="hidden" style="width:70px;" value="'+flatrate_id+'" />' +
										  '			</td>' +
										  '			<td class="sortable_disabled" style="width:73px; min-width:73px;" data-field="amount">1</td>' +
										  '			<td class="sortable_disabled productPrice" style="width:73px; min-width:73px;" data-field="price">' +
										  '				<input class="FlatRateValue" type="text" style="width:70px;" value="'+item.sales_price+'" readonly/>' +
										  '			</td>' +
										  '</tr>';
									  //$.app.toConsole({idx:idx,html:html,target:$('#tbl_prescriptions_product_assignment > tbody > tr').eq(idx)});
									  $('#tbl_prescriptions_product_assignment > tbody > tr').eq(idx).before(html);
								  }
							  }
						  },
						  true,
						  null,
						  $.lang.item("msg_wait"));
};

$.prescriptions.removeOtherFlatrateArticles = function(){
	$('#tbl_prescriptions_product_assignment > tbody > tr').each(function(){
		$(this).find('td').each(function(){
			$.app.toConsole({"data-field":$(this).attr('data-field'),"value":$(this).html()});
			if($(this).attr('data-field') == "isFlatRate" && parseInt($(this).html())==1)
			{
				$.app.toConsole(("removing"));
				$(this).parent().remove();
			}
		});
	});
};

const makePrescriptionAutoCompleter = function (){
	$.app.toConsole("makePrescriptionAutoCompleter init");
	const handler = $.dhl.createHandler({
		renderPopupLocation: $("#fi_prescription_street")
		, postalCode: $("#i_prescription_zipcode")
		, city: $("#i_prescription_location")
		, country: $('#hidden_prescription_country')
		, fullStreet: $("#i_prescription_street")
		, district: $("#hidden_prescription_district")
		, bundesland: $("#hidden_prescription_subdivision")
	});
	$("#form_prescription #i_prescription_zipcode, #i_prescription_street, #i_prescription_location").keyup(handler);
	$("#form_prescription #i_prescription_zipcode, #i_prescription_street, #i_prescription_location").change(handler);
	$.app.toConsole("makePrescriptionAutoCompleter ready");
}

$.prescriptions.articleAlreadyInTable = function(article_id)
{
	let retval = false;
	$('#tbl_prescriptions_product_assignment').find('.article_id').each(function(){
		if($(this).html().trim() == article_id.trim())
		{
			retval = true;
		}
	});
	return retval;
};

$.prescriptions.call_orders = function(prescription_id, caller_class)
{
	switch(caller_class) {
		case 'prescriptions':
			$.orders.show(prescription_id);
			break;
		case 'debitors':
			$.debitors.init_orders_tab(prescription_id)
			break;
		default:
		// code block
	}
}

$.prescriptions.batch_scan = function(){
	$.dialog.info($.lang.item("batch_scan_title"),$.lang.item("batch_scan_init_info"),function(){
		$.app.sendAjaxRequest(baseUrl+'admin/prescriptions/batch_scan',
								{},
								function success(result)
								{
									$.app.toConsole({"fkt":"$.prescriptions.batch_scan", "data":result});

									if (result.error && result.error != "")
									{
										$.dialog.error($.lang.item("error"), result.error);
									}
									else
									{
										if(result.data.length>0)
										{
											$('#mdl_prescription_mass_scan_progress').modal('show');
											$('#batch_scan_progressbar').progressbar({
												value: 0,
												max: result.data.length
											});
											let count = 0;
											$.prescriptions.process_prescriptions(result.data,count,function(){
												$('#batch_scan_progressbar').css("width","100%")
												setTimeout(function(){
													$('#mdl_prescription_mass_scan_progress-close').click();
													$.dialog.success($.lang.item("done"),$.lang.item("batch_scan_completed"), function() {
														$.app.redirect(baseUrl+"/admin/prescriptions/show/");
													});
												},1000);
											});
										}
										else
										{
											$.dialog.success($.lang.item("done"),$.lang.item("batch_scan_completed_nothing_new"), function() {});
										}
									}
								}, true, null, $.lang.item("msg_wait"));
	});
}

$.prescriptions.process_prescriptions = function(data,count,callback){
	let percent;
	if(count<data.length)
	{
		$.app.sendAjaxRequest(baseUrl+'admin/prescriptions/process_prescription_image',
							{
								prescription_filename: data[count]
							},
							function success(result){
								percent = (100/data.length)*(count+1);
								$('#batch_scan_progressbar').css("width",percent+"%")
								$.app.toConsole({idx:count,item:data[count]});
								count++
								$.prescriptions.process_prescriptions(data,count,callback);
							}
							,false
							,null
							,null);
	}
	else
	{
		if (callback != undefined && typeof callback == 'function')
		{
			callback();
		}
	}
}

$.prescriptions.copy = function(prescription_id){
	$.app.toConsole({"fkt":"$.prescriptions.copy", "prescription_id":prescription_id});

	$.app.sendAjaxRequest(baseUrl + "admin/prescriptions/copy",
		{
			prescription_id:prescription_id
		},
		function (result) {
			if (result.error && result.error != "")
			{
				$.dialog.error($.lang.item("error"), result.error);
			}
			else
			{
				$.app.redirect(baseUrl + "admin/prescriptions/edit/"+result.extra.insert_id);
			}
		},
		true,
		null,
		$.lang.item("msg_wait"));
}

$(document).ready(function()
{
	$.app.toConsole("prescriptions.js ready", "log");
	
	$.prescriptions.init_table();
	$.prescriptions.init_form();
	$.prescriptions.init_document_info_btn();
	setTimeout($.prescriptions.calculatePrescriptionRuntime(),1000);
});