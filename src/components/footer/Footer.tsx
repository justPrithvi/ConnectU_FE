import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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
          >
            <Ionicons name={tab.icon} size={24} color="#4F8EF7" />
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f0f4ff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(240, 244, 255, 0.9)',
    borderTopWidth: 1,
    borderColor: '#cbd5e0',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabText: {
    fontSize: 12,
    color: '#2c5282',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default Footer;
