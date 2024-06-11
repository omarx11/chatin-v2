"use client";

import { createContext, useRef, useState, useEffect, useContext } from "react";
import { getCookie, setCookie } from "cookies-next";
import { v4 as uuidv4 } from "uuid";

export const StatementContext = createContext(null);

export function StatementProvider({ children }) {
  const [isMessageUpdating, setIsMessageUpdating] = useState(false);
  const [chatStatus, setChatStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [aiVoiseId, setAiVoiseId] = useState("AZnzlk1XvdvUeBnXmlld");
  const [aiVoiseName, setAiVoiseName] = useState("rawan");
  const [uuidCookie, setUuidCookie] = useState(getCookie("uuid"));

  // set uuid cookie to the user
  useEffect(() => {
    // give the user uuid if he doesn't have one.
    if (!getCookie("uuid")) {
      setCookie("uuid", uuidv4(), {
        maxAge: 10 * 365 * 24 * 60 * 60,
      });
      setUuidCookie(getCookie("uuid"));
    }
  }, []);

  useEffect(() => {
    setUuidCookie(getCookie("uuid"));
  }, [uuidCookie]);

  typeof window !== "undefined" &&
    !localStorage.getItem("chat") &&
    localStorage.setItem("chat", JSON.stringify([]));
  const chatStorage =
    typeof window !== "undefined" && localStorage.getItem("chat")
      ? JSON.parse(localStorage.getItem("chat"))
      : [];

  const [messages, setMessages] = useState(chatStorage);
  const textareaRef = useRef(null);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const removeAllMessages = () => {
    setMessages([]);
    typeof window !== "undefined" && localStorage.setItem("chat", []);
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
        textareaRef,
        isMessageUpdating,
        chatStatus,
        isLoading,
        isAudioMuted,
        aiVoiseId,
        aiVoiseName,
        uuidCookie,
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
        setUuidCookie,
      }}
    >
      {children}
    </StatementContext.Provider>
  );
}

export const useStatementContext = () => {
  const context = useContext(StatementContext);
  if (!context) {
    throw new Error(
      "useStatementContext must be used within a StatementProvider",
    );
  }
  return context;
};
