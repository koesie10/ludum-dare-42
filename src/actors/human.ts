import * as ex from 'excalibur';

import {Resources} from '@/resources';
import {Queue} from 'util/queue';

export enum Animation {
    IDLE = 0,
    WALKING = 1,
    SELECTED = 2,
    GLASS = 3
}

export class Human extends ex.Actor {
    queueSpotX: number;
    queueSpotY: number;

    constructor(x: number, y: number) {
        super(x, y, 5, 7);

        this.scale = new ex.Vector(7, 7);
    }

    public onInitialize(engine: ex.Engine) {
        const playerSheet = new ex.SpriteSheet(Resources.Textures.HumanBlue, 6, 1, 7, 7);

        this.addDrawing(Animation.IDLE, playerSheet.getAnimationBetween(engine, 0, 1, 200));
        this.addDrawing(Animation.WALKING, playerSheet.getAnimationBetween(engine, 0, 4, 250));
        this.addDrawing(Animation.SELECTED, playerSheet.getAnimationBetween(engine, 4, 5, 200));
        this.addDrawing(Animation.GLASS, playerSheet.getAnimationBetween(engine, 5, 6, 200));

        this.setDrawing(Animation.WALKING);
    }

    public enterFrontOfQueue(queue: Queue, serve: () => void = null) {
        this.enableCapturePointer = true;

        this.on('pointerdown', evt => {
            if (serve) {
                serve();
            }
        });

        this.on('pointerenter', evt => {
            this.setDrawing(Animation.SELECTED);
        });

        this.on('pointerleave', evt => {
            this.setDrawing(Animation.IDLE);
        });
    }
}
