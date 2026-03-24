import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input.trim());
};

export const sanitizeMessage = (message) => {
  // Remove excessive whitespace
  let cleaned = message.replace(/\s+/g, ' ').trim();
  // Limit message length
  cleaned = cleaned.slice(0, 4000);
  return sanitizeInput(cleaned);
};