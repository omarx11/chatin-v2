import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import Header from "./components/Header";
import ChatSpeech from "./components/ChatSpeech";

export default async function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col ring-4 ring-violet-900 shadow-xl shadow-violet-500/50 h-[36rem] max-w-3xl w-full rounded-lg bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950">
        <ChatMessages />
        <ChatInput />
      </main>
      <ChatSpeech />
    </>
  );
}
