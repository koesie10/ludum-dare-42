import * as ex from 'excalibur';

import {Resources} from '@/resources';
import {Stats} from '@/stats';

export class NextLevel extends ex.Scene {
    private timeInScene: number;

    public onInitialize(engine: ex.Engine) {
        const background = new ex.Actor();
        background.anchor.setTo(0, 0);
        background.addDrawing(Resources.Textures.NextLevel);

        this.add(background);
    }

    update(engine: ex.Engine, delta: number): void {
        this.timeInScene += delta;

        if (this.timeInScene < 1000) {
            return;
        }

        if (engine.input.keyboard.isHeld(ex.Input.Keys.Space) || engine.input.pointers.primary.isDragging) {
            this.engine.goToScene(Stats.nextLevel);
        }
    }

    public onActivate(): void {
        this.timeInScene = 0;
        Resources.Sounds.Pour.stop();
        Resources.Sounds.GoalReached.play();
    }
}
