import * as ex from 'excalibur';
import {Machinery} from 'actors/stand/machinery';
import {Queue} from 'util/queue';

import {Resources} from '@/resources';
import {BaseLevel} from 'scenes/level';
import {Human} from 'actors/human';
import {Stats} from '@/stats';

export class Level2 extends BaseLevel {
    public onInitialize(engine: ex.Engine) {
        super.onInitialize(engine);
        this.machinery = new Machinery(880, 336, 0.01);

        this.queues = [
            new Queue({
                id: 0,
                spawnX: -32,
                spawnY: 688,
                despawnX: 160,
                despawnY: engine.drawHeight + 32,
                queueX: 100,
                maxQueueSize: 9,
                patienceEnabled: true,
                machinery: this.machinery,
                onServe: this.onServed.bind(this),
                onFull: this.onFull.bind(this),
            }),
            new Queue({
                id: 1,
                spawnX: 220,
                spawnY: engine.drawHeight + 32,
                despawnX: 160,
                despawnY: engine.drawHeight + 32,
                queueX: 220,
                maxQueueSize: 9,
                patienceEnabled: true,
                machinery: this.machinery,
                onServe: this.onServed.bind(this),
                onFull: this.onFull.bind(this),
            }),
        ];

        this.spawns = [
            {queueId: 0, timeUntilNextSpawn: 5000},
            {queueId: 0, timeUntilNextSpawn: 200},
            {queueId: 1, timeUntilNextSpawn: 5000},
            {queueId: 0, timeUntilNextSpawn: 2000},
            {queueId: 1, timeUntilNextSpawn: 500},
            {queueId: 0, timeUntilNextSpawn: 2000},
            {queueId: 0, timeUntilNextSpawn: 1000},
            {queueId: 1, timeUntilNextSpawn: 500},
            {queueId: 1, timeUntilNextSpawn: 1000},
            {queueId: 0, timeUntilNextSpawn: 2000},
            {queueId: 0, timeUntilNextSpawn: 1000},
            {queueId: 1, timeUntilNextSpawn: 3000},
            {queueId: 1, timeUntilNextSpawn: 2000},
            {queueId: 1, timeUntilNextSpawn: 1000},
            {queueId: 1, timeUntilNextSpawn: 1000},
            {queueId: 0, timeUntilNextSpawn: 5000},
            {queueId: 1, timeUntilNextSpawn: 5000},
            {queueId: 0, timeUntilNextSpawn: 3000},
            {queueId: 1, timeUntilNextSpawn: 2000},
            {queueId: 0, timeUntilNextSpawn: 6000},
            {queueId: 1, timeUntilNextSpawn: 7000},
            {queueId: 0, timeUntilNextSpawn: 3000},
            {queueId: 0, timeUntilNextSpawn: 5000},
            {queueId: 1, timeUntilNextSpawn: 4000},
            {queueId: 1, timeUntilNextSpawn: 5000},
            {queueId: 0, timeUntilNextSpawn: 4000},
            {queueId: 1, timeUntilNextSpawn: 5000},
            {queueId: 0, timeUntilNextSpawn: 3000},
            {queueId: 0, timeUntilNextSpawn: 4000},
            {queueId: 1, timeUntilNextSpawn: 5000},
            {queueId: 1, timeUntilNextSpawn: 6000},
            {queueId: 0, timeUntilNextSpawn: 500},
            {queueId: 0, timeUntilNextSpawn: 8000},
            {queueId: 1, timeUntilNextSpawn: 4000},
            {queueId: 0, timeUntilNextSpawn: 10000},
            {queueId: 1, timeUntilNextSpawn: 8000},
            {queueId: 0, timeUntilNextSpawn: 6000},
            {queueId: 1, timeUntilNextSpawn: 12000},
            {queueId: 1, timeUntilNextSpawn: 9000},
        ];

        this.add(this.machinery);

        const goalText = new ex.Actor(760, 30, 272, 8);
        goalText.scale.setTo(2, 2);
        goalText.addDrawing(Resources.Textures.Goal2);
        this.add(goalText);
    }

    update(engine: ex.Engine, delta: number): void {
        super.update(engine, delta);

        if (engine.input.keyboard.wasPressed(ex.Input.Keys.Num0)) {
            Stats.nextLevel = 'level1';
            this.engine.goToScene('endgame');
        }
    }

    protected onServed(queue: Queue, serve: Human): void {
        super.onServed(queue, serve);

        Stats.addMoney(serve.outOfPatience ? 1 : 2);

        if (Stats.moneyEarned >= 60) {
            Stats.nextLevel = 'level1';
            this.engine.goToScene('endgame');
        }
    }

    public onActivate(): void {
        super.onActivate();
        this.explainText = new ex.Actor(188, 400, 152, 16);
        this.explainText.scale.setTo(2, 2);
        this.explainText.addDrawing(Resources.Textures.Explain2);
        this.add(this.explainText);
    }
}
