import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createThread, getAssistants, getFiles, getThreads } from '../../services/api';
import { Assistant, FilesResponse, Thread } from '../../types';
import AssistantsList from './AssistantsList';
import ThreadsList from './ThreadsList';

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
  const [filesInfo, setFilesInfo] = useState<FilesResponse | null>(null);
  const [loadingFilesInfo, setLoadingFilesInfo] = useState(false);
  const navigate = useNavigate();

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
  }, [selectedAssistant, setSelectedAssistant]);

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
          navigate(`/assistant/${selectedAssistant.id}/thread/${data[0].id}`);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoadingThreads(false);
      }
    };

    const fetchFilesInfo = async () => {
      setLoadingFilesInfo(true);
      try {
        const data = await getFiles(selectedAssistant.id);
        setFilesInfo(data);
      } catch (error) {
        setFilesInfo(null);
        console.error('Error fetching files info:', error);
      } finally {
        setLoadingFilesInfo(false);
      }
    };

    fetchThreads();
    fetchFilesInfo();
  }, [selectedAssistant, selectedThread, setSelectedThread, navigate]);

  const handleCreateThread = async () => {
    if (!selectedAssistant) return;

    try {
      const newThread = await createThread(selectedAssistant.id);
      setThreads([newThread, ...threads]);
      setSelectedThread(newThread);
      navigate(`/assistant/${selectedAssistant.id}/thread/${newThread.id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
    console.log(thread)
    if (selectedAssistant) {
      navigate(`/assistant/${selectedAssistant.id}/thread/${thread.openai_thread_id}`);
    }
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
            {selectedAssistant && (
              <div className="text-xs text-gray-500 break-all mt-1">
                <span className="font-semibold">Assistant ID:</span> {selectedAssistant.id}
              </div>
            )}
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
                onSelectThread={handleSelectThread}
                onCreateThread={handleCreateThread}
                isLoading={loadingThreads}
              />
            </div>
          )}
        </div>

        {/* Files List Section */}
        {selectedAssistant && filesInfo && filesInfo.files && filesInfo.files.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-700 mb-1 font-semibold">Files</div>
            <ul className="space-y-2">
              {filesInfo.files.map((file) => {
                const fileName =
                  file.attributes?.name ||
                  file.attributes?.filename ||
                  file.id;
                return (
                  <li key={file.id} className="flex items-start justify-between group">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-800 font-medium truncate">{fileName}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {file.vector_store_id}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {/* View Icon */}
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-blue-500"
                        title="View"
                        tabIndex={-1}
                        // Placeholder: implement view logic if needed
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {/* Delete Icon */}
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-red-500"
                        title="Delete"
                        tabIndex={-1}
                        onClick={async () => {
                          if (!selectedAssistant) return;
                          try {
                            await import('../../services/api').then(api =>
                              api.deleteFile(selectedAssistant.id, file.id)
                            );
                            // Refresh files list
                            setLoadingFilesInfo(true);
                            const data = await import('../../services/api').then(api =>
                              api.getFiles(selectedAssistant.id)
                            );
                            setFilesInfo(data);
                          } catch (error) {
                            // Optionally show error
                            // eslint-disable-next-line no-console
                            console.error('Error deleting file:', error);
                          } finally {
                            setLoadingFilesInfo(false);
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

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
