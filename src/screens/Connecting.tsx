import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { deleteConnectionRequest } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectingScreen = ({ navigation }: any) => {
  const [error, setError] = useState<boolean>(false);
    const { connectionRequestId } = useContext(AuthContext);
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(true);
    }, 90000); // 90 seconds

    return () => clearTimeout(timer); // clean up if user leaves early
  }, []);

  const handleGoBack = async () => {
    const accessToken = await AsyncStorage.getItem('userToken');

    if(!connectionRequestId || !accessToken) {
        navigation.navigate('Login')
    } else {
        deleteConnectionRequest(connectionRequestId, accessToken)
        navigation.navigate('Landing Screen')
    }
    
    // navigation.navigate('Landing Screen'); // Replace with your landing screen name

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
