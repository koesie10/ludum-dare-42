import * as ex from 'excalibur';
import {Level1} from 'scenes/level1/level1';
import {Level2} from 'scenes/level2/level2';
import {GameOver} from 'scenes/gameover/gameover';
import {init, Resources} from './resources';

class Game extends ex.Engine {
    constructor() {
        super({width: 1280, height: 720, displayMode: ex.DisplayMode.FullScreen});
        this.setAntialiasing(false);
        this.backgroundColor = ex.Color.fromHex('#696969');
    }

    public start() {
        game.add('level1', new Level1());
        game.add('level2', new Level2());
        game.add('gameover', new GameOver());

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

            game.goToScene('level1');
        });
    }
}

const game = new Game();

game.start();
