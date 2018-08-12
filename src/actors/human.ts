import * as ex from 'excalibur';

import {Resources} from '@/resources';
import {Queue} from 'util/queue';

export enum Animation {
    IDLE,
    WALKING,
    SELECTED,
    GLASS,
    PATIENCE,
}

export enum State {
    WALKING_TO_QUEUE,
    IN_QUEUE,
    FRONT_OF_QUEUE,
    SERVING,
    SERVED
}

export class Human extends ex.Actor {
    queueSpotX: number;
    queueSpotY: number;
    queue: Queue = null;

    private _state: State = State.WALKING_TO_QUEUE;
    timeInState: number;
    patience: number;

    private _outOfPatience: boolean = false;

    get outOfPatience(): boolean {
        return this._outOfPatience;
    }

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
        const playerSheet = new ex.SpriteSheet(Resources.Textures.HumanBlue, 12, 1, 7, 7);

        this.addDrawing(Animation.IDLE, playerSheet.getAnimationBetween(engine, 0, 1, 200));
        this.addDrawing(Animation.WALKING, playerSheet.getAnimationBetween(engine, 0, 4, 250));
        this.addDrawing(Animation.SELECTED, playerSheet.getAnimationBetween(engine, 4, 5, 200));
        this.addDrawing(Animation.GLASS, playerSheet.getAnimationBetween(engine, 5, 9, 250));
        this.addDrawing(Animation.PATIENCE, playerSheet.getAnimationBetween(engine, 9, 12, 250));

        this.setDrawing(Animation.IDLE);

        this.patience = ex.Util.randomIntInRange(20000, 60000);
    }

    update(engine: ex.Engine, delta: number): void {
        super.update(engine, delta);

        this.timeInState += delta;

        if (this.queue === null || !this.queue.options.patienceEnabled) {
            return;
        }

        switch (this.state) {
            case State.IN_QUEUE:
                if (this.timeInState > this.patience) {
                    this._outOfPatience = true;
                }
                break;
            case State.FRONT_OF_QUEUE:
                if (this.timeInState > this.patience / 3) {
                    this._outOfPatience = true;
                }
                break;
        }

        if (this._outOfPatience && (this.state === State.IN_QUEUE || this.state === State.FRONT_OF_QUEUE || this.state === State.SERVING)) {
            this.setDrawing(Animation.PATIENCE);
        }
    }

    public enterQueue(queue: Queue): void {
        this.queue = queue;
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

        if (this.scene.engine.input.pointers.primary.isActorUnderPointer(this)) {
            this.setDrawing(Animation.SELECTED);
        }
    }

    public startServing(queue: Queue): void {
        this.state = State.SERVING;
    }

    public leaveQueue(queue: Queue): void {
        this.queue = null;
        this.state = State.SERVED;
    }
}
