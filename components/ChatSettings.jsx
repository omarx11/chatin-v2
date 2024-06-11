"use client";

import { useStatementContext } from "@/context/StatementProvider";
import { useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { toPng } from "html-to-image";
import { hasCookie, deleteCookie, getCookie, setCookie } from "cookies-next";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { errorMsg } from "../data/errorMsg";

const ChatSettings = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const {
    removeAllMessages,
    messages,
    isAudioMuted,
    setIsAudioMuted,
    isMessageUpdating,
    setUuidCookie,
  } = useStatementContext();

  // On development mode you can comment this if you don't want chat to save.
  // (Textarea) save AI and user chat to localStorage and database.
  useEffect(() => {
    if (
      isMessageUpdating === true &&
      messages.length > 1 &&
      messages.at(-1).text !== errorMsg.limit
    ) {
      setTimeout(
        () =>
          typeof window !== "undefined" &&
          localStorage.setItem("chat", JSON.stringify(messages)),
        200,
      );

      fetch("/api/supabase", {
        method: "POST",
        body: JSON.stringify({
          data: {
            messages,
          },
        }),
      });
    }
  }, [isMessageUpdating]);

  const handleAudio = (e) => {
    e.preventDefault();
    const audio = document.getElementById("identify");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    isAudioMuted ? setIsAudioMuted(false) : setIsAudioMuted(true);
  };

  const handleChatStorage = async (e) => {
    e.preventDefault();
    removeAllMessages();
    deleteCookie("uuid");
    if (!hasCookie("uuid")) {
      setCookie("uuid", uuidv4(), {
        maxAge: 10 * 365 * 24 * 60 * 60,
      });
      setUuidCookie(getCookie("uuid"));
    }
  };

  const handleScreenShoot = (e) => {
    e.preventDefault();
    toPng(document.getElementById("chatBoxImage"))
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `chat-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFullScreen = (e) => {
    e.preventDefault();
    let elem = document.documentElement;
    if (elem.requestFullscreen && !isFullScreen) {
      elem.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
        );
      });
    } else if (elem.webkitRequestFullscreen && !isFullScreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen && !isFullScreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    } else if (isFullScreen) {
      document.exitFullscreen();
    }
    isFullScreen ? setIsFullScreen(false) : setIsFullScreen(true);
  };

  return (
    <div className="fade-in-history mr-2 mt-[114px] hidden flex-col gap-2 sm:flex">
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">
            mute from speaking
          </span>
        }
        offset={4}
        color="secondary"
        placement="left-start"
      >
        <Button
          isIconOnly
          radius="full"
          className="bg-secondary-700 hover:bg-secondary-600"
          onClick={handleAudio}
          aria-label="Mute"
        >
          {isAudioMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="rgb(251 113 133)"
                d="M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.26c-.67.51-1.42.93-2.25 1.17v2.07c1.38-.32 2.63-.95 3.68-1.81L19.73 21L21 19.73l-9-9M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.916 8.916 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71m-2.5 0c0-1.77-1-3.29-2.5-4.03v2.21l2.45 2.45c.05-.2.05-.42.05-.63Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="#eee"
                d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
              />
            </svg>
          )}
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">
            clear chat history
          </span>
        }
        offset={4}
        color="secondary"
        placement="left-start"
      >
        <Button
          isIconOnly
          radius="full"
          className="bg-secondary-700 hover:bg-secondary-600"
          onClick={handleChatStorage}
          aria-label="Clear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              fill="#eee"
              d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7Zm2-4h2V8H9v9Zm4 0h2V8h-2v9Z"
            />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">take a screenshot</span>
        }
        offset={4}
        color="secondary"
        placement="left-start"
      >
        <Button
          isIconOnly
          radius="full"
          className="bg-secondary-700 hover:bg-secondary-600"
          onClick={handleScreenShoot}
          aria-label="Screenshot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              fill="#eee"
              d="M20 9V6h-3V4h3q.825 0 1.413.588T22 6v3h-2ZM2 9V6q0-.825.588-1.413T4 4h3v2H4v3H2Zm15 11v-2h3v-3h2v3q0 .825-.588 1.413T20 20h-3ZM4 20q-.825 0-1.413-.588T2 18v-3h2v3h3v2H4Zm2-4V8h12v8H6Z"
            />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">
            switch fullscreen mode
          </span>
        }
        offset={4}
        color="secondary"
        placement="left-start"
      >
        <Button
          isIconOnly
          radius="full"
          className="bg-secondary-700 hover:bg-secondary-600"
          onClick={handleFullScreen}
          aria-label="Fullscreen"
        >
          {isFullScreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="#eee"
                d="M14 10V4h2v2.59l3.29-3.29l1.41 1.41L17.41 8H20v2zM4 10V8h2.59l-3.3-3.29l1.42-1.42L8 6.59V4h2v6zm16 4v2h-2.59l3.29 3.29l-1.41 1.41L16 17.41V20h-2v-6zm-10 0v6H8v-2.59l-3.29 3.3l-1.42-1.42L6.59 16H4v-2z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="#eee"
                d="M21 3v6h-2V6.41l-3.29 3.3l-1.42-1.42L17.59 5H15V3zM3 3v6h2V6.41l3.29 3.3l1.42-1.42L6.41 5H9V3zm18 18v-6h-2v2.59l-3.29-3.29l-1.41 1.41L17.59 19H15v2zM9 21v-2H6.41l3.29-3.29l-1.41-1.42L5 17.59V15H3v6z"
              />
            </svg>
          )}
        </Button>
      </Tooltip>
    </div>
  );
};

// chat settings for mobile devices
export const MobileSettings = () => {
  const { removeAllMessages, isAudioMuted, setIsAudioMuted, setUuidCookie } =
    useStatementContext();

  const handleAudio = (e) => {
    e.preventDefault();
    const audio = document.getElementById("identify");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    isAudioMuted ? setIsAudioMuted(false) : setIsAudioMuted(true);
  };

  const handleChatStorage = async (e) => {
    e.preventDefault();
    removeAllMessages();
    deleteCookie("uuid");
    if (!hasCookie("uuid")) {
      setCookie("uuid", uuidv4(), {
        maxAge: 10 * 365 * 24 * 60 * 60,
      });
      setUuidCookie(getCookie("uuid"));
    }
  };

  return (
    <>
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">
            mute from speaking
          </span>
        }
        offset={4}
        color="secondary"
        placement="top-end"
      >
        <Button
          isIconOnly
          radius="sm"
          className="bg-secondary-700 hover:bg-secondary-600"
          onClick={handleAudio}
          aria-label="Mute"
        >
          {isAudioMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="rgb(251 113 133)"
                d="M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.26c-.67.51-1.42.93-2.25 1.17v2.07c1.38-.32 2.63-.95 3.68-1.81L19.73 21L21 19.73l-9-9M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.916 8.916 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71m-2.5 0c0-1.77-1-3.29-2.5-4.03v2.21l2.45 2.45c.05-.2.05-.42.05-.63Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                fill="#eee"
                d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
              />
            </svg>
          )}
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">
            clear chat history
          </span>
        }
        offset={4}
        color="secondary"
        placement="top-end"
      >
        <Button
          isIconOnly
          radius="sm"
          className="bg-secondary-700 hover:bg-secondary-600"
          onClick={handleChatStorage}
          aria-label="Clear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              fill="#eee"
              d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7Zm2-4h2V8H9v9Zm4 0h2V8h-2v9Z"
            />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">support me</span>
        }
        offset={4}
        color="secondary"
        placement="top-end"
      >
        <Button
          rel="noopener noreferrer"
          href="https://ko-fi.com/omar11"
          target="_blank"
          as={Link}
          isIconOnly
          radius="sm"
          className="bg-secondary-700 hover:bg-secondary-600"
          aria-label="Support"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 -1 24 24"
          >
            <path
              fill="#eee"
              d="M16.5 3A5.49 5.49 0 0 0 12 5.344A5.49 5.49 0 0 0 7.5 3A5.5 5.5 0 0 0 2 8.5c0 5.719 6.5 10.438 10 12.85c3.5-2.412 10-7.131 10-12.85A5.5 5.5 0 0 0 16.5 3z"
            />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip
        content={
          <span className="whitespace-nowrap px-1 py-1">chatin database</span>
        }
        offset={4}
        color="secondary"
        placement="top-end"
      >
        <Button
          href="./history"
          target="_self"
          as={Link}
          isIconOnly
          radius="sm"
          className="bg-secondary-700 hover:bg-secondary-600"
          aria-label="Database"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              fill="#eee"
              d="M20.7 3.3S19.3 3 17.2 3c-5.5 0-15.6 2.1-14 17.8c1.1.1 2.2.2 3.2.2C24.3 21 20.7 3.3 20.7 3.3M7 17S7 7 17 7c0 0-6 2-10 10Z"
            />
          </svg>
        </Button>
      </Tooltip>
    </>
  );
};

export default dynamic(() => Promise.resolve(ChatSettings), {
  loading: () => <span className="mr-2 hidden p-5 sm:block"></span>,
  ssr: false,
});
