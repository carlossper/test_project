$(document).ready(function() {

	$('#reg_pass').on('change', function() {
		var p1 = $("#reg_pass").val();
    	var p2 = $("#reg_pass_2").val();

    	if(p1 != p2)
    	{
    		if(p2 != '')
    		{
    			window.alert("Passwords do not match!");
    		}
    	}
	});

	$('#reg_pass_2').on('change', function() {
		var p1 = $("#reg_pass").val();
    	var p2 = $("#reg_pass_2").val();

    	if(p1 != p2)
    	{
    		window.alert("Passwords do not match");
    	}
	});

});