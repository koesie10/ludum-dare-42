import * as ex from 'excalibur';
import {Resources} from '@/resources';
import {Can} from './can';
import {Decoration} from './decoration';

export class Stand extends ex.Actor {
    constructor(x: number, y: number) {
        super(x, y, 30, 8);
        this.addDrawing(Resources.Textures.StandBase);
        this.scale = new ex.Vector(8, 8);
    }

    public onInitialize(engine: ex.Engine) {
        this.add(new Can(9, -2.5));
        this.add(new Decoration(0, 0));
    }
}
