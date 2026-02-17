"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip, Send } from "lucide-react"

type Conversation = {
  id: string
  client_id: string
  provider_id: string
  last_message_at: string
  client: { id: string; first_name: string; avatar_url: string | null }
  provider: { id: string; first_name: string; avatar_url: string | null }
}

type Message = {
  id: string
  sender_id: string
  message_type: string
  content: string
  created_at: string
  sender: { id: string; first_name: string; avatar_url: string | null }
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        await fetchConversations()
      }
    }
    init()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchConversations() {
    const res = await fetch("/api/conversations")
    const data: Conversation[] = await res.json()
    setConversations(data)
  }

  async function fetchMessages(convId: string) {
    const res = await fetch(`/api/messages?conversation_id=${convId}`)
    const data: Message[] = await res.json()
    setMessages(data)
  }

  async function sendMessage() {
    if (!input.trim() || !selectedConv || !userId || sending) return

    setSending(true)

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: selectedConv.id,
        message_type: "text",
        content: input,
      }),
    })

    if (res.ok) {
      const newMsg = await res.json()
      setMessages((prev) => [...prev, newMsg])
      setInput("")
    } else {
      alert("Failed to send message")
    }

    setSending(false)
  }

  function selectConversation(conv: Conversation) {
    setSelectedConv(conv)
    fetchMessages(conv.id)
  }

  useEffect(() => {
    if (!selectedConv) return

    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${selectedConv.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConv.id}`,
        },
        (payload) => {
          console.log("[v0] New message received:", payload.new)
          setMessages((prev) => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConv])

  const filteredConversations = conversations.filter((conv) => {
    const otherPerson = conv.client_id === userId ? conv.provider : conv.client
    return otherPerson.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversations List */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Conversations</h2>

          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <ScrollArea className="h-[600px]">
            {filteredConversations.map((conv) => {
              const otherPerson = conv.client_id === userId ? conv.provider : conv.client
              return (
                <div
                  key={conv.id}
                  className={`p-3 mb-2 rounded cursor-pointer hover:bg-muted flex items-center gap-3 ${
                    selectedConv?.id === conv.id ? "bg-muted" : ""
                  }`}
                  onClick={() => selectConversation(conv)}
                >
                  <Avatar>
                    <AvatarImage src={otherPerson.avatar_url || undefined} />
                    <AvatarFallback>{otherPerson.first_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{otherPerson.first_name || "User"}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredConversations.length === 0 && (
              <p className="text-muted-foreground text-sm text-center mt-4">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
            )}
          </ScrollArea>
        </Card>

        {/* Messages */}
        <Card className="md:col-span-2 p-4">
          {selectedConv ? (
            <>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <Avatar>
                  <AvatarImage
                    src={
                      (selectedConv.client_id === userId ? selectedConv.provider : selectedConv.client).avatar_url ||
                      undefined
                    }
                  />
                  <AvatarFallback>
                    {(selectedConv.client_id === userId ? selectedConv.provider : selectedConv.client)
                      .first_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">
                  {(selectedConv.client_id === userId ? selectedConv.provider : selectedConv.client).first_name ||
                    "User"}
                </h2>
              </div>

              <ScrollArea className="h-[500px] mb-4 px-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[70%] ${
                        msg.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {msg.message_type === "text" && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
                      {msg.message_type === "image" && (
                        <img src={msg.content || "/placeholder.svg"} alt="sent image" className="max-w-full rounded" />
                      )}
                      {msg.message_type === "link" && (
                        <a href={msg.content} target="_blank" rel="noopener noreferrer" className="underline">
                          {msg.content}
                        </a>
                      )}
                      {msg.message_type === "package" && (
                        <div className="border-2 border-primary/50 p-2 rounded bg-background/50">
                          📦 View Package (ID: {msg.content})
                        </div>
                      )}
                      <div
                        className={`text-xs mt-1 ${msg.sender_id === userId ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" type="button">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  disabled={sending}
                />
                <Button onClick={sendMessage} disabled={sending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
