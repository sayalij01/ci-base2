if (typeof jQuery === 'undefined') { 
	throw new Error('This JavaScript requires jQuery'); 
}

$.login = {
		options : {
	}
};

$.login.authenticate = function(frm_id)
{
	console.log({"fkt":"$.login.authenticate"});
	
	if ($('#'+frm_id).length > 0)
	{
		var params	= $('#'+frm_id).serializeArray();
		
		$.app.sendAjaxRequest(baseUrl+"admin/login/ajax_authenticate", params, function success(result)
		{
			console.log({"fkt":"userlogin ajax callback ", "data":result});
			
			$.app.setFormValidationStates(frm_id, result.error, result.extra, null);

			if (result.error != ""){
				$.dialog.error($.lang.item('msg_login_failed'), result.error);
			}
			else{
				$.app.redirect(baseUrl + result.data.redirect_to);
			}
		}, true, null, null);

	}
	else{
		console.log(" - form not found");
	}
}

$.login.preload = function()
{
	$.post(baseUrl+'main/Material_search/preload_materials', function( data ) {
		
		
	});
	
	/*
	$.app.sendAjaxRequest(baseUrl+'main/Material_search/preload_materials', [], function success(result)
  	{
  		// do nothing
		console.log("materials pre-loaded");
	}, false, null, "");
	*/
};


$(document).ready(function()
{
	console.log("login.js ready");

	$('#form_login').submit(function(e) {
        e.preventDefault();
        $.login.authenticate("form_login");
	});
	
	localStorage.clear();
});