import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as agentsGateway from '@/features/agents/adapters/agents-gateway';
import * as worldGateway from '@/features/world/adapters/world-gateway';
import { gridFrom } from '@/features/world/app/grid.fixture';
import type { WorldCanvasProps } from '@/features/world/ui/world-canvas';
import { OfficePage } from './office-page';
import { Providers } from './providers';

vi.mock('@/features/agents/adapters/agents-gateway');
vi.mock('@/features/world/adapters/world-gateway');

let canvas: WorldCanvasProps | undefined;
vi.mock('next/dynamic', () => ({
  default: () =>
    function FakeCanvas(props: WorldCanvasProps) {
      canvas = props;
      return <div data-testid="world-canvas" />;
    },
}));

describe('OfficePage', () => {
  it('labels the NPCs with the names of their agents', async () => {
    vi.mocked(agentsGateway.fetchAgents).mockResolvedValue([{ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' }]);
    vi.mocked(worldGateway.fetchMapState).mockResolvedValue({
      mapId: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: { x: 16, y: 16 },
      entities: [{ id: 'npc-dev', sprite: 'npc-dev', x: 48, y: 16, agentId: 'dev-ai' }],
    });
    vi.mocked(worldGateway.fetchGridMap).mockResolvedValue(gridFrom(['...']));

    render(
      <Providers>
        <OfficePage />
      </Providers>,
    );

    await screen.findByTestId('world-canvas');
    await vi.waitFor(() => {
      expect(canvas?.scene.entities[0]?.label).toBe('Dev AI');
    });
    act(() => {
      canvas?.onNearbyChange('npc-dev');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Perto de Dev AI');
  });
});
