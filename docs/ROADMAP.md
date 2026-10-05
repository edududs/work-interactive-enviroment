# Roadmap

1. **Mundo** ✅ mapa 3D, personagem, movimento, colisões, NPCs, aviso de proximidade.
2. **Interação**: tecla E perto de um NPC abre a janela de conversa.
3. **IA**: `LLMProvider` como porta no contexto `agents`, conversas e mensagens, resposta em streaming
   (lida com `fetch`, porque o `EventSource` só faz GET).
4. **Persistência**: Postgres como adaptador das portas existentes, rodando as mesmas suítes de contrato.
5. **Multiplayer**: WebSocket, presença e posições em Redis, 10 a 20 atualizações por segundo com interpolação.
6. **Ferramentas**: agentes executam ações externas por uma camada de autorização explícita.
