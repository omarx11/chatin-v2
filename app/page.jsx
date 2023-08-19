import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import ChatHeader from "./components/ChatHeader";
import ChatSpeech from "./components/ChatSpeech";
import ChatSettings from "./components/ChatSettings";

export default async function HomePage() {
  return (
    <>
      <main className="flex w-full max-w-3xl flex-col px-3" id="chatBox">
        <ChatHeader />
        <div className="flex h-[36rem] flex-col rounded-lg bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 shadow-xl shadow-violet-500/50 ring-4 ring-violet-900">
          <ChatMessages />
          <ChatInput />
        </div>
        <ChatSpeech />
      </main>
      <ChatSettings />
    </>
  );
}
