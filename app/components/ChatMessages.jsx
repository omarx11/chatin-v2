"use client";
import { StatementContext } from "@/app/context/statement";
import { cn } from "@/app/lib/utils";
import { useContext } from "react";
import MarkdownLite from "./MarkdownLite";
import dynamic from "next/dynamic";
import { dateStyle } from "../lib/dateFormat";
import { errorMsg } from "../data/errorMsg";
import YumekoWelcome from "./YumekoWelcome";

const ChatMessages = () => {
  const { messages, uuidCookie } = useContext(StatementContext);
  const inverseMessages = [...messages].reverse();

  return (
    <div className="fade-in msg-scroll flex flex-1 flex-col-reverse gap-3 overflow-y-auto rounded-lg px-0 py-3 md:px-2">
      <div className="flex-1 flex-grow" />
      {inverseMessages.map((message) => {
        return (
          <div
            key={`${message.id}-${message.id}`}
            className={cn("flex items-end", {
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
                  "bg-cyan-600 text-white": message.isUserMessage,
                  "bg-neutral-200 text-neutral-900": !message.isUserMessage,
                })}
              >
                {message.text !== errorMsg.limit ? (
                  <MarkdownLite text={message.text} />
                ) : (
                  <span className="font-bold text-rose-700">
                    {message.text}
                  </span>
                )}
              </p>
              {message.time && !message.isUserMessage && (
                <span className="px-1 text-start text-xs text-neutral-400">
                  {dateStyle(message.time)}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <YumekoWelcome />
      <audio
        src="/static/audio/identify.mp3"
        id="identify"
        className="hidden"
        preload="none"
      ></audio>
      <p className="border-b border-violet-600 pb-2 text-center text-sm text-neutral-200 duration-300">
        Id: {uuidCookie ?? "anonymous"}
      </p>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ChatMessages), {
  loading: () => <div className="flex-1 flex-grow" />,
  ssr: false,
});
