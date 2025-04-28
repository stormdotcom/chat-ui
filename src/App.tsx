import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Conversation from './components/Conversation/Conversation';
import FileManagement from './components/FileManagement/FileManagement';
import Sidebar from './components/Sidebar/Sidebar';
import { getAssistants } from './services/api';
import { Assistant, Thread } from './types';

function App() {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  useEffect(() => {
    const initializeAssistant = async () => {
      const assistants = await getAssistants();
      if (assistants.length > 0) {
        setSelectedAssistant(assistants[0]);
      }
    };
    initializeAssistant();
  }, []);

  return (
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
              path="/assistant/:assistantId/thread/:threadId"
              element={
                <RouteSyncWrapper
                  assistants={selectedAssistant ? [selectedAssistant] : []}
                  selectedAssistant={selectedAssistant}
                  setSelectedAssistant={setSelectedAssistant}
                  selectedThread={selectedThread}
                  setSelectedThread={setSelectedThread}
                />
              }
            />
            <Route
              path="*"
              element={
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500">Select an assistant and thread to start</p>
                </div>
              }
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
  );
}

import { useParams } from 'react-router-dom';

interface RouteSyncWrapperProps {
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  setSelectedAssistant: (a: Assistant | null) => void;
  selectedThread: Thread | null;
  setSelectedThread: (t: Thread | null) => void;
}

const RouteSyncWrapper: React.FC<RouteSyncWrapperProps> = ({
  selectedAssistant,
  setSelectedAssistant,
  selectedThread,
  setSelectedThread,
}) => {
  const { assistantId, threadId } = useParams();

  // Sync assistant and thread with route params
  useEffect(() => {
    if (assistantId && (!selectedAssistant || selectedAssistant.id !== assistantId)) {
      // In a real app, you might fetch or look up the assistant here
      setSelectedAssistant({ id: assistantId, name: 'AI Assistant' });
    }
    if (threadId && (!selectedThread || selectedThread.openai_thread_id !== threadId)) {
      // In a real app, you might fetch or look up the thread here
      setSelectedThread({
        id: threadId,
        openai_thread_id: threadId,
        messages: [],
      });
    }
  }, [ threadId]);

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
