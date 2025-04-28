// API response types
export interface Assistant {
  id: string;
  name: string;
  description?: string;
}

export interface Thread {
  id: string;
  messages: Message[];
  created_at?: string;
  openai_thread_id: string
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface File {
  id: string;
  object: string;
  usage_bytes: number;
  created_at: number;
  vector_store_id: string;
  status: string;
  last_error: string | null;
  chunking_strategy: {
    type: string;
    static: {
      max_chunk_size_tokens: number;
      chunk_overlap_tokens: number;
    };
  };
  attributes: Record<string, string | number | boolean>;
}

export interface FilesResponse {
  assistant_id: string;
  vector_store_ids: string[];
  files: File[];
}

export interface FileUploadResponse {
  vectorStoreId: string;
  file: File;
}
