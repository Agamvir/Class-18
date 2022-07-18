var trex, trex_running, trex_collided;
var ground, groundImage;
var invisibleGround;
var cloud,cloudImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var cloudsGroup, obstacleGroup;
var gameState;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOverImage;
var restart, restartImage;
var jumpSound;
var checkpointSound;
var dieSound;
var highScore;


var trex ,trex_running;
function preload(){

    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trex_collided = loadAnimation("trex_collided.png");
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
    gameOverImage = loadImage("gameOver.png");
    restartImage = loadImage("restart.png");
    jumpSound = loadSound("jump.mp3");
    checkpointSound = loadSound("checkpoint.mp3");
    dieSound = loadSound("die.mp3");

}

function setup(){

    createCanvas(windowWidth, windowHeight);
    
    //create a trex sprite
    trex = createSprite(50, height-70, 20, 50);
    trex.addAnimation("running",trex_running);
    trex.addAnimation("collided",trex_collided);
    trex.scale = 0.5;
    trex.x = 50;
    //trex.debug = false;
    //trex.setCollider("rectangle", 0, 0, 200, trex.height);
 
    //create the invisible ground sprite
    invisibleGround = createSprite(width/2, height-40, width, 5);
    invisibleGround.visible = false;

    //create the ground sprite
    ground = createSprite(width/2, height-50, 400, 20);
    ground.addImage("ground",groundImage)
    ground.x = ground.width / 2
    
    score = 0;

    highScore = 0;

    // creation of groups
    cloudsGroup = new Group();
    obstacleGroup = new Group();

    // create gameOver sprite.
    gameOver = createSprite(window.width/2,window.height/2);
    gameOver.addImage("gameOver", gameOverImage);
    gameOver.scale = 2.5;

    restart = createSprite(window.width/2,window.height/1.5);
    restart.addImage("restart", restartImage);
    restart.scale = 1.5
}


function draw(){
    background("white");



    console.log(trex.y)
    drawSprites();

    if(gameState === PLAY){

      if (keyDown ("space")||touches.length) {
        trex.velocityY = -10;
        jumpSound.play();
        touches = [];
      }

      if (ground.x<0){
        ground.x = ground.width/2;
      }

      //play a sound when the score surpasses a multiple of 100
      if(score > 0 && score % 100 == 0){
        checkpointSound.play();
      }

      drawClouds();
    
      drawObs();

      score = score + Math.round(getFrameRate()/60);

      //condition to alternate from play state to end state

      if(obstacleGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
        
        //trex.velocityY = -10;
        //jumpSound.play();
      }

      ground.velocityX = -2;
      gameOver.visible = false;
      restart.visible = false;

    }
    else if(gameState === END){
      trex.changeAnimation("collided", trex_collided);
      ground.velocityX = 0;
      trex.velocityY = 0;
      obstacleGroup. setVelocityXEach(0);
      cloudsGroup. setVelocityXEach(0);
      obstacleGroup. setLifetimeEach(-1);
      cloudsGroup. setLifetimeEach(-1);
      gameOver.visible = true;
      restart.visible = true;
      
      if (mousePressedOver(restart)||touches.length>0){
        reset();
        touches = [];
      }

      if (gameState === END && highScore < score){
        highScore = score;
      }
        
      }

    textSize(22);
    fill("red");
    text("Score: "+score, width/1.2, 40);

    textSize(22);
    fill("gray");
    text("High Score: "+highScore, width/1.5, 40);

    trex.velocityY = trex.velocityY + 0.8;
    trex.collide(invisibleGround);



}



// function for making clouds
function drawClouds(){
  if(frameCount % 60 == 0){
    // creating cloud sprite
    cloud = createSprite(600, 80, 10, 20);
    cloud.addImage("cloud", cloudImage);
    cloud.velocityX = -3;
    cloud.scale = 0.5;
    // instruct the program to give clouds random height
    cloud.y = Math.round(random(40, 500));
    // set the depth so the trex goes in front of the clouds
    trex.depth = cloud.depth;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 200;
    cloudsGroup.add(cloud);
  }
}

    // function for making obstacles
function drawObs(){
    if(frameCount % 80 == 0){
    // create obstacle sprite
    obstacle = createSprite(600, width/2.2, 10, 20);
    obstacle.velocityX = -(6+3*score/100);

    var num = Math.round(random(1, 6));
    
    switch(num) {
      case 1: obstacle.addImage(obstacle1);
      break;
        
      case 2: obstacle.addImage(obstacle2);
      break;

      case 3: obstacle.addImage(obstacle3);
      break;
        
      case 4: obstacle.addImage(obstacle4);
      break;

      case 5: obstacle.addImage(obstacle5);
      break;
        
      case 6: obstacle.addImage(obstacle6);
      break;

      default: break;
    }

    obstacle.lifetime = 100;
    obstacle.scale = 0.4;
    obstacleGroup.add(obstacle);
  }
}

function reset(){
    score = 0;
    gameState = PLAY;
    cloudsGroup.destroyEach();
    obstacleGroup.destroyEach();
    trex.changeAnimation("running", trex_running);
}