import BaseScene from './BaseScene';

class MenuScene extends BaseScene {

    constructor(config) {
        super('MenuScene',config);
        this.config = config;
    
        this.menu = [
           {scene: 'PlayScene', text: 'Play'},
           {scene: 'ScoreScene', text: 'Score'},
           {Scene: null, text: 'Exit'}
        ]
    }

    create() {
       super.create();
        
        //this.scene.start('PlayScene');;;
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    }
    
    setupMenuEvents(menuItem) {
        const textGO = menuItem.textGO;
    
        textGO.setInteractive();

        textGO.on('pointerover', () => {
            textGO.setStyle({fill: '#ff0'});
        });
        
        textGO.on('pointerout', () => {
            textGO.setStyle({fill: '#fff'});            
        });

        textGO.on('pointerup', () => {
           // alert('Option clicked');
            
            // menuItme이 scene 를 가지고 있으면 menuItem.scene 에 해당하는 scene 실행시키라
            menuItem.scene && this.scene.start(menuItem.scene);

            if(menuItem.text === 'Exit'){
                this.game.destroy(true);
            }

        });

    }
}

export default MenuScene;