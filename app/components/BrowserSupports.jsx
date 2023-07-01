import dynamic from "next/dynamic";
import { useSpeechRecognition } from "react-speech-recognition";

function BrowserSupports() {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <code className="whitespace-normal text-red-200">
        your <b>Browser</b> doesn&apos;t support speech recognition, try using{" "}
        <b>Google Chrome</b> instead.
      </code>
    );
  }

  return (
    <code className="whitespace-normal">
      {!listening ? "Go ahed... ask me" : transcript}
    </code>
  );
}

export default dynamic(() => Promise.resolve(BrowserSupports), {
  ssr: false,
});
