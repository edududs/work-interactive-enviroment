import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { createKeyboardInput, type DirectionInput } from './keyboard-input';

describe('keyboard input', () => {
  let input: DirectionInput;
  afterEach(() => {
    input.dispose();
  });

  it('turns WASD and arrows into a direction while the keys are held', async () => {
    const user = userEvent.setup();
    input = createKeyboardInput();
    await user.keyboard('{w>}{d>}');
    expect(input.direction()).toEqual({ x: 1, z: -1 });
    await user.keyboard('{/w}{/d}{ArrowDown>}{ArrowLeft>}');
    expect(input.direction()).toEqual({ x: -1, z: 1 });
    await user.keyboard('{/ArrowDown}{/ArrowLeft}');
    expect(input.direction()).toEqual({ x: 0, z: 0 });
  });

  it('ignores keys typed into a text field', async () => {
    const user = userEvent.setup();
    input = createKeyboardInput();
    const field = document.createElement('input');
    document.body.append(field);
    await user.click(field);
    await user.keyboard('{w>}');
    expect(input.direction()).toEqual({ x: 0, z: 0 });
    await user.keyboard('{/w}');
    field.remove();
  });

  it('releases every key when the window loses focus', async () => {
    const user = userEvent.setup();
    input = createKeyboardInput();
    await user.keyboard('{d>}');
    window.dispatchEvent(new Event('blur'));
    expect(input.direction()).toEqual({ x: 0, z: 0 });
  });

  it('stops listening once disposed', async () => {
    const user = userEvent.setup();
    input = createKeyboardInput();
    input.dispose();
    await user.keyboard('{d>}');
    expect(input.direction()).toEqual({ x: 0, z: 0 });
    await user.keyboard('{/d}');
  });
});
