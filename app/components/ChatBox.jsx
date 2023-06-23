"use client";

import { useContext, useState } from "react";
import { MessagesContext } from "@/app/context/messages";
import Image from "next/image";

export default function ChatBox() {
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
  const inverseMessages = [...messages].reverse();

  // const [Timer, setTimer] = useState(new Date())

  return (
    <>
      <div className="chat chat-start group">
        <figure className="chat-image avatar relative mb-4 min-h-[3rem] min-w-[3rem]">
          <Image
            src="https://ui-avatars.com/api/?name=AI"
            fill
            className="select-none rounded-full drag-none"
            alt="user-avatar"
          />
        </figure>
        <div className="mr-4">
          <div className="flex justify-between pr-1">
            <p className="text-sm opacity-0 group-hover:opacity-100">Bot</p>
          </div>
          <p className="chat-bubble bg-rose-800">
            Hello i'm ChatGPT, Ask me any thing!
          </p>
        </div>
        <p className="line-clamp-1 text-xs text-stone-400">
          1 hour agossssssssssssdsad
        </p>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        UserMessage &&
        inverseMessages.map((message, index) => {
          return (
            <div key={index}>
              <div className="chat chat-end group">
                <figure className="chat-image avatar relative min-h-[3rem] min-w-[3rem]">
                  <Image
                    src="https://ui-avatars.com/api/?name=ME"
                    fill
                    className="select-none rounded-full drag-none"
                    alt="user-avatar"
                  />
                </figure>
                <div className="ml-4">
                  <div className="flex justify-between pl-1">
                    <p className="text-sm opacity-0 group-hover:opacity-100">
                      Me
                    </p>
                  </div>
                  <p className="chat-bubble bg-cyan-800">{message}</p>
                </div>
                <p className="line-clamp-1 text-xs text-stone-400">
                  1 hour agodddddddddsadas
                </p>
              </div>

              <div className="chat chat-start group">
                <figure className="chat-image avatar relative mb-4 min-h-[3rem] min-w-[3rem]">
                  <Image
                    src="https://ui-avatars.com/api/?name=AI"
                    fill
                    className="select-none rounded-full drag-none"
                    alt="user-avatar"
                  />
                </figure>
                <div className="mr-4">
                  <div className="flex justify-between pr-1">
                    <p className="text-sm opacity-0 group-hover:opacity-100">
                      Bot
                    </p>
                  </div>
                  <p className="chat-bubble bg-rose-800">{messages}</p>
                </div>
                <p className="line-clamp-1 text-xs text-stone-400">
                  1 hour agossssssssssssdsad
                </p>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
