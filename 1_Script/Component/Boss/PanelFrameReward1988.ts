
import { _decorator, Component, Label, tween, v3, sp, sys } from 'cc';
import Emitter from '../../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import { fadeIn, fadeOut, stopAllActions } from '../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import { formatCoin } from '../../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import EventCode from '../../Common/EventsCode1988';
import ReferenceManager from '../../Common/ReferenceManager1988';
import DataStore from '../../Common/DataStore1988';
const { ccclass, property } = _decorator;

const DURATION_TWEEN_COIN = 2.5;
 
const SKIN_NAME = {
    WIN: "",
    BIG_WIN: "Level_1",
    SUPER_WIN: "Level_2",
    MEGA_WIN: "Level_3"
};

const ANIMATION_NAME = {
    APPEAR: "All_Appear",
    IDLE: "All_Idle",
    DISAPPEAR: "Ribbon_Appear"
};

const GOLD_WIN_CONFIG = {
    BIG_WIN: 500000,
    SUPER_WIN: 1000000,
    MEGA_WIN: 1500000
}
@ccclass('PanelFrameReward1988')
export class PanelFrameReward1988 extends Component {
    @property(Label)
    private labelGoldReward: Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton;

    @property(sp.Skeleton)
    spineRibbon: sp.Skeleton;

    _isShowing = false;
    _coinValue: number = 0;
    _winValue: number = 0;
    _tweenCoin: any = null;
    _tweenShow: any = null;
    _tweenHide: any = null;
    _tweenHideLabel: any = null;
    _tweenShowLabel: any = null;
    _index: number = null;
    _callbackHide: any = null;
    _currentSkin: any = null;

    protected get coinValue(): number {
        return this._coinValue;
    }

    protected set coinValue(value: number) {
        this._coinValue = value;
        this._updateCoinWin();
    }

    setCallbackHide(callback: any){
        this._callbackHide = callback;
        if(!this._isShowing){
            this._callbackHide && this._callbackHide();
        }
    }


    playEffectWinCoin(skinName){
        this.spine.setSkin(skinName);
        this.spineRibbon.setSkin(skinName);
        this._currentSkin = skinName;
        if (sys.isNative) {
            this.spine.setToSetupPose();
            this.spineRibbon.setToSetupPose();
        }
        this.spine.setAnimation(0, ANIMATION_NAME.APPEAR, false);
        this.spineRibbon.setAnimation(0, ANIMATION_NAME.APPEAR, false);
        this.spine.setCompleteListener(this.playAnimShow.bind(this));
    }

    show(GoldReward){
        if(GoldReward <= 0) return;
        this._winValue += GoldReward;
        const skinName = this._getSkinByGoldReward(this._winValue);
        if(this._winValue < GOLD_WIN_CONFIG.BIG_WIN) {
            const player = ReferenceManager.instance.getPlayerByIndex(this._index);
            if(player.isMe){
                player.addToDisplayWallet(this._winValue);
                this._winValue = 0;
            }
            return;
        }
        if(!this._isShowing){
            //this.reset();
            this._tweenHide && this._tweenHide.stop();
            this._tweenHideLabel && this._tweenHideLabel.stop();
            this._isShowing = true;
            this.setActive(true);
            this.playEffectWinCoin(skinName);
        }
        else {
            if(skinName !== this._currentSkin)
                this.playEffectWinCoin(skinName);
            this.tweenCoin({ winAmount: this._winValue });
        }
        DataStore.instance.isPlayingBorisReward = true;
    }

    setActive(isActive:boolean = false){
        this.node.active = isActive;
        this.labelGoldReward.node.active = isActive;
        this.spine.node.active = isActive;
        this.spineRibbon.node.active = isActive;
    }

    setIndex(index){
        this._index = index;
    }

    _updateCoinWin() {
        this.labelGoldReward.string = formatCoin(this._coinValue);
        this.labelGoldReward.node.angle = 0;
    }

    playAnimShow(){
        this.spine.setAnimation(0, ANIMATION_NAME.IDLE, true);
        this.spineRibbon.setAnimation(0, ANIMATION_NAME.IDLE, true);
        this.spine.setCompleteListener(()=>{});
        
        this._tweenShowLabel = tween(this.labelGoldReward.node);
        this._tweenShowLabel.then(fadeIn(0.25));
        this._tweenShowLabel.start();
        
        this._tweenShow = tween(this.node);
        this._tweenShow.to(0.25, {scale: v3(1, 1)})
            .call(() => {
                Emitter.instance.emit(EventCode.SOUND.START_COUNTING_LOOP);
                this.tweenCoin({ winAmount: this._winValue });
            });
        this._tweenShow.start();
    }

    _getSkinByGoldReward(GoldReward){
        let skinName : string = "";
        if(GoldReward >= GOLD_WIN_CONFIG.BIG_WIN && GoldReward < GOLD_WIN_CONFIG.SUPER_WIN){
            skinName = SKIN_NAME.BIG_WIN;
        } else if(GoldReward >= GOLD_WIN_CONFIG.SUPER_WIN && GoldReward < GOLD_WIN_CONFIG.MEGA_WIN){
            skinName = SKIN_NAME.SUPER_WIN;
        }
        else if(GoldReward >= GOLD_WIN_CONFIG.MEGA_WIN){
            skinName = SKIN_NAME.MEGA_WIN
        }
        return skinName;
    }

    tweenCoin(data) {
        const {winAmount} = data;
        let _coinValue = this.coinValue;
        if (this._tweenCoin) {
            this._tweenCoin.stop();
        }
        const winAmountTemp = winAmount - _coinValue;
        this._tweenCoin = tween(this)
            .to(DURATION_TWEEN_COIN, null, {
                onUpdate: (target, ratio) => {
                    this.coinValue = _coinValue + winAmountTemp * ratio;
                }
            })
            .delay(2)
            .call(() => {
                this.hideAnimation();
            });
        this._tweenCoin.start();
    }

    hideAnimation() {
        if (!this._isShowing) {
            if (this.node.active) {
                this.setActive(false);
            }
            return;
        }
        const player = ReferenceManager.instance.getPlayerByIndex(this._index);
        this._isShowing = false;
        const winValue = this._winValue;
        this._tweenHideLabel = tween(this.labelGoldReward.node);
        this._tweenHideLabel.then(fadeOut(0.1));
        this._tweenHideLabel.start();

        this.spine.setAnimation(0, ANIMATION_NAME.DISAPPEAR, false);
        this.spineRibbon.setAnimation(0, ANIMATION_NAME.DISAPPEAR, false);

        this.spine.setCompleteListener(()=>{
            Emitter.instance.emit(EventCode.SOUND.STOP_COUNTING_LOOP);
            if(player.isMe){
                player.addToDisplayWallet(winValue);
            }
            this.finish();
            this._callbackHide && this._callbackHide();
        });
    }

    finish(){
        DataStore.instance.isPlayingBorisReward = false;
        this.setActive(false);
        this._coinValue = 0;
        this._winValue = 0;
        this.labelGoldReward.string = "";
    }

    reset(){
        this.labelGoldReward.string = "";
        this.node.scale.set(0, 1);
        this.labelGoldReward.node.active = false;
        this.spine.node.active = false;
        this.spineRibbon.node.active = false;
        this.stopAllTween();
        this._callbackHide = null;
        this._isShowing = false;
    }

    stopAllTween(){
        this._tweenCoin && this._tweenCoin.stop();
        this._tweenShow && this._tweenShow.stop();
        this._tweenHide && this._tweenHide.stop();
        this._tweenShowLabel && this._tweenShowLabel.stop();
        this._tweenHideLabel && this._tweenHideLabel.stop();
    }

    onDestroy(){
        this.stopAllTween();
    }
}

