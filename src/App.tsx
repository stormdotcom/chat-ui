import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Conversation from './components/Conversation/Conversation';
import FileManagement from './components/FileManagement/FileManagement';
import { Assistant, Thread } from './types';
import { getAssistants } from './services/api';
import { DEFAULT_ASSISTANT_ID } from './constants';

function App() {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  // Initialize with the default assistant
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
      {/* Sidebar */}
      <Sidebar
        selectedAssistant={selectedAssistant}
        setSelectedAssistant={setSelectedAssistant}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-72">
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Conversation area */}
          <div className="flex-1 overflow-hidden">
            <Conversation
              selectedAssistant={selectedAssistant}
              selectedThread={selectedThread}
            />
          </div>

          {/* File management area */}
          {selectedAssistant && (
            <div className="p-4 bg-gray-50">
              <FileManagement assistantId={selectedAssistant?.id || null} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
