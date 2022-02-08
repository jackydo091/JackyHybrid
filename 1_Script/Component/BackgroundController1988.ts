import { _decorator, sys, sp, tween, v3, Sprite } from 'cc';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventCode from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import GameConfig from '../../../cc30-fishbase/Scripts/Config/gfBaseConfig';
import {  setOpacity } from '../../../../cc-common/cc-share/common/utils';
import { stopAllActions, fadeOut, fadeIn } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import { GfBackgroundController } from '../../../cc30-fishbase/Scripts/Common/gfBackgroundController';
import EventsCode1988 from '../Common/EventsCode1988';

const { ccclass, property } = _decorator;

@ccclass('BackgroundController1988')
export class BackgroundController1988 extends GfBackgroundController {

    onChangeRound(data) {
        if (data && data.isFishGroupToNormal) {
            const backgroundID = data.SceneKind;
            if (this._curBackgroundID === backgroundID) {
                return;
            }
            Emitter.instance.emit(EventCode.GAME_LAYER.MOVE_OUT_ALL_FISHES, false);
            this._curBackgroundID = backgroundID;
            Emitter.instance.emit(EventCode.EFFECT_LAYER.PLAY_WAVE_TRANSITION);
            Emitter.instance.emit(EventCode.GAME_LAYER.CHANGE_BUBBLE, this._curBackgroundID);
            setOpacity(this.background2.node, 0);
            this.background2.spriteFrame = this.arrDataBackground[this._curBackgroundID];

            tween(this.background1.node)
                .delay(1)
                .then(fadeOut(1.5))
                .call(() => {
                    this.background1.spriteFrame = this.arrDataBackground[this._curBackgroundID];
                    setOpacity(this.background1.node, 255);
                })
                .start();

            tween(this.background2.node)
                .delay(1)
                .then(fadeIn(1.5))
                .start();
        }
        else if(data && !data.isFishGroupToNormal){
            tween(this.node)
                .delay(4)
                .call(()=>{
                    Emitter.instance.emit(EventsCode1988.SOUND.WAVE);
                    Emitter.instance.emit(EventCode.SOUND.PLAY_SOUND_BACKGROUND, GameConfig.instance.SOUND_BACKGROUND_CONFIG.FISH_GROUP);
                })
                .start();
        }
    }

    resetOnExit(){
        stopAllActions(this.node);
    }

}
