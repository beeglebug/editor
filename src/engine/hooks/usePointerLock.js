import { useEffect } from 'react';
import { useThree } from 'react-three-fiber';
import useStore from '../../editor/store';
import { bind, unbind, setupPointerLock } from '../input/Input';

const focus = (element) => {
  bind(element);
  element.tabIndex = 1;
  element.focus();
};

const blur = (element) => {
  unbind(element);
  element.blur();
};

export default function usePointerLock() {
  const { gl } = useThree();
  const running = useStore((state) => state.running);
  const stop = useStore((state) => state.stop);
  useEffect(() => {
    if (running === false) return;
    focus(gl.domElement);
    setupPointerLock(gl.domElement, (hasLock) => {
      if (hasLock === false) {
        blur(gl.domElement);
        stop();
      }
    });
    return () => blur(gl.domElement);
  }, [running]);
}
