// Virtual Filesystem for CLI Quest
// Simulates a Linux filesystem for sandbox and drill modes

export interface FSNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FSNode[];
}

export interface CommandResult {
  handled: boolean;
  output: string;
  isError: boolean;
}

const DATE_STRING = 'Mar 03 10:00';

function createDefaultFS(): FSNode {
  return {
    name: '/',
    type: 'directory',
    children: [
      {
        name: 'home',
        type: 'directory',
        children: [
          {
            name: 'enzo',
            type: 'directory',
            children: [
              { name: 'Desktop', type: 'directory', children: [] },
              {
                name: 'Documents',
                type: 'directory',
                children: [
                  { name: 'readme.txt', type: 'file', content: 'Bem-vindo ao Linux!' },
                ],
              },
              { name: 'Downloads', type: 'directory', children: [] },
              { name: 'Music', type: 'directory', children: [] },
              { name: 'Pictures', type: 'directory', children: [] },
              {
                name: 'scripts',
                type: 'directory',
                children: [
                  { name: 'hello.sh', type: 'file', content: "#!/bin/bash\necho 'Hello World'" },
                ],
              },
              { name: '.bashrc', type: 'file', content: '# Bash config' },
              { name: '.profile', type: 'file', content: '# Profile config' },
              { name: '.ssh', type: 'directory', children: [] },
            ],
          },
        ],
      },
    ],
  };
}

function deepCloneNode(node: FSNode): FSNode {
  const clone: FSNode = { name: node.name, type: node.type };
  if (node.content !== undefined) clone.content = node.content;
  if (node.children) clone.children = node.children.map(deepCloneNode);
  return clone;
}

export class VirtualFS {
  private root: FSNode;
  private cwd: string;

  constructor(initialFS?: FSNode) {
    this.root = initialFS ? deepCloneNode(initialFS) : createDefaultFS();
    this.cwd = '/home/enzo';
  }

  // ─── Path Utilities ────────────────────────────────────────────────

  resolvePath(path: string): string {
    if (!path || path === '') return this.cwd;

    // Expand ~
    if (path === '~') return '/home/enzo';
    if (path.startsWith('~/')) {
      path = '/home/enzo' + path.slice(1);
    }

    // Make absolute
    let absolute: string;
    if (path.startsWith('/')) {
      absolute = path;
    } else {
      absolute = this.cwd + '/' + path;
    }

    // Normalize: split, resolve . and .., reassemble
    const parts = absolute.split('/').filter((p) => p !== '');
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  private getNode(path: string): FSNode | null {
    const resolved = path.startsWith('/') ? path : this.resolvePath(path);
    if (resolved === '/') return this.root;

    const parts = resolved.split('/').filter((p) => p !== '');
    let current = this.root;
    for (const part of parts) {
      if (current.type !== 'directory' || !current.children) return null;
      const child = current.children.find((c) => c.name === part);
      if (!child) return null;
      current = child;
    }
    return current;
  }

  private getParentAndName(path: string): { parent: FSNode; name: string } | null {
    const resolved = path.startsWith('/') ? path : this.resolvePath(path);
    if (resolved === '/') return null; // root has no parent

    const parts = resolved.split('/').filter((p) => p !== '');
    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== 'directory') return null;
    return { parent, name };
  }

  // ─── Commands ──────────────────────────────────────────────────────

  pwd(): string {
    return this.cwd;
  }

  ls(path?: string, flags?: string): CommandResult {
    const targetPath = path ? this.resolvePath(path) : this.cwd;
    const node = this.getNode(targetPath);

    if (!node) {
      return { handled: true, output: `ls: '${path ?? targetPath}': Arquivo ou diretório não encontrado`, isError: true };
    }

    if (node.type !== 'directory') {
      // ls on a file just shows the file name
      return { handled: true, output: node.name, isError: false };
    }

    const parsedFlags = this.parseFlags(flags ?? '');
    const showHidden = parsedFlags.has('a');
    const longFormat = parsedFlags.has('l');
    const reverseSort = parsedFlags.has('r');
    const sortByTime = parsedFlags.has('t');

    let items = [...(node.children ?? [])];

    // Filter hidden files
    if (!showHidden) {
      items = items.filter((c) => !c.name.startsWith('.'));
    }

    // Sort alphabetically (case-insensitive)
    items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    // -t simulates time sort by reversing (newest first)
    if (sortByTime) {
      items.reverse();
    }

    if (reverseSort) {
      items.reverse();
    }

    if (items.length === 0) {
      return { handled: true, output: '', isError: false };
    }

    if (longFormat) {
      const lines = items.map((item) => {
        const perms = item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
        const size = item.type === 'directory' ? '4096' : String(item.content?.length ?? 0);
        return `${perms}  enzo enzo  ${size.padStart(5)}  ${DATE_STRING}  ${item.name}`;
      });
      return { handled: true, output: lines.join('\n'), isError: false };
    }

    return { handled: true, output: items.map((c) => c.name).join('  '), isError: false };
  }

  cd(path?: string): CommandResult {
    const target = (!path || path === '' || path === '~') ? '/home/enzo' : this.resolvePath(path);
    const node = this.getNode(target);

    if (!node) {
      return { handled: true, output: `cd: '${path ?? ''}': Arquivo ou diretório não encontrado`, isError: true };
    }

    if (node.type !== 'directory') {
      return { handled: true, output: `cd: '${path ?? ''}': Não é um diretório`, isError: true };
    }

    this.cwd = target;
    return { handled: true, output: '', isError: false };
  }

  mkdir(path: string, flags?: string): CommandResult {
    const parsedFlags = this.parseFlags(flags ?? '');
    const recursive = parsedFlags.has('p');
    const resolved = this.resolvePath(path);

    if (recursive) {
      return this.mkdirRecursive(resolved);
    }

    const info = this.getParentAndName(resolved);
    if (!info) {
      return { handled: true, output: `mkdir: '${path}': Caminho inválido`, isError: true };
    }

    const { parent, name } = info;

    // Check if already exists
    const existing = parent.children?.find((c) => c.name === name);
    if (existing) {
      return { handled: true, output: `mkdir: '${path}': Arquivo ou diretório já existe`, isError: true };
    }

    // Check parent exists and is directory (already guaranteed by getParentAndName)
    if (!parent.children) parent.children = [];
    parent.children.push({ name, type: 'directory', children: [] });

    return { handled: true, output: '', isError: false };
  }

  private mkdirRecursive(resolved: string): CommandResult {
    const parts = resolved.split('/').filter((p) => p !== '');
    let current = this.root;

    for (const part of parts) {
      if (!current.children) current.children = [];
      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, type: 'directory', children: [] };
        current.children.push(child);
      } else if (child.type !== 'directory') {
        return { handled: true, output: `mkdir: '${part}': Não é um diretório`, isError: true };
      }
      current = child;
    }

    return { handled: true, output: '', isError: false };
  }

  touch(path: string): CommandResult {
    const resolved = this.resolvePath(path);
    const existing = this.getNode(resolved);

    if (existing) {
      // touch on existing file: just "update" (no-op for us)
      return { handled: true, output: '', isError: false };
    }

    const info = this.getParentAndName(resolved);
    if (!info) {
      return { handled: true, output: `touch: '${path}': Caminho inválido`, isError: true };
    }

    const { parent, name } = info;
    if (!parent.children) parent.children = [];
    parent.children.push({ name, type: 'file', content: '' });

    return { handled: true, output: '', isError: false };
  }

  cat(path: string): CommandResult {
    const resolved = this.resolvePath(path);
    const node = this.getNode(resolved);

    if (!node) {
      return { handled: true, output: `cat: '${path}': Arquivo ou diretório não encontrado`, isError: true };
    }

    if (node.type === 'directory') {
      return { handled: true, output: `cat: '${path}': É um diretório`, isError: true };
    }

    return { handled: true, output: node.content ?? '', isError: false };
  }

  rm(path: string, flags?: string): CommandResult {
    const parsedFlags = this.parseFlags(flags ?? '');
    const recursive = parsedFlags.has('r') || parsedFlags.has('R');
    const resolved = this.resolvePath(path);

    const node = this.getNode(resolved);
    if (!node) {
      return { handled: true, output: `rm: '${path}': Arquivo ou diretório não encontrado`, isError: true };
    }

    if (node.type === 'directory' && !recursive) {
      return { handled: true, output: `rm: '${path}': Não é possível remover diretório sem -r`, isError: true };
    }

    const info = this.getParentAndName(resolved);
    if (!info) {
      return { handled: true, output: `rm: '/': Não é possível remover o diretório raiz`, isError: true };
    }

    const { parent, name } = info;
    parent.children = parent.children?.filter((c) => c.name !== name) ?? [];

    return { handled: true, output: '', isError: false };
  }

  rmdir(path: string): CommandResult {
    const resolved = this.resolvePath(path);
    const node = this.getNode(resolved);

    if (!node) {
      return { handled: true, output: `rmdir: '${path}': Arquivo ou diretório não encontrado`, isError: true };
    }

    if (node.type !== 'directory') {
      return { handled: true, output: `rmdir: '${path}': Não é um diretório`, isError: true };
    }

    if (node.children && node.children.length > 0) {
      return { handled: true, output: `rmdir: '${path}': Diretório não está vazio`, isError: true };
    }

    const info = this.getParentAndName(resolved);
    if (!info) {
      return { handled: true, output: `rmdir: '/': Não é possível remover o diretório raiz`, isError: true };
    }

    const { parent, name } = info;
    parent.children = parent.children?.filter((c) => c.name !== name) ?? [];

    return { handled: true, output: '', isError: false };
  }

  cp(source: string, dest: string, flags?: string): CommandResult {
    const parsedFlags = this.parseFlags(flags ?? '');
    const recursive = parsedFlags.has('r') || parsedFlags.has('R');

    const resolvedSource = this.resolvePath(source);
    const sourceNode = this.getNode(resolvedSource);

    if (!sourceNode) {
      return { handled: true, output: `cp: '${source}': Arquivo ou diretório não encontrado`, isError: true };
    }

    if (sourceNode.type === 'directory' && !recursive) {
      return { handled: true, output: `cp: '${source}': É um diretório (use -r para copiar diretórios)`, isError: true };
    }

    const resolvedDest = this.resolvePath(dest);
    const destNode = this.getNode(resolvedDest);

    // If destination is an existing directory, copy into it
    if (destNode && destNode.type === 'directory') {
      const clone = deepCloneNode(sourceNode);
      if (!destNode.children) destNode.children = [];
      // Remove existing child with same name
      destNode.children = destNode.children.filter((c) => c.name !== clone.name);
      destNode.children.push(clone);
      return { handled: true, output: '', isError: false };
    }

    // Otherwise, copy to new name
    const destInfo = this.getParentAndName(resolvedDest);
    if (!destInfo) {
      return { handled: true, output: `cp: '${dest}': Caminho inválido`, isError: true };
    }

    const { parent: destParent, name: destName } = destInfo;
    const clone = deepCloneNode(sourceNode);
    clone.name = destName;
    if (!destParent.children) destParent.children = [];
    // Remove existing child with same name
    destParent.children = destParent.children.filter((c) => c.name !== destName);
    destParent.children.push(clone);

    return { handled: true, output: '', isError: false };
  }

  mv(source: string, dest: string): CommandResult {
    const resolvedSource = this.resolvePath(source);
    const sourceNode = this.getNode(resolvedSource);

    if (!sourceNode) {
      return { handled: true, output: `mv: '${source}': Arquivo ou diretório não encontrado`, isError: true };
    }

    const resolvedDest = this.resolvePath(dest);
    const destNode = this.getNode(resolvedDest);

    // If destination is an existing directory, move into it
    if (destNode && destNode.type === 'directory') {
      const clone = deepCloneNode(sourceNode);
      if (!destNode.children) destNode.children = [];
      destNode.children = destNode.children.filter((c) => c.name !== clone.name);
      destNode.children.push(clone);

      // Remove from source
      const sourceInfo = this.getParentAndName(resolvedSource);
      if (sourceInfo) {
        sourceInfo.parent.children = sourceInfo.parent.children?.filter((c) => c.name !== sourceInfo.name) ?? [];
      }
      return { handled: true, output: '', isError: false };
    }

    // Otherwise, rename/move to new path
    const destInfo = this.getParentAndName(resolvedDest);
    if (!destInfo) {
      return { handled: true, output: `mv: '${dest}': Caminho inválido`, isError: true };
    }

    // Remove from source parent
    const sourceInfo = this.getParentAndName(resolvedSource);
    if (!sourceInfo) {
      return { handled: true, output: `mv: '${source}': Caminho inválido`, isError: true };
    }

    sourceInfo.parent.children = sourceInfo.parent.children?.filter((c) => c.name !== sourceInfo.name) ?? [];

    // Add to dest parent
    const clone = deepCloneNode(sourceNode);
    clone.name = destInfo.name;
    if (!destInfo.parent.children) destInfo.parent.children = [];
    destInfo.parent.children = destInfo.parent.children.filter((c) => c.name !== destInfo.name);
    destInfo.parent.children.push(clone);

    return { handled: true, output: '', isError: false };
  }

  // ─── Command Dispatcher ────────────────────────────────────────────

  executeCommand(input: string): CommandResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return { handled: false, output: '', isError: false };
    }

    const tokens = this.tokenize(trimmed);
    const command = tokens[0];
    const args = tokens.slice(1);

    switch (command) {
      case 'pwd':
        return { handled: true, output: this.pwd(), isError: false };

      case 'ls':
        return this.executeLs(args);

      case 'cd':
        return this.cd(args[0]);

      case 'mkdir':
        return this.executeMkdir(args);

      case 'touch':
        if (args.length === 0) {
          return { handled: true, output: "touch: operando faltando", isError: true };
        }
        return this.touch(args[0]);

      case 'cat':
        if (args.length === 0) {
          return { handled: true, output: "cat: operando faltando", isError: true };
        }
        return this.cat(args[0]);

      case 'rm':
        return this.executeRm(args);

      case 'rmdir':
        if (args.length === 0) {
          return { handled: true, output: "rmdir: operando faltando", isError: true };
        }
        return this.rmdir(args[0]);

      case 'cp':
        return this.executeCp(args);

      case 'mv':
        if (args.length < 2) {
          return { handled: true, output: "mv: operando faltando", isError: true };
        }
        return this.mv(args[args.length - 2], args[args.length - 1]);

      default:
        return { handled: false, output: '', isError: false };
    }
  }

  // ─── Argument Parsers for Complex Commands ─────────────────────────

  private executeLs(args: string[]): CommandResult {
    let flags = '';
    let path: string | undefined;

    for (const arg of args) {
      if (arg.startsWith('-')) {
        flags += arg.slice(1);
      } else {
        path = arg;
      }
    }

    return this.ls(path, flags);
  }

  private executeMkdir(args: string[]): CommandResult {
    let flags = '';
    const paths: string[] = [];

    for (const arg of args) {
      if (arg.startsWith('-')) {
        flags += arg.slice(1);
      } else {
        paths.push(arg);
      }
    }

    if (paths.length === 0) {
      return { handled: true, output: "mkdir: operando faltando", isError: true };
    }

    // Create all requested directories
    for (const p of paths) {
      const result = this.mkdir(p, flags);
      if (result.isError) return result;
    }

    return { handled: true, output: '', isError: false };
  }

  private executeRm(args: string[]): CommandResult {
    let flags = '';
    const paths: string[] = [];

    for (const arg of args) {
      if (arg.startsWith('-')) {
        flags += arg.slice(1);
      } else {
        paths.push(arg);
      }
    }

    if (paths.length === 0) {
      return { handled: true, output: "rm: operando faltando", isError: true };
    }

    for (const p of paths) {
      const result = this.rm(p, flags);
      if (result.isError) return result;
    }

    return { handled: true, output: '', isError: false };
  }

  private executeCp(args: string[]): CommandResult {
    let flags = '';
    const paths: string[] = [];

    for (const arg of args) {
      if (arg.startsWith('-')) {
        flags += arg.slice(1);
      } else {
        paths.push(arg);
      }
    }

    if (paths.length < 2) {
      return { handled: true, output: "cp: operando faltando", isError: true };
    }

    return this.cp(paths[0], paths[1], flags);
  }

  // ─── Helpers ───────────────────────────────────────────────────────

  private parseFlags(flagStr: string): Set<string> {
    const flags = new Set<string>();
    for (const ch of flagStr) {
      flags.add(ch);
    }
    return flags;
  }

  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if (ch === "'" && !inDoubleQuote) {
        inSingleQuote = !inSingleQuote;
        continue;
      }

      if (ch === '"' && !inSingleQuote) {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }

      if (ch === ' ' && !inSingleQuote && !inDoubleQuote) {
        if (current) {
          tokens.push(current);
          current = '';
        }
        continue;
      }

      current += ch;
    }

    if (current) {
      tokens.push(current);
    }

    return tokens;
  }
}
