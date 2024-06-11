"use client";

import { useStatementContext } from "@/context/StatementProvider";
import { cn } from "@/lib/utils";
import MarkdownLite from "./MarkdownLite";
import dynamic from "next/dynamic";
import { dateStyle } from "../lib/dateFormat";
import { errorMsg } from "../data/errorMsg";
import RawanWelcome from "./RawanWelcome";
import { useEffect } from "react";

const ChatMessages = () => {
  const { messages, uuidCookie } = useStatementContext();
  const inverseMessages = [...messages].reverse();

  useEffect(() => {
    const chatBoxEl = document.getElementById("chatBox");
    if (chatBoxEl) {
      if (
        chatBoxEl.scrollTop + chatBoxEl.clientHeight >=
        chatBoxEl.scrollHeight - 9999
      )
        chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      id="chatBox"
      className="msg-scroll flex flex-1 flex-col-reverse gap-3 overflow-y-auto rounded-lg px-0 py-3 md:px-2"
    >
      <div className="flex-1 flex-grow" />
      {inverseMessages.map((message) => {
        return (
          <div
            key={`${message.id}-${message.id}`}
            className={cn("fade-in-history flex items-end", {
              "justify-end": message.isUserMessage,
            })}
          >
            <div
              className={cn(
                "mx-2 flex max-w-md flex-col space-y-1 overflow-x-hidden text-sm font-medium",
                {
                  "order-1 items-end": message.isUserMessage,
                  "order-2 items-start": !message.isUserMessage,
                },
              )}
            >
              <p
                className={cn("rounded-lg px-2 py-2 sm:px-4", {
                  "bg-[#006FEE] text-white hover:bg-[#338ef7]":
                    message.isUserMessage,
                  "bg-default-200 text-black hover:bg-default-100":
                    !message.isUserMessage,
                })}
              >
                {message.text !== errorMsg.limit ? (
                  <MarkdownLite text={message.text} />
                ) : (
                  <span className="font-bold text-danger-600">
                    {message.text}
                  </span>
                )}
              </p>
              {message.time && !message.isUserMessage && (
                <span className="px-1 text-start text-xs text-default-400">
                  {dateStyle(message.time)}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <RawanWelcome />
      <p className="border-b-2 border-secondary-700 pb-2 text-center text-sm text-default-200 duration-300">
        Id: {uuidCookie ?? "anonymous"}
      </p>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ChatMessages), {
  loading: () => <div className="flex-1 flex-grow" />,
  ssr: false,
});
