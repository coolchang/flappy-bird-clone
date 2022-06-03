import Phaser from 'phaser';


const config = {
  
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        //x: 0,
        //y: 200
      },
      debug: true      
    }    
  },
  scene: {
    preload,
    create,
    update
  }
}

let bird = null;
// Group variable
let pipes = null;

const VELOCITY = 200;
const flapVelocity = 250;
const PIPES_TO_RENDER = 14;

// let upperPipe = null;
// let lowerPipe = null;

//let pipeHorizontalDistance = 0;



const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [500, 600];

//let pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]);



const initialBirdPosition = {x: config.width * 0.1 , y:config.height/2 }

function preload(){
  console.log('preloading');
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird','assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
  
  //debugger
}

function create(){
  this.add.image(0,0, 'sky').setOrigin(0,0);
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y,'bird').setOrigin(0,0);
  bird.body.gravity.y = 400;

  pipes = this.physics.add.group();



  for (let i = 0; i < PIPES_TO_RENDER; i++ ){

    // pipeHorizontalDistance += 400; 
    // let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    // let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
    
    // const upperPipe = this.physics.add.sprite(0,0, 'pipe').setOrigin(0,1);
    // const lowerPipe = this.physics.add.sprite(0,0,'pipe').setOrigin(0,0);
  
     const upperPipe = pipes.create(0,0, 'pipe').setOrigin(0,1);
     const lowerPipe = pipes.create(0,0,'pipe').setOrigin(0,0);
    
    placePipe(upperPipe, lowerPipe);  

  }

  // add velocity to the group of pipes
  pipes.setVelocityX(-200);


  //bird.body.gravity.y = 200;  
  //console.log(bird.body.gravity.y);
  //debugger

  this.input.on('pointerdown', flap);
}

function flap() {
  //console.log("this is shown");
  bird.body.velocity.y = -flapVelocity;
}

function update(){
  //console.log("bird.y:",bird.y);
  //console.log("config.height:", config.height )
  if(bird.y > config.height || bird.y < 0 - bird.height ) {
    restartBirdPosition();
  }
}

function placePipe(uPipe, lPipe) {

  //pipeHorizontalDistance += 400;

  const rightMostX = getRightMostPipe();

  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
  
  
  // upperPipe = this.physics.add.sprite(pipeHorizontalDistance,pipeVerticalPosition,'pipe').setOrigin(0,1);
  // lowerPipe = this.physics.add.sprite(upperPipe.x,upperPipe.y + pipeVerticalDistance,'pipe').setOrigin(0,0);

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;


  // lPipe.body.velocity.x = -200;
  // uPipe.body.velocity.x = -200;

}

function getRightMostPipe() {
  let rightMostX = 0;

  pipes.getChildren().forEach(function(pipe)  {
    rightMostX = Math.max(pipe.x, rightMostX);
  })

  return rightMostX;


}


function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;

}

new Phaser.Game(config); 