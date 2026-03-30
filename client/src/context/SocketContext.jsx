import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        let newSocket;

        if (user) {
            newSocket = io('https://new-api-mm.onrender.com', {
                transports: ['websocket', 'polling'], // Allow fallback
                reconnection: true
            });
            
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket Connected:', newSocket.id);
                newSocket.emit('setup', user);
            });

            newSocket.on('online-users', (users) => {
                setOnlineUsers(users);
            });

            newSocket.on('notification', (payload) => {
                toast(payload.message, {
                    icon: '🔔',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        fontWeight: '700'
                    },
                    duration: 4000
                });
            });

            newSocket.on('message received', (msg) => {
                // If the user isn't on the chat page, show a toast
                if (window.location.pathname !== '/chatlist' && window.location.pathname !== '/inbox') {
                    toast(`New message from ${msg.senderName || 'someone'}`, {
                        icon: '💬',
                        style: { borderRadius: '10px' }
                    });
                }
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket Connection Error:', err.message);
            });

            return () => {
                if (newSocket) {
                    newSocket.off('online-users');
                    newSocket.off('notification');
                    newSocket.off('message received');
                    newSocket.off('connect');
                    newSocket.close();
                }
            };
        }
    }, [user?._id]);
 // Depend on user ID to avoid re-triggering on profile edits

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
