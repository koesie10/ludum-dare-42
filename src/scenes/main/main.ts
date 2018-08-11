import * as ex from 'excalibur';
import {Stand} from 'actors/stand/stand';
import {Player} from 'actors/player';
import {Human} from 'actors/human';
import {Machinery} from 'actors/stand/machinery';
import {Queue} from 'util/queue';

import {Resources} from '@/resources';
import {Background} from "actors/background";
import {Stats} from '@/stats';

export class Main extends ex.Scene {
    private timeUntilNextSpawn: number = 0;

    private queues: Queue[];
    private machinery: Machinery;

    private moneyLabel: ex.Label;
    private explainText: ex.Actor;

    public onInitialize(engine: ex.Engine) {
        this.machinery = new Machinery(880, 336, 0.04);

        this.queues = [
            new Queue(1, -32, 688, 100, 9, this.machinery, this.onServed.bind(this), this.onFull.bind(this)),
            new Queue(2, 220, engine.drawHeight + 32, 220, 9, this.machinery, this.onServed.bind(this), this.onFull.bind(this))
        ];

        this.add(new Background(0, 0, 1280, 720));
        this.add(new Stand(160, 96));
        this.add(this.machinery);
        this.add(new Player(160, 32));

        this.moneyLabel = new ex.Label('$0', 1200, 64, null, Resources.Fonts.Money);
        this.moneyLabel.fontSize = 40;
        this.add(this.moneyLabel);

        const goalText = new ex.Actor(760, 30, 272, 8);
        goalText.scale.setTo(2, 2);
        goalText.addDrawing(Resources.Textures.Goal1);
        this.add(goalText);

        this.explainText = new ex.Actor(188, 400, 152, 16);
        this.explainText.scale.setTo(2, 2);
        this.explainText.addDrawing(Resources.Textures.Explain1);
        this.add(this.explainText);
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

        this.moneyLabel.text = `$${Stats.moneyEarned.toFixed(0)}`;
    }

    private onServed(serve: Human): void {
        Stats.addMoney(2);
        if (this.explainText !== null) {
            this.remove(this.explainText);
            this.explainText = null;
        }
    }

    private onFull(queue: Queue): void {
        console.log('game over!');
        this.engine.goToScene('gameover');
    }

    public onActivate() {
        Stats.resetMoney();
        this.queues.forEach(queue => queue.clear());
    }

    public onDeactivate() {
    }
}
