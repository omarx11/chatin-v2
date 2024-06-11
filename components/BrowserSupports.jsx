import dynamic from "next/dynamic";
import { useSpeechRecognition } from "react-speech-recognition";

const BrowserSupports = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

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
      {!listening ? (
        <span className="italic text-default-300">
          Go ahed.. hit the Start button and ask anything!
        </span>
      ) : transcript === "" ? (
        isMicrophoneAvailable ? (
          "You can speak now!"
        ) : (
          "Please allow Microphone 🎤 first!"
        )
      ) : (
        transcript
      )}
    </code>
  );
};

export default dynamic(() => Promise.resolve(BrowserSupports), {
  loading: () => (
    <span className="italic text-default-300">
      Go ahed.. hit the Start button and ask Anything!
    </span>
  ),
  ssr: false,
});
