import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [receivedMsg, setreceivedMsg] = useState(null);

  const socket = io.connect('http://localhost:3001/');

 
  useEffect(() => {
    if (socket) {
      socket.on('getNumOnlineUsers', (data) => {
        setOnlineUsers(data);
      });

      socket.on('receiveMessage', (data) => {
         setreceivedMsg(data);
      });
      
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, receivedMsg }}>
      {children}
    </SocketContext.Provider>
  );
};
