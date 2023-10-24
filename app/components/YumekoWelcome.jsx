import { useContext, useEffect, useState } from "react";
import { StatementContext } from "../context/statement";

const YumekoWelcome = () => {
  const { isAudioMuted } = useContext(StatementContext);
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
    <div className="flex items-end">
      <div className="order-2 mx-2 flex max-w-md flex-col items-start space-y-1 overflow-x-hidden text-sm font-medium">
        <p className="flex items-center gap-2 rounded-lg bg-neutral-200 px-2 py-2 text-neutral-900 sm:px-4 sm:pl-2">
          <button
            className="rounded-full bg-neutral-300 p-1 hover:bg-neutral-400"
            onClick={(e) => {
              e.preventDefault();
              isAudioStart ? setIsAudioStart(false) : setIsAudioStart(true);
            }}
          >
            {isAudioStart ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
              </svg>
            )}
          </button>
          Hi, I'm Yumeko. how can I assist you today?
        </p>
      </div>
    </div>
  );
};

export default YumekoWelcome;
