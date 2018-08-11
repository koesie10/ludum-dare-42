import * as ex from 'excalibur';
import {Resources} from '@/resources';

export class Can extends ex.Actor {
    constructor(x: number, y: number) {
        super(x, y, 5, 7);
        this.addDrawing(Resources.Textures.StandCan);
    }

    public onInitialize(engine: ex.Engine) {

    }
}
