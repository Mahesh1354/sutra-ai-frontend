export const PROMPT_TYPES = [
  { value: 'general', label: 'General', icon: '💬' },
  { value: 'coding', label: 'Coding', icon: '💻' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
];

export const SYSTEM_PROMPTS = {
  default: 'You are a helpful AI assistant.',
  coding: 'You are an expert programmer. Provide clear, well-documented code examples and explain your solutions.',
  creative: 'You are a creative writer. Help users with storytelling, poetry, and creative ideas.',
};

export const DEFAULT_MODEL = 'gemini-2.5-flash';