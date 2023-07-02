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
      {/* TODO: Add box shadow */}
      <main className="flex flex-col h-[36rem] max-w-3xl w-full rounded-lg m-auto bg-gradient-to-r from-sky-700 via-cyan-900 to-sky-700">
        <div className="relative text-sm">
          <Link
            href="https://github.com/omarx11/chatin-v2"
            prefetch={false}
            className="text-gray-400 -top-6 absolute right-0 underline-offset-2 hover:underline"
          >
            source
            <Image
              src="/static/icons/github.svg"
              width={18}
              height={18}
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
