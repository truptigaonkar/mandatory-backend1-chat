$(function () {
    let socket = io.connect();
    let $messageForm = $('#messageForm');
    let $messageInput = $('#messageInput');
    let $chatWindow = $('#chatWindow');
    var $users = $('#users');

    let $usernameForm = $('#usernameForm');
    let $usernameInput = $('#usernameInput');
    let $usernameError = $('#usernameError');

    // Username form submit function
    $usernameForm.submit(function (e) {
        e.preventDefault();
        //console.log($usernameInput.val());

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
                    $('#mainWrapper').show();
                } else {
                    $usernameError.html('The username is already taken! Try again.')
                }
            });
        }
        $usernameInput.val('');
    });

    socket.on('usernames', function(data) {
        $users.html( data.join("<br/>") ); 
   });

    // socket.on('usernames', function(data){
    //     var html = '';
    //     for(i = 0;i < data.length;i++){
    //         html += data[i] + '<br>';
    //     }
    //     $users.html(html);
    // });

   
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

    // Receive chat message from server.
    socket.on('new message', function (data) {
        $chatWindow.append("<strong>" + data.user + " : </strong>" + data.msg + "<br />"); // Display the message on chatwindow
    });

     // listener, whenever the server emits 'updatechat', this updates the chat body
  socket.on('updatechat', function (username, data) {
    $('#chatWindow').append('<b>'+username + ':</b> ' + data + '<br>');
  });

});