const express = require('express');
const users = require('../Models/users');


const router = express.Router();



//fct graph shortestPathBetweenUsers
function SPBU(graph, startUserId, targetUserId){

    const distances = {};
    const previous = {};
    const queue = [];

    Object.keys(graph).forEach(node=>{
        distances[node] = Infinity;
        previous[node] = null, 
        queue.push(node);
    });
     

    distances[startUserId] = 0;

    while(queue.length > 0){

        const currentNodeIndex = queue.reduce((minNodeIndex, nodeIndex) => (
            distances[queue[nodeIndex]] < distances[queue[minNodeIndex]] ? nodeIndex : minNodeIndex
        ), 0);
        const currentNode = queue[currentNodeIndex];
        queue.splice(currentNodeIndex, 1); 

        
        console.log(currentNode);
        
        if(currentNode === targetUserId){
            const path = [];
            let node = targetUserId;
            while(node !== null){
                path.unshift(node);
                node = previous[node];
            }
            return path;
        }

        Object.keys(graph[currentNode]).forEach(neighbor=>{
            const distanceToNeighbor = distances[currentNode]+1;
            if(distanceToNeighbor < distances[neighbor]){
                distances[neighbor] = distanceToNeighbor;
                previous[neighbor] = currentNode;
            }

        })
    
    }
    return null;

}





router.get('/ShortestPathBetweenUsers/:startUserId/:targetUserId', async(req, res)=>{
    try{
        const allUsers = await users.find();

        const {startUserId} = req.params;
        const {targetUserId} = req.params;
 

        const socialNetworkGraph = {}

        if(allUsers){
            if(allUsers.length>=2){
                allUsers.forEach(user=>{
                    socialNetworkGraph[user._id] = {};
                    if(user.contacts.lenght !== 0){
                        user.contacts.forEach(contactId => {
                            socialNetworkGraph[user._id][contactId] = true
                        });
                    }
                });
                console.log();
                console.log();
                if(socialNetworkGraph !== null){
                    let path = SPBU(socialNetworkGraph, startUserId, targetUserId);
                    console.log("Short Path : "+path);
                }   
                else{
                    console.log("Function can not be executed on empty graph");
                }             
                res.status(200).send(socialNetworkGraph);
            }
            else{
                res.status(201).send("Error : no data was found");
            }
        }
        else{
            res.status(300).send("Error : request wasn't completed");
        }

    }
    catch(e){
        res.status(500).send(e.message)
    }
});



module.exports = router