import {Animation as HumanAnimation, Human} from 'actors/human';
import {Machinery} from 'actors/stand/machinery';

const DEFAULT_MOVEMENT_SPEED = 256;
const DEFAULT_QUEUE_SPACE = 48;
const DEFAULT_QUEUE_START = 160;

export interface QueueOptions {
    id: number;

    spawnX: number;
    spawnY: number;

    queueX: number;

    despawnX: number;
    despawnY: number;

    maxQueueSize: number;
    machinery: Machinery;
    onServe: (Queue, Human) => void;
    onFull: (Queue) => void;
    movementSpeed?: number;
    space?: number;
    start?: number;
}

export class Queue {
    private movingToQueue: Human[] = [];
    private inQueue: Human[] = [];

    constructor(readonly options: QueueOptions) {
        this.options.movementSpeed = this.options.movementSpeed || DEFAULT_MOVEMENT_SPEED;
        this.options.space = this.options.space || DEFAULT_QUEUE_SPACE;
        this.options.start = this.options.start || DEFAULT_QUEUE_START;
    }

    get queueSize() {
        return this.inQueue.length;
    }

    get movingToQueueSize() {
        return this.movingToQueue.length;
    }

    get isFull(): boolean {
        return this.inQueue.length >= this.options.maxQueueSize;
    }

    get willBeFull(): boolean {
        return (this.inQueue.length + this.movingToQueue.length) >= this.options.maxQueueSize;
    }

    addToQueue(human: Human): boolean {
        if (this.willBeFull) {
            return false;
        }

        this.movingToQueue.push(human);

        const x = this.options.queueX;
        const y = ((this.inQueue.length - 1) + this.movingToQueue.length) * this.options.space + this.options.start;

        const rotation = x < this.options.spawnX ? -Math.PI / 2 : Math.PI / 2;

        human.actions
        .callMethod(() => human.setDrawing(HumanAnimation.WALKING))
        .rotateBy(rotation, 1)
        .moveTo(x, this.options.spawnY, this.options.movementSpeed)
        .callMethod(() => this.homeIfFull(human))
        .rotateBy(0, 1)
        .moveTo(x, y, this.options.movementSpeed)
        .callMethod(() => this.homeIfFull(human))
        .callMethod(() => {
            human.setDrawing(HumanAnimation.IDLE);

            this.movingToQueue.splice(this.movingToQueue.indexOf(human), 1);
            this.inQueue.push(human);

            human.enterQueue(this);

            if (this.inQueue.length === 1) {
                human.enterFrontOfQueue(this, this.serve.bind(this));
            }

            if (this.isFull) {
                // TODO: Game over?
                this.options.onFull(this);
            }
        });

        human.queueSpotX = x;
        human.queueSpotY = y;

        return true;
    }

    homeIfFull(human: Human): void {
        if (!this.isFull) {
            return;
        }

        human.actions
        .clearActions();

        human.setDrawing(HumanAnimation.WALKING);

        const rotation = human.x > this.options.spawnX ? -Math.PI / 2 : Math.PI / 2;

        human.actions
        .rotateBy(Math.PI, 1)
        .moveTo(human.x, this.options.spawnY, this.options.movementSpeed)
        .rotateBy(rotation, 1)
        .moveTo(this.options.spawnX, this.options.spawnY, this.options.movementSpeed)
        .callMethod(() => human.setDrawing(HumanAnimation.IDLE));

        this.movingToQueue.splice(this.movingToQueue.indexOf(human), 1);
    }

    serve(): Human {
        if (this.inQueue.length < 1) {
            return null;
        }

        const served = this.inQueue[0];

        this.options.machinery.startPouring(() => {
            this.inQueue.splice(this.inQueue.indexOf(served), 1);

            served.setDrawing(HumanAnimation.GLASS);
            served.leaveQueue(this);

            const rotation = this.options.despawnX < served.x ? -Math.PI / 2 : Math.PI / 2;

            served.actions
            .rotateBy(rotation, 1)
            .moveTo(this.options.despawnX, served.y, this.options.movementSpeed)
            .rotateBy(Math.PI, 1)
            .moveTo(this.options.despawnX, this.options.despawnY, this.options.movementSpeed)
            .callMethod(() => served.scene.remove(served));

            let i = 0;
            for (let human of this.inQueue) {
                human.queueSpotY = i * this.options.space + this.options.start;

                human.setDrawing(HumanAnimation.WALKING);

                human.actions
                .rotateTo(0, 1)
                .delay(200)
                .moveTo(human.queueSpotX, human.queueSpotY, this.options.movementSpeed)
                .callMethod(() => human.setDrawing(HumanAnimation.IDLE));

                if (i === 0) {
                    human.actions.callMethod(() => human.enterFrontOfQueue(this, this.serve.bind(this)));
                }

                i++;
            }

            for (let human of this.movingToQueue) {
                human.queueSpotY = i * this.options.space + this.options.start;

                human.setDrawing(HumanAnimation.WALKING);

                human.actions
                .rotateTo(0, 1)
                .moveTo(human.queueSpotX, human.queueSpotY, this.options.movementSpeed)
                .callMethod(() => human.setDrawing(HumanAnimation.IDLE));

                i++;
            }

            this.options.onServe(this, served);
        });

        return served;
    }

    clear(): void {
        for (let human of this.inQueue) {
            human.scene.remove(human);
        }

        for (let human of this.movingToQueue) {
            human.scene.remove(human);
        }

        this.inQueue = [];
        this.movingToQueue = [];
    }
}