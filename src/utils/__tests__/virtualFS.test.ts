import { describe, it, expect, beforeEach } from 'vitest';
import { VirtualFS } from '../virtualFS';

describe('VirtualFS', () => {
  let fs: VirtualFS;

  beforeEach(() => {
    fs = new VirtualFS();
  });

  // ─── pwd ─────────────────────────────────────────────────────────

  describe('pwd', () => {
    it('returns home directory by default', () => {
      expect(fs.pwd()).toBe('/home/enzo');
    });

    it('reflects directory changes', () => {
      fs.cd('/');
      expect(fs.pwd()).toBe('/');
    });
  });

  // ─── ls ──────────────────────────────────────────────────────────

  describe('ls', () => {
    it('lists directory contents without hidden files', () => {
      const result = fs.ls();
      expect(result.isError).toBe(false);
      expect(result.output).toContain('Desktop');
      expect(result.output).toContain('Documents');
      expect(result.output).toContain('Downloads');
      expect(result.output).toContain('scripts');
      // Should NOT show dotfiles by default
      expect(result.output).not.toContain('.bashrc');
      expect(result.output).not.toContain('.profile');
      expect(result.output).not.toContain('.ssh');
    });

    it('includes dotfiles with -a flag', () => {
      const result = fs.ls(undefined, 'a');
      expect(result.isError).toBe(false);
      expect(result.output).toContain('.bashrc');
      expect(result.output).toContain('.profile');
      expect(result.output).toContain('.ssh');
      expect(result.output).toContain('Desktop');
    });

    it('shows long format with -l flag', () => {
      const result = fs.ls(undefined, 'l');
      expect(result.isError).toBe(false);
      expect(result.output).toContain('drwxr-xr-x');
      expect(result.output).toContain('enzo enzo');
      expect(result.output).toContain('Jan 15 09:00');
      expect(result.output).toContain('Desktop');
    });

    it('handles -la combined flags', () => {
      const result = fs.ls(undefined, 'la');
      expect(result.isError).toBe(false);
      expect(result.output).toContain('.bashrc');
      expect(result.output).toContain('-rw-r--r--');
      expect(result.output).toContain('drwxr-xr-x');
    });

    it('shows error for non-existent path', () => {
      const result = fs.ls('/nonexistent');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Arquivo ou diretório não encontrado');
    });

    it('lists specified directory', () => {
      const result = fs.ls('Documents');
      expect(result.isError).toBe(false);
      expect(result.output).toContain('readme.txt');
    });

    it('lists a single file by name', () => {
      const result = fs.ls('Documents/readme.txt');
      expect(result.isError).toBe(false);
      expect(result.output).toBe('readme.txt');
    });

    it('sorts items alphabetically', () => {
      const result = fs.ls();
      const names = result.output.split('  ');
      const sorted = [...names].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      expect(names).toEqual(sorted);
    });

    it('reverses sort with -r flag', () => {
      const normalResult = fs.ls();
      const reversedResult = fs.ls(undefined, 'r');
      const normalNames = normalResult.output.split('  ');
      const reversedNames = reversedResult.output.split('  ');
      expect(reversedNames).toEqual([...normalNames].reverse());
    });

    it('returns empty string for empty directory', () => {
      const result = fs.ls('Desktop');
      expect(result.isError).toBe(false);
      expect(result.output).toBe('');
    });

    it('shows file size in long format', () => {
      const result = fs.ls('Documents', 'l');
      expect(result.isError).toBe(false);
      // readme.txt has "Bem-vindo ao Linux!" (19 chars)
      expect(result.output).toContain('19');
    });
  });

  // ─── cd ──────────────────────────────────────────────────────────

  describe('cd', () => {
    it('changes to absolute path', () => {
      const result = fs.cd('/home');
      expect(result.isError).toBe(false);
      expect(fs.pwd()).toBe('/home');
    });

    it('changes to relative path', () => {
      const result = fs.cd('Documents');
      expect(result.isError).toBe(false);
      expect(fs.pwd()).toBe('/home/enzo/Documents');
    });

    it('goes up with ..', () => {
      const result = fs.cd('..');
      expect(result.isError).toBe(false);
      expect(fs.pwd()).toBe('/home');
    });

    it('goes home with cd alone', () => {
      fs.cd('/');
      const result = fs.cd();
      expect(result.isError).toBe(false);
      expect(fs.pwd()).toBe('/home/enzo');
    });

    it('goes home with ~', () => {
      fs.cd('/');
      const result = fs.cd('~');
      expect(result.isError).toBe(false);
      expect(fs.pwd()).toBe('/home/enzo');
    });

    it('handles ~/subpath', () => {
      fs.cd('/');
      const result = fs.cd('~/Documents');
      expect(result.isError).toBe(false);
      expect(fs.pwd()).toBe('/home/enzo/Documents');
    });

    it('errors on non-existent directory', () => {
      const result = fs.cd('nonexistent');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Arquivo ou diretório não encontrado');
    });

    it('errors on file path', () => {
      const result = fs.cd('Documents/readme.txt');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Não é um diretório');
    });

    it('goes to root', () => {
      const result = fs.cd('/');
      expect(result.isError).toBe(false);
      expect(fs.pwd()).toBe('/');
    });

    it('handles multiple .. segments', () => {
      fs.cd('Documents');
      fs.cd('../../..');
      expect(fs.pwd()).toBe('/');
    });
  });

  // ─── mkdir ───────────────────────────────────────────────────────

  describe('mkdir', () => {
    it('creates directory in cwd', () => {
      const result = fs.mkdir('projects');
      expect(result.isError).toBe(false);
      const lsResult = fs.ls();
      expect(lsResult.output).toContain('projects');
    });

    it('creates nested directories with -p', () => {
      const result = fs.mkdir('a/b/c', 'p');
      expect(result.isError).toBe(false);
      fs.cd('a/b/c');
      expect(fs.pwd()).toBe('/home/enzo/a/b/c');
    });

    it('errors if already exists without -p', () => {
      const result = fs.mkdir('Desktop');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('já existe');
    });

    it('does not error if already exists with -p', () => {
      const result = fs.mkdir('Desktop', 'p');
      expect(result.isError).toBe(false);
    });

    it('creates directory at absolute path', () => {
      const result = fs.mkdir('/tmp');
      expect(result.isError).toBe(false);
      fs.cd('/tmp');
      expect(fs.pwd()).toBe('/tmp');
    });
  });

  // ─── touch ───────────────────────────────────────────────────────

  describe('touch', () => {
    it('creates empty file', () => {
      const result = fs.touch('newfile.txt');
      expect(result.isError).toBe(false);
      const catResult = fs.cat('newfile.txt');
      expect(catResult.isError).toBe(false);
      expect(catResult.output).toBe('');
    });

    it('does not error on existing file', () => {
      const result = fs.touch('Documents/readme.txt');
      expect(result.isError).toBe(false);
      // Content should remain unchanged
      const catResult = fs.cat('Documents/readme.txt');
      expect(catResult.output).toBe('Bem-vindo ao Linux!');
    });
  });

  // ─── cat ─────────────────────────────────────────────────────────

  describe('cat', () => {
    it('reads file content', () => {
      const result = fs.cat('Documents/readme.txt');
      expect(result.isError).toBe(false);
      expect(result.output).toBe('Bem-vindo ao Linux!');
    });

    it('reads script file content', () => {
      const result = fs.cat('scripts/hello.sh');
      expect(result.isError).toBe(false);
      expect(result.output).toContain("#!/bin/bash");
      expect(result.output).toContain("echo 'Hello World'");
    });

    it('errors on non-existent file', () => {
      const result = fs.cat('nonexistent.txt');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Arquivo ou diretório não encontrado');
    });

    it('errors on directory', () => {
      const result = fs.cat('Documents');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('É um diretório');
    });
  });

  // ─── rm ──────────────────────────────────────────────────────────

  describe('rm', () => {
    it('removes file', () => {
      fs.touch('temp.txt');
      const result = fs.rm('temp.txt');
      expect(result.isError).toBe(false);
      const catResult = fs.cat('temp.txt');
      expect(catResult.isError).toBe(true);
    });

    it('removes directory with -r', () => {
      fs.mkdir('tempdir');
      fs.touch('tempdir/file.txt');
      const result = fs.rm('tempdir', 'r');
      expect(result.isError).toBe(false);
      const cdResult = fs.cd('tempdir');
      expect(cdResult.isError).toBe(true);
    });

    it('errors on directory without -r', () => {
      fs.mkdir('tempdir');
      const result = fs.rm('tempdir');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Não é possível remover diretório sem -r');
    });

    it('errors on non-existent file', () => {
      const result = fs.rm('ghost.txt');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Arquivo ou diretório não encontrado');
    });
  });

  // ─── rmdir ───────────────────────────────────────────────────────

  describe('rmdir', () => {
    it('removes empty directory', () => {
      fs.mkdir('emptydir');
      const result = fs.rmdir('emptydir');
      expect(result.isError).toBe(false);
      const cdResult = fs.cd('emptydir');
      expect(cdResult.isError).toBe(true);
    });

    it('errors on non-empty directory', () => {
      const result = fs.rmdir('Documents');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Diretório não está vazio');
    });

    it('errors on file', () => {
      fs.touch('somefile.txt');
      const result = fs.rmdir('somefile.txt');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Não é um diretório');
    });

    it('errors on non-existent path', () => {
      const result = fs.rmdir('ghost');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Arquivo ou diretório não encontrado');
    });
  });

  // ─── cp and mv ──────────────────────────────────────────────────

  describe('cp and mv', () => {
    it('copies file', () => {
      const result = fs.cp('Documents/readme.txt', 'readme_copy.txt');
      expect(result.isError).toBe(false);
      const catResult = fs.cat('readme_copy.txt');
      expect(catResult.output).toBe('Bem-vindo ao Linux!');
      // Original still exists
      expect(fs.cat('Documents/readme.txt').output).toBe('Bem-vindo ao Linux!');
    });

    it('copies file into directory', () => {
      const result = fs.cp('Documents/readme.txt', 'Desktop');
      expect(result.isError).toBe(false);
      const catResult = fs.cat('Desktop/readme.txt');
      expect(catResult.output).toBe('Bem-vindo ao Linux!');
    });

    it('copies directory with -r', () => {
      const result = fs.cp('Documents', 'Documents_backup', 'r');
      expect(result.isError).toBe(false);
      const catResult = fs.cat('Documents_backup/readme.txt');
      expect(catResult.output).toBe('Bem-vindo ao Linux!');
    });

    it('errors when copying directory without -r', () => {
      const result = fs.cp('Documents', 'Documents_backup');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('É um diretório');
    });

    it('moves/renames file', () => {
      fs.touch('oldname.txt');
      const result = fs.mv('oldname.txt', 'newname.txt');
      expect(result.isError).toBe(false);
      // Old name gone
      expect(fs.cat('oldname.txt').isError).toBe(true);
      // New name exists
      expect(fs.cat('newname.txt').isError).toBe(false);
    });

    it('moves file into directory', () => {
      fs.touch('moveme.txt');
      const result = fs.mv('moveme.txt', 'Desktop');
      expect(result.isError).toBe(false);
      expect(fs.cat('moveme.txt').isError).toBe(true);
      expect(fs.cat('Desktop/moveme.txt').isError).toBe(false);
    });

    it('errors moving non-existent file', () => {
      const result = fs.mv('ghost.txt', 'dest.txt');
      expect(result.isError).toBe(true);
      expect(result.output).toContain('Arquivo ou diretório não encontrado');
    });
  });

  // ─── executeCommand ──────────────────────────────────────────────

  describe('executeCommand', () => {
    it('handles pwd command', () => {
      const result = fs.executeCommand('pwd');
      expect(result.handled).toBe(true);
      expect(result.output).toBe('/home/enzo');
    });

    it('handles ls command', () => {
      const result = fs.executeCommand('ls');
      expect(result.handled).toBe(true);
      expect(result.output).toContain('Desktop');
    });

    it('handles ls -la command', () => {
      const result = fs.executeCommand('ls -la');
      expect(result.handled).toBe(true);
      expect(result.output).toContain('.bashrc');
      expect(result.output).toContain('drwxr-xr-x');
    });

    it('handles ls with path', () => {
      const result = fs.executeCommand('ls Documents');
      expect(result.handled).toBe(true);
      expect(result.output).toContain('readme.txt');
    });

    it('returns handled false for unknown commands', () => {
      const result = fs.executeCommand('whoami');
      expect(result.handled).toBe(false);
      expect(result.output).toBe('');
      expect(result.isError).toBe(false);
    });

    it('returns handled false for empty input', () => {
      const result = fs.executeCommand('');
      expect(result.handled).toBe(false);
    });

    it('handles complex scenario: mkdir then cd then ls', () => {
      const mkdirResult = fs.executeCommand('mkdir projects');
      expect(mkdirResult.handled).toBe(true);
      expect(mkdirResult.isError).toBe(false);

      const cdResult = fs.executeCommand('cd projects');
      expect(cdResult.handled).toBe(true);
      expect(cdResult.isError).toBe(false);

      const pwdResult = fs.executeCommand('pwd');
      expect(pwdResult.output).toBe('/home/enzo/projects');

      // Create a file inside
      fs.executeCommand('touch readme.md');

      const lsResult = fs.executeCommand('ls');
      expect(lsResult.output).toContain('readme.md');
    });

    it('handles mkdir -p with nested paths', () => {
      const result = fs.executeCommand('mkdir -p projects/web/app');
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);

      fs.executeCommand('cd projects/web/app');
      expect(fs.pwd()).toBe('/home/enzo/projects/web/app');
    });

    it('handles rm -r command', () => {
      fs.executeCommand('mkdir tempdir');
      fs.executeCommand('touch tempdir/file.txt');
      const result = fs.executeCommand('rm -r tempdir');
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);
    });

    it('handles cp command', () => {
      const result = fs.executeCommand('cp Documents/readme.txt readme_copy.txt');
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);
      expect(fs.executeCommand('cat readme_copy.txt').output).toBe('Bem-vindo ao Linux!');
    });

    it('handles cp -r command', () => {
      const result = fs.executeCommand('cp -r Documents Documents_backup');
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);
    });

    it('handles mv command', () => {
      fs.executeCommand('touch tempfile.txt');
      const result = fs.executeCommand('mv tempfile.txt renamed.txt');
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);
    });

    it('handles cat command', () => {
      const result = fs.executeCommand('cat Documents/readme.txt');
      expect(result.handled).toBe(true);
      expect(result.output).toBe('Bem-vindo ao Linux!');
    });

    it('handles rmdir command', () => {
      fs.executeCommand('mkdir emptydir');
      const result = fs.executeCommand('rmdir emptydir');
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);
    });

    it('handles touch command', () => {
      const result = fs.executeCommand('touch newfile.txt');
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);
    });

    it('handles quoted arguments', () => {
      const result = fs.executeCommand("touch 'my file.txt'");
      expect(result.handled).toBe(true);
      expect(result.isError).toBe(false);
      expect(fs.executeCommand("cat 'my file.txt'").isError).toBe(false);
    });
  });

  // ─── Path Resolution ────────────────────────────────────────────

  describe('path resolution', () => {
    it('resolves absolute paths', () => {
      expect(fs.resolvePath('/home')).toBe('/home');
    });

    it('resolves relative paths', () => {
      expect(fs.resolvePath('Documents')).toBe('/home/enzo/Documents');
    });

    it('resolves .. correctly', () => {
      expect(fs.resolvePath('..')).toBe('/home');
    });

    it('resolves multiple .. correctly', () => {
      expect(fs.resolvePath('../..')).toBe('/');
    });

    it('handles ~ expansion', () => {
      expect(fs.resolvePath('~')).toBe('/home/enzo');
    });

    it('handles ~/path expansion', () => {
      expect(fs.resolvePath('~/Documents')).toBe('/home/enzo/Documents');
    });

    it('resolves . to cwd', () => {
      expect(fs.resolvePath('.')).toBe('/home/enzo');
    });

    it('normalizes paths with double slashes', () => {
      expect(fs.resolvePath('/home//enzo')).toBe('/home/enzo');
    });

    it('handles .. at root (stays at root)', () => {
      expect(fs.resolvePath('/../../..')).toBe('/');
    });
  });
});
