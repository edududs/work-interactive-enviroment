# Metaverso de Trabalho

Mundo 3D leve no navegador onde pessoas e agentes de IA convivem: cada agente é um NPC numa sala
temática. Monorepo yarn 4 com `apps/web` (Next.js 16 + React Three Fiber), `apps/api` (NestJS 12)
e `packages/contracts` (DTOs compartilhados).

Este arquivo é o único sempre carregado. O resto é sob demanda: [docs/architecture.md](docs/architecture.md),
[docs/decisions/README.md](docs/decisions/README.md) e [docs/ROADMAP.md](docs/ROADMAP.md).

## Regras invioláveis

1. **Idioma.** Código, identificadores, comentários, pastas e nomes de arquivo em inglês. Documentação
   e textos de interface em pt-BR.
2. **Hexágono na API.** `domain/` e `application/` de cada contexto (`world`, `agents`) só importam o
   próprio núcleo e o de `shared/`. Nest, Express e qualquer SDK moram em `adapters/`. O teste
   `apps/api/test/architecture.test.ts` lê as importações e garante isso.
3. **Camadas no front.** `src/features/<feature>/` tem `domain` (só tipos), `app` (comportamento
   headless e hooks), `adapters` (única porta para rede, teclado, formatos de terceiros) e `ui`
   (desenho). Features não se importam; quem compõe é `src/app/`. O teste
   `apps/web/test/architecture.test.ts` e o ESLint garantem isso.
4. **Mundo desacoplado da IA.** O mundo só conhece entidades com `agentId`. Nome, papel e
   comportamento do agente vêm do contexto `agents`.
5. **Dependência externa entra por porta e adaptador.** Trocar fornecedor (banco, LLM) custa um
   adaptador. Todo adaptador de repositório roda a suíte de contrato da sua porta em `apps/api/test/contracts/`.
6. **Leve no navegador.** Nada roda no estado React a cada frame: movimento e câmera ficam em
   `useFrame` com refs. O mapa custa 2 draw calls. Sem shadow maps nem motor de física até haver medição pedindo.
7. **Sem tipos frouxos.** Nunca `any`. Pipeline antes de declarar pronto: `yarn fix` e `yarn check`.
8. **O que foi verificado à mão vira teste no mesmo passo**; bugfix entra com o teste que o reproduz.
9. **Commits.** Conventional Commits, sem trailers (nada de `Co-Authored-By`) e sem citar
   ferramentas usadas na autoria. O hook `commit-msg` recusa o resto. Push só com autorização explícita.
10. **Documentação no mesmo commit.** Decisão nova vira linha em `docs/decisions/README.md`;
    decisão antiga não se edita, se substitui.
11. **Segredos.** Nunca versionar tokens. Arquivos de ambiente ficam fora do repo.

## Comandos

| Para                                                      | Rode               |
| --------------------------------------------------------- | ------------------ |
| Instalar                                                  | `yarn install`     |
| Subir web (3000) e API (3001)                             | `yarn dev`         |
| Formatar, corrigir lint e checar tipos                    | `yarn fix`         |
| Portão rápido (lint, tipos, testes com piso de cobertura) | `yarn check`       |
| Portão pesado (o rápido mais o build)                     | `yarn check:heavy` |
| Ponta a ponta no navegador                                | `yarn e2e`         |
