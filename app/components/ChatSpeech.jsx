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

const ChatSpeech = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(new Set(["en-US"]));
  const [selectedVoise, setSelectedVoise] = useState(
    new Set(["AZnzlk1XvdvUeBnXmlld"])
  );
  const [voiseName, setVoiseName] = useState("Yumeko");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [mutationIsDone, setMutationIsDone] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setChatStatus,
    setIsLoading,
  } = useContext(MessagesContext);

  async function doAudio() {
    if (transcript !== "") {
      setChatStatus("loading-audio");
      try {
        const voiseId = selectedVoise?.currentKey ?? "AZnzlk1XvdvUeBnXmlld";
        // remove links, domains, extra spaces,
        // symbols, emojis, markdown images.
        const message = messages
          .at(-1)
          .text.substring(0, 1000)
          .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")
          .replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, "")
          .replace(/\[(.+?)\]\((.+?)\)/g, "")
          .replace(/\!\[(.+?)\]\((.+?)\)/g, "")
          .replace(/[*|~|(|)]/g, "")
          .replace(/\s+/g, " ");
        const audioUrl = await getAudio(voiseId, message);
        new Audio(audioUrl).play();
        setChatStatus(null);
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
      setChatStatus("thinking");
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
      setChatStatus(null);
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

  // this for the ChatSpeech
  useEffect(() => {
    (async () => {
      if (mutationIsDone === true) {
        await doAudio();
      }
      setMutationIsDone(false);
    })();
  }, [mutationIsDone]);

  // this for the ChatInput
  useEffect(() => {
    (async () => {
      if (isMessageUpdating === true) {
        setChatStatus("loading-audio");
        try {
          const voiseId = selectedVoise?.currentKey ?? "AZnzlk1XvdvUeBnXmlld";
          // remove links, domains, extra spaces,
          // symbols, emojis, markdown images.
          const message = messages
            .at(-1)
            .text.substring(0, 1000)
            .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")
            .replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, "")
            .replace(/\[(.+?)\]\((.+?)\)/g, "")
            .replace(/\!\[(.+?)\]\((.+?)\)/g, "")
            .replace(/[*|~|(|)]/g, "")
            .replace(/\s+/g, " ");
          const audioUrl = await getAudio(voiseId, message);
          new Audio(audioUrl).play();
          setChatStatus(null);
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

  useEffect(() => {
    const voiseId = selectedVoise?.currentKey ?? "AZnzlk1XvdvUeBnXmlld";
    const voises = {
      AZnzlk1XvdvUeBnXmlld: "Yumeko",
      EXAVITQu4vr4xnSDxMaL: "Bella nice person",
      g5CIjZEefAph4nQFvHAz: "A Serial Killer?",
      MF3mGyEYCl7XYWbV9V6O: "Elli is enthusiastic",
      jBpfuIE2acCO8z3wKNLl: "Gigi a (Child)",
      jsCqWAovK2LkecY7zXl4: "American girl",
      GBv7mTt0atIp3Br8iCZE: "Bloodthirsty",
    };
    setVoiseName(voises[voiseId]);
  }, [selectedVoise]);

  const startListening = async (lang) => {
    await SpeechRecognition.startListening({ language: lang });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  return (
    <div className="w-full max-w-3xl p-2 shadow-md shadow-violet-500/50 rounded-lg my-8 bg-violet-950">
      <div className="flex flex-row flex-wrap justify-between">
        <div className="flex flex-row flex-wrap items-center gap-2">
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
                borderRadius: "4px",
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
                <Dropdown.Item key="ar-SA">Arabic (SA)</Dropdown.Item>
                <Dropdown.Item key="ja">Japanese</Dropdown.Item>
                <Dropdown.Item key="ko">Korean</Dropdown.Item>
                <Dropdown.Item key="ru">Russian</Dropdown.Item>
                <Dropdown.Item key="de-DE">German</Dropdown.Item>
                <Dropdown.Item key="fr-FR">French</Dropdown.Item>
                <Dropdown.Item key="tr">Turkish</Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown disableAnimation>
            <Dropdown.Button
              auto
              color="secondary"
              css={{
                tt: "capitalize",
                size: "30px",
                borderRadius: "4px",
                fontSize: "$xs",
                marginLeft: "$4",
              }}
            >
              {voiseName}
            </Dropdown.Button>
            <Dropdown.Menu
              color="secondary"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedVoise}
              onSelectionChange={setSelectedVoise}
            >
              <Dropdown.Section title="Select AI Speak Voice">
                <Dropdown.Item key="AZnzlk1XvdvUeBnXmlld">
                  Yumeko (default)
                </Dropdown.Item>
                <Dropdown.Item key="EXAVITQu4vr4xnSDxMaL">
                  Bella \ Nice Person
                </Dropdown.Item>
                <Dropdown.Item key="g5CIjZEefAph4nQFvHAz">
                  A Serial Killer?
                </Dropdown.Item>
                <Dropdown.Item key="MF3mGyEYCl7XYWbV9V6O">
                  Elli Is Enthusiastic
                </Dropdown.Item>
                <Dropdown.Item key="jBpfuIE2acCO8z3wKNLl">
                  Gigi Annoying (child)
                </Dropdown.Item>
                <Dropdown.Item key="jsCqWAovK2LkecY7zXl4">
                  Average American Girl
                </Dropdown.Item>
                <Dropdown.Item key="GBv7mTt0atIp3Br8iCZE">
                  Bloodthirsty
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <span className="text-gray-300 text-right">
          Transcript ({transcript.length}/1000)
        </span>
      </div>

      <pre className="border-4 min-h-[48px] border-dashed border-violet-400 bg-violet-800 rounded-sm mt-3 p-2">
        <BrowserSupports />
      </pre>
      <div className="flex justify-end text-xs pt-1 text-gray-400">
        {subscriptionInfo ? (
          <p>
            Total quota remaining:{" "}
            {subscriptionInfo.character_limit -
              subscriptionInfo.character_count}
          </p>
        ) : (
          <p className="flex-auto">
            Notice: This is a transcript (Speech to Text) 🎙️ that Converts your
            voice to text and then sends it to AI.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSpeech;
