$(document).ready( function() {
	$('.archive').click( function(event) {
		 //$("#loginform").submit(function(event) {
		console.log("SUBMIT");	
        event.preventDefault();

        console.log("SUBMIT");

        var archive = {
            month: $(".month").text()
        };

        $.ajax({
            type    : "POST",
            url     : "/archive",
            data    : archive,
            success : function(response) {
                //window.location.replace(res);
                //console.log( 'Archive Data received. ' + response );
                for( i=0; i< response.length; i++ ){
                	console.log( response[i]);
                }
               // $('#mar').append('<ul>)
            }
        });
	});
});