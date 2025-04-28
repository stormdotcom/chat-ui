import axios from 'axios';
import { DEFAULT_ASSISTANT_ID } from '../constants';

const BASE_URL = 'http://localhost:4444';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Assistant endpoints
export const getAssistants = async () => {
  // Return hardcoded assistant with specified ID
  return [{
    id: DEFAULT_ASSISTANT_ID,
    name: 'AI Assistant',
    description: 'Your helpful AI assistant'
  }];
};

// Thread endpoints
export const getThreads = async (assistantId: string) => {
  const response = await api.get(`/assistances/${assistantId}/threads`);
  return response.data;
};

export const createThread = async (assistantId: string) => {
  const response = await api.post(`/assistances/${assistantId}/threads`);
  return response.data;
};

// Message endpoints
export const getMessages = async (assistantId: string, threadId: string) => {
  const response = await api.get(`/assistances/${assistantId}/threads/${threadId}/messages`);
  return response.data;
};

export const sendMessage = async (assistantId: string, threadId: string, content: string) => {
  const response = await api.post(`/assistances/${assistantId}/threads/${threadId}/messages`, {
    role: 'user',
    content,
  });
  return response.data;
};

export const runThread = async (assistantId: string, threadId: string, content: string) => {
  const response = await api.post(`/assistances/${assistantId}/threads/${threadId}/run`, {
    role: 'user',
    content,
  });
  return response.data;
};

// File endpoints
export const getFiles = async (assistantId: string) => {
  const response = await api.get(`/assistances/${assistantId}/files`);
  return response.data;
};

export const uploadFile = async (assistantId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/assistances/${assistantId}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (assistantId: string, fileId: string) => {
  const response = await api.delete(`/assistances/${assistantId}/files/${fileId}`);
  return response.data;
};
