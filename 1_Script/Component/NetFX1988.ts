
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

    returnPool() {
        if(!sys.isNative) this.spine.skeletonData = null;
        this.unscheduleAllCallbacks();
        super.returnPool();
    }
}