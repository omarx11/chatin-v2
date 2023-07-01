"use client";

import { MessagesContext } from "@/app/context/messages";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useContext, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const ChatInput = () => {
  const textareaRef = useRef(null);
  const [input, setInput] = useState("");
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
    isLoading,
    setIsLoading,
  } = useContext(MessagesContext);

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],
    // include message to later use it in onMutate
    mutationFn: async (_message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      return response.body;
    },
    onMutate(message) {
      setIsLoading(true);
      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("No stream");

      // construct new message to add
      const id = nanoid();
      const responseMessage = {
        id,
        isUserMessage: false,
        text: "",
      };

      // add new message to state
      setIsLoading(false);
      addMessage(responseMessage);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }

      // clean up
      setIsMessageUpdating(true);
      setInput("");

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },
    onError: (_, message) => {
      removeMessage(message.id);
      textareaRef.current?.focus();
    },
  });

  return (
    <div className="border-t-2 border-sky-500/30 px-4">
      <div className="relative my-4 flex-1 overflow-hidden rounded-md border-none outline-none">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const message = {
                id: nanoid(),
                isUserMessage: true,
                text: input,
              };
              setIsMessageUpdating(false);
              sendMessage(message);
            }
          }}
          rows={2}
          maxRows={4}
          value={input}
          autoFocus
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me hi or somthing..."
          className="disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-sky-200 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center px-1 text-sm text-black">
            {isLoading ? <div>Thinking...</div> : <div>SEND</div>}
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
