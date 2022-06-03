import Phaser from 'phaser';


class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key);
        this.config = config;

        this.screenCenter = [config.width / 2, config.height / 2];

        this.fontSize = 34;
        this.linetHight = 42;
        this.fontStyle = '#FFF';
        this.fontOptions = {fontSize: `${this.fontSize}px`  , fill: `${this.fontStyle}`};


        console.log("BaseScene construtor is loaded");
        console.log("config is:", config);
    }

    create() {
        this.add.image(0,0, 'sky').setOrigin(0,0);
        //this.add.image(0,0, 'sky').setOrigin(0,0);
    }

    createMenu(menu, setupMenuEvents) {       
        let lastMenuPositionY = 0;
       
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY ];
            
            menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5,1);
            lastMenuPositionY += this.linetHight;

            
            setupMenuEvents(menuItem);
            
        })

    }

}

export default BaseScene;