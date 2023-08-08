import React from "react";
import Link from "next/link";
import Image from "next/image";

const MarkdownLite = ({ text }) => {
  const imageRegex = /\[(.+?)\]\((.*\.(?:png|jpg|gif|webp|svg|jpeg))\)/g;
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  const parts = [];

  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, linkText, linkUrl] = match;
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    if (lastIndex < matchStart) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    parts.push(
      <Link
        key={linkUrl}
        href={linkUrl}
        target="_blank"
        className="break-words underline underline-offset-2 text-blue-600"
      >
        {linkText}
      </Link>
    );

    lastIndex = matchEnd;
  }

  while ((match = imageRegex.exec(text)) !== null) {
    const [fullMatch, linkText, linkUrl] = match;
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    if (lastIndex < matchStart) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    parts.push(
      <Image
        key={linkUrl}
        src={`/static/images/${linkUrl}`}
        width={512}
        height={512}
        className="my-3 ring-4 ring-violet-400 select-none drag-none"
        alt="Image from AI"
      />
    );

    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>{part}</React.Fragment>
      ))}
    </>
  );
};

export default MarkdownLite;
