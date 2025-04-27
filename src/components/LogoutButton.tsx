import React, { useContext } from 'react';
import { Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'; 

const LogoutButton = ({ navigation }: any) => {
  const { setUserToken, setUserInfo } =useContext(AuthContext);
  const handleLogout = async () => {
    try {
      // Remove tokens from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      
      // Clear user info and token in context or state
      setUserToken(null);
      setUserInfo(null); 

      navigation.navigate('Login')
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Something went wrong during logout.');
    }
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
};

export default LogoutButton;
