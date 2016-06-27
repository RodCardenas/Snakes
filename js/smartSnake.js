var Snake = require("./snake");

Function.prototype.inherits = function (BaseClass) {
  function Surrogate () {}
  Surrogate.prototype = BaseClass.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = this;
};

var SmartSnake = function (pos){
  Snake.call(this, pos);
  this.path = [];
  this.pathApple = [];
};

SmartSnake.inherits(Snake);

SmartSnake.prototype.move = function (board) {
  var head = this.segments[0];
  var segment = [];

  if (this.pathApple[0] !== board.apple[0] || this.pathApple[1] !== board.apple[1]) {
    this.pathApple = board.apple;
    this.defineNewPath(head, board);
  } else {
    if (this.path.length <= 1 ) { // || this.pathInterrupted(board))
      this.defineNewPath(head, board);
    }
  }

  this.direction = this.path.pop(1);

  if (this.opposites(this.path[0], this.direction)) {
    this.path.unshift(this.direction);
    if (this.direction === "u" || this.direction === "d" ) {
      this.direction = "r";
    } else {
      this.direction = "u";
    }
  }

  switch (this.direction)
  {
    case "u":
      segment = [head[0],head[1] - 1];
      break;
    case "d":
      segment = [head[0],head[1] + 1];
      break;
    case "r":
      segment = [head[0] + 1, head[1]];
      break;
    case "l":
      segment = [head[0] - 1,head[1]];
      break;
  }

  this.segments.unshift(segment);
  if (this.turnsToGrow > 0){
    this.turnsToGrow--;
  }else{
    this.segments.pop(1);
  }
};

SmartSnake.prototype.manhattanDistance = function (head, board) {
    var dx = Math.abs( head[0] - board.apple[0] );
    var dy = Math.abs( head[1] - board.apple[1] );
    return dx + dy;
};

SmartSnake.prototype.pathInterrupted = function (board) {
  console.log("Checking Interruptions");
  var otherSnake;
  if (this !== board.snake1) {
    otherSnake = board.snake1;
  } else {
    otherSnake = board.snake2;
  }

  otherSnake.segments.forEach(function(elSnake, sdx){
    this.path.forEach(function(elPath, pdx) {
      if(elSnake[0] === elPath[0] && elSnake[1] === elPath[1]){
        return true;
      }
    });
  });

  return false;
};

SmartSnake.prototype.defineNewPath = function (head, board) {
  this.path = [];
  var dx = head[0] - board.apple[0];
  var dy = head[1] - board.apple[1];
  var distance = Math.abs(dx) + Math.abs(dy);

  while (this.path.length < distance){
    if (dx > 0) {
      this.path.push("l");
      dx--;
    } else if (dy > 0) {
      this.path.push("u");
      dy--;
    } else if (dy < 0) {
      this.path.push("d");
      dy++;
    } else if (dx < 0) {
      this.path.push("r");
      dx++;
    }
  }
};

SmartSnake.prototype.opposites = function (dir1, dir2) {
  // console.log("1 = " + dir1);
  // console.log("2 = " + dir2);
  if (dir1 === "u" && dir2 === "d" || dir2 === "u" && dir1 === "d") {
    return true;
  } else if (dir1 === "r" && dir2 === "l" || dir2 === "r" && dir1 === "l") {
    return true;
  }
  return false;
};

module.exports = SmartSnake;
