import create from 'zustand';

const useStore = create((set) => ({
  running: false,
  start: () => set({ running: true }),
  stop: () => set({ running: false }),
}));

export default useStore;
