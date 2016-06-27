var Snake = require("./snake");

Function.prototype.inherits = function (BaseClass) {
  function Surrogate () {}
  Surrogate.prototype = BaseClass.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = this;
};

var SmartSnake = function (pos){
  Snake.call(this, pos);
};

SmartSnake.inherits(Snake);

// SmartSnake.prototype.move = function () {
//   var head = this.segments[0];
//   var segment = [];
//   switch (this.direction)
//   {
//     case "up":
//       segment = [head[0],head[1] - 1];
//       break;
//     case "down":
//       segment = [head[0],head[1] + 1];
//       break;
//     case "right":
//       segment = [head[0] + 1, head[1]];
//       break;
//     case "left":
//       segment = [head[0] - 1,head[1]];
//       break;
//   }
//
//   this.segments.unshift(segment);
//   if (this.turnsToGrow > 0){
//     this.turnsToGrow--;
//   }else{
//     this.segments.pop(1);
//   }
// };

SmartSnake.prototype.manhattanDistance = function (node1, node2, size) {
    var dx = Math.abs( node1.x - node2.x );
    var dy = Math.abs( node1.y - node2.y );
    return dx + dy;
};

module.exports = SmartSnake;
