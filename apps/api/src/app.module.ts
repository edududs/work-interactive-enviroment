import { Module } from '@nestjs/common';
import { AgentsModule } from './agents/adapters/agents.module.js';
import { WorldModule } from './world/adapters/world.module.js';

@Module({ imports: [WorldModule, AgentsModule] })
export class AppModule {}
