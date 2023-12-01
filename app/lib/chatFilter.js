// filter bad words from chat conversation
export function filter(chat) {
  // TODO: add more words..
  const cusswords = ["sex", "fuck", "dick", "كس", "زانية", "pussy"];
  var chat;
  for (let i = 0; i < cusswords.length; i++) {
    const length = String(cusswords[i]).length;
    let characters = "";
    for (let u = 0; u < length; u++) {
      characters = String(characters) + String("*");
    }
    chat = chat.replace(String(cusswords[i]), String(characters));
  }
  return chat;
}
