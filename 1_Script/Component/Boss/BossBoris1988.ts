import {_decorator, v2, v3, Vec3, sp, Prefab, Material, Color, tween, Node, Tween, UITransform, BoxCollider, UIOpacity, isValid} from 'cc';
import {gfBaseFish} from "../../../../cc30-fishbase/Scripts/Components/Fishes/gfBaseFish";
import DataStore from "../../Common/DataStore1988";
import Emitter from "../../../../cc30-fishbase/Scripts/Common/gfEventEmitter";
import EventCode from "../../Common/EventsCode1988";
import BaseEvents from "../../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import {
    moveTo,
    moveBy,
    rotateTo,
    rotateBy,
    stopAllActions,
    call,
    delay,
    scaleTo,
    bezierTo,
    gfBezierBy,
    fadeOut
} from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";
import {getPointBetweenTwoPointByPercent} from "../../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import {getPostionInOtherNode, getRandomInt} from '../../../../../cc-common/cc-share/common/utils';
import PoolManager from "../../Common/PoolManager1988";
import ReferenceManager1988 from '../../Common/ReferenceManager1988';
import GameConfig from "../../Common/Config1988";
import { BorisStatic1988 } from './BorisStatic1988';



const {ccclass, property} = _decorator;

const TIME_ANIM_MOVE = 1;
const TIME_ANIM_WAIT_CENTER = 2;
const TIME_ANIM_WAIT = 3.25;
// const BASE_TIME_SCALE = 1 / 6;
const TOTAL_LIVE_TIME = 60;

//const SPINE_FPS = 30;
const LIST_POST_MOVE_1 = [v3(320, 480, 1), v3(960, 240, 1), v3(320, 240, 1), v3(960, 480, 1)];
const LIST_POST_MOVE_2 = [v3(960, 240, 1), v3(320, 480, 1), v3(960, 480, 1), v3(320, 240, 1)];

const START_POS = v3(640, 1200);

const ARR_POS_EXPLOSION = [v3(-118, 0, 1), v3(-112, -43, 1), v3(133, 59, 1), v3(107, -30, 1)];

const STATE_BORIS = {
    MOVE_IN: 1,
    MOVE_LOOP: 2,
    MOVE_OUT: 3,
    WAIT_DIE: 4,
    DIE: 5
};

const DELAY_TIME_STATIC = 0.05;

const BORIS_FEELING = {
    HAPPY_1: 0,
    HAPPY_2: 2,
    PANIC: 3,
    ANGRY: 4
};

const LIST_MIX_ANIM_WITH_SKIN = {
    "0": {
        skin: "Level_0",
        anim: "Nomal"
    },
    "1": {
        skin: "Level_1",
        anim: "Happy"
    },
    "2": {
        skin: "Level_2",
        anim: "Happy"
    },
    "3": {
        skin: "Level_3",
        anim: "Panic"
    },
    "4": {
        skin: "Level_4",
        anim: "Angry"
    },
    "5": {
        skin: "Level_5",
        anim: "Die"
    }
};

const FLAG_COLOR = new Color(230, 230, 230, 255);

interface MoveData {
    position: Vec3,
    startTime: number,
    delayTime: number
}

interface Reward {
    DeskStation: number,
    WinAmount: number
    wonJackpot: boolean,
}

@ccclass('BossBoris1988')
export class BossBoris1988 extends gfBaseFish {
    private _listDataMove: Array<MoveData>;
    @property(sp.Skeleton)
    private fishAnim: sp.Skeleton;
    @property(Prefab)
    public borisStatic: Prefab;
    @property(sp.SkeletonData)
    private smallExplosionSpineData: sp.SkeletonData;
    private _timeRemain:number;
    private _isLoaded: false;
    private _currentState:number = -1;

    private _moveAction: [];
    private _arrEffect: Array<Node> = [];
    private _rewardData: Reward;
    private _currTimeDelayStatic:number = 0;
    private _levelDamaged:number = 0;
    private _isTurnOffStatic: boolean = false;
    private _arrBorisStatic: BorisStatic1988[] = [];
    onLoad() {
        this.updateZIndex(GameConfig.instance.Z_INDEX.DRAGON);
        this.fishAnim.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[0].anim, LIST_MIX_ANIM_WITH_SKIN[1].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[0].anim, LIST_MIX_ANIM_WITH_SKIN[2].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[0].anim, LIST_MIX_ANIM_WITH_SKIN[3].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[0].anim, LIST_MIX_ANIM_WITH_SKIN[4].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[0].anim, LIST_MIX_ANIM_WITH_SKIN[5].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[1].anim, LIST_MIX_ANIM_WITH_SKIN[0].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[2].anim, LIST_MIX_ANIM_WITH_SKIN[0].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[3].anim, LIST_MIX_ANIM_WITH_SKIN[0].anim, 0.25);
        this.fishAnim.setMix(LIST_MIX_ANIM_WITH_SKIN[4].anim, LIST_MIX_ANIM_WITH_SKIN[0].anim, 0.25);
    }

    initFishData(data) {
        const {FishID, FishKind, BuildTick, damageLevel, isResume} = data;

        this._listDataMove = [];

        this._FishID = FishID;
        this._FishKind = FishKind;

        this.unscheduleAllCallbacks();

        this.fishAnim.color = Color.WHITE;
        stopAllActions(this.fishAnim.node);
        this.reset();
        if(BuildTick){
            this._timeLost = Math.max(0, (DataStore.instance.getTime() - BuildTick) / 1000);
        }
        this._timeRemain = this._timeLost ? TOTAL_LIVE_TIME - this._timeLost : TOTAL_LIVE_TIME;
        this.fishAnim.setAnimation(0, LIST_MIX_ANIM_WITH_SKIN[0].anim, true);
        this.createListDataMove();

        if(this._timeLost < 1) {
            this.setState(STATE_BORIS.MOVE_IN);
        } else if(this._timeLost >= 1 && this._timeLost <= TOTAL_LIVE_TIME){
            this.setState(STATE_BORIS.MOVE_LOOP);
        }

        if(damageLevel){
            this.updateSkinDamaged(damageLevel, isResume);
        }
        Emitter.instance.emit(BaseEvents.SOUND.PLAY_SOUND_BACKGROUND, GameConfig.instance.SOUND_BACKGROUND_CONFIG.DRAGON);
    }

    createListDataMove(){
        let currentTime:number;
        const { AppSize } = GameConfig.instance;

        const moveData:MoveData = {
            position: v3(AppSize.Width / 2, AppSize.Height / 2, 0),
            startTime: TIME_ANIM_MOVE,
            delayTime: TIME_ANIM_WAIT_CENTER
        }


        this._listDataMove.push(moveData);

        currentTime = this._listDataMove[0].startTime + this._listDataMove[0].delayTime;
        const myDeskStation = DataStore.instance.getSelfDeskStation();
        let LIST_POST_MOVE = [];
        if(myDeskStation == 0 || myDeskStation == 1){
            LIST_POST_MOVE = LIST_POST_MOVE_1;
        }
        else{
            LIST_POST_MOVE = LIST_POST_MOVE_2;
        }
        while(currentTime <= TOTAL_LIVE_TIME){
            for(let i = 0; i < LIST_POST_MOVE.length; ++i){
                const startTime = currentTime + TIME_ANIM_MOVE;
                if(startTime >= TOTAL_LIVE_TIME){
                    currentTime = startTime + TIME_ANIM_WAIT;
                    break;
                }
                this._listDataMove.push({
                    position: LIST_POST_MOVE[i],
                    startTime: startTime,
                    delayTime: TIME_ANIM_WAIT
                });
                currentTime = startTime + TIME_ANIM_WAIT;
            }
        }
    }

    stateMoveIn() {
        Emitter.instance.emit(EventCode.SOUND.BORIS_APPEAR);
        const {AppSize} = GameConfig.instance;
        let center = v3(AppSize.Width / 2, AppSize.Height / 2);
        this.node.scale.set(v3(0.5, 0.5, 0.5));
        const timeMove = (TIME_ANIM_MOVE - this._timeLost) >= 0 ? (TIME_ANIM_MOVE - this._timeLost) : 0;
        tween(this.node)
            .parallel(
                tween().to(timeMove, {position: center}, {easing: "elasticInOut"}),
                tween().delay(timeMove * 2 / 3)
                    .to(timeMove / 3, {scale: v3(1, 1, 1)})
                    .call(() => {
                        Emitter.instance.emit(BaseEvents.COMMON.SHAKE_SCREEN, {
                            timeOneStep: 0.1,
                            amplitude: 5,
                            shakeStyle: GameConfig.instance.SHAKE_SCREEN_STYLE.FULL,
                            countStep: 2
                        });
                    })
            )
            .call(() => {
                this._timeLost = TIME_ANIM_MOVE;
                this.setState(STATE_BORIS.MOVE_LOOP);
            })
            .start();
    }

    stateMoveLoop() {

        let moveTimeRemain = TIME_ANIM_MOVE;
        let indexAction = 0;
        if (this._timeLost >= this._listDataMove[0].startTime &&
            this._timeLost <= this._listDataMove[0].startTime + TIME_ANIM_WAIT_CENTER) {
            this.node.setPosition(this._listDataMove[0].position);
            this._listDataMove[0].delayTime = this._listDataMove[0].startTime + TIME_ANIM_WAIT_CENTER - this._timeLost;
            moveTimeRemain = 0;
        } else {

            for (let i = 1; i < this._listDataMove.length; ++i) {
                if (this._timeLost < this._listDataMove[i].startTime) {
                    let p0 = this._listDataMove[i - 1].position;
                    let p1 = this._listDataMove[i].position;
                    let per = (this._timeLost - this._listDataMove[i - 1].startTime - this._listDataMove[i - 1].delayTime);
                    let position = getPointBetweenTwoPointByPercent(p0, p1, per);
                    this.node.setPosition(v3(position.x, position.y));
                    moveTimeRemain = this._listDataMove[i].startTime - this._timeLost;
                    indexAction = i;
                    break;
                } else if (this._timeLost <= this._listDataMove[i].startTime + TIME_ANIM_WAIT) {
                    this.node.setPosition(this._listDataMove[i].position);
                    this._listDataMove[i].delayTime = this._listDataMove[i].startTime + TIME_ANIM_WAIT - this._timeLost;
                    moveTimeRemain = 0;
                    indexAction = i;
                    break;
                }
            }
        }
        this.createActionMove(indexAction, moveTimeRemain);

    }

    createActionMove(indexAction, moveTimeRemain) {
        let listAction: Tween<Node>;
        listAction = tween(this.node);

        let angle = this.caculateAngle(this.node.position, this._listDataMove[indexAction].position);

        if (moveTimeRemain) {
            listAction.then(tween().parallel(
                rotateTo(0.25, angle),
                moveTo(
                    moveTimeRemain,
                    this._listDataMove[indexAction].position.x,
                    this._listDataMove[indexAction].position.y,
                    0,
                    'sineIn')
            ));
            listAction.then(rotateTo(0.25, 0));
        }
        this.playAnimIdle(listAction);
        indexAction++;

        for(let i = indexAction; i < this._listDataMove.length; ++i){
            angle = this.caculateAngle(this._listDataMove[i - 1].position, this._listDataMove[i].position);
            listAction.then(
                call(() => {
                    Emitter.instance.emit(EventCode.SOUND.BORIS_MOVE);
                }),
            );

            listAction.then(tween().parallel(
                rotateTo(0.25, angle),
                moveTo(TIME_ANIM_MOVE,
                    this._listDataMove[i].position.x,
                    this._listDataMove[i].position.y,
                    0,
                    'sineIn'
                ),
            ))

            listAction.then(rotateTo(0.25, 0));
            listAction.then(call(() => {
                const random = getRandomInt(0, 4);
                if (random == 1) {
                    Emitter.instance.emit(EventCode.SOUND.BORIS_LAUGH);
                }
            }));
            this.playAnimIdle(listAction);
        }

        listAction.then(call(() => {
            this.setState(STATE_BORIS.MOVE_OUT);
        }));
        listAction.start();
    }

    caculateAngle(curPos, nextPos){
        return (curPos.x > nextPos.x) ? -20 : 20;
    }

    playAnimIdle(listAction){
        listAction.then(
            tween()
                .call(() => {
                    Emitter.instance.emit(EventCode.SOUND.BORIS_IDLE);
                })
                .parallel(
                    moveBy(TIME_ANIM_WAIT / 4, 20, 0),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, -5)),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, 5))
                )
                .parallel(
                    moveBy(TIME_ANIM_WAIT / 4, -20, 0),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, 5)),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, -5)),
                )
                .parallel(
                    moveBy(TIME_ANIM_WAIT / 4, -20, 0),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, 5)),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, -5)),
                )
                .parallel(
                    moveBy(TIME_ANIM_WAIT / 4, 20, 0),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, -5)),
                    tween().then(rotateBy(TIME_ANIM_WAIT / 8, 5))
                )
        )
    }

    stateMoveOut(){
        stopAllActions(this.node);
        this.enableColliderBoxs(false);
        this._isDie = true;
        const listAction = this.createActionMoveOut();
        listAction.start();
    }

    createActionMoveOut(){
        let listAction: Tween<Node>;
        listAction = tween(this.node);
        this.unschedule(this.scheduleRandomAnim);
        const angle = this.caculateAngle(this.node.position, v2(640, 360));
        listAction.then(
            tween().parallel(
                moveTo(0.5, 640, 360),
                rotateTo(0.125, angle),
            )
        );
        listAction.then(
            rotateTo(0.125, 0)
        )

        listAction.then(
            call(() => {
                this.fishAnim.setAnimation(0, "Happy", true);
                Emitter.instance.emit(EventCode.SOUND.BORIS_TRASH_TALK, BORIS_FEELING.HAPPY_1);
            })
        )

        listAction.then(delay(0.5));
        listAction.then(call(() => {
            this._isTurnOffStatic = true;
            Emitter.instance.emit(BaseEvents.COMMON.SHAKE_SCREEN, {
                timeOneStep: 0.1,
                amplitude: 5,
                shakeStyle: GameConfig.instance.SHAKE_SCREEN_STYLE.FULL,
                countStep: 3
            });
            Emitter.instance.emit(EventCode.SOUND.BORIS_OUT);
        }));

        listAction.then(rotateTo(0.05, -5));
        listAction.then(rotateTo(0.05, 0));
        listAction.then(rotateTo(0.05, 5));
        listAction.then(rotateTo(0.05, 0));
        listAction.then(rotateTo(0.05, -5));
        listAction.then(rotateTo(0.05, 0));
        listAction.then(rotateTo(0.05, 5));
        listAction.then(rotateTo(0.05, 0));
        listAction.then(rotateTo(0.05, -5));
        listAction.then(rotateTo(0.05, 0));
        listAction.then(rotateTo(0.05, 5));
        listAction.then(rotateTo(0.05, 0));

        const configBezier1 = [
            v2(-960, -360),
            v2(360, 360),
            v2(360, 600)
        ];

        const moveOut: Tween<Node> = tween(this.node);
        moveOut.then(
            tween().parallel(
                rotateTo(0.125, -20),
                scaleTo(0.3, 1.5)
            )
        );
        moveOut.then(
            tween().parallel(
                rotateTo(0.25, 20),
                scaleTo(0.7, 5),
                fadeOut(0.7)
            )
        );
        listAction.then(
            tween().parallel(
                gfBezierBy(1, configBezier1),
                call(()=>{
                    moveOut.start();
                })
            )
        )

        listAction.then(call(() => {
            this.onDie();
        }));
        return listAction;
    }

    stateWaitDie(){
        this._isDie = true;
        this.enableColliderBoxs(false);
        stopAllActions(this.node);
        Emitter.instance.emit(EventCode.SOUND.BORIS_TRASH_TALK, BORIS_FEELING.ANGRY);
        Emitter.instance.emit(EventCode.GAME_LAYER.BORIS_WAIT_DIE, this._rewardData);
        this.fishAnim.setAnimation(0, LIST_MIX_ANIM_WITH_SKIN[4].anim, true);
        this.playShake({
            timeOneStep: 0.05,
            amplitude: 5
        });
    }

    playShake({ timeOneStep, amplitude}){
        const startPos = this.node.getPosition();
        if(this.node.angle != 0){
            tween(this.node)
                .to(0.25, {angle: 0})
                .start();
        }
        tween(this.node)
            .parallel(
                tween()
                    .to(timeOneStep, {position: v3(startPos.x - amplitude, startPos.y - amplitude)})
                    .to(timeOneStep, {position: startPos})
                    .to(timeOneStep, {position: v3(startPos.x + amplitude, startPos.y + amplitude)})
                    .to(timeOneStep, {position: startPos})
                    .to(timeOneStep, {position: v3(startPos.x - amplitude, startPos.y + amplitude)})
                    .to(timeOneStep, {position: startPos})
                    .to(timeOneStep, {position: v3(startPos.x + amplitude, startPos.y - amplitude)})
                    .to(timeOneStep, {position: startPos}),
                tween()
                    .delay(timeOneStep * 2)
                    .call(()=>{ 
                        const percent = getRandomInt(0, 1);
                        if(percent){
                            const levelDamaged = getRandomInt(0, 4);
                            this.playEffectExplosion(levelDamaged);
                        }

                    })
            )
            .repeatForever()
            .start();
    }

    updateSkinDamaged(levelDamaged:number = 0, isResume = false){
        if(!isResume){
            this.playEffectExplosion(levelDamaged);
        }
        else {
            this._levelDamaged = 0;
        }
        if(this._levelDamaged == levelDamaged) return;
        this.unschedule(this.scheduleRandomAnim);
        const {skin, anim} = LIST_MIX_ANIM_WITH_SKIN[levelDamaged];
        this._levelDamaged = levelDamaged;
        this.fishAnim.setSkin(skin);
        this.fishAnim.setAnimation(0, anim, false);
        this.fishAnim.addAnimation(0, LIST_MIX_ANIM_WITH_SKIN[0].anim, true);
        Emitter.instance.emit(EventCode.SOUND.BORIS_TRASH_TALK, this._levelDamaged);

        Emitter.instance.emit(EventCode.SOUND.BORIS_DAMAGE);
        this.schedule(this.scheduleRandomAnim, 4.1);
    }

    scheduleRandomAnim(){
        if(this._levelDamaged < 0) return;
        const {anim} = LIST_MIX_ANIM_WITH_SKIN[this._levelDamaged];
        const random = getRandomInt(0, 100);
        const percentNormal = 50;
        const percentLaugh = 65;
        if(random < percentNormal) return;
        else if(random > percentNormal && random < percentLaugh &&
            this._levelDamaged != BORIS_FEELING.PANIC && this._levelDamaged != BORIS_FEELING.ANGRY){
            Emitter.instance.emit(EventCode.SOUND.BORIS_TRASH_TALK, BORIS_FEELING.HAPPY_1);
            this.fishAnim.setAnimation(0, LIST_MIX_ANIM_WITH_SKIN[1].anim, false);
            this.fishAnim.addAnimation(0, LIST_MIX_ANIM_WITH_SKIN[0].anim, true);
        }
        else if(this._levelDamaged > 0 && random > percentLaugh){
            Emitter.instance.emit(EventCode.SOUND.BORIS_TRASH_TALK, this._levelDamaged);
            this.fishAnim.setAnimation(0, anim, false);
            this.fishAnim.addAnimation(0, LIST_MIX_ANIM_WITH_SKIN[0].anim, true);
        }
    }

    playEffectExplosion(levelDamaged){
        if(!levelDamaged) return;
        // const effExplosion = cc.instantiate(this.smallExplosion);
        const effExplosion = new Node('effExplosion');
        effExplosion.addComponent(UIOpacity);
        const compExplosion = effExplosion.addComponent(sp.Skeleton);
        compExplosion.skeletonData = this.smallExplosionSpineData;
        this.node.addChild(effExplosion);
        effExplosion.setPosition(ARR_POS_EXPLOSION[+levelDamaged - 1]);
        effExplosion.getComponent(UIOpacity).opacity = 255;
        effExplosion.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        const duration = effExplosion.getComponent(sp.Skeleton).findAnimation("animation").duration;
        tween(effExplosion)
            .delay(duration)
            .call(()=>{
                const index = this._arrEffect.indexOf(effExplosion);
                if(index != -1){
                    this._arrEffect.splice(index, 1);
                }
            })
            .removeSelf()
            .call(()=>{
                effExplosion.destroy();
            })
            .start();
        this._arrEffect.push(effExplosion);
    }

    setState(nextState){
        if(this._currentState == nextState) return;
        switch(nextState){
            case STATE_BORIS.MOVE_IN:
                this.stateMoveIn();
                break;
            case STATE_BORIS.MOVE_LOOP:
                this.stateMoveLoop();
                break;
            case STATE_BORIS.MOVE_OUT:
                this.stateMoveOut();
                break;
            case STATE_BORIS.WAIT_DIE:
                this.stateWaitDie();
                break;
            case STATE_BORIS.DIE:
                this.playEffectDie();
                break;
        }
        this._currentState = nextState;
    }

    onHit() {
        this.fishAnim.color = FLAG_COLOR;
        this.scheduleOnce(() => {
            this.fishAnim.color = Color.WHITE;
        }, 0.1);
    }

    onBossEnd(data){
        this.fishAnim.color = Color.WHITE;
        const {wonJackpot} = data;
        this._rewardData = data;
        if(wonJackpot) {
            this.setState(STATE_BORIS.WAIT_DIE);
        }
        else{
            this.setState(STATE_BORIS.MOVE_OUT);
        }
    }

    returnReward(){
        if(!this._rewardData) {
            return;
        }
        const { DeskStation, WinAmount, wonJackpot } = this._rewardData;
        if(!wonJackpot) {
            return;
        }
        const player = ReferenceManager1988.instance.getPlayerByDeskStation(DeskStation);
        if(!player || !player.isActive()){
            console.warn("Can not find player or player was out");
        }
        Emitter.instance.emit(EventCode.GAME_LAYER.PLAY_JACKPOT_BORIS, {
            jackpotAmount: WinAmount,
            DeskStation: DeskStation
        });
    }

    onCatch() {
        this._isDie = true;
        Emitter.instance.emit(BaseEvents.SOUND.DRAGON_DIE);
        this.setState(STATE_BORIS.DIE);
    }

    onDie(isResume = false) {
        if(!isResume){
            Emitter.instance.emit(BaseEvents.SOUND.PLAY_SOUND_BACKGROUND, GameConfig.instance.SOUND_BACKGROUND_CONFIG.IN_GAME);
        }
        this._isDie = true;
        Emitter.instance.emit(EventCode.GAME_LAYER.BORIS_END);
        Emitter.instance.emit(BaseEvents.GAME_LAYER.REMOVE_FISH, this._FishID);
        this.returnReward();
        this.node.removeFromParent();
        this.reset();
    }

    playEffectDie(){
        Emitter.instance.emit(EventCode.SOUND.BORIS_DIE);
        stopAllActions(this.node);
        this.enableColliderBoxs(false);
        const durationDie = this.fishAnim.findAnimation(LIST_MIX_ANIM_WITH_SKIN[5].anim).duration;
        this._isTurnOffStatic = false;
        this.unschedule(this.scheduleRandomAnim);
        tween(this.node)
            .call(()=>{
                this._isTurnOffStatic = true;
                this.fishAnim.setSkin(LIST_MIX_ANIM_WITH_SKIN[5].skin);
                this.fishAnim.setAnimation(0, LIST_MIX_ANIM_WITH_SKIN[5].anim, false);
            })
            .delay(durationDie * 0.3 + 0.4)
            .call(()=>{
                Emitter.instance.emit(EventCode.SOUND.BORIS_DESTROYED);
                Emitter.instance.emit(BaseEvents.COMMON.SHAKE_SCREEN, {
                    timeOneStep: 0.1,
                    amplitude: 10,
                    shakeStyle: GameConfig.instance.SHAKE_SCREEN_STYLE.FULL,
                    countStep: 2
                });
                this.updateZIndex(99)
            })
            .delay(durationDie * 0.6)
            .call(()=>{
                this.onDie();
            })
            .start();
    }

    // @ts-ignore
    update(dt) {
        super.update(dt);
        if (!this._isTurnOffStatic &&
            this._currTimeDelayStatic >= DELAY_TIME_STATIC) {
            const position = getPostionInOtherNode(this.node.parent, this.node);
            // @ts-ignore
            const borisStatic = PoolManager.instance.createBorisStatic({
                position: v2(position.x, position.y + 5),
                parent: this.node.parent,
                zIndex: this.zIndex - 1,
                angle: this.node.angle,
                scale: this.node.scale
            });
            this._arrBorisStatic.push(borisStatic);
            const callback = ()=>{
                const index = this._arrBorisStatic.indexOf(borisStatic);
                this._arrBorisStatic.splice(index, 1);
            }
            borisStatic.play(callback);
            this._currTimeDelayStatic = 0;
        } else {
            this._currTimeDelayStatic += dt;
        }
    }

    updateOutScreen() {
        const lastState = this._isOutScreen;
        super.updateOutScreen();
        if (lastState && !this._isOutScreen) {
            Emitter.instance.emit(BaseEvents.FISH_LAYER.BOSS_ON_GAME);
        }
    }

    enableColliderBoxs(enable){
        const fishColliderBoxes = this.node.getComponents(BoxCollider);
        fishColliderBoxes.map((box) =>{
            box.enabled = enable;
        })
        // for (let i = 0; i < fishColliderBoxes.length; ++i) {
        //     fishColliderBoxes[i].enabled = enable;
        // }
    }

    getChipDropPosition() {
        return this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
    }

    updateAngle() {}

    reset(){
        stopAllActions(this.node);
        this._isDie = false;
        this._isOutScreen = true;
        this.getComponent(UIOpacity).opacity = 255;
        this.node.active = true;
        this.node.angle = 0;
        this.node.setPosition(START_POS);
        this._listDataMove = [];
        this._timeLost = 0;
        this._timeRemain = 0;
        this._currentState = -1;
        this.node.scale = v3(1, 1, 1);
        this._isTurnOffStatic = false;
        this.enableColliderBoxs(true);
        this.fishAnim.setSkin(LIST_MIX_ANIM_WITH_SKIN[0].skin);
        this.updateZIndex(GameConfig.instance.Z_INDEX.DRAGON);
        this._arrEffect.forEach(element => {
            if(element && isValid(element)){
                stopAllActions(element);
                element.removeFromParent();
                element.destroy();
            }
        });
        this._arrEffect = [];
        this._rewardData = null;
        if(this._arrBorisStatic.length > 0){
            for(let i = 0; i < this._arrBorisStatic.length; ++i){
                const borisStatic = this._arrBorisStatic.splice(i, 1);
                borisStatic[0].returnPool();
            }
            this._arrBorisStatic = [];
        }
    }

    returnPool() { }
}

