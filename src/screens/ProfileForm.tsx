  import React, { useContext, useEffect, useState } from 'react';
  import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    SafeAreaView,
    Platform,
  } from 'react-native';
  import { launchImageLibrary } from 'react-native-image-picker';
  import { getGenders, getInterests, postUserDetails } from '../services/api';
  import { AuthContext } from '../context/AuthContext';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const UserDetailsScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<number | null>(null); // Gender state
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [genders, setGenders] = useState<any[]>([]);
    const [intrests, setIntrests] = useState<any[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]); // Track selected interests
    const {userEmail} = useContext(AuthContext)

    useEffect(() => {
      const loadData = async () => {
        try {
          let userDetails = JSON.parse(await AsyncStorage.getItem('userDetails') || '')
          if(userDetails) {
            if(userDetails.username) setName(userDetails.username)
            if(userDetails.bio) setBio(userDetails.bio)
            if(userDetails.age) setAge(userDetails.age)
            const interestIds = userDetails.interests.map((userInterest: any) => userInterest.interest.id);
            if(interestIds.length) setSelectedInterests([...interestIds])
            if(userDetails.gender) setGender(userDetails.gender.id)

          }
          
          const intrestsResponse = await getInterests();
          const gendersResponse = await getGenders();
          setGenders(gendersResponse.data);
          setIntrests(intrestsResponse.data);
        } catch (error) {
          console.error('Error loading data:', error); // Log any error that happens during data fetch
        }
      };
      loadData();
    }, []);

    const handleSubmit = async () => {
      const accessToken = await AsyncStorage.getItem('userToken');
      if(accessToken == null) {
        navigation.navigate("Login");
      } else {
        const userData = {
          name,
          age,
          gender,
          bio,
          image,
          interests: selectedInterests, // Include selected interests in the submission
          email: userEmail
        };
        console.log(userData);
        
        await postUserDetails(userData, accessToken)
      }
    };

    const pickImage = () => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxWidth: 600,
          maxHeight: 600,
          quality: 0.7,
        },
        (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {
            const uri = response.assets?.[0]?.uri;
            if (uri) {
              setImage(uri);
            }
          }
        }
      );
    };

    // Function to handle interest selection
    const toggleInterest = (id: number) => {
      setSelectedInterests((prevState) =>
        prevState.includes(id)
          ? prevState.filter((interestId) => interestId !== id) // Deselect
          : [...prevState, id] // Select
      );
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderButtonGroup}>
            {genders.map((genderItem) => (
              <TouchableOpacity
                key={genderItem.id}
                style={[
                  styles.button,
                  {
                    backgroundColor: gender === genderItem.id ? '#ff66b2' : '#ddd', // Pink color when selected
                    borderWidth: gender === genderItem.id ? 2 : 1,
                    borderColor: gender === genderItem.id ? '#ff66b2' : '#ddd',
                  },
                ]}
                onPress={() => setGender(genderItem.id)}
              >
                <Text style={styles.buttonText}>{genderItem.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Interests</Text>
          <View style={styles.intrestButtonGroup}>
            {intrests.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.button,
                  selectedInterests.includes(interest.id) ? styles.selectedButton : {},
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Text style={styles.buttonText}>{interest.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Write something about yourself"
            multiline
            value={bio}
            onChangeText={setBio}
          />

          <Text style={styles.label}>Profile Image</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: '#777' }}>Tap to select an image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.submittButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fefefe',
      flexGrow: 1,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
      color: '#444',
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 16,
    },
    imagePicker: {
      marginVertical: 16,
      alignItems: 'center',
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#f2f2f2',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: '#ddd',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    intrestButtonGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 16,
    },
    genderButtonGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#eee',
      paddingVertical: 8,
      paddingHorizontal: 14,
      margin: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    selectedButton: {
      backgroundColor: '#ff66b2',
      borderColor: '#ff66b2',
    },
    submittButton: {
      backgroundColor: 'blue',
      paddingVertical: 14,
      borderRadius: 30,
      alignItems: 'center',
      marginTop: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3, // For Android shadow
    }
  });

  export default UserDetailsScreen;
