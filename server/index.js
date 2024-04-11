const authRoutes        =  require('./Routes/authRoutes');
const userRoutes        =  require('./Routes/userRoutes');
const notifsRoutes      =  require('./Routes/notifRoutes');
const postsRoutes       =  require('./Routes/postRoutes');
const requestsRoutes    =  require('./Routes/requestRoutes');
const pagesRoutes       =  require('./Routes/pageRoutes');
const roomsRoutes       =  require('./Routes/roomsRoutes');
const messagesRoutes    =  require('./Routes/messageRoutes');
const adsRoutes         =  require('./Routes/adsRoutes');
const GraphRoutes       =  require('./Routes/GraphRoutes');
const mongoose          =  require('mongoose');
const express           =  require('express');
const Connect           =  require('./Helpers/Database');
const http              =  require('http');
const cors              =  require('cors');
const clc               =  require("cli-color");
const { Server }        =  require('socket.io');
 


//    CONFIGURATIONS
require('dotenv').config();
const app = express();
app.set('trust proxy', true);   
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
server.listen(process.env.PORT, ()=>{
    console.log(clc.magenta.bold("Connected to Server"));
    Connect();
});
const io = new Server(
    server, 
    {
        cors : {
            methods : ['GET', 'POST']
        }
    }
); 

//    API EVENTS
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/notif', notifsRoutes);
app.use('/request', requestsRoutes);
app.use('/post', postsRoutes);
app.use('/page', pagesRoutes);
app.use('/room', roomsRoutes);
app.use('/message', messagesRoutes);
app.use('/ads', adsRoutes);
app.use('/graph', GraphRoutes);

//   WEBSOCKETS EVENTS


let usersOnline =  new Array();
const GRI = "XPLORIUM";                                 //   GRI stands for Global Room Id



io.on('connect', (socket)=>{

    const interval = setInterval(() => {
        sendNumOnline();
    }, 250); 


    socket.on('enterGlobalRoom',(idUser)=>{
        socket.join(GRI);
        const userObject = { idSocket: socket.id, idUser: idUser };
        const existingUserIndex = usersOnline.findIndex(user => user.idUser === idUser);
        if (existingUserIndex === -1) {
            usersOnline.push(userObject);
        } else {
            usersOnline[existingUserIndex].idSocket = socket.id;
        }
    });
    

    socket.on('logoutAndQuitGR', ()=>{
        const idUser = getUserBySocketID(socket.id);
        socket.leave(GRI);
        removeUser(idUser);
        clearInterval(interval);
    });

    socket.on('EnterConvWithFriend', (data)=>{
        console.log("⚡ "+data.idWhoEnter+" successfully joined a room.");
        io.to(data.idRoom).emit("Entered-Successfully");
    });
    

    socket.on('sendMessage', (data)=>{
        io.to(GRI).emit("receiveMessage",data);
    });
    

    socket.on('disconnect', () => {
        const idUser = getUserBySocketID(socket.id);
        removeUser(idUser);
        clearInterval(interval);
    });

    socket.on('CheckingOfConnectionStatus', (idUser)=>{
        const user = usersOnline.find(user => user.idUser === idUser);
        if(user){
            io.to(socket.id).emit('ConnectionStatus', { idUser : idUser, status: 'online' });
        }
        else{
            io.to(socket.id).emit('ConnectionStatus', { idUser : idUser, status: 'notOnline' });
        }
    });

    function sendNumOnline(){
        const numOnlineUsers = usersOnline.length;
        io.to(GRI).emit('getNumOnlineUsers', numOnlineUsers);
    }
   
    function removeUser(idUser) {
        const index = usersOnline.findIndex(user => user.idUser === idUser);
        if (index !== -1) {
            usersOnline.splice(index, 1);
        }
    }

    function getUserBySocketID(idSocket) {
        const user = usersOnline.find(user => user.idSocket === idSocket);
        return user ? user.idUser : null;
    }

    
    
});