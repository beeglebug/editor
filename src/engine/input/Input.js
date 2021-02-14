import Vector2 from '../physics/geometry/Vector2';
import KeyCode from './KeyCode';

const buttons = {};
const downKeys = {};
const downKeysThisFrame = {};
const upKeysThisFrame = {};

const mousePosition = new Vector2();
const mouseMove = new Vector2();

export const MouseX = 'MouseX';
export const MouseY = 'MouseY';

export const LOCATION_LEFT = 1;
export const LOCATION_RIGHT = 2;

export const determineCode = (event) => {
  switch (event.keyCode) {
    case KeyCode.Shift:
      if (event.location === LOCATION_LEFT) return KeyCode.LeftShift;
      else if (event.location === LOCATION_RIGHT) return KeyCode.RightShift;
      break;
    case KeyCode.Control:
      if (event.location === LOCATION_LEFT) return KeyCode.LeftControl;
      else if (event.location === LOCATION_RIGHT) return KeyCode.RightControl;
      break;
  }
  return event.keyCode;
};

export const handleKeyDown = (event) => {
  const code = determineCode(event);
  if (downKeys[code]) return;
  downKeys[code] = true;
  downKeysThisFrame[code] = true;
};

export const handleKeyUp = (event) => {
  const code = determineCode(event);
  delete downKeys[code];
  upKeysThisFrame[code] = true;
};

export const getKey = (key) => {
  return downKeys[key] === true;
};

export const getKeyDown = (key) => {
  return downKeysThisFrame[key] === true;
};

export const getKeyUp = (key) => {
  return upKeysThisFrame[key] === true;
};

// reset at end of frame
export const clear = () => {
  for (let key in downKeysThisFrame) {
    delete downKeysThisFrame[key];
  }
  for (let key in upKeysThisFrame) {
    delete upKeysThisFrame[key];
  }
};

let _domElement;

export const bind = (target) => {
  _domElement = target;
  target.addEventListener('keydown', handleKeyDown);
  target.addEventListener('keyup', handleKeyUp);
  target.addEventListener('mousemove', handleMouseMove);
};

export const unbind = (target) => {
  target.removeEventListener('keydown', handleKeyDown);
  target.removeEventListener('keyup', handleKeyUp);
  target.removeEventListener('mousemove', handleMouseMove);
};

let timeout;

export const handleMouseMove = (event) => {
  clearTimeout(timeout);
  const { movementX, movementY, clientX, clientY } = event;
  mousePosition.x = clientX;
  mousePosition.y = clientY;
  mouseMove.x = movementX || 0;
  mouseMove.y = movementY || 0;
  timeout = setTimeout(clearMouseMove, 10);
};

export const clearMouseMove = () => {
  mouseMove.x = 0;
  mouseMove.y = 0;
};

export const getAxis = (axis) => {
  switch (axis) {
    case MouseX:
      return mouseMove.x;
    case MouseY:
      return mouseMove.y;
  }
};

/**
 * @param {string} name
 * @param  {Array<string|number>} keyCodes
 */
export const createButton = (name, ...keyCodes) => {
  const button = { name, keyCodes };
  buttons[name] = button;
  return button;
};

export const getButton = ({ name }) => {
  const button = buttons[name];
  if (!button) return false;
  return button.keyCodes.some(getKey);
};

export const getButtonDown = ({ name }) => {
  const button = buttons[name];
  if (!button) return false;
  return button.keyCodes.some(getKeyDown);
};

export const getButtonUp = ({ name }) => {
  const button = buttons[name];
  if (!button) return false;
  return button.keyCodes.some(getKeyUp);
};

export function hasPointerLock() {
  return document.pointerLockElement === _domElement;
}

export function setupPointerLock(element, onChange) {
  element.requestPointerLock();

  const handlePointerLockChange = () => {
    onChange(hasPointerLock());
  };

  const handlePointerLockError = (error) => {
    console.warn('Pointer Lock Error', error);
  };

  document.addEventListener('pointerlockchange', handlePointerLockChange);
  document.addEventListener('pointerlockerror', handlePointerLockError);
}
