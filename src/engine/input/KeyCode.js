const keyCodes = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  Pause: 19,
  Caps: 20,
  Esc: 27,
  Space: 32,
  PageUp: 33,
  PageDown: 34,
  End: 35,
  Home: 36,
  LeftArrow: 37,
  UpArrow: 38,
  RightArrow: 39,
  DownArrow: 40,
  Insert: 45,
  Delete: 46,
  Alpha0: 48,
  Alpha1: 49,
  Alpha2: 50,
  Alpha3: 51,
  Alpha4: 52,
  Alpha5: 53,
  Alpha6: 54,
  Alpha7: 55,
  Alpha8: 56,
  Alpha9: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  Keypad0: 96,
  Keypad1: 97,
  Keypad2: 98,
  Keypad3: 99,
  Keypad4: 100,
  Keypad5: 101,
  Keypad6: 102,
  Keypad7: 103,
  Keypad8: 104,
  Keypad9: 105,
  KeypadMultiply: 106,
  KeypadPlus: 107,
  KeypadMinus: 109,
  KeypadPeriod: 110,
  KeypadDivide: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  Shift: 16,
  Control: 17,
  LeftShift: 'LeftShift',
  RightShift: 'RightShift',
  LeftControl: 'LeftControl',
  RightControl: 'RightControl',
  Alt: 18,
  Plus: 187,
  Comma: 188,
  Minus: 189,
  Period: 190,
  Tilde: 223,
};

export default keyCodes;

const byKeyCode = {};
for (let name in keyCodes) {
  byKeyCode[keyCodes[name]] = name;
}

export const getKeyForCode = (code) => byKeyCode[code];
