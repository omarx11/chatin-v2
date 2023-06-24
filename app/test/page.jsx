import Speech from "../components/Speech";

export default async function TestPage() {
  async function getSpeechAudio(text) {
    const res = await fetch("../app/api/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data;
  }

  const data = await getSpeechAudio("hi dude");
  console.log(data);
  return (
    <header className="mt-24 text-center">
      <h1 className="text-2xl font-bold">
        Chatin <span className="text-base font-thin">v2</span>
      </h1>
      <p className="text-sm">Powered by gpt-3.5-turbo</p>
      <Speech />
    </header>
  );
}
