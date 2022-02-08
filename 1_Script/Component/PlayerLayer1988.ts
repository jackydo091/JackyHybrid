
import { convertAssetArrayToObject } from '../../../../cc-common/cc-share/common/utils';
import { registerEvent, removeEvents } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator, Component, Node } from 'cc';
import { gfPlayerLayer } from '../../../cc30-fishbase/Scripts/Components/gfPlayerLayer';
import EventsCode1988 from '../Common/EventsCode1988';
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import { Player1988 } from './Player1988';
const { ccclass, property } = _decorator;

@ccclass('PlayerLayer1988')
export class PlayerLayer1988 extends gfPlayerLayer {
    @property({type: Player1988, override: true})
    listPlayer: Player1988[] = [];
    @property(Node)
    private effectCircleIsMe: Node = null;

    initEvents(){
        super.initEvents();
        registerEvent(EventsCode1988.PLAYER_LAYER.CHANGE_GUN_DRILL, this.playerChangeGunDrill, this);
        registerEvent(EventsCode1988.EFFECT_LAYER.DRILL_EXPLOSION, this.playerResetGun, this);
    }

    configAllPlayer(){
        for (let i = 0; i < this.listPlayer.length; i++) {
            this.listPlayer[i].gunSprite = convertAssetArrayToObject(this.listGunSprite);
            this.listPlayer[i].avatarAtlas = this.avatarAtlas;
            this.listPlayer[i].waitingText = this.listWaiting[i];
            this.listPlayer[i].index = i;
            this.listPlayer[i].effectIsMe = this.effectIsMe;
            this.listPlayer[i].effectCircleIsMe = this.effectCircleIsMe;
            this.listPlayer[i].effectMaxGun = this.effectMaxGun;
        
        }
    }

    playerChangeGunLaser(DeskStation) {
        const player = this.getPlayerByDeskStation(DeskStation);
        if (player) {
            gfEventEmitter.instance.emit(EventsCode1988.SOUND.GUN_EQUIP);
            //player.changeGunLaser(DeskStation);
        }
    }

    playerChangeGunDrill(DeskStation) {
        const player = this.getPlayerByDeskStation(DeskStation);
        if (player) {
            gfEventEmitter.instance.emit(EventsCode1988.SOUND.GUN_EQUIP);
            //player.changeGunDrill(DeskStation);
        }
    }

    playerResetGun(data){
        const { deskStation } = data;
        const player = this.getPlayerByDeskStation(deskStation);
        if (player) {
            //player.resetGunDrillToNormal(deskStation);
        }
    }

    onDragonWarning() {
    }

    onDragonCreated() {
    }

    hideBallTray() {
    }

    hideAllPlayer() {
        super.hideAllPlayer();
        this.effectCircleIsMe.active = false;
    }

    onDestroy() {
        super.onDestroy();
        removeEvents(this);
    }
}

