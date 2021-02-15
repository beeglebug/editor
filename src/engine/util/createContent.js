import { Mesh, MeshBasicMaterial } from 'three';
import { TILE_SIZE } from '../consts';
import Rect from '../physics/geometry/Rect';
import createGeometry from './createGeometry';

/**
 * @param {import('../../game').Scene} scene
 */
export default function (scene, assets, engine) {
  const entities = [];
  const tiles = createTiles(scene, assets);
  return [tiles, entities];
}

/**
 * @param {import('../../game').Scene} scene
 */
function createTiles(scene, assets) {
  const meshes = [];

  const { tiles, width, height } = scene;

  tiles.forEach((tile) => {
    const { x, y } = tile;
    const neighbours = getNeighbours(tiles, width, height, x, y);
    const mesh = createMesh(tile, neighbours, assets);

    const dx = x * TILE_SIZE;
    const dy = y * TILE_SIZE;

    // 2d to 3d
    mesh.position.set(dx, 0, dy);
    meshes.push(mesh);
  });

  return meshes;
}

function createMesh(tile, neighbours, assets) {
  // TODO cache using key made from variables
  const geometry = createGeometry(tile, neighbours);
  const texture = assets[tile.texture];

  // TODO cache and reuse materials
  const material = new MeshBasicMaterial({ map: texture });
  return new Mesh(geometry, material);
}

function createCollider(x, y) {
  return new Rect(x, y, TILE_SIZE, TILE_SIZE);
}
