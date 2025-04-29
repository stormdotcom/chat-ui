import React, { useState, useEffect, memo } from 'react';
import { createThread, getThreads, deleteThread } from '../../services/api';
import { Thread } from '../../types';
import ConfirmationModal from '../ConfirmationModal';
import Toast from '../Toast';

interface ThreadsListProps {
  assistantId: string;
  selectedThread: Thread | null;
  onSelectThread: (thread: Thread) => void;
}

const ThreadsList: React.FC<ThreadsListProps> = memo(({ assistantId, selectedThread, onSelectThread }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchThreads();
  }, [assistantId]);

  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      const data = await getThreads();
      setThreads(data);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch threads'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async () => {
    try {
      const newThread = await createThread();
      setThreads((prev) => [...prev, newThread]);
      onSelectThread(newThread);
    } catch (err) {
      console.error('Error creating thread:', err);
      setError(err instanceof Error ? err : new Error('Failed to create thread'));
    }
  };

  const handleDeleteClick = (thread: Thread, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreadToDelete(thread);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!threadToDelete) return;

    try {
      await deleteThread(threadToDelete.id);
      setThreads((prev) => prev.filter((t) => t.id !== threadToDelete.id));
      setToastMessage('Thread deleted successfully');
      setShowToast(true);
    } catch (err) {
      console.error('Error deleting thread:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete thread'));
    } finally {
      setShowDeleteModal(false);
      setThreadToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleCreateThread}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          New Thread
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : threads.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No threads yet</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {threads.map((thread) => (
              <li
                key={thread.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedThread?.id === thread.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => onSelectThread(thread)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Thread {thread.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(thread.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(thread, e)}
                    className="ml-2 text-gray-400 hover:text-red-600 focus:outline-none"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setThreadToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Thread"
        message="Are you sure you want to delete this thread? This action cannot be undone."
      />

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
});

ThreadsList.displayName = 'ThreadsList';

export default ThreadsList;
