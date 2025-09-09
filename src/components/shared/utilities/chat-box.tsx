import React, { useState } from 'react'
import { FaPaperPlane, FaTimes } from 'react-icons/fa'

interface ChatBoxProps {
    className?: string
}

export const ChatBox: React.FC<ChatBoxProps> = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')

    const handleSendMessage = () => {
        if (!message.trim()) return
        // TODO: Implement actual chat functionality
        console.log('Message sent:', message)
        setMessage('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all ${className}`}
            >
                💬
            </button>
        )
    }

    return (
        <div className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Support Chat</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Messages */}
            <div className="h-64 p-4 overflow-y-auto">
                <div className="space-y-4">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                        Welcome to support chat! How can we help you?
                    </div>
                </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatBox