
import { gfGunSkill } from '../../../cc30-fishbase/Scripts/Components/gfGunSkill';
import { _decorator, Component, Node, v3, error, tween, sp, Tween } from 'cc';
import Config1988 from '../Common/Config1988';
import ReferenceManager1988 from '../Common/ReferenceManager1988';
import DataStore1988 from '../Common/DataStore1988';
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventsCode1988 from '../Common/EventsCode1988';
import FishManager1988 from '../Common/FishManager1988';
const { ccclass, property } = _decorator;

const EFF_TITLE_SKILL_GUN_TYPE = {
    LASER: 0,
    DRILL: 1
};
@ccclass('GunSkill1988')
export class GunSkill1988 extends gfGunSkill {
    @property(Node)
    private effLineDrill: Node = null;
    @property(sp.SkeletonData)
    private arrSpineSkillGunTitle = [];
    @property(Node)
    countDownFX: Node = null;

    changeSpecialGun(data) {
        const { SkillID } = data;
        switch (SkillID){
            case Config1988.instance.SkillConfig.LASER :
                this.changeLaserGun(data);
                break;
            case Config1988.instance.SkillConfig.DRILL :
                this.changeDrillGun(data);
                break;
        }

    }

    public onFireSkill(data) {
        const { SkillID } = data;
        switch (SkillID){
            case Config1988.instance.SkillConfig.LASER :
                this.fireLaser(data);
                break;
            case Config1988.instance.SkillConfig.DRILL :
                this.fireDrill(data);
                break;
        }
    }

    public onPlayerSendFireSkill(data) {
        const { SkillID } = data;
        switch (SkillID){
            case Config1988.instance.SkillConfig.LASER :
                this.playerSendFireLaser();
                break;
            case Config1988.instance.SkillConfig.DRILL :
                this.playerSendFireDrill();
                break;             
        }
    }

    protected changeDrillGun(data){
        const player = ReferenceManager1988.instance.getPlayerByDeskStation(data.DeskStation);
        if (player) {
            this.effLineDrill && (this.effLineDrill.active = false);
            if (player.isMe) {
                if (!DataStore1988.instance.isAutoBot()) {
                    DataStore1988.instance.setDataStore({
                        targetState: Config1988.instance.TARGET_LOCK.NONE,
                        currentTargetState: Config1988.instance.TARGET_LOCK.NONE,
                    });
                }
                DataStore1988.instance.setSelfInfo({ isLockGun: false, skillLock: Config1988.instance.SkillConfig.DRILL });
                this.effLineDrill.active = true;
                this.showSkillTitle(Config1988.instance.SkillConfig.DRILL);
                this.showSkillCountDown();
                player.lockBet(true);
            }
            this.gun.getChildByName("Gun").scale = v3(2 / 3, 2 / 3, 1);
            player._playEffectFire(Config1988.instance.GunSkill.DRILL);
        }
    }

    protected playerSendFireDrill(){
        const data = {
            Angle: this.gun.angle,
            ListFish: FishManager1988.instance.getArrFishID(),
            SkillID: Config1988.instance.SkillConfig.DRILL,
        };
        gfEventEmitter.instance.emit(EventsCode1988.GAME_LAYER.SEND_FIRE_LASER, data);
        this.resetCountDownSkill();
        DataStore1988.instance.setSelfInfo({ isLockGun: true });
    }

    protected fireDrill(data){
        const timeLost = data.BuildTick ? Math.max(0, (DataStore1988.instance.getTime() - data.BuildTick) / 1000) : 0;
        if(timeLost > 9) return;
        data.Angle = data.Angle ? data.Angle : 0;
        data.fishKind = Config1988.instance.FISH_KIND.DRILL;
        const player = ReferenceManager1988.instance.getPlayerByDeskStation(data.DeskStation);

        if (player.isMe) {
            data.isResume && gfEventEmitter.instance.emit(EventsCode1988.GAME_LAYER.INTERACTABLE_HUD, false);
            if (player.effectIsMe.active) player.effectIsMe.active = false;
            DataStore1988.instance.setSelfInfo({ isLockGun: true, skillLock: 0});
            this.resetCountDownSkill();
            this.effLineDrill.active = false;
            player.addGoldReward(data.TotalReward);
            if(data.isResume){
                player.updateWallet(data.Wallet);
            }
        } else {
            this.gun.angle = data.Angle;
        }
        const timeShake = 1;
        const countStepShake = 5;
        const timeOneStep = (timeShake - timeLost) / countStepShake / 8; //1 step have 8 action
        if(timeLost < timeShake){
            gfEventEmitter.instance.emit(EventsCode1988.SOUND.DRILL_FIRE);
            this.playShakeDrill({
                timeOneStep: timeOneStep,
                amplitude: 5,
                countStep: countStepShake,
                nodePlay: this.gun,
                callback: ()=>{
                    this.gun.getChildByName("Gun").setScale(1, 1, 1);
                    this.gun.active = false;
                    if (player.isMe) {
                        this.countDownFX.active = false;
                    }
                    gfEventEmitter.instance.emit(EventsCode1988.GAME_LAYER.CREATE_BULLET_DRILL, data );
                }
            });
        }
        else {
            if (player.isMe) {
                this.countDownFX.active = false;
            }
            this.gun.getChildByName("Gun").setScale(1, 1, 1);
            this.gun.active = false;
            gfEventEmitter.instance.emit(EventsCode1988.GAME_LAYER.CREATE_BULLET_DRILL, data );
        }
        gfEventEmitter.instance.emit(EventsCode1988.EFFECT_LAYER.CLEAR_DROP_GUN_LASER, data.DeskStation);
    }

    playShakeDrill({ timeOneStep, amplitude, countStep = 3, nodePlay, callback = null }){
        if(!nodePlay) return;
        const startPos = nodePlay.getPosition();
        tween(nodePlay)
            .repeat(countStep, 
                tween()
                    .to(timeOneStep, {position: v3(startPos.x - amplitude, startPos.y - amplitude, 1)})
                    .to(timeOneStep, {position: startPos})
                    .to(timeOneStep, {position: v3(startPos.x + amplitude, startPos.y + amplitude, 1)})
                    .to(timeOneStep, {position: startPos})
                    .to(timeOneStep, {position: v3(startPos.x - amplitude, startPos.y + amplitude, 1)})
                    .to(timeOneStep, {position: startPos})
                    .to(timeOneStep, {position: v3(startPos.x + amplitude, startPos.y - amplitude, 1)})
                    .to(timeOneStep, {position: startPos})
            )
            .call(()=>{
                callback && callback();
            })
            .start();
    }

    initObj(data) {
        if(this.countDownFX){
            this.countDownFX.active = false;
        }
        Tween.stopAllByTarget(this.gun);
        this.isMe = data.DeskStation === DataStore1988.instance.getSelfDeskStation();
        const isHaveSkill = data.skillInfo && data.skillInfo.SkillID > 0;
        this.effLineDrill && (this.effLineDrill.active = false);
        if(this.isMe && !isHaveSkill){
            DataStore1988.instance.setSelfInfo({ isLockGun: false, currentSkillID: -1});
        }
        super.initObj(data);
    }


    resetCountDownSkill(){
        super.resetCountDownSkill();
        if(this.countDownFX){
            this.countDownFX.active = false;
        }
    }

    showSkillTitle(skillID?:any){
        if(this.countDownFX){
            this.countDownFX.active = true;
        }
        this.skillTitle.active = true;
        switch(skillID){
            case Config1988.instance.SkillConfig.DRILL:
                this.skillTitle.getComponent(sp.Skeleton).skeletonData = this.arrSpineSkillGunTitle[EFF_TITLE_SKILL_GUN_TYPE.DRILL];
                break;
            case Config1988.instance.SkillConfig.LASER:
                this.skillTitle.getComponent(sp.Skeleton).skeletonData = this.arrSpineSkillGunTitle[EFF_TITLE_SKILL_GUN_TYPE.LASER];
                break;
            default:
                this.skillTitle.getComponent(sp.Skeleton).skeletonData = this.arrSpineSkillGunTitle[EFF_TITLE_SKILL_GUN_TYPE.LASER];
        }
        this.skillTitle.getComponent(sp.Skeleton).setAnimation(0, 'Appear', false);
        this.skillTitle.getComponent(sp.Skeleton).setCompleteListener(() => {
            this.skillTitle.getComponent(sp.Skeleton).setAnimation(0, "Idle", true);
            this.skillTitle.getComponent(sp.Skeleton).setCompleteListener(() => {});
        });
    }

    resetOnExit() {
        super.resetOnExit();
        if(this.countDownFX){
            this.countDownFX.active = false;
        }
    }
   
}
