import type { DrillFeedbackRule } from '../types';

export type FeedbackType = 'success' | 'feedback' | 'typo' | 'error' | 'empty';

export interface FeedbackResult {
  type: FeedbackType;
  message: string;
}

const KNOWN_COMMANDS = [
  'ls', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 'cat', 'head', 'tail',
  'grep', 'find', 'sed', 'awk', 'sort', 'uniq', 'cut', 'wc', 'echo', 'type',
  'alias', 'history', 'pstree', 'ps', 'kill', 'nohup', 'chmod', 'chown', 'df',
  'du', 'ss', 'curl', 'wget', 'tar', 'gzip', 'man', 'which', 'touch', 'less',
  'more', 'diff', 'xargs', 'tee', 'tr',
];

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[a.length][b.length];
}

function findTypo(input: string): string | null {
  const firstWord = input.trim().split(/\s+/)[0].toLowerCase();
  if (KNOWN_COMMANDS.includes(firstWord)) return null;

  let bestMatch = '';
  let bestDistance = Infinity;

  for (const cmd of KNOWN_COMMANDS) {
    const dist = levenshtein(firstWord, cmd);
    if (dist < bestDistance && dist <= 2) {
      bestDistance = dist;
      bestMatch = cmd;
    }
  }

  return bestMatch || null;
}

export function analyzeCommand(
  input: string,
  check: (cmd: string) => boolean,
  feedbackRules: DrillFeedbackRule[]
): FeedbackResult {
  const cmd = input.trim();

  if (!cmd) {
    return { type: 'empty', message: '' };
  }

  if (check(cmd)) {
    return { type: 'success', message: '' };
  }

  // Check specific feedback rules first
  for (const rule of feedbackRules) {
    if (rule.pattern.test(cmd)) {
      return { type: 'feedback', message: rule.message };
    }
  }

  // Check for typos
  const typoSuggestion = findTypo(cmd);
  if (typoSuggestion) {
    const firstWord = cmd.split(/\s+/)[0];
    return {
      type: 'typo',
      message: `Você quis dizer \`${typoSuggestion}\`? Você digitou \`${firstWord}\`.`,
    };
  }

  return {
    type: 'error',
    message: "Não é bem isso. Digite 'hint' para uma dica.",
  };
}
