 $("#loginform").submit(function(event) {

        event.preventDefault();

        console.log("SUBMIT");

        var loginObj = {
            username: $("#username").val(),
            password: $("#password").val()
        }

        $.ajax({
            type    : "POST",
            url     : "http://localhost:4001/logmein",
            data    : loginObj,
            success : function(res) {
                window.location.replace(res);
            }
        });