"use client";

import "regenerator-runtime";

import { useEffect, useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessagesContext } from "@/app/context/messages";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import BrowserSupports from "./BrowserSupports";
import { getAudio, getSubscriptionInfo } from "../lib/elevenlabs";
import { nanoid } from "nanoid";
import { Dropdown } from "@nextui-org/react";

const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Bella

function Speech() {
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [mutationIsDone, setMutationIsDone] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setIsLoading,
  } = useContext(MessagesContext);

  async function doAudio() {
    if (transcript !== "") {
      try {
        const audioUrl = await getAudio(
          voiceId,
          messages.at(-1).text.substring(0, 1000)
        );
        new Audio(audioUrl).play();

        setSubscriptionInfo(await getSubscriptionInfo());
      } catch {
        // Do nothing
      }
    }
    resetTranscript();
    // SpeechRecognition.startListening();
  }

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],
    // include message to later use it in onMutate
    mutationFn: async (_message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [_message] }),
      });

      return response.body;
    },
    onMutate(message) {
      setIsLoading(true);
      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("No stream");

      // construct new message to add
      const id = nanoid();
      const responseMessage = {
        id,
        isUserMessage: false,
        text: "",
      };

      // add new message to state
      setIsLoading(false);
      addMessage(responseMessage);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }

      setMutationIsDone(true);
    },
    onError: (_, message) => {
      removeMessage(message.id);
    },
  });

  useEffect(() => {
    (async () => {
      if (mutationIsDone === true) {
        await doAudio();
      }
      setMutationIsDone(false);
    })();
  }, [mutationIsDone]);

  useEffect(() => {
    (async () => {
      if (isMessageUpdating === true) {
        try {
          const audioUrl = await getAudio(
            voiceId,
            messages.at(-1).text.substring(0, 1000)
          );
          new Audio(audioUrl).play();
          setSubscriptionInfo(await getSubscriptionInfo());
        } catch {
          // Do nothing
        }
      }
    })();
  }, [isMessageUpdating]);

  useEffect(() => {
    (async () => {
      if (transcript.length > 1000) {
        await doAudio();
      }
    })();
  }, [transcript]);

  useEffect(() => {
    if (!listening && transcript) {
      const message = {
        id: nanoid(),
        isUserMessage: true,
        text: transcript,
      };
      sendMessage(message);
    }
  }, [transcript, listening]);

  const startListening = async (lang) => {
    await SpeechRecognition.startListening({ language: lang });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  return (
    <div className="w-full max-w-3xl p-2 rounded-lg m-auto my-8 bg-violet-900">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <button
            className="inline-flex flex-row gap-0.5 focus:outline-none focus:ring-4 focus:ring-blue-600 hover:bg-green-700/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-700 border-none rounded-md cursor-pointer text-sm px-2 py-2 bg-green-700"
            onClick={(e) => {
              e.preventDefault();
              startListening(selectedLanguage?.currentKey ?? selectedLanguage);
            }}
            disabled={listening}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M8 5.14v14l11-7l-11-7Z" />
            </svg>{" "}
            Start
          </button>
          <button
            className="inline-flex flex-row gap-0.5 focus:outline-none focus:ring-4 focus:ring-blue-600 hover:bg-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-700 border-none rounded-md cursor-pointer text-sm px-2 py-2 bg-red-700"
            onClick={stopListening}
            disabled={!listening}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M6 18V6h12v12H6Z" />
            </svg>{" "}
            Stop
          </button>
          <Dropdown disableAnimation>
            <Dropdown.Button
              auto
              color="secondary"
              css={{
                tt: "capitalize",
                size: "30px",
                borderRadius: "$xs",
                fontSize: "$xs",
                marginLeft: "$4",
              }}
            >
              {selectedLanguage?.currentKey ?? selectedLanguage}
            </Dropdown.Button>
            <Dropdown.Menu
              color="secondary"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedLanguage}
              onSelectionChange={setSelectedLanguage}
            >
              <Dropdown.Section title="Select Speech Language">
                <Dropdown.Item key="en-US">English (US)</Dropdown.Item>
                <Dropdown.Item key="ar-SA">Arabic (Saudi Arabia)</Dropdown.Item>
                <Dropdown.Item key="ja">Japanese</Dropdown.Item>
                <Dropdown.Item key="ko">Korean</Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <span className="text-gray-300">
          Transcript ({transcript.length}/1000)
        </span>
      </div>

      <pre className="border-4 border-dashed border-violet-400 bg-violet-800 rounded-sm mt-3 p-2">
        <BrowserSupports />
      </pre>
      <div className="flex justify-end text-sm mt-2 text-gray-400">
        {subscriptionInfo && (
          <p>
            Total quota remaining:{" "}
            {subscriptionInfo.character_limit -
              subscriptionInfo.character_count}
          </p>
        )}
      </div>
    </div>
  );
}

export default Speech;
