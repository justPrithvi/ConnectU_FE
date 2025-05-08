import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatWindow = ({ navigation }: any) => {
  const route = useRoute();
  const { userInfo } = useContext(AuthContext);
  const { receiverUserInfo, socket }: any = route.params;

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  const handleNavigate = () => {
    socket.emit("removeSocketMap", userInfo?.email);
    socket.disconnect();
    navigation.navigate("Landing Screen");
  };
  
  const handleSend = () => {
    if (inputText.trim()) {
      const newMsg = {
        id: Date.now(),
        from: userInfo?.email,
        to: receiverUserInfo?.email,
        text: inputText.trim(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
      socket.emit('sendMessage', newMsg)
    }
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.from === userInfo?.email ? styles.fromMe : styles.fromThem,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleNavigate}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatWindow;

// Updated styles below
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#4e8cff",
    elevation: 2,
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  chatContainer: {
    padding: 12,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginVertical: 6,
    elevation: 1,
  },
  fromMe: {
    backgroundColor: "#4e8cff",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  fromThem: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fdfdfd",
  },
  sendButton: {
    backgroundColor: "#4e8cff",
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    elevation: 2,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

