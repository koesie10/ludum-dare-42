import * as ex from 'excalibur';
import {Resources} from '@/resources';

export class Player extends ex.Actor {
    constructor(x: number, y: number) {
        super(x, y, 5, 7);
        this.addDrawing(Resources.Textures.HumanRed);
        this.scale = new ex.Vector(7, 7);
        this.rotation = Math.PI;
    }

    public onInitialize(engine: ex.Engine) {

    }
}
