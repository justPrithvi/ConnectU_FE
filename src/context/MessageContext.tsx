import React, { createContext, useContext, useState } from 'react';

type Message = {
  id: number;
  from: string;
  to: string;
  text: string;
};

type MessageContextType = {
  newConnectionMsgs: Message[];
  addNewConnectionMessage: (msg: Message) => void;
  setAllNewConnectionMessages: (msgs: Message[]) => void;
  clearNewConnectionMessages: () => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [newConnectionMsgs, setMessages] = useState<Message[]>([]);

  const addNewConnectionMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const setAllNewConnectionMessages = (msgs: Message[]) => {
    setMessages(msgs);
  };

  const clearNewConnectionMessages = () => {
    setMessages([]);
  };

  return (
    <MessageContext.Provider
      value={{
        newConnectionMsgs,
        addNewConnectionMessage,
        setAllNewConnectionMessages,
        clearNewConnectionMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
