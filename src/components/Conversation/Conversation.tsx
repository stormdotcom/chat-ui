import React, { useState, useEffect, memo } from 'react';
import { Assistant, Message, Thread } from '../../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ErrorBoundary from '../ErrorBoundary';
import { getMessages } from '../../services/api';

interface ConversationProps {
  selectedAssistant: Assistant | null;
  selectedThread: Thread | null;
}

const Conversation: React.FC<ConversationProps> = memo(({ selectedAssistant, selectedThread }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch messages when thread changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedThread) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await getMessages(selectedThread.id);
        if (!Array.isArray(data)) {
          throw new Error('Invalid messages format received from server');
        }
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch messages'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedThread]);

  const handleMessageSent = (newMessages: Message[]) => {
    if (!Array.isArray(newMessages)) {
      console.error('Invalid messages format:', newMessages);
      return;
    }
    setMessages(newMessages);
  };

  if (!selectedAssistant || !selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select an assistant and thread to start</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-500 mb-2">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex-1 flex flex-col h-full">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput
          threadId={selectedThread.id}
          assistantId={selectedAssistant.id}
          onMessageSent={handleMessageSent}
          isDisabled={isLoading}
        />
      </div>
    </ErrorBoundary>
  );
});

Conversation.displayName = 'Conversation';

export default Conversation;
