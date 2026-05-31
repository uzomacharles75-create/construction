/**
 * Lightweight prompt-injection guard for free-text that gets fed to the LLM.
 * It does NOT try to be a perfect filter — it caps length, strips control
 * characters and fake role/delimiter markers, and neutralises the most common
 * "ignore previous instructions" style phrasings.
 */

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(the\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|messages?)/gi,
  /disregard\s+(all\s+)?(the\s+)?(previous|prior|above|earlier)/gi,
  /forget\s+(everything|all|the\s+above|previous\s+instructions?)/gi,
  /you\s+are\s+now\s+/gi,
  /from\s+now\s+on,?\s+you/gi,
  /(reveal|show|print|repeat)\s+(your\s+)?(system\s+prompt|instructions|initial\s+prompt)/gi,
  /\bsystem\s*prompt\b/gi,
];

// Fake conversation/role markers an attacker might inject to spoof turns
const ROLE_MARKER = /^\s*(system|assistant|user|model|developer)\s*:/gim;

export const sanitizePrompt = (input: unknown, maxLen = 2000): string => {
  if (input === null || input === undefined) return '';
  let s = String(input);

  // Cap length first to bound everything else
  if (s.length > maxLen) s = s.slice(0, maxLen);

  // Strip control characters but keep tab (\x09), newline (\x0A), carriage return (\x0D)
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove spoofed role markers at line starts
  s = s.replace(ROLE_MARKER, '');

  // Neutralise known injection phrasings
  for (const pattern of INJECTION_PATTERNS) {
    s = s.replace(pattern, '[filtered]');
  }

  // Collapse runaway whitespace
  s = s.replace(/\s{4,}/g, '   ').trim();

  return s;
};
