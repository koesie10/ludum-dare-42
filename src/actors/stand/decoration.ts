import * as ex from 'excalibur';
import {Resources} from '../../resources';

export class Decoration extends ex.Actor {
    constructor(x: number, y: number) {
        super(x, y, 30, 8);
        this.addDrawing(Resources.Textures.StandDecoration);
    }

    public onInitialize(engine: ex.Engine) {

    }
}
