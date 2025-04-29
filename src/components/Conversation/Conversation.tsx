import React, { useState, useEffect, memo, useCallback } from 'react';
import { Assistant, Message, Thread } from '../../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ErrorBoundary from '../ErrorBoundary';
import {
  getMessages,
  sendMessage,
  runAssistant,
  getRunStatus,
} from '../../services/api';
import { DEFAULT_ASSISTANT_ID } from '../../constants';

interface ConversationProps {
  selectedAssistant: Assistant | null;
  selectedThread: Thread | null;
}

const Conversation: React.FC<ConversationProps> = memo(
  ({ selectedAssistant, selectedThread }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [error, setError] = useState<Error | null>(null);

    // Load messages on thread change
    useEffect(() => {
      if (!selectedThread) return setIsLoading(false);

      (async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getMessages(selectedThread.openai_thread_id);
          setMessages(response.data || []);
        } catch (err) {
          console.error(err);
          setError(new Error('Failed to load messages'));
        } finally {
          setIsLoading(false);
        }
      })();
    }, [selectedThread]);

    const handleSend = useCallback(
      async (content: string) => {
        if (!selectedThread || isSending) return;
        setIsSending(true);

        // 1) optimistically render user message
        const tempMsg: any = {
          id: `temp-${Date.now()}`,
          role: 'user',
          content,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...(prev || []), tempMsg]);

        try {
          // 2) send user message to backend
          setStatusMessage("Sending message...")
          await sendMessage(selectedThread.openai_thread_id, content);

          // 3) start assistant run
          setStatusMessage("Running assistant...")
          const run = await runAssistant(
            selectedThread.openai_thread_id,
            selectedAssistant?.id ?? DEFAULT_ASSISTANT_ID
          );
          setStatusMessage("Assistant Initializing...")

          // 4) poll until complete
          setStatusMessage("Assistant Status: Running...")
          let status = run;
          let statusCount = 0
          do {
            setStatusMessage("Assistant Status: Running..." + statusCount)
            await new Promise((r) => setTimeout(r, 700));
            status = await getRunStatus(
              selectedThread.openai_thread_id,
              run.id
            );
            statusCount++
          } while (status.status !== 'completed' && status.status !== 'failed');

          if (status.status === 'failed') {
           // TODO: handle error in status
            setStatusMessage("Assistant Status: Failed...")
          }

          // 5) fetch updated messages
          setStatusMessage("Fetching messages...")
          const response = await getMessages(selectedThread.openai_thread_id);
          setMessages(response.data || []);
          setStatusMessage("Messages fetched...")
        } catch (err: any) {
          setStatusMessage("Error...")
          console.error(err);
          setError(err instanceof Error ? err : new Error('Chat error'));
        } finally {
          setStatusMessage("")
          setIsSending(false);
        }
      },
      [selectedThread, selectedAssistant, isSending]
    );

    if (!selectedAssistant || !selectedThread) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">
            Select an assistant and thread to start
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
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

          {isSending && (
            <div className="flex justify-center items-center py-2">
              <div className="loader" />
              <span className="ml-2 text-gray-500">
                {statusMessage}
              </span>
            </div>
          )}

          <MessageInput
            onSend={handleSend}
            disabled={isLoading || isSending}
            statusMessage={statusMessage}
          />
        </div>
      </ErrorBoundary>
    );
  }
);

Conversation.displayName = 'Conversation';
export default Conversation;
