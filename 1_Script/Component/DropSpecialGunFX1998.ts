
import { _decorator, tween, v3 } from 'cc';
const { ccclass } = _decorator;
import { gfDropSpecialGunFX } from '../../../cc30-fishbase/Scripts/Components/Effects/gfDropSpecialGunFX';
@ccclass('DropSpecialGunFX1998')
export class DropSpecialGunFX1998 extends gfDropSpecialGunFX {
    
    onDrop() {
        return tween()
            .delay(.85);
    }
    onFly() {
        return tween()
            .parallel(
                tween().to(1, {position: this.endPosition}),
                tween()
                    .to(0.35, {scale:  v3(2,2,2)})
                    .to(0.65, {scale:  v3(1,1,1)})
            )
    }

    onFinish() {
        return tween()
            .delay(0.85)
            .call(() => {
                this.node.removeFromParent();
                this.node.destroy();
                typeof this.callBack === 'function' && this.callBack(this);
            });
    }
}

