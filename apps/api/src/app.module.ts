import { Module } from '@nestjs/common';
import { AgentsModule } from './modules/agents/agents.module.js';
import { WorldModule } from './modules/world/world.module.js';

@Module({ imports: [WorldModule, AgentsModule] })
export class AppModule {}
