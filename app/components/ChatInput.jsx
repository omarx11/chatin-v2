"use client";

import { useContext } from "react";
import { MessagesContext } from "@/app/context/messages";

export default function ChatInput() {
  const {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    UserMessage,
    setUserMessage,
    UsertInput,
    setUsertInput,
  } = useContext(MessagesContext);

  const generateReply = async (e) => {
    e.preventDefault();

    if (!UsertInput || UsertInput.trim().length === 0) {
      console.error("Must provide a usert input");

      return;
    }

    setIsLoading(true);
    addMessage("");
    setUserMessage("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserMessage: UsertInput,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    setUserMessage(UsertInput);
    setUsertInput("");
    setIsLoading(false);

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      addMessage((prev) => prev + chunkValue);
    }
  };

  return (
    <div className="flex items-center justify-between pb-2">
      <input
        className="mr-2 w-full rounded border border-gray-400 p-2"
        placeholder="Ask away..."
        type="text"
        name="UsertInput"
        onChange={(e) => setUsertInput(e.target.value)}
        value={UsertInput}
      />

      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-3 py-2"
        onClick={(e) => {
          generateReply(e);
        }}
      >
        SEND
      </button>
    </div>
  );
}
