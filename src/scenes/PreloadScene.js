import Phaser from 'phaser';


class PreloadScene extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
        //this.config = config;
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        //this.load.image('bird','assets/bird.png');
        this.load.spritesheet('bird', 'assets/birdSprite.png', {frameWidth: 16, frameHeight: 16});
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pause', 'assets/pause.png');
        this.load.image('back', 'assets/back.png');

         // 오디오 스프라이트 로드 voca_sprite 
         
         this.load.audioSprite('voca_sprite', 'assets/SoundEffects/voca_mixdown.json', [
            'assets/audio/SoundEffects/15_001_030.mp3',
            'assets/audio/SoundEffects/15_001_030.mp3'
        ]);
        
    }

    create() {
        
        console.log("PreloadScene create funciton is loaded");
        this.scene.start('MenuScene');
    }
   

}

export default PreloadScene;