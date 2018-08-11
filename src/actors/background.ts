import * as ex from 'excalibur';
import {Resources} from '@/resources';

export class Background extends ex.Actor {
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.anchor = new ex.Vector(0, 0);
        this.addDrawing(Resources.Textures.Background);
    }
}
