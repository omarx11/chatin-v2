import React from "react";
import { Link } from "@nextui-org/link";
import Image from "next/image";

const MarkdownLite = ({ text }) => {
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

    if (
      /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(linkUrl) == true
    ) {
      parts.push(
        <Image
          key={linkUrl}
          src={linkUrl}
          width={256}
          height={256}
          className="drag-none my-3 h-auto w-[256px] select-none ring-4 ring-secondary-300"
          alt="Image from AI"
        />,
      );
    } else {
      parts.push(
        <Link
          isExternal
          key={linkUrl}
          href={linkUrl}
          size="sm"
          underline="hover"
          showAnchorIcon
          className="break-words"
        >
          {linkText}
        </Link>,
      );
    }

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
