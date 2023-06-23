import { createContext, useState } from "react";

export const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [UserMessage, setUserMessage] = useState("");
  const [UsertInput, setUsertInput] = useState("");

  const addMessage = (message) => {
    setMessages((prev) => prev + message);
    console.log(message);
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        addMessage,
        isLoading,
        setIsLoading,
        UserMessage,
        setUserMessage,
        UsertInput,
        setUsertInput,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
