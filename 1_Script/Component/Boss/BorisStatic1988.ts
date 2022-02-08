import {_decorator, UIOpacity, tween, Tween} from 'cc';
import gfNode from "../../../../cc30-fishbase/Scripts/Common/gfNode";
import { fadeOut } from '../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';

const {ccclass} = _decorator;

@ccclass('BorisStatic1988')
export class BorisStatic1988 extends gfNode {
    play(callback = null) {
        let opacityCompo = this.getComponent(UIOpacity);
        opacityCompo.opacity = 150;
        tween(this.node)
            .then(fadeOut(0.25))
            .call(() => {
                callback && callback();
                this.returnPool();
            })
            .start();
    }

    returnPool(){
        Tween.stopAllByTarget(this.node);
        let opacityCompo = this.getComponent(UIOpacity);
        opacityCompo.opacity = 0;
        super.returnPool();
    }
}

