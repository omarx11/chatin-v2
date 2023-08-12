"use client";
import { MessagesContext } from "@/app/context/messages";
import { cn } from "@/app/lib/utils";
import { useContext, useEffect, useState } from "react";
import MarkdownLite from "./MarkdownLite";

const ChatMessages = () => {
  const { messages } = useContext(MessagesContext);
  const [isAudioStart, setIsAudioStart] = useState(false);
  const inverseMessages = [...messages].reverse();

  useEffect(() => {
    const audio = document.getElementById("identify");
    if (!isAudioStart) {
      audio.pause();
      // audio.currentTime = 0;
    } else {
      audio.play();
    }
  }, [isAudioStart]);

  return (
    <div className="flex flex-col-reverse rounded-lg gap-3 overflow-y-auto md:px-2 px-0 py-3 flex-1">
      <div className="flex-1 flex-grow" />
      {inverseMessages.map((message) => {
        return (
          <div className="chat-message" key={`${message.id}-${message.id}`}>
            <div
              className={cn("flex items-end", {
                "justify-end": message.isUserMessage,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-sm font-medium max-w-md mx-2 overflow-x-hidden",
                  {
                    "order-1 items-end": message.isUserMessage,
                    "order-2 items-start": !message.isUserMessage,
                  }
                )}
              >
                <p
                  className={cn("md:px-4 px-2 py-2 rounded-lg", {
                    "bg-cyan-600 text-white": message.isUserMessage,
                    "bg-gray-200 text-gray-900": !message.isUserMessage,
                    "flex md:pl-2 gap-2 items-center": message.isFirstMessage,
                  })}
                >
                  {message.isFirstMessage && (
                    <button
                      className="hover:bg-gray-400 p-1 rounded-full bg-gray-300"
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
          </div>
        );
      })}
      <audio
        src="/static/audio/identify.mp3"
        id="identify"
        className="hidden"
        preload="none"
      ></audio>
    </div>
  );
};

export default ChatMessages;
