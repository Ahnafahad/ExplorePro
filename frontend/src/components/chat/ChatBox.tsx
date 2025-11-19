import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { formatRelativeTime } from '../../utils/helpers'
import type { Message } from '../../types'

interface ChatBoxProps {
  bookingId: string
  otherUser: { name: string; photo?: string }
}

export function ChatBox({ bookingId, otherUser }: ChatBoxProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Don't fetch messages for demo bookings (they start with 'booking-')
    if (!bookingId.startsWith('booking-')) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [bookingId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await api.get<Message[]>(`/api/bookings/${bookingId}/messages`)
      if (response.success && response.data) {
        setMessages(response.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      await api.post(`/api/bookings/${bookingId}/messages`, { content: newMessage })
      setNewMessage('')
      fetchMessages()
    } catch (error: any) {
      alert(error.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-lg bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isOwn = message.senderId === user?.id
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <Avatar
                    src={isOwn ? user?.photo : otherUser.photo}
                    name={isOwn ? user?.name : otherUser.name}
                    size="sm"
                  />
                  <div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
