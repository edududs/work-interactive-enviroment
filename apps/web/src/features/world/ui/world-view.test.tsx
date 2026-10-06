import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { gridFrom } from '../app/grid.fixture';
import type { WorldScene } from '../domain/scene';
import type { WorldCanvasProps } from './world-canvas';
import { WorldView } from './world-view';

// jsdom has no WebGL: the canvas is replaced by a stand-in that exposes its callback.
let reportNearby: WorldCanvasProps['onNearbyChange'] = () => undefined;
vi.mock('next/dynamic', () => ({
  default: () =>
    function FakeCanvas({ onNearbyChange }: WorldCanvasProps) {
      reportNearby = onNearbyChange;
      return <div data-testid="world-canvas" />;
    },
}));

const scene: WorldScene = {
  grid: gridFrom(['...']),
  spawn: { x: 0.5, z: 0.5 },
  entities: [
    { id: 'npc-dev', type: 'agent', sprite: 'npc-dev', x: 2.5, z: 0.5, label: 'Dev AI' },
    { id: 'npc-unnamed', type: 'agent', sprite: 'npc-dev', x: 1.5, z: 0.5 },
  ],
};

describe('WorldView', () => {
  it('shows how to walk, and who is near when the world says so', () => {
    render(<WorldView scene={scene} error={null} />);
    expect(screen.getByText('WASD ou setas para andar')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    act(() => {
      reportNearby('npc-dev');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Perto de Dev AI');

    act(() => {
      reportNearby('npc-unnamed');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Perto de npc-unnamed');

    act(() => {
      reportNearby(null);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('draws nothing but the HUD while the scene loads, and shows errors', () => {
    render(<WorldView scene={undefined} error={new Error('GET falhou: 500')} />);
    expect(screen.queryByTestId('world-canvas')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Não consegui carregar o mundo: GET falhou: 500');
  });
});
