"use client";

import "regenerator-runtime";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useState } from "react";
// import { getChatVoise } from "../lib/audioSpeech";
import { getAudio } from "../lib/elevenlabs";

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
    // const chatDate = await getChatVoise(data);

    const audioUrl = await getAudio(
      "EXAVITQu4vr4xnSDxMaL",
      "4fd5cfc56fafee830247d61ec38e6a2e",
      data.substring(0, 5000)
    );
    new Audio(audioUrl).play();

    return data;
    // return { data, chatDate };
  }

  useEffect(() => {
    if (!listening && transcript) {
      console.log(transcript);
      getChatMessage(transcript).then((response) => {
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
      {listening ? <p>go ahed... ask me</p> : <p>Click the button</p>}
      <button
        className="p-10 cursor-pointer bg-slate-700"
        onClick={() => {
          speech.startListening();
          /* if transcript contins any arabic words run this */
          // speech.startListening({ language: "ar-SA" });
        }}
      >
        Talk
      </button>

      {transcript && <div>{transcript}</div>}
      {thinking && <div>Thinking...</div>}
    </>
  );
}
