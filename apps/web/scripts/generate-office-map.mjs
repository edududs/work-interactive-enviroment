// Gera o mapa inicial (formato Tiled JSON) e um tileset PNG placeholder.
// O mundo é 3D, mas o layout continua sendo um grid 2D editável no Tiled:
// cada tile da camada "walls" vira um bloco com a altura e a cor definidas nas propriedades do tileset.
// Abra public/maps/office.json no Tiled para editar; depois disso este script vira opcional.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const TILE = 32;
const W = 30;
const H = 16;

// Índices do tileset (firstgid = 1).
const T = { FLOOR: 1, WALL: 2, DEV_FLOOR: 3, LIB_FLOOR: 4, DESK: 5, SHELF: 6 };
const TILE_COLORS = {
  [T.FLOOR]: [[214, 204, 186], [200, 190, 172]],
  [T.WALL]: [[70, 74, 92], [52, 55, 70]],
  [T.DEV_FLOOR]: [[160, 196, 214], [146, 182, 200]],
  [T.LIB_FLOOR]: [[196, 170, 140], [180, 154, 124]],
  [T.DESK]: [[132, 92, 60], [100, 68, 44]],
  [T.SHELF]: [[96, 60, 40], [170, 60, 60]],
};
const COLLIDES = new Set([T.WALL, T.DESK, T.SHELF]);
// Altura (em tiles) com que cada tile é extrudado no mundo 3D. 0 = chão.
const HEIGHT = { [T.WALL]: 1.1, [T.DESK]: 0.45, [T.SHELF]: 1.3 };
const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

// --- Layout --------------------------------------------------------------
const ground = [];
const walls = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let g = T.FLOOR;
    if (y >= 1 && y <= 7 && x >= 1 && x <= 13) g = T.DEV_FLOOR; // Sala de desenvolvimento
    if (y >= 1 && y <= 7 && x >= 16 && x <= 28) g = T.LIB_FLOOR; // Biblioteca
    ground.push(g);

    let w = 0;
    const border = x === 0 || y === 0 || x === W - 1 || y === H - 1;
    const roomBottom = y === 8 && x !== 6 && x !== 7 && x !== 22 && x !== 23; // portas
    const divider = y <= 8 && (x === 14 || x === 15);
    if (border || roomBottom || divider) w = T.WALL;
    // Mesas na sala dev e estantes na biblioteca
    if ((y === 3 || y === 6) && [2, 3, 10, 11].includes(x)) w = T.DESK;
    if ((y === 2 || y === 5) && [17, 18, 19, 25, 26, 27].includes(x)) w = T.SHELF;
    // Mesa de reunião no saguão
    if (y >= 11 && y <= 12 && x >= 13 && x <= 16) w = T.DESK;
    walls.push(w);
  }
}

const map = {
  type: 'map',
  version: '1.10',
  tiledversion: '1.11.0',
  orientation: 'orthogonal',
  renderorder: 'right-down',
  infinite: false,
  width: W,
  height: H,
  tilewidth: TILE,
  tileheight: TILE,
  nextlayerid: 3,
  nextobjectid: 1,
  layers: [
    { id: 1, name: 'ground', type: 'tilelayer', width: W, height: H, x: 0, y: 0, opacity: 1, visible: true, data: ground },
    { id: 2, name: 'walls', type: 'tilelayer', width: W, height: H, x: 0, y: 0, opacity: 1, visible: true, data: walls },
  ],
  tilesets: [
    {
      firstgid: 1,
      name: 'office',
      image: 'office-tiles.png',
      imagewidth: TILE * Object.keys(TILE_COLORS).length,
      imageheight: TILE,
      tilewidth: TILE,
      tileheight: TILE,
      tilecount: Object.keys(TILE_COLORS).length,
      columns: Object.keys(TILE_COLORS).length,
      margin: 0,
      spacing: 0,
      // Propriedades por tile: o mundo 3D lê cor, altura e colisão daqui.
      tiles: Object.keys(TILE_COLORS).map(Number).map((gid) => ({
        id: gid - 1,
        properties: [
          { name: 'collides', type: 'bool', value: COLLIDES.has(gid) },
          { name: 'height', type: 'float', value: HEIGHT[gid] ?? 0 },
          { name: 'color', type: 'color', value: hex(TILE_COLORS[gid][gid === T.SHELF ? 1 : 0]) },
        ],
      })),
    },
  ],
};
writeFileSync(new URL('../public/maps/office.json', import.meta.url), JSON.stringify(map));

// --- Tileset PNG ---------------------------------------------------------
const ids = Object.keys(TILE_COLORS).map(Number);
const imgW = TILE * ids.length;
const raw = Buffer.alloc((imgW * 4 + 1) * TILE);
for (let y = 0; y < TILE; y++) {
  raw[y * (imgW * 4 + 1)] = 0; // filtro "none"
  for (let x = 0; x < imgW; x++) {
    const id = ids[Math.floor(x / TILE)];
    const [base, accent] = TILE_COLORS[id];
    const lx = x % TILE;
    let c = base;
    if (id === T.WALL && (y % 16 === 0 || (lx + (y < 16 ? 0 : 16)) % 32 === 0)) c = accent; // tijolos
    else if (id === T.SHELF && y % 10 > 2 && y % 10 < 9 && lx > 2 && lx < 29 && lx % 6 !== 0) c = accent; // livros
    else if (id === T.DESK && (lx < 2 || lx > 29 || y < 2 || y > 29)) c = accent;
    else if ((id === T.FLOOR || id === T.DEV_FLOOR || id === T.LIB_FLOOR) && (lx === 0 || y === 0)) c = accent;
    const o = y * (imgW * 4 + 1) + 1 + x * 4;
    raw[o] = c[0];
    raw[o + 1] = c[1];
    raw[o + 2] = c[2];
    raw[o + 3] = 255;
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(imgW, 0);
ihdr.writeUInt32BE(TILE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync(new URL('../public/maps/office-tiles.png', import.meta.url), png);
console.log('Mapa gerado em public/maps/office.json');
