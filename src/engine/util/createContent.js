import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PlaneGeometry,
} from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import Rect from '../physics/geometry/Rect';
import createGeometry from './createGeometry';

const TILE_SIZE = 2;
const WALL_HEIGHT = 2.4;

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

  const { tiles, width, height, tileDefs } = scene;

  const getTile = (id) => {
    if (id === null) return null;
    const tile = tileDefs[id];
    if (tile === undefined) {
      throw new Error(`No tileDef for id ${id}`);
    }
    return tile;
  };

  try {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileId = tiles[y][x];

        const dx = x * TILE_SIZE;
        const dy = y * TILE_SIZE;

        // empty space
        if (tileId === 0) continue;

        const tile = getTile(tileId);

        const neighbours = getNeighbours(tiles, width, height, x, y);
        const neighbourTiles = neighbours.map(getTile);
        const mesh = createMesh(tile, neighbourTiles, assets);

        if (tile.collision === true) {
          // mesh.collider = createCollider(dx, dy);
        }

        // 2d to 3d
        mesh.position.set(dx, 0, dy);
        meshes.push(mesh);
      }
    }
  } catch (e) {
    console.warn('Failed to create tiles', e);
  }

  return meshes;
}

const geometryCache = {};

/**
 * @param {import('../../game').Tile} tile
 */
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

function getNeighbours(data, width, height, x, y) {
  const neighbours = [];

  // left
  if (x > 0) {
    neighbours.push(data[y][x - 1]);
  } else {
    neighbours.push(null);
  }

  // right
  if (x < width - 1) {
    neighbours.push(data[y][x + 1]);
  } else {
    neighbours.push(null);
  }

  // above
  if (y > 0) {
    neighbours.push(data[y - 1][x]);
  } else {
    neighbours.push(null);
  }

  // below
  if (y < height - 1) {
    neighbours.push(data[y + 1][x]);
  } else {
    neighbours.push(null);
  }

  return neighbours;
}
