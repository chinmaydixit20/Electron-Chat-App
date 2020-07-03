

const socket = io(); //new connection

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});



socket.emit('joinRoom', { username, room });

socket.on('roomUsers', user => {
    outputRoomName(user.room);
    outputUsers(user.users);

    const room = {
        room: user.room
    };
    console.log(room);

    axios.post('http://localhost:3000/message/fetch', room)
        .then((res) => res.data.map(msg => {
            const message = {
                username: msg.from,
                text: msg.body,
                time: 0
            }
            outputMessage(message);
        }));
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

