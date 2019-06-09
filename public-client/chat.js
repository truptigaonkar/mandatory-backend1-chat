let socket = io.connect();
let $messageForm = $('#messageForm');
let $messageInput = $('#messageInput');
let $chatWindow = $('#chatWindow');
let $users = $('#users');

let $usernameForm = $('#usernameForm');
let $usernameInput = $('#usernameInput');
let $usernameError = $('#usernameError');

$(function () {
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
                    $usernameError.html('Username is already taken! Try again.')
                }
            });
        }
        $usernameInput.val('');
    });

    //Username list
    // socket.on('usernames', function (data) {
    //     $users.html(data.join("<p>"));
    // });

    //Alternate way of listing users
    socket.on('usernames', function (data) {
        let html = '';
        for (i = 0; i < data.length; i++) {
            html += data[i] + '<hr>';
        }
        $users.html(html);
    });

    // Message form submit function
    $messageForm.submit(function (e) {
        e.preventDefault();
        console.log($messageInput.val());

        //Input validation
        if ($messageInput.val() == '') {
            $messageInput.addClass("messageInput__placeholder");
            $messageInput.attr("placeholder", "You must write something!!!")
            //$messageInput.css("color", "red")
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
        $('#chatWindow').append('<b>' + username + ':</b> ' + data + '<br>');
    });

    // listener, whenever the server emits 'updaterooms', this updates the room the client is in
    socket.on('updaterooms', function (rooms, current_room) {
        $('#rooms').empty();
        $.each(rooms, function (key, value) {
            if (value == current_room) {
                //Listing rooms with delete button
                $("#rooms").append('<ul class="list-group">' +
                                '<li class="id list-group-item">' + value.id +
                                ' ' + value.name +
                                ' ' + '<button class="btnDelete btn btn-danger btn-xs">' +
                                'X' +
                                '</button>' +
                                '</li>') +
                            '</ul>';
            }
            else {
                //After switching room
                $("#rooms").append('<ul class="list-group">' +
                                '<li class="id list-group-item"><a href="#" onclick="switchRoom(\'' + value.name + '\')">' + value.id +
                                ' ' + value.name +
                                ' ' + '<button class="btnDelete btn btn-danger btn-xs">' +
                                'X' +
                                '</button>' +
                                '</a></li>') +
                            '</ul>';
            }
        });
    });

    // socket.on('updateroomusers', function(roomusers) {
    //     $("#roomusers").empty();
    //     $.each(roomusers, function (key, value) {
    //         $('#roomusers').append('<div>' + value.username + '</div>');
    //     });
    //     });

});

function switchRoom(room) {
    socket.emit('switchRoom', room);
}