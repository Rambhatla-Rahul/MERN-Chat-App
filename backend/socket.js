const socketIo = (io)=>{
    const connectedUsers = new Map()
    io.on('connection',(socket)=>{
        const user = socket.handshake.auth.user;

        socket.on('join room',(groupId)=>{
            socket.join(groupId);
            connectedUsers.set(socket.id,{user,room:groupId});
            
            //? List of all users in the Room/ Group
            const usersInRoom = Array.from(connectedUsers.values()).filter((user)=>{
                return user.room === groupId;
            }).map((user)=>{
                return user.user;
            });
            io.in(groupId).emit("users in room", usersInRoom);
            socket.to(groupId).emit("notification", {
                type: "USER_JOINED",
                message: `${user?.username} has joined`,
                user: user,
            });
        })


        //? Leave room

        socket.on('leave room',(groupId)=>{
            socket.leave(groupId);
            if(connectedUsers.has(socket.id)){
                connectedUsers.delete(socket.id);
                socket.to(groupId).emit('user left',user?._id);
            }
        })


        //? New message
        socket.on('new message', (message)=>{
            socket.to(message.groupId).emit('message recieved', message);
        })


        socket.on('disconnect',()=>{
            if(connectedUsers.has(socket.id)){
                const userData = connectedUsers.get(socket.id);
                socket.to(userData.room).emit('user left',user?._id);
                connectedUsers.delete(socket.id);
            }
        })


        //? Typing indicator

        socket.on('typing',(groupId,username)=>{
            socket.to(groupId).emit('user typing',{username});
        })
        socket.on('stop typing',(groupId)=>{
            socket.to(groupId).emit('user stop typing',{username: user?.username});
        })
    })

}

module.exports = socketIo;