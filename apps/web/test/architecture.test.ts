import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// Feature layers, read from the imports themselves (docs/architecture.md):
// domain is pure types; app is headless behavior; adapters are the only door to the outside;
// ui draws and consumes app. Features never import each other; src/app composes them.

const SRC = resolve(process.cwd(), 'src');
type Layer = 'domain' | 'app' | 'adapters' | 'ui';
const ALLOWED: Record<Layer, readonly Layer[]> = {
  domain: ['domain'],
  adapters: ['domain', 'adapters'],
  app: ['domain', 'app', 'adapters'],
  ui: ['domain', 'app', 'ui'],
};
const LAYERS = new Set<string>(Object.keys(ALLOWED));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(path) && !/\.(test|fixture)\.tsx?$/.test(path) ? [path] : [];
  });
}

type Place = { kind: 'feature'; feature: string; layer: Layer } | { kind: 'shared'; layer: string } | { kind: 'other' };

function locate(file: string): Place {
  const parts = relative(SRC, file).split(sep);
  if (parts[0] === 'features' && parts[1] && parts[2] && LAYERS.has(parts[2])) {
    return { kind: 'feature', feature: parts[1], layer: parts[2] as Layer };
  }
  if (parts[0] === 'shared' && parts[1]) return { kind: 'shared', layer: parts[1] };
  return { kind: 'other' };
}

export function violations(file: string, imports: readonly string[]): string[] {
  const from = locate(file);
  if (from.kind !== 'feature') return [];
  return imports.flatMap((spec) => {
    const isLocal = spec.startsWith('.') || spec.startsWith('@/');
    if (!isLocal) return from.layer === 'domain' ? [`${spec}: domain is pure types, no packages`] : [];
    const target = locate(spec.startsWith('@/') ? join(SRC, spec.slice(2)) : resolve(dirname(file), spec));
    if (target.kind === 'shared') {
      return from.layer === 'domain' ||
        (target.layer === 'adapters' && from.layer !== 'adapters' && from.layer !== 'app')
        ? [`${spec}: ${from.layer} cannot reach shared/${target.layer}`]
        : [];
    }
    if (target.kind !== 'feature') return [`${spec}: features never import the app routes`];
    if (target.feature !== from.feature) return [`${spec}: features never import each other`];
    return ALLOWED[from.layer].includes(target.layer) ? [] : [`${spec}: ${from.layer} cannot reach ${target.layer}`];
  });
}

const importsOf = (file: string) =>
  ts.preProcessFile(readFileSync(file, 'utf8'), true, true).importedFiles.map((f) => f.fileName);

describe('architecture', () => {
  it('keeps every feature layer inside its boundaries', () => {
    const found = sourceFiles(SRC).flatMap((file) =>
      violations(file, importsOf(file)).map((v) => `${relative(SRC, file)} -> ${v}`),
    );
    expect(found).toEqual([]);
  });

  it('catches the imports it is meant to refuse', () => {
    const at = (path: string) => join(SRC, 'features/world', path);
    expect(violations(at('domain/x.ts'), ['three'])).toHaveLength(1);
    expect(violations(at('domain/x.ts'), ['../app/movement'])).toHaveLength(1);
    expect(violations(at('ui/x.tsx'), ['../adapters/world-gateway'])).toHaveLength(1);
    expect(violations(at('adapters/x.ts'), ['../app/movement'])).toHaveLength(1);
    expect(violations(at('app/x.ts'), ['@/features/agents/app/use-agents'])).toHaveLength(1);
    expect(violations(at('ui/x.tsx'), ['@/shared/adapters/http'])).toHaveLength(1);
    expect(violations(at('app/x.ts'), ['../adapters/world-gateway', '../domain/scene', 'react'])).toEqual([]);
    expect(violations(at('adapters/x.ts'), ['@/shared/adapters/http', '@metaverso/contracts'])).toEqual([]);
    expect(violations(join(SRC, 'app/office-page.tsx'), ['@/features/agents/app/use-agents'])).toEqual([]);
  });
});
