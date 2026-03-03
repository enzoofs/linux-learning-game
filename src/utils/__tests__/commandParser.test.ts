import { describe, it, expect } from 'vitest';
import { analyzeCommand } from '../commandParser';
import type { DrillFeedbackRule } from '../../types';

describe('analyzeCommand', () => {
  const feedbackRules: DrillFeedbackRule[] = [
    { pattern: /^grep\s+-l/i, message: 'Close! -l lists files, but here we need to see the matching lines. Try without -l.' },
    { pattern: /^grep\s+[^'"]error/i, message: "Almost! Wrap the search term in quotes: grep 'error' log.txt" },
    { pattern: /^find/i, message: "Good instinct, but this challenge uses grep, not find." },
  ];

  const check = (cmd: string) => /^grep\s+(-i\s+)?['"]?error['"]?\s+log\.txt$/.test(cmd.trim());

  it('returns success for correct command', () => {
    const result = analyzeCommand("grep 'error' log.txt", check, feedbackRules);
    expect(result.type).toBe('success');
  });

  it('returns specific feedback when a rule matches', () => {
    const result = analyzeCommand('grep -l error log.txt', check, feedbackRules);
    expect(result.type).toBe('feedback');
    expect(result.message).toContain('-l lists files');
  });

  it('returns typo suggestion for close matches', () => {
    const result = analyzeCommand("grepp 'error' log.txt", check, []);
    expect(result.type).toBe('typo');
    expect(result.message).toContain('grep');
  });

  it('returns generic error for completely wrong commands', () => {
    const result = analyzeCommand('echo hello world', check, []);
    expect(result.type).toBe('error');
  });

  it('detects empty input', () => {
    const result = analyzeCommand('', check, []);
    expect(result.type).toBe('empty');
  });
});
