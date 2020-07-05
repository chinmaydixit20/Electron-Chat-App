const users = []

function userJoin(id, username, room) {
    const user = { id, username, room };
    const us = users.filter(u => {
        return u.username === user.username;
    })
    if(us.length === 0) {
        users.push(user);
    }
    return user;    
}

function currentUser(id) {
    return users.find(user => user.id === id);
}

function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function userSwitch(id, room) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        users[index].room = room;
        return users[index];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    currentUser,
    userLeaves,
    userSwitch,
    getRoomUsers
}