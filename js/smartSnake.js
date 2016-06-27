var Snake = require("./snake");

Function.prototype.inherits = function (BaseClass) {
  function Surrogate () {}
  Surrogate.prototype = BaseClass.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = this;
};

var SmartSnake = function (pos){
  this.direction = "N";
  this.segments = [pos];
  this.turnsToGrow = 0;
  this.type = "SmartSnake";
  console.log("SmartSnake");
};

SmartSnake.inherits(Snake);

SmartSnake.prototype.move = function () {
  var head = this.segments[0];
  var segment = [];

  segment = [head[0],head[1] - 1];
  // switch (this.direction)
  // {
  //   case "up":
  //     segment = [head[0],head[1] - 1];
  //     break;
  //   case "down":
  //     segment = [head[0],head[1] + 1];
  //     break;
  //   case "right":
  //     segment = [head[0] + 1, head[1]];
  //     break;
  //   case "left":
  //     segment = [head[0] - 1,head[1]];
  //     break;
  // }

  this.segments.unshift(segment);
  if (this.turnsToGrow > 0){
    this.turnsToGrow--;
  }else{
    this.segments.pop(1);
  }
};

SmartSnake.prototype.manhattanDistance = function (head, apple, size) {
    var dx = Math.abs( head.x - apple.x );
    var dy = Math.abs( head.y - apple.y );
    return dx + dy;
};

module.exports = SmartSnake;
