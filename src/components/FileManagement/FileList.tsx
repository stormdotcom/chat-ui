import React from 'react';
import { File } from '../../types';

interface FileListProps {
  files: File[];
  onDelete: (fileId: string) => void;
  isLoading: boolean;
  isDeleting: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, onDelete, isLoading, isDeleting }) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No files uploaded yet
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">File ID: {file.id}</p>
                <p className="text-xs text-gray-500">
                  Size: {formatBytes(file.usage_bytes)} • Uploaded: {formatDate(file.created_at)}
                </p>
                <p className="text-xs text-gray-500">
                  Status: {file.status} • Vector Store: {file.vector_store_id}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onDelete(file.id)}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
      ))}
    </div>
  );
};

export default FileList;
