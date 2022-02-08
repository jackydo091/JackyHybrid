import { AudioSource, _decorator } from "cc";
import { getRandomInt } from "../../../../cc-common/cc-share/common/utils";
import { GfSoundController } from "../../../cc30-fishbase/Scripts/Common/gfSoundController";
import gfBaseEvents from "../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import { registerEvent, removeEvents } from "../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import GameConfig from "../Common/Config1988";
import DataStore from "../Common/DataStore1988";
import EventCode from "../Common/EventsCode1988";

const { ccclass, property } = _decorator;
@ccclass('SoundController1988')
export class SoundController1988 extends GfSoundController {
    laserIdleID: any;
    countingLoopId: AudioSource;

    initEvents(){
        super.initEvents();
        registerEvent(EventCode.SOUND.DRILL_FIRE, this.playDrillFire, this);
        registerEvent(EventCode.SOUND.DRILL_HIT_WALL, this.playDrillHitWall, this);
        registerEvent(EventCode.EFFECT_LAYER.DRILL_EXPLOSION, this.playDrillExplosion, this);
        registerEvent(EventCode.SOUND.TARGET_LOCK_ONE, this.playTargetLock, this);
        registerEvent(EventCode.SOUND.UI_POPUP, this.playUIPopup, this);
        registerEvent(EventCode.SOUND.FLOWER_EXPLOSION, this.playFlowerExplosion, this);
        registerEvent(EventCode.SOUND.GUN_EQUIP, this.playGunEquip, this);
        registerEvent(EventCode.SOUND.WAVE, this.playWave, this);
        registerEvent(EventCode.SOUND.LASER_IDLE, this.playLaserIdle, this);
        registerEvent(EventCode.SOUND.STOP_LASER_IDLE, this.stopLaserIdle, this);
        registerEvent(EventCode.EFFECT_LAYER.PLAY_WAVE_TRANSITION_CUSTOM, this.playSfxStartGame, this);
        registerEvent(gfBaseEvents.COMMON.GAME_HIDE, this.stopAllEffects, this);
        registerEvent(EventCode.SOUND.BORIS_TRASH_TALK, this.playBorisTrashTalk, this);
        registerEvent(EventCode.SOUND.BORIS_WARNING, this.playBorisWaring, this);
        registerEvent(EventCode.SOUND.BORIS_APPEAR, this.playBorisAppear, this);
        registerEvent(EventCode.SOUND.BORIS_DIE, this.playBorisDie, this);
        registerEvent(EventCode.SOUND.BORIS_OUT, this.playBorisOut, this);
        registerEvent(EventCode.SOUND.CHIP_DROP, this.playChipDrop, this);
        registerEvent(EventCode.SOUND.CHIP_EQUIP, this.playChipEquip, this);
        registerEvent(EventCode.SOUND.CHIP_FAIL, this.playChipFail, this);
        registerEvent(EventCode.SOUND.LAST_DAMAGE, this.playBorisLastDamage, this);
        registerEvent(EventCode.SOUND.POPUP_JACKPOT, this.playPopupJackPot, this);
        registerEvent(EventCode.SOUND.BORIS_MOVE, this.playBorisMove, this);
        registerEvent(EventCode.SOUND.START_COUNTING_LOOP, this.playCounting, this);
        registerEvent(EventCode.SOUND.STOP_COUNTING_LOOP, this.stopCounting, this);
        registerEvent(EventCode.SOUND.BORIS_IDLE, this.playBorisIdle, this);
        registerEvent(EventCode.SOUND.BORIS_DAMAGE, this.playBorisDamage, this);
        registerEvent(EventCode.SOUND.CHIP_FLY, this.playChipFly, this);
        registerEvent(EventCode.SOUND.BORIS_DESTROYED, this.playBorisDestroyed, this);
        registerEvent(EventCode.SOUND.FLOWER_DIE, this.playFlowerPoisonDie, this);
        registerEvent(EventCode.SOUND.POISON_EFFECT, this.playPoisonSpread, this);
        registerEvent(EventCode.SOUND.BORIS_THE_ANIMALS, this.playBorisTheAnimals, this);
        registerEvent(EventCode.SOUND.IT_JUST_BORIS, this.playItJustBoris, this);
        registerEvent(EventCode.SOUND.OPEN_COMPO_AUTO, this.playSfxCompoAutoOpen, this);
        registerEvent(EventCode.SOUND.SELECT_AUTO_MODE, this.playSfxSelectAuto, this);
        registerEvent(EventCode.SOUND.CLICK_BUTTON_JOIN_GAME, this.playSfxBtnPlayGame, this);
        registerEvent(EventCode.SOUND.ACTIVE_PASSWORD, this.playSfxActivePassWord, this);
    }

    resumeSoundBackground({ listFishNormal, listFishGroup }) {
        if (listFishGroup.length > 0) {
            this.playBackGroundMusic(GameConfig.instance.SOUND_BACKGROUND_CONFIG.FISH_GROUP);
        } else {
            this.playBackGroundMusic(GameConfig.instance.SOUND_BACKGROUND_CONFIG.IN_GAME);
        }
    }
    
    playBackGroundMusic(data, init = false) {
        if (DataStore.instance.curBGMusic === data && !init && this.currentMusic.audioSource.playing) return;
        this.unscheduleAllCallbacks();
        this.onResumeSound();
        switch (data) {
        case GameConfig.instance.SOUND_BACKGROUND_CONFIG.MINI_BOSS:
            this.playFishBGM("bgmMiniboss", true);
            break;
        case GameConfig.instance.SOUND_BACKGROUND_CONFIG.DRAGON:
            this.onResumeSound();
            this.playFishBGM("bgmDragon", true);
            //this.schedule(this.playSfxDragonScream.bind(this), 6);
            break;
        case GameConfig.instance.SOUND_BACKGROUND_CONFIG.LOBBY:
            this.playFishBGM("bgmLobby", true);
            break;
        case GameConfig.instance.SOUND_BACKGROUND_CONFIG.IN_GAME:
            this.playFishBGM("bgmMain", true);
            break;
        case GameConfig.instance.SOUND_BACKGROUND_CONFIG.FISH_GROUP:
            this.playFishBGM("bgmFisharmy", true);
            break;
        default:
            break;
        }
        DataStore.instance.curBGMusic = data;
    }

    playSfxCatch() {
        //this.playFishSFX("sfxCatch");
    }

    playSfxDragonDie() {
        //this.playFishSFX("sfxDragon_die");
    }

    // playSfxBigwin() {
        
    // },

    // playSfxMegawin() {
        
    // },
    playDrillFire(){
        this.playFishSFX("sfxFire_drill_shoot");
    }

    playDrillHitWall(haveTrail){
        if(haveTrail){
            this.playFishSFX("sfxFire_drill_hitwall_1");
        }
        else{
            this.playFishSFX("sfxFire_drill_hitwall_3");
        }
    }

    playDrillExplosion(){
        this.playFishSFX("sfxFire_drill_explosion");
    }

    playTargetLock(){
        this.playFishSFX("sfxTargetLocked");
    }

    playChipDrop() {
        this.playFishSFX("sfxChip_drop");
    }

    playPopupJackPot(state) {
        if(state === 0) {
            this.playFishSFX("sfxJackpot_close");
            this.onResumeSound();
        } else {
            this.playFishSFX("sfxJackpot_popup");
            this.setMusicVolume(0);
        }
    }

    playFlowerPoisonDie() {
        this.playFishSFX("sfxFlower_die");
    }

    playPoisonSpread() {
        this.playFishSFX("sfxFlower_spread_poison_2");
    }


    playBorisLastDamage() {
        this.playFishSFX("sfxBigboss_last_damage");
    }

    playBorisDestroyed() {
        this.playFishSFX("sfxBigboss_destroyed");
    }

    playChipEquip() {
        this.playFishSFX("sfxChip_equip");
    }

    playChipFail() {
        this.playFishSFX("sfxChip_failed");
    }

    playChipFly() {
        this.playFishSFX("sfxChip_fly");
    }

    playBorisAppear() {
        this.playFishSFX("sfxBoss_appear");
        this.playFishSFX("sfxBigboss_appear");
    }

    playBorisIdle(){
        this.playFishSFX("sfxBigboss_idle");
    }

    playBorisDamage() {
        this.playFishSFX("sfxBigboss_damage");
    }

    playBorisMove() {
        this.playFishSFX("sfxBigboss_move");
    }

    playBorisWaring() {
        this.playFishSFX("sfxBigboss_warning");
    }

    playStopCounting() {
        this.playFishSFX("sfxCash_counting_stop");
    }

    playCounting() {
        this.countingLoopId = this.playFishSFX("sfxCash_counting");
    }

    stopCounting() {
        this.playStopCounting();
        if (this.countingLoopId) {
            this.stopSound(this.countingLoopId);
            this.countingLoopId = null;
        }
    }

    playBorisTrashTalk(type = 0) {
        let rand = 0;
        switch(type){
        case 0:
        case 1:
            this.playFishSFX("sfxBoris_VO_laugh");
            break;
        case 2:
            rand = getRandomInt(0, 1);
            if(rand){
                this.playFishSFX("sfxBoris_VO_laugh");
            }
            else{
                this.playFishSFX("sfxBoris_VO_letsagreetodisagree");
            }
            break;
        case 3:
            rand = getRandomInt(0, 1);
            if(rand){
                this.playFishSFX("sfxBoris_VO_letsagreetodisagree");
            }
            else{
                this.playFishSFX("sfxBoris_VO_thatsnotpossible");
            }
            break;
        case 4:
            this.playFishSFX("sfxBoris_VO_thatsnotpossible");
            break;
        }
    }

    playItJustBoris(){
        this.playFishSFX("sfxBoris_VO_itsjustboris");
    }

    playBorisTheAnimals(){
        this.playFishSFX("sfxBoris_VO_boristheanimals");
    }

    playBorisOut() {
        this.playFishSFX("sfxBigboss_fadeout");
    }

    playSfxJackpotCoin() {
        this.coinLoopId = this.playFishSFX("bgmJackpot", true);
    }

    playBorisDie() {
        this.playFishSFX("sfxBigBoss_die");
    }

    playUIPopup(){
        this.playFishSFX("sfxUI_popup");
    }

    playFlowerExplosion(){
        this.playFishSFX("sfxFlower_explosion");
    }

    playGunEquip(){
        this.playFishSFX("sfxGun_equip");
    }

    playWave(){
        this.playFishSFX("sfxWave");
    }

    playSfxBtnPlayGame(){
        this.playFishSFX("sfxBtnPlaygame");
    }

    playSfxCompoAutoOpen(){
        this.playFishSFX("sfxSkill_open");
    }

    playSfxSelectAuto(){
        this.playFishSFX("sfxSkill_select");
    }

    playSfxWaveTransition(isStartGame = false) {
        this.setEffectVolume(0);
        const soundWave = this.playFishSFX("sfxWormhole", false, 1, true);
        if(!soundWave) {
            this.onResumeSound();
            return;
        }
        this.setMusicVolume(0);
        this.scheduleOnce(()=>{
            this.onResumeSound();
            this.playBackGroundMusic(GameConfig.instance.SOUND_BACKGROUND_CONFIG.IN_GAME, isStartGame);
        }, this.getDuration(soundWave));
    }

    playSfxStartGame(){
        this.playSfxWaveTransition(true);
    }

    playSfxBomb(fishKind?) {
        if(fishKind == GameConfig.instance.FISH_KIND.SELENA){
            const soundDie = this.playFishSFX("sfxSelena_die");
            if(soundDie){
                this.scheduleOnce(()=>{
                    this.playFishSFX("sfxBigfish_kill");
                }, this.getDuration(soundDie));
            }
        }
        else if(fishKind == GameConfig.instance.FISH_KIND.ROACH){
            const soundDie = this.playFishSFX("sfxRoach_die");
            if(soundDie){
                this.scheduleOnce(()=>{
                    this.playFishSFX("sfxBigfish_kill");
                }, this.getDuration(soundDie));
            }
        }
        else{
            this.playFishSFX("sfxBomb");
        }
    }

    playSfxActivePassWord(itemID: number){
        this.playFishSFX("sfxChip_letter_" + itemID.toString());
    }

    playLaserIdle(){
        this.laserIdleID = this.playFishSFX("sfxFire_laser_idle", true);
    }

    stopLaserIdle(){
        this.stopSound(this.laserIdleID);
        this.laserIdleID = null;
    }

    playDragonHitBall() {
        //this.playFishSFX("sfxDragon_ball_drop");
    }

    playSfxBallDrop() {
        //this.playFishSFX("sfxBall_drop");
    }

    playSfxDragonScream() {
        //this.playFishSFX("sfxDragon_scream");
    }

    playSfxJackpotExplode() {
        //
    }

    onDestroy() {
        super.onDestroy();
        removeEvents(this);
    }
}
