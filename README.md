# Metaverso de Trabalho

Mundo 2D no navegador onde pessoas e agentes de IA convivem. Agentes são NPCs posicionados em salas temáticas.

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
  web/            Next.js + React. Phaser fica isolado em src/world
    src/world/    engine/ scenes/ entities/ systems/ (único ponto de entrada: createWorld)
    public/maps/  mapa no formato Tiled JSON + tileset
  api/            NestJS (módulos world e agents, dados em memória por enquanto)
packages/
  contracts/      DTOs compartilhados entre web e api
```

O mundo não conhece agentes de IA: ele recebe entidades com posição, sprite e rótulo.
Quem junta o estado do mapa (`agentId`) com os dados do agente é `apps/web/src/components/WorldView.tsx`.
O Phaser avisa o React por eventos (`nearbyEntityChanged`) só quando algo muda, então o React não re-renderiza a cada frame.

## Mapa

`apps/web/public/maps/office.json` abre direto no [Tiled](https://www.mapeditor.org/).
Tiles com a propriedade `collides = true` bloqueiam o jogador.
O mapa e o tileset placeholder foram gerados por `pnpm --filter @metaverso/web generate:map`; depois que o mapa for editado no Tiled, esse script deixa de ser necessário.

## Fases

1. Mundo: mapa, personagem, movimento, colisões, NPCs ✅
2. Interação: raio de interação (já detectado), tecla E, janela de diálogo
3. IA: AgentService, LLMProvider, conversas com streaming (SSE)
4. Persistência: Postgres
5. Multiplayer: WebSocket + Redis
6. Ferramentas com camada de autorização
