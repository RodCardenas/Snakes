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
    if(e.message.includes("Red")){
      $("#loser").attr("src", "http://giphy.com/embed/SKkHndWFqOjjG?html5=true");
      $(".modal-content").css("background-color", "rgb(0,150,255)");
    } else {
      $("#loser").attr("src", "http://giphy.com/embed/3VQDfP4q4ZYyY?html5=true");
      $(".modal-content").css("background-color", "rgb(255,40,0)");
    }

    $("#reason").text(e.message);
    $("#gameover").css({display: "block"});
    $("#players-label").show();
    $("#color-label").show();
    $(".start-game").css("display", "block");
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
  view.addModalInteraction();

  $(".snake").focus();
  $(window).on("keydown", function(e){
    view.handleKeyPress(e.keyCode);
  });
};

View.prototype.addStartGame = function () {
  var view = this;

  $(".snake").on("click", function(e){
    e.preventDefault();
    if(view.loop === null){
      $(".start-game").css("display", "none");
      $("#players-label").hide("slow");
      $("#color-label").hide("slow");
      view.board.reset();
      view.loop = setInterval(view.step.bind(view), 250);
    }
  });

  $(".start-game").on("click", function(e){
    e.preventDefault();
    if(view.loop === null){
      $(".start-game").css("display", "none");
      $("#players-label").hide("slow");
      $("#color-label").hide("slow");
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
      $(".pokesong").attr("src","./img/play.png");
    }
    else
    {
      audio.play();
      $(".pokesong").attr("src","./img/mute.png");
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
      view.board.ai = false;
    } else {
      view.addSnakeColorOption();
      view.board.ai = true;
    }
  });
};

View.prototype.removeSnakeColorOption = function() {
  $("#color").remove();
  $("#color-label").remove();
  $("#selector-spacer").remove();
  this.board.removeSmartSnake();
};

View.prototype.addSnakeColorOption = function() {
  var container = $(".selectors-container");
  var view = this;

  $('<div />', { id:"selector-spacer", class:"spacer"}).appendTo(container);
  $('<input />', { type: 'checkbox', id: "color", class:"tgl tgl-flip"}).appendTo(container);
  $('<label />', { 'for': 'color', id: "color-label", tagOff:"웃", tagOn:"웃", class:"tgl-btn"}).appendTo(container);

  if($("#blue-instructions").length){
    view.removePlayerInstructions("blue");
  }

  if ($("#red-instructions").length) {
    view.removePlayerInstructions("red");
  }
  $("#instructions-spacer").remove();

  view.addPlayerInstructions("red");
  view.board.setSmartSnake("Blue");

  $("#color-label").on("click", function(e){
    if($("#color").prop('checked')){
      view.addPlayerInstructions("red");
      view.removePlayerInstructions("blue");
      view.board.setSmartSnake("Blue");
    } else {
      view.addPlayerInstructions("blue");
      view.removePlayerInstructions("red");
      view.board.setSmartSnake("Red");
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

View.prototype.addModalInteraction = function(){
  var modal = $("#gameover");

  $(".close").on("click", function() {
    modal.css({display: "none"});
  });

  window.onclick = function(event) {
    if (event.target.id === "gameover" ) {
      modal.css({display: "none"});
    }
  };
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

window.mobilecheck = function () {
  var check = false;
  (function (a) {
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
    check = true;
  })(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

module.exports = View;
