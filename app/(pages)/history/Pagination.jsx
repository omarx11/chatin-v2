"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { cn } from "@/lib/utils";
import MarkdownLite from "@/components/MarkdownLite";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { filter } from "@/lib/chatFilter";
import { dateStyle } from "@/lib/dateFormat";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";

// set how many data returned per call.
const dataReq = 6;

export default function Pagination() {
  const [chatData, setChatData] = useState([]);
  const [chatLength, setChatLength] = useState(null);
  const [sortId, setSortId] = useState("");
  const [sortName, setSortName] = useState(null);
  const [isSorting, setIsSorting] = useState(false);

  const fetchData = async (pageParam) => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          sort: sortId?.currentKey ?? null,
        },
      }),
    });
    const data = await res.json();

    const body = {
      data: data.slice((pageParam - 1) * dataReq, pageParam * dataReq),
      length: data.length,
    };

    return body;
  };

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    {
      queryKey: ["chats"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetchData(pageParam);
        setChatData(res.data);
        setChatLength(res.length);

        return res.data;
      },
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

  useEffect(() => {
    (async () => {
      setIsSorting(true);
      const id = sortId?.currentKey ?? "Sort by";
      const sorts = {
        creation: "Creation",
        updated: "Updated",
        oldest: "Oldest",
      };
      setSortName(sorts[id]);
      await refetch();
      setIsSorting(false);
    })();
  }, [sortId]);

  const _data = data?.pages.flatMap((page) => page);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="fade-in-history mx-2 flex max-w-screen-2xl flex-row flex-wrap justify-center gap-x-12 gap-y-8 pb-4 sm:mx-0">
        <div className="mb-2 flex w-full flex-col items-center text-start sm:mb-8">
          <div className="w-full rounded-md bg-secondary-800 p-8">
            <h1 className="text-lg font-semibold sm:text-4xl">
              A list of all conversations ( Chatin App )
            </h1>
            <div className="mt-4 flex justify-between">
              <p>
                Total of{" "}
                <span className="text-secondary-200 underline underline-offset-4">
                  {!chatLength ? "---" : chatLength}
                </span>{" "}
                conversations..
                <span className="block text-xs text-default-400">
                  If you prefer your chat not to appear here, please{" "}
                  <Link
                    isExternal
                    href="mailto:mail@omar11.sa"
                    className="text-default-400"
                    underline="hover"
                    size="sm"
                    showAnchorIcon
                  >
                    contact me
                  </Link>
                  .
                </span>
              </p>
              <div className="flex flex-wrap items-end justify-end gap-1 sm:gap-4">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="secondary"
                      radius="sm"
                      endContent={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m3 16 4 4 4-4" />
                          <path d="M7 4v16" />
                          <path d="M15 4h5l-5 6h5" />
                          <path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" />
                          <path d="M20 18h-5" />
                        </svg>
                      }
                    >
                      {sortName ?? "Sort by"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Dropdown menu"
                    color="secondary"
                    variant="flat"
                    className="text-black"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={sortId}
                    onSelectionChange={setSortId}
                  >
                    <DropdownItem
                      key="creation"
                      description="sort by last created date"
                    >
                      Creation
                    </DropdownItem>
                    <DropdownItem
                      key="updated"
                      description="sort by last updated date"
                    >
                      Updated
                    </DropdownItem>
                    <DropdownItem key="oldest" description="sort by the oldest">
                      Oldest
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <a
                  className={buttonStyles({
                    color: "secondary",
                    variant: "ghost",
                    radius: "sm",
                    size: "md",
                  })}
                  href="/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  Back
                </a>
              </div>
            </div>
          </div>
        </div>
        {_data.map((user, i) => {
          return isSorting ? (
            <span>•••••••</span>
          ) : (
            <div
              ref={ref}
              className="no-scroll-style group flex h-[36rem] min-w-72 max-w-[30rem] flex-col gap-2 overflow-x-hidden rounded-sm bg-secondary-800 from-secondary-900 via-secondary-800 to-secondary-900 pb-3 ring-4 ring-secondary-700 hover:bg-gradient-to-r sm:min-w-[452px] sm:gap-3 sm:rounded-md"
              key={i}
            >
              <div className="sticky top-0 -mx-3 rounded-md bg-default-900/50 py-3">
                <div className="flex flex-col text-center">
                  <span className="text-xs sm:text-sm">{user.user_uuid}</span>
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
                          "mx-3 flex max-w-sm flex-col space-y-0.5 overflow-x-hidden font-medium",
                          {
                            "order-1 ml-14 items-end": message.isUserMessage,
                            "order-2 mr-14 items-start": !message.isUserMessage,
                          },
                        )}
                      >
                        <p
                          className={cn(
                            "rounded-md px-2 py-2 text-xs sm:text-sm md:px-4",
                            {
                              "bg-[#006FEE] text-white": message.isUserMessage,
                              "bg-default-200 text-black":
                                !message.isUserMessage,
                            },
                          )}
                        >
                          <MarkdownLite
                            text={
                              message.isUserMessage
                                ? filter(message.text)
                                : message.text
                            }
                          />
                        </p>
                        {message.time && !message.isUserMessage && (
                          <span className="px-1 text-start text-xs text-default-400">
                            {dateStyle(message.time)}
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
      <Button
        color="secondary"
        radius="sm"
        className="my-20 px-20 py-12 text-xl"
        onClick={() => fetchNextPage()}
        isDisabled={isFetchingNextPage}
      >
        {!chatLength
          ? "Loading Chats data..."
          : chatLength !== 0 && isFetchingNextPage
            ? "Loading more..."
            : (data?.pages.length ?? 0) < Math.ceil(chatLength / dataReq)
              ? "Load More!"
              : "Nothing more to load"}
      </Button>
    </div>
  );
}
