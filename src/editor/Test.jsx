import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { createButton } from '../engine/input/Input';
import CharacterControllerImpl from '../engine/CharacterController';
import KeyCode from '../engine/input/KeyCode';
import Overlay from './Overlay';
import useStore from './store';
import usePointerLock from '../engine/hooks/usePointerLock';

export default function Test() {
  const running = useStore((state) => state.running);
  const start = useStore((state) => state.start);
  return (
    <>
      {running === false && <Overlay onClick={start} />}
      <Canvas camera={{ fov: 75, position: [3, 1, 3] }}>
        <Engine running={running} />
      </Canvas>
    </>
  );
}

function Engine({ running }) {
  usePointerLock();
  return (
    <Suspense fallback={null}>
      <ambientLight />
      <CharacterController enabled={running} />
      <gridHelper />
      <axesHelper />
    </Suspense>
  );
}

const controlMap = {
  forward: createButton('forward', KeyCode.W, KeyCode.UpArrow),
  back: createButton('back', KeyCode.S, KeyCode.DownArrow),
  left: createButton('left', KeyCode.A, KeyCode.LeftArrow),
  right: createButton('right', KeyCode.D, KeyCode.RightArrow),
  interact: createButton('interact', KeyCode.E),
  run: createButton('run', KeyCode.LeftShift),
};

function CharacterController(props) {
  const { camera } = useThree();
  const controls = useEffectfulState(
    () => new CharacterControllerImpl(camera, controlMap),
    [camera],
  );

  useFrame((_, delta) => controls?.update(delta));

  return controls ? (
    <primitive dispose={undefined} object={controls} {...props} />
  ) : null;
}

function useEffectfulState(fn, deps) {
  const [state, set] = useState();
  useLayoutEffect(() => {
    const value = fn();
    set(value);
  }, deps);
  return state;
}
