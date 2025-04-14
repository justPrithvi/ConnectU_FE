import React, { useContext } from 'react';
import { Button, View } from 'react-native';
import Navigation from './src/navigation';
import NotificationComponent from './src/components/NotificationComponent';
import { NotificationProvider } from './src/context/NotificationContext';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InvalidateButton = () => {
  const { setUserToken } = useContext(AuthContext);


  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
    setUserToken(null);
  };

  return (
    <View style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <InvalidateButton />
        <Navigation />
        <NotificationComponent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
