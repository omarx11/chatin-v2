import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="md:pt-24 pt-12 text-center max-w-3xl w-full">
      <h1 className="text-4xl font-bold">
        Chatin<span className="text-base font-thin text-gray-300"> v2</span>
      </h1>
      <p className="text-md text-gray-200">Powered by gpt-3.5-turbo</p>
      <div className="text-xs mt-5 px-0.5 mb-2 flex justify-between">
        <Link
          href="https://github.com/omarx11/chatin-v2"
          target="_blank"
          className="text-gray-400 -top-6 right-0 underline-offset-1 hover:underline"
        >
          open source
          <Image
            src="/static/icons/github.svg"
            width={14}
            height={14}
            className="inline-block select-none align-text-top mx-1"
            alt="github-icon"
          />
        </Link>
        <Link
          href="https://discordredirect.discordsafe.com/users/582305812903493663"
          target="_blank"
          className="text-gray-400 -top-6 right-0 underline-offset-1 hover:underline"
        >
          <Image
            src="/static/icons/discord.svg"
            width={16}
            height={16}
            className="inline-block select-none align-top mx-1"
            alt="github-icon"
          />
          discord
        </Link>
      </div>
    </header>
  );
}
