import {_decorator, Component, Node, v3, tween, Button} from 'cc';
import {gfJackpotWinPopup} from "../../../../cc30-fishbase/Scripts/Components/gfJackpotWinPopup";
import Emitter from "../../../../cc30-fishbase/Scripts/Common/gfEventEmitter";
import EventCode from "../../Common/EventsCode1988";
import BaseEventCode from "../../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import {gf3DParticle} from "../../../../cc30-fishbase/Scripts/Components/gf3DParticle";
import DataStore from "../../Common/DataStore1988";
import GameConfig from "../../Common/Config1988";
import {fadeOut} from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";

const {ccclass, property} = _decorator;

@ccclass('JackpotWinPopup1988')
export class JackpotWinPopup1988 extends gfJackpotWinPopup {

    private _callbackHide: Function = null;
    private _canQuickShow: boolean = false;

    onLoad() {
        super.onLoad();
        this.animNode.scale.set(v3(0, 0));
    }


    start() {
        this._canQuickShow = false;
        this.txtCoin.string = "";
        this.animNode.scale.set(v3(0, 0));

        Emitter.instance.emit(EventCode.SOUND.POPUP_JACKPOT, 1);

        Emitter.instance.emit(BaseEventCode.SOUND.STOP_ALL_AUDIO);

        tween(this.animNode)
            .to(0.25, {scale: v3(1.0, 1.0)})
            .call(() => {
                Emitter.instance.emit(BaseEventCode.SOUND.DRAGON_BIG_WIN);
                Emitter.instance.emit(BaseEventCode.SOUND.PLAY_EFFECT_JACKPOT_COIN);
                this.particleCoin.active = true;
                this.particleCoin.getComponent(gf3DParticle).startAnimation();
                this._tweenCoin();
                this._canQuickShow = true;
            })
            .start();

        this.scheduleOnce(() => {
            this.winFrame.getComponent(Button).interactable = true;
        }, 0.65);
    }

    setCallbackHide(callback) {
        this._callbackHide = callback;
    }

    _tweenCoin() {
        const superValue = this.winValue * 0.75;
        this.tweenCoin = tween(this)
            .to(this._duration / 2, null, {
                onUpdate: (target, ratio) => {
                    this.coinValue = ratio * superValue;
                }
            })
            .to(this._duration / 2, null, {
                onUpdate: (target, ratio) => {
                    this.coinValue += (this.winValue - this.coinValue) * ratio;
                }
            })
            .call(() => {
                this.hideFn();
            });
        this.tweenCoin.start();
    }

    quickShow() {
        if (!this._canQuickShow) {
            return;
        }
        super.quickShow();
    }

    hideFn() {
        Emitter.instance.emit(BaseEventCode.SOUND.STOP_EFFECT_JACKPOT_COIN);
        DataStore.instance.curBGMusic = null;
        Emitter.instance.emit(BaseEventCode.SOUND.PLAY_SOUND_BACKGROUND, GameConfig.instance.SOUND_BACKGROUND_CONFIG.IN_GAME);

        tween(this.node)
            .delay(0.5)
            .then(fadeOut(0.5))
            .call(() => {
                this.particleCoin.getComponent(gf3DParticle).stopAnimation();
                Emitter.instance.emit(BaseEventCode.DRAGON.JACKPOT_WINAMOUNT_POPUP_CLOSE);
                this._callbackHide && this._callbackHide();
            })
            .removeSelf()
            .start();
        Emitter.instance.emit(EventCode.SOUND.POPUP_JACKPOT, 0);
    }
}

