import {_decorator, Node, SpriteFrame, Sprite, isValid, v3, UIOpacity, tween, sp, warn, Label, ProgressBar} from 'cc';
import {PanelComponent1988} from "./PanelComponent1988";
import {fadeOut, fadeIn, stopAllActions, call, delay} from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";
import Emitter from "../../../../cc30-fishbase/Scripts/Common/gfEventEmitter";
import EventCode from "../../Common/EventsCode1988";
import { PanelFrameReward1988 } from './PanelFrameReward1988';

const {ccclass, property} = _decorator;

const WIDTH_STACK_ENERGY = 72;
const WIDTH_ENERGY = 9;
const COUNT_PASSWORD = 7;
@ccclass('PanelChip1988')
export class PanelChip1988 extends PanelComponent1988 {
    _arrInfoEnergy: any = [];
    @property(SpriteFrame)
    listSpriteFrameWord: SpriteFrame[] = [];
    @property(PanelFrameReward1988)
    frameTextWin: PanelFrameReward1988;
    @property(Node)
    trayChip: Node;
    @property
    isLeft = false;
    @property(Node)
    effectTextJP: Node = null;
    @property(Node)
    frameAmountChips: Node = null;
    @property(Label)
    textAmountChips: Label = null;

    @property(Node)
    nodeEffectActiveChip: Node = null;

    @property(SpriteFrame)
    spriteFrameHavePass: SpriteFrame[] = [];
   
    @property(SpriteFrame)
    spriteFrameHaveNotPass: SpriteFrame[] = [];

    @property(Node)
    listNodeEffectPassWord: Array<Node> = [];
    
    
    _isPlaying: boolean = false;
    _currentTweenEnergy: any = null;
    _index: number = 0;
    _countTextJP = 0;
    _tweenEffectTextJP: any = null;
    _arrTweenActiveChip : any[] = [];
    _isForceActiveAll: boolean = false;
    _totalItemJP: number = 0;
    setIndex(index) {
        this._index = index;
        this.frameTextWin.setIndex(index);
    }

    onLoad() {
        this.frameTextWin.setActive(false);
        this.nodeEffectActiveChip.getComponent(UIOpacity).opacity = 0;
        this.showAmountChips();

    }

    show() {
        super.show();
        this.frameTextWin.setActive(false);
        this.reset();
    }

    showAmountChips(isShow:boolean = false){
        this.frameAmountChips.active = isShow;
        this.textAmountChips.node.active = isShow;
    }

    updateAmountChips(num:any){
        num = num < 0 ? 0 : num;
        this.textAmountChips.string = num;
        const isShow = !(num == 0);
        this.showAmountChips(isShow);
    }

    addChip(itemID, GoldReward, callback) {
        const itemInfo = {itemID: itemID, GoldReward: GoldReward, callback: callback};
        if(GoldReward > 0 && this._countTextJP === COUNT_PASSWORD - 1)
            this._arrInfoEnergy.unshift(itemInfo);
        else
            this._arrInfoEnergy.push(itemInfo)
        this.updateAmountChips(this._arrInfoEnergy.length);
        if (!this._isPlaying) {
            this.startActiveChip();
        }
    }

    getFirstStackListChip() {
        if (this._arrInfoEnergy.length > 0) {
            const chipInfo = this._arrInfoEnergy[0];
            return chipInfo;
        }
        return null;
    }

    startActiveChip(){
        if(this._arrInfoEnergy.length <= 0) {
            this._isPlaying = false; 
            if(this._isForceActiveAll) {
                const callbackHide = ()=>{
                    this.hide();
                }
                this.frameTextWin.setCallbackHide(callbackHide);
            }
            return;
        }
        this._isPlaying = true;
        let countActive = COUNT_PASSWORD - this._countTextJP;
        if(countActive >= this._arrInfoEnergy.length){
            countActive = this._arrInfoEnergy.length;
        }
        this.updateAmountChips(this._arrInfoEnergy.length - countActive);
        const arrEnergyActive = [];
        for(let i = 0; i < countActive; ++i){
            let chipInfo = this._arrInfoEnergy.shift();
            if(chipInfo){
                arrEnergyActive.push(chipInfo);
            }
        }
        //effect decryption
        const durationEffectDecryption = this.playEffectDecryption();
        //effect active
        let durationActiveChip = this.playEffectActiveChip(arrEnergyActive, durationEffectDecryption);
        //effectShowText
        const scheduleTimeActivePassword = durationEffectDecryption + durationActiveChip;
        this.playActiveChip(arrEnergyActive, scheduleTimeActivePassword);
    }

    playActiveChip(arrEnergyActive, scheduleTime) {
        const TIME_SHOW_TEXT = 1.7;
        for(let index = 0; index < arrEnergyActive.length; ++index){
            let chipInfo = arrEnergyActive[index];
            if (chipInfo) {
                const tweenChipInfo = tween(chipInfo)
                    .delay(scheduleTime)
                    .call(()=>{
                        this.showTextWithItemID(chipInfo.itemID);
                    })
                    .delay(TIME_SHOW_TEXT)
                    .call(()=>{
                        this.frameTextWin.show(chipInfo.GoldReward);
                        if(index == arrEnergyActive.length - 1){
                            this.startActiveChip();
                        }
                        chipInfo.callback && chipInfo.callback();
                        chipInfo.itemID = null;
                    });
                this._arrTweenActiveChip.push(tweenChipInfo);
                tweenChipInfo.start();
            }
        }
    }

    updatePosXAllChip(isOverSize = false) {
        const dir = this.isLeft ? -1 : -1;
        let scaleX = 1;
        if (isOverSize) {
            scaleX = WIDTH_STACK_ENERGY / ((this._arrInfoEnergy.length - 1) * WIDTH_ENERGY);
        }
        for (let index = 0; index < this._arrInfoEnergy.length; ++index) {
            const nodeEnergy = this._arrInfoEnergy[index].node;
            nodeEnergy.scale.x = scaleX;
            nodeEnergy.setPosition(index * scaleX * WIDTH_ENERGY * dir, 8.5);
        }
    }

    playEffectDecryption() {
        this.nodeEffectActiveChip.getComponent(UIOpacity).opacity = 255;
        tween(this.nodeEffectActiveChip)
            .delay(1.2)
            .call(()=>{
                this.nodeEffectActiveChip.getComponent(UIOpacity).opacity = 0;
            })
            .start();
        let durationDecryption = 0;
        for (let index = 0; index < this.arrEffectDecryption.length; ++index) {
            const nodeTextIsActive = this.checkNodeTextJackpotIsActive(index);
            if(nodeTextIsActive){
                continue;
            }
            const effect = this.arrEffectDecryption[index];
            effect.active = true;
            const spine = effect.getComponent(sp.Skeleton);
            spine.setAnimation(0, "animation", false);
            durationDecryption = spine.findAnimation("animation").duration;
            this.scheduleOnce(() => {
                effect.active = false;
            }, durationDecryption);
        }
        return durationDecryption;
    }

    playEffectActiveChip(arrEnergyActive, scheduleTime = 0){
        const arrIndexHaveKey = [];
        let durationEffect = 0.6;
        for(let i = 0; i < arrEnergyActive.length; ++i){
            const info = arrEnergyActive[i];
            if(info.itemID != 0){
                const index = info.itemID - 1;
                arrIndexHaveKey.push(index);
            }
        }
        for(let index = 0; index < this.listNodeEffectPassWord.length; ++index){
            const nodeTextIsActive = this.checkNodeTextJackpotIsActive(index);
            if(nodeTextIsActive){
                continue;
            }
            if(arrIndexHaveKey.indexOf(index) == -1){
                const nodeEffect = this.listNodeEffectPassWord[index];
                const spriteFrame = this.getSpriteFrameEffect(index, false);
                if(!nodeEffect) debugger;
                nodeEffect.getComponent(Sprite).spriteFrame = spriteFrame;
                this.scheduleOnce(()=>{
                    this.playEffectFadeInOut(nodeEffect, 0.6, 3);
                }, scheduleTime);
            }
            else{
                durationEffect = 0.8;
                const nodeEffect = this.listNodeEffectPassWord[index];
                const spriteFrame = this.getSpriteFrameEffect(index, true);
                nodeEffect.getComponent(Sprite).spriteFrame = spriteFrame;
                this.scheduleOnce(()=>{
                    this.playEffectFadeInOut(nodeEffect, 0.8, 4);
                }, scheduleTime);
            }
        }
        return durationEffect;
    }

    playNodeTextJP(nodeTextJP, itemID: number) {
        nodeTextJP.scaleX = 0.45;
        tween(nodeTextJP)
        .call(()=> {
            this._countTextJP++;
        })
        .delay(1.2)
        .parallel(
            tween().to(0.2, {scale: v3(2, 2, 1)}),
            tween().then(fadeIn(0.1))
        ).to(0.3, {scale: v3(0.45, 0.45, 1)})
        .call(()=>{
            this.playEffectPanelTextJP();
            Emitter.instance.emit(EventCode.SOUND.ACTIVE_PASSWORD, itemID);

        }).start();
    }

    playEffectPanelTextJP(){
        if(!this._tweenEffectTextJP){
            this._tweenEffectTextJP = tween(this.effectTextJP).repeatForever(tween().then(fadeIn(0.5)).then(fadeOut(0.5)));
        }

        switch(this._countTextJP){
            case 5:
                if(!this.effectTextJP.active){
                    this.effectTextJP.active = true;
                    this.effectTextJP.getComponent(UIOpacity).opacity = 0;
                }
                this._tweenEffectTextJP.start();
                this.effectTextJP.getComponent(sp.Skeleton).setAnimation(0, "avatar_stage1", true);
                break;
            case 6:
                if(!this.effectTextJP.active){
                    this.effectTextJP.active = true;
                    this.effectTextJP.getComponent(UIOpacity).opacity = 0;
                }
                this._tweenEffectTextJP.start();
                this.effectTextJP.getComponent(sp.Skeleton).setAnimation(0, "avatar_stage2", true);
                break;
            case 7:
                Emitter.instance.emit(EventCode.EFFECT_LAYER.PLAY_EFFECT_LIGHTING);
                break;
            default:
                this.effectTextJP.active = false;
        }
    }    

    showTextWithItemID(itemID) {
        if (itemID <= 0) {
            if(itemID < 0) {
                warn("updateDataDecryption() => Wrong itemID: ", itemID);
            }
            return;
        }
        
        const spriteFrame = this.listSpriteFrameWord[itemID - 1];
        const textJP = this.getNodeTextJackPotByID(itemID);
        textJP.getComponent(Sprite).spriteFrame = spriteFrame;
        textJP.active = true;
        textJP.getComponent(UIOpacity).opacity = 0;
        this.playNodeTextJP(textJP, itemID);
        this._totalItemJP++;
    }

    playEffectFadeInOut(node, duration, countRepeat, isLastFadeOut = false){
        const durationOneStep = duration / countRepeat;
        const tweenFade = tween(node)
            .repeat( countRepeat,
                tween().then(fadeIn(durationOneStep / 2))
                    .then(delay(0.2))
                    .then(fadeOut(durationOneStep / 2))
            );
        if(isLastFadeOut){
            tweenFade.then(fadeOut(durationOneStep / 2));
        }
        tweenFade.start();
    }

    getSpriteFrameEffect(index, isActive){
        let idSpriteFrame = 0;
        if(index == 0){
            idSpriteFrame = this.isLeft ? 2 : 1;
        }
        else if(index == 6){
            idSpriteFrame = this.isLeft ? 1 : 2;
        }
        else {
            idSpriteFrame = 0;
        }
        return ( isActive ? this.spriteFrameHavePass[idSpriteFrame] : this.spriteFrameHaveNotPass[idSpriteFrame]);
    }

    checkNodeTextJackpotIsActive(index){
        const node = this.arrTextJackpot[index];
        const opacity = node.getComponent(UIOpacity) ? node.getComponent(UIOpacity).opacity : 0;
        const isActive = opacity > 0 ? true : false;
        return isActive ;
    }

    resumeData(arrItemID) {
        this.reset();
        arrItemID.forEach((itemID) => {
            this.showTextWithItemID(itemID);
        });
    }

    playAnimGetChipWinJackpot() {
        this._isForceActiveAll = true;
        if (this._arrInfoEnergy.length <= 0) return;
        if(!this._isPlaying){
            this.startActiveChip();
        }
    }

    setHide() {
        const callbackHide = ()=>{
            this.hide();
        }
        if(this._arrInfoEnergy.length > 0){
            this.playAnimGetChipWinJackpot();
        }
        else{
            this.frameTextWin.setCallbackHide(callbackHide);
        }
    }

    reset() {
        stopAllActions(this.node);
        stopAllActions(this);
        stopAllActions(this.nodeEffectActiveChip);
        if(isValid(this.frameTextWin.node)){
            this.frameTextWin.reset();
        }
        this.unscheduleAllCallbacks();
        if (this._currentTweenEnergy) {
            if (this._currentTweenEnergy._finalAction && !this._currentTweenEnergy._finalAction.isDone()) {
                this._currentTweenEnergy.stop();
            }
            this._currentTweenEnergy = null;
        }
        this.resetAllNodeTextJP();
        this.resetArrayDecryption();
        this.resetArrayEffectActiveChip();
        this.resetArrayTweenChip();
        this._isPlaying = false;
        this.effectTextJP.active = false;
        if(this._tweenEffectTextJP){
            this._tweenEffectTextJP.stop();
            this._tweenEffectTextJP = null;
        }
        this._countTextJP = 0;
        this._totalItemJP = 0;
        this.textAmountChips.string = "0";
    }

    resetArrayTweenChip(){
        for(let index = 0; index < this._arrTweenActiveChip.length; ++index){
            this._arrTweenActiveChip[index].stop();
            this._arrTweenActiveChip[index] = null;
        }
        this._arrTweenActiveChip = [];
    }

    resetAllNodeTextJP() {
        if (!isValid(this.arrTextJackpot)) return;
        for (let index = 0; index < this.arrTextJackpot.length; ++index) {
            const text = this.arrTextJackpot[index];
            if (isValid(text)) {
                stopAllActions(text);
                if(text.getComponent(UIOpacity)){
                    stopAllActions(text.getComponent(UIOpacity));
                }
                text.scale = v3(0.75, 0.75);
                text.getComponent(UIOpacity).opacity = 0;
            }
        }
    }

    resetArrayEffectActiveChip(){
        for(let i = 0; i < this.listNodeEffectPassWord.length; ++i){
            if(!isValid(this.listNodeEffectPassWord[i])) continue;
            const text = this.listNodeEffectPassWord[i];
            stopAllActions(text);
            text.getComponent(UIOpacity).opacity = 0;
        };
    }

    onDestroy() {
        stopAllActions(this.node);
        this.reset();
    }

}

