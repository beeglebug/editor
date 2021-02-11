/**
 * @param {number} width
 * @param {number} height
 */
export default function createCanvas(width, height, scale) {
  const canvas = document.createElement('canvas');

  canvas.style.imageRendering = 'pixelated';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.display = 'block';

  canvas.width = width;
  canvas.height = height;

  canvas.style.width = `${width * scale}px`;
  canvas.style.height = `${height * scale}px`;

  return canvas;
}
