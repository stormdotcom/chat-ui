import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Conversation from './components/Conversation/Conversation';
import FileManagement from './components/FileManagement/FileManagement';
import Sidebar from './components/Sidebar/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { getAssistants } from './services/api';
import { Assistant, Thread } from './types';

function App() {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize assistant on mount
  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        const assistants = await getAssistants();
        if (assistants.length > 0) {
          setSelectedAssistant(assistants[0]);
        }
      } catch (error) {
        console.error('Error initializing assistant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAssistant();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          selectedAssistant={selectedAssistant}
          setSelectedAssistant={setSelectedAssistant}
          selectedThread={selectedThread}
          setSelectedThread={setSelectedThread}
        />

        <main className="flex-1 flex flex-col overflow-hidden md:ml-72">
          <div className="flex-1 overflow-y-auto flex flex-col">
            <Routes>
              <Route
                path="/"
                element={
                  selectedAssistant && selectedThread ? (
                    <Navigate to={`/assistant/thread/${selectedThread.openai_thread_id}`} replace />
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500">Select an assistant and thread to start</p>
                    </div>
                  )
                }
              />
              <Route
                path="/assistant/thread/:threadId"
                element={
                  <RouteSyncWrapper
                    selectedAssistant={selectedAssistant}
                    selectedThread={selectedThread}
                    setSelectedThread={setSelectedThread}
                  />
                }
              />
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>

            {selectedAssistant && (
              <div className="p-4 bg-gray-50">
                <FileManagement assistantId={selectedAssistant.id} />
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

import { useParams } from 'react-router-dom';

interface RouteSyncWrapperProps {
  selectedAssistant: Assistant | null;
  selectedThread: Thread | null;
  setSelectedThread: (t: Thread | null) => void;
}

const RouteSyncWrapper: React.FC<RouteSyncWrapperProps> = ({
  selectedAssistant,
  selectedThread,
  setSelectedThread,
}) => {
  const { threadId } = useParams();

  // Move state update to useEffect
  useEffect(() => {
    if (threadId && (!selectedThread || selectedThread.openai_thread_id !== threadId)) {
      setSelectedThread({
        id: threadId,
        openai_thread_id: threadId,
        messages: [],
      });
    }
  }, [threadId, selectedThread, setSelectedThread]);

  return (
    <div className="flex-1 overflow-hidden">
      <Conversation
        selectedAssistant={selectedAssistant}
        selectedThread={selectedThread}
      />
    </div>
  );
};

export default App;
