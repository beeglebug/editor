import { PlaneGeometry } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { TILE_SIZE } from '../consts';

const PI2 = Math.PI / 2;

const ALIGN_TOP = 0;
const ALIGN_BOTTOM = 1;
const FACE_LEFT = 0;
const FACE_RIGHT = 1;
const FACE_ABOVE = 2;
const FACE_BELOW = 3;

function createWall(bottom, top, facing, align = ALIGN_BOTTOM) {
  const height = top - bottom;
  const geometry = new PlaneGeometry(TILE_SIZE, height);

  const yTranslate =
    align === ALIGN_BOTTOM ? bottom + height / 2 : top - height / 2;
  const yRotate = align === ALIGN_BOTTOM ? 0 : Math.PI;

  switch (facing) {
    case FACE_LEFT:
      geometry.rotateY(yRotate + -PI2);
      geometry.translate(0, yTranslate, TILE_SIZE / 2);
      break;
    case FACE_RIGHT:
      geometry.rotateY(yRotate + PI2);
      geometry.translate(TILE_SIZE, yTranslate, TILE_SIZE / 2);
      break;
    case FACE_ABOVE:
      geometry.rotateY(yRotate + Math.PI);
      geometry.translate(TILE_SIZE / 2, yTranslate, 0);
      break;
    case FACE_BELOW:
      geometry.rotateY(yRotate + Math.PI * 2);
      geometry.translate(TILE_SIZE / 2, yTranslate, TILE_SIZE);
      break;
  }

  return geometry;
}

export default function createGeometry(tile, neighbours) {
  const { floor, ceiling } = tile;

  const floorPlane = new PlaneGeometry(TILE_SIZE, TILE_SIZE);
  floorPlane.rotateX(-PI2);
  floorPlane.translate(TILE_SIZE / 2, floor, TILE_SIZE / 2);

  const ceilingPlane = new PlaneGeometry(TILE_SIZE, TILE_SIZE);
  ceilingPlane.rotateX(PI2);
  ceilingPlane.translate(TILE_SIZE / 2, ceiling, TILE_SIZE / 2);

  const geometries = [floorPlane, ceilingPlane];

  const [above, left, right, below] = neighbours;

  // left floor wall
  if (left && floor > left.floor) {
    const wall = createWall(left.floor, floor, FACE_LEFT, ALIGN_BOTTOM);
    geometries.push(wall);
  }

  // right floor wall
  if (right && floor > right.floor) {
    const wall = createWall(right.floor, floor, FACE_RIGHT, ALIGN_BOTTOM);
    geometries.push(wall);
  }

  // above floor wall
  if (above && floor > above.floor) {
    const wall = createWall(above.floor, floor, FACE_ABOVE, ALIGN_BOTTOM);
    geometries.push(wall);
  }

  // below floor wall
  if (below && floor > below.floor) {
    const wall = createWall(below.floor, floor, FACE_BELOW, ALIGN_BOTTOM);
    geometries.push(wall);
  }

  // left ceiling wall
  if (left && ceiling < left.ceiling) {
    const wall = createWall(left.ceiling, ceiling, FACE_LEFT, ALIGN_TOP);
    geometries.push(wall);
  }

  // right ceiling wall
  if (right && ceiling < right.ceiling) {
    const wall = createWall(right.ceiling, ceiling, FACE_RIGHT, ALIGN_TOP);
    geometries.push(wall);
  }

  // above ceiling wall
  if (above && ceiling < above.ceiling) {
    const wall = createWall(above.ceiling, ceiling, FACE_ABOVE, ALIGN_TOP);
    geometries.push(wall);
  }

  // below ceiling wall
  if (below && ceiling < below.ceiling) {
    const wall = createWall(below.ceiling, ceiling, FACE_BELOW, ALIGN_TOP);
    geometries.push(wall);
  }

  return BufferGeometryUtils.mergeBufferGeometries(geometries);
}
