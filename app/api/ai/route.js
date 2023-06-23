export async function POST(req) {
  const { message } = await req.json();
  console.log(message);

  const res = await fetch("https://api.pawan.krd/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        // {
        //   role: "system",
        //   content: "You can only speak arabic language.",
        // },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.4,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 150,
    }),
  });

  const data = await res.json();

  return new Response(data.choices[0].message.content);
}
