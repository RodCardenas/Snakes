var Board = require("./snake");

var View = function($el){
  this.SIZE = [20,20];
  this.domObj = $el;
  this.board = new Board(this.SIZE);
  this.loop = null;
  this.setupDOMObj();
  this.bindEvents();
};

View.prototype.setupDOMObj = function () {
  for (var i = 0; i < this.SIZE[0]; i++) {
    this.domObj.append("<ul class='row' data-row='"+i+"'></ul>");
    for (var j = 0; j < this.SIZE[1]; j++) {
      $("ul[data-row="+i+"]")
        .append("<li class='col' data-pos='"+[i,j]+"'></li>");
    }
  }

  // $(".start-game").after("<p class='score'>Score: </p>");
};

View.prototype.step = function () {
  try{
    var boardInfo = this.board.render();

  }catch(e){
    clearInterval(this.loop);
    alert(e.message);
    this.loop = null;
    return;
  }

  var snake1 = boardInfo.snakeone;
  var snake2 = boardInfo.snaketwo;
  var apple = boardInfo.apple;
  $(".segment1").removeClass("segment1");
  $(".segment2").removeClass("segment2");
  $(".apple").text("");
  $(".apple").removeClass("apple");

  snake1.forEach(function(pos){
    $("li[data-pos='"+pos[1]+","+pos[0]+"']").addClass("segment1");
  });

  snake2.forEach(function(pos){
    $("li[data-pos='"+pos[1]+","+pos[0]+"']").addClass("segment2");
  });

  $("li[data-pos='"+apple[1]+","+apple[0]+"']").addClass("apple");

  $(".apple").text("\uD83C\uDF6C");
  // $(".score").text(this.board.score);
};

View.prototype.bindEvents = function () {
  var view = this;
  $(".start-game").on("click", function(e){
    e.preventDefault();
    if(view.loop === null){
      view.board.reset();
      view.loop = setInterval(view.step.bind(view), 250);
    }
  });

  var audio = document.getElementById("pokesong");
  var playpause = false;

  $(".pokesong").on("click", function(e){
    e.preventDefault();
    playpause = !playpause;

    if(playpause)
    {
      audio.pause();
      $(".pokesong").text("►");
    }
    else
    {
      audio.play();
      $(".pokesong").text("❚❚");
    }
  });

  $(".snake").focus();
  $(window).on("keydown", function(e){
    // console.log(e.keyCode);
    view.handleKeyPress(e.keyCode);
  });
};

View.prototype.handleKeyPress = function (keyCode) {
  var direction = "";
  switch (keyCode)
  {
    case 38:
      direction = "N";
      break;
    case 40:
      direction = "S";
      break;
    case 39:
      direction = "E";
      break;
    case 37:
      direction = "W";
      break;

    case 87:
      direction = "up";
      break;
    case 65:
      direction = "left";
      break;
    case 83:
      direction = "down";
      break;
    case 68:
      direction = "right";
      break;
  }

  this.board.move(direction);
};

module.exports = View;
