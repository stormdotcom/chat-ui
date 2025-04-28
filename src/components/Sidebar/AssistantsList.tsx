import React from 'react';
import { Assistant } from '../../types';

interface AssistantsListProps {
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  onSelectAssistant: (assistant: Assistant) => void;
  isLoading: boolean;
}

const AssistantsList: React.FC<AssistantsListProps> = ({
  assistants,
  selectedAssistant,
  onSelectAssistant,
  isLoading,
}) => {
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
};

export default AssistantsList;