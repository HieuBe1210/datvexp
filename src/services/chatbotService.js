export async function sendMessageToChatbot(message, location = null) {
  const payload = { message };
  if (location) {
    payload.location = location;
  }

  const response = await fetch("https://vticinema-zalopay-test.vercel.app/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Server response:", text);
    throw new Error(
      `Failed to get response from chatbot: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.response;
}
