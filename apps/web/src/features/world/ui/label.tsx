import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

const FONT = '600 28px system-ui, sans-serif';
const SCALE = 0.0075; // canvas pixels -> world units

/** A name drawn on a canvas and shown as a sprite: no DOM and no external font. */
export function Label({ text, y }: { text: string; y: number }) {
  const { texture, width, height } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas 2D indisponível');
    ctx.font = FONT;
    canvas.width = Math.ceil(ctx.measureText(text).width) + 24;
    canvas.height = 44;
    ctx.font = FONT;
    ctx.fillStyle = 'rgba(17,24,39,0.8)';
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 12, canvas.height / 2 + 1);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return { texture, width: canvas.width, height: canvas.height };
  }, [text]);

  useEffect(
    () => () => {
      texture.dispose();
    },
    [texture],
  );

  return (
    <sprite position-y={y} scale={[width * SCALE, height * SCALE, 1]} renderOrder={10}>
      <spriteMaterial map={texture} depthTest={false} />
    </sprite>
  );
}
