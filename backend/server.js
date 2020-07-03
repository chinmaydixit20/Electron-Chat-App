const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const { userJoin, currentUser, userLeaves, getRoomUsers } = require('../utils/users');
const server = http.createServer(app);
const formatMessages = require('../utils/messages'); //instead of sending a simple string we format the message in the form of an object

const io = socketio(server);

require('dotenv').config();

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB connection established succesfully'));


app.use(express.static(path.join(__dirname, '../public')));
io.on('connection', socket => { //console.log here logs the data on the server console which is the terminal
    //console.log('new websocket connection');
    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessages('Chat', 'Welcome!'));

        socket.broadcast.to(user.room).emit('message', formatMessages('Chat', `${user.username} joined!`));
    
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

    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessages('Chat', `${user.username} has left the chat`));
            
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
            
        }

    })

});

const userRouter = require('./routes/user');
const messageRouter = require('./routes/message') 

//app.use('/message', loginRoute);
app.use('/user', userRouter);
app.use('/message', messageRouter);

const PORT = 3000 || process.env.PORT;



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));