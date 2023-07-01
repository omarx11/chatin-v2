"use server";

export async function serverAction() {
  return process.env.ELEVEN_API_KEY;
}
