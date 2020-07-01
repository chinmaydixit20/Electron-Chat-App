const socket = io(); //new connection

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//console.log(username, room)

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', user => {
    outputRoomName(user.room);
    outputUsers(user.users);
});

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}


socket.on('message', message => {
    //console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    
    socket.emit('chatMessage', msg); // emit a message to thee server

    e.target.elements.msg.value = '';
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

