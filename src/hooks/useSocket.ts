    import { useState, useEffect, useContext } from 'react';
    import io from 'socket.io-client';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { AuthContext } from '../context/AuthContext';
    import { Alert } from 'react-native';

    const useSocket = (namespace: string, navigation: any) => {
        const [socket, setSocket] = useState<any>(null);
        const [isConnected, setIsConnected] = useState<boolean>(false);
        const [error, setError] = useState<boolean>(false);
        const { userInfo } = useContext(AuthContext);

        useEffect(() => {
            let socketInstance: any;

            const setupSocket = async () => {
                const accessToken = await AsyncStorage.getItem('userToken');
                if (accessToken) {
                    socketInstance = io(`http://localhost:3000${namespace}`, {
                        transports: ['websocket'],
                        extraHeaders: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    socketInstance.on('connect', () => {
                        console.log('Socket connected!');
                        setIsConnected(true);
                        if (userInfo) {
                            socketInstance.emit('addToRedis', userInfo);
                            console.log('Sent userInfo to server:', userInfo);
                        }
                    });
                    
                    socketInstance.on('disconnect', () => {
                        console.log('Socket disconnected');
                        // TODO -> Remove the user from context
                        setIsConnected(false);
                    });

                    socketInstance.on('pong', (data: any) => {
                        console.log('Received pong:', data);
                    });

                    socketInstance.on('matchFound', (data: any) => {
                        Alert.alert('Success', `You are connected to ${data}`);
                        navigation.navigate('Chat Screen');
                    })

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
            }, 90000);

            return () => {
                clearTimeout(timer);
                if (socketInstance) {
                    socketInstance.disconnect();
                }
            };
        }, [namespace]); 

        return { socket, isConnected, error };
    };

    export default useSocket;
