import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import FileList from './FileList';
import { File, FilesResponse } from '../../types';
import { getFiles, uploadFile, deleteFile } from '../../services/api';

interface FileManagementProps {
  assistantId: string | null;
}

const FileManagement: React.FC<FileManagementProps> = ({ assistantId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [vectorStoreIds, setVectorStoreIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Fetch files when assistant changes
  useEffect(() => {
    if (!assistantId) {
      setFiles([]);
      setVectorStoreIds([]);
      return;
    }

    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const data: FilesResponse = await getFiles(assistantId);
        setFiles(data.files || []);
        setVectorStoreIds(data.vector_store_ids || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [assistantId]);

  const handleUploadFile = async (file: File) => {
    if (!assistantId) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(assistantId, file);
      setFiles([...files, response.file]);
      if (response.vectorStoreId && !vectorStoreIds.includes(response.vectorStoreId)) {
        setVectorStoreIds([...vectorStoreIds, response.vectorStoreId]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!assistantId) return;

    setIsDeleting(true);
    try {
      await deleteFile(assistantId, fileId);
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!assistantId) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Files</h3>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          <FileUpload onUpload={handleUploadFile} isUploading={isUploading} />
          <FileList
            files={files}
            onDelete={handleDeleteFile}
            isLoading={isLoading}
            isDeleting={isDeleting}
          />
        </div>
      )}
    </div>
  );
};

export default FileManagement;
