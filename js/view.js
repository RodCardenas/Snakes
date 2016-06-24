var Board = require("./board");

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
};

View.prototype.bindEvents = function () {
  var view = this;

  view.addStartGame();
  view.addMusic();
  view.addPlayersSelection();

  $(".snake").focus();
  $(window).on("keydown", function(e){
    view.handleKeyPress(e.keyCode);
  });
};

View.prototype.addStartGame = function () {
  var view = this;
  $(".start-game").on("click", function(e){
    e.preventDefault();
    if(view.loop === null){
      view.board.reset();
      view.loop = setInterval(view.step.bind(view), 250);
    }
  });
};

View.prototype.addMusic = function () {
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
};

View.prototype.addPlayersSelection = function () {
  var view = this;

  $("#players-label").on("click", function(e){
    if($("#players").prop('checked')){
      if($("#color").length){
        view.removeSnakeColorOption();
      }
      view.removePlayerInstructions("red");
      view.removePlayerInstructions("blue");
      view.addPlayerInstructions("red");
      $('<div />', { id:"instructions-spacer", class:"spacer"}).appendTo($(".instructions-container"));
      view.addPlayerInstructions("blue");
    } else {
      view.addSnakeColorOption();
    }
  });
};


View.prototype.removeSnakeColorOption = function() {
  $("#color").remove();
  $("#color-label").remove();
  $("#selector-spacer").remove();
};

View.prototype.addSnakeColorOption = function() {
  var container = $(".selectors-container");
  var view = this;

  //add elements
  $('<div />', { id:"selector-spacer", class:"spacer"}).appendTo(container);
  $('<input />', { type: 'checkbox', id: "color", class:"tgl tgl-flip"}).appendTo(container);
  $('<label />', { 'for': 'color', id: "color-label", tagOff:"웃", tagOn:"웃", class:"tgl-btn"}).appendTo(container);

  //remove old instructions
  if($("#blue-instructions").length){
    view.removePlayerInstructions("blue");
  }

  if ($("#red-instructions").length) {
    view.removePlayerInstructions("red");
  }
  $("#instructions-spacer").remove();

  view.addPlayerInstructions("red");
  //add event listener
  $("#color-label").on("click", function(e){
    if($("#color").prop('checked')){
      view.addPlayerInstructions("red");
      view.removePlayerInstructions("blue");
    } else {
      view.addPlayerInstructions("blue");
      view.removePlayerInstructions("red");
    }
  });
};

View.prototype.addPlayerInstructions = function (color) {
  var instructions = color + "-instructions";

  $('<div />', { id:instructions, class:"instructions"}).appendTo($(".instructions-container"));

  var instructionsEl = $("#" + color + "-instructions");

  if (color === "red") {
    instructionsEl.append($('<img />', { src:"./img/LUDR.png"}));
    instructionsEl.append($('<br />'));
    $('<em />', {class:"fire", text:"Red Snake"}).appendTo(instructionsEl);
  } else {
    instructionsEl.append($('<img />', { src:"./img/WASD.png"}));
    instructionsEl.append($('<br />'));
    $('<em />', {class:"water", text:"Blue Snake"}).appendTo(instructionsEl);
  }
};
View.prototype.removePlayerInstructions = function (color) {
  $("#" + color + "-instructions").remove();
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
