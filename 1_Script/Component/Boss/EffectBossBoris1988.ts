import { _decorator, Component, Node, Prefab, instantiate, v3, UITransform, log, tween, isValid } from 'cc';
import { registerEvent, removeEvents, SetZIndex } from "../../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import EventCode from "../../Common/EventsCode1988";
import GameConfig from "../../Common/Config1988";
import { getPostionInOtherNode } from '../../../../../cc-common/cc-share/common/utils';
import ReferenceManager from "../../Common/ReferenceManager1988";
import Emitter from "../../../../cc30-fishbase/Scripts/Common/gfEventEmitter";
import { Chip1988 } from "./Chip1988";
import PoolManager from "../../Common/PoolManager1988";
import { stopAllActions } from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";
import BaseEvent from "../../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import { EffectLightning1988 } from "./EffectLightning1988";
import FishManager from "../../Common/FishManager1988";
import { PanelChip1988 } from "./PanelChip1988";
import { BorisStatic1988 } from './BorisStatic1988';

const DELAY_TIME_STATIC = 0.05;
const { ccclass, property } = _decorator;
interface IEndData {
    DeskStation: number,
    WinAmount: number,
    wonJackpot: boolean
}

interface IInfoEffect {
    effect: Prefab,
    deskStation: number
}

@ccclass('EffectBossBoris1988')
export class EffectBossBoris1988 extends Component {
    @property(Prefab)
    chip: Node;
    @property(Prefab)
    jackpotWinPopup: Prefab;
    @property(Prefab)
    borisStaticPrefab: Prefab;
    @property(Prefab)
    effectLighting: Node = null;
    endData: IEndData = null;
    _borisStatic: Node = null;
    _isTurnOffStatic: boolean = true;
    _currTimeDelayStatic: 0;
    _countChipDroping: 0;
    _arrInfoEffect: Array<Object> = [];
    _winJackPotPopup: any = null;
    _arrBorisStatic: any[] = [];
    onLoad() {
        this.initEvents();
    }

    initEvents() {
        registerEvent(BaseEvent.DRAGON.DROP_BALL, this.dropChip, this);
        registerEvent(EventCode.GAME_LAYER.PLAY_JACKPOT_BORIS, this.showJackpotWinPopup, this);
        // nếu chốt xoá tính năng effectBorisFlyWarning thì sẽ xoá hàm
        //registerEvent(EventCode.DRAGON.WARNING, this.effectBorisFlyWarning, this);
        registerEvent(BaseEvent.COMMON.EXIT_GAME_ROOM, this.resetOnExit, this);
        registerEvent(BaseEvent.GAME_LAYER.ON_ENTER_GAME_ROOM, this.resetOnExit, this);
        registerEvent(BaseEvent.COMMON.GAME_HIDE, this.resetOnExit, this);
        registerEvent(BaseEvent.PLAYER_LAYER.PLAYER_LEAVE_BOARD, this.playerLeaveBoard, this);

        registerEvent(EventCode.EFFECT_LAYER.PLAY_EFFECT_LIGHTING, this.createEffectLightning, this);
        registerEvent(BaseEvent.DRAGON.ON_END, this.onDragonEnd, this);
    }

    showJackpotWinPopup() {
        //TODO popup win jackpot
        const isHaveDataWinJackpot = this.endData && this.endData.DeskStation != -1;
        if (!isHaveDataWinJackpot) {
            log("player exited or wrong data: " + this.endData);
            return;
        }
        const player = ReferenceManager.instance.getPlayerByDeskStation(this.endData.DeskStation);
        const winAmount = this.endData.WinAmount;
        const panelJackpotLayer = ReferenceManager.instance.getPanelJackpotLayer();
        const panelJackpotComp = panelJackpotLayer.getComponent("PanelJackpotController1988");
        if (player.isMe) {
            this._winJackPotPopup = instantiate(this.jackpotWinPopup);
            this._winJackPotPopup.getComponent('gfJackpotWinPopup').setWinValue(winAmount);
            this._winJackPotPopup.parent = this.node.parent;
            SetZIndex(this._winJackPotPopup, GameConfig.instance.Z_INDEX.NOTIFY + 1);
            this._winJackPotPopup.getComponent('gfJackpotWinPopup').setCallbackHide(() => {
                player.addToDisplayWallet(winAmount);
            });
            const panelChip = panelJackpotComp.getPanelChipByIndex(player.index);
            panelChip.getComponent(PanelChip1988).hide();
        } else {
            this._winJackPotPopup = instantiate(this.jackpotWinPopup);
            this._winJackPotPopup.getComponent('gfJackpotWinPopup').setWinValue(winAmount);
            this._winJackPotPopup.parent = this.node.parent;
            SetZIndex(this._winJackPotPopup, GameConfig.instance.Z_INDEX.NOTIFY + 1);
            const info: IInfoEffect = {
                effect: this._winJackPotPopup,
                deskStation: this.endData.DeskStation
            };
            this._arrInfoEffect.push(info);

            const panelChip = panelJackpotComp.getPanelChipByIndex(player.index);
            this._winJackPotPopup.getComponent('gfJackpotWinPopup').setCallbackHide(() => {
                const indexEff = this._arrInfoEffect.indexOf(info);
                if (indexEff != -1) {
                    this._arrInfoEffect.splice(indexEff, 1);
                }
                panelChip.getComponent(PanelChip1988).hide();
            });
            const pos = getPostionInOtherNode(this.node.parent, panelChip.getComponent(PanelChip1988).frameTextWin.node);
            this._winJackPotPopup.setScale(0.25, 0.25, 1);
            let dir = 1;
            if (player.index == 2 || player.index == 3) {
                dir = -1;
            }
            this._winJackPotPopup.position = v3(pos.x, pos.y + 75 * dir);
            this._winJackPotPopup.getComponent('gfJackpotWinPopup').node.getChildByName("black").active = false;
        }
        this.endData = undefined;
    }

    dropChip(data) {
        Emitter.instance.emit(EventCode.SOUND.CHIP_DROP);
        const { DeskStation, GoldReward, itemChipID } = data;
        const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
        const panelJackpotLayer = ReferenceManager.instance.getPanelJackpotLayer();
        const panelJackpotComp = panelJackpotLayer.getComponent("PanelJackpotController1988");
        const panelChip = panelJackpotComp.getPanelChipByIndex(player.index);

        const trayChip = panelChip.getComponent(PanelChip1988).trayChip;
        const chip = instantiate(this.chip);
        chip.parent = this.node;
        chip.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(data.position);
        const posEndWorldSpace = trayChip.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        const endPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(posEndWorldSpace);
        const info = {
            effect: chip,
            deskStation: DeskStation
        };
        this._arrInfoEffect.push(info);
        chip.getComponent(Chip1988).onChipFlyToPlayer(endPos, 0, player.isMe, () => {
            Emitter.instance.emit(EventCode.GAME_LAYER.UPDATE_PANEL_CHIP, {
                DeskStation: DeskStation,
                itemId: itemChipID,
                GoldReward: GoldReward,
                callback: null
            });
            const indexEff = this._arrInfoEffect.indexOf(info);
            if (indexEff != -1) {
                this._arrInfoEffect.splice(indexEff, 1);
            }
        });
    }

    effectBorisFlyWarning() {
        this._borisStatic = instantiate(this.borisStaticPrefab);
        this._isTurnOffStatic = false;
        this.node.addChild(this._borisStatic);
        this._borisStatic.position = v3(-960, -540);
        this._borisStatic.angle = -20;
        Emitter.instance.emit(EventCode.SOUND.BORIS_OUT);
        tween(this._borisStatic)
            .to(0.5, { position: v3(960, 540, 0) })
            .delay(3)
            .call(() => {
                this._borisStatic.position = v3(960, -540);
                this._borisStatic.angle = 20;
                Emitter.instance.emit(EventCode.SOUND.BORIS_OUT);
                Emitter.instance.emit(EventCode.SOUND.BORIS_THE_ANIMALS);
            })
            .to(.5, { position: v3(-960, 540) })
            .call(() => {
                this._isTurnOffStatic = true;
            })
            .removeSelf()
            .call(()=>{
                this._borisStatic.destroy();
            })
            .start();
    }

    createBorisStatic({ position, angle }) {
        // @ts-ignore
        const borisStatic: BorisStatic1988 = PoolManager.instance.createBorisStatic({
            position: position,
            parent: this.node,
            zIndex: 1,
            angle: angle,
        });
        this._arrBorisStatic.push(borisStatic);
        const callback = () => {
            const index = this._arrBorisStatic.indexOf(borisStatic);
            this._arrBorisStatic.splice(index, 1);
        }
        borisStatic.play(callback);
    }

    onDragonEnd(data) {
        if (data.wonJackpot) {
            this.endData = data;
            const player = ReferenceManager.instance.getPlayerByDeskStation(data.DeskStation);
            if(player.isMe){
                player.addGoldReward(data.WinAmount);
            }
        }
        
    }

    createEffectLightning() {
        if (!this.endData) {
            return;
        }
        const panelJackpotLayer = ReferenceManager.instance.getPanelJackpotLayer();
        const panelJackpotComp = panelJackpotLayer.getComponent("PanelJackpotController1988");
        const player = ReferenceManager.instance.getPlayerByDeskStation(this.endData.DeskStation);
        if (player.isActive()) {
            const panelChip = panelJackpotComp.getPanelChipByIndex(player.index);
            this.setupEffectLighting(panelChip.getComponent(PanelChip1988).trayChip, this.node);
        }
    }

    setupEffectLighting(nodeStart, parent) {
        // @ts-ignore
        const bossBoris = FishManager.instance.getBossBoris();
        const startPos = getPostionInOtherNode(parent, nodeStart);
        const endPos = bossBoris.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        const effectLighting = instantiate(this.effectLighting);
        effectLighting.parent = parent;
        effectLighting.position = startPos;
        this._arrInfoEffect.push(effectLighting);
        Emitter.instance.emit(EventCode.SOUND.LAST_DAMAGE);
        const callbackRemoveEffect = () => {
            Emitter.instance.emit(EventCode.FISH_LAYER.CATCH_BORIS);
            const indexEff = this._arrInfoEffect.indexOf(effectLighting);
            if (indexEff != -1) {
                this._arrInfoEffect.splice(indexEff, 1);
            }
        };
        effectLighting.getComponent(EffectLightning1988).playEffectLightning(endPos, callbackRemoveEffect);
    }

    update(dt) {
        if (!this._isTurnOffStatic &&
            this._currTimeDelayStatic >= DELAY_TIME_STATIC) {
            this.createBorisStatic({ position: this._borisStatic.position, angle: this._borisStatic.angle });
            this._currTimeDelayStatic = 0;
        } else {
            this._currTimeDelayStatic += dt;
        }
    }

    playerLeaveBoard({ DeskStation }) {
        const player = ReferenceManager.instance.getPlayerByDeskStation(DeskStation);
        if (player.isMe) {
            this.resetOnExit();
            return;
        } else {
            if (this._arrInfoEffect && this._arrInfoEffect.length > 0) {
                for (let index = 0; index < this._arrInfoEffect.length; ++index) {
                    const info: any = this._arrInfoEffect[index];
                    if (info.deskStation && info.deskStation == DeskStation && isValid(info.effect)) {
                        info.effect.removeFromParent();
                        info.effect.destroy();
                        this._arrInfoEffect.splice(index, 1);
                    }
                }
            }
            if (!this.endData) {
                return;
            }
            const isHaveEndDataWinJackpot = this.endData && this.endData.DeskStation == DeskStation;
            if (isHaveEndDataWinJackpot) {
                this.endData.DeskStation = -1;
            }
            if(this.endData.DeskStation === DeskStation){
                this.endData = undefined;
            }
        }
    }

    resetOnExit() {
        this._isTurnOffStatic = true;
        this._currTimeDelayStatic = 0;
        if (this._borisStatic) {
            stopAllActions(this._borisStatic);
            this._borisStatic.removeFromParent();
            this._borisStatic.destroy();
        }
        this._borisStatic = null;
        if (this._arrInfoEffect && this._arrInfoEffect.length > 0) {
            this._arrInfoEffect.forEach((info: any) => {
                const isHaveMoreInfo = info.effect && info.deskStation != undefined && info.deskStation != null;
                if (isHaveMoreInfo && isValid(info.effect)) {
                    if(info.effect.getComponent(Chip1988)){
                        info.effect.getComponent(Chip1988).onStopAllActions();
                    }
                    info.effect.removeFromParent();
                    info.effect.destroy();
                } else if (isValid(info)) {
                    info.removeFromParent();
                    info.destroy();
                }
            });
        }
        if (this._arrBorisStatic.length > 0) {
            this._arrBorisStatic.forEach((borisStatic) => {
                borisStatic.returnPool();
            })
            this._arrBorisStatic = [];
        }
        this.endData = undefined;
        this._arrInfoEffect.length = 0;
        if (isValid(this._winJackPotPopup)) {
            this._winJackPotPopup.removeFromParent();
            this._winJackPotPopup.destroy();
        }
    }

    onDestroy() {
        stopAllActions(this.node);
        removeEvents(this);
    }
}

