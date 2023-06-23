"use client";

import "regenerator-runtime";
import speech, { useSpeechRecognition } from "react-speech-recognition";

export default function Speech() {
  const { listening, transcript } = useSpeechRecognition();

  return (
    <>
      {listening ? <p>go ahed...</p> : <p>Click the button</p>}
      <button
        onClick={() => {
          speech.startListening();
        }}
      >
        Talk
      </button>

      {transcript && <div>{transcript}</div>}
    </>
  );
}
