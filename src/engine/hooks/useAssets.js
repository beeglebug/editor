import { useMemo } from 'react';
import { NearestFilter, TextureLoader } from 'three';

export default function useAssets(scene) {
  return useMemo(() => {
    const assets = {};
    const loader = new TextureLoader();

    scene.tiles.forEach((tile) => {
      const { texture } = tile;
      if (assets[texture] === undefined) {
        const tx = loader.load(texture);
        tx.magFilter = NearestFilter;
        tx.minFilter = NearestFilter;
        assets[texture] = tx;
      }
    });

    return assets;
  }, [scene]);
}
