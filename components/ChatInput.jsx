"use client";

import { useStatementContext } from "@/context/StatementProvider";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Textarea } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const {
    messages,
    textareaRef,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
    isLoading,
    setIsLoading,
    chatStatus,
    setChatStatus,
    aiVoiseId,
    aiVoiseName,
  } = useStatementContext();

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

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      setChatStatus(null);
      setIsLoading(false);

      const id = nanoid();
      const responseMessage = {
        id,
        isUserMessage: false,
        text: "",
        time: Date.now(),
        ai_voise_id: aiVoiseId,
        ai_voise_name: aiVoiseName,
      };

      // add new message to state
      addMessage(responseMessage);

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

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="px-3">
      <div className="my-4 flex-1">
        <Textarea
          ref={textareaRef}
          placeholder="Write something... or Start speaking"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const message = {
                id: nanoid(),
                isUserMessage: true,
                text: input,
                time: Date.now(),
              };
              setIsMessageUpdating(false);
              sendMessage(message);
            }
          }}
          classNames={{
            base: "text-black select-none caret-secondary",
            input: "font-semibold placeholder:text-default-500",
            innerWrapper: "items-center",
          }}
          fullWidth
          rows={1}
          minRows={1}
          maxRows={4}
          isDisabled={isLoading}
          size="lg"
          radius="md"
          endContent={
            chatStatus ? (
              <Spinner
                size="md"
                color="secondary"
                label={
                  <span className="rounded-sm px-1 text-secondary/60">
                    {chatStatus}
                  </span>
                }
                classNames={{
                  base: "flex-row-reverse",
                }}
              />
            ) : (
              <span className="rounded-sm px-1 text-secondary/60">STATUS</span>
            )
          }
        />
      </div>
    </div>
  );
};

export default ChatInput;
