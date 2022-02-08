import { _decorator, sys, sp, tween, v3, Sprite, v2, UITransform } from 'cc';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventCode from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import BaseConfig from '../../../cc30-fishbase/Scripts/Config/gfBaseConfig';
import { gfBigWinWheelAvatar } from '../../../cc30-fishbase/Scripts/Components/gfBigWinWheelAvatar';
import { convertAssetArrayToObject, setOpacity } from '../../../../cc-common/cc-share/common/utils';
import { stopAllActions, scaleTo, blink, moveBy } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import ReferenceManager1988 from '../Common/ReferenceManager1988';
import GameConfig from '../Common/Config1988';

const { ccclass, property } = _decorator;

@ccclass('BigWinWheelAvatar1988')
export class BigWinWheelAvatar1988 extends gfBigWinWheelAvatar {
    spineRibbon: sp.Skeleton;
    iconMainFishOriginY: any;
    _winWallet = 0;
    onLoad() {
        super.onLoad();
        this.spineRibbon = this.ribbon.getComponent(sp.Skeleton);
        this.spineRibbon.setMix(this.ANIMATION_NAME.APPEAR, this.ANIMATION_NAME.IDLE, 0.1);
        this.iconMainFishOriginY = this.iconMainFish.position.y;
    }

    _setUpConstantsVariable(){
        super._setUpConstantsVariable();
        this.SKIN_NAME = {
            WIN: "",
            BIG_WIN: "Level_1",
            SUPER_WIN: "Level_2",
            MEGA_WIN: "Level_3"
        };

        this.ANIMATION_NAME = {
            APPEAR: "All_Appear",
            IDLE: "All_Idle",
            DISAPPEAR: "Ribbon_Appear"
        };
    }

    _playSpinAnim(skinName) {
        if (this._currentSkinName !== skinName) {
            this.spine.setSkin(skinName);
            this.spineRibbon.setSkin(skinName);
            if (sys.isNative) {
                this.spine.setToSetupPose();
                this.spineRibbon.setToSetupPose();
            }
            this._currentSkinName = skinName;
            this.spine.setAnimation(0, this.ANIMATION_NAME.APPEAR, false);
            this.spineRibbon.setAnimation(0, this.ANIMATION_NAME.APPEAR, false);
            this.spine.setCompleteListener(this._completeAppear.bind(this));

        } else {
            this.spine.setAnimation(0, this.ANIMATION_NAME.IDLE, true);
            this.spineRibbon.setAnimation(0, this.ANIMATION_NAME.IDLE, true);
        }
    }

    _setSkinByBet(bet) {
        let skinName = this.SKIN_NAME.BIG_WIN;
        this.sizeByTyeWin = 0.8;
        if (this._winValue >= bet * BaseConfig.instance.BIG_WIN_RATIO.SUPER) {
            skinName = this.SKIN_NAME.MEGA_WIN;
            this.sizeByTyeWin = 1;
        } else if (this._winValue >= bet * BaseConfig.instance.BIG_WIN_RATIO.HUGE) {
            skinName = this.SKIN_NAME.SUPER_WIN;
            this.sizeByTyeWin = 0.9;
        }
        return skinName;
    }

    _playAnim({gold, bet, isMe, fishKind, isTextImage, isKill}) {

        this.lblCoin = (isMe) ? this.txtCoin : this.txtCoinOther;
        this.lblCoin.node.active = true;
        this._winValue += gold;
        if(fishKind != GameConfig.instance.FISH_KIND.BOMB){
            this._winWallet += gold;
        }
        const skinName = this._setSkinByBet(bet);
        Emitter.instance.emit(EventCode.SOUND.PAUSE_OR_RESUME_SOUND_WIN, false);
        skinName == this.SKIN_NAME.MEGA_WIN ? Emitter.instance.emit(EventCode.SOUND.MEGA_WIN) : Emitter.instance.emit(EventCode.SOUND.BIG_WIN);
        const delayTimeTweenCoin = this._currentSkinName === '' ? 1 : 0;

        this._tweenCoin({ winAmount: this._winValue, delay: delayTimeTweenCoin });

        let delayTime = this._currentSkinName !== skinName ? 0.3 : 0;
        this._playSpinAnim(skinName);
        this._playActionIconMainFish({ delayTime, fishKind, isTextImage, isKill, gold });
        this._isShowing = true;
    }

    _playAnimHideEffect() {
        this.spineRibbon.setAnimation(0, this.ANIMATION_NAME.DISAPPEAR, false);
        this.spine.setAnimation(0, this.ANIMATION_NAME.DISAPPEAR, false);
        tween(this.lblCoin.node).to(0.2, {scale: v3(0, 0, 1)}).start();
        stopAllActions(this.iconMainFish);
        tween(this.iconMainFish).to(0.2, {scale: v3(0, 0, 1)}).start();
        tween(this.ribbon).to(0.2, {scale: v3(0, 0, 0)}).start();
        const player = ReferenceManager1988.instance.getPlayerByIndex(this.index);
        if (player.isMe) {
            player.addToDisplayWallet(this._winWallet);
        }
        this._resetInfo();
    }

    _updateImage(fishKind){
        const assetFishes = convertAssetArrayToObject(this._listFishFrame);
        let sprite = null;
        if (assetFishes['Avatar_' + fishKind]) {
            sprite = assetFishes['Avatar_' + fishKind];
        } else {
            sprite = assetFishes['Avatar_' + 22];
        }
        this.iconMainFish.getComponent(Sprite).spriteFrame = sprite;
    }

    _changeImageFishIcon(data) {
        const {fishKind} = data;
        this.iconMainFish.setPosition(0, this.iconMainFishOriginY, 0);
        stopAllActions(this.iconMainFish);
        tween(this.iconMainFish)
            .then(scaleTo(0.1, 0, 0, 'backOut'))
            .call(()=>{ this._updateImage(fishKind); })
            .parallel(
                blink(0.8, 6),
                scaleTo(0.5, this.sizeByTyeWin, this.sizeByTyeWin, 'backOut')
            )
            .delay(0.2)
            .repeat(10, 
                tween()                    
                    .by(0.5, {position: v3(0, 10, 0)})
                    .by(0.5, {position: v3(0, -10, 0)})
            )
            .start();
    }

    _completeAppear() {
        this.spine.setAnimation(0, this.ANIMATION_NAME.IDLE, true);
        this.spineRibbon.setAnimation(0, this.ANIMATION_NAME.IDLE, true);
        this.spine.setCompleteListener(() => {});
    }

    _resetInfo(){
        super._resetInfo();
        this._winWallet = 0;
    }
}
