"use client";

import { nanoid } from "nanoid";
import { useState } from "react";

import TextareaAutosize from "react-textarea-autosize";

export default function Input() {
  const [input, setInput] = useState("");

  // const {mutate: sendMessage, isLoading } = useMutation

  return (
    <div className="flex items-center justify-between pb-2">
      <TextareaAutosize
        rows={2}
        placeholder="Write a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const message = {
              id: nanoid(),
              isUserInput: true,
              text: input,
            };
          }
        }}
        className="mr-3 h-full w-full resize-none rounded-md text-sm focus:ring-0 disabled:opacity-50"
      />
      <button type="submit" className="rounded-md bg-emerald-600 px-3 py-2">
        SEND
      </button>
    </div>
  );
}
