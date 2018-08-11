import * as ex from 'excalibur';

import {Resources} from '@/resources';
import {Stats} from '@/stats';

export class GameOver extends ex.Scene {
    public onInitialize(engine: ex.Engine) {
        const moneyLabel = new ex.Label('$0', 640, 360, null, Resources.Fonts.Money);
        moneyLabel.fontSize = 60;
        moneyLabel.text = `$${Stats.moneyEarned}`;

        const textWidth = moneyLabel.getTextWidth(engine.ctx);
        moneyLabel.x = 640 - textWidth / 2;

        this.add(moneyLabel);

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
        Resources.Sounds.Pour.stop();
        Resources.Sounds.GameOver.play();
    }
}
