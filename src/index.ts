import * as ex from 'excalibur';
import {Main} from 'scenes/main/main';
import {Resources} from './resources';

class Game extends ex.Engine {
    constructor() {
        super({width: 1280, height: 720, displayMode: ex.DisplayMode.FullScreen});
        this.setAntialiasing(false);
        this.backgroundColor = ex.Color.fromHex('#696969');
    }

    public start() {
        const mainScene = new Main();

        game.add('main', mainScene);

        const loader = new ex.Loader();
        for (let type in Resources) {
            for (let key in Resources[type]) {
                loader.addResource(Resources[type][key]);
            }
        }

        return super.start(loader).then(() => {
            game.goToScene('main');
        });
    }
}

const game = new Game();

game.start();
