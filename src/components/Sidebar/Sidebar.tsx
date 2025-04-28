import React, { useState, useEffect } from 'react';
import AssistantsList from './AssistantsList';
import ThreadsList from './ThreadsList';
import { Assistant, Thread } from '../../types';
import { getAssistants, getThreads, createThread } from '../../services/api';

interface SidebarProps {
  selectedAssistant: Assistant | null;
  setSelectedAssistant: (assistant: Assistant) => void;
  selectedThread: Thread | null;
  setSelectedThread: (thread: Thread) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedAssistant,
  setSelectedAssistant,
  selectedThread,
  setSelectedThread,
}) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingAssistants, setLoadingAssistants] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch assistants on mount
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const data = await getAssistants();
        setAssistants(data);
        if (data.length > 0 && !selectedAssistant) {
          setSelectedAssistant(data[0]);
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
      } finally {
        setLoadingAssistants(false);
      }
    };

    fetchAssistants();
  }, []);

  // Fetch threads when selected assistant changes
  useEffect(() => {
    if (!selectedAssistant) return;

    const fetchThreads = async () => {
      setLoadingThreads(true);
      try {
        const data = await getThreads(selectedAssistant.id);
        setThreads(data);
        if (data.length > 0 && (!selectedThread || selectedThread.id !== data[0].id)) {
          setSelectedThread(data[0]);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoadingThreads(false);
      }
    };

    fetchThreads();
  }, [selectedAssistant]);

  const handleCreateThread = async () => {
    if (!selectedAssistant) return;

    try {
      const newThread = await createThread(selectedAssistant.id);
      setThreads([newThread, ...threads]);
      setSelectedThread(newThread);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-md shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:sticky top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-10 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedAssistant ? selectedAssistant.name : 'Assistants'}
            </h2>
            <AssistantsList
              assistants={assistants}
              selectedAssistant={selectedAssistant}
              onSelectAssistant={setSelectedAssistant}
              isLoading={loadingAssistants}
            />
          </div>
          
          {selectedAssistant && (
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Conversations</h2>
              <ThreadsList
                threads={threads}
                selectedThread={selectedThread}
                onSelectThread={setSelectedThread}
                onCreateThread={handleCreateThread}
                isLoading={loadingThreads}
              />
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>{selectedAssistant ? selectedAssistant.name : 'Assistance API Demo'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
