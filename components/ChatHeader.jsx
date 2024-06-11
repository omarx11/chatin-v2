import { Link } from "@nextui-org/link";
import Image from "next/image";

const ChatHeader = () => {
  return (
    <header className="text-center">
      <div>
        <h1 className="text-4xl font-bold">
          Chatin
          <span className="text-base font-thin text-default-300"> v.2.8.0</span>
        </h1>
        <p className="text-md text-default-200">
          Powered by gpt-3.5-turbo & elevenlabs.io
        </p>
      </div>
      <div className="mb-2 mt-5 flex items-end justify-between px-0.5 text-xs">
        <Link
          isExternal
          href="https://github.com/omarx11/chatin-v2"
          color="foreground"
          underline="hover"
          size="sm"
          showAnchorIcon
        >
          source code
        </Link>
        <Link
          isExternal
          href="https://discordredirect.discordsafe.com/users/582305812903493663"
          color="foreground"
          underline="hover"
          size="sm"
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
  );
};

export default ChatHeader;
