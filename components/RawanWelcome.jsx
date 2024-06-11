import { useEffect, useState } from "react";
import { useStatementContext } from "../context/StatementProvider";
import { Button } from "@nextui-org/button";

const RawanWelcome = () => {
  const { isAudioMuted } = useStatementContext();
  const [isAudioStart, setIsAudioStart] = useState(false);

  useEffect(() => {
    const audio = document.getElementById("identify");
    if (!isAudioStart) {
      audio.pause();
    } else if (!isAudioMuted) {
      audio.volume = 0.5;
      audio.play();
    }
    audio.onended = () => {
      setIsAudioStart(false);
      audio.currentTime = 0;
    };
  }, [isAudioStart]);

  return (
    <>
      <div className="flex items-end">
        <div className="order-2 mx-2 flex max-w-md flex-col items-start space-y-1 overflow-x-hidden text-sm font-medium">
          <p className="flex items-center gap-2 rounded-lg bg-default-200 px-2 py-2 text-black hover:bg-default-100 sm:px-4 sm:pl-2">
            <Button
              isIconOnly
              size="sm"
              radius="full"
              className="h-4 w-4 bg-default-300 hover:bg-default-400"
              onClick={(e) => {
                e.preventDefault();
                isAudioStart ? setIsAudioStart(false) : setIsAudioStart(true);
              }}
              aria-label="audio"
            >
              {isAudioStart ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M14 19V5h4v14h-4Zm-8 0V5h4v14H6Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                </svg>
              )}
            </Button>
            Hey. I'm Rawan. What do you want? Why are you even here?
          </p>
        </div>
      </div>
      <audio
        src="/static/audio/identify.webm"
        id="identify"
        className="hidden"
        preload="none"
      ></audio>
    </>
  );
};

export default RawanWelcome;
