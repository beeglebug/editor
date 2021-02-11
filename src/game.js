/**
 * @typedef {Object} Tile
 * @prop {string} id
 * @prop {number} height
 * @prop {number} floor
 * @prop {number} ceiling
 */

import RandomNumberGenerator from './engine/maths/RandomNumberGenerator';

/**
 * @typedef {Object} Scene
 * @prop {string} id
 * @prop {string} name
 * @prop {number} width
 * @prop {number} height
 * @prop {number[]} tiles
 * @prop {{[id: string]: Tile}} tileDefs
 */

/**
 * @typedef {Object} Game
 * @prop {string} id
 * @prop {string} name
 * @prop {Scene[]} scenes
 */

/**
 * @type {Game}
 */
const test = {
  id: 'abc123',
  name: 'Demo Game',
  scenes: [
    {
      id: 1,
      name: 'Scene 1',
      width: 16,
      height: 16,
      spawn: {
        position: [12.5, 0, 7],
        rotation: [0, 3.72, 0],
      },
      // prettier-ignore
      tiles: [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
          [0,0,0,0,0,0,1,2,1,3,3,4,5,1,0,0],
          [0,0,0,0,0,0,1,3,1,4,1,5,6,1,0,0],
          [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
      tileDefs: [
        null,
        {
          id: 1,
          floor: 0,
          ceiling: 2,
          collision: false,
        },
        {
          id: 2,
          floor: 1,
          ceiling: 1,
          collision: true,
        },
        {
          id: 3,
          height: 3,
          floor: 1,
          ceiling: 3,
          collision: true,
        },
        {
          id: 1,
          floor: 0.5,
          ceiling: 2.5,
          collision: false,
        },
        {
          id: 1,
          floor: -1,
          ceiling: 1.8,
          collision: false,
        },
        {
          id: 6,
          floor: -0.5,
          ceiling: 2,
          collision: false,
        },
      ],
    },
  ],
};

const rng = new RandomNumberGenerator();
const scene = test.scenes[0];

for (let i = 0; i < 20; i++) {
  scene.tileDefs[i] = {
    id: i,
    floor: rng.randomBetween(-2, 0),
    ceiling: rng.randomBetween(3, 6),
    collision: false,
  };
}

for (let y = 0; y < scene.height; y++) {
  for (let x = 0; x < scene.width; x++) {
    scene.tiles[y][x] = rng.randomIntBetween(1, 19);
  }
}
console.log(test);
export default test;
