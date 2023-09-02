"use client";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { cn } from "@/app/lib/utils";
import MarkdownLite from "../components/MarkdownLite";

// set how many data returned per call.
const dataReq = 3;

// TODO: Limit chats length to 50.

const fetchData = async (page) => {
  const res = await fetch("/api/supabase", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  const body = {
    data: data.slice((page - 1) * dataReq, page * dataReq),
    length: data.length,
  };

  return body;
};

export default function Pagination() {
  const [chatData, setChatData] = useState([]);
  const [chatLength, setChatLength] = useState(0);

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["query"],
    async ({ pageParam = 1 }) => {
      const res = await fetchData(pageParam);
      setChatData(res.data);
      setChatLength(res.length);
      return res.data;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        // when loading page fetch data automatic
        pages: [chatData.slice(0, dataReq)],
        pageParams: [1],
      },
    },
  );

  const lastDataRef = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastDataRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  const _data = data?.pages.flatMap((page) => page);

  return (
    <div className="mx-2 flex w-full flex-col items-center sm:mx-0">
      <div className="fade-in-history flex max-w-[96rem] flex-row flex-wrap justify-center gap-8">
        <div className="mb-8 flex w-full flex-col items-center text-start">
          <div className="max-w-max">
            <h1 className="text-4xl">
              A list of all conversations by humans! ( Chatin App )
            </h1>
            <span className="text-xs text-neutral-400">
              This list is sorted by chat creation date. ⏲️
            </span>
            <div className="mt-4 flex justify-between text-neutral-200">
              <p>
                Total of <span className="text-violet-300">{chatLength}</span>{" "}
                conversations..
              </p>
              <a
                href="/"
                target="_self"
                className="mr-1 flex items-center gap-1 text-sm text-sky-400 hover:text-sky-600 hover:underline hover:underline-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" fillRule="evenodd">
                    <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
                    <path
                      fill="currentColor"
                      d="M2.614 5.426A1.5 1.5 0 0 1 4 4.5h10a7.5 7.5 0 1 1 0 15H5a1.5 1.5 0 0 1 0-3h9a4.5 4.5 0 1 0 0-9H7.621l.94.94a1.5 1.5 0 0 1-2.122 2.12l-3.5-3.5a1.5 1.5 0 0 1-.325-1.634Z"
                    />
                  </g>
                </svg>
                go back
              </a>
            </div>
          </div>
        </div>
        {_data.map((user, i) => {
          return (
            <div
              ref={ref}
              className="no-scroll-style group flex h-[36rem] max-w-[30rem] flex-col gap-3 overflow-x-hidden rounded-md bg-purple-950 from-purple-950 via-purple-900 to-purple-950 py-3 pb-3 ring-4 ring-violet-900 hover:bg-gradient-to-r hover:pt-0 hover:ring-violet-900/75"
              key={i}
            >
              <div className="absolute top-0 -mx-3 rounded-md bg-gray-900/75 py-2 text-sm opacity-0 group-hover:sticky group-hover:opacity-100">
                <div className="flex flex-col text-center">
                  <span className="">{`[ ${user.id} ]`}</span>
                  <span>{user.user_uuid}</span>
                  {/* {user.updated_at && (
                    <span className="text-xs">
                      UPDATED: {dateStyle(user.updated_at)}
                    </span>
                  )} */}
                </div>
              </div>
              {JSON.parse(user["chat"]).map((message) => {
                return (
                  !message.isFirstMessage && (
                    <div
                      key={`${message.id}-${message.id}`}
                      className={cn("flex items-end", {
                        "justify-end": message.isUserMessage,
                      })}
                    >
                      <div
                        className={cn(
                          "mx-3 flex max-w-sm flex-col overflow-x-hidden text-sm font-medium",
                          {
                            "order-1 ml-14 items-end": message.isUserMessage,
                            "order-2 mr-14 items-start": !message.isUserMessage,
                          },
                        )}
                      >
                        <p
                          className={cn("rounded-lg px-2 py-2 md:px-4", {
                            "bg-cyan-600 text-white": message.isUserMessage,
                            "bg-neutral-200 text-neutral-900":
                              !message.isUserMessage,
                          })}
                        >
                          <MarkdownLite text={message.text} />
                        </p>
                        {!message.isUserMessage && (
                          <span className="pl-1 text-xs lowercase text-neutral-400">
                            by {`[ ${message.ai_voise_name} ]`}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          );
        })}
      </div>
      <button
        className="my-20 rounded-md bg-violet-800 px-20 py-6 text-xl"
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {chatLength !== 0
          ? isFetchingNextPage
            ? "Loading more..."
            : (data?.pages.length ?? 0) < Math.ceil(chatLength / dataReq)
            ? "Load More!"
            : "Nothing more to load"
          : "Loading Chats data..."}
      </button>
    </div>
  );
}
