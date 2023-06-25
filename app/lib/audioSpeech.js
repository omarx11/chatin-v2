"use server";

import axios from "axios";
import fs from "fs";

export async function getChatVoise(text) {
  console.log(text);
  const ttsResponse = await axios.post(
    "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
    {
      text: text,
      model_id: "eleven_multilingual_v1",
      voice_settings: {
        stability: 0.4,
        similarity_boost: 1.0,
      },
    },
    {
      headers: {
        "xi-api-key": process.env.ELEVEN_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      responseType: "arraybuffer",
    }
  );
  // return new Promise((fulfill, reject) => {
  //   let stream = fs.writeFileSync("./public/audio/audio.mp3", ttsResponse.data);
  //   stream.on("finish", fulfill);
  //   stream.on("error", reject);
  // });
  let chatDate = Date.now();

  fs.writeFileSync(`./public/audio/chat-${chatDate}.mp3`, ttsResponse.data);
  return chatDate;
}
