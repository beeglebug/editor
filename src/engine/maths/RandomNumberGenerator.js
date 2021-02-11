import MersenneTwister from 'mersenne-twister';

export default class RandomNumberGenerator {
  constructor(seed = Date.now()) {
    this.generator = new MersenneTwister(seed);
  }

  random() {
    return this.generator.random();
  }

  randomBetween(min, max) {
    return this.generator.random() * (max - min) + min;
  }

  randomIntBetween(min, max) {
    return Math.floor(this.generator.random() * (max - min) + min);
  }

  randomItemFromArray(arr) {
    return arr[this.randomIntBetween(0, arr.length - 1)];
  }
}
