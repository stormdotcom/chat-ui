import React, { useState, useCallback, memo } from 'react';
import { Message } from '../../types';
import { sendMessage, getRunStatus, getMessages } from '../../services/api';

interface MessageInputProps {
  threadId: string;
  assistantId: string;
  onMessageSent: (messages: Message[]) => void;
  isDisabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = memo(({ threadId, assistantId, onMessageSent, isDisabled }) => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    setIsSending(true);
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistically append user message
    onMessageSent([userMessage]);

    try {
      // Send message and get run ID
      const response = await sendMessage(threadId, content.trim());
      const runId = response.id;

      // Poll for run completion
      let run;
      do {
        await new Promise(r => setTimeout(r, 500));
        run = await getRunStatus(threadId, runId);
      } while (run.status !== 'completed');

      // Fetch updated messages
      const updatedMessages = await getMessages(threadId);
      onMessageSent(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show error to user
    } finally {
      setIsSending(false);
      setContent('');
    }
  }, [content, threadId, assistantId, onMessageSent, isSending]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex space-x-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isDisabled || isSending}
        />
        <button
          type="submit"
          disabled={!content.trim() || isDisabled || isSending}
          className={`px-4 py-2 text-white rounded-md ${
            !content.trim() || isDisabled || isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSending ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
