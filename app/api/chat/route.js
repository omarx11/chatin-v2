import { OpenAIStream } from "@/app/utils/OpenAIStream"

// set limit for tokens used in GPTs response message
const maxTokens = 4000

export async function POST(req) {
  const { UserMessage } = await req.json()
  if (!UserMessage) {
    return new Response("No prompt in the request", { status: 400 })
  }
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: UserMessage }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: maxTokens,
    stream: true,
    n: 1
  }

  const stream = await OpenAIStream(payload)

  return new Response(stream)
}

export const config = { runtime: "edge" }
