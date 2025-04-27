import React, { useContext } from 'react';
import Navigation from './src/navigation';
import NotificationComponent from './src/components/NotificationComponent';
import { NotificationProvider } from './src/context/NotificationContext';
import { AuthProvider } from './src/context/AuthContext';

const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Navigation />
        <NotificationComponent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
