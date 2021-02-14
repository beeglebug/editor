import { useLayoutEffect, useState } from 'react';

export default function useEffectfulState(fn, deps) {
  const [state, set] = useState();
  useLayoutEffect(() => {
    const value = fn();
    set(value);
  }, deps);
  return state;
}
