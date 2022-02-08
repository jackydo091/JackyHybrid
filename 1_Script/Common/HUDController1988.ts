
import { registerEvent, removeEvents } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator, Component, Node, Button, error, Vec3, warn, Animation, tween, Sprite } from 'cc';
import { GfHUDController } from '../../../cc30-fishbase/Scripts/Common/gfHUDController';
import EventsCode1988 from './EventsCode1988';
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import { call, fadeTo, stopAllActions, v3f } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import DataStore from './DataStore1988';
import GameConfig from './Config1988';
import { setOpacity } from '../../../../cc-common/cc-share/common/AnimUtils';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import FishManager1988 from './FishManager1988';
import gfDataStore from '../../../cc30-fishbase/Scripts/Common/gfDataStore';
import gfBaseConfig from '../../../cc30-fishbase/Scripts/Config/gfBaseConfig';


const { ccclass, property} = _decorator;
const TIME_SHOW_HIDE = 0.15;
@ccclass('HUDController1988')
export class HUDController1988 extends GfHUDController {
    @property(Node)
    private nodeSkill: Node = null;
    @property(Button)
    private btnSkill: Button = null;
    @property(Node) 
    private listNodeAuto = [];
    @property(Node) 
    private fxShowSkill: Node = null;

    _isShow:boolean = false;

    onLoad() {
        super.onLoad();
        this._scaleFactor = 1;
        this._posButton = [new Vec3(-90, 90, 1), new Vec3(90, 90, 1), new Vec3(0, 120, 1), new Vec3(0, 90, 1)];
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
            this.onAnimHide();
        }
    } 

    onButtonSkillClick() {
        this.stopAllNodeAction();
        gfEventEmitter.instance.emit(EventsCode1988.SOUND.OPEN_COMPO_AUTO);
        tween(this.nodeSkill)
            .call(()=> {
                this.btnSkill.enabled = true;
            })
            .parallel(
                tween().to(TIME_SHOW_HIDE / 2, {position: new Vec3(0, this.nodeSkill.position.y - 40, 1), scale: v3f(0.5)}),
                tween().then(fadeTo(TIME_SHOW_HIDE / 2, 100))
            )
            .call(()=> {
                setOpacity(this.nodeSkill, 0);
                this.nodeSkill.active = false;
                this.onAnimShow();
            })
            .start();

    }

    targetButtonOn(type) {
        if(!DataStore.instance.getOldTarget()) return;
        if (this.fxBtnBelow && !this.fxBtnBelow.active) {
            this.fxBtnBelow.active = true;
        }
        this.listTextBtn[type - 1].active = false;
        this.listNodeAuto[type - 1].active = true;
        setOpacity(this.listNodeAuto[type - 1], 255);
        this.listButton[type - 1].getComponent(Button).interactable = true;
        this.nodeSkill.active = false;
    }

    targetButtonsOff() {
        gfEventEmitter.instance.emit(gfBaseEvents.EFFECT_LAYER.HIDE_NOTIFY_LOCK_FISH);
        this.fishNotifyImg.active = false;
        if (this.fxBtnBelow) {
            this.fxBtnBelow.active = false;
        }
        this.listTextBtn.forEach((item) => {
            item.active = true;
        });
        this.listButton.forEach((button) => {
            button.getComponent(Button).interactable = true;
        });
    }

    onClickTargetBtn(event, data) {
        gfEventEmitter.instance.emit(EventsCode1988.SOUND.SELECT_AUTO_MODE);
        if(this._isShow) {
            this.onAnimHide(data);
        }
        else {
            this.onAnimShow();
            this.changeStatusGroupButton(parseInt(data));
        }
        
    }

    onAnimShow() {
        if(this._isShow) return;
        this._isShow = true;
        this.stopAllNodeAction();
        for(let i = 0; i < this.listNodeAuto.length; i++) {
            const node = this.listNodeAuto[i];
            node.active = true;
            tween(node)
                .call(()=> {
                    this.listButton[i].getComponent(Button).interactable = false;
                })
                .parallel(
                    tween().to(TIME_SHOW_HIDE * 1.5, { position: this._posButton[i], scale: v3f(1)}),
                    tween().then(fadeTo(TIME_SHOW_HIDE * 1.5, 255))
                )
                .call(()=> {
                    this.listButton[i].getComponent(Button).interactable = true;
                    DataStore.instance.setIsCompoButtonAutoShow(true);
                })
                .start();
        }
        tween(this.fxShowSkill)
            .to(TIME_SHOW_HIDE * 1.5, {scale: v3f(1)})
            .call(()=>{ 
                this.fxShowSkill.getComponent(Animation).play();
            })
            .start();
    }

    onAnimHide(idButton = GameConfig.instance.TARGET_LOCK.NONE) {
        if(!this._isShow) return;
        DataStore.instance.setIsCompoButtonAutoShow(false);
        this.stopAllNodeAction();
        if(idButton == GameConfig.instance.TARGET_LOCK.NONE){
            this.nodeSkill.active = true;
            tween(this.nodeSkill)
                .parallel(
                    tween().to(TIME_SHOW_HIDE, { position: this._posButton[this._posButton.length - 1], scale: v3f(1)}),
                    tween().then(fadeTo(TIME_SHOW_HIDE, 255))
                )
                .call(()=>{
                    this.btnSkill.enabled = true;
                })
                .start();
        }
        for(let i = 0; i < this.listNodeAuto.length; i++) {
            const node = this.listNodeAuto[i];
            const ignorHide = +idButton == (i + 1) ? true : false;
            const scale = ignorHide ? 1 : 0.5;
            const opacity = ignorHide ? 255 : 100;
            this.listButton[i].getComponent(Button).interactable = false;
            tween(node)
                .parallel(
                    tween().to(TIME_SHOW_HIDE, { position: this._posButton[this._posButton.length - 1], scale: v3f(scale)}),
                    tween().then(fadeTo(TIME_SHOW_HIDE, opacity))
                )
                .call(()=> {
                    if(!ignorHide) {
                        tween(node).then(fadeTo(TIME_SHOW_HIDE, 0)).start();
                        node.active = false;
                    }
                    else {
                        this.changeStatusGroupButton(parseInt(idButton));
                    }
                    this.listButton[i].getComponent(Button).interactable = true;
                })
                .start();
        }
        this._isShow = false;
        this.fxBtnBelow.active = false;
        this.fxShowSkill.getComponent(Animation).stop();
        tween(this.fxShowSkill)
            .to(TIME_SHOW_HIDE / 2, {scale: new Vec3(0, 1, 1)})
            .start();
    }

    resetAllState() {
        for(let i = 0; i < this.listNodeAuto.length; i++) {
            stopAllActions(this.listNodeAuto[i]);
            this.listNodeAuto[i].setPosition(this._posButton[this._posButton.length - 1]);
            this.listNodeAuto[i].active = false;
        }
        this._isShow = false;
        DataStore.instance.setIsCompoButtonAutoShow(false);
        this.nodeSkill.active = true; 
        setOpacity(this.nodeSkill, 255);
        this.nodeSkill.setScale(new Vec3(1,1,1));
        this.nodeSkill.setPosition(this._posButton[this._posButton.length - 1]);
        this.btnSkill.enabled = true;
        this.btnSkill.interactable = true;
        this.fxBtnBelow.active = false;
        this.fxShowSkill.setScale(new Vec3(0,1,1));
        this.fxShowSkill.getComponent(Animation).stop();
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
        stopAllActions(this.nodeSkill);
        stopAllActions(this.fxBtnAbove);
        stopAllActions(this.fxShowSkill);
        for(let i = 0; i < this.listNodeAuto.length; i++) {
            stopAllActions(this.listNodeAuto[i]);
        }
    }

    updateLockFishImg(fishKind = 0) {
        super.updateLockFishImg(fishKind);
        gfEventEmitter.instance.emit(EventsCode1988.SOUND.TARGET_LOCK_ONE);
    }

    interactableHUD(interactable = true) {
        super.interactableHUD(interactable);
        this.stateNodeSkill(interactable);
    }

    stateNodeSkill(interactable) {
        this.btnSkill.interactable = interactable;
        this.nodeSkill.children.forEach( child => child.getComponent(Sprite).grayscale = !interactable)
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