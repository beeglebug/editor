/**
 * @param {number} number
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export default function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}
