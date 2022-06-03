import Phaser from 'phaser';


const PIPES_TO_RENDER = 4;




class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.bird = null;
        this.pipes = null;
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [500, 600];
        this.flapVelocity = 200;

    }

    preload() {

        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird','assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {

        // debugger
        this.add.image(0,0, 'sky').setOrigin(0,0);
        //this.bird = this.physics.add.sprite(this.initialBirdPosition.x, this.initialBirdPosition.y,'bird').setOrigin(0,0);
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y ,'bird').setOrigin(0,0);
        this.bird.body.gravity.y = 400;

        this.pipes = this.physics.add.group();



        for (let i = 0; i < PIPES_TO_RENDER; i++ ){
           
            const upperPipe = this.pipes.create(0,0, 'pipe').setOrigin(0,1);
            const lowerPipe = this.pipes.create(0,0,'pipe').setOrigin(0,0);
            
            this.placePipe(upperPipe, lowerPipe);  

        }

        // add velocity to the group of pipes
        this.pipes.setVelocityX(-200);


        //bird.body.gravity.y = 200;  
        //console.log(bird.body.gravity.y);
        //debugger

        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);


        
        
    }

    update() {
         //console.log("bird.y:",bird.y);
        //console.log("config.height:", config.height )
        if(this.bird.y > this.config.height || this.bird.y < 0 - this.bird.height ) {
            this.restartBirdPosition();
        }

        this.recyclePipes();
    }

    placePipe(uPipe, lPipe) {

        //pipeHorizontalDistance += 400;
      
        const rightMostX = this.getRightMostPipe();
      
        const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
        
        //debugger
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
        
        
        // upperPipe = this.physics.add.sprite(pipeHorizontalDistance,pipeVerticalPosition,'pipe').setOrigin(0,1);
        // lowerPipe = this.physics.add.sprite(upperPipe.x,upperPipe.y + pipeVerticalDistance,'pipe').setOrigin(0,0);
      
        uPipe.x = rightMostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;
      
        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance;
      
      
        // lPipe.body.velocity.x = -200;
        // uPipe.body.velocity.x = -200;
      
      }

      recyclePipes() {

        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
          if (pipe.getBounds().right <= 0) {
            // recycle 
            
            tempPipes.push(pipe);
            if (tempPipes.length == 2){
              this.placePipe(...tempPipes);
            }
          }
        })
      }

      

    getRightMostPipe() {
        let rightMostX = 0;
    
        this.pipes.getChildren().forEach(function(pipe)  {
        rightMostX = Math.max(pipe.x, rightMostX);
        })
    
        return rightMostX;
  
  
    }

    restartBirdPosition() {
        this.bird.x = this.config.startPosition.x;
        this.bird.y = this.config.startPosition.y;
        this.bird.body.velocity.y = 0;
      
    }
      
    

    flap() {
        //console.log("this is shown");
        //console.log(this.bird.body);
        this.bird.body.velocity.y = -this.flapVelocity;
    }


}

export default PlayScene;