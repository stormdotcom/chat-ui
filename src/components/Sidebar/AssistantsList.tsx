import React, { useState, useEffect, memo } from 'react';
import { getAssistants } from '../../services/api';
import { Assistant } from '../../types';

interface AssistantsListProps {
  selectedAssistant: Assistant | null;
  onSelectAssistant: (assistant: Assistant) => void;
}

const AssistantsList: React.FC<AssistantsListProps> = memo(({ selectedAssistant, onSelectAssistant }) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const data = await getAssistants();
        setAssistants(data);
        if (data.length > 0 && !selectedAssistant) {
          onSelectAssistant(data[0]);
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistants();
  }, [selectedAssistant, onSelectAssistant]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (assistants.length === 0) {
    return <p className="text-gray-500 p-4">No assistants available</p>;
  }

  return (
    <div className="space-y-1 py-2">
      {assistants.map((assistant) => (
        <button
          key={assistant.id}
          className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
            selectedAssistant?.id === assistant.id
              ? 'bg-indigo-100 text-indigo-800 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => onSelectAssistant(assistant)}
        >
          {assistant.name}
        </button>
      ))}
    </div>
  );
});

AssistantsList.displayName = 'AssistantsList';

export default AssistantsList;
