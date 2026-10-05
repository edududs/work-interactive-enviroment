import { useEffect, useRef } from 'react';
import { createKeyboardInput, type DirectionInput } from '../adapters/keyboard-input';

/** The direction the person wants to walk, read without re-rendering anything. */
export function useDirectionInput(): { readonly current: DirectionInput | null } {
  const input = useRef<DirectionInput | null>(null);
  useEffect(() => {
    const keyboard = createKeyboardInput();
    input.current = keyboard;
    return () => {
      keyboard.dispose();
      input.current = null;
    };
  }, []);
  return input;
}
