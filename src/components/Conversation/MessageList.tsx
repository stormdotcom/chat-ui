import React, { useRef, memo, useLayoutEffect } from 'react';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = memo(({ messages = [], isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use useLayoutEffect for scroll to prevent flickering
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="text-gray-500">No messages yet. Start a conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages?.map((message) => (
        <div
          key={message.id}
          className={`max-w-3xl ${
            message.role === 'user' ? 'ml-auto' : 'mr-auto'
          } animate-fade-in`}
        >
          <div
            className={`p-4 rounded-lg shadow-sm ${
              message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
          >
            {message.content}
          </div>
          <div
            className={`text-xs mt-1 ${
              message.role === 'user' ? 'text-right text-gray-500' : 'text-gray-500'
            }`}
          >
            {message.role === 'user' ? 'You' : 'Assistant'}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="max-w-3xl mr-auto">
          <div className="p-4 rounded-lg bg-white border border-gray-200 flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="text-xs mt-1 text-gray-500">Assistant is thinking...</div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;
