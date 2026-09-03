const API_URL = "https://api.anthropic.com/v1/messages";

export async function generateSummary(
  bookingTitle: string,
  bookingNotes: string,
  customerName: string,
  providerName: string,
  status: string
): Promise<string> {
  const prompt =
    "You are writing a short internal summary of a service booking.\n\n" +
    "Booking: " + bookingTitle + "\n" +
    "Customer: " + customerName + "\n" +
    "Provider: " + providerName + "\n" +
    "Status: " + status + "\n" +
    "Customer notes: " + bookingNotes + "\n\n" +
    "Write two or three sentences summarising this booking for our operations team.";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}
