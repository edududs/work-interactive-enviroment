# Metaverso de Trabalho

Mundo 3D leve no navegador onde pessoas e agentes de IA convivem. Agentes são NPCs posicionados em salas temáticas.

## Rodando

Requisitos: Node 22+ e pnpm 10.

```bash
pnpm install
pnpm dev
```

- Web: http://localhost:3000 (WASD ou setas para andar)
- API: http://localhost:3001 (`GET /world/maps/office`, `GET /agents`)

## Estrutura

```text
apps/
  web/            Next.js + React. O motor 3D (three.js) fica isolado em src/world
    src/world/    engine/ map/ entities/ systems/ (único ponto de entrada: createWorld)
    public/maps/  layout do mapa no formato Tiled JSON + tileset
  api/            NestJS (módulos world e agents, dados em memória por enquanto)
packages/
  contracts/      DTOs compartilhados entre web e api
```

O mundo não conhece agentes de IA: ele recebe entidades com posição, sprite e rótulo.
Quem junta o estado do mapa (`agentId`) com os dados do agente é `apps/web/src/components/WorldView.tsx`.
O mundo avisa o React por eventos (`nearbyEntityChanged`) só quando algo muda, então o React não re-renderiza a cada frame.

## 3D leve

- three.js puro, sem motor de física: colisão é círculo contra o grid do mapa.
- O mapa inteiro é desenhado com 2 `InstancedMesh` (chão e blocos), então custa 2 draw calls.
- Sem shadow maps (sombra é um disco sob o personagem), pixel ratio limitado a 1.5, câmera fixa de cima.
- Personagens são primitivas low-poly até termos modelos glTF.

## Mapa

O mundo é 3D, mas o layout é um grid 2D editado no [Tiled](https://www.mapeditor.org/): `apps/web/public/maps/office.json`.
Cada tile da camada `walls` vira um bloco 3D usando as propriedades do tileset: `height` (altura em tiles), `color` e `collides`.
O mapa e o tileset placeholder foram gerados por `pnpm --filter @metaverso/web generate:map`; depois que o mapa for editado no Tiled, esse script deixa de ser necessário.

## Fases

1. Mundo: mapa 3D, personagem, movimento, colisões, NPCs ✅
2. Interação: raio de interação (já detectado), tecla E, janela de diálogo
3. IA: AgentService, LLMProvider, conversas com streaming (SSE)
4. Persistência: Postgres
5. Multiplayer: WebSocket + Redis
6. Ferramentas com camada de autorização
