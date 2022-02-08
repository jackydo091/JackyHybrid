import {_decorator, Component, Node, Prefab, sp, instantiate, v3, UITransform, tween, isValid} from 'cc';
import {v2Distance, getRotation} from "../../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import {stopAllActions} from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";

const {ccclass, property} = _decorator;

const DEFAULT_HEIGHT = 533;
@ccclass('EffectLightning1988')
export class EffectLightning1988 extends Component {
    @property(Prefab)
    lightning: Prefab;
    @property(sp.Skeleton)
    sphere: sp.Skeleton;
    _lightingFX:any = null;


    onLoad() {
    }

    playEffectLightning(endPos, callback) {
        this._lightingFX = instantiate(this.lightning);
        this.node.addChild(this._lightingFX);
        this._lightingFX.position = v3(0, 0, 0);
        endPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(endPos);
        const distance = v2Distance(this._lightingFX.position, endPos);
        const scaleY = distance / DEFAULT_HEIGHT;
        this._lightingFX.scale.y *= scaleY;
        const angle = getRotation(endPos, this._lightingFX.position);
        this._lightingFX.angle = -(90 - angle);
        const duration = this.sphere.findAnimation("Laser_Elip").duration;
        tween(this.node)
            .delay(duration)
            .call(()=>{
                callback && callback();
            })
            .removeSelf()
            .call(()=>{
                this.node.destroy();
            })
            .start();
    }

    onDestroy() {
        stopAllActions(this.node);
        if (isValid(this._lightingFX)) {
            this._lightingFX.destroy();
        }
    }
}

