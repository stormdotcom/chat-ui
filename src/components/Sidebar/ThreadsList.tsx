import React from 'react';
import { Thread } from '../../types';

interface ThreadsListProps {
  threads: Thread[];
  selectedThread: Thread | null;
  onSelectThread: (thread: Thread) => void;
  onCreateThread: () => void;
  isLoading: boolean;
}

const ThreadsList: React.FC<ThreadsListProps> = ({
  threads,
  selectedThread,
  onSelectThread,
  onCreateThread,
  isLoading,
}) => {
  // Format date to display only the date part
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get the first message text for thread preview
  const getThreadPreview = (thread: Thread) => {
    if (!thread.messages || thread.messages.length === 0) {
      return 'New conversation';
    }
    return thread.messages[0].content.substring(0, 40) + (thread.messages[0].content.length > 40 ? '...' : '');
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-20 bg-gray-200 rounded mb-3"></div>
        <div className="animate-pulse h-20 bg-gray-200 rounded mb-3"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 py-2">
      <button
        onClick={onCreateThread}
        className="w-full px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Thread
      </button>

      {threads.length === 0 ? (
        <p className="text-gray-500 px-4">No threads yet</p>
      ) : (
        threads.map((thread) => (
          <button
            key={thread.id}
            className={`w-full text-left p-3 rounded-md transition-colors ${
              selectedThread?.openai_thread_id === thread.openai_thread_id
                ? 'bg-indigo-50 border border-indigo-200'
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelectThread(thread)}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium truncate">
                {getThreadPreview(thread)}
              </p>
              {thread.created_at && (
                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                  {formatDate(thread.created_at)}
                </span>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default ThreadsList;