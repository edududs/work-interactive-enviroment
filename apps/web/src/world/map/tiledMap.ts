// Lê um mapa do Tiled (JSON) e transforma num grid simples para o mundo 3D.
// 1 tile = 1 unidade do mundo. Eixo x do Tiled = x, eixo y do Tiled = z.

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

export interface TileInfo {
  color: string;
  height: number;
  collides: boolean;
}

export interface Block extends TileInfo {
  x: number;
  z: number;
}

export interface GridMap {
  width: number;
  height: number;
  tileSize: number;
  floor: Block[];
  blocks: Block[];
  /** true onde o jogador não pode entrar. Índice = z * width + x. */
  solid: boolean[];
}

/** Tiled grava cores como #AARRGGBB; o three.js quer #RRGGBB. */
const toRgb = (color: string) => '#' + color.replace('#', '').slice(-6);

function readTileInfo(json: TiledJson): Map<number, TileInfo> {
  const info = new Map<number, TileInfo>();
  for (const tileset of json.tilesets) {
    for (const tile of tileset.tiles ?? []) {
      const props = Object.fromEntries((tile.properties ?? []).map((p) => [p.name, p.value]));
      info.set(tileset.firstgid + tile.id, {
        color: toRgb(String(props.color ?? '#ff00ff')),
        height: Number(props.height ?? 0),
        collides: Boolean(props.collides),
      });
    }
  }
  return info;
}

export async function loadTiledMap(url: string): Promise<GridMap> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapa ${url} não carregou: ${res.status}`);
  const json = (await res.json()) as TiledJson;
  const tiles = readTileInfo(json);
  const layer = (name: string) => json.layers.find((l) => l.name === name && l.type === 'tilelayer')?.data ?? [];

  const toBlocks = (data: number[]) =>
    data.flatMap((gid, i) => {
      const t = tiles.get(gid);
      return gid && t ? [{ ...t, x: i % json.width, z: Math.floor(i / json.width) }] : [];
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
