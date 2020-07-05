const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const { userJoin, currentUser, userLeaves, getRoomUsers, userSwitch } = require('../utils/users');
const server = http.createServer(app);
const formatMessages = require('../utils/messages'); 

const io = socketio(server);

require('dotenv').config();

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB connection established succesfully'));


app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', socket => { 
    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('loadMsgs', user);

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    
    socket.on('chatMessage', message => {
        const user = currentUser(socket.id);
        socket.emit('storeMessage', {user, message});
        io.to(user.room).emit('message', formatMessages(user.username, message));
    })

    socket.on('switch_room', (room) => {
        const oldRoom = currentUser(socket.id).room;
        const u = userSwitch(socket.id, room);
        socket.leaveAll();
        socket.join(u.room);
        if(u) {          
            io.to(oldRoom).emit('roomUsers', {
                room: oldRoom,
                users: getRoomUsers(oldRoom)
            })  
            io.to(u.room).emit('roomUsers', {
                room: u.room,
                users: getRoomUsers(u.room)
            })
            socket.emit('loadMsgs', u);
        }
    })

    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if(user) {
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

});

const userRouter = require('./routes/user');
const messageRouter = require('./routes/message') 

app.use('/user', userRouter);
app.use('/message', messageRouter);

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));