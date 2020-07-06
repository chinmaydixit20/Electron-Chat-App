const socket = io(); //new connection
const electron = require('electron');
const moment = require('moment');
const { ipcRenderer } = electron;
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const roomList = document.querySelector('.room-list');

var username;
var currentRoom = 'JavaScript';

ipcRenderer.on('userLoginSuccess', (e, user) => {
    console.log(user);
    username = user.username;
    socket.emit('joinRoom', { username: user.username, room: 'JavaScript'}); //c
})


socket.on('roomUsers', user => {
    outputUsers(user.users);
});    

socket.on('loadMsgs', user => {
    const room = {
        room: user.room
    };

    axios.post('http://localhost:3000/message/fetch', room)
        .then((res) => {
            
            chatMessages.innerHTML = '';
            res.data.map(msg => {
                
                const message = {
                    username: msg.from,
                    text: msg.body,
                    time: moment(msg.updatedAt).format('DD-MM h:mm a')
                }
                outputMessage(message);
                })
            
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
});


roomList.addEventListener('click', (e) => {
    console.log(e.target.innerHTML);
    const room = e.target.innerHTML;
    if(room !== currentRoom) {
        
        currentRoom = room;
        
        socket.emit('switch_room', room);
    }
})

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}


socket.on('message', message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    
    socket.emit('chatMessage', msg); // emit a message to the server

    e.target.elements.msg.value = '';
})

// storing message after chatMessage emit to server
socket.on('storeMessage', msg => {
    const message = {
        to: msg.user.room,
        from: msg.user.username,
        bodyM: msg.message
    }
    console.log(message);

    axios.post('http://localhost:3000/message/new', message)
        .then(res => console.log(res.data));
})

const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML +=
        `
            <p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
                ${message.text}    
            </p>
        `;
    document.querySelector('.chat-messages').appendChild(div);    
}

