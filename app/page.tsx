import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import ChatHeader from "@/components/ChatHeader";
import ChatSpeech from "@/components/ChatSpeech";
import ChatSettings from "@/components/ChatSettings";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-row items-start justify-center">
      <div className="fade-in-history ml-2 mt-[114px] hidden flex-col gap-2 sm:flex">
        <Tooltip
          content={
            <span className="whitespace-nowrap px-1 py-1">chatin database</span>
          }
          offset={4}
          color="secondary"
          placement="top"
        >
          <Button
            href="./history"
            target="_self"
            as={Link}
            isIconOnly
            radius="full"
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
        <Tooltip
          content={
            <span className="whitespace-nowrap px-1 py-1">support me</span>
          }
          offset={4}
          color="secondary"
          placement="bottom"
        >
          <Button
            rel="noopener noreferrer"
            href="https://ko-fi.com/omar11"
            target="_blank"
            as={Link}
            isIconOnly
            radius="full"
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
      </div>
      <div
        id="chatBoxImage"
        className="fade-in-history flex w-full max-w-3xl flex-col px-3"
      >
        <ChatHeader />
        <div className="flex h-[36rem] flex-col rounded-lg bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-900 shadow-xl shadow-secondary-500 ring-4 ring-secondary-700">
          <ChatMessages />
          <ChatInput />
        </div>
        <ChatSpeech />
      </div>
      <ChatSettings />
    </div>
  );
}
