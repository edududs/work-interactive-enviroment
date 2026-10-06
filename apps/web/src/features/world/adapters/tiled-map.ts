import type { Block, GridMap, TileInfo } from '../domain/grid-map';

// Tiled JSON is a third-party format: it is read here and nowhere else.

interface TiledProperty {
  name: string;
  value: unknown;
}

interface TiledJson {
  width: number;
  height: number;
  tilewidth: number;
  layers: { name: string; type: string; data?: number[] }[];
  tilesets: { firstgid: number; tiles?: { id: number; properties?: TiledProperty[] }[] }[];
}

function isTiledJson(value: unknown): value is TiledJson {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.width === 'number' &&
    typeof v.height === 'number' &&
    typeof v.tilewidth === 'number' &&
    Array.isArray(v.layers) &&
    Array.isArray(v.tilesets)
  );
}

/** Tiled writes colors as #AARRGGBB; three.js wants #RRGGBB. */
const toRgb = (color: string) => '#' + color.replace('#', '').slice(-6);

function readTileInfo(json: TiledJson): Map<number, TileInfo> {
  const info = new Map<number, TileInfo>();
  for (const tileset of json.tilesets) {
    for (const tile of tileset.tiles ?? []) {
      const props = new Map((tile.properties ?? []).map((p) => [p.name, p.value]));
      const color = props.get('color');
      info.set(tileset.firstgid + tile.id, {
        color: toRgb(typeof color === 'string' ? color : '#ff00ff'),
        height: Number(props.get('height') ?? 0),
        collides: props.get('collides') === true,
      });
    }
  }
  return info;
}

export function parseTiledMap(value: unknown): GridMap {
  if (!isTiledJson(value)) throw new Error('arquivo de mapa não está no formato JSON do Tiled');
  const json = value;
  const tiles = readTileInfo(json);
  const layer = (name: string) => json.layers.find((l) => l.name === name && l.type === 'tilelayer')?.data ?? [];

  const toBlocks = (data: readonly number[]): Block[] =>
    data.flatMap((gid, i) => {
      const t = tiles.get(gid);
      return t ? [{ ...t, x: i % json.width, z: Math.floor(i / json.width) }] : [];
    });

  const blocks = toBlocks(layer('walls'));
  const solid = new Array<boolean>(json.width * json.height).fill(false);
  for (const b of blocks) if (b.collides) solid[b.z * json.width + b.x] = true;

  return {
    width: json.width,
    height: json.height,
    tileSize: json.tilewidth,
    floor: toBlocks(layer('ground')),
    blocks,
    solid,
  };
}
