// components/NotificationComponent.tsx

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNotification } from '../context/NotificationContext';

const NotificationComponent = () => {
  const { isVisible, notificationMessage, notificationType, hideNotification } = useNotification();
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(100);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0, 
          duration: 500, 
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1, 
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hideNotification, opacity, translateY]);

  if (!isVisible) return null;

  // Set styles based on notification type
  const notificationStyles = notificationType === 'success' 
    ? styles.successNotification 
    : styles.errorNotification;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.notificationBox, notificationStyles]}>
        <Text style={styles.notificationText}>{notificationMessage}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center', // Ensure horizontal centering
    zIndex: 1000,
  },
  notificationBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%', // Adjust width to 90% of screen
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  

  successNotification: {
    backgroundColor: '#4CAF50', // Green for success
  },
  errorNotification: {
    backgroundColor: '#f44336', // Red for failure
  },
});

export default NotificationComponent;
