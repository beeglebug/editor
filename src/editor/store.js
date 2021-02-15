import { Vector3 } from 'three';
import create from 'zustand';
import game from '../game';

const useStore = create((set) => ({
  running: false,
  game,
  scene: 0,
  playerPosition: [0, 0, 0],
  playerTilePosition: [0, 0],
  start: () => set({ running: true }),
  stop: () => set({ running: false }),
  setPlayerPosition: (x, y, z) => set({ playerPosition: [x, y, z] }),
  setPlayerTilePosition: (x, y) => set({ playerTilePosition: [x, y] }),
}));

export const sceneSelector = (state) => state.game.scenes[state.scene];

export default useStore;
