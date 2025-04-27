import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSocket = (namespace: string) => {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {

        
        const setupSocket = async () => {
            const accessToken = await AsyncStorage.getItem('userToken');
            if (accessToken) {
                const socketInstance = io(`http://localhost:3000${namespace}`, {
                transports: ['websocket'],
                extraHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
                });

                socketInstance.on('connect', () => {
                    console.log('Socket connected!');
                    setIsConnected(true);
                });

                socketInstance.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setIsConnected(false);
                });

                socketInstance.on('pong', (data: any) => {
                    console.log('Received pong:', data);
                });

                socketInstance.on('error', (error: any) => {
                    console.log('Socket error:', error);
                    setError(true);
                });

                setSocket(socketInstance);
            } else {
                console.log('No token found');
                setError(true);
            }
        };

        try {
            setupSocket();
        } catch (error) {
            console.log(error);
        }

        const timer = setTimeout(() => {
        setError(true);
        }, 90000); // 90 seconds

        return () => {
            clearTimeout(timer);
            if (socket) {
                socket.disconnect();
            }
        };
    }, [namespace]);

    return { socket, isConnected, error };
};

export default useSocket;
