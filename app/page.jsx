import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import ChatHeader from "./components/ChatHeader";
import ChatSpeech from "./components/ChatSpeech";

export default async function HomePage() {
  return (
    <>
      <ChatHeader />
      {/* TODO: Add box shadow */}
      <main className="flex flex-col h-[36rem] max-w-3xl w-full rounded-lg m-auto bg-gradient-to-r from-sky-700 via-cyan-900 to-sky-700">
        <ChatMessages />
        <ChatInput />
      </main>
      <ChatSpeech />
    </>
  );
}
