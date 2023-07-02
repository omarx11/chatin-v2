import { createContext, useState } from "react";
import { nanoid } from "nanoid";

const defaultValue = [
  {
    id: nanoid(),
    text: "Hi, I'm Sachiko-chan how can I assist you today?",
    isUserMessage: false,
  },
];
export const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(defaultValue);
  const [isMessageUpdating, setIsMessageUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const updateMessage = (id, updateFn) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === id) {
          return { ...message, text: updateFn(message.text) };
        }
        return message;
      })
    );
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        isMessageUpdating,
        isLoading,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating,
        setIsLoading,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
