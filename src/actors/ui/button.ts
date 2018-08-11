import * as ex from 'excalibur';

// https://gist.github.com/jedeen/a1c7ec5a4ebac29fce0d9a251475b67e

export class Button extends ex.UIActor {
    private readonly _func: () => void;

    constructor(x: number, y: number, width: number, height: number, color: ex.Color, func: () => void) {
        super(x, y, width, height);
        this.color = color;
        this._func = func;
    }

    public onInitialize(engine: ex.Engine) {
        super.onInitialize(engine);
        // when the button is clicked, run the supplied function
        this.on('pointerup', (event) => {
            this._func();
        });
    }
}
