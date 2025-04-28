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
                <div className="flex-1 overflow-hidden">
                  <Conversation
                    selectedAssistant={selectedAssistant}
                    selectedThread={selectedThread}
                  />
                </div>
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

export default App;
