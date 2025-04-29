import React, { useRef, useState } from 'react';
import { validateFile, FileValidationError, ALLOWED_MIME_TYPES } from '../../utils/fileValidation';
import Toast from '../Toast';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadError?: string;
  onUploadSuccess?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUpload, 
  isUploading, 
  uploadError,
  onUploadSuccess 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<FileValidationError | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onUpload(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onUpload(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReupload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  // Show success toast and clear file when upload is successful
  React.useEffect(() => {
    if (!isUploading && selectedFile && !uploadError) {
      setShowToast(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess?.();
    }
  }, [isUploading, selectedFile, uploadError, onUploadSuccess]);

  return (
    <div className="w-full space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={ALLOWED_MIME_TYPES.join(',')}
          disabled={isUploading}
        />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              Upload a file
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, JPG, PNG, GIF up to 5MB
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-700 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {uploadError && (
              <button
                onClick={handleReupload}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium focus:outline-none"
                disabled={isUploading}
              >
                Reupload
              </button>
            )}
            <button
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error.message}
        </div>
      )}
      {uploadError && (
        <div className="mt-2 text-sm text-red-600">
          {uploadError}
        </div>
      )}

      {showToast && (
        <Toast
          message="File uploaded successfully and ingested into knowledge base"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default FileUpload;
