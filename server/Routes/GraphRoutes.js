const express = require('express');
const users = require('../Models/users');
const requests = require('../Models/requests');

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
 

// Function to generate friend recommendations using BFS algorithm
async function generateFriendRecommendations(userId) {
    try {
        
        const visited = new Set();
        const queue = [userId];
        const recommendations = [];

        while (queue.length > 0) {
            const currentUserId = queue.shift();
            visited.add(currentUserId);

            // Find friends of the current user
            const currentUser = await users.findById(currentUserId);
            const friends = currentUser.contacts;

            if (friends && friends.length > 0) {
                friends.forEach(async (friendId) => {
                    if (!visited.has(friendId)) {
                        const friend = await users.findById(friendId);
                        recommendations.push({
                            userId: friend._id,
                            fullName: friend.fullName,
                            // Add other user details as needed
                        });
                        visited.add(friendId);
                        queue.push(friendId);
                    }
                });
            }
        }

        // Remove the user itself from recommendations
        const index = recommendations.findIndex((user) => user.userId === userId);
        recommendations.splice(index, 1);

        return recommendations;
    } catch (error) {
        throw error;
    }
}






router.get('/suggested-contacts/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the specified user
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find users who are not already in the contacts list of the specified user
        const recommendations = await users.find({
            _id: { 
                $nin: user.contacts.concat(userId) 
            }
        });

        let recommendationsAfterCheckRequests = [];

        // Function to check request for each recommendation
        const checkRequests = async (recommendation) => {
            const request = await requests.findOne({
                $or: [
                    { sender: userId, sentTo: recommendation._id },
                    { sender: recommendation._id, sentTo: userId }
                ]
            });
            return !request; // Return true if no request exists
        };

        // Map over recommendations and make multiple requests concurrently
        const requestsPromises = recommendations.map(checkRequests);
        const results = await Promise.all(requestsPromises);

        // Add recommendations for which no request exists to recommendationsAfterCheckRequests
        recommendations.forEach((recommendation, index) => {
            if (results[index]) {
                recommendationsAfterCheckRequests.push(recommendation);
            }
        });

        res.status(200).json(recommendationsAfterCheckRequests);

    } catch (e) {
        res.status(500).send(e.message);
    }
});



 
module.exports = router