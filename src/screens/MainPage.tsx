import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Card } from 'react-native-paper';

const MainScreen = ({ navigation }: any) => {
  const miniApps = [
    { id: 1, name: 'Resize Images', description: 'Resize your images'},
    // { id: 2, name: 'Offload Stoarage', description: 'Upload data to cloud'},
    // { id: 3, name: 'Manage Storage', description: 'Check your uploaded data'},
  ];

  const tileColors = ['#6200ea', '#03dac6', '#ff5722', '#8e24aa', '#c2185b'];
  const openApp = (appId: number) => {
    const page = miniApps.forEach(app => {
      if(app.id === appId) {
        return app.name
      }
    })
    navigation.navigate("Resize Images")
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {miniApps.map((app, index) => (
        <Card key={app.id} style={[styles.card, { backgroundColor: tileColors[index % tileColors.length] }]}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{app.name}</Text>
            <Text style={styles.cardDescription}>{app.description}</Text>
            <TouchableOpacity
              onPress={() => openApp(app.id)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Open</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16, // Adjust padding for iOS devices
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000', // More prominent shadow
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 8, // Shadow radius
  },
  cardContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark backdrop with some transparency
    borderRadius: 16,
    padding: 20,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative', // Position for the button to be at the bottom
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#f1f1f1',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light button background
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Button shadow
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonText: {
    color: '#6200ea',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default MainScreen;
