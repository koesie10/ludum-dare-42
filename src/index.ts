import * as ex from 'excalibur';
import {Main} from './scenes/main/main';
import {Resources} from './resources';

class Game extends ex.Engine {
    constructor() {
        super({width: 800, height: 600, displayMode: ex.DisplayMode.FullScreen});
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
