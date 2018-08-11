import * as ex from 'excalibur';
import {Resources} from '../resources';

export enum Animation {
    IDLE = 0,
    GLASS = 1
}

export class Human extends ex.Actor {
    queueSpotX: number;
    queueSpotY: number;

    constructor(x: number, y: number) {
        super(x, y, 5, 7);

        this.scale = new ex.Vector(7, 7);
    }

    public onInitialize(engine: ex.Engine) {
        const playerSheet = new ex.SpriteSheet(Resources.Textures.HumanBlue, 2, 1, 7, 7);

        this.addDrawing(Animation.IDLE, playerSheet.getAnimationBetween(engine, 0, 1, 200));
        this.addDrawing(Animation.GLASS, playerSheet.getAnimationBetween(engine, 1, 2, 200));

        this.setDrawing(Animation.IDLE);
    }
}
