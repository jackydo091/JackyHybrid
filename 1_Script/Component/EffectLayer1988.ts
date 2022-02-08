import { getPostionInOtherNode } from '../../../../cc-common/cc-share/common/utils';
import { _decorator, sys, SpriteFrame, sp, Label, Vec3, tween, v3, Tween, Sprite, UITransform, Prefab, isValid, v2, log, instantiate, CircleCollider2D } from 'cc';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import GameConfig from '../Common/Config1988';
import { registerEvent, removeEvents, getPositionWithTimeSpentFromThreePoint, convertFishCoordinateSystem } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import DataStore from '../Common/DataStore1988';
import ReferenceManager from '../../../cc30-fishbase/Scripts/Common/gfReferenceManager';
import PoolManager from '../../../cc30-fishbase/Scripts/Common/gfPoolManager';
import { gfEffectLayer } from '../../../cc30-fishbase/Scripts/Components/gfEffectLayer';
import { BigWinWheelAvatar1988 } from './BigWinWheelAvatar1988';
import { gf3DParticle } from '../../../cc30-fishbase/Scripts/Components/gf3DParticle';
import { fadeOut } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import EventsCode1988 from '../Common/EventsCode1988';
import { Drill1988 } from './Drill1988';
import { DropSpecialGunFX1998 } from './DropSpecialGunFX1998';
import FishManager1988 from '../Common/FishManager1988';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import { SpineFish1988 } from './SpineFish1988';
import gfFishGroup12 from '../../../cc30-fishbase/Scripts/FishGroup/Groups/gfFishGroup12';

const TOTAL_LIVE_TIME_FLOWER = 5;
const TOTAL_LIVE_TIME_POISON = 7;


const { ccclass, property } = _decorator;

@ccclass('EffectLayer1988')
export class EffectLayer1988 extends gfEffectLayer {
    @property({ type: BigWinWheelAvatar1988, override: true })
    bigWinWheels: BigWinWheelAvatar1988[] = [];
    @property(SpriteFrame)
    listIconFish: SpriteFrame[] = [];
    @property(Prefab)
    itemDrill: Prefab = null;
    @property(Prefab)
    effDrillExplosion: Prefab = null;
    @property(Prefab)
    effectFlowerPoison : Prefab = null;
    @property(Prefab)
    effectPoisonFlowerDie: Prefab = null;
    _toxicEffect = null;
    _listFlowerDie = [];
    _listFlowerExplosion = [];
    private _colliderEffect: CircleCollider2D[] = [];

    onLoad() {
        super.onLoad();
        for (let i = 0; i < this.bigWinWheels.length; i++) {
            const itemComp = this.bigWinWheels[i];
            itemComp.setUpListAvatarIcon(this.listIconFish);
        }
        this._colliderEffect = [];
        this._listFlowerDie = [];
        this._listFlowerExplosion = [];
    }

    initEvents(){
        super.initEvents();
        registerEvent(EventsCode1988.EFFECT_LAYER.DROP_GUN_DRILL, this.playDropGunDrill, this);
        registerEvent(EventsCode1988.EFFECT_LAYER.DRILL_EXPLOSION, this.playEffectDrillExplosion, this);
        registerEvent(EventsCode1988.EFFECT_LAYER.PLAY_EFFECT_BIGWIN, this._playEffectBigWinForSkill, this);
        registerEvent(EventsCode1988.FISH_LAYER.FLOWER_DIE, this.addEffectToxic, this);
        //registerEvent(EventsCode1988.EFFECT_LAYER.END_PHASE_POISON_FLOWER, this.resetColliderEffect, this);
        registerEvent(EventsCode1988.GAME_LAYER.RESUME_POISON_FLOWER, this.resumeEffectToxic, this );

    }
    
    playDropGunLaser({ fishPos, deskStation }) {
        const player = ReferenceManager.instance.getPlayerByDeskStation(deskStation);
        if (!player) return;
   
        const endPos = getPostionInOtherNode(this.node, player.gun);
        const startPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(fishPos);
        PoolManager.instance.createSmallExplosion({ position: startPos });
        const itemLaserNode = instantiate(this.itemLaser);
        const itemLaserCompo = itemLaserNode.getComponent(DropSpecialGunFX1998);
        this.node.addChild(itemLaserNode);
        this._listSkillItem.push(itemLaserNode);

        const dataInfo = {
            angle : player.gun.angle,
            endPos: endPos,
            startPos : startPos,
            deskStation : deskStation
        };
        itemLaserCompo.playEffect(dataInfo, (itemDrop)=>{
            Emitter.instance.emit(gfBaseEvents.PLAYER_LAYER.CHANGE_GUN_LASER, itemDrop.deskStation);
            this.clearDropGunLaserByDeskStation(itemDrop.deskStation);
        });

        Emitter.instance.emit(gfBaseEvents.SOUND.EFFECT_GET_ITEM_LASER);

        
    }



    playDropGunDrill({ fishPos, deskStation }) {
        const player = ReferenceManager.instance.getPlayerByDeskStation(deskStation);

        if (player) {
            const endPos = getPostionInOtherNode(this.node, player.gun);
            const startPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(fishPos);
            PoolManager.instance.createSmallExplosion({ position: startPos });

            const itemDrill = instantiate(this.itemDrill);
            this.node.addChild(itemDrill);
            this._listSkillItem.push(itemDrill);
            //itemDrill.deskStation = deskStation;
            Emitter.instance.emit(gfBaseEvents.SOUND.EFFECT_GET_ITEM_LASER);
            const callback = () => {
                Emitter.instance.emit(EventsCode1988.PLAYER_LAYER.CHANGE_GUN_DRILL, deskStation);
                const index = this._listSkillItem.indexOf(itemDrill);
                if (index > -1) {
                    this._listSkillItem.splice(index, 1);
                }
            };
            itemDrill.getComponent(Drill1988).onMoveToPlayer(startPos, endPos, player.gun.angle, callback);
        }
    }

    _getGunIndex (multiple) {
        const gunValue = DataStore.instance.getGunValue();
        return gunValue.indexOf(multiple);
    }

    playNetFX(data) {
        let gunIndex = this._getGunIndex(data.BulletMultiple);
        const { netFX, config } = PoolManager.instance.getNetFX(gunIndex);
        if (netFX) {
            netFX.node.setParent(this.node);
            netFX.node.position = getPostionInOtherNode(this.node, data.bullet.node);
            this.scheduleOnce(()=>{
                netFX.initAssets(config);
            }, 0);
        }
    }

    playEffectDrillExplosion(data){
        const { nodeDrill } = data;
        const effExplosion = instantiate(this.effDrillExplosion);
        const realPos = getPostionInOtherNode(this.node, nodeDrill);
        this.node.addChild(effExplosion);
        effExplosion.setPosition(v3(realPos, realPos, realPos));
        this._listSkillItem.push(effExplosion);
        Emitter.instance.emit(gfBaseEvents.COMMON.SHAKE_SCREEN, { 
            timeOneStep: 0.03, 
            amplitude: 10, 
            shakeStyle: GameConfig.instance.SHAKE_SCREEN_STYLE.FULL, 
            countStep: 2
        });
    }

    playCoinReward(rewardData) {
        let { data, fishPos, fishKind } = rewardData;
        if (fishPos) {
            fishPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(fishPos);
        } else if (data.skillID === GameConfig.instance.SkillConfig.LASER) {
            fishPos = this.getRandomPositionOutScreenByLaser(data);
        } else {
            fishPos = this.getRandomPositionOutScreen();
        }
        let delay = data.delayTimeDie ? data.delayTimeDie : 0;
        this.scheduleOnce(()=>{
            const isBigwin = data.GoldReward >= data.BulletMultiple * GameConfig.instance.BIG_WIN_RATIO.BIG_WIN_VALUE;
            if (isBigwin && !data.isSkill && !data.skipUpdateWallet) {
                Emitter.instance.emit(gfBaseEvents.COMMON.SHAKE_SCREEN, { timeOneStep: 0.05, amplitude: 10 });
                this._playBigWinEffect({
                    deskStation: data.DeskStation,
                    beganPos: fishPos,
                    gold: data.GoldReward,
                    bet: data.BulletMultiple,
                    isSkill: data.isSkill,
                    fishKind
                });
            } else {
                let { skipUpdateWallet } = data;
                if (!skipUpdateWallet && data.isSkill) {
                    skipUpdateWallet = data.skillID != GameConfig.instance.SkillConfig.FISH_BOMB;
                }
                this._playCoinEffect({
                    deskStation: data.DeskStation,
                    fishKind,
                    beganPos: fishPos,
                    goldReward: data.GoldReward,
                    isSkill: data.isSkill,
                    bulletMultiple: data.BulletMultiple,
                    skipUpdateWallet,
                    skillID : data.skillID
                });
            }
        }, delay);
    }

    _playCoinEffect(data) {
        const {
            deskStation, fishKind, beganPos, goldReward, bulletMultiple, skipUpdateWallet, skillID
        } = data;
        if (goldReward === 0) {
            return;
        }
        const player = ReferenceManager.instance.getPlayerByDeskStation(deskStation);
        const endPos = getPostionInOtherNode(this.node, player.avatar.node);
        if (fishKind === GameConfig.instance.FISH_KIND.MINIBOSS) {
            beganPos.y -= 65;
        }
        const playEffectCoin = function () {
            const LABEL_WIDTH = 150;
            const LABEL_HEIGHT = 25;
            const { Width, Height } = GameConfig.instance.realSize;
            const x = Math.min(Math.max(beganPos.x, -Width / 2 - LABEL_WIDTH / 2), Width / 2 - LABEL_WIDTH / 2);
            const y = Math.min(Math.max(beganPos.y, -Height / 2 - LABEL_HEIGHT / 2), Height / 2 - LABEL_HEIGHT / 2);
            const labelPosition = v2(x, y);

            this._playCoinLabelEffect({
                goldReward,
                bulletMultiple,
                labelPosition,
                beganPos,
                endPos,
                skillID,
                isMe: player.isMe,
                deskStation,
                skipUpdateWallet,
            });
        }.bind(this);
        if (skillID && skillID !== GameConfig.instance.SkillConfig.FISH_BOMB ) {
            PoolManager.instance.createSmallExplosion({ position: beganPos });
            this.scheduleOnce(() => {
                playEffectCoin();
            }, 0.8);
        } else {
            playEffectCoin();
        }
    }

    playEffectFishSpecial(rewardData) {
        //rewardData : { Angle, BulletMultiple, DeskStation, ListFish, SkillID, TotalReward, Wallet }
        if(rewardData.SkillID == GameConfig.instance.SkillConfig.DRILL) return;
        const player = ReferenceManager.instance.getPlayerByDeskStation(rewardData.DeskStation);
        this._playEffectWithBorisPlaying({player, gold: rewardData.TotalReward, bet: rewardData.BulletMultiple, fishKind: rewardData.fishKind});
    }

    _playEffectBigWinForSkill(rewardData){
        let delayTime = rewardData.delayTime ? rewardData.delayTime : 0;
        this.scheduleOnce(()=>{
            const isBigwin = rewardData.TotalReward >= rewardData.BulletMultiple * GameConfig.instance.BIG_WIN_RATIO.BIG_WIN_VALUE;
            if(!isBigwin) {
                return;
            }

            const player = ReferenceManager.instance.getPlayerByDeskStation(rewardData.DeskStation);
            let fishKind;
            if(rewardData.fishKind){
                fishKind = rewardData.fishKind;
            } else{
                if(rewardData.skillInfo.SkillID < 10){
                    fishKind = 100 + rewardData.skillInfo.SkillID;
                }else{
                    fishKind = rewardData.skillInfo.SkillID;
                }
            }
            this._playEffectWithBorisPlaying({player, gold: rewardData.TotalReward, bet: rewardData.BulletMultiple, fishKind});
        }, delayTime);
    }

    //need refactor this
    _playBigWinEffect(data) {
        const {
            deskStation, beganPos, gold, bet, isSkill, fishKind
        } = data;
        if (gold === 0) {
            return;
        }
        const player = ReferenceManager.instance.getPlayerByDeskStation(deskStation);
        const endPos = getPostionInOtherNode(this.node, player.avatar.node);
        Emitter.instance.emit(gfBaseEvents.SOUND.EFFECT_BOMB, fishKind);
        const particle = instantiate(this.particle3D).getComponent(gf3DParticle);
        particle.node.parent = this.node;
        this._lisParticle.push(particle.node);
        particle.node.position = beganPos;
        particle.setIsMe(player.isMe);
        particle.setLifetime(0.2);
        particle.setSpawnRate(30);
        particle.setItemSpeed(500, 750);
        particle.setGravity(-400);
        particle.setSpawnInterval(0.2);
        particle.setDuration(0.3);
        particle.startAnimation();

        tween(particle.node)
            .delay(0.65)
            .then(fadeOut(0.4))
            .removeSelf()
            .call(() => {
                particle.stopAnimation();
                particle.node.removeFromParent();
                particle.node.destroy();
                const index = this._lisParticle.indexOf(particle.node);
                if (index > 0) {
                    this._lisParticle.splice(index, 1);
                }
            })
            .start();

        PoolManager.instance.createSmallExplosion({ position: beganPos });
        // eslint-disable-next-line prefer-object-spread
        const labelPosition = Object.assign({}, beganPos);
        const playBigWin = !this._getWheel(player.index).isShowingDragonBall();
        this._playCoinLabelEffect({
            goldReward: gold,
            bulletMultiple: bet,
            labelPosition,
            beganPos,
            endPos,
            isSkill,
            isMe: player.isMe,
            deskStation,
            playBigWin,
            skipUpdateWallet: playBigWin,
        });
        this._playEffectWithBorisPlaying({player, gold, bet, fishKind});
    }

    _playEffectWithBorisPlaying(data){
        const isPlayingBorisReward = DataStore.instance.isPlayingBorisReward;
        if(!isPlayingBorisReward){
            this.onPlayEffectWinInCatchFish({
                player: data.player,
                gold: data.gold,
                bet: data.bet,
                fishKind: data.fishKind
            });
        } else {
            if(data.player.isMe){
                data.player.addToDisplayWallet(data.gold);
            }
        }
    }

    playPoisonEffectAllFish() {
        const listFish = FishManager1988.instance.getListFish();
        listFish.forEach(fish => {
            const fishComponent = fish as SpineFish1988;
            fishComponent && fishComponent.playPoisonEffect();
        });
    }

    triggerBombFX(posNode) {
        const itemBomb = instantiate(this.itemBomb);
        const startPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(posNode);
        this.node.addChild(itemBomb);
        this._listSkillItem.push(itemBomb);
        Emitter.instance.emit(gfBaseEvents.COMMON.SHAKE_SCREEN, { timeOneStep: 0.03, amplitude: 5 });
        itemBomb.setPosition(startPos);
        Emitter.instance.emit(EventsCode1988.SOUND.FLOWER_EXPLOSION);
    }

    effectItemFreeze() {
    }
    playLuckyEffect() {
    }
    onPlayLuckyEffectDone() {
    }

    addEffectToxic(position, isResume, timeLostEffect = 0){
        DataStore.instance.isPlayingPoison = true;
        const effectPoisonDie = instantiate(this.effectPoisonFlowerDie);
        const fishLayer = ReferenceManager.instance.getNodeFishLayer();
        fishLayer.addChild(effectPoisonDie);
        effectPoisonDie.setPosition(v3(position.x, position.y, position.zIndex));
        this._listFlowerDie.push(effectPoisonDie);
        const spinePoison = effectPoisonDie.getComponent(sp.Skeleton);
        if(!isResume) {
            spinePoison.setAnimation(0, "animation", true);
            spinePoison.node.setScale(1,1,1);
            tween(effectPoisonDie)
                .to(0.9, { scale : v3(0.75, 0.75, 0.75)})
                .call(()=> {
                    spinePoison.setAnimation(0, "die", false);
                })
                .delay(0.9)
                .call(()=> {
                    const fishPosition = effectPoisonDie.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 1));
                    this.addPoison(fishPosition);
                })
                .delay(13.25)
                .then(fadeOut(0.9))
                .call(()=>{
                    DataStore.instance.isPlayingPoison = false;
                })
                .removeSelf()
                .call(()=>{
                    effectPoisonDie.destroy();
                })
                .start();
        } else {
            spinePoison.setAnimation(0, "die", false);
            tween(effectPoisonDie)
                .delay(13.25 - timeLostEffect)
                .then(fadeOut(0.9))
                .call(()=>{
                    DataStore.instance.isPlayingPoison = false;
                })
                .removeSelf()
                .call(()=>{
                    effectPoisonDie.destroy();
                })
                .start();
            const timePassed = TOTAL_LIVE_TIME_FLOWER - timeLostEffect;
            if (timeLostEffect > 0 && timePassed > 0) {
                spinePoison.updateAnimation(timePassed);
            }
            spinePoison.node.setScale(0.75, 0.75, 0.75);
            const fishPosition = effectPoisonDie.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 1));
            this.addPoison(fishPosition, timeLostEffect);   
        }
    }

    addPoison(position, timeLostEffect = 0) {
        const toxicEffect = instantiate(this.effectFlowerPoison);
        this.node.addChild(toxicEffect);
        toxicEffect.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(position);
        const spine =  toxicEffect.getComponent(sp.Skeleton);
        if(timeLostEffect == 0){
            spine.setAnimation(0, "animation", false);
            spine.addAnimation(0, "loop", true);
        }
        else{
            spine.setAnimation(0, "loop", true);
        }
        tween(toxicEffect)
            .delay(13 - timeLostEffect)
            .then(fadeOut(0.9))
            .removeSelf()
            .call(()=>{
                toxicEffect.destroy();
            })
            .start();
        let colliderEffect:CircleCollider2D = toxicEffect.getComponent(CircleCollider2D);
        colliderEffect.radius = 0;
        this._colliderEffect.push(colliderEffect);
        this.scheduleOnce(()=>{ 
            const index = this._colliderEffect.indexOf(colliderEffect);
            this._colliderEffect.splice(index, 1);
        }, 13 - timeLostEffect);
        Emitter.instance.emit(EventsCode1988.SOUND.POISON_EFFECT);
        this._listFlowerExplosion.push(toxicEffect);
    }

    update(dt) {
        if(this._colliderEffect.length > 0) {
            this._colliderEffect.forEach((colliderEffect)=>{
                colliderEffect.radius += 110 * dt;
            })
        }
    }

    resetColliderEffect(){
        if(this._colliderEffect.length > 0) {
            this._colliderEffect.forEach((colliderEffect)=>{
                colliderEffect = null;
            })
            this._colliderEffect = [];
        }
    }

    resumeEffectToxic(data){
        log("resumeEffectToxic",data);
        if(data[0] && data[0].SkillID === GameConfig.instance.SkillConfig.FISH_BOMB) {
            const dataFlowerPoison = data[0].ListFish[0];
            const {BuildTick, Position} = dataFlowerPoison;
            const timeLost = Math.max(0, (data[0].BuildTick - BuildTick) / 1000);
            const position = this.getFlowerDiePosition(Position, timeLost);

            const timeLostEffect = data[0].BuildTick ? (Math.max(0, (DataStore.instance.getTime() - data[0].BuildTick) / 1000)) : 0;

            this.addEffectToxic(position, true, timeLostEffect);
        }
    }

    getFlowerDiePosition(points, timeLost) {
        if(points.length == 3) {
            if (DataStore.instance.getSelfDeskStation() > 1) {
                convertFishCoordinateSystem(points);
            }
            const p1 = v2(points[0].PosX, points[0].PosY);
            const p2 = v2(points[1].PosX, points[1].PosY);
            const p3 = v2(points[2].PosX, points[2].PosY);
            const position = getPositionWithTimeSpentFromThreePoint(p1, p2, p3, timeLost, 20);
            return position;
        }
        return gfFishGroup12.calculateFlowerDiePosition(timeLost);
    }

    removeEffectToxic(){
        DataStore.instance.isPlayingPoison = false;
        this.resetColliderEffect();
        this._listFlowerDie.forEach((flowerDie)=> {
            if(isValid(flowerDie)) {
                Tween.stopAllByTarget(flowerDie);
                flowerDie.removeFromParent();
                flowerDie.destroy();
            }
        });
        this._listFlowerExplosion.forEach((effect)=> {
            if(isValid(effect)) {
                Tween.stopAllByTarget(effect);
                effect.removeFromParent();
                effect.destroy();
            }
        });
    }

    resetOnExit(){
        super.resetOnExit();
        this.removeEffectToxic();
    }

    onDestroy() {
        super.onDestroy();
        this.unscheduleAllCallbacks();
        removeEvents(this);
        this.removeEffectToxic();
    }
}
