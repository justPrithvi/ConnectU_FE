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
import ChatScreen from '../screens/NewChatScreen';
import FooterLayout from '../components/footer/FooterLayout';

export type RootStackParamList = {
  'Landing Screen': undefined;
  'Profile Form Screen': undefined;
  'Connecting Screen': undefined;
  'New-Connection-Chat-Screen': undefined;
  Login: undefined;
  Signup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ gestureEnabled: false , headerShown: false}}>
        <Stack.Screen
          name="Landing Screen"
          children={() => (
            <FooterLayout>
              <LandingScreen />
            </FooterLayout>
          )}
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
          name="New-Connection-Chat-Screen"
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
