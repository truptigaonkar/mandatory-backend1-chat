## Real Time Chat Application - Backend - Express, Node, Socket - [Live Demo]( http://immense-inlet-98375.herokuapp.com/)
Real time chat application using Backend - Express, Node & Socket.io
#### Technologies
* Node
* JavaScript, JQuery
* Backend: Socket.io library (https://socket.io/docs/ )
* Express
* Reactstrap (https://reactstrap.github.io/)
#### Installation
REACT
```
  $ git clone https://github.com/truptigaonkar/mandatory-backend1-chat
  $ cd mandatory-advanced-js1.git
  $ npm install
  $ npm start
```
Express
```
  $ node server/server.js
  $ npm start
```
### Instructions
* The chat should, as a slack, have support for several rooms - ie if you write in a specific room, the message should only show in the room.
* User should be able to create and remove rooms - all rooms should have a unique name
* Every message has info about who wrote it
* Chat should support real-time messages (recommend socket.io)
* The rooms & all messages must be saved in the long term (eg in one or more files). That is, when you restart the server everything should be left
* Each room should have a list of all users who have written something earlier
### Optional
* View all users who are active in the chat
* Add logic for "writing right now" (shown often as ...)
* Add locked room - a room that requires entering a password to access
* Direct messages to other users
* profile Pictures
* emoji
* Edit & delete old messages
