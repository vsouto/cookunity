const express = require('express');

const app = express();
const port = 3000;
const maze = require('./maze/maze1');
const GameController = require('./maze/GameController');

app.get('/', (req, res) => {
  const controller = new GameController(maze);

  // start solving maze
  const solution = controller.solve();
  // const solution = controller.isCurrentSlot('D');

  res.send(solution);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
