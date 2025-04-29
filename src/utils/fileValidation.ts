export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

export interface FileValidationError {
  code: 'SIZE_LIMIT' | 'INVALID_TYPE';
  message: string;
}

export const validateFile = (file: File): FileValidationError | null => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      code: 'SIZE_LIMIT',
      message: 'File size exceeds 5MB limit'
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      code: 'INVALID_TYPE',
      message: 'File type not allowed'
    };
  }

  return null;
}; 
