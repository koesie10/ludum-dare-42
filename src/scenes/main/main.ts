import * as ex from 'excalibur';
import {Stand} from 'actors/stand/stand';
import {Player} from 'actors/player';
import {Animation as HumanAnimation, Human} from 'actors/human';
import {Machinery, Animation as MachineryAnimation} from 'actors/stand/machinery';

const MOVEMENT_SPEED = 256;

export class Main extends ex.Scene {
    private timeUntilNextSpawn: number = 0;
    private timeUntilNextServe: number = 0;

    private readonly queues: Queue[] = [
        new Queue(-32, 700, 100),
        new Queue(1312, 700, 220)
    ];
    private machinery: Machinery;

    private debugLabel: ex.Label;

    public onInitialize(engine: ex.Engine) {
        this.machinery = new Machinery(880, 336);

        this.add(new Stand(160, 96));
        this.add(this.machinery);
        this.add(new Player(160, 32));

        this.debugLabel = new ex.Label('Queue: (0, 0), spawn: 0, serve: 0', 660, 30);
        this.debugLabel.color = ex.Color.White;
        this.debugLabel.fontSize = 22;
        this.add(this.debugLabel);
    }

    update(engine: ex.Engine, delta: number): void {
        super.update(engine, delta);

        this.timeUntilNextSpawn -= delta;
        this.timeUntilNextServe -= delta;

        if (this.timeUntilNextSpawn <= 0) {
            this.timeUntilNextSpawn = ex.Util.randomIntInRange(500, 5000);

            const queue = this.queues[ex.Util.randomIntInRange(0, this.queues.length - 1)];
            const human = new Human(queue.spawnX, queue.spawnY);

            if (queue.addToQueue(human)) {
                this.add(human);
            }
        }

        if (this.timeUntilNextServe <= 0) {
            this.timeUntilNextServe = ex.Util.randomIntInRange(2000, 9000);

            const queue = this.queues[ex.Util.randomIntInRange(0, this.queues.length - 1)];
            const served = queue.serve(this.machinery);
        }

        const queueSize = this.queues.map(item => item.queueSize).reduce((a, b) => a + b);
        const movingToQueueSize = this.queues.map(item => item.movingToQueueSize).reduce((a, b) => a + b);

        this.debugLabel.text = `Queue: (${queueSize}, ${movingToQueueSize}), spawn: ${(this.timeUntilNextSpawn/1000).toFixed(1)}s, serve: ${(this.timeUntilNextServe/1000).toFixed(1)}s`;
    }

    public onActivate() {
    }

    public onDeactivate() {
    }
}

const QUEUE_SPACE = 48;
const QUEUE_START = 160;

class Queue {
    private movingToQueue: Human[] = [];
    private inQueue: Human[] = [];
    readonly maxQueueSize: number = 11;

    constructor(readonly spawnX: number, readonly spawnY: number, readonly queueX: number) {

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
        const y = ((this.inQueue.length - 1) + this.movingToQueue.length) * QUEUE_SPACE + QUEUE_START;

        const rotation = x < this.spawnX ? -Math.PI / 2 : Math.PI / 2;

        human.actions
        .rotateBy(rotation, 1)
        .moveTo(x, this.spawnY, MOVEMENT_SPEED)
        .callMethod(() => this.homeIfFull(human))
        .rotateBy(0, 1)
        .moveTo(x, y, MOVEMENT_SPEED)
        .callMethod(() => this.homeIfFull(human))
        .callMethod(() => {
            this.movingToQueue.splice(this.movingToQueue.indexOf(human), 1);
            this.inQueue.push(human);

            if (this.isFull) {
                // TODO: Game over?
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
        .moveTo(human.x, this.spawnY, MOVEMENT_SPEED)
        .rotateBy(rotation, 1)
        .moveTo(this.spawnX, this.spawnY, MOVEMENT_SPEED);

        this.movingToQueue.splice(this.movingToQueue.indexOf(human), 1);
    }

    serve(machinery: Machinery): Human {
        if (this.inQueue.length < 1) {
            return null;
        }

        const served = this.inQueue.splice(0, 1)[0];

        machinery.pourAnimation.reset();
        machinery.setDrawing(MachineryAnimation.POUR);

        const timer = new ex.Timer(() => {
            if (!machinery.pourAnimation.isDone()) {
                return;
            }
            timer.cancel();

            machinery.setDrawing(MachineryAnimation.IDLE);

            served.setDrawing(HumanAnimation.GLASS);

            const rotation = this.spawnX < served.x ? -Math.PI / 2 : Math.PI / 2;

            served.actions
            .rotateBy(rotation, 1)
            .moveTo(this.spawnX, served.y, MOVEMENT_SPEED)
            .callMethod(() => served.scene.remove(served));

            let i = 0;
            for (let human of this.inQueue) {
                human.queueSpotY = i * QUEUE_SPACE + QUEUE_START;

                human.actions
                .rotateTo(0, 1)
                .delay(200)
                .moveTo(human.queueSpotX, human.queueSpotY, MOVEMENT_SPEED);

                i++;
            }

            for (let human of this.movingToQueue) {
                human.queueSpotY = i * QUEUE_SPACE + QUEUE_START;

                human.actions
                .rotateTo(0, 1)
                .moveTo(human.queueSpotX, human.queueSpotY, MOVEMENT_SPEED);

                i++;
            }
        }, 100, true);

        machinery.scene.addTimer(timer);

        return served;
    }
}
