import { Module } from '../../types';
import { cliBasicsModule } from './cli-basics';
import { pipesStreamsModule } from './pipes-streams';
import { filesNavigationModule } from './files-navigation';

export const ALL_MODULES: Module[] = [
  cliBasicsModule,
  pipesStreamsModule,
  filesNavigationModule,
];

export function getModuleById(id: string): Module | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}
