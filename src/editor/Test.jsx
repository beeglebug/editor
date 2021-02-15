import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { createButton } from '../engine/input/Input';
import CharacterControllerImpl from '../engine/CharacterController';
import KeyCode from '../engine/input/KeyCode';
import Overlay from './Overlay';
import useStore, { sceneSelector } from './store';
import usePointerLock from '../engine/hooks/usePointerLock';
import useEffectfulState from '../engine/hooks/useEffectfulState';
import TileMap from './TileMap';
import useAssets from '../engine/hooks/useAssets';
import Debug from './Debug';

export default function Test() {
  const running = useStore((state) => state.running);
  const start = useStore((state) => state.start);
  return (
    <>
      {running === false && <Overlay onClick={start} />}
      <Debug />
      <Canvas camera={{ fov: 75 }}>
        <Suspense fallback={null}>
          <Engine running={running} />
        </Suspense>
      </Canvas>
    </>
  );
}

function Engine({ running }) {
  usePointerLock();
  const scene = useStore(sceneSelector);
  const { width, height, tiles } = scene;
  const assets = useAssets(scene);
  return (
    <>
      <CharacterController enabled={running} />
      <TileMap width={width} height={height} tiles={tiles} assets={assets} />
      <ambientLight />
      <gridHelper args={[100, 50]} />
      <axesHelper />
    </>
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
