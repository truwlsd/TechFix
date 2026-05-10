import { apiFetch } from "./http";
import type { ChatMessage, ChatThread } from "../types/domain";

export async function fetchMyChatMessages(token: string): Promise<ChatMessage[]> {
  return (await apiFetch("/chat/my", {}, token)) as ChatMessage[];
}

export async function sendMyChatMessage(token: string, text: string): Promise<ChatMessage> {
  return (await apiFetch(
    "/chat/my",
    {
      method: "POST",
      body: JSON.stringify({ text, clientId: crypto.randomUUID() }),
    },
    token
  )) as ChatMessage;
}

export async function fetchAdminChatThreads(token: string): Promise<ChatThread[]> {
  return (await apiFetch("/chat/admin/threads", {}, token)) as ChatThread[];
}

export async function fetchAdminChatMessages(token: string, userId: string): Promise<ChatMessage[]> {
  return (await apiFetch(`/chat/admin/${userId}`, {}, token)) as ChatMessage[];
}

export async function sendAdminChatMessage(
  token: string,
  userId: string,
  text: string
): Promise<ChatMessage> {
  return (await apiFetch(
    `/chat/admin/${userId}`,
    {
      method: "POST",
      body: JSON.stringify({ text, clientId: crypto.randomUUID() }),
    },
    token
  )) as ChatMessage;
}
