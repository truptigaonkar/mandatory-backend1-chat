$(function(){
    let socket = io.connect();
    let $messageForm = $('#messageForm');
    let $messageInput = $('#messageInput');
    let $chatWindow = $('#chatWindow');

    // Message form submit function
    $messageForm.submit(function(e){
        e.preventDefault();
        console.log($messageInput.val());
        
        //Input validation
        if($messageInput.val() == ''){
            //alert('Enter message');
            $messageInput.addClass("messageInput__placeholder");
            $messageInput.attr("placeholder", "You must write something!!!")  
        }else{
            $messageInput.attr("placeholder", "Enter message here.....")
            $messageInput.removeClass("messageInput__placeholder")
            socket.emit('send message', $messageInput.val()); // socket send message
        }
        $messageInput.val(''); // empty input after submission 
    });

    // Receive chat message from server.
    socket.on('new message', function(data){ 
        $chatWindow.append("<strong>" +data.user +" : </strong>" +data.msg +"<br />"); // Display the message on chatwindow
    });
});