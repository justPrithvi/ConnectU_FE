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

const ChatWindow = ({ navigation }: any) => {
  const route = useRoute();
  const { userInfo } = useContext(AuthContext);
  const { connectedUserInfo, socket }: any = route.params;

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
        to: connectedUserInfo?.email,
        text: inputText.trim(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");

      // You can emit socket event here
      // socket.emit('sendMessage', newMsg);
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
        <Text style={styles.backText}>← Back</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 12,
    backgroundColor: "#4e8cff",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chatContainer: {
    padding: 10,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  fromMe: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  fromThem: {
    backgroundColor: "#f1f0f0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#4e8cff",
    marginLeft: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
