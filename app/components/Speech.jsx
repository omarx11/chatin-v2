"use client";

import "regenerator-runtime";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useState } from "react";

export default function Speech() {
  const { listening, transcript } = useSpeechRecognition();
  const [thinking, setThinking] = useState(false);
  // const data = await getChatMessage("hi there");
  // console.log("data", data);

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

    return data;
  }

  useEffect(() => {
    if (!listening && transcript) {
      console.log(transcript);
      getChatMessage(transcript).then((response) => {
        const speechSynthesis = window.speechSynthesis;
        const voices = speechSynthesis.getVoices();
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.voice = voices[1];
        speechSynthesis.speak(utterance);

        console.log(voices);
      });
    }
  }, [transcript, listening]);

  return (
    <>
      {listening ? <p>go ahed...</p> : <p>Click the button</p>}
      <button
        onClick={() => {
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
