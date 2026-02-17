"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  body: string
  message_type: string
  sender_id: string
  created_at: string
  profiles?: { first_name: string; avatar_url: string | null }
}

export function BookingChat({
  conversationId,
  currentUserId,
}: {
  conversationId: string
  currentUserId: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchMessages() {
    try {
      const res = await fetch(
        `/api/marketplace/conversations/${conversationId}/messages`
      )
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch {
      // Silently fail on poll errors
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(
        `/api/marketplace/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: input.trim() }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data.message])
        setInput("")
      }
    } catch {
      // Handle error silently
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-80 border rounded-lg">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No messages yet. Start the conversation.
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          const isSystem = msg.message_type === "system"

          if (isSystem) {
            return (
              <div key={msg.id} className="text-xs text-muted-foreground text-center py-1 italic">
                {msg.body}
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMine ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarImage src={msg.profiles?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {msg.profiles?.first_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[75%] px-3 py-1.5 rounded-lg text-sm ${
                  isMine
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {!isMine && (
                  <p className="text-xs font-medium mb-0.5 opacity-70">
                    {msg.profiles?.first_name || "Unknown"}
                  </p>
                )}
                <p>{msg.body}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex gap-2 p-2 border-t"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          disabled={sending}
        />
        <Button type="submit" size="icon" disabled={!input.trim() || sending}>
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
