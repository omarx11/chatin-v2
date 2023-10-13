"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { cn } from "@/app/lib/utils";
import MarkdownLite from "../components/MarkdownLite";
import { Dropdown, Button } from "@nextui-org/react";
import { filter } from "../lib/filterChat";
import Link from "next/link";

// set how many data returned per call.
const dataReq = 3;

export default function Pagination() {
  const [chatData, setChatData] = useState([]);
  const [chatLength, setChatLength] = useState("--");
  const [sortId, setSortId] = useState("");
  const [sortName, setSortName] = useState(null);
  const [isSorting, setIsSorting] = useState(false);

  const fetchData = async (page) => {
    // TODO: Limit fetch length to 50.
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
      data: data.slice((page - 1) * dataReq, page * dataReq),
      length: data.length,
    };

    return body;
  };

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
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

  useEffect(() => {
    (async () => {
      setIsSorting(true);
      const id = sortId?.currentKey ?? "Sort By..";
      const sorts = {
        creation: "Creation Date",
        updated: "Updated Date",
        oldest: "Oldest",
      };
      setSortName(sorts[id]);
      await refetch();
      setIsSorting(false);
    })();
  }, [sortId]);

  const _data = data?.pages.flatMap((page) => page);

  return (
    <div className="mx-2 flex w-full flex-col items-center sm:mx-0">
      <div className="fade-in-history flex max-w-[96rem] flex-row flex-wrap justify-center gap-8">
        <div className="mb-8 flex w-full flex-col items-center text-start">
          <div className="max-w-max">
            <h1 className="text-4xl">
              A list of all conversations by humans! ( Chatin App )
            </h1>
            <div className="mt-4 flex justify-between text-neutral-200">
              <p>
                Total of <span className="text-violet-300">{chatLength}</span>{" "}
                conversations..
                <span className="block text-xs text-neutral-400">
                  If you think you don't want your chat to appear here,{" "}
                  <Link
                    href="mailto:mail@omar11.sa"
                    className="hover:underline"
                  >
                    contact me
                  </Link>
                  .
                </span>
              </p>
              <div className="flex items-center gap-4">
                <Dropdown disableAnimation>
                  <Dropdown.Button
                    auto
                    color="primary"
                    css={{
                      size: "32px",
                      borderRadius: "8px",
                    }}
                  >
                    {sortName ?? "Sort By.."}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    color="primary"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={sortId}
                    onSelectionChange={setSortId}
                  >
                    <Dropdown.Section
                      title={
                        <>
                          <p className="-mt-8 p-2">Sort Conversation by..</p>
                          <p className="-mb-6 -mt-2 p-2">
                            Default list is sorted by chat creation date. ⏲️
                          </p>
                        </>
                      }
                    >
                      <Dropdown.Item key="creation">
                        Creation Date
                      </Dropdown.Item>
                      <Dropdown.Item key="updated">Updated Date</Dropdown.Item>
                      <Dropdown.Item key="oldest">Oldest</Dropdown.Item>
                    </Dropdown.Section>
                  </Dropdown.Menu>
                </Dropdown>
                <a href="/" target="_self">
                  <Button size="xs" css={{ padding: "$7" }} color="primary">
                    Back to Chatin
                  </Button>
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
              className="no-scroll-style group flex h-[36rem] max-w-[30rem] flex-col gap-3 overflow-x-hidden rounded-md bg-purple-950 from-purple-950 via-purple-900 to-purple-950 py-3 pb-3 ring-4 ring-violet-900 hover:bg-gradient-to-r hover:pt-0 hover:ring-violet-900/75"
              key={i}
            >
              <div className="absolute top-0 -mx-3 rounded-md bg-gray-900/75 py-2 text-sm opacity-0 group-hover:sticky group-hover:opacity-100">
                <div className="flex flex-col text-center">
                  <span className="">{`[ ${user.id} ]`}</span>
                  <span>{user.user_uuid}</span>
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
                          className={cn("rounded-md px-2 py-2 md:px-4", {
                            "bg-cyan-600 text-white": message.isUserMessage,
                            "bg-neutral-200 text-neutral-900":
                              !message.isUserMessage,
                          })}
                        >
                          <MarkdownLite
                            text={
                              message.isUserMessage
                                ? filter(message.text)
                                : message.text
                            }
                          />
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
