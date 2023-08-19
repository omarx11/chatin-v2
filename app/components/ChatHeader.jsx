import Image from "next/image";
import Link from "next/link";

const ChatHeader = () => {
  return (
    <>
      <header className="text-center">
        <h1 className="text-4xl font-bold">
          Chatin
          <span className="text-base font-thin text-neutral-300"> v2</span>
        </h1>
        <p className="text-md text-neutral-200">
          Powered by gpt-3.5-turbo & elevenlabs
        </p>
        <div className="mb-2 mt-5 flex items-end justify-between px-0.5 text-xs text-neutral-400">
          <Link
            href="https://github.com/omarx11/chatin-v2"
            target="_blank"
            className="underline-offset-1 hover:underline"
          >
            source
            <Image
              src="/static/icons/github.svg"
              width={14}
              height={14}
              className="mx-1 inline-block select-none align-text-top"
              alt="github-icon"
            />
          </Link>
          <Link
            href="https://discordredirect.discordsafe.com/users/582305812903493663"
            target="_blank"
            className="underline-offset-1 hover:underline"
          >
            <Image
              src="/static/icons/discord.svg"
              width={16}
              height={16}
              className="mx-1 inline-block select-none align-top"
              alt="github-icon"
            />
            discord
          </Link>
        </div>
      </header>
    </>
  );
};

export default ChatHeader;
