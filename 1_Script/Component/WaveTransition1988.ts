import { registerEvent, removeEvents, SetZIndex } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator, UITransform, sp, sys } from 'cc';
import { GfWaveTransition } from '../../../cc30-fishbase/Scripts/Components/Transition/gfWaveTransition';
import EventCode from '../Common/EventsCode1988';
import { setOpacity } from '../../../../cc-common/cc-share/common/utils';
import { stopAllActions } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import GameConfig from '../Common/Config1988';
const { ccclass } = _decorator;

@ccclass('WaveTransition1988')
export class WaveTransition1988 extends GfWaveTransition {
    isPlaying: boolean;

    initEvents() {
        super.initEvents();
        registerEvent(EventCode.EFFECT_LAYER.PLAY_WAVE_TRANSITION_CUSTOM, this.playWaveTransition, this);
        setOpacity(this.wave, 0);
    }

    start(){
        this.node.active = false;
    }

    playWaveTransition(isPlayNow?) {
        if(this.isPlaying) {
            return;
        }
        this.node.active = true;
        setOpacity(this.wave, 255);
        this.resetOnExit();
        this.node.active = true;
        SetZIndex(this.node.parent,  GameConfig.instance.Z_INDEX.WAITING + (isPlayNow ? 50 : - 50));
        this.isPlaying = true;
        this.wave.getComponent(sp.Skeleton).timeScale = 1.35;
        this.wave.getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
        if(isPlayNow) {
            this.wave.getComponent(sp.Skeleton).getCurrent(0).animationStart = this.wave.getComponent(sp.Skeleton).getCurrent(0).animationEnd * 0.2;
        }
        this.wave.getComponent(sp.Skeleton).setCompleteListener(() => {
            this.resetOnExit();

        });
    }
    

    resetOnExit() {
        stopAllActions(this.node);
        this.node.active = false;
        setOpacity(this.wave, 255);
        setOpacity(this.node, 255);
        this.isPlaying = false;
    }

    onDestroy() {
        super.onDestroy();
        removeEvents(this);
    }
}
