$(document).ready( function() {
	$('.archive').click( function(event) {
		 //$("#loginform").submit(function(event) {
		console.log("SUBMIT");	
        event.preventDefault();

        console.log("SUBMIT");

        var archive = {
            month: $(this).text()
        };

        $.ajax({
            type    : "POST",
            url     : "/archive",
            data    : archive,
            success : function(response) {
                //window.location.replace(res);
                // console.log( 'Archive Data received. ' + response );
                var listItems = [];
                for( i=0; i< response.length; i++ ){
                	console.log( response[i]);
                	listItems.push( '<li><a href="blogpage?id="' + response[i]._id +'">' + response[i].title + '</a></li>');
                }
               $('#mar').append('<ul>' + listItems.join('') +'</ul>');
            }
        });
	});
});