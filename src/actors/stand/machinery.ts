import * as ex from 'excalibur';
import {Resources} from '@/resources';

export enum Animation {
    IDLE = 0,
    POUR = 1
}

export class Machinery extends ex.Actor {
    pourAnimation: ex.Animation;

    constructor(x: number, y: number) {
        super(x, y, 128, 128);
        this.scale = new ex.Vector(6, 6);
    }

    public onInitialize(engine: ex.Engine) {
        const sheet = new ex.SpriteSheet(Resources.Textures.Machinery, 13, 1, 128, 128);

        this.pourAnimation = sheet.getAnimationBetween(engine, 1, 13, 200);
        this.pourAnimation.loop = false;

        this.addDrawing(Animation.IDLE, sheet.getAnimationBetween(engine, 0, 1, 200));
        this.addDrawing(Animation.POUR, this.pourAnimation);

        this.setDrawing(Animation.IDLE);
    }
}
