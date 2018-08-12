import * as ex from 'excalibur';
import {Machinery} from 'actors/stand/machinery';
import {Queue} from 'util/queue';

import {Resources} from '@/resources';
import {BaseLevel} from 'scenes/level';
import {Human} from 'actors/human';
import {Stats} from '@/stats';

export class Sandbox extends BaseLevel {
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
            {queueId: 0, timeUntilNextSpawn: 4000},
            {queueId: 1, timeUntilNextSpawn: 8000},
            {queueId: 0, timeUntilNextSpawn: 6000},
            {queueId: 1, timeUntilNextSpawn: 3000},
            {queueId: 1, timeUntilNextSpawn: 9000},
            {queueId: 1, timeUntilNextSpawn: 6000},
            {queueId: 0, timeUntilNextSpawn: 3000},
            {queueId: 1, timeUntilNextSpawn: 9000},
        ];

        this.add(this.machinery);
    }

    update(engine: ex.Engine, delta: number): void {
        super.update(engine, delta);

        if (engine.input.keyboard.wasPressed(ex.Input.Keys.Num1)) {
            Stats.nextLevel = 'level1';
            this.engine.goToScene('nextlevel');
        }
    }

    protected onServed(queue: Queue, serve: Human): void {
        super.onServed(queue, serve);

        Stats.addMoney(serve.outOfPatience ? 1 : 2);
    }

    public onActivate(): void {
        super.onActivate();
    }
}
