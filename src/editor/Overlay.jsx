import React from 'react';
import './Overlay.css';

export default function Overlay({ onClick }) {
  return (
    <div className="overlay">
      <button onClick={onClick}>Play</button>
    </div>
  );
}
