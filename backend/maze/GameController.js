const KeyController = require('./KeyController');

let instance;

// eslint-disable-next-line import/prefer-default-export
module.exports = class GameController {
  constructor(maze) {
    if (instance) {
      throw new Error('New instance of GameController cannot be created!!');
    }

    // TODO: Builder for Maze? YES PLEASE!
    if (!maze || !maze.key || !maze.matrix) {
      throw new Error('Maze is not present or missing required attributes!');
    }

    this.maze = maze;
    this.currentSlot = this.maze.startPoint;
    this.solved = false;
    this.keyController = new KeyController(this.maze.key);
    this.lastMove = [0, 0];
    this.solution = [];
    this.knownWrongPath = this.maze.knownWrongPath;
    instance = this;
  }

  solve() {
    // So we are at the starting point.
    // Let's create the game Loop Tick
    while (!this.solved) {
      console.log('================ still not solved, running again');

      // Check for possible ocurrencies nearby
      const nextMoveFound = this.checkForOcurrenciesNearby();

      if (nextMoveFound) {
        this.moveTo(nextMoveFound);
      }

      // Maze is solved
      if (!this.atStartingPoint() && this.isCurrentSlot('B')) {
        this.solveMaze();
      }
    }
  }

  checkForOcurrenciesNearby() {
    // What's the next char to look for?
    const nextCharToLookFor = this.keyController.getCurrentPositionLetter();

    let nearbyDiscovery = this.searchNearbyFor('B');

    // Always search for B first
    if (nearbyDiscovery) {
      return nearbyDiscovery;
    }

    // If B is not found, let's search for the next key
    nearbyDiscovery = this.searchNearbyFor(nextCharToLookFor);

    // Points found will be something like [1, 1]
    if (!nearbyDiscovery) {
      throw new Error('No further points were found to advance in the solution!');
    }

    return nearbyDiscovery;
  }

  /**
   * are we at starting point?
   *
   * @returns
   */
  atStartingPoint() {
    return this.currentSlot === this.maze.startPoint;
  }

  /**
   * move to a coordinate
   *
   * @param {*} points
   */
  moveTo(points) {
    console.log('---- moving To ', points);
    // Let's save the current position
    this.lastMove = this.currentSlot;

    // Moving current to new points
    this.currentSlot = points;

    // Adding current move to solution
    this.solution.push(points);

    // Let's also make sure we move the KeyController
    this.keyController.next();
  }

  /**
   * Reset Game to original position
   */
  reset() {
    this.currentSlot = this.maze.startPoint;
    this.keyController.reset();
  }

  /**
   * search nearby for a char
   *
   * So i'm at 1,1. Where to look for?
   *   1,0 and 1,2
   *   0,1 and 2,1
   *
   * @param {*} char
   * @returns
   */
  searchNearbyFor(char) {
    const x = this.currentSlot[0];
    const y = this.currentSlot[1];

    console.log('searching nearby for : ', char);

    // Must not be the last move
    // Searching Left
    if (!this.lastMove.equals([x, y - 1]) && !this.pathIsWrongSolution(x, y - 1)) {
      if (y > 0) {
        if (this.maze.matrix[x][y - 1] === char) { return [x, y - 1]; }
      }
    }
    // Searching Right
    if (!this.lastMove.equals([x, y + 1]) && !this.pathIsWrongSolution(x, y + 1)) {
      if (this.maze.matrix[x][y + 1] === char) { return [x, y + 1]; }
    }
    // Searching Up
    if (!this.lastMove.equals([x - 1, y]) && !this.pathIsWrongSolution(x - 1, y)) {
      if (x > 0) {
        if (this.maze.matrix[x - 1][y] === char) { return [x - 1, y]; }
      }
    }
    // Searching Down
    if (!this.lastMove.equals([x + 1, y]) && !this.pathIsWrongSolution(x + 1, y)) {
      if (this.maze.matrix[x + 1][y] === char) { return [x + 1, y]; }
    }

    return false;
  }

  /**
   * check if is taking a Path that is known as wrong solution
   *
   * @param {*} x
   * @param {*} y
   * @returns
   */
  pathIsWrongSolution(x, y) {
    return this.knownWrongPath[0] === x && this.knownWrongPath[1] === y;
  }

  solveMaze() {
    this.solved = true;

    // Notifications?
    console.log('Maze solved !!!! ');
    console.log('Solution is: ', this.solution);
  }

  isCurrentSlot(letter) {
    const x = this.currentSlot[0];
    const y = this.currentSlot[1];

    const currentLetter = this.maze.matrix[x][y];

    console.log(currentLetter);
    return currentLetter === letter;
  }

  getFirstItem() {
    return this.maze[0][0];
  }
};

/* eslint-disable no-extend-native */
/* eslint-disable eqeqeq */
// Warn if overriding existing method
if (Array.prototype.equals) { console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."); }
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) { return false; }

  // compare lengths - can save a lot of time
  if (this.length != array.length) { return false; }

  for (let i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) { return false; }
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
