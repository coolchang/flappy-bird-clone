import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;

//class PlayScene extends Phaser.Scene {
class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config);
        //this.config = config;

        this.bird = null;
        this.pipes = null;
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [500, 600];
        this.flapVelocity = 250;

        this.score = 0;
        this.scoreText = '';
        //this.bestScore = 0;
        
    }
   

    create() {
        //debugger
        //this.createBG();

        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();

        
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }


    createBG(){
        // debugger
        this.add.image(0,0, 'sky').setOrigin(0,0);
    }

    createBird(){
        //this.bird = this.physics.add.sprite(this.initialBirdPosition.x, this.initialBirdPosition.y,'bird').setOrigin(0,0);
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y ,'bird').setOrigin(0,0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.pipes = this.physics.add.group();
        for (let i = 0; i < PIPES_TO_RENDER; i++ ){           
            const upperPipe = this.pipes.create(0,0, 'pipe')
                .setImmovable(true)
                .setOrigin(0,1);
            const lowerPipe = this.pipes.create(0,0,'pipe').setOrigin(0,0);            
            this.placePipe(upperPipe, lowerPipe);  
        }

        // add velocity to the group of pipes
        this.pipes.setVelocityX(-200);
    }


    createColliders(){
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore(){
        this.score = 0;
        this.scoreText = this.add.text(16, 16, `Score: ${0}`,{fontSize: '32px', fill: '#000'});

        const bestScore = localStorage.getItem('bestScore');
        
        this.add.text(16,52, `BEST Score: ${bestScore || 0}`, {fontSize: '18px', fill: '#111'});

    }

    createPause(){
        
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
            .setScale(3)
            .setOrigin(1,1)
            .setInteractive();

        pauseButton.on('pointerdown', () => {
            // alert('Pause is clicked');
            console.log("pause is clicked");
            this.physics.pause();
            this.scene.pause();
        })
    }

    handleInputs() {

        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    checkGameStatus() {
        //console.log("bird.y:",bird.y);
        //console.log("config.height:", config.height )
        //if(this.bird.y >= this.config.height || this.bird.y <= 0 ) {
        if(this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0 ) {
            this.gameOver();
        }
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
              //increase Scores
              this.increaseScore();
              this.saveBestScore();
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

    saveBestScore() {
         //debugger

         const bestScoreText = localStorage.getItem('bestScore');
         const bestScore = bestScoreText && parseInt(bestScoreText, 10);
 
         if(!bestScore || this.score > bestScore) {
             localStorage.setItem('bestScore', this.score);
         }
    }


    gameOver() {
        // this.bird.x = this.config.startPosition.x;
        // this.bird.y = this.config.startPosition.y;
        // this.bird.body.velocity.y = 0;

        this.physics.pause();
        this.bird.setTint(0xb83784);
      
       this.saveBestScore();


        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        })
    }
      
    

    flap() {
        //console.log("this is shown");
        //console.log(this.bird.body);
        this.bird.body.velocity.y = -this.flapVelocity;
    }


    increaseScore() {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }

}

export default PlayScene;