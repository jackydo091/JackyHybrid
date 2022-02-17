
import { _decorator, sys } from 'cc';
import { gfNetFX } from '../../../cc30-fishbase/Scripts/Components/gfNetFX';
const { ccclass, property } = _decorator;

@ccclass('NetFX1988')
export class NetFX1988 extends gfNetFX {
    onLoad() {
        this._animationName = 'animation';
        this.spine.setAnimation(0, this._animationName, false);
        this.spine.premultipliedAlpha = false;
    }


    initAssets(config) {
        super.initAssets(config);
    }
    
    returnPool() {
        if(!sys.isNative) this.spine.skeletonData = null;
        this.unscheduleAllCallbacks();
        super.returnPool();
    }
}