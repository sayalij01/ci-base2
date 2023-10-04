if (typeof jQuery === 'undefined') { 
	throw new Error('This JavaScript requires jQuery'); 
}

$(document).ready(function()
{
	$.app.toConsole("menu.js ready", "log");
	
	$(".navbar-right-expand-toggle").css('color', $('.navbar-brand').css("color") ); 
	
	// login button click handler
	$('#nform_login').submit(function(e) {
        e.preventDefault();
        
        // we cannot guarantee, that the login.js is loaded. so we get it by our self
        if ($.login == undefined)
        {
        	$.getScript(baseUrl+"resources/js/login.js" )
        		.done(function( script, textStatus ) {
        			$.login.authenticate("nform_login");
				})
				.fail(function( jqxhr, settings, exception ) {
					$.app.toConsole("could not load login.js", "error");
				});
        }
        else{
        	$.login.authenticate("nform_login");
        }
	});
	
	// nav expand toggle
	$(".navbar-right-expand-toggle").click(function() 
	{
		$(".navbar-right").toggleClass("expanded");
		return $(".navbar-right-expand-toggle").toggleClass("fa-rotate-90");
	});



	setInterval(function(){
		$.ajax({
			'async': true,
			'type': "POST",
			'dataType': 'json',
			'url': baseUrl+'admin/reminder/get_open_reminders_for_me',
			'success': function (result) {
				if (result.error && result.error != null){
					//$.dialog.error($.lang.item('error'), result.error);
				}
				else {
					if (result.data[0] != -1){
						$('#span_reminders_no').html(result.data[0]);
						$('#sprintf_reminders_no').html($.lang.item('you_have_x_new_notifications').replace('%s',  result.data[0]));
					}
					//else no need to update
				}
			}
		});
	}, 60000);
	clearInterval($.app.interval_for_lock);
	$.app.interval_for_lock = setInterval(function(){
		$.app.toConsole({href:window.location.href,pathname:window.location.pathname});
		$.ajax({
			'async': true,
			'type': "POST",
			'dataType': 'json',
			'data': {
					href:window.location.href,
					pathname:window.location.pathname
			},
			'url': baseUrl+'admin/debitors/handleDatasetLocked',
			'success': function (result) {
				$.app.toConsole(result);
			}
		});
	}, 10000);

});

/*
$(function() 
{
	
});

$(function() 
{
	
});
*/

