import * as ex from 'excalibur';
import {Stand} from 'actors/stand/stand';
import {Player} from 'actors/player';
import {Human} from 'actors/human';
import {Machinery} from 'actors/stand/machinery';
import {Queue} from 'util/queue';

export class Main extends ex.Scene {
    private timeUntilNextSpawn: number = 0;

    private queues: Queue[];
    private machinery: Machinery;

    private debugLabel: ex.Label;

    public onInitialize(engine: ex.Engine) {
        this.machinery = new Machinery(880, 336);

        this.queues = [
            new Queue(1, -32, engine.drawHeight - 20, 100, this.machinery, this.onServed.bind(this)),
            new Queue(2, engine.drawWidth + 32, engine.drawHeight - 20, 220, this.machinery, this.onServed.bind(this))
        ];

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

        if (this.timeUntilNextSpawn <= 0) {
            this.timeUntilNextSpawn = ex.Util.randomIntInRange(500, 5000);

            const queue = this.queues[ex.Util.randomIntInRange(0, this.queues.length - 1)];
            const human = new Human(queue.spawnX, queue.spawnY);

            if (queue.addToQueue(human)) {
                this.add(human);
            }
        }

        const queueSize = this.queues.map(item => item.queueSize).reduce((a, b) => a + b);
        const movingToQueueSize = this.queues.map(item => item.movingToQueueSize).reduce((a, b) => a + b);

        this.debugLabel.text = `Queue: (${queueSize}, ${movingToQueueSize}), spawn: ${(this.timeUntilNextSpawn / 1000).toFixed(1)}s`;
    }

    private onServed(serve: Human) {

    }

    public onActivate() {
    }

    public onDeactivate() {
    }
}
