import { useQuery } from '@tanstack/react-query';
import { fetchGridMap, fetchMapState } from '../adapters/world-gateway';
import type { WorldScene } from '../domain/scene';
import { buildWorldScene } from './world-scene';

export const worldKeys = {
  map: (mapId: string) => ['world', 'map', mapId] as const,
  grid: (url: string) => ['world', 'grid', url] as const,
};

export interface WorldSceneState {
  readonly scene: WorldScene | undefined;
  readonly error: Error | null;
}

/** Headless: loads the map state and its Tiled grid, and turns them into a scene in tiles. */
export function useWorldScene(mapId: string, labelFor: (agentId: string) => string | undefined): WorldSceneState {
  const state = useQuery({ queryKey: worldKeys.map(mapId), queryFn: () => fetchMapState(mapId) });
  const url = state.data?.tilemapUrl;
  const grid = useQuery({
    queryKey: worldKeys.grid(url ?? ''),
    queryFn: () => fetchGridMap(url ?? ''),
    enabled: url !== undefined,
    staleTime: Infinity, // a static asset: it only changes with a deploy
  });

  // The React Compiler memoizes this: the scene is rebuilt only when its inputs change.
  const scene = state.data && grid.data ? buildWorldScene(state.data, grid.data, labelFor) : undefined;
  return { scene, error: state.error ?? grid.error };
}
