var Snake = function(pos){
  this.direction = "N";
  this.segments = [pos];
  this.turnsToGrow = 0;
};

Snake.prototype.move = function () {
  var head = this.segments[0];
  var segment = [];
  switch (this.direction)
  {
    case "N":
      segment = [head[0],head[1] - 1];
      break;
    case "up":
      segment = [head[0],head[1] - 1];
      break;
    case "S":
      segment = [head[0],head[1] + 1];
      break;
    case "down":
      segment = [head[0],head[1] + 1];
      break;
    case "E":
      segment = [head[0] + 1, head[1]];
      break;
    case "right":
      segment = [head[0] + 1, head[1]];
      break;
    case "W":
      segment = [head[0] - 1,head[1]];
      break;
    case "left":
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

Snake.prototype.turn = function (direction) {
  this.direction = direction;
};

Snake.prototype.harakiri = function () {
  var head = this.segments[0];
  this.segments.forEach(function(el, idx){
    if(idx > 0){
      if(head[0] === el[0] && head[1] === el[1]){
        throw new Error("Snake dead!");
      }
    }
  });
  return false;
};

Snake.prototype.grow = function () {
  this.turnsToGrow += 2;
};

module.exports = Snake;
