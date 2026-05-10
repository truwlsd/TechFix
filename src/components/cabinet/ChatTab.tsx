import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, MessageSquare, RefreshCw, Send } from "lucide-react";
import { useStore } from "../../store/useStore";

export function ChatTab() {
  const {
    currentUser,
    chatMessages,
    chatThreads,
    activeChatUserId,
    refreshMyChat,
    sendMessageToMyChat,
    refreshAdminThreads,
    openAdminChat,
    sendAdminMessage,
  } = useStore();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [error, setError] = useState("");
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const lastMsgIdRef = useRef<string | null>(null);

  const isAdmin = Boolean(currentUser?.isAdmin);
  const activeThread = useMemo(
    () => chatThreads.find((t) => t.userId === activeChatUserId) ?? null,
    [chatThreads, activeChatUserId]
  );

  const refreshNow = async (showSpinner = false) => {
    try {
      setError("");
      if (showSpinner) setIsRefreshing(true);
      if (isAdmin) {
        await refreshAdminThreads();
        if (activeChatUserId) {
          await openAdminChat(activeChatUserId);
        }
      } else {
        await refreshMyChat();
      }
    } catch (e) {
      setError((e as Error).message || "Не удалось обновить чат");
    } finally {
      setIsLoading(false);
      if (showSpinner) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    void refreshNow(false);
    const timer = window.setInterval(() => void refreshNow(false), 7000);
    return () => window.clearInterval(timer);
  }, [currentUser, isAdmin, activeChatUserId]);

  useEffect(() => {
    if (!chatMessages.length) return;
    const newestId = chatMessages[chatMessages.length - 1]?.id ?? null;
    if (!newestId) return;
    if (!lastMsgIdRef.current) {
      lastMsgIdRef.current = newestId;
      return;
    }
    if (lastMsgIdRef.current !== newestId) {
      const list = listRef.current;
      const nearBottom = list
        ? list.scrollHeight - list.scrollTop - list.clientHeight < 80
        : true;
      if (nearBottom) {
        requestAnimationFrame(() => {
          list?.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
        });
      } else {
        setHasNewMessages(true);
      }
      lastMsgIdRef.current = newestId;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!isLoading && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [isLoading]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError("");
    setIsSending(true);
    const result = isAdmin ? await sendAdminMessage(trimmed) : await sendMessageToMyChat(trimmed);
    setIsSending(false);
    if (!result.ok) {
      setError(result.message || "Не удалось отправить сообщение");
      return;
    }
    setText("");
    setHasNewMessages(false);
  };

  const openThread = async (userId: string) => {
    setMobileThreadOpen(true);
    await openAdminChat(userId);
  };

  const renderMessages = () => {
    if (isLoading) {
      return (
        <div className="py-10 text-center text-white/35">
          <Loader2 className="w-7 h-7 mx-auto mb-2 animate-spin text-white/30" />
          Загрузка чата...
        </div>
      );
    }
    if (chatMessages.length === 0) {
      return (
        <div className="py-10 text-center text-white/30">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-white/20" />
          <p>Сообщений пока нет</p>
        </div>
      );
    }

    let lastDate = "";
    return chatMessages.map((m) => {
      const mine = isAdmin ? m.senderRole === "admin" : m.senderRole === "user";
      const day = new Date(m.createdAt).toLocaleDateString("ru-RU");
      const showDate = day !== lastDate;
      lastDate = day;
      return (
        <div key={m.id}>
          {showDate && (
            <div className="text-center text-[11px] text-white/25 my-2">
              {day}
            </div>
          )}
          <div
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
              mine ? "ml-auto bg-white text-[#0a0a0f]" : "bg-white/[0.08] text-white/75"
            }`}
          >
            <p>{m.text}</p>
            <p className={`mt-1 text-[10px] ${mine ? "text-black/50" : "text-white/30"}`}>
              {new Date(m.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      );
    });
  };

  const showThreadPane = !isAdmin || mobileThreadOpen || typeof window !== "undefined" && window.innerWidth >= 768;
  const showListPane = isAdmin && (!mobileThreadOpen || typeof window !== "undefined" && window.innerWidth >= 768);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-white/60 font-medium">Чат поддержки</h2>
        <button
          type="button"
          onClick={() => void refreshNow(true)}
          className="text-xs text-white/45 hover:text-white inline-flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Обновить
        </button>
      </div>

      <div
        className={`rounded-2xl overflow-hidden ${
          isAdmin ? "md:grid md:grid-cols-[280px_1fr]" : ""
        }`}
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {showListPane && (
          <div className="border-b md:border-b-0 md:border-r border-white/[0.08]">
            <div className="px-4 py-3 text-xs text-white/35 uppercase tracking-wider">
              Диалоги
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {chatThreads.length === 0 ? (
                <div className="px-4 py-6 text-sm text-white/30">Пока нет диалогов</div>
              ) : (
                chatThreads.map((thread) => (
                  <button
                    key={thread.userId}
                    type="button"
                    onClick={() => void openThread(thread.userId)}
                    className={`w-full text-left px-4 py-3 border-t border-white/[0.05] hover:bg-white/[0.03] ${
                      activeChatUserId === thread.userId ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white/80 truncate">{thread.userName}</p>
                      {thread.unreadForAdmin > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#0a0a0f] font-semibold">
                          {thread.unreadForAdmin}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/30 truncate mt-1">{thread.lastMessage}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {showThreadPane && (
          <div className="p-4 md:p-5">
            {isAdmin && (
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setMobileThreadOpen(false)}
                  className="md:hidden p-1.5 rounded-lg border border-white/[0.12] text-white/60"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="text-sm text-white/55">
                  {activeThread ? `${activeThread.userName} · ${activeThread.userEmail}` : "Выберите диалог"}
                </div>
              </div>
            )}

            {hasNewMessages && (
              <button
                type="button"
                onClick={() => {
                  setHasNewMessages(false);
                  if (listRef.current) {
                    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
                  }
                }}
                className="mb-2 text-xs text-white/70 border border-white/[0.15] rounded-lg px-3 py-1.5"
              >
                Новые сообщения
              </button>
            )}

            <div ref={listRef} className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {renderMessages()}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder={
                  isAdmin
                    ? activeChatUserId
                      ? "Ответ пользователю..."
                      : "Сначала выберите диалог"
                    : "Напишите сообщение администратору..."
                }
                disabled={isSending || (isAdmin && !activeChatUserId)}
                className="input-dark flex-1"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={isSending || !text.trim() || (isAdmin && !activeChatUserId)}
                className="btn-primary px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>
        )}

        {isAdmin && !showThreadPane && (
          <div className="p-8 text-center text-white/30 md:block hidden">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-white/20" />
            Выберите диалог слева
          </div>
        )}

        {isAdmin && mobileThreadOpen && !activeChatUserId && (
          <div className="p-8 text-center text-white/30 md:hidden">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-white/20" />
            Выберите диалог
          </div>
        )}
      </div>
    </div>
  );
}
