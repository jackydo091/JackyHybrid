
import { SetZIndex } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator, Component, Node, UITransform, sys } from 'cc';
import { gfNetFX } from '../../../cc30-fishbase/Scripts/Components/gfNetFX';
import gfBaseConfig from '../../../cc30-fishbase/Scripts/Config/gfBaseConfig';
const { ccclass, property } = _decorator;

@ccclass('NetFX1988')
export class NetFX1988 extends gfNetFX {
    onLoad() {
        this._animationName = 'animation';
        this.spine.setAnimation(0, this._animationName, false);
        this.spine.premultipliedAlpha = false;
    }

    initAssets(config) {
        if(config.kind &&  (config.kind === 4 || config.kind === 7 )) {
            this.spine.useTint = true;
        } else {
            this.spine.useTint = false;
        }
        this.spine.skeletonData = config.asset;
        this.spine.premultipliedAlpha = false;
        this._animationName = 'animation';
        SetZIndex(this.node, gfBaseConfig.instance.Z_INDEX.NETFX);
        this.spine.setAnimation(0, this._animationName, false);
        const duration = this.spine.findAnimation(this._animationName).duration;
        this.scheduleOnce(()=>{
            this.returnPool();
        }, duration);
    }

    returnPool() {
        if(!sys.isNative) this.spine.skeletonData = null;
        this.unscheduleAllCallbacks();
        super.returnPool();
    }
}