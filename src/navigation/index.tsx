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

const Stack = createStackNavigator();

const Navigation = () => {
  const { userToken, setUserToken } = useContext(AuthContext);
  const [isAppReady, setIsAppReady] = React.useState(false);
  const [userHasBasicDetails, setuserHasBasicDetails] = useState<Boolean>(false)
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        let userDetails = JSON.parse(await AsyncStorage.getItem('userDetails') || '')
        
        if (!refreshToken) {
          setUserToken(null);
          setIsAppReady(true);
          return;
        }

        if(userDetails?.photos.length>=1) {
          setuserHasBasicDetails(true)
        } else setuserHasBasicDetails(false)
        
        const res = await refresh(refreshToken);
        setUserToken(res.data.accessToken);
        await AsyncStorage.setItem('userToken', res.data.accessToken);
      } catch (err) {
        setUserToken(null);
      } finally {
        setIsAppReady(true);
      }
    };

    checkToken();
  }, [userToken]);

  if (!isAppReady) return null; // Or splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? 
          <>
            <Stack.Screen name="Landing Screen" component={LandingScreen} />
            <Stack.Screen name="Connecting Screen" component={ConnectingScreen} />
            <Stack.Screen name="Profile Form Screen" component={ProfileForm} />
          </>
         : 
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default Navigation;
