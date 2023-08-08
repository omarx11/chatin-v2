import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import ChatHeader from "./components/ChatHeader";
import ChatSpeech from "./components/ChatSpeech";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  return (
    <>
      <ChatHeader />
      <main className="flex flex-col ring-4 ring-violet-900 shadow-xl shadow-violet-500/50 h-[36rem] max-w-3xl w-full rounded-lg bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950">
        <div className="relative text-xs">
          <Link
            href="https://github.com/omarx11/chatin-v2"
            target="_blank"
            className="text-gray-400 -top-6 absolute right-0 underline-offset-1 hover:underline"
          >
            open source
            <Image
              src="/static/icons/github.svg"
              width={16}
              height={16}
              className="inline-block select-none align-top mx-1"
              alt="github-icon"
            />
          </Link>
        </div>
        <ChatMessages />
        <ChatInput />
      </main>
      <ChatSpeech />
    </>
  );
}
