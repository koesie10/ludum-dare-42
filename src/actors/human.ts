import * as ex from 'excalibur';

import {Resources} from '@/resources';
import {Queue} from 'util/queue';

export enum Animation {
    IDLE = 0,
    SELECTED = 1,
    GLASS = 2
}

export class Human extends ex.Actor {
    queueSpotX: number;
    queueSpotY: number;

    constructor(x: number, y: number) {
        super(x, y, 5, 7);

        this.scale = new ex.Vector(7, 7);
    }

    public onInitialize(engine: ex.Engine) {
        const playerSheet = new ex.SpriteSheet(Resources.Textures.HumanBlue, 3, 1, 7, 7);

        this.addDrawing(Animation.IDLE, playerSheet.getAnimationBetween(engine, 0, 1, 200));
        this.addDrawing(Animation.SELECTED, playerSheet.getAnimationBetween(engine, 1, 2, 200));
        this.addDrawing(Animation.GLASS, playerSheet.getAnimationBetween(engine, 2, 3, 200));

        this.setDrawing(Animation.IDLE);
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
