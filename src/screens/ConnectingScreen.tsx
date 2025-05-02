import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { deleteConnectionRequest } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSocket from '../hooks/useSocket'; // Import the custom hook

const ConnectingScreen = ({ navigation }: any) => {
  const [error, setError] = useState<boolean>(false);
  const { userInfo } = useContext(AuthContext);

  // Use the custom hook to connect to the socket
  const { socket, isConnected, error: socketError } = useSocket('/connection', );
  
  const removeSocket = () => {
    socket.emit('removeFromRedis', userInfo); // Emit event before disconnecting
    socket.disconnect();
  }
  
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (socket && socket.connected) {
  //       removeSocket()
  //     }
  //     setError(true); 
  //   }, 90000); 

  //   return () => clearTimeout(timer);
  // }, [socket]);

  const handleGoBack = async () => {
    const accessToken = await AsyncStorage.getItem('userToken');
    removeSocket()
    if (!accessToken) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Landing Screen');
    }
  };

  return (
    <View style={styles.container}>
      {!error ? (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.connectingText}>Connecting...</Text>
          <Button title="Go Back" onPress={handleGoBack} />
        </>
      ) : (
        <>
          <Text style={styles.errorText}>Connection Unsuccessful. Please try again.</Text>
          <Button title="Go Back to Landing Page" onPress={handleGoBack} />
        </>
      )}
    </View>
  );
};

export default ConnectingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  connectingText: { marginTop: 20, fontSize: 18 },
  errorText: { color: 'red', fontSize: 20, marginBottom: 20, textAlign: 'center' },
});
