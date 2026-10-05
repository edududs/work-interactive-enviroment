const KEYMAP: Record<string, 'up' | 'down' | 'left' | 'right'> = {
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

export interface Input {
  /** Direção desejada no plano (x, z), sem normalizar. */
  direction(): { x: number; z: number };
  dispose(): void;
}

export function createKeyboardInput(): Input {
  const pressed = new Set<string>();
  const onDown = (e: KeyboardEvent) => {
    const dir = KEYMAP[e.code];
    if (!dir || isTyping(e)) return; // não rouba teclas de inputs do React (chat, Fase 2)
    pressed.add(dir);
    e.preventDefault();
  };
  const onUp = (e: KeyboardEvent) => {
    const dir = KEYMAP[e.code];
    if (dir) pressed.delete(dir);
  };
  const onBlur = () => pressed.clear();
  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);
  window.addEventListener('blur', onBlur);

  return {
    direction: () => ({
      x: (pressed.has('right') ? 1 : 0) - (pressed.has('left') ? 1 : 0),
      z: (pressed.has('down') ? 1 : 0) - (pressed.has('up') ? 1 : 0),
    }),
    dispose() {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    },
  };
}
