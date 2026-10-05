import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// The hexagon holds because this test reads every import, not because of discipline:
// domain and application import only their own core (and shared's), never a framework,
// an SDK or another context.

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src');
type Layer = 'domain' | 'application';
const ALLOWED: Record<Layer, readonly Layer[]> = { domain: ['domain'], application: ['domain', 'application'] };

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return path.endsWith('.ts') && !path.endsWith('.test.ts') ? [path] : [];
  });
}

/** Context and layer of a file under src, e.g. ["world", "domain"]. */
function locate(file: string): [string, string] | undefined {
  const [context, layer] = relative(SRC, file).split(sep);
  return context && layer ? [context, layer] : undefined;
}

export function violations(file: string, imports: readonly string[]): string[] {
  const where = locate(file);
  if (!where) return [];
  const [context, layer] = where;
  if (layer !== 'domain' && layer !== 'application') return [];
  const allowed = ALLOWED[layer];
  return imports.flatMap((spec) => {
    if (!spec.startsWith('.')) return [`${spec}: no package may enter ${layer}`];
    const target = locate(resolve(dirname(file), spec));
    if (!target) return [`${spec}: points outside a context`];
    const [targetContext, targetLayer] = target;
    const sameCore = targetContext === context || targetContext === 'shared';
    return sameCore && (allowed as readonly string[]).includes(targetLayer)
      ? []
      : [`${spec}: ${layer} cannot reach ${targetContext}/${targetLayer}`];
  });
}

const importsOf = (file: string) =>
  ts.preProcessFile(readFileSync(file, 'utf8'), true, true).importedFiles.map((f) => f.fileName);

describe('architecture', () => {
  it('keeps domain and application free of frameworks and of other contexts', () => {
    const found = sourceFiles(SRC).flatMap((file) =>
      violations(file, importsOf(file)).map((v) => `${relative(SRC, file)} -> ${v}`),
    );
    expect(found).toEqual([]);
  });

  it('catches the imports it is meant to refuse', () => {
    const file = join(SRC, 'world/domain/x.ts');
    expect(violations(file, ['@nestjs/common'])).toHaveLength(1);
    expect(violations(file, ['../application/get-world-map.js'])).toHaveLength(1);
    expect(violations(file, ['../../agents/domain/agent.js'])).toHaveLength(1);
    expect(violations(file, ['./position.js', '../../shared/domain/invariant.js'])).toEqual([]);
    expect(violations(join(SRC, 'world/application/x.ts'), ['../../shared/application/errors.js'])).toEqual([]);
    expect(violations(join(SRC, 'world/adapters/x.ts'), ['@nestjs/common'])).toEqual([]);
  });
});
