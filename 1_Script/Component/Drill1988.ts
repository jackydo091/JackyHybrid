
import { getRandomInt, setOpacity } from '../../../../cc-common/cc-share/common/utils';
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import { deepCopy, getRotation } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator, Component, Node, v4, BoxCollider, misc, sp, v3, tween, MotionStreak, Tween, Color, error, Collider2D, IPhysics2DContact, BoxCollider2D, Contact2DType, sys } from 'cc';
import Config1988 from '../Common/Config1988';
import DataStore1988 from '../Common/DataStore1988';
import EventsCode1988 from '../Common/EventsCode1988';
import { gfBaseFish } from '../../../cc30-fishbase/Scripts/Components/Fishes/gfBaseFish';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import FishManager1988 from '../Common/FishManager1988';


const { ccclass, property } = _decorator;

const STATE = {
    NORMAL: 1,
    NORMAL_SLOWDOWN: 2,
    DAMAGED: 3,
    ROTATION : 4,
    EXPLOSION: 5,
    NONE_ACTION: 0
};
const DRILL_CONFIG = {
    HIT_COLOR : new Color(230, 30, 30, 255),
    SPEED :  2730 * 0.67,
    MAX_SPEED : 2,
    MIN_SPEED: 0.7,
    SCALE : {
        start: 2 / 3,
        normal: 1,
        medium: 1.5,
        high: 3,
    }
};
const RATIO_DIE = 60;
@ccclass('Drill1988')
export class Drill1988 extends Component {
    @property(Node)
    private mainGun: Node = null;
    @property(Node)
    private motionStreak1: Node = null;
    @property(Node)
    private motionStreak2: Node = null;

    private _radian = 0;
    private _currentState = STATE.NONE_ACTION;
    private _mainMaterial = null;
    private _dataCatchFish = null;
    private _vectorX = null;
    private _vectorY = null;
    private _lastPos = null;
    private _isDie = true;

    onLoad () {
        this.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        this.node.getComponent(BoxCollider2D).enabled = false;
        this._currentState = STATE.NONE_ACTION;
        setOpacity(this.mainGun, 0);
    }

    initData(data){
        setOpacity(this.mainGun, 255);
        this._vectorX = Math.cos(misc.degreesToRadians(this.node.angle));
        this._vectorY = Math.sin(misc.degreesToRadians(this.node.angle));

        this._dataCatchFish = data;
        FishManager1988.instance.setDataFishDrill(this._dataCatchFish);
        this.node.getComponent(BoxCollider2D).enabled = true;
        this._mainMaterial = this.mainGun.getComponent(sp.Skeleton);
        this._isDie = false;
        if(data.isResume){
            this.setupResume(data);
        } else{
            this.setState(STATE.NORMAL);
            this.node.scale = v3(DRILL_CONFIG.SCALE.start, DRILL_CONFIG.SCALE.start, 1);
            tween(this.node)
                .to(0.5, {scale: v3(DRILL_CONFIG.SCALE.normal, DRILL_CONFIG.SCALE.normal, 1)})
                .start();
        }
    }

    setupResume(data){
        gfEventEmitter.instance.emit(EventsCode1988.FISH_LAYER.CREATE_LIST_FISH_FAKE, this._dataCatchFish.DeskStation);
        // -1s anim shake drill
        const timeLost = data.BuildTick ? Math.max(0, (DataStore1988.instance.getTime() - data.BuildTick) / 1000) - 1: 0;
        let curTime = 0;
        const dt = 1/60;
        this._currentState = STATE.NORMAL;
        while(curTime <= timeLost){
            this.updatePosition(dt, true);
            curTime += dt;
        }
    }

    applyHitColor() {
        if (this._mainMaterial) {
            this._mainMaterial.color = DRILL_CONFIG.HIT_COLOR;
        }
    }

    resetColor() {
        if (this._mainMaterial) {
            this._mainMaterial.color = new Color(255, 255, 255, 255);
        }
    }

    onMoveToPlayer(startPos, endPos, angle, callback){
        this._currentState = STATE.NONE_ACTION;
        this.motionStreak1.active = false;
        this.motionStreak2.active = false;
        this.node.angle = angle;
        this.node.scale = v3(DRILL_CONFIG.SCALE.start, DRILL_CONFIG.SCALE.start, 1);
        this.node.setPosition(startPos);
        tween(this.node)
            .delay(0)
            .call(()=>{
                setOpacity(this.mainGun, 255);
            })
            .delay(0.85)
            .parallel(
                tween().to(1, {position: endPos}, {easing: 'sineIn'}),
                tween().to(0.35, {scale: v3(DRILL_CONFIG.SCALE.medium, DRILL_CONFIG.SCALE.medium, 1)})
                    .to(0.65, {scale: v3(DRILL_CONFIG.SCALE.start, DRILL_CONFIG.SCALE.start, 1)})
            )
            .delay(0.58)
            .call(()=>{
                callback && callback();
            })
            .removeSelf()
            .call(()=>{
                this.node.removeFromParent();
                this.node.destroy();
            })
            .start();
    }

    playAnimDrillFire(){
        this.motionStreak1.active = true;
        this.motionStreak2.active = true;
        const motionStreak1 = this.motionStreak1.getComponent(MotionStreak);
        const motionStreak2 = this.motionStreak2.getComponent(MotionStreak);
        motionStreak1.stroke = 0;
        motionStreak2.stroke = 0;
        tween(motionStreak1)
            .to(1.5, {stroke: 110})
            .start();
        tween(motionStreak2)
            .to(1.5, {stroke: 85})
            .start();

        this.mainGun.getComponent(sp.Skeleton).setAnimation(0, "fire", true);
    }

    playAnimDrillSlowdown(){
        const motionStreak1 = this.motionStreak1.getComponent(MotionStreak);
        const motionStreak2 = this.motionStreak2.getComponent(MotionStreak);
        tween(motionStreak1)
            .to(this._caculateTimeTweenOffMotion(), {stroke: 0})
            .start();
        tween(motionStreak2)
            .to(this._caculateTimeTweenOffMotion(), {stroke: 0})
            .start();
    }

    playRotation() {
        const lastPos = v3(640, 360, 1);
        const moveTime = 1.0
        this.removeAllTween();
        Tween.stopAllByTarget(this.node);
        this.resetColor();
        let amplitude = 5;
        let timeOneStep = 4;
        tween(this.node)
        .parallel(
            tween().to(moveTime, {position: lastPos}),
            tween().to(moveTime, {angle: 0}),
            tween().to(moveTime / 3, {scale: v3(DRILL_CONFIG.SCALE.high, DRILL_CONFIG.SCALE.high, 1)})
            .to(moveTime * 2 / 3, {scale: v3(DRILL_CONFIG.SCALE.normal, DRILL_CONFIG.SCALE.normal, 1)})
        )
        .repeat(3, 
            tween().parallel(
                tween().by(0.85, {angle: -360}),
                tween().call(()=> {
                    this.playShakeDrill({
                        timeOneStep: timeOneStep / 100,
                        amplitude: amplitude,
                        countStep: 3,
                        nodePlay: this.node,
                    });
                }),
                tween().call(()=> {
                    amplitude += 3;
                    timeOneStep--;
                    Emitter.instance.emit(EventsCode1988.FISH_LAYER.CREATE_CIRCLE_FISH, this._dataCatchFish.DeskStation);
                }),
            ))
        .parallel(
            tween().to(0.6, {scale: v3(DRILL_CONFIG.SCALE.normal, DRILL_CONFIG.SCALE.medium, 1)}), 
            tween().call(()=> {
                    this.playShakeDrill({
                        timeOneStep: 0.02,
                        amplitude: 6,
                        countStep: 2,
                        nodePlay: this.node,
                    });
                }),
            )   
        .call(()=>{
            this._currentState = STATE.EXPLOSION;
            this.playAnimStateExplosion();
            })
        .start();
    }

    playAnimDrillDamaged(){
        this.mainGun.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
        if(!this._dataCatchFish.isResume){
            gfEventEmitter.instance.emit(EventsCode1988.FISH_LAYER.CREATE_LIST_FISH_FAKE, this._dataCatchFish.DeskStation);
        }
        tween(this.node)
            .parallel(
                tween().by(2, {angle: 360}),
                tween().repeat( 2, 
                    tween()
                        .call(()=>{
                            this.playAnimHit(0.5);
                        })
                        .to(0.5, {scale: v3(DRILL_CONFIG.SCALE.medium, DRILL_CONFIG.SCALE.medium, 1)})
                        .to(0.5, {scale: v3(DRILL_CONFIG.SCALE.normal, DRILL_CONFIG.SCALE.normal, 1)})
                )
            )
            .repeatForever()
            .start();      
    }

    playAnimHit(duration = 0.1){
        tween(this.mainGun)
            .call(()=>{
                this.applyHitColor();
            })
            .delay(duration)
            .call(()=>{
                this.resetColor();
            })
            .delay(duration)
            .start();
    }

    playAnimStateExplosion(){
        this.removeAllTween();
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .call(()=>{
                this.applyHitColor();
                gfEventEmitter.instance.emit(EventsCode1988.EFFECT_LAYER.DRILL_EXPLOSION, { nodeDrill: this.node, deskStation: this._dataCatchFish.DeskStation });
            })
            .delay(0.55)
            .call(()=>{
                gfEventEmitter.instance.emit(EventsCode1988.FISH_LAYER.CATCH_FISH_BY_SKILL, this._dataCatchFish);
                setOpacity(this.mainGun, 0);
            })
            .delay(1)
            .call(()=>{
                gfEventEmitter.instance.emit(EventsCode1988.EFFECT_LAYER.PLAY_EFFECT_BIGWIN, this._dataCatchFish);
                gfEventEmitter.instance.emit(EventsCode1988.EFFECT_LAYER.REMOVE_DRILL, { nodeDrill: this.node, deskStation: this._dataCatchFish.DeskStation });
                this._isDie = true;
                this.node.removeFromParent();
                this.node.destroy();
            })
            .start();
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
    
    

    update(dt) {
        if(this._currentState == STATE.EXPLOSION || this._currentState == STATE.NONE_ACTION || this._isDie || this._currentState == STATE.ROTATION) return;
        if (this._lastPos) {
            this.updatePosition(dt);
            if(this._currentState == STATE.NORMAL || this._currentState == STATE.NORMAL_SLOWDOWN)
                this.node.angle = getRotation(this.node.getPosition(), this._lastPos);
        }
        this._lastPos = this.node.getPosition();
    }

    setState(nextState){
        if(nextState == this._currentState) return;
        switch(nextState){
        case STATE.NORMAL:
            this.playAnimDrillFire();
            break;
        case STATE.NORMAL_SLOWDOWN:
            this.playAnimDrillSlowdown();
            break;
        case STATE.DAMAGED:
            this.playAnimDrillDamaged();
            break;
        case STATE.ROTATION:
            this.playRotation();
            this.node.getComponent(BoxCollider2D).enabled = false;
            break;    
        case STATE.EXPLOSION:
            this.node.getComponent(BoxCollider2D).enabled = false;
            this.playAnimStateExplosion();
        }
        this._currentState = nextState;
    }

    _caculateTimeTweenOffMotion(){
        const radian = Math.PI / 2;
        const time = (radian / 0.8);

        return time;
    }

    caculateMultipleSpeedAndState(dt){
        let nextState = this._currentState;
        let multipleSpeed = 1 + Math.sin(this._radian);
        multipleSpeed = (multipleSpeed > DRILL_CONFIG.MAX_SPEED) ? DRILL_CONFIG.MAX_SPEED 
            :  (multipleSpeed < DRILL_CONFIG.MIN_SPEED) ? DRILL_CONFIG.MIN_SPEED : multipleSpeed;
        switch(this._currentState){
        case STATE.NORMAL:
            if(this._radian >= Math.PI / 2 ) {
                nextState = STATE.NORMAL_SLOWDOWN;
            }
            else{
                this._radian += dt;
            }
            break;
        case STATE.NORMAL_SLOWDOWN:
            if(this._radian >= Math.PI){
                nextState = STATE.DAMAGED;
            }
            else{
                this._radian += dt;
            }
            break;
        case STATE.DAMAGED:
                if(this._radian >= Math.PI * 1.5){
                    nextState = STATE.ROTATION;
                }
                else{
                    this._radian += dt;
                }
                break;
        case STATE.ROTATION:
            if(this._radian >= Math.PI * 5){
                nextState = STATE.EXPLOSION;
            }
            else{
                this._radian += dt;
            }
            break;
        }
        return { nextState, multipleSpeed };
    }

    updatePosition(dt, isResume = false){
        const { nextState, multipleSpeed } = this.caculateMultipleSpeedAndState(dt);
        let isCollision = false;
        let delta = dt * DRILL_CONFIG.SPEED * multipleSpeed;
        
        const SceneBox = Config1988.instance.SceneBox;
        if (this.node.position.x > SceneBox.Right) {
            this._vectorX *= -1;
            this.node.position.x = SceneBox.Right;
            gfEventEmitter.instance.emit(EventsCode1988.COMMON.SHAKE_SCREEN, { 
                timeOneStep: 0.05, 
                amplitude: 10 ,
                countStep: 1, 
                shakeStyle: Config1988.instance.SHAKE_SCREEN_STYLE.HORIZONTAL
            });
            isCollision = true;
        } else if (this.node.position.x < SceneBox.Left) {
            this._vectorX *= -1;
            this.node.position.x = SceneBox.Left;
            gfEventEmitter.instance.emit(EventsCode1988.COMMON.SHAKE_SCREEN, { 
                timeOneStep: 0.05, 
                amplitude: 10 , 
                countStep: 1,
                shakeStyle: Config1988.instance.SHAKE_SCREEN_STYLE.HORIZONTAL
            });
            isCollision = true;
        }
        if (this.node.position.y > SceneBox.Top) {
            this._vectorY *= -1;
            this.node.position.y = SceneBox.Top;
            gfEventEmitter.instance.emit(EventsCode1988.COMMON.SHAKE_SCREEN, { 
                timeOneStep: 0.05, 
                amplitude: 10 , 
                countStep: 1,
                shakeStyle: Config1988.instance.SHAKE_SCREEN_STYLE.VERTICAL
            });
            isCollision = true;
        } else if (this.node.position.y < SceneBox.Bottom) {
            this._vectorY *= -1;
            this.node.position.y = SceneBox.Bottom;
            gfEventEmitter.instance.emit(EventsCode1988.COMMON.SHAKE_SCREEN, { 
                timeOneStep: 0.05, 
                amplitude: 5 , 
                countStep: 1,
                shakeStyle: Config1988.instance.SHAKE_SCREEN_STYLE.VERTICAL
            });
            isCollision = true;
        }
        this.node.position.x += this._vectorX * delta;
        this.node.position.y += this._vectorY * delta;
        
        if(isCollision){
            if(!isResume){
                this.playAnimHit();
                let haveTrail = true;
                if(this._currentState == STATE.DAMAGED || this._currentState == STATE.EXPLOSION){
                    haveTrail = false;
                }
                gfEventEmitter.instance.emit(EventsCode1988.SOUND.DRILL_HIT_WALL, haveTrail);
            }
            this.setState(nextState);
        }
    }

    onCollisionEnter(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        let fish = other.getComponent(gfBaseFish);
        if(!fish) return;
        const { fishInfo, index } = this.getFishByID(fish.getId()
        );
        if(fishInfo){    
            const randomDie = getRandomInt(1, 100);
            if(randomDie <= RATIO_DIE){
                this._dataCatchFish.ListFish.splice(index, 1);
                const data = deepCopy(this._dataCatchFish);
                data.ListFish = [fishInfo];
                gfEventEmitter.instance.emit(EventsCode1988.FISH_LAYER.CATCH_FISH_BY_SKILL, data);
            }
        } 
    }

    getFishByID(ID){
        for(let i = 0; i < this._dataCatchFish.ListFish.length; ++i){
            const fishInfo = deepCopy(this._dataCatchFish.ListFish[i]);
            if(+fishInfo.FishID == +ID){
                return { fishInfo, index: i };
            } 
        }
        return { fishInfo: null, index: undefined };
    }

    setDie(){
        this._isDie = true;
    }

    removeAllTween(){
        Tween.stopAllByTarget(this.motionStreak1.getComponent(MotionStreak));
        Tween.stopAllByTarget(this.motionStreak2.getComponent(MotionStreak));
        Tween.stopAllByTarget(this.node);
        Tween.stopAllByTarget(this.mainGun);
    }
}


