import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotification } from '../context/NotificationContext';
import {login} from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { showNotification } = useNotification();

    const { setUserToken, setUserEmail } = useContext(AuthContext);

    const handleLogin = async () => {
      if (!username || !password) {
        showNotification("Please fill out all fields.", "error");
        return;
      }
    
      if (!/\S+@\S+\.\S+/.test(username)) {
        showNotification("Please enter a valid email", "error");
        return;
      }
      
      try {
        const response = await login(username, password);
        
        const accessToken = response.data.tokens.accessToken;
        const refreshToken = response.data.tokens.refreshToken;
        // Save the user in context for future user
        
        await AsyncStorage.setItem('userDetails', JSON.stringify(response.data.user))
        await AsyncStorage.setItem('userEmail', username)
        await AsyncStorage.setItem('userToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken)

        setUserToken(accessToken);
        setUserEmail(username)
    
        showNotification("Login Successful", "success");

        if(response.data.user?.photos.length>=1) navigation.navigate("Landing Screen");
        else navigation.navigate("Profile Form Screen") 

        
        // navigation.navigate("ProfileInputScreen");
      } catch (error) {
        navigation.navigate("Login");
        showNotification("An error occurred. Please try again.", "error");
      }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 15,
    color: '#007BFF',
    fontSize: 14,
  },
});

export default LoginScreen;
