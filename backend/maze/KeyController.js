let instance;

// eslint-disable-next-line import/prefer-default-export
module.exports = class KeyController {
  constructor(key) {
    if (instance) {
      throw new Error('New instance of KeyController cannot be created!!');
    }

    if (!key || !Array.isArray(key)) {
      throw new Error('Key for the Maze must be an array of strings');
    }

    this.key = key;
    this.currentKeyPosition = 0;
    instance = this;
  }

  /**
   * Get Current Position Letter
   *
   * @returns string current char position
   */
  getCurrentPositionLetter() {
    return this.key[this.currentKeyPosition];
  }

  /**
   * move to next position of the key
   */
  next() {
    this.currentKeyPosition += 1;

    if (this.currentKeyPosition === this.key.length) {
      this.currentKeyPosition = 0;
    }
  }

  reset() {
    this.currentKeyPosition = 0;
  }
};
