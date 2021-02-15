import React, { useCallback, useMemo } from 'react';
import { TILE_SIZE } from '../engine/consts';
import createGeometry from '../engine/util/createGeometry';
import { getNeighbours } from '../engine/util/getNeighbours';

export default function TileMap({ width, height, tiles, assets }) {
  const getGeometry = useCallback(
    (tile) => {
      const { x, y } = tile;
      const neighbours = getNeighbours(tiles, width, height, x, y);
      return createGeometry(tile, neighbours);
    },
    [width, height, tiles],
  );

  return tiles.map((tile) => {
    const { texture, x, y } = tile;
    const map = assets[texture];
    const geometry = getGeometry(tile);
    return (
      <mesh
        key={`${x}-${y}`}
        position={[x * TILE_SIZE, 0, y * TILE_SIZE]}
        geometry={geometry}
      >
        <meshBasicMaterial map={map} />
      </mesh>
    );
  });
}
