type Direction = 'up' | 'down' | 'left' | 'right';

const KEYMAP: Readonly<Record<string, Direction>> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

const isTyping = (e: KeyboardEvent) =>
  e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));

export interface DirectionInput {
  /** Wanted direction on the floor plane, not normalized. */
  direction(): { x: number; z: number };
  dispose(): void;
}

export function createKeyboardInput(target: Window = window): DirectionInput {
  const pressed = new Set<Direction>();
  const onDown = (e: KeyboardEvent) => {
    const dir = KEYMAP[e.code];
    if (!dir || isTyping(e)) return; // never steal keys from the chat box (phase 2)
    pressed.add(dir);
    e.preventDefault();
  };
  const onUp = (e: KeyboardEvent) => {
    const dir = KEYMAP[e.code];
    if (dir) pressed.delete(dir);
  };
  const onBlur = () => {
    pressed.clear();
  };
  target.addEventListener('keydown', onDown);
  target.addEventListener('keyup', onUp);
  target.addEventListener('blur', onBlur);

  return {
    direction: () => ({
      x: (pressed.has('right') ? 1 : 0) - (pressed.has('left') ? 1 : 0),
      z: (pressed.has('down') ? 1 : 0) - (pressed.has('up') ? 1 : 0),
    }),
    dispose() {
      target.removeEventListener('keydown', onDown);
      target.removeEventListener('keyup', onUp);
      target.removeEventListener('blur', onBlur);
    },
  };
}
