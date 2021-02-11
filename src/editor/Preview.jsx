import React, { useRef, useState, useLayoutEffect } from 'react';
import Engine from '../engine/Engine';
import game from '../game';
import './Preview.css';

export default function Preview() {
  const gameContainer = useRef(null);
  const [running, setRunning] = useState(false);

  /** @type {[Engine, (engine: Engine) => void]} */
  const [engine, setEngine] = useState(null);

  // TODO resolution from config
  const width = 320;
  const height = 240;
  const scale = 2;

  useLayoutEffect(() => {
    const engine = new Engine(gameContainer.current, width, height, scale);
    engine.addListener('stop', () => {
      setRunning(false);
    });
    setEngine(engine);
  }, []);

  function handlePlay() {
    engine.load(game);
    engine.start();
    setRunning(true);
  }

  return (
    <div
      className="container"
      style={{ width: width * scale, height: height * scale }}
    >
      <div ref={gameContainer} />
      {running === false && (
        <div className="overlay">
          <button onClick={handlePlay}>{'play'}</button>
        </div>
      )}
    </div>
  );
}
