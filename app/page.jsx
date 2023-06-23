import Image from "next/image";
import Header from "./components/Header";
import Input from "./components/Input";
import ChatInput from "./components/ChatInput";
import ChatBox from "./components/ChatBox";
import Speech from "./components/Speech";

export default function HomePage() {
  return (
    <main className="flex w-[40rem] flex-col items-center">
      <div className="flex w-full flex-col gap-4 border border-emerald-900 px-2 pt-4">
        <Header />
        <div className="flex h-[32rem] flex-col overflow-x-hidden bg-gray-900">
          <ChatBox />
        </div>
        <ChatInput />
        <Speech />
      </div>
    </main>
  );
}
