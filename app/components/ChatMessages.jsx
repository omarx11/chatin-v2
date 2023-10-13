"use client";
import { StatementContext } from "@/app/context/statement";
import { cn } from "@/app/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import MarkdownLite from "./MarkdownLite";
import dynamic from "next/dynamic";

const ChatMessages = () => {
  const { messages, isAudioMuted } = useContext(StatementContext);
  const [isAudioStart, setIsAudioStart] = useState(false);
  const inverseMessages = [...messages].reverse();

  const cookies = useCookies();

  useEffect(() => {
    const audio = document.getElementById("identify");
    if (!isAudioStart) {
      audio.pause();
    } else if (!isAudioMuted) {
      audio.play();
    }
    audio.onended = () => {
      setIsAudioStart(false);
      audio.currentTime = 0;
    };
  }, [isAudioStart]);

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
                "mx-2 flex max-w-md flex-col space-y-2 overflow-x-hidden text-sm font-medium",
                {
                  "order-1 items-end": message.isUserMessage,
                  "order-2 items-start": !message.isUserMessage,
                },
              )}
            >
              <p
                className={cn("rounded-lg px-2 py-2 md:px-4", {
                  "bg-cyan-600 text-white": message.isUserMessage,
                  "bg-neutral-200 text-neutral-900": !message.isUserMessage,
                  "flex items-center gap-2 md:pl-2": message.isFirstMessage,
                })}
              >
                {message.isFirstMessage && (
                  <button
                    className="rounded-full bg-neutral-300 p-1 hover:bg-neutral-400"
                    onClick={(e) => {
                      e.preventDefault();
                      isAudioStart
                        ? setIsAudioStart(false)
                        : setIsAudioStart(true);
                    }}
                  >
                    {isAudioStart ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M14 19V5h4v14h-4Zm-8 0V5h4v14H6Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                      </svg>
                    )}
                  </button>
                )}
                <MarkdownLite text={message.text} />
              </p>
            </div>
          </div>
        );
      })}
      <audio
        src="/static/audio/identify.webm"
        id="identify"
        className="hidden"
        preload="none"
      ></audio>
      <p className="border-b border-neutral-600 pb-2 text-center text-sm text-neutral-200">
        ID: {cookies.get("uuid") ?? "anonymous"}
      </p>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ChatMessages), {
  loading: () => <div className="flex-1 flex-grow" />,
  ssr: false,
});
