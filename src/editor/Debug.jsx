import React from 'react';
import './Debug.css';
import useStore from './store';

export default function Debug() {
  const [x, y, z] = useStore((state) => state.playerPosition);
  return <div className="debug">{formatVec3(x, y, z)}</div>;
}

const formatNumber = (number) => {
  return (number >= 0 ? '\u0020' : '') + number.toFixed(2);
};
const formatVec3 = (x, y, z) => {
  return `[${formatNumber(x)},${formatNumber(y)},${formatNumber(z)}]`;
};
