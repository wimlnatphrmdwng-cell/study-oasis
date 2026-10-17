export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  history?: ChatMessage[];
  system_instruction?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponsePayload {
  status: string;
  reply: string;
  model: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}
