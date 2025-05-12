    import { useState, useEffect, useContext } from 'react';
    import io from 'socket.io-client';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { AuthContext } from '../context/AuthContext';
    import { Alert } from 'react-native';
    import { refresh } from '../services/api';
    import { CommonActions } from '@react-navigation/native';
    import { useMessages } from '../context/MessageContext';

    const useSocket = (namespace: string, navigation: any) => {
        const [socket, setSocket] = useState<any>(null);
        const [isConnected, setIsConnected] = useState<boolean>(false);
        const [error, setError] = useState<boolean>(false);
        const { userInfo } = useContext(AuthContext);
        const { newConnectionMsgs, addNewConnectionMessage } = useMessages();
        useEffect(() => {
            let socketInstance: any;

            const setupSocket = async () => {
                const accessToken = await AsyncStorage.getItem('userToken');
                const refreshToken = await AsyncStorage.getItem('refreshToken')
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

                    socketInstance.on('receive_new_connection_message', (receivedMessage: any) => {
                        // Add msg to context which will be read by the message useEffect()
                        addNewConnectionMessage(receivedMessage)                          
                    });

                    socketInstance.on('auth_error', async () => {
                        if (refreshToken) {
                            try {
                                const data = await refresh(refreshToken);
                                const newAccessToken = data?.data?.accessToken;
                                const newRefreshToken = data?.data?.refreshToken;
                    
                                if (newAccessToken && newRefreshToken) {
                                    await AsyncStorage.setItem('userToken', newAccessToken);
                                    await AsyncStorage.setItem('refreshToken', newRefreshToken);
                    
                                    // Clean up current socket
                                    socketInstance.disconnect();
                    
                                    // Recreate socket with new token
                                    const newSocket = io(`http://localhost:3000${namespace}`, {
                                        transports: ['websocket'],
                                        extraHeaders: {
                                            Authorization: `Bearer ${newAccessToken}`,
                                        },
                                    });
                    
                                    // Set up the same listeners
                                    setSocket(newSocket); // update state
                    
                                    // Optional: you can abstract this into a function for reuse
                                }
                            } catch (e) {
                                console.log('Refresh failed:', e);
                                setError(true);
                            }
                        }
                    });
                    

                    socketInstance.on('matchFound', (data: any) => {
                        Alert.alert('Success', `You are connected to ${data.name}`);   
                        // navigation.dispatch(
                        //     CommonActions.reset({
                        //         index: 0,
                        //         routes: [
                        //             {
                        //                 name: "New-Connection-Chat-Screen",
                        //                 params: {
                        //                     receiverUserInfo: data,
                        //                     socket: socketInstance,
                        //                 },
                        //             },
                        //         ],
                        //     })
                        // );    
                        
                        navigation.navigate('New-Connection-Chat-Screen',  { receiverUserInfo: data, socket: socketInstance });
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
