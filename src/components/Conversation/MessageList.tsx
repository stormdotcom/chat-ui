import React, { useRef, memo, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = memo(
  ({ messages, isLoading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!Array.isArray(messages)) {
      console.error('Messages is not an array:', messages);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <p className="text-red-500">Error: Invalid messages format</p>
          </div>
        </div>
      );
    }

    // Sort messages by created_at (ascending order)
    const sortedMessages = [...messages].sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    if (sortedMessages.length === 0 && !isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {sortedMessages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {/* Render content with markdown if not from the user */}
              {msg.role !== 'user' ? (
                <ReactMarkdown>
                  {typeof msg.content[0]?.text?.value === 'string' ? msg.content[0]?.text?.value : JSON.stringify(msg.content)}
                </ReactMarkdown>
              ) : (
                // For user messages, render as plain text
                typeof msg.content[0]?.text?.value === 'string' ? msg.content[0]?.text?.value : JSON.stringify(msg.content)
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';
export default MessageList;
