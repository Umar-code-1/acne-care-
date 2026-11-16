import React, { useEffect, useRef, useState } from "react";
import API from "../../api";
import AppIcon from "./AppIcon";

const conversationCache = new Map();

export default function PrescriptionChat({ prescriptionId, recipientName, initialInstruction, channel = "chat", readOnly = false, sendLabel, onClose }) {
  const cacheKey = `${prescriptionId}:${channel}`;
  const cachedConversation = conversationCache.get(cacheKey);
  const [messages, setMessages] = useState(() => cachedConversation?.messages || []);
  const [currentUserId, setCurrentUserId] = useState(() => cachedConversation?.currentUserId || "");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(!cachedConversation);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    let active = true;
    let inFlight = false;
    const endpoint = `/messages/prescriptions/${prescriptionId}${channel === "instructions" ? "/instructions" : ""}`;
    const loadConversation = async () => {
      if (inFlight || document.visibilityState === "hidden") return;
      inFlight = true;
      try {
        const { data } = await API.get(endpoint);
        if (!active) return;
        const nextMessages = Array.isArray(data.messages) ? data.messages : [];
        const nextUserId = String(data.currentUserId || "");
        const cached = conversationCache.get(cacheKey);
        const unchanged = cached
          && cached.currentUserId === nextUserId
          && cached.messages.length === nextMessages.length
          && cached.messages.at(-1)?.id === nextMessages.at(-1)?.id;
        if (!unchanged) setMessages(nextMessages);
        setCurrentUserId(nextUserId);
        conversationCache.set(cacheKey, { messages: nextMessages, currentUserId: nextUserId });
        setError("");
      } catch (requestError) {
        if (active && !conversationCache.has(cacheKey)) {
          setError(requestError.response?.data?.message || "Could not load this conversation.");
        }
      } finally {
        inFlight = false;
        if (active) setLoading(false);
      }
    };
    loadConversation();
    const intervalId = window.setInterval(loadConversation, 10000);
    document.addEventListener("visibilitychange", loadConversation);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", loadConversation);
    };
  }, [prescriptionId, channel, cacheKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (event) => {
    event.preventDefault();
    const messageText = text.trim();
    if (!messageText || sending) return;

    setSending(true);
    setError("");
    try {
      const endpoint = `/messages/prescriptions/${prescriptionId}${channel === "instructions" ? "/instructions" : ""}`;
      const { data } = await API.post(endpoint, { text: messageText });
      setMessages((current) => {
        const nextMessages = [...current, data.message];
        const nextUserId = currentUserId || String(data.message.senderId);
        conversationCache.set(cacheKey, { messages: nextMessages, currentUserId: nextUserId });
        return nextMessages;
      });
      setCurrentUserId((current) => current || String(data.message.senderId));
      setText("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Message could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="prescription-chat-backdrop" onMouseDown={onClose}>
      <section className="prescription-chat" role="dialog" aria-modal="true" aria-labelledby="prescription-chat-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="prescription-chat-header">
          <div><h2 id="prescription-chat-title">{channel === "chat" ? `Chat with ${recipientName || "your doctor"}` : `Instructions ${readOnly ? "from" : "for"} ${recipientName || "the patient"}`}</h2><p>{channel === "chat" ? "Private messages about this skincare plan" : "Plan guidance from the dermatologist"}</p></div>
          <button type="button" onClick={onClose} className="prescription-chat-close" aria-label="Close chat"><AppIcon name="close" /></button>
        </header>
        <div className="prescription-chat-messages" aria-live="polite">
          {initialInstruction && <article className="prescription-chat-message received prescription-chat-plan-instruction"><span className="prescription-chat-sender">Doctor’s plan instructions</span><p>{initialInstruction}</p></article>}
          {loading ? <p className="prescription-chat-state">Loading conversation…</p> : messages.length ? messages.map((message) => {
            const ownMessage = String(message.senderId) === currentUserId;
            return <article className={`prescription-chat-message ${ownMessage ? "own" : "received"}`} key={message.id}>
              {!ownMessage && <span className="prescription-chat-sender">{message.senderName}</span>}
              <p>{message.text}</p>
              <time dateTime={message.createdAt}>{new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt))}</time>
            </article>;
          }) : !initialInstruction && <p className="prescription-chat-state">{readOnly ? "Your dermatologist has not sent instructions yet." : channel === "chat" ? "No messages yet. Start the conversation below." : "No instructions sent yet. Write a message below."}</p>}
          <div ref={endRef} />
        </div>
        {error && <p className="prescription-chat-error" role="alert">{error}</p>}
        {!readOnly && <form className="prescription-chat-compose" onSubmit={send}>
          <label className="sr-only" htmlFor="prescription-chat-input">{channel === "chat" ? "Write a message" : "Write instructions for the patient"}</label>
          <textarea id="prescription-chat-input" value={text} onChange={(event) => setText(event.target.value)} maxLength={2000} rows={2} placeholder={channel === "chat" ? "Write a message…" : "Write instructions for your patient…"} disabled={loading || sending} />
          <button type="submit" disabled={loading || sending || !text.trim()}><AppIcon name="chat" /> {sending ? "Sending…" : sendLabel}</button>
        </form>}
      </section>
    </div>
  );
}
