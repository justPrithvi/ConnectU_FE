import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MainScreen from '../screens/MainPage';
import ProfileForm from '../screens/ProfileForm';
import axiosInstance from '../services/axios';
import { refresh } from '../services/api';
import LandingScreen from '../screens/LandingScreen';
import ConnectingScreen from '../screens/ConnectingScreen';
import ChatScreen from '../screens/ChatScreen';
import FooterLayout from '../components/footer/FooterLayout';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ gestureEnabled: false , headerShown: false}}>
        <Stack.Screen
          name="Landing Screen"
          component={LandingScreen}
        />
        <Stack.Screen
          name="Profile Form Screen"
          component={ProfileForm}
        />
        <Stack.Screen
          name="Connecting Screen"
          component={ConnectingScreen}
          
        />
        <Stack.Screen
          name="Chat Screen"
          component={ChatScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default Navigation;
