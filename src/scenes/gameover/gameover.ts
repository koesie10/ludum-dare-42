import * as ex from 'excalibur';

import {Resources} from '@/resources';
import {Stats} from '@/stats';

export class GameOver extends ex.Scene {
    private moneyLabel: ex.Label;

    public onInitialize(engine: ex.Engine) {
        this.moneyLabel = new ex.Label('$0', 640, 360, null, Resources.Fonts.Money);
        this.moneyLabel.fontSize = 60;
        this.updateMoneyLabel(engine);
        this.add(this.moneyLabel);

        const restartText = new ex.Actor(640, 400, 193, 8);
        restartText.scale.setTo(3, 3);
        restartText.addDrawing(Resources.Textures.Restart);
        this.add(restartText);
    }

    update(engine: ex.Engine, delta: number): void {
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Space)) {
            this.engine.goToScene('level1');
        }
    }

    public onActivate(): void {
        this.updateMoneyLabel(this.engine);

        Resources.Sounds.Pour.stop();
        Resources.Sounds.GameOver.play();
    }

    private updateMoneyLabel(engine: ex.Engine): void {
        this.moneyLabel.text = `$${Stats.moneyEarned}`;

        const textWidth = this.moneyLabel.getTextWidth(engine.ctx);
        this.moneyLabel.x = 640 - textWidth / 2;
    }
}
