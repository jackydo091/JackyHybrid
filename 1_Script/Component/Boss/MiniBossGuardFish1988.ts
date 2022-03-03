import {_decorator, Component} from 'cc';
import { gfMiniBossGuardFish } from '../../../../cc30-fishbase/Scripts/Components/Fishes/gfMiniBossGuardFish';

const {ccclass, property} = _decorator;

@ccclass('MiniBossGuardFish1988')
export class MiniBossGuardFish1988 extends gfMiniBossGuardFish {
    initAnimationCacheMode(){
        super.initAnimationCacheMode();
        this.fishAnim.premultipliedAlpha = false;
    }
}

