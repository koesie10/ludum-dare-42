import * as ex from 'excalibur';

import {Resources} from '@/resources';
import {Queue} from 'util/queue';

export enum Animation {
    IDLE = 0,
    WALKING = 1,
    SELECTED = 2,
    GLASS = 3
}

export enum State {
    WALKING_TO_QUEUE,
    IN_QUEUE,
    FRONT_OF_QUEUE,
    SERVED
}

export class Human extends ex.Actor {
    queueSpotX: number;
    queueSpotY: number;

    private _state: State = State.WALKING_TO_QUEUE;
    timeInState: number;
    patience: number;

    get state(): State {
        return this._state;
    }

    set state(state: State) {
        this._state = state;
        this.timeInState = 0;
    }

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

        this.setDrawing(Animation.IDLE);

        this.patience = ex.Util.randomIntInRange(10000, 30000);
    }

    update(engine: ex.Engine, delta: number): void {
        super.update(engine, delta);

        this.timeInState += delta;

        switch (this.state) {
            case State.IN_QUEUE:
                if (this.timeInState > this.patience) {
                    console.log(`${this.id}: in queue no patience`);
                }
                break;
            case State.FRONT_OF_QUEUE:
                if (this.timeInState > this.patience / 3) {
                    console.log(`${this.id}: front of queue no patience`);
                }
                break;
        }
    }

    public enterQueue(queue: Queue): void {
        this.state = State.IN_QUEUE;
    }

    public enterFrontOfQueue(queue: Queue, serve: () => void = null): void {
        this.state = State.FRONT_OF_QUEUE;
        this.enableCapturePointer = true;

        this.on('pointerdown', evt => {
            Resources.Sounds.Click.play();
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

    public leaveQueue(queue: Queue): void {
        this.state = State.SERVED;
    }
}
