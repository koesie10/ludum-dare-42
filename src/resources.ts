import * as ex from 'excalibur';
import {Engine} from "excalibur";

export const Resources = {
    Textures: {
        Background: new ex.Texture(require('./images/background.png')),
        StandBase: new ex.Texture(require('./images/stand_base.png')),
        StandCan: new ex.Texture(require('./images/stand_can.png')),
        StandDecoration: new ex.Texture(require('./images/stand_decoration.png')),
        Machinery: new ex.Texture(require('./images/machinery.png')),
        HumanRed: new ex.Texture(require('./images/human_red.png')),
        HumanBlue: new ex.Texture(require('./images/human_blue.png')),
        MoneyFont: new ex.Texture(require('./images/moneyfont.png'))
    },
    Sounds: {
        Pour: new ex.Sound(require('./sounds/pour.wav'))
    },
    Fonts: {
        Money: <ex.SpriteFont> null
    }
};

export function init(engine: Engine) {
    Resources.Fonts.Money = new ex.SpriteFont({
        image: Resources.Textures.MoneyFont,
        columns: 7,
        rows: 2,
        caseInsensitive: true,
        spHeight: 25,
        spWidth: 18,
        alphabet: '$0123456789'
    });
}
