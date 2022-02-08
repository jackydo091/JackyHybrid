
import { gfSkillController } from '../../../cc30-fishbase/Scripts/Components/gfSkillController';
import { _decorator, Component, Node, v3 } from 'cc';
import { registerEvent, SetZIndex } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import EventsCode1988 from './EventsCode1988';
import ReferenceManager1988 from './ReferenceManager1988';
import Config1988 from './Config1988';
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import DataStore1988 from './DataStore1988';
import { Player1988 } from '../Component/Player1988';
const { ccclass, property } = _decorator;

@ccclass('SkillController1988')
export class SkillController1988 extends gfSkillController {
    
    initEvents() {
        super.initEvents();
        registerEvent(EventsCode1988.PLAYER_LAYER.CHANGE_GUN_DRILL, this.playerChangeDrillGun, this);
        registerEvent(EventsCode1988.EFFECT_LAYER.DRILL_EXPLOSION, this.playerResetGun, this);
        registerEvent(EventsCode1988.GAME_LAYER.RESUME_DRILL, this.onPlayerResumeDrill, this);
    }



    onPlayerResumeDrill(data){
        data.forEach(element => {
            const player = ReferenceManager1988.instance.getPlayerByDeskStation(element.DeskStation);
            if(player){
                element.isResume = true;
                const gunSkill = this.listGunSkill[player.index];
                if (gunSkill) {
                    gunSkill.onFireSkill(element);
                }
            }
        });
    }

    playerChangeDrillGun(DeskStation){
        const player = ReferenceManager1988.instance.getPlayerByDeskStation(DeskStation);
        if (player) {
            const gunSkill = this.listGunSkill[player.index];
            if (gunSkill) {
                const dataSpecialGun = {
                    DeskStation,
                    SkillID: Config1988.instance.SkillConfig.DRILL
                };
                gunSkill.changeSpecialGun(dataSpecialGun);
            }
        }
    }

    catchFishBySkill(data) {
        const player = ReferenceManager1988.instance.getPlayerByDeskStation(data.DeskStation);
        if (player) {
            switch (data.SkillID) {
                case Config1988.instance.SkillConfig.LASER:
                    if (player.index > 1) data.Angle += 180;
                    const gunSkill = this.listGunSkill[player.index];
                    if (gunSkill) {
                        gunSkill.onFireSkill(data);
                    }
                    break;
                case Config1988.instance.SkillConfig.FISH_BOMB:
                    gfEventEmitter.instance.emit(EventsCode1988.FISH_LAYER.CATCH_FISH_BY_SKILL, data);
                    break;
                case Config1988.instance.SkillConfig.DRILL:
                    if (player.index > 1) data.Angle += 180;
                    const gunSkillDrill = this.listGunSkill[player.index];
                    if (gunSkillDrill) {
                        gunSkillDrill.onFireSkill(data);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    playerResetGun(data){
        const { deskStation } = data;
        const player = ReferenceManager1988.instance.getPlayerByDeskStation(deskStation);
        if (player) {
            player.resetGunDrillToNormal();
        }
    }
}
