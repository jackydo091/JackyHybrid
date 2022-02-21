
import { registerEvent, removeEvents } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator,  Node, Button,  Vec3,  Animation, tween, Sprite } from 'cc';
import { GfHUDController } from '../../../cc30-fishbase/Scripts/Common/gfHUDController';
import EventsCode1988 from './EventsCode1988';
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import { fadeTo, stopAllActions, v3f } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import DataStore from './DataStore1988';
import GameConfig from './Config1988';
import { setOpacity } from '../../../../cc-common/cc-share/common/AnimUtils';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import FishManager1988 from './FishManager1988';


const { ccclass, property} = _decorator;
const TIME_SHOW_HIDE = 0.15;
@ccclass('HUDController1988')
export class HUDController1988 extends GfHUDController {
    @property(Node) 
    private listNodeAuto = [];

    _isShow:boolean = false;

    onLoad() {
        super.onLoad();
        this._scaleFactor = 1;
        this._posButton = [new Vec3(-90, 53, 1), new Vec3(90, 53, 1), new Vec3(0, 53, 1)];
        this.resetAllState();
        DataStore.instance.setIsCompoButtonAutoShow(false);
    }

    initEvents() {
        super.initEvents();
        registerEvent(EventsCode1988.GAME_LAYER.CLOSE_ALL_MENU, this.onClose, this);
    }
    
    onClose() {
        if(!DataStore.instance.getIsCompoButtonAutoShow()) return;
        else {
        }
    } 

    targetButtonsOff() {
        gfEventEmitter.instance.emit(gfBaseEvents.EFFECT_LAYER.HIDE_NOTIFY_LOCK_FISH);
        super.targetButtonsOff();
    }

    onClickTargetBtn(event, data) {
        gfEventEmitter.instance.emit(EventsCode1988.SOUND.SELECT_AUTO_MODE);
        if(this._isShow) {
        }
        else {
            this.changeStatusGroupButton(parseInt(data));
        }
        
    }


    resetAllState() {
        this._isShow = false;
        DataStore.instance.setIsCompoButtonAutoShow(false);
        this.fxBtnBelow.active = false;
        DataStore.instance.setDataStore({
            targetState: GameConfig.instance.TARGET_LOCK.NONE,
            currentTargetState: GameConfig.instance.TARGET_LOCK.NONE
        });
    }

    onAutoTargetOne() {
        const selfInfo = DataStore.instance.getSelfInfo();
        if (selfInfo.LockFishKind > -1) {
            if (!selfInfo.LockFish || !selfInfo.LockFish.isAvailable()) {
                DataStore.instance.setSelfInfo({ LockFish: FishManager1988.instance.getFishByType(selfInfo.LockFishKind) });
            }
            if (selfInfo.LockFish && selfInfo.LockFish.isAvailable()) {
                gfEventEmitter.instance.emit(gfBaseEvents.GAME_LAYER.ON_SEND_FIRE, {
                    point: selfInfo.LockFish.node.position,
                    lockFishID: selfInfo.LockFish._FishID,
                });
            } else {
                this.resetAllState();
                this.changeStatusGroupButton(GameConfig.instance.TARGET_LOCK.NONE);
            }
        }
    }

    stopAllNodeAction() {
        stopAllActions(this.fxBtnAbove);
    }

    updateLockFishImg(fishKind = 0) {
        super.updateLockFishImg(fishKind);
        gfEventEmitter.instance.emit(EventsCode1988.SOUND.TARGET_LOCK_ONE);
    }

    interactableHUD(interactable = true) {
        super.interactableHUD(interactable);
    }

    resetOnExit(){
        super.resetOnExit();
        this.resetLockFish();
        this.resetAllState();
    }

    onDestroy(){
        super.onDestroy();
        removeEvents(this);
    }
}