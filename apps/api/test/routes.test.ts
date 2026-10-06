import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { configureHttp } from '../src/http-app.js';

// Routes run with the real composition: Nest, use cases and in-memory adapters, nothing replaced.
describe('HTTP routes', () => {
  let app: INestApplication;
  let server: Parameters<typeof request>[0];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureHttp(app, 'http://localhost:3000');
    await app.init();
    server = app.getHttpServer() as typeof server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the office map with its agents linked by id', async () => {
    const res = await request(server).get('/world/maps/office').expect(200);
    expect(res.body).toMatchObject({
      mapId: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: { x: 5.5, y: 13.5 },
    });
    expect(res.body.entities).toContainEqual({
      id: 'npc-dev',
      type: 'agent',
      position: { x: 6.5, y: 4.5, mapId: 'office' },
      sprite: 'npc-dev',
      agentId: 'dev-ai',
    });
  });

  it('answers 404 for a map that does not exist', async () => {
    const res = await request(server).get('/world/maps/nowhere').expect(404);
    expect(res.body).toEqual({ statusCode: 404, message: 'map nowhere does not exist' });
  });

  it('lists the agents', async () => {
    const res = await request(server).get('/agents').expect(200);
    expect(res.body).toEqual([
      { id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' },
      { id: 'research-ai', name: 'Research AI', role: 'Pesquisa' },
    ]);
  });

  it('returns one agent, or 404', async () => {
    await request(server).get('/agents/dev-ai').expect(200, { id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' });
    await request(server).get('/agents/ghost').expect(404);
  });

  it('allows the web origin', async () => {
    const res = await request(server).get('/agents').set('Origin', 'http://localhost:3000');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });
});
