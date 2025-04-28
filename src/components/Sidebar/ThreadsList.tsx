import React, { useState, useEffect, memo } from 'react';
import { createThread, getThreads } from '../../services/api';
import { Thread } from '../../types';

interface ThreadsListProps {
  assistantId: string;
  selectedThread: Thread | null;
  onSelectThread: (thread: Thread) => void;
}

const ThreadsList: React.FC<ThreadsListProps> = memo(({ assistantId, selectedThread, onSelectThread }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      if (!assistantId) return;
      
      setIsLoading(true);
      try {
        const data = await getThreads(assistantId);
        setThreads(data);
        if (data.length > 0 && (!selectedThread || selectedThread.id !== data[0].assistant_id)) {
          onSelectThread(data[0]);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleCreateThread = async () => {
    if (!assistantId) return;
    
    try {
      const newThread = await createThread(assistantId);
      setThreads(prevThreads => [newThread, ...prevThreads]);
      onSelectThread(newThread);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 mb-4">No conversations yet</p>
        <button
          onClick={handleCreateThread}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start New Conversation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleCreateThread}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
      >
        Start New Conversation
      </button>
      {threads.map((thread) => {
        // Get the first message content or use a default
        const firstMessage = thread.messages?.[0]?.content || 'New conversation';
        const preview = firstMessage.length > 40 ? firstMessage.substring(0, 40) + '...' : firstMessage;
        
        return (
          <button
            key={thread.id}
            className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
              selectedThread?.id === thread.id
                ? 'bg-indigo-100 text-indigo-800 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onSelectThread(thread)}
          >
            <div className="flex flex-col">
              <span className="truncate">{preview}</span>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(thread.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
});

ThreadsList.displayName = 'ThreadsList';

export default ThreadsList;
