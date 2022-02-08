
import { gfEffectLockFish } from '../../../cc30-fishbase/Scripts/Components/gfEffectLockFish';
import EventCode from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import { registerEvent } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator, Component, Node } from 'cc';
import { getPostionInOtherNode } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;

@ccclass('EffectLockFish1988')
export class EffectLockFish1988 extends gfEffectLockFish {

    onLoad() {
        super.onLoad();
        this.initEvents();
    }

    initEvents() {
        super.initEvents();
        registerEvent(EventCode.GAME_LAYER.RESUME_AUTO_FIRE, this.resume, this);
    }

    resume() {
        this._canPlayEffect = false;
    }
}
