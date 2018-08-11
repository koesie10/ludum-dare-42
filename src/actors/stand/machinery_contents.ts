import * as ex from 'excalibur';
import {Resources} from '@/resources';

export class MachineryContents extends ex.Actor {
    fillPercentage: number = 1;

    constructor(x: number, y: number) {
        super(x, y, 128, 128);
        this.scale = new ex.Vector(6, 6);
    }

    public onInitialize(engine: ex.Engine) {

    }


    draw(ctx: CanvasRenderingContext2D, delta: number): void {
        const height = Math.round(this.fillPercentage * 66);
        const y = 22 - height;

        ctx.fillStyle = 'rgba(255, 236, 39, 0.7)';
        ctx.fillRect(-56, y, 72, height);
    }
}
