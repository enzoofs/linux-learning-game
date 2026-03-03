import { describe, it, expect } from 'vitest';
import { cliBasicsModule } from '../cli-basics';

describe('CLI Basics module', () => {
  it('has correct id and metadata', () => {
    expect(cliBasicsModule.id).toBe('cli-basics');
    expect(cliBasicsModule.tier).toBe('Recruit');
    expect(cliBasicsModule.prerequisites).toEqual([]);
    expect(cliBasicsModule.isSideQuest).toBe(false);
  });

  it('has a complete briefing', () => {
    expect(cliBasicsModule.briefing.concept).toBeTruthy();
    expect(cliBasicsModule.briefing.analogy).toBeTruthy();
    expect(cliBasicsModule.briefing.syntax).toBeTruthy();
    expect(cliBasicsModule.briefing.examples.length).toBeGreaterThan(0);
  });

  it('has sandbox commands that produce output', () => {
    expect(cliBasicsModule.sandbox.commands.length).toBeGreaterThan(0);
    for (const cmd of cliBasicsModule.sandbox.commands) {
      expect(cmd.pattern).toBeInstanceOf(RegExp);
      expect(typeof cmd.output).toBe('string');
    }
  });

  it('has 3-5 drills with increasing difficulty', () => {
    const drills = cliBasicsModule.drills;
    expect(drills.length).toBeGreaterThanOrEqual(3);
    expect(drills.length).toBeLessThanOrEqual(5);
    expect(drills[0].difficulty).toBe('easy');
    expect(drills[drills.length - 1].difficulty).toBe('hard');
  });

  it('drill checks accept correct commands', () => {
    const drills = cliBasicsModule.drills;
    expect(drills[0].check('pwd')).toBe(true);
  });

  it('has a boss challenge with multiple steps', () => {
    expect(cliBasicsModule.boss.steps.length).toBeGreaterThanOrEqual(2);
    expect(cliBasicsModule.boss.xpReward).toBeGreaterThan(0);
  });
});
