"use server";
import axios from "axios";

/**
 * Fetches the voices the user has access to.
 * @returns An array of voices.
 */
export async function getVoices() {
  const { data } = await axios.get("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVEN_API_KEY,
    },
  });
  return data.voices;
}

/**
 * Fetches user subscription information from their API key.
 * @returns User subscription information.
 */
export async function getSubscriptionInfo() {
  const { data } = await axios.get(
    "https://api.elevenlabs.io/v1/user/subscription",
    {
      headers: {
        Accept: "application/json",
        "xi-api-key": process.env.ELEVEN_API_KEY,
      },
    }
  );
  return data;
}
