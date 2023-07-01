import axios from "axios";
import { serverAction } from "./actions";

/**
 * Fetches the voices the user has access to.
 * @returns An array of voices.
 */
export async function getVoices() {
  const apiKey = await serverAction();
  const { data } = await axios.get("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": apiKey,
    },
  });
  return data.voices;
}

/**
 * Transcribes text using a given voice using the ElevenLabs API and returns a local URL.
 * @param voiceId The voice ID to generate from.
 * @param text The text to transcribe.
 * @returns A local URL to the audio file.
 */
export async function getAudio(voiceId, text) {
  const apiKey = await serverAction();
  const { data } = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      text,
      model_id: "eleven_multilingual_v1",
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
      },
    },
    {
      headers: {
        "xi-api-key": apiKey,
      },
      responseType: "blob",
    }
  );
  return window.URL.createObjectURL(new Blob([data], { type: "audio/mpeg" }));
}

// Testing...
// i need to use "use server"
// also try to connect to webscoket between server and client

// https://stackoverflow.com/questions/51399121/how-to-save-int16array-buffer-to-wav-file-node-js

// export async function getAudio2(voiceId, text) {
//   const apiKey = await serverAction();
//   const { data } = await axios.post(
//     `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
//     {
//       text,
//       model_id: "eleven_multilingual_v1",
//       voice_settings: {
//         stability: 0.75,
//         similarity_boost: 0.75,
//       },
//     },
//     {
//       headers: {
//         "xi-api-key": apiKey,
//       },
//       responseType: "stream",
//     }
//   );

//   function streamToString(stream) {
//     const chunks = [];
//     return new Promise((resolve, reject) => {
//       stream.on("data", (chunk) => chunks.push(chunk));
//       stream.on("error", reject);
//       stream.on("data", () => resolve(Buffer.concat(chunks).toString("utf8")));
//     });
//   }
//   return streamToString(data);

// ====================

// let firstChunk = true;
// let size = 0;
// const bufferArray = [];
// for await (const chunk of data) {
//   if (firstChunk) {
//     firstChunk = false;
//   }
//   size += Buffer.byteLength(chunk);
//   const buff = new Buffer.from(chunk);
//   bufferArray.push(buff);
// }
// return { html: Buffer.concat(bufferArray).toString() };

// ====================

// let dataChunk = data;
// data.on("data", (chunk) => {
//   console.log(chunk.toString());
//   dataChunk = data;
// });
// return new Blob([dataChunk], { type: "audio/mpeg" });

// ====================

// data.on("data", (data) => {
//   console.log(data);
//   return data;
// });
// data.on("end", () => {
//   console.log("stream done");
// });
// }

/**
 * Fetches user subscription information from their API key.
 * @returns User subscription information.
 */
export async function getSubscriptionInfo() {
  const apiKey = await serverAction();
  const { data } = await axios.get(
    "https://api.elevenlabs.io/v1/user/subscription",
    {
      headers: {
        Accept: "application/json",
        "xi-api-key": apiKey,
      },
    }
  );
  return data;
}
