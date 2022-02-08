
import { _decorator, Component, warn } from 'cc';
import {registerEvent, removeEvents} from "../../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import EventCode from "../../Common/EventsCode1988";
import BaseEvents from "../../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import ReferenceManager from "../../Common/ReferenceManager1988";
import {PanelChip1988} from "./PanelChip1988";
import FishManager from "../../Common/FishManager1988";
import Emitter from "../../../../cc30-fishbase/Scripts/Common/gfEventEmitter";

const lodash = globalThis._;
const SIZE_PASSWORD = 7;
const { ccclass, property } = _decorator;
@ccclass('PanelJackpotController1988')
export class PanelJackpotController1988 extends Component {
    @property(PanelChip1988)
    arrPanelChip: PanelChip1988 [] = [];
    _maxItemID:number = 0;
    _deskStationWonJP: number = null;
    _arrayChipGot: any [] = [0, 0, 0, 0];

    onLoad() {
        this.reset();
        this.initEvents();
        
        for(let index = 0; index < this.arrPanelChip.length; ++index){
            const panelChip:any = this.arrPanelChip[index];
            panelChip.setIndex(index);
        }

        ReferenceManager.instance.setData({ PanelJackpotLayer: this.node });
    }

    initEvents() {
        registerEvent(BaseEvents.DRAGON.CREATE, this.onBorisCreated, this);
        registerEvent(BaseEvents.COMMON.GAME_HIDE, this.reset, this);
        registerEvent(EventCode.GAME_LAYER.UPDATE_PANEL_CHIP, this.updatePanelChip, this);
        registerEvent(EventCode.GAME_LAYER.HIDE_PANEL_CHIP, this.reset, this);
        registerEvent(BaseEvents.PLAYER_LAYER.UPDATE_LIST_PLAYER, this.updateListPlayer, this);
        registerEvent(BaseEvents.PLAYER_LAYER.PLAYER_JOIN_BOARD, this.playerJoinBoard, this);
        registerEvent(BaseEvents.PLAYER_LAYER.PLAYER_LEAVE_BOARD, this.playerLeaveBoard, this);
        registerEvent(BaseEvents.DRAGON.ON_BALL_DROPPED, this.chipDropped, this);
        registerEvent(EventCode.GAME_LAYER.BORIS_WAIT_DIE, this.borisWaitDie, this);
        registerEvent(EventCode.GAME_LAYER.BORIS_END, this.onBorisDied, this);
    }

    onBorisCreated(data) {
        const listPlayerSize = 4;
        for (let DeskStation = 0; DeskStation < listPlayerSize; ++DeskStation) {
            const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
            if (player.isActive()) {
                this.showPanelChipByIndex(player.index, player.isMe);
            }
        }
        //nếu resume thì không chạy anim
        if (!data.maxItemID) {
            data.maxItemID = 0;
        }
        this._maxItemID = data.maxItemID;
    }

    onBorisDied(){
        const listPlayerSize = 4;
        for (let DeskStation = 0; DeskStation < listPlayerSize; ++DeskStation) {
            const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
            if (player.isActive()) {
                const panelChip = this.getPanelChipByIndex(player.index);
                panelChip.getComponent(PanelChip1988).setHide();
            }
        }
        this._arrayChipGot = [0, 0, 0, 0];
        this._deskStationWonJP = null;
    }

    showPanelChipByIndex(index, isMe = false) {
        this.arrPanelChip[index].getComponent(PanelChip1988).show();
    }

    hidePanelChipByIndex(index) {
        this.arrPanelChip[index].getComponent(PanelChip1988).hide();
    }

    resumePanelChip(arrChip, DeskStation) {
        const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
        if (player.isActive()) {
            const panelChipMainCompo = this.getPanelChipByIndex(player.index).getComponent(PanelChip1988);
            if(!panelChipMainCompo) return;
            panelChipMainCompo.show();
            this._arrayChipGot[+DeskStation] = arrChip.length;
            panelChipMainCompo.resumeData(arrChip);

        }
    }

    //nhận thông tin chip bay về và cập nhật dataPanel Chip
    updatePanelChip(data) {
        const { DeskStation, itemId, GoldReward } = data;
        const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
        const panelChip = this.getPanelChipByIndex(player.index);
        panelChip.getComponent(PanelChip1988).addChip(itemId, GoldReward, undefined);
        if(itemId != 0){
            this._arrayChipGot[+DeskStation]++;
            if(this._arrayChipGot[+DeskStation] == SIZE_PASSWORD){
                this.forceDecryptionAllEnergy();
            }
        }
    }

    updateListPlayer(data) {
        if (!data) {
            warn("Why have not data?? ", data);
            return;
        }
        //@ts-ignore
        const bossBoris = FishManager.instance.getBossBoris();
        if (bossBoris) {
            data.forEach(({ DeskStation, chips }) => {
                if (!chips) {
                    chips = [];
                }
                this.resumePanelChip(chips, DeskStation);
            });
        }
        else {
            this.reset();
        }
    }

    playerJoinBoard(data) {
        if (!data) {
            warn("Why have not data?? ", data);
            return;
        }
        //@ts-ignore
        const bossBoris = FishManager.instance.getBossBoris();
        const isBossAvailable = bossBoris && bossBoris.isAvailable();
        if (isBossAvailable) {
            const { chips, DeskStation } = data;
            this.resumePanelChip(chips, DeskStation);
        }
    }

    playerLeaveBoard({ DeskStation }) {
        const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
        if (player.isMe) {
            this.reset();
            return;
        }
        this.hidePanelChipByIndex(player.index);
        if(DeskStation === this._deskStationWonJP){
            Emitter.instance.emit(EventCode.FISH_LAYER.CATCH_BORIS);
            this._deskStationWonJP = null;
        }
    }

    chipDropped(data) {
        const { DeskStation, GoldReward } = data;
        const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
        if(player.isMe){
            player.addGoldReward(GoldReward);
        }
    }

    borisWaitDie(data){
        const { DeskStation, wonJackpot } = data;
        if(wonJackpot){
            this._deskStationWonJP = DeskStation;
        }
    }

    forceDecryptionAllEnergy() {
        const listPlayerSize = 4;
        for (let DeskStation = 0; DeskStation < listPlayerSize; ++DeskStation) {
            const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
            if (player.isActive()) {
                const panelChip = this.getPanelChipByIndex(player.index);
                //error("forceDecryptionAllEnergy");
                panelChip.getComponent(PanelChip1988).playAnimGetChipWinJackpot();
            }
        }
    }

    getPanelChipByIndex(index) {
        return this.arrPanelChip[index];
    }

    reset() {
        //todo reset all
        this.arrPanelChip.forEach(panelChip => {
            panelChip.getComponent(PanelChip1988).hide();
        });
        this._deskStationWonJP = null;
        this._arrayChipGot = [0, 0, 0, 0];
    }

    onDestroy() {
        removeEvents(this);
    }
    // update (dt) {},
}


