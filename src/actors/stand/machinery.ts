import * as ex from 'excalibur';
import {Resources} from '@/resources';

export enum Animation {
    IDLE = 0,
    POUR = 1
}

export class Machinery extends ex.Actor {
    pourAnimation: ex.Animation;
    pouring: boolean = false;

    constructor(x: number, y: number) {
        super(x, y, 128, 128);
        this.scale = new ex.Vector(6, 6);
    }

    public onInitialize(engine: ex.Engine) {
        const sheet = new ex.SpriteSheet(Resources.Textures.Machinery, 13, 1, 128, 128);

        this.pourAnimation = sheet.getAnimationBetween(engine, 1, 13, 280);
        this.pourAnimation.loop = false;

        this.addDrawing(Animation.IDLE, sheet.getAnimationBetween(engine, 0, 1, 200));
        this.addDrawing(Animation.POUR, this.pourAnimation);

        this.setDrawing(Animation.IDLE);
    }

    /**
     * @param onDone
     *
     * @return boolean False if already working, true if machine available and has started working
     */
    public startPouring(onDone: () => void): boolean {
        if (this.pouring) {
            return false;
        }

        this.pouring = true;

        this.pourAnimation.reset();
        this.setDrawing(Animation.POUR);

        Resources.Sounds.Pour.play();

        const timer = new ex.Timer(() => {
            if (!this.pourAnimation.isDone()) {
                return;
            }
            timer.cancel();

            this.setDrawing(Animation.IDLE);

            this.pouring = false;
            onDone();
        }, 100, true);

        this.scene.addTimer(timer);

        return true;
    }
}
