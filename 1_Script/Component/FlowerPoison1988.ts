
import { _decorator, tween } from 'cc';
import { SpineFish1988 } from './SpineFish1988';
import EventCode from '../Common/EventsCode1988';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import {fadeOut} from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';


const { ccclass, property } = _decorator;

@ccclass('FlowerPoison1988')
export class FlowerPoison1988 extends SpineFish1988 {

    initFishData(data) {
        super.initFishData(data);
        this.setOpacity(255);
    }

    onCatch(data) {
        if (data.isCheckedFakeBullet === undefined) {
            if (this.needFakeBullet(data)) {
                this.createFakeBullet(data);
                return;
            }
        }
        this.processItemInCatchFish(data);
        this.onPlayEffectWinInCatchFish(data);
        this.stopAllActions();
        this.resetColor();
        this.setDie(true);
        Emitter.instance.emit(EventCode.FISH_LAYER.FLOWER_DIE, this.node.position);
        this.playDieAnimation();
        Emitter.instance.emit(EventCode.SOUND.FLOWER_DIE);
    }

    playDieAnimation() {
        tween(this.node)
        .then(fadeOut(0.4))
        .call(() => {
            this.onDie();
        })
        .start();
    }

}

