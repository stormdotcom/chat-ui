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
export const getThreads = async () => {
  const response = await api.get(`/assistances/threads/list`);
  return response.data;
};

export const createThread = async () => {
  const response = await api.post(`/assistances/threads/create`);
  return response.data;
};

export const deleteThread = async (threadId: string) => {
  const response = await api.delete(`/assistances/threads/${threadId}`);
  return response.data;
};

// Message endpoints
export const getMessages = async (threadId: string) => {
  const response = await api.get(`/assistances/threads/${threadId}/messages`);
  return response.data;
};

export const sendMessage = async (threadId: string, content: any) => {
  const response = await api.post(`/assistances/threads/${threadId}/messages`, {
    role: 'user',
    content
  });
  return response.data;
};

export const runAssistant = async (threadId: string, content: string) => {
  const response = await api.post(`/assistances/threads/${threadId}/runs`, {
    assistant_id: content,
  });
  return response.data;
};

export const getRunStatus = async (threadId: string, runId: string) => {
  const response = await api.get(`/assistances/threads/${threadId}/runs/${runId}`);
  return response.data;
};

// File endpoints
export const getFiles = async () => {
  const response = await api.get(`/assistances/files`);
  return response.data;
};

export const uploadFile = async (  file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/assistances/files/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async ( fileId: string) => {
  const response = await api.delete(`/assistances/files/${fileId}`);
  return response.data;
};
