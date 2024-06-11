"use client";

import "regenerator-runtime";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useStatementContext } from "@/context/StatementProvider";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import BrowserSupports from "./BrowserSupports";
import { getSubscriptionInfo } from "../lib/elevenlabs";
import { nanoid } from "nanoid";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  DropdownSection,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { errorMsg } from "../data/errorMsg";
import { MobileSettings } from "./ChatSettings";

const ChatSpeech = () => {
  const defaultLang = "en-US";
  const defaultVoise = "AZnzlk1XvdvUeBnXmlld";
  const [selectedLanguage, setSelectedLanguage] = useState(
    new Set([defaultLang]),
  );
  const [selectedVoise, setSelectedVoise] = useState(new Set([defaultVoise]));
  const [voiseName, setVoiseName] = useState("Rawan");
  const [languageName, setLanguageName] = useState("English (US)");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [mutationIsDone, setMutationIsDone] = useState(false);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const {
    messages,
    textareaRef,
    addMessage,
    removeMessage,
    updateMessage,
    isMessageUpdating,
    setChatStatus,
    setIsLoading,
    isAudioMuted,
    aiVoiseId,
    aiVoiseName,
    setAiVoiseId,
    setAiVoiseName,
  } = useStatementContext();

  async function doAudio() {
    if (
      transcript !== "" &&
      !isAudioMuted &&
      messages.at(-1).text !== errorMsg.limit
    ) {
      setIsLoading(true);
      setChatStatus("Voicing");
      try {
        const voiseId = selectedVoise?.currentKey ?? defaultVoise;
        // remove links, domains, extra spaces,
        // symbols, emojis, markdown images from AI text.
        const message = messages
          .at(-1)
          .text.substring(0, 1000)
          .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")
          .replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, "")
          .replace(/\[(.+?)\]\((.+?)\)/g, "")
          .replace(/\!\[(.+?)\]\((.+?)\)/g, "")
          .replace(/[*|~|(|)]/g, "")
          .replace(/\s+/g, " ");

        const res = await fetch("/api/elevenlabs", {
          method: "POST",
          body: JSON.stringify({
            data: {
              voiseId,
              message,
            },
          }),
        });
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        new Audio(audioUrl).play();

        setChatStatus(null);
        setIsLoading(false);

        setTimeout(() => {
          textareaRef.current?.focus();
        }, 10);

        setSubscriptionInfo(await getSubscriptionInfo());
      } catch {
        setChatStatus("Error");
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

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      setChatStatus(null);
      setIsLoading(false);

      // construct new message to add
      const id = nanoid();
      const responseMessage = {
        id,
        isUserMessage: false,
        text: "",
        time: Date.now(),
        ai_voise_id: aiVoiseId,
        ai_voise_name: aiVoiseName,
      };

      // add new message to state
      addMessage(responseMessage);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }

      // clean up
      setMutationIsDone(true);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
    },
    onError: (_, message) => {
      removeMessage(message.id);
      textareaRef.current?.focus();
    },
  });

  // start audio after transcript mutation is done.
  // save AI and user chat to localStorage and database.
  useEffect(() => {
    (async () => {
      if (mutationIsDone === true) {
        await doAudio();

        if (messages.length > 1 && messages.at(-1).text !== errorMsg.limit) {
          setTimeout(
            () =>
              typeof window !== "undefined" &&
              localStorage.setItem("chat", JSON.stringify(messages)),
            200,
          );

          fetch("/api/supabase", {
            method: "POST",
            body: JSON.stringify({
              data: {
                messages,
              },
            }),
          });
        }
      }
      setMutationIsDone(false);
    })();
  }, [mutationIsDone]);

  // this for the ChatInput
  useEffect(() => {
    (async () => {
      if (
        isMessageUpdating === true &&
        !isAudioMuted &&
        messages.at(-1).text !== errorMsg.limit
      ) {
        setIsLoading(true);
        setChatStatus("Voicing");
        try {
          const voiseId = selectedVoise?.currentKey ?? defaultVoise;
          // remove links, domains, extra spaces,
          // symbols, emojis, markdown images from AI text.
          const message = messages
            .at(-1)
            .text.substring(0, 1000)
            .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")
            .replace(/[^\p{L}\p{N}\p{P}\p{Z}{\^\$}]/gu, "")
            .replace(/\[(.+?)\]\((.+?)\)/g, "")
            .replace(/\!\[(.+?)\]\((.+?)\)/g, "")
            .replace(/[*|~|(|)]/g, "")
            .replace(/\s+/g, " ");

          const res = await fetch("/api/elevenlabs", {
            method: "POST",
            body: JSON.stringify({
              data: {
                voiseId,
                message,
              },
            }),
          });
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          new Audio(audioUrl).play();

          setChatStatus(null);
          setIsLoading(false);

          setTimeout(() => {
            textareaRef.current?.focus();
          }, 10);

          setSubscriptionInfo(await getSubscriptionInfo());
        } catch {
          setChatStatus("Error");
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
        time: Date.now(),
      };
      sendMessage(message);
    }
  }, [transcript, listening]);

  useEffect(() => {
    const voiseId = selectedVoise?.currentKey ?? defaultVoise;
    const voises = {
      AZnzlk1XvdvUeBnXmlld: "Rawan",
      EXAVITQu4vr4xnSDxMaL: "Bella",
      g5CIjZEefAph4nQFvHAz: "Ethan",
      MF3mGyEYCl7XYWbV9V6O: "Elli",
      jBpfuIE2acCO8z3wKNLl: "Gigi",
      jsCqWAovK2LkecY7zXl4: "Freya",
      GBv7mTt0atIp3Br8iCZE: "Thomas",
    };
    setVoiseName(voises[voiseId]);

    setAiVoiseId(voiseId);
    setAiVoiseName(voises[voiseId]);
  }, [selectedVoise]);

  useEffect(() => {
    const languageId = selectedLanguage?.currentKey ?? defaultLang;
    const languages = {
      "en-US": "English (US)",
      "ar-SA": "Arabic (SA)",
      ja: "Japanese",
      ko: "Korean",
      ru: "Russian",
      "de-DE": "German",
      "fr-FR": "French",
      tr: "Turkish",
    };
    setLanguageName(languages[languageId]);
  }, [selectedLanguage]);

  const startListening = async (lang) => {
    await SpeechRecognition.startListening({ language: lang });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  return (
    <section className="mb-4 mt-4 rounded-lg bg-secondary-800 px-2 py-3 shadow-md shadow-secondary-600 ring-4 ring-secondary-700 sm:mt-8 sm:py-2">
      <div className="flex flex-row flex-wrap justify-between gap-2">
        <div className="flex flex-row flex-wrap items-center gap-2">
          <Button
            radius="sm"
            size="sm"
            className="hidden gap-0.5 bg-[#12A150] text-sm text-white sm:inline-flex"
            onClick={(e) => {
              e.preventDefault();
              startListening(selectedLanguage?.currentKey ?? defaultLang);
            }}
            isDisabled={listening}
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M8 5.14v14l11-7l-11-7Z" />
              </svg>
            }
          >
            Start
          </Button>
          <Button
            radius="sm"
            size="sm"
            className="hidden gap-0.5 bg-[#C20E4D] text-sm text-white sm:inline-flex"
            onClick={stopListening}
            isDisabled={!listening}
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M6 18V6h12v12H6Z" />
              </svg>
            }
          >
            Stop
          </Button>
          <div className="flex flex-row items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  color="secondary"
                  variant="solid"
                  size="sm"
                  radius="sm"
                  endContent={
                    <svg
                      aria-hidden="true"
                      fill="none"
                      focusable="false"
                      height="1.4em"
                      role="presentation"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="1.4em"
                    >
                      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
                      <path d="M8 9l4 -4l4 4" />
                      <path d="M16 15l-4 4l-4 -4" />
                    </svg>
                  }
                >
                  {voiseName}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown menu"
                color="secondary"
                variant="flat"
                className="text-black"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedVoise}
                onSelectionChange={setSelectedVoise}
              >
                <DropdownSection title="Change AI Voice.">
                  <DropdownItem
                    key="AZnzlk1XvdvUeBnXmlld"
                    description="Default voise line"
                  >
                    Rawan
                  </DropdownItem>
                  <DropdownItem
                    key="EXAVITQu4vr4xnSDxMaL"
                    description="Nice person"
                  >
                    Bella
                  </DropdownItem>
                  <DropdownItem
                    key="g5CIjZEefAph4nQFvHAz"
                    description="A Serial Killer?"
                  >
                    Ethan
                  </DropdownItem>
                  <DropdownItem
                    key="MF3mGyEYCl7XYWbV9V6O"
                    description="Enthusiastic girl"
                  >
                    Elli
                  </DropdownItem>
                  <DropdownItem
                    key="jBpfuIE2acCO8z3wKNLl"
                    description="Annoying child"
                  >
                    Gigi
                  </DropdownItem>
                  <DropdownItem
                    key="jsCqWAovK2LkecY7zXl4"
                    description="Average american girl"
                  >
                    Freya
                  </DropdownItem>
                  <DropdownItem
                    key="GBv7mTt0atIp3Br8iCZE"
                    description="Bloodthirsty"
                  >
                    Thomas
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  color="secondary"
                  variant="solid"
                  size="sm"
                  radius="sm"
                  className="hidden sm:inline-flex"
                  endContent={
                    <svg
                      aria-hidden="true"
                      fill="none"
                      focusable="false"
                      height="1.4em"
                      role="presentation"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="1.4em"
                    >
                      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
                      <path d="M8 9l4 -4l4 4" />
                      <path d="M16 15l-4 4l-4 -4" />
                    </svg>
                  }
                >
                  {languageName}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown menu"
                color="secondary"
                variant="flat"
                className="text-black"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedLanguage}
                onSelectionChange={setSelectedLanguage}
              >
                <DropdownSection title="Select STT language.">
                  <DropdownItem key="en-US">English (US)</DropdownItem>
                  <DropdownItem key="ar-SA">Arabic (SA)</DropdownItem>
                  <DropdownItem key="ja">Japanese</DropdownItem>
                  <DropdownItem key="ko">Korean</DropdownItem>
                  <DropdownItem key="ru">Russian</DropdownItem>
                  <DropdownItem key="de-DE">German</DropdownItem>
                  <DropdownItem key="fr-FR">French</DropdownItem>
                  <DropdownItem key="tr">Turkish</DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <span className="hidden text-right text-default-300 sm:block">
          Transcript ({transcript.length}/1000)
        </span>
        <div className="flex gap-3 sm:hidden">
          <MobileSettings />
        </div>
      </div>

      <pre className="mt-3 hidden min-h-[48px] rounded-sm border-4 border-dashed border-secondary-400 bg-secondary-600 p-2 sm:block">
        <BrowserSupports />
      </pre>
      <div className="hidden justify-end pt-1 text-xs text-default-400 sm:flex">
        {subscriptionInfo ? (
          <p>
            Total quota remaining:{" "}
            {subscriptionInfo.character_limit -
              subscriptionInfo.character_count}
          </p>
        ) : (
          <p className="flex-auto">
            Note: This is a transcript (Speech to Text) 🎙️ that Converts your
            voice to text and then sends it to AI.
          </p>
        )}
      </div>
    </section>
  );
};

export default ChatSpeech;
