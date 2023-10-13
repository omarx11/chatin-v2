import { createContext, useState } from "react";
import { nanoid } from "nanoid";

const defaultValue = [
  {
    id: nanoid(),
    text: "Hi, I'm Yumeko. how can I assist you today?",
    isUserMessage: false,
    ai_voise_id: null,
    ai_voise_name: null,
    isFirstMessage: true,
  },
];

export const StatementContext = createContext();

export function StatementProvider({ children }) {
  const [isMessageUpdating, setIsMessageUpdating] = useState(false);
  const [chatStatus, setChatStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [aiVoiseId, setAiVoiseId] = useState("AZnzlk1XvdvUeBnXmlld");
  const [aiVoiseName, setAiVoiseName] = useState("yumeko");

  typeof window !== "undefined" &&
    !localStorage.getItem("chat") &&
    localStorage.setItem("chat", JSON.stringify(defaultValue));
  const chatStorage =
    typeof window !== "undefined" && localStorage.getItem("chat")
      ? JSON.parse(localStorage.getItem("chat"))
      : defaultValue;

  const [messages, setMessages] = useState(chatStorage);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const removeAllMessages = () => {
    setMessages(defaultValue);
    typeof window !== "undefined" &&
      localStorage.setItem("chat", JSON.stringify(defaultValue));
  };

  const updateMessage = (id, updateFn) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === id) {
          return { ...message, text: updateFn(message.text) };
        }
        return message;
      }),
    );
  };

  return (
    <StatementContext.Provider
      value={{
        messages,
        isMessageUpdating,
        chatStatus,
        isLoading,
        isAudioMuted,
        aiVoiseId,
        aiVoiseName,
        setAiVoiseName,
        setAiVoiseId,
        addMessage,
        setMessages,
        removeMessage,
        removeAllMessages,
        updateMessage,
        setIsMessageUpdating,
        setChatStatus,
        setIsLoading,
        setIsAudioMuted,
      }}
    >
      {children}
    </StatementContext.Provider>
  );
}
