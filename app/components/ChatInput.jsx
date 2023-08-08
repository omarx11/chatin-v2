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
    chatStatus,
    setChatStatus,
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
      setChatStatus("thinking");
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
      setChatStatus(null);
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
    <div className="px-4">
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
          rows={1}
          maxRows={4}
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me hi or something..."
          className="disabled:opacity-50 font-semibold focus:shadow-inner focus:shadow-neutral-500 placeholder:italic caret-violet-500 pr-14 resize-none block w-full bg-gray-200 py-1.5 text-gray-900 text-sm sm:leading-6"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1">
          <kbd className="inline-flex select-none items-center px-1 text-sm text-black">
            {chatStatus ? (
              <span className="flex items-center px-1 rounded-sm gap-1">
                {chatStatus}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  className="animate-spin"
                >
                  <g fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14Zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Z"
                      clipRule="evenodd"
                      opacity=".2"
                    />
                    <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2Z" />
                  </g>
                </svg>
              </span>
            ) : (
              <span className="px-1 rounded-sm bg-gray-200">STATUS</span>
            )}
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
