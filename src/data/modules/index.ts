import type { Module, SandboxCommand } from '../../types';
import { cliBasicsModule } from './cli-basics';
import { pipesStreamsModule } from './pipes-streams';
import { filesNavigationModule } from './files-navigation';
import { processMgmtModule } from './process-mgmt';
import { textProcessingModule } from './text-processing';
import { dataWranglingModule } from './data-wrangling';

export const ALL_MODULES: Module[] = [
  cliBasicsModule,
  pipesStreamsModule,
  filesNavigationModule,
  processMgmtModule,
  textProcessingModule,
  dataWranglingModule,
];

export function getModuleById(id: string): Module | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}

export function getLearnedCommands(completedModuleIds: string[]): SandboxCommand[] {
  const learned: SandboxCommand[] = [];
  for (const moduleId of completedModuleIds) {
    const mod = ALL_MODULES.find(m => m.id === moduleId);
    if (mod) {
      learned.push(...mod.sandbox.commands);
    }
  }
  return learned;
}
