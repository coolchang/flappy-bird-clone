import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {

    constructor(config) {
        super('ScoreScene', {...config, canGoBack: true});
        //this.config = config;
    
    }

    create() {
       super.create();

       const bestScore = localStorage.getItem('bestScore');
       this.add.text(...this.screenCenter, `Score: ${bestScore || 0}`, this.fontOptions)
            .setOrigin(0.5);

        
    }
    
}

export default ScoreScene;