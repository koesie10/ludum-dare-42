import * as ex from 'excalibur';
import {Stand} from 'actors/stand/stand';
import {Player} from 'actors/player';
import {Human} from 'actors/human';
import {Machinery} from 'actors/stand/machinery';
import {Queue} from 'util/queue';

import {Resources} from '@/resources';
import {Background} from "actors/background";
import {Stats} from '@/stats';

export interface SpawnInterface {
    queueId: number;
    timeUntilNextSpawn: number;
}

export class BaseLevel extends ex.Scene {
    protected timeUntilNextSpawn: number = 0;
    protected currentSpawn: number = 0;

    protected queues: Queue[];
    protected spawns: SpawnInterface[];
    protected machinery: Machinery;

    protected moneyLabel: ex.Label;
    protected explainText: ex.Actor;

    public onInitialize(engine: ex.Engine) {
        this.add(new Background(0, 0, 1280, 720));
        this.add(new Stand(160, 96));
        this.add(new Player(160, 32));

        this.moneyLabel = new ex.Label('$0', 1140, 64, null, Resources.Fonts.Money);
        this.moneyLabel.fontSize = 40;
        this.add(this.moneyLabel);
    }

    update(engine: ex.Engine, delta: number): void {
        super.update(engine, delta);

        this.timeUntilNextSpawn -= delta;

        if (this.timeUntilNextSpawn <= 0) {
            const spawn = this.spawns[this.currentSpawn % this.spawns.length];
            this.currentSpawn++;

            this.timeUntilNextSpawn = spawn.timeUntilNextSpawn;
            const queue = this.queues[spawn.queueId];

            const human = new Human(queue.options.spawnX, queue.options.spawnY);

            if (queue.addToQueue(human)) {
                this.add(human);
            }
        }

        this.moneyLabel.text = `$${Stats.moneyEarned.toFixed(0)}`;
    }

    protected onServed(queue: Queue, serve: Human): void {
        if (this.explainText !== null) {
            this.remove(this.explainText);
            this.explainText = null;
        }
    }

    protected onFull(queue: Queue): void {
        this.engine.goToScene('gameover');
    }

    public onActivate() {
        Stats.resetMoney();
        if (this.machinery !== undefined) {
            this.machinery.reset();
        }
    }

    public onDeactivate() {
        this.queues.forEach(queue => queue.clear());
        this.currentSpawn = 0;
        this.timeUntilNextSpawn = 0;
    }
}
