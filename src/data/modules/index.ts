import { Module } from '../../types';
import { cliBasicsModule } from './cli-basics';

export const ALL_MODULES: Module[] = [
  cliBasicsModule,
];

export function getModuleById(id: string): Module | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}
