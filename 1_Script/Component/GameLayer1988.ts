import { _decorator } from 'cc';
import { GfGameLayer } from '../../../cc30-fishbase/Scripts/Components/gfGameLayer';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventCode from '../Common/EventsCode1988';
import gfMainFSM from '../../../cc30-fishbase/Scripts/Common/gfMainFSM';
import gfGameScheduler from '../../../cc30-fishbase/Scripts/FishGroup/gfGameScheduler';
import { removeEvents } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
const { ccclass } = _decorator;

@ccclass('GameLayer1988')
export class GameLayer1988 extends GfGameLayer {

    start() {
        super.start();
        if(!gfMainFSM.instance.isStateExit()) {
            Emitter.instance.emit(EventCode.EFFECT_LAYER.PLAY_WAVE_TRANSITION_CUSTOM, true);
        }
    }

    onDestroy() {
        this.resetOnExit();
        gfGameScheduler.destroy();
        removeEvents(this);
    }

    // catchFishBySkill(data) {
    //     const player = ReferenceManager.instance.getPlayerByDeskStation(data.DeskStation);
    //     if (player) {
    //         switch (data.SkillID) {
    //         case GameConfig.instance.SkillConfig.LASER:
    //             if (player.index > 1) data.Angle += 180;
    //             player.onPlayerFireLaser(data);
    //             break;
    //         case GameConfig.instance.SkillConfig.FISH_BOMB:
    //             Emitter.instance.emit(EventCode.FISH_LAYER.CATCH_FISH_BY_SKILL, data);
    //             break;
    //         case GameConfig.instance.SkillConfig.DRILL:
    //             if (player.index > 1) data.Angle += 180;
    //             player.onPlayerFireDrill(data);
    //             break;
    //         default:
    //             break;
    //         }
    //     }
    // }
}
