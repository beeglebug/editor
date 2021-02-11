import RandomNumberGenerator from './engine/maths/RandomNumberGenerator';

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
      tiles: [],
    },
  ],
};

const rng = new RandomNumberGenerator();
const scene = test.scenes[0];

for (let y = 0; y < scene.height; y++) {
  for (let x = 0; x < scene.width; x++) {
    scene.tiles.push({
      x,
      y,
      floor: rng.randomBetween(-2, 0),
      ceiling: rng.randomBetween(3, 3),
      texture: rng.randomItemFromArray([
        'texture1.png',
        'texture2.png',
        'texture3.png',
        'texture4.png',
      ]),
    });
  }
}

export default test;
