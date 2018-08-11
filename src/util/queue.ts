import {Animation as HumanAnimation, Human} from 'actors/human';
import {Machinery} from 'actors/stand/machinery';

const DEFAULT_MOVEMENT_SPEED = 256;
const DEFAULT_QUEUE_SPACE = 48;
const DEFAULT_QUEUE_START = 160;

export class Queue {
    private movingToQueue: Human[] = [];
    private inQueue: Human[] = [];
    readonly maxQueueSize: number = 10;

    constructor(
        readonly id: number,
        readonly spawnX: number, readonly spawnY: number,
        readonly queueX: number,
        readonly machinery: Machinery,
        readonly onServe: (Human) => void,
        readonly onFull: (Queue) => void,
        readonly movementSpeed: number = DEFAULT_MOVEMENT_SPEED,
        readonly space: number = DEFAULT_QUEUE_SPACE,
        readonly start: number = DEFAULT_QUEUE_START
    ) {
    }

    get queueSize() {
        return this.inQueue.length;
    }

    get movingToQueueSize() {
        return this.movingToQueue.length;
    }

    get isFull(): boolean {
        return this.inQueue.length >= this.maxQueueSize;
    }

    get willBeFull(): boolean {
        return (this.inQueue.length + this.movingToQueue.length) >= this.maxQueueSize;
    }

    addToQueue(human: Human): boolean {
        if (this.willBeFull) {
            return false;
        }

        this.movingToQueue.push(human);

        const x = this.queueX;
        const y = ((this.inQueue.length - 1) + this.movingToQueue.length) * this.space + this.start;

        const rotation = x < this.spawnX ? -Math.PI / 2 : Math.PI / 2;

        human.actions
        .rotateBy(rotation, 1)
        .moveTo(x, this.spawnY, this.movementSpeed)
        .callMethod(() => this.homeIfFull(human))
        .rotateBy(0, 1)
        .moveTo(x, y, this.movementSpeed)
        .callMethod(() => this.homeIfFull(human))
        .callMethod(() => {
            this.movingToQueue.splice(this.movingToQueue.indexOf(human), 1);
            this.inQueue.push(human);

            if (this.inQueue.length === 1) {
                human.enterFrontOfQueue(this, this.serve.bind(this));
            }

            if (this.isFull) {
                // TODO: Game over?
                this.onFull(this);
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

        const rotation = human.x > this.spawnX ? -Math.PI / 2 : Math.PI / 2;

        human.actions
        .rotateBy(Math.PI, 1)
        .moveTo(human.x, this.spawnY, this.movementSpeed)
        .rotateBy(rotation, 1)
        .moveTo(this.spawnX, this.spawnY, this.movementSpeed);

        this.movingToQueue.splice(this.movingToQueue.indexOf(human), 1);
    }

    serve(): Human {
        if (this.inQueue.length < 1) {
            this.onServe(null);
            return null;
        }

        const served = this.inQueue[0];

        this.machinery.startPouring(() => {
            this.inQueue.splice(this.inQueue.indexOf(served), 1);

            served.setDrawing(HumanAnimation.GLASS);

            const rotation = this.spawnX < served.x ? -Math.PI / 2 : Math.PI / 2;

            served.actions
            .rotateBy(rotation, 1)
            .moveTo(this.spawnX, served.y, this.movementSpeed)
            .callMethod(() => served.scene.remove(served));

            let i = 0;
            for (let human of this.inQueue) {
                human.queueSpotY = i * this.space + this.start;

                human.actions
                .rotateTo(0, 1)
                .delay(200)
                .moveTo(human.queueSpotX, human.queueSpotY, this.movementSpeed);

                if (i === 0) {
                    human.actions.callMethod(() => human.enterFrontOfQueue(this, this.serve.bind(this)));
                }

                i++;
            }

            for (let human of this.movingToQueue) {
                human.queueSpotY = i * this.space + this.start;

                human.actions
                .rotateTo(0, 1)
                .moveTo(human.queueSpotX, human.queueSpotY, this.movementSpeed);

                i++;
            }

            this.onServe(served);
        });

        return served;
    }
}