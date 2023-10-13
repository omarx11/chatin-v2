export async function POST(req) {
  const { data } = await req.json();
  const text = data.message;

  // TODO: change model-id to "eleven_multilingual_v2"
  // multilingual_v2 is slow to generated but better audio experience.

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${data.voiseId}`,
      {
        method: "POST",
        headers: {
          accept: "audio/mpeg",
          "xi-api-key": process.env.ELEVEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v1",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        }),
      },
    );
    const blob = await res.blob();
    return new Response(blob);
  } catch (err) {
    console.error("Error:", err);
  }
}
