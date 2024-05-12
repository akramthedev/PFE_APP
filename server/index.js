const authRoutes        =  require('./Routes/authRoutes');
const annoucement       =  require('./Models/annoucement');
const posts             =  require('./Models/posts');
const ads               =  require('./Models/ads');
const statusMonitor     =  require('express-status-monitor');
const userRoutes        =  require('./Routes/userRoutes');
const notifsRoutes      =  require('./Routes/notifRoutes');
const postsRoutes       =  require('./Routes/postRoutes');
const cloudinaryRoutes  =  require('./Routes/cloudinaryRoutes');
const requestsRoutes    =  require('./Routes/requestRoutes');
const pagesRoutes       =  require('./Routes/pageRoutes');
const roomsRoutes       =  require('./Routes/roomsRoutes');
const messagesRoutes    =  require('./Routes/messageRoutes');
const adsRoutes         =  require('./Routes/adsRoutes');
const stripeRoutes      =  require('./Routes/stripeRoute');
const GraphRoutes       =  require('./Routes/GraphRoutes');
const mongoose          =  require('mongoose');
const adsviews          =  require('./Models/AdsViews');
const searchRoutes      =  require('./Routes/searchRoutes');
const express           =  require('express');
const Connect           =  require('./Helpers/Database');
const http              =  require('http');
const cors              =  require('cors');
const clc               =  require("cli-color");
const { Server }        =  require('socket.io');
require('dotenv').config();

const app = express();
app.set('trust proxy', true); 
app.use(statusMonitor());
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
app.use('/stripe',stripeRoutes);
app.use('/cloudinary', cloudinaryRoutes);
app.use('/search', searchRoutes);
app.get('/annoucement', async(req, res)=>{
    try{
         
        const areFound = await annoucement.find();
        if(areFound){
            res.status(200).send(areFound);
        }
        else{
            res.status(202).send('Not Found...');
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
});




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





app.get('/fetchSomeAds/:idUser', async (req, res) => {
    try {
        const { idUser } = req.params;

        // Find all posts where the user interacted
        const allPostsWhereTheUserInteracted = await posts.find({
            $or: [
                { likes: idUser },
                { "comments.commentator": idUser }
            ]
        });

        // Extract unique topics from the user's interactions
        const topicsUserMayLike = new Set();
        allPostsWhereTheUserInteracted.forEach(post => {
            post.topic.forEach(topic => {
                topicsUserMayLike.add(topic.category.trim());
            });
        });

        // Find relevant ads based on extracted topics
        const relevantAds = await ads.find({
            topic: { $elemMatch: { category: { $in: [...topicsUserMayLike] } } },
            adser: { $ne: idUser }
        });

        // If no relevant ads found, fallback to random ads
        if (relevantAds.length === 0) {
            // If no relevant ads found, fallback to fetching 2 random ads
            const randomAds = await ads.find({ adser: { $ne: idUser } }).limit(2);
            return res.status(200).send(randomAds);
        } else if (relevantAds.length === 1) {
            // If only one relevant ad found, fetch one more random ad to make it 2
            const randomAd = await ads.findOne({ adser: { $ne: idUser } });
            const limitedRelevantAds = [...relevantAds, randomAd];
            return res.status(200).send(limitedRelevantAds);
        } else {
            // Return relevant ads, limited to 2 if more than 2 found
            const limitedRelevantAds = relevantAds.slice(0, 2);
            return res.status(200).send(limitedRelevantAds);
        }
        
    } catch (e) {
        res.status(500).send(e.message);
    }
});


