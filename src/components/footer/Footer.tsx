import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Footer = ({ navigation }: any) => {
  const tabs = [
    { label: 'Chat', screen: 'Chat Screen', icon: 'chatbubble-outline' },
    { label: 'Find', screen: 'Landing Screen', icon: 'compass-outline' },
    { label: 'Profile', screen: 'Profile Form Screen', icon: 'person-outline' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tabButton}
            onPress={() => navigation.navigate(tab.screen)}
            activeOpacity={0.7}
          >
            <Ionicons name={tab.icon} size={24} color="#1e3a8a" />
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
   
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabText: {
    fontSize: 12,
    color: '#1e3a8a',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default Footer;
