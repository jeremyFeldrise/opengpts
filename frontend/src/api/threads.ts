import { Chat } from "../types";

export async function getThread(threadId: string): Promise<Chat | null> {
  try {
    const response = await fetch(`${process.env.VITE_BACKEND_URL}//threads/${threadId}`, {
      headers:
      {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    }
    );
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as Chat;
  } catch (error) {
    console.error("Failed to fetch assistant:", error);
    return null;
  }
}
