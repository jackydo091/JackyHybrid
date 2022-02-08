
import { _decorator, Component, Node, sys, Slider, ProgressBar, Label} from 'cc';
const { ccclass, property } = _decorator;
import { GfPopupBase } from '../../../cc30-fishbase/Scripts/Components/gfPopupBase';
import  GameConfig  from '../Common/Config1988';
import DataStore1988 from '../Common/DataStore1988';
import gfLocalize from '../../../cc30-fishbase/Scripts/Common/gfLocalize'
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import gfPopupController  from '../../../cc30-fishbase/Scripts/Common/gfPopupController'

@ccclass('PopupSettingSlider1988')
export class PopupSettingSlider1988 extends GfPopupBase {
    
    @property(Node)
    BtnJackpotHistory : Node;
    @property(Node)
    musicSliderNode : Node;
    @property(Node)
    effectSliderNode : Node;
    @property(Node)
    handlerMusic : Node;
    @property(Node)
    handlerEffect : Node;

    onLoad(){
        super.onLoad();
    };

    setAnimPopup() {
        this._animStyleShow = GameConfig.instance.POPUP_ANIMATION.FADE;
        this._animStyleHide = GameConfig.instance.POPUP_ANIMATION.FADE;
    };

    initObj() {
        super.initObj();
        if (sys.isNative) {
            this.handlerMusic.off('touchend');
            this.handlerMusic.off('touchcancel');
            this.handlerEffect.off('touchend');
            this.handlerEffect.off('touchcancel');

            this.handlerMusic.on(Node.EventType.TOUCH_END, this.onBtnMusicClick, this);
            this.handlerMusic.on(Node.EventType.TOUCH_CANCEL, this.onBtnMusicClick, this);
            this.handlerEffect.on(Node.EventType.TOUCH_END, this.onBtnEffectClick, this);
            this.handlerEffect.on(Node.EventType.TOUCH_CANCEL, this.onBtnEffectClick, this);

            this.musicSliderNode.off('touchend');
            this.musicSliderNode.off('touchcancel');
            this.effectSliderNode.off('touchend');
            this.effectSliderNode.off('touchcancel');

            this.musicSliderNode.on(Node.EventType.TOUCH_END, this.onBtnMusicClick, this);
            this.musicSliderNode.on(Node.EventType.TOUCH_CANCEL, this.onBtnMusicClick, this);
            this.effectSliderNode.on(Node.EventType.TOUCH_END, this.onBtnEffectClick, this);
            this.effectSliderNode.on(Node.EventType.TOUCH_CANCEL, this.onBtnEffectClick, this);
        }
    };

    updateSlider() {
        this.effectSliderNode.getChildByName("ProgressBar").getComponent(ProgressBar).progress = DataStore1988.instance.getCurrentSFXVolume();
        this.effectSliderNode.getComponent(Slider).progress = DataStore1988.instance.getCurrentSFXVolume();
        this.musicSliderNode.getChildByName("ProgressBar").getComponent(ProgressBar).progress = DataStore1988.instance.getCurrentBGMVolume();
        this.musicSliderNode.getComponent(Slider).progress = DataStore1988.instance.getCurrentBGMVolume();
    };

    show() {
        super.show();
        this.updateSlider();
    };

    initLanguage() {
        this.popupTitle && (this.popupTitle.getComponent(Label).string = gfLocalize.instance.popupTitle.setting);
    };

    onBtnJPHistory() {
        gfEventEmitter.instance.emit(gfBaseEvents.SOUND.CLICK);
        gfEventEmitter.instance.emit(gfBaseEvents.POPUP.POPUP_JACKPOT_HISTORY);
    };

    onSliderMusic(event) {
        this.musicSliderNode.getChildByName("ProgressBar").getComponent(ProgressBar).progress = event.progress;
        if (!sys.isNative) {
            gfEventEmitter.instance.emit(gfBaseEvents.SOUND.UPDATE_MUSIC_VOL, event.progress);
        }
    };

    onSliderEffect(event) {
        this.effectSliderNode.getChildByName("ProgressBar").getComponent(ProgressBar).progress =  event.progress;
        if (!sys.isNative) {
            gfEventEmitter.instance.emit(gfBaseEvents.SOUND.UPDATE_EFFECT_VOL, event.progress);
        }
    };

    onBtnMusicClick(){
        gfEventEmitter.instance.emit(gfBaseEvents.SOUND.UPDATE_MUSIC_VOL, this.musicSliderNode.getComponent(Slider).progress);
    };
    
    onBtnEffectClick(){
        gfEventEmitter.instance.emit(gfBaseEvents.SOUND.UPDATE_EFFECT_VOL, this.effectSliderNode.getComponent(Slider).progress);
    };
}
