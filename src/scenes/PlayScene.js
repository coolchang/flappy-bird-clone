import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;

//class PlayScene extends Phaser.Scene {
class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config);
        //this.config = config;

        this.bird = null;
        this.pipes = null;
        this.isPaused = 


        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [500, 600];
        this.flapVelocity = 250;

        this.score = 0;
        this.scoreText = '';
        //this.bestScore = 0;

        this.currentDifficulty = 'easy';
        this.diffculties = {
            'easy': {
                pipeHorizontalDistanceRange: [300,350],
                pipeVerticalDistanceRange: [150, 200]
            },
            'normal': {
                pipeHorizontalDistanceRange: [280,330],
                pipeVerticalDistanceRange: [140, 190]
            },
            'hard': {
                pipeHorizontalDistanceRange: [250,310],
                pipeVerticalDistanceRange: [130, 180]
            }
        }        
    }
   

    create() {
        //debugger
        //this.createBG();

        this.currentDifficulty = 'easy';

        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
        this.listenToEvent();

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {start: 9, end: 15}),
            frameRate: 8,
            repeat: -1
        });

        this.bird.play('fly');

    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }

    listenToEvent() {
        this.events.on('resume', () => {

            console.log("resume event is called");

            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                //callback: () => console.log(this.initialTime--),
                callback: this.countDown,
                callbackScope: this,
                loop: true
            })
        })
    }

    countDown() {
        this.initialTime--;
        this.countDownText.setText('Fly in: ' + this.initialTime);
        if(this.initialTime <= 0) {
            this.isPaused = false;
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }



    createBG(){
        // debugger
        this.add.image(0,0, 'sky').setOrigin(0,0);
    }

    createBird(){
        //this.bird = this.physics.add.sprite(this.initialBirdPosition.x, this.initialBirdPosition.y,'bird').setOrigin(0,0);
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y ,'bird')
            .setFlip(true)
            .setScale(3)
            .setOrigin(0,0);

        this.bird.setBodySize(this.bird.width, this.bird.height - 8);

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
        this.isPaused = false;
        
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
            .setScale(3)
            .setOrigin(1,1)
            .setInteractive();

        pauseButton.on('pointerdown', () => {
            // alert('Pause is clicked');
            
            console.log("pause is clicked");
            
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();

            this.scene.launch('PauseScene');

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
        
        const difficulty = this.diffculties[this.currentDifficulty];

        const rightMostX = this.getRightMostPipe();
        const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
        
        //debugger
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
        
        
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
              this.increaseDifficulty();

            }
          }
        })
      }

      increaseDifficulty() {

        if (this.score === 1) {
            this.currentDifficulty = 'normal';
            console.log("Game difficulty is now", this.currentDifficulty );
        }

        if (this.score === 3) {
            this.currentDifficulty = 'hard';
            console.log("Game difficulty is now", this.currentDifficulty );
        }


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

        if (this.isPaused) {
            return;
        }

        this.bird.body.velocity.y = -this.flapVelocity;

        // 마우스 이벤트 invoking 함수 (참고하세요!) , SoundEffect 플레이한다
         this.input.on("pointerdown", this.playSoundEffect, this);
    }


    increaseScore() {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    // 영어 단어 발음 플레이어 (현재는 인자 없음)
    playSoundEffect(){
        //this.sound.playAudioSprite('voca_sprite', 'admirable');
        //this.sound.playAudioSprite('voca_sprite', 'adolescence');
        //this.sound.playAudioSprite('voca_sprite', 'adoration');
        //this.sound.playAudioSprite('voca_sprite', 'artistically');
    }

}

export default PlayScene;