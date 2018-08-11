import * as ex from 'excalibur';
import {Main} from 'scenes/main/main';
import {GameOver} from 'scenes/gameover/gameover';
import {init, Resources} from './resources';

class Game extends ex.Engine {
    constructor() {
        super({width: 1280, height: 720, displayMode: ex.DisplayMode.FullScreen});
        this.setAntialiasing(false);
        this.backgroundColor = ex.Color.fromHex('#696969');
    }

    public start() {
        const mainScene = new Main();
        const gameOverScene = new GameOver();

        game.add('main', mainScene);
        game.add('gameover', gameOverScene);

        const loader = new ex.Loader();
        for (let type in Resources) {
            for (let key in Resources[type]) {
                let resource = Resources[type][key];
                if (resource === null) {
                    continue;
                }
                loader.addResource(resource);
            }
        }

        return super.start(loader).then(() => {
            init(this);

            game.goToScene('main');
        });
    }
}

const game = new Game();

game.start();
