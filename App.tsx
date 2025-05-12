import React, { useContext } from 'react';
import Navigation from './src/navigation';
import NotificationComponent from './src/components/NotificationComponent';
import { NotificationProvider } from './src/context/NotificationContext';
import { AuthProvider } from './src/context/AuthContext';
import { MessageProvider } from './src/context/MessageContext';

const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MessageProvider>
          <Navigation />
          <NotificationComponent />
        </MessageProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
