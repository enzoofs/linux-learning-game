import { useState, useCallback, useRef } from 'react';
import type { TerminalLine } from '../types';

export function useTerminal(initialLines: TerminalLine[] = []) {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback((line: TerminalLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const resetWithLines = useCallback((newLines: TerminalLine[]) => {
    setLines(newLines);
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return {
    lines,
    inputValue,
    setInputValue,
    addLine,
    addLines,
    clearLines,
    resetWithLines,
    focusInput,
    scrollToEnd,
    inputRef,
    endRef,
  };
}
