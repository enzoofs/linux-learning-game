import { describe, it, expect } from 'vitest';
import { getLearnedCommands, getModuleById, ALL_MODULES } from '../index';

describe('modules index', () => {
  it('getModuleById returns correct module', () => {
    const mod = getModuleById('cli-basics');
    expect(mod).toBeDefined();
    expect(mod!.id).toBe('cli-basics');
  });

  it('getModuleById returns undefined for unknown id', () => {
    expect(getModuleById('nonexistent')).toBeUndefined();
  });

  it('getLearnedCommands returns empty for no completed modules', () => {
    expect(getLearnedCommands([])).toEqual([]);
  });

  it('getLearnedCommands returns commands from completed modules only', () => {
    const commands = getLearnedCommands(['cli-basics']);
    expect(commands.length).toBeGreaterThan(0);
    // Should contain cli-basics sandbox commands
    const hasLs = commands.some(c => c.pattern.test('ls'));
    expect(hasLs).toBe(true);
  });

  it('getLearnedCommands ignores unknown module ids', () => {
    const commands = getLearnedCommands(['nonexistent']);
    expect(commands).toEqual([]);
  });

  it('getLearnedCommands combines commands from multiple modules', () => {
    const single = getLearnedCommands(['cli-basics']);
    const double = getLearnedCommands(['cli-basics', 'pipes-streams']);
    expect(double.length).toBeGreaterThan(single.length);
  });
});
