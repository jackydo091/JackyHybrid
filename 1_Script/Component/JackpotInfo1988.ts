import { GfJackpotInfo } from "../../../cc30-fishbase/Scripts/Common/gfJackpotInfo";
import { tween, _decorator } from "cc";
import Emitter from "../../../cc30-fishbase/Scripts/Common/gfEventEmitter";
import EventCode from "../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import EventsCode1988 from "../Common/EventsCode1988";
import { stopAllActions } from "../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";
import { registerEvent, removeEvents } from "../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import gfDataStore from "../../../cc30-fishbase/Scripts/Common/gfDataStore";

const { ccclass, property }  = _decorator

const TIME_CONFIG = {
    blink: 1.5,
    session_1: 20,
    session_2: 15,
    session_3: 15,
};

const SKIN_NAME = {
    skin_1 : "blue",
    skin_2 : "yellow",
    skin_3 : "orange",
    skin_4 : "red"
};

const ANIMATION_NAME = {
    idle: "animation",
    mix: "mix",
}

@ccclass('JackpotInfo1988')
export class JackpotInfo1988 extends GfJackpotInfo {
    
    _isWarned = false;
    _lostTime = 0;

    initEvents() {
        super.initEvents();
        registerEvent(EventCode.COMMON.GAME_SHOW, this.resetOnExit, this);
        registerEvent(EventCode.DRAGON.CREATE, this.playAnimBossAppear, this);
        registerEvent(EventsCode1988.GAME_LAYER.BORIS_END, this.resetSkinJackpotInfo, this);
    }

    onDragonWarning(){
        Emitter.instance.emit(EventsCode1988.SOUND.BORIS_WARNING);
        stopAllActions(this.node);
        this.jackpotAnim.setAnimation(0, ANIMATION_NAME.mix, true);
        tween(this.node)
            .delay(3)
            .call(()=> {
                this.jackpotAnim.setAnimation(0, ANIMATION_NAME.idle, true);
            })
            .start();
    }

    playAnimBossAppear(data){
        this._lostTime = Math.max(0, (gfDataStore.instance.getTime() - data.BuildTick) / 1000);
        stopAllActions(this.node);
        if(data.isResume){
            this.resumeAnimBossAppear();
        }
        else{
            tween(this.node)
                .then(this.animSwitchStateBoss(SKIN_NAME.skin_2, TIME_CONFIG.session_1 - TIME_CONFIG.blink))
                .then(this.animSwitchStateBoss(SKIN_NAME.skin_3, TIME_CONFIG.session_2 - TIME_CONFIG.blink))
                .then(this.animSwitchStateBoss(SKIN_NAME.skin_4, TIME_CONFIG.session_3 - TIME_CONFIG.blink))
                .then(this.animComingToEnd())
                .start();
        }  
    }

    resumeAnimBossAppear() {
        if(this._lostTime > 0 && this._lostTime <= 20) {
            this.jackpotAnim.setSkin(SKIN_NAME.skin_2);
            let dur = TIME_CONFIG.session_1 - this._lostTime;
            tween(this.node)
                .delay(dur)
                .then(this.animSwitchStateBoss(SKIN_NAME.skin_3, TIME_CONFIG.session_2 - TIME_CONFIG.blink))
                .then(this.animSwitchStateBoss(SKIN_NAME.skin_4, TIME_CONFIG.session_3 - TIME_CONFIG.blink))
                .then(this.animComingToEnd())
                .start();
        } else if(this._lostTime > 20 && this._lostTime <= 35) {
            this.jackpotAnim.setSkin(SKIN_NAME.skin_3);
            let dur = TIME_CONFIG.session_2 - (this._lostTime - TIME_CONFIG.session_1);
            tween(this.node)
                .delay(dur)
                .then(this.animSwitchStateBoss(SKIN_NAME.skin_4, TIME_CONFIG.session_3  - TIME_CONFIG.blink))
                .then(this.animComingToEnd())
                .start();
        } else if(this._lostTime > 35 && this._lostTime <= 60) {
            this.jackpotAnim.setSkin(SKIN_NAME.skin_4);
            let dur = TIME_CONFIG.session_3 - (this._lostTime - (TIME_CONFIG.session_1 + TIME_CONFIG.session_2));
            dur = dur > 0 ? dur : 0;
            tween(this.node)
                .delay(dur)
                .then(this.animComingToEnd())
                .start();
        }
    }

    animSwitchStateBoss(skinName, durSession) {
        return  tween()
                .call(()=> {
                    this.jackpotAnim.setAnimation(0, ANIMATION_NAME.mix, true);
                })
                .delay(TIME_CONFIG.blink / 2)
                .call(()=> {
                    this.jackpotAnim.setSkin(skinName);
                })
                .delay(TIME_CONFIG.blink / 2)
                .call(()=> {
                    this.jackpotAnim.setAnimation(0, ANIMATION_NAME.idle, true);
                })
                .delay(durSession)
    }

    animComingToEnd() {
        return tween()
                .call(()=> {
                    this.jackpotAnim.setAnimation(0, ANIMATION_NAME.mix, true);
                })
    }

    resetSkinJackpotInfo(){
        stopAllActions(this.node);
        this.jackpotAnim.setSkin(SKIN_NAME.skin_1);
        this.jackpotAnim.setAnimation(0, ANIMATION_NAME.idle, true);
    }

    resetOnExit(){
        super.resetOnExit();
        this.resetSkinJackpotInfo();
    }

    onDestroy() {
        super.onDestroy();
        removeEvents(this);
    }
}
