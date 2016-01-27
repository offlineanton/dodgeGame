var activeKeys = [];

//access elements quicker
var player = $("#player");
var gameArea = $("#gameArea");

// List of keyCodes I might use

/*
up = 38
right = 39
down = 40
left = 37

w = 87
d = 68
s = 83
a = 65

enter = 13
esc = 27
space = 32
*/


//adds key to activeKey list when its being pressed down
$(window).on("keydown",function(e){
  activeKeys[e.keyCode] = true;
})

$(window).on("keyup",function(e){
  activeKeys[e.keyCode] = false;
})

playLoop = setInterval(function(){
  if(activeKeys[39] || activeKeys[68]){
    move('right');
  }
  if(activeKeys[37] || activeKeys[65]){
    move('left');
  }
  if(activeKeys[38] || activeKeys[87]){
    move('up');
  }
  if(activeKeys[40] || activeKeys[83]){
    move('down');
  }
})

function move(direction){
  if(direction == "up"){
    player.css({"top": "-=1px"});
  }
  if(direction == "right"){
    player.css({"left": "+=1px"});
  }
  if(direction == "down"){
    player.css({"top": "+=1px"});
  }
  if(direction == "left"){
    player.css({"left": "-=1px"});
  }
}
