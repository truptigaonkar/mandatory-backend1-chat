$(function () {
    let socket = io.connect();
    let $messageForm = $('#messageForm');
    let $messageInput = $('#messageInput');
    let $chatWindow = $('#chatWindow');

    // Message form submit function
    $messageForm.submit(function (e) {
        e.preventDefault();
        console.log($messageInput.val());

        //Input validation
        if ($messageInput.val() == '') {
            //alert('Enter message');
            $messageInput.addClass("messageInput__placeholder");
            $messageInput.attr("placeholder", "You must write something!!!")
        } else {
            $messageInput.attr("placeholder", "Enter message here.....")
            $messageInput.removeClass("messageInput__placeholder")
            socket.emit('send message', $messageInput.val()); // socket send message
        }
        $messageInput.val(''); // empty input after submission 
    });

    let $usernameForm = $('#usernameForm');
    let $usernameInput = $('#usernameInput');
    let $usernameError = $('#usernameError');

    // Username form submit function
    $usernameForm.submit(function (e) {
        e.preventDefault();
        console.log($usernameInput.val());

        //Input validation
        if ($usernameInput.val() == '') {
            //alert('Enter message');
            $usernameInput.addClass("messageInput__placeholder");
            $usernameInput.attr("placeholder", "You must write something!!!")
        } else {
            $usernameInput.attr("placeholder", "Enter Username again here.....");
            $usernameInput.removeClass("messageInput__placeholder");

            socket.emit('new user', $usernameInput.val(), function (data) {
                if (data) {
                    $('#usernameWrap').hide();
                    $('#contentWrap').show();
                }
            });
        }
        $usernameInput.val('');
    });


    // Receive chat message from server.
    socket.on('new message', function (data) {
        $chatWindow.append("<strong>" + data.user + " : </strong>" + data.msg + "<br />"); // Display the message on chatwindow
    });
});