var Snake = require("./snake");

Function.prototype.inherits = function (BaseClass) {
  function Surrogate () {}
  Surrogate.prototype = BaseClass.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = this;
};

var SmartSnake = function (pos){
  Snake.call(this, pos);
  this.direction = "u";
  this.path = [];
  this.pathApple = [];
  this.locations = [];
};

SmartSnake.inherits(Snake);

SmartSnake.prototype.move = function (board) {
  var head = this.segments[0];
  var segment = [];

  if (this.pathApple[0] !== board.apple[0] || this.pathApple[1] !== board.apple[1]) {
    this.pathApple = board.apple;
    this.defineNewPath(head, board);
  }

  if (this.path.length < 1 ) {
    this.defineNewPath(head, board);
  }

  this.direction = this.path.pop(1);

  if (this.checkIfPathInterrupted(board)) {
    this.defineNewPath(head, board);
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

SmartSnake.prototype.checkIfPathInterrupted = function (board) {
  var otherSnake;

  if (this !== board.snake1) {
    otherSnake = board.snake1;
  } else {
    otherSnake = board.snake2;
  }

  for (var l = 0; l < this.locations.length; l++) {
    for (var s = 0; s< otherSnake.segments.length; s++) {
      var elSnake = otherSnake.segments[s];
      var elPath = this.locations[l];
      if (elSnake[0] === elPath[0] && elSnake[1] === elPath[1]) {
        return true;
      }
    }

    for (s = 0; s< this.segments.length; s++) {
      elSnake = this.segments[s];
      elPath = this.locations[l];
      if (elSnake[0] === elPath[0] && elSnake[1] === elPath[1]) {
        return true;
      }
    }
  }

  return false;
};

SmartSnake.prototype.defineNewPath = function (head, board) {
  this.path = [];
  this.locations = [];

  var dx = board.apple[0] - head[0];
  var dy = board.apple[1] - head[1];
  var distance = Math.abs(dx) + Math.abs(dy);
  var greaterThan = true;
  var lessThan = false;

  switch (this.direction)
  {
    case "u":
      dx = this.chooseFirstStep(dy, greaterThan, dx, "l", "r");
      break;
    case "d":
      dx = this.chooseFirstStep(dy, lessThan, dx, "l", "r");
      break;
    case "r":
      dy = this.chooseFirstStep(dx, lessThan, dy, "u", "d");
      break;
    case "l":
      dy = this.chooseFirstStep(dx, greaterThan, dy, "u", "d");
      break;
  }

  while (this.path.length < distance){
    var position = this.locations[this.locations.length - 1] || head;
    if (dx < 0) {
      this.path.push("l");
      this.locations.push([position[0] - 1,position[1]]);
      dx++;
    } else if (dy < 0) {
      this.path.push("u");
      this.locations.push([position[0],position[1] - 1]);
      dy++;
    } else if (dy > 0) {
      this.path.push("d");
      this.locations.push([position[0],position[1] + 1]);
      dy--;
    } else if (dx > 0) {
      this.path.push("r");
      this.locations.push([position[0] + 1,position[1]]);
      dx--;
    }
  }

  this.path.push(this.path.shift(1));
  position = this.locations[this.locations.length - 1];
  switch (this.path[this.path.length - 1])
  {
    case "u":
      this.locations.push([position[0],position[1] - 1]);
      break;
    case "d":
      this.locations.push([position[0],position[1] + 1]);
      break;
    case "r":
      this.locations.push([position[0] + 1,position[1]]);
      break;
    case "l":
      this.locations.push([position[0] - 1,position[1]]);
      break;
  }
};

SmartSnake.prototype.checkStep = function(board, pos) {
  var otherSnake;

  if (this !== board.snake1) {
    otherSnake = board.snake1;
  } else {
    otherSnake = board.snake2;
  }

  if(otherSnake.segments.include(pos)){
    return false;
  }
  return true;
};

SmartSnake.prototype.chooseFirstStep = function(check1st, comparator, check2nd, direction, opposite) {
  if (comparator ? (check1st > 0) : (check1st < 0)) {
    if (check2nd < 0) {
      this.path.push(direction);
      check2nd++;
    } else {
      this.path.push(opposite);
      check2nd--;
    }
  }
  return check2nd;
};

SmartSnake.prototype.opposites = function (dir1, dir2) {
  if (dir1 === "u" && dir2 === "d" || dir2 === "u" && dir1 === "d") {
    return true;
  } else if (dir1 === "r" && dir2 === "l" || dir2 === "r" && dir1 === "l") {
    return true;
  }
  return false;
};

module.exports = SmartSnake;
