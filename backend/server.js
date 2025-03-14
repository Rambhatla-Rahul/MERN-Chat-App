const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const socketio = require('socket.io');
const socketIo = require('./socket');
const groupRouter = require('./routes/groupRoutes');
const messageRouter = require('./routes/messageRoutes');

dotenv.config();


const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors:{
        origin: '*',
        methods: ["GET","POST"],
        credentials:true,

    }
});

app.use(cors());
app.use(express.json());


//? Connect to database

const connectToDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');
}
connectToDB();

//? Initialize Socket Configuration
socketIo(io);

//? Include routes

app.use('/api/users', userRouter);
app.use('/api/groups',groupRouter);
app.use('/api/messages',messageRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT,console.log(`Server is running on PORT ${PORT}`)
);