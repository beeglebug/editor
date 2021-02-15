import React from 'react';
import './Debug.css';
import useStore from './store';

export default function Debug() {
  const [px, py, pz] = useStore((state) => state.playerPosition);
  const [tx, ty] = useStore((state) => state.playerTilePosition);
  return (
    <div className="debug">
      <div>{formatVec(px, py, pz)}</div>
      <div>{formatVec(tx, ty)}</div>
    </div>
  );
}

const formatNumber = (number) => {
  return (number >= 0 ? '\u0020' : '') + number.toFixed(2);
};

const formatVec = (...components) => {
  return `[${components.map(formatNumber).join(',')}]`;
};
