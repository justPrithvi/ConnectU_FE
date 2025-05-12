import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useMessages } from "../context/MessageContext";

const NewConnectionChatScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { userInfo } = useContext(AuthContext);
  const { receiverUserInfo, socket }: any = route.params;

  const [inputText, setInputText] = useState("");
  const { newConnectionMsgs, addNewConnectionMessage, clearNewConnectionMessages } = useMessages();
  const flatListRef = useRef<FlatList>(null);

  const [timer, setTimer] = useState(10); // 10 minutes
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 5) {
          Alert.alert("Connection about to end", "The chat will end in 30 seconds.");
        }
        if (prev <= 1) {
          clearInterval(interval);
          handleCloseConnection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleAccept = () => {
    
  };

  const handleCloseConnection = () => {
    socket.emit("removeSocketMap", userInfo?.email);
    socket.emit("removeSocketMap", receiverUserInfo?.email);

    socket.disconnect();
    clearNewConnectionMessages()
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Landing Screen" }],
      })
    );
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMsg = {
        id: Date.now(),
        from: userInfo?.email,
        to: receiverUserInfo?.email,
        text: inputText.trim(),
      };

      addNewConnectionMessage(newMsg);
      setInputText("");
      socket.emit("send_new_connection_message", newMsg);
    }
  };

  useEffect(() => {
    if (flatListRef.current && newConnectionMsgs.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [newConnectionMsgs]);

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.from === userInfo?.email ? styles.fromMe : styles.fromThem,
      ]}
    >
      <Text
        style={item.from === userInfo?.email ? styles.fromMeText : styles.fromThemText}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCloseConnection}>
          <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
        </TouchableOpacity>

        <View style={styles.userSection}>
          <Image
            source={{ uri: receiverUserInfo.profilePicture || "default_image_url" }}
            style={styles.profilePic}
          />
          <Text style={styles.headerTitle}>{receiverUserInfo.name || "Unknown"}</Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          {!accepted && (
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={newConnectionMsgs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
        extraData={newConnectionMsgs}
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
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewConnectionChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  backButton: {
    padding: 6,
  },
  userSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e3a8a",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  timer: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1d4ed8",
    marginBottom: 4,
  },
  acceptButton: {
    backgroundColor: "#1d4ed8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  chatContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fromMe: {
    backgroundColor: "#1d4ed8",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  fromThem: {
    backgroundColor: "#e0e7ff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  fromMeText: {
    fontSize: 15,
    color: "#fff",
  },
  fromThemText: {
    fontSize: 15,
    color: "#1e3a8a",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f1f5f9",
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#1d4ed8",
    marginLeft: 10,
    padding: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
