var activeKeys = [];

//access elements quicker
var player = $("#player");
var gameArea = $("#gameArea");
var coin = $("#coin");

//dimension of game area

var gameAreaRight = gameArea.offset().left + gameArea.width();
var gameAreaLeft = gameArea.offset().left;
var gameAreaTop = gameArea.offset().top;
var gameAreaBottom = gameArea.offset().top + gameArea.height();

var coinCount = 0;


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


coinSpawn();



//the whole game loop
playLoop = setInterval(function(){

  //get position of player
  playerRight = player.offset().left + player.width();
  playerLeft = player.offset().left;
  playerTop = player.offset().top;
  playerBottom = player.offset().top + player.height();



  if(activeKeys[39] || activeKeys[68]){
    if(gameAreaRight > playerRight){
      move('right');
    }
  }

  if(activeKeys[37] || activeKeys[65]){
    if(gameAreaLeft < playerLeft){
      move('left');
    }
  }

  if(activeKeys[38] || activeKeys[87]){
    if(gameAreaTop < playerTop){
      move('up');
    }
  }
  if(activeKeys[40] || activeKeys[83]){
    if(gameAreaBottom > playerBottom){
      move('down');
    }
  }
})


//moves character when a key is active
function move(direction){
  if(direction == "up"){
    player.css({"top": "-=1.5px"});
  }
  if(direction == "right"){
    player.css({"left": "+=1.5px"});
  }
  if(direction == "down"){
    player.css({"top": "+=1.5px"});
  }
  if(direction == "left"){
    player.css({"left": "-=1.5px"});
  }
}

//coin stuff
function coinSpawn(){
    //get random x,y for coin to spawn
    //coin is 25px, 34px size

    var tempX = Math.floor(Math.random() * 775) + 1;
    var tempY = Math.floor(Math.random() * 566) + 1;

    coin.css({"left":tempX,"top":tempY,"display":"block"});

    coinRight = coin.offset().left + coin.width();
    coinLeft = coin.offset().left;
    coinTop = coin.offset().top;
    coinBottom = coin.offset().top + coin.height();

}
