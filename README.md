# Metaverso de Trabalho

Mundo 3D leve no navegador onde pessoas e agentes de IA trabalham juntos. Cada agente é um NPC
numa sala temática: chegue perto e converse.

## Rodando

Requisitos: Node 22 ou mais novo. O yarn 4 vem no próprio repositório (`.yarn/releases`), via Corepack.

```bash
corepack enable
yarn install
yarn dev
```

- Web: http://localhost:3000 (WASD ou setas para andar)
- API: http://localhost:3001 (`GET /world/maps/office`, `GET /agents`)

## Mais

- Regras do repositório: [AGENTS.md](AGENTS.md)
- Arquitetura e qualidade: [docs/architecture.md](docs/architecture.md)
- Decisões: [docs/decisions/README.md](docs/decisions/README.md)
- Próximas fases: [docs/ROADMAP.md](docs/ROADMAP.md)
