import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatHeader from "./ChatHeader";
import Speech from "./Speech";

const Chat = () => {
  return (
    <>
      <ChatHeader />
      <main className="flex flex-col h-[36rem] max-w-3xl border m-auto">
        <ChatMessages className="px-2 py-3 flex-1" />
        <ChatInput className="px-4" />
      </main>
      <Speech />
    </>
  );
};

export default Chat;
