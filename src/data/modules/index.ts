import type { Module, SandboxCommand } from '../../types';
import { cliBasicsModule } from './cli-basics';
import { pipesStreamsModule } from './pipes-streams';
import { filesNavigationModule } from './files-navigation';
import { processMgmtModule } from './process-mgmt';
import { textProcessingModule } from './text-processing';
import { dataWranglingModule } from './data-wrangling';
import { systemAdminModule } from './system-admin';
import { oneLinerLegendModule } from './one-liner-legend';
// Secret Book modules
import { sbShellTricksModule } from './sb-shell-tricks';
import { sbShellFunctionsModule } from './sb-shell-functions';
import { sbAdvancedFindModule } from './sb-advanced-find';
import { sbPermissionsModule } from './sb-permissions';
import { sbVimModule } from './sb-vim';
import { sbTmuxModule } from './sb-tmux';
import { sbCurlModule } from './sb-curl';
import { sbSshModule } from './sb-ssh';
import { sbDiskModule } from './sb-disk';
import { sbNetworkingModule } from './sb-networking';
import { sbGitModule } from './sb-git';
import { sbMonitoringModule } from './sb-monitoring';
import { sbCronModule } from './sb-cron';
import { sbLogsModule } from './sb-logs';
import { sbDockerModule } from './sb-docker';
import { sbPackagesModule } from './sb-packages';
import { sbOnelinersModule } from './sb-oneliners';
import { sbHardeningModule } from './sb-hardening';

export const ALL_MODULES: Module[] = [
  cliBasicsModule,
  pipesStreamsModule,
  filesNavigationModule,
  processMgmtModule,
  textProcessingModule,
  dataWranglingModule,
  systemAdminModule,
  oneLinerLegendModule,
  // Secret Book modules
  sbShellTricksModule,
  sbShellFunctionsModule,
  sbAdvancedFindModule,
  sbPermissionsModule,
  sbVimModule,
  sbTmuxModule,
  sbCurlModule,
  sbSshModule,
  sbDiskModule,
  sbNetworkingModule,
  sbGitModule,
  sbMonitoringModule,
  sbCronModule,
  sbLogsModule,
  sbDockerModule,
  sbPackagesModule,
  sbOnelinersModule,
  sbHardeningModule,
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
