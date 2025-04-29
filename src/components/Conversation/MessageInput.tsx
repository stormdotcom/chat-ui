import React, { useState, useCallback, memo } from 'react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  statusMessage: string;
}

const MessageInput: React.FC<MessageInputProps> = memo(
  ({ onSend, disabled, statusMessage }) => {
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || sending) return;
        setSending(true);
        try {
          await onSend(content.trim());
          setContent('');
        } finally {
          setSending(false);
        }
      },
      [content, onSend, sending]
    );

    return (
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200"
      >
    
        <div className="flex space-x-4">
       
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={disabled || sending}
          />
        
          <button
            type="submit"
            disabled={!content.trim() || disabled || sending}
            className={`px-4 py-2 text-white rounded-md ${
              !content.trim() || disabled || sending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {sending ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    );
  }
);

MessageInput.displayName = 'MessageInput';
export default MessageInput;
