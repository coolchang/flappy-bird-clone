import Phaser, { Scene } from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';


const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2};

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}


const Scenes = [PreloadScene, MenuScene, PlayScene];

// const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG))

const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {     
      debug: true      
    }    
  },
  scene: initScenes()
  //scene: [PreloadScene, new MenuScene(SHARED_CONFIG), new PlayScene(SHARED_CONFIG)]
  
  /*
  scene: {
    preload,
    create,
    update
  }
  */
}

//let bird = null;
// Group variable
//let pipes = null;

//const VELOCITY = 200;
//const flapVelocity = 200;
//const PIPES_TO_RENDER = 4;
//
// let upperPipe = null;
// let lowerPipe = null;


//let pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]);



const initialBirdPosition = {x: config.width * 0.1 , y:config.height/2 }












new Phaser.Game(config); 