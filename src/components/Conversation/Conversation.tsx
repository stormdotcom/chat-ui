import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Assistant, Thread, Message } from '../../types';
import { getMessages, runThread } from '../../services/api';

interface ConversationProps {
  selectedAssistant: Assistant | null;
  selectedThread: Thread | null;
}

const Conversation: React.FC<ConversationProps> = ({
  selectedAssistant,
  selectedThread,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch messages when selected thread changes
  useEffect(() => {
    if (!selectedAssistant || !selectedThread) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages(selectedAssistant.id, selectedThread.id);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedAssistant, selectedThread]);

  const handleSendMessage = async (content: string) => {
    if (!selectedAssistant || !selectedThread) return;

    setIsProcessing(true);

    // Optimistically add user message to the UI
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
    };
    setMessages([...messages, userMessage]);

    try {
      // Send message and get AI response
      const response = await runThread(selectedAssistant.id, selectedThread.id, content);
      
      // Update the messages with the AI response
      setMessages((prevMessages) => [...prevMessages, response]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedAssistant || !selectedThread) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500">
            Select an assistant and thread to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-800">
          {selectedAssistant.name}
        </h2>
        <p className="text-sm text-gray-500">
          {selectedAssistant.description || 'Ask me anything!'}
        </p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList messages={messages} isLoading={loading || isProcessing} />
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default Conversation;