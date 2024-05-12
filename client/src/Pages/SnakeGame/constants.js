const CANVAS_SIZE = [666, 400];
const SNAKE_START = [
  [11, 11],
  [11, 11]
];
const APPLE_START = [10, 3];
const SCALE = 20;
const SPEED =140;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
};