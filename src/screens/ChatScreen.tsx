import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';

const messages = [
  {
    id: "1",
    text: "Hey! How are you?",
    sender: "Alice",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    isMe: false,
  },
  {
    id: "2",
    text: "I'm good, how about you?",
    sender: "You",
    isMe: true,
  },
  {
    id: "3",
    text: "Doing great. What’s up?",
    sender: "Alice",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    isMe: false,
  },
];

const ChatWindow = ({navigation}: any) => {
  

  const handleNavigate = () => {
    navigation.navigate('Landing Screen')
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              item.isMe ? styles.messageRight : styles.messageLeft,
            ]}
          >
            {!item.isMe && (
              <Image source={{ uri: item.photo }} style={styles.avatar} />
            )}
            <View
              style={[
                styles.bubble,
                item.isMe ? styles.myBubble : styles.theirBubble,
              ]}
            >
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        )}
      />
      
      <Button title="Go to Landing Screen" onPress={handleNavigate} />
    </SafeAreaView>
  );
};

export default ChatWindow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  messageRight: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: "#0078fe",
    borderTopRightRadius: 0,
  },
  theirBubble: {
    backgroundColor: "#e5e5ea",
    borderTopLeftRadius: 0,
  },
  text: {
    color: "#000",
  },
});
