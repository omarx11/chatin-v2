"use client";

import "regenerator-runtime";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useState } from "react";
import { getChatVoise } from "../lib/audioSpeech";

export default function Speech() {
  const { listening, transcript } = useSpeechRecognition();
  const [thinking, setThinking] = useState(false);

  async function getChatMessage(message) {
    setThinking(true);
    const data = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/text",
      },
      body: JSON.stringify({ message }),
    }).then((response) => response.text());
    setThinking(false);

    /* this function will create speech audio from chatgpt API
    and it will save it to the audio folder as the chat date name */
    const chatDate = await getChatVoise(data);
    console.log(chatDate);

    return { data, chatDate };
  }

  useEffect(() => {
    if (!listening && transcript) {
      console.log(transcript);
      getChatMessage(transcript).then((response) => {
        console.log(response.chatDate);
        // const speechSynthesis = window.speechSynthesis;
        // const utterance = new SpeechSynthesisUtterance(response);
        // utterance.lang = "ar-SA";
        // console.log(utterance);
        // speechSynthesis.speak(utterance);
        // const sound = new Audio(`./audio/chat-${response.chatDate}.mp3`);
        // sound.play();
      });
    }
  }, [transcript, listening]);

  return (
    <>
      {listening ? <p>go ahed...</p> : <p>Click the button</p>}
      <button
        className="p-10 cursor-pointer bg-slate-700"
        onClick={() => {
          // speech.startListening();
          /* if transcript contins any arabic words run this */
          speech.startListening({ language: "ar-SA" });
        }}
      >
        Talk
      </button>

      {transcript && <div>{transcript}</div>}
      {thinking && <div>Thinking...</div>}
    </>
  );
}
