import * as ex from 'excalibur';
import {Machinery} from 'actors/stand/machinery';
import {Queue} from 'util/queue';

import {Resources} from '@/resources';
import {BaseLevel} from 'scenes/level';
import {Human} from 'actors/human';
import {Stats} from '@/stats';

export class Level1 extends BaseLevel {
    public onInitialize(engine: ex.Engine) {
        super.onInitialize(engine);
        this.machinery = new Machinery(880, 336, 0.04);

        this.queues = [
            new Queue(0, -32, 688, 100, 9, this.machinery, this.onServed.bind(this), this.onFull.bind(this)),
            new Queue(1, 220, engine.drawHeight + 32, 220, 9, this.machinery, this.onServed.bind(this), this.onFull.bind(this))
        ];

        this.spawns = [
            {queueId: 0, timeUntilNextSpawn: 5000},
            {queueId: 0, timeUntilNextSpawn: 500},
            {queueId: 1, timeUntilNextSpawn: 2000},
            {queueId: 0, timeUntilNextSpawn: 3000},
            {queueId: 1, timeUntilNextSpawn: 3000},
            {queueId: 0, timeUntilNextSpawn: 2000},
            {queueId: 0, timeUntilNextSpawn: 1000},
            {queueId: 0, timeUntilNextSpawn: 500},
            {queueId: 1, timeUntilNextSpawn: 1000},
            {queueId: 0, timeUntilNextSpawn: 2000},
            {queueId: 0, timeUntilNextSpawn: 1000},
            {queueId: 0, timeUntilNextSpawn: 5000},
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
        ];

        this.add(this.machinery);

        const goalText = new ex.Actor(760, 30, 272, 8);
        goalText.scale.setTo(2, 2);
        goalText.addDrawing(Resources.Textures.Goal1);
        this.add(goalText);

        this.explainText = new ex.Actor(188, 400, 152, 16);
        this.explainText.scale.setTo(2, 2);
        this.explainText.addDrawing(Resources.Textures.Explain1);
        this.add(this.explainText);
    }

    protected onServed(serve: Human): void {
        super.onServed(serve);

        if (Stats.moneyEarned >= 40) {
            this.engine.goToScene('level2');
        }
    }
}