import * as ex from 'excalibur';

export const Resources = {
    Textures: {
        Background: new ex.Texture(require('./images/background.png')),
        StandBase: new ex.Texture(require('./images/stand_base.png')),
        StandCan: new ex.Texture(require('./images/stand_can.png')),
        StandDecoration: new ex.Texture(require('./images/stand_decoration.png')),
        StandBack: new ex.Texture(require('./images/stand_back.png')),
        Machinery: new ex.Texture(require('./images/machinery.png')),
        HumanRed: new ex.Texture(require('./images/human_red.png')),
        HumanBlue: new ex.Texture(require('./images/human_blue.png')),
    },
    Sounds: {
        Pour: new ex.Sound(require('./sounds/pour.wav'))
    }
};
