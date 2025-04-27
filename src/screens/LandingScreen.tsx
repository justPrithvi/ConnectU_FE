import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getInterests, registerNewConnection } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const LandingScreen = ({ navigation }: any) => {
  const { setConnectionRequestId } = useContext(AuthContext);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [allTags, setallTags] = useState([]);
  const { setUserInfo } = useContext(AuthContext); // <-- add in AuthContext

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await getInterests();
        setallTags(response.data); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchInterests();
  }, []);

  const toggleTagSelection = (id: number) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(tag => tag !== id)); // Deselect tag
    } else {
      setSelectedTags([...selectedTags, id]); // Select tag
    }
  };

  const handleSubmit = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('userToken');
      let userDetails = JSON.parse(await AsyncStorage.getItem('userDetails') || '')
      if(accessToken == null) {
        navigation.navigate("Login");
      } else {        
        const body:any = {
          email: userDetails.email,
          gender: userDetails.gender,
          interests: userDetails.interests,
          selectedInterests: selectedTags
        }
        const response = await registerNewConnection(accessToken, body)
        setConnectionRequestId(response.data.messageId)
        setUserInfo(body)
        navigation.navigate('Connecting Screen')
      }
      
    } catch (error) {
      console.log(error);
      
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Let's Get Started</Text>
      <Text style={styles.subtitle}>Choose your interests to personalize your experience.</Text>

      {/* Tags Section */}
      <View style={styles.tagsContainer}>
        {allTags.map((tag:any) => (
          <TouchableOpacity
            key={tag.id}
            style={[
              styles.tag,
              selectedTags.includes(tag.id) && styles.selectedTag,
            ]}
            onPress={() => toggleTagSelection(tag.id)}>
            <Text
              style={[
                styles.tagText,
                selectedTags.includes(tag.id) && styles.selectedTagText,
              ]}>
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  tag: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTag: {
    backgroundColor: '#4e8cff',
  },
  tagText: {
    color: '#4e8cff',
    fontWeight: '500',
  },
  selectedTagText: {
    color: '#fff', // White text when tag is selected
  },
  button: {
    backgroundColor: '#4e8cff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
