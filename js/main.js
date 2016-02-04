//list of keys currently being pressed
var activeKeys = [];

//access elements quicker
var character = $(".character");
var coin = $(".coin");
var box = $(".box");
var block = $(".block");

getBoxDimensions();

function getBoxDimensions(){
  boxRight = box.offset().left + box.width() +2;
  boxLeft = box.offset().left;
  boxTop = box.offset().top;
  boxBottom = box.offset().top + box.height() +2;
}

$(window).on("resize",function(){
  getBoxDimensions();
})


var coinCount = 0;
var deathCount = 0;
var ballCount = -1;

var ballActive = [];
var ballDirections = [];


var alive = false;
var paused = false;
var init = false;


var powerActive = false;
var power;
var blockValid = false;
var shielded = false;
var invincible = false;
var backwardsMovement = false;


var playerSpeed = 2;
var speedSlow = 1.5;
var speedMedium = 2;
var speedFast = 2.5;


var coinAmount = 1;





coinSpawn();
ballSpawn();



$(window).on('keydown', function(e){
  activeKeys[e.keyCode] = true;

  if(e.keyCode == 32 || e.keyCode == 13){
    if(alive == false){
        start();
    }
  }else if(e.keyCode == 27){
    pause();
  }
});

$(window).on('keyup', function(e){
  activeKeys[e.keyCode] = false;
})


var playing = setInterval(function(){
  play();
})





//player movement

function play(){



  //check character position
  characterRight = character.offset().left + character.width();
  characterLeft = character.offset().left;
  characterTop = character.offset().top;
  characterBottom = character.offset().top + character.height();

  blockRight = block.offset().left + block.width();
  blockLeft = block.offset().left;
  blockTop = block.offset().top;
  blockBottom = block.offset().top + block.height();


  //check direction
  if(activeKeys[39] || activeKeys[68]){
    if(backwardsMovement && boxLeft < characterLeft){
      move('left');
    }else if (boxRight > characterRight){
      move('right');
    }
  }
  if(activeKeys[37] || activeKeys[65]){
    if(backwardsMovement && boxRight > characterRight){
      move('right');
    }else if (boxLeft < characterLeft){
      move('left');
    }
  }
  if(activeKeys[38] || activeKeys[87]){
    if(backwardsMovement && boxBottom > characterBottom){
      move('down');
    }else if (boxTop < characterTop){
      move('up');
    }
  }
  if(activeKeys[40] || activeKeys[83]){
    if(backwardsMovement && boxTop < characterTop){
      move('up');
    }else if (boxBottom > characterBottom){
      move('down');
    }
  }


  //check if character is over coin
  if(touching(character,coin)){
    coinCount += coinAmount;
    coinCheck();
    coinSpawn();
  }

  //check if char is over block
  if(touching(character,block)){
    blockGot();
    blockValid = true;
  }



  //move and check balls
  for(i=ballCount;i>=0;i--){

    ballMove(i);

  }

}

function move(direction) {
  if(direction == 'right') {
    character.css({left: '+='+playerSpeed});
  }

  if(direction == 'left') {
    character.css({left: '-='+playerSpeed});
  }

  if(direction == 'up') {
    character.css({top: '-='+playerSpeed});
  }

  if(direction == 'down') {
    character.css({top: '+='+playerSpeed});

  }
}







//coin stuff

function coinSpawn(){
  //get random x,y for coin to spawn
  //coin is 25px, 34px size

  var tempX = Math.floor(Math.random() * 975) + 1;
  var tempY = Math.floor(Math.random() * 666) + 1;

  coin.css({"left":tempX,"top":tempY,"display":"block"});

  coinRight = coin.offset().left + coin.width();
  coinLeft = coin.offset().left;
  coinTop = coin.offset().top;
  coinBottom = coin.offset().top + coin.height();

}

function coinCheck(){
  if (coinCount%10 == 0 && coinCount != 0){
    ballSpawn();
    var temp1 = Math.floor(Math.random()*255)+1;
    var temp2 = Math.floor(Math.random()*255)+1;
    var temp3 = Math.floor(Math.random()*255)+1;

  }

  document.getElementById("coinCounter").innerHTML = "Coins: "+coinCount;
}










//ball stuff    spawn/movement

function ballSpawn(){

  ballCount++;

  var tempX = Math.floor(Math.random() * 950) + 1;
  var tempY = Math.floor(Math.random() * 650) + 1;

  var ball = "#ball"+ballCount;

  $(ball).css({"display":"block",left:tempX,right:tempY});

  var randomDirection = Math.floor(Math.random() * 8) + 1;


  switch(randomDirection){
      case(1):
        var direction = "upLeft";
        break;
      case(2):
        var direction = "upRight";
        break;
      case(3):
        var direction = "downLeft";
        break;
      case(4):
        var direction = "downRight";
        break;
      case(5):
        var direction = "upLeftSteep";
        break;
      case(6):
        var direction = "upRightSteep";
        break;
      case(7):
        var direction = "downLeftSteep";
        break
      case(8):
        var direction = "downRightSteep";
        break;
  }

  ballDirections[ballCount] = direction;

  ballActivator(ballCount);

}


function ballMove(num){

  var temp = "#ball"+num;

  var ballRight = $(temp).offset().left + $(temp).width();
  var ballLeft = $(temp).offset().left;
  var ballTop = $(temp).offset().top;
  var ballBottom = $(temp).offset().top + $(temp).height();




  var direction = ballDirections[num];

  if (ballRight > boxRight){
    if (direction == "upRight"){
      direction = "upLeft";
    }else if(direction == "downRight"){
      direction = "downLeft";
    }else if(direction == "upRightSteep"){
      direction = "upLeftSteep";
    }else if(direction == "downRightSteep"){
      direction = "downLeftSteep";
    }
  }else if(ballTop < boxTop){
    if (direction == "upRight"){
      direction = "downRight";
    }else if(direction == "upLeft"){
      direction = "downLeft";
    }else if(direction == "upRightSteep"){
      direction = "downRightSteep";
    }else if(direction == "upLeftSteep"){
      direction = "downLeftSteep";
    }
  }else if(ballLeft < boxLeft){
    if (direction == "downLeft"){
      direction = "downRight";
    }else if(direction == "upLeft"){
      direction = "upRight";
    }else if(direction == "downLeftSteep"){
      direction = "downRightSteep";
    }else if(direction == "upLeftSteep"){
      direction = "upRightSteep";
    }
  }else if(ballBottom > boxBottom){
    if (direction == "downRight"){
      direction = "upRight";
    }else if(direction == "downLeft"){
      direction = "upLeft";
    }else if(direction == "downRightSteep"){
      direction = "upRightSteep";
    }else if(direction == "downLeftSteep"){
      direction = "upLeftSteep";
    }
  }

  ballDirections[num] = direction;


  if (characterBottom > ballTop && characterTop < ballBottom && characterRight > ballLeft && characterLeft < ballRight){
      if(ballActive[num] && alive){
          if(shielded){

              character.css({"boxShadow":"none"});
              shieldedLoop = setInterval(function(){
                  shielded = false;
              },1500)

          }else if(invincible){

          }else{
              deathCount++;
              document.getElementById("deathCounter").innerHTML = "Deaths: "+deathCount;
              alive = false;
              deathCheck();
              $("#deathScreen,#blackBack").css({"display":"block"});
          }
      }
  }



  switch(direction){
      case("upLeft"):
          $(temp).css({left:'-='+speedSlow,top:'-='+speedMedium});
          break;
      case("upRight"):
          $(temp).css({left: '+='+speedSlow,top:'-='+speedMedium});
          break;
      case("downLeft"):
          $(temp).css({left:'-='+speedSlow,top:'+='+speedMedium});
          break;
      case("downRight"):
          $(temp).css({left: '+='+speedSlow,top:'+='+speedFast});
          break;
      case("upLeftSteep"):
          $(temp).css({left:'-='+speedSlow,top:'-='+speedFast});
          break;
      case("upRightSteep"):
          $(temp).css({left: '+='+speedSlow,top:'-='+speedFast});
          break;
      case("downLeftSteep"):
          $(temp).css({left:'-='+speedSlow,top:'+='+speedFast});
          break;
      case("downRightSteep"):
          $(temp).css({left: '+='+speedSlow,top:'+='+speedFast});
          break;
  }


}


function ballActivator(num){
  var temp = "#ball"+num;
  $(temp).animate({opacity:1},2000,function(){
    ballActive[num] = true;
  })
}
















//on death

function deathCheck(){
  if(alive){
    character.css({display:"block"});
    blockValid = true;
  }else{
    character.css({display:"none",width:50,height:50,"boxShadow":"none"});
    $(".ball").css({display:"none",opacity:0,width: 50,height: 50});
    $(".block").css({display:"none"});

    for(i = ballActive.length;i>=0;i--){
      ballActive[i] = false;
    }

    ballCount = -1;
    blockValid = false;

    shielded = false;
    invincible = false;
    backwardsMovement = false;


    playerSpeed = 2;
    speedSlow = 1.5;
    speedMedium = 2;
    speedFast = 2.5;
    coinAmount = 1;
  }
}










//on start


$(".start").on("click",function(){
    start();
})

$(".continue").on("click",function(){
    pause();
})

function start(){

  if (init == false){
    $(".box").animate({"width":1000,"height":700});
    $(".box").css({"width":1000,"height":700});
    $("body").animate({"paddingTop":50});
    $("body").css({"paddingTop":50});
    deathCheck();

    blockValid = true;

  }


  setInterval(function(){

    if (blockValid == true && powerActive == false){
      blockSpawn();
      blockValid = false;
    }

  },10000)



  alive = true;
  $("#startScreen,#blackBack,#deathScreen").css({"display":"none"});
  deathCheck();
  ballSpawn();
  coinSpawn();
  coinCount = 0;
  coinCheck();
  character.css({left:'0',top:'0'});
}



function pause(){
  if (paused){

    $("#pauseScreen,#blackBack").css({"display":"none"});
    paused = false;
    blockValid = true;
    playing = setInterval(function(){
      play();
    })


  }else{
    if(alive){
      clearInterval(playing);
      $("#pauseScreen,#blackBack").css({"display":"block"});
      paused = true;
      blockValid = false;
    }
  }
}








//mystery block stuff



function blockSpawn(){
  var tempX = Math.floor(Math.random() * 950) + 1;
  var tempY = Math.floor(Math.random() * 650) + 1;

  block.css({"left":tempX,"top":tempY,"display":"block","width":50,"height":50});
}

function blockGot(){
  if (alive){
    block.css({"display":"none"});


    powerLooping = true;
    while(powerLooping){

      var tempRandom = Math.floor(Math.random() * 100) + 1;


      powerActive = true;




      if(tempRandom <= 8){

        if (power == "playerBig"){
          powerLooping = true;
        }else{
          power = "playerBig";
          message("PLAYER BIG");
          powerLooping = false;

          character.animate({"width":100,"height":100},1000,function(){
            character.css({"width":100,"height":100});
          })


          powerLoop = setInterval(function(){
            powerActive = false;
            blockValid = true;
            character.animate({"width":50,"height":50},1000,function(){
                character.css({"width":50,"height":50});
            })
            clearInterval(powerLoop);

          },12000)
        }

      }else if(tempRandom > 8 && tempRandom <= 12){
        if (power == "playerSmall"){
          powerLooping = true;
        }else{
          power = "playerSmall";
          message("TINY");
          powerLooping = false;

          character.animate({"width":20,"height":20},1000,function(){
              character.css({"width":20,"height":20});
          })


          powerLoop = setInterval(function(){
            powerActive = false;
            blockValid = true;
            character.animate({"width":50,"height":50},1000,function(){
                character.css({"width":50,"height":50});
            })
            clearInterval(powerLoop);

          },15000)
        }

      }else if(tempRandom > 12 && tempRandom <= 20){
        if (power == "shield"){
          powerLooping = true;
        }else{
          if(shielded){
            power = "shield";
            message("SHIELDED");
            powerLooping = false;

            shielded = true;

            character.css({"boxShadow":"0 0 20px #00CCFF"});
            powerActive = false;
          }else{
            powerLooping = true;
          }
        }



      }else if(tempRandom > 20 && tempRandom <= 24){
        if (power == "invincible"){
          powerLooping = true;
        }else{
          power = "invincible";
          message("STAR");
          powerLooping = false;
          invincible = true;

          character.css({"boxShadow":"0 0 40px #FFFF47"});


          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            character.css({"boxShadow":"none"});
            clearInterval(powerLoop);
            powerLoop = setInterval(function(){
              invincible = false;
              clearInterval(powerLoop);
            },1000)

          },10000)
        }


      }else if(tempRandom > 24 && tempRandom <= 34){
        if (power == "playerFast"){
          powerLooping = true;
        }else{
          power = "playerFast";
          message("SPEEDY");
          powerLooping = false;

          playerSpeed += 2;

          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            playerSpeed -= 2;
            clearInterval(powerLoop);

          },10000)
        }


      }else if(tempRandom > 34 && tempRandom <= 44){
        if (power == "playerSlow"){
          powerLooping = true;
        }else{

          power = "playerSlow";
          message("SLOW DOWN");
          powerLooping = false;

          playerSpeed -= 1;

          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            playerSpeed += 1;
            clearInterval(powerLoop);

          },10000)
        }

      }else if(tempRandom > 44 && tempRandom <= 52){
        if (power == "ballsBig"){
          powerLooping = true;
        }else{

          power = "ballsBig";
          message("BIG OLE'");
          powerLooping = false;

          $(".ball").animate({"width":100,"height":100},1000,function(){
            $(".ball").css({"width":100,"height":100});
          })


          powerLoop = setInterval(function(){
            powerActive = false;
            blockValid = true;
            $(".ball").animate({"width":50,"height":50},1000,function(){
                $(".ball").css({"width":50,"height":50});
            })
            clearInterval(powerLoop);

          },12000)
        }

      }else if(tempRandom > 52 && tempRandom <= 60){
        if (power == "ballsSmall"){
          powerLooping = true;
        }else{

          power = "ballsSmall";
          message("SHRINK");
          powerLooping = false;

          $(".ball").animate({"width":20,"height":20},1000,function(){
            $(".ball").css({"width":20,"height":20});
          })


          powerLoop = setInterval(function(){
            powerActive = false;
            blockValid = true;
            $(".ball").animate({"width":50,"height":50},1000,function(){
                $(".ball").css({"width":50,"height":50});
            })
            clearInterval(powerLoop);

          },12000)
        }

      }else if(tempRandom > 60 && tempRandom <= 64){
        if (power == "ballsFast"){
          powerLooping = true;
        }else{

          power = "ballsFast";
          message("RUN");
          powerLooping = false;

          speedSlow += 1;
          speedMedium += 1;
          speedFast += 1;

          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            speedSlow -= 1;
            speedMedium -= 1;
            speedFast -= 1;
            clearInterval(powerLoop);

          },10000)
        }

      }else if(tempRandom > 64 && tempRandom <= 68){
        if (power == "ballsSlow"){
          powerLooping = true;
        }else{

          power = "ballsSlow";
          message("RELAX");
          powerLooping = false;

          speedSlow -= 1;
          speedMedium -= 1;
          speedFast -= 1;

          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            speedSlow += 1;
            speedMedium += 1;
            speedFast += 1;
            clearInterval(powerLoop);

          },10000)
        }

      }else if(tempRandom > 68 && tempRandom <= 72){
        if (power == "ballsReverse"){
          powerLooping = true;
        }else{

          power = "ballsReverse";
          message("WTF?");
          powerLooping = false;


          powerLoop = setInterval(function(){


            if (speedSlow > 0){
                speedSlow -= 0.015;
            }

            if (speedMedium > 0){
                speedMedium -= 0.02;
            }

            if (speedFast > 0){
                speedFast -= 0.025;
            }

            if(speedFast < 0 && speedMedium < 0 && speedSlow < 0){
              speedFast = 0;
              speedMedium = 0;
              speedSlow = 0;
              clearInterval(powerLoop);

              for(i=0; i<ballDirections.length; i++){
                  switch(ballDirections[i]){
                      case("upRight"):
                          ballDirections[i] = "downLeft";
                          break;
                      case("upRightSteep"):
                          ballDirections[i] = "downLeftSteep";
                          break;
                      case("downRight"):
                          ballDirections[i] = "upLeft";
                          break;
                      case("downRightSteep"):
                          ballDirections[i] = "upLeftSteep";
                          break;
                      case("downLeft"):
                          ballDirections[i] = "upRight";
                          break;
                      case("downLeftSteep"):
                          ballDirections[i] = "upRightSteep";
                          break;
                      case("upLeft"):
                          ballDirections[i] = "downRight";
                          break;
                      case("upLeftSteep"):
                          ballDirections[i] = "downRightSteep";
                          break;

                  }
                }

                powerLoop = setInterval(function(){

                  if (speedSlow < 1.5){
                    speedSlow += 0.015;
                  }

                  if (speedMedium < 2){
                    speedMedium += 0.02;
                  }

                  if (speedFast < 2.5){
                    speedFast += 0.025;
                  }

                  if(speedFast > 2.5 && speedMedium > 2 && speedSlow > 1.5){
                    speedFast = 2.5;
                    speedMedium = 2;
                    speedSlow = 1.5;

                    blockValid = true;
                    powerActive = false;

                    clearInterval(powerLoop);
                  }

                })

              }

          })
        }


      }else if(tempRandom > 72 && tempRandom <= 76){
        if (power == "slow"){
          powerLooping = true;
        }else{

          power = "slow";
          message("SLOW MO");
          powerLooping = false;

          speedSlow -= 1;
          speedMedium -= 1;
          speedFast -= 1;
          playerSpeed -=1;

          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            speedSlow += 1;
            speedMedium += 1;
            speedFast += 1;
            playerSpeed += 1;
            clearInterval(powerLoop);

          },10000)
        }


      }else if(tempRandom > 76 && tempRandom <= 84){
        if (power == "doubleCoins"){
          powerLooping = true;
        }else{

          power = "doubleCoins";
          message("x2");
          powerLooping = false;

          coinAmount = 2;

          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            coinAmount = 1;
            clearInterval(powerLoop);

          },15000)
        }



      }else if(tempRandom > 84 && tempRandom <= 92){
        if (power == "playerReverse"){
          powerLooping = true;
        }else{

          power = "playerReverse";
          message("OH F");
          powerLooping = false;

          backwardsMovement = true;

          powerLoop = setInterval(function(){

            powerActive = false;
            blockValid = true;
            backwardsMovement = false;
            clearInterval(powerLoop);

          },15000)
        }


      }else if(tempRandom > 92 && tempRandom <= 100){
        if (power == "ballsStop"){
          powerLooping = true;
        }else{

          power = "ballsStop";
          message("STOP");
          powerLooping = false;

          speedSlow = 0;
          speedMedium = 0;
          speedFast = 0;

          powerLoop = setInterval(function(){

              powerActive = false;
              blockValid = true;

              clearInterval(powerLoop);
              powerLoop = setInterval(function(){

                if (speedSlow < 1.5){
                   speedSlow += 0.015;
                }

                if (speedMedium < 2){
                  speedMedium += 0.02;
                }

                if (speedFast < 2.5){
                  speedFast += 0.025;
                }

                if(speedFast > 2.5 && speedMedium > 2 && speedSlow > 1.5){
                  speedFast = 2.5;
                  speedMedium = 2;
                  speedSlow = 1.5;

                  clearInterval(powerLoop);
                }

              })

          },10000)
        }


      }

    }
  }
}

//shows message of power up
function message(message){

  document.getElementById("message").innerHTML = message;
  $("#message").css({"display":"block"});
  $("#message").animate({"top":"30%"},1000,function(){
    $("#message").delay(400).animate({"top":"-30%"});
  })

}



//check if two objects are touching
//var example = $("player");

function touching(object1,object2){
  if (object1.offset().top + object1.height() > object2.offset().top && object1.offset().top < object2.offset().top + object2.height() && object1.offset().left + object1.width() > object2.offset().left && object1.offset().left < object2.offset().left + object2.width()){
    return true;
  }
}
