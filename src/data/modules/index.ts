import type { Module } from '../../types';
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
