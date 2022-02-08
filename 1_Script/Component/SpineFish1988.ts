import { gfSpineFish } from '../../../cc30-fishbase/Scripts/Components/Fishes/gfSpineFish';
import { _decorator, Node, BoxCollider2D, v2, ParticleSystem, UITransform, v3, tween, ParticleSystem2D, Tween, error, Collider2D, Contact2DType } from 'cc';
import { stopAllActions, v3f, gfMoveByDistance, delay, fadeOut, scaleTo, call } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import EventsCode1988 from '../Common/EventsCode1988';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import GameConfig from '../Common/Config1988';
import DataStore from '../Common/DataStore1988';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import { setOpacity } from '../../../../cc-common/cc-share/common/utils';
import { PoisonEffect1988 } from './PoisonEffect1988';
import PoolManager1988 from '../Common/PoolManager1988';

const COLLIDER_POISON_TAG = 1001;
const { ccclass, property } = _decorator;
@ccclass('SpineFish1988')
export class SpineFish1988 extends gfSpineFish {
    
    poisonEffect: PoisonEffect1988 = null;
    private _isFake = false;

    onLoad() {
        this.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }
    
    initFishData(data) {
        super.initFishData(data);
        this._isFake = data.isFake;
        const { FISH_KIND } = GameConfig.instance;
        if (this.getKind() === FISH_KIND.BOMB || DataStore.instance.isPlayingPoison) {
            this.playPoisonEffect();
        }
    }

    playPoisonEffect() {
        if(this.checkDie() || this.poisonEffect) return;
        this.poisonEffect = PoolManager1988.instance.getPoisonEffect();
        this.poisonEffect.node.setScale(v3f(Math.min(1.0, this.node.getComponent(BoxCollider2D).size.width / 90)));
        this.updatePoisonPosition();
    }

    updatePoisonPosition() {
        const point = this.convertToRelativePoint(this._targetPoint);
        this.poisonEffect.node.setPosition(point.x, point.y, 0);
    }

    onCollisionEnter (self: Collider2D, other: Collider2D) {
        if(other.tag == COLLIDER_POISON_TAG) {
            this.playPoisonEffect();
        }
    }

    update(dt) {
        super.update(dt);
        if(this.poisonEffect) {
            this.updatePoisonPosition();
        }
    }

    onPlayEffectWinInCatchFish(data) {
        Emitter.instance.emit(gfBaseEvents.EFFECT_LAYER.PLAY_REWARD_EFFECT, {
            data,
            fishKind: this.getKind(),
            fishPos: this.getLockPositionByWorldSpace(),
        });
    }

    onCatch(data) {
        //super.onCatch(data);
        if (data.isCheckedFakeBullet === undefined) {
            if (this.needFakeBullet(data)) {
                this.createFakeBullet(data);
                return;
            }
        }
        this.processItemInCatchFish(data);
        this.onPlayEffectWinInCatchFish(data);
        stopAllActions(this.node);
        this.resetColor();
        this.setDie(true);
        this.playEffectDie();
        const listAction = tween(this.node);
        if (this.getKind() === GameConfig.instance.FISH_KIND.BOMB) {
            Emitter.instance.emit(gfBaseEvents.EFFECT_LAYER.TRIGGER_BOMB, this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 1)));
            listAction.then(delay(0.3));
            listAction.call(()=>{
                tween(this.fishAnim.node).then(fadeOut(0.3)).start();
            })
            listAction.then(fadeOut(0.3));
        } 
        else if(data.SkillID === GameConfig.instance.SkillConfig.DRILL){
            if(data.DeskStation === DataStore.instance.getSelfDeskStation()) {
                DataStore.instance.setSelfInfo({ isLockGun: true, skillLock: true, currentSkillID: GameConfig.instance.SkillConfig.DRILL });
                DataStore.instance.saveCurrentTarget();
                Emitter.instance.emit(gfBaseEvents.GAME_LAYER.INTERACTABLE_HUD, false);
                Emitter.instance.emit(gfBaseEvents.COMMON.RESET_TOUCH_LISTENER);
                Emitter.instance.emit(gfBaseEvents.GAME_LAYER.RECEIVE_LASER_GUN, data.DeskStation);
            }
            Emitter.instance.emit(EventsCode1988.EFFECT_LAYER.DROP_GUN_DRILL, { fishPos: this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 1)), deskStation: data.DeskStation });
            listAction.then(delay(0.5));
            listAction.then(scaleTo(0.2, 0, 0));
        }
        else if (data.SkillID === GameConfig.instance.SkillConfig.LASER) {
            if (data.DeskStation === DataStore.instance.getSelfDeskStation()) {
                DataStore.instance.setSelfInfo({ isLockGun: true, skillLock: true, currentSkillID: GameConfig.instance.SkillConfig.LASER });
                DataStore.instance.saveCurrentTarget();
                Emitter.instance.emit(gfBaseEvents.GAME_LAYER.INTERACTABLE_HUD, false);
                Emitter.instance.emit(gfBaseEvents.COMMON.RESET_TOUCH_LISTENER);
                Emitter.instance.emit(gfBaseEvents.GAME_LAYER.RECEIVE_LASER_GUN, data.DeskStation);
            }
            Emitter.instance.emit(gfBaseEvents.EFFECT_LAYER.DROP_GUN_LASER, { fishPos: this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 1)), deskStation: data.DeskStation });
            listAction.then(delay(0.5));
            listAction.then(scaleTo(0.2, 0, 0));
        } else if(data.isSkill && data.skillID == GameConfig.instance.FISH_KIND.BOMB){
            listAction.then(tween().call(()=>{
                this.changeAnimationSpeed(6);
            }));
            listAction.then(delay(0.5));
            listAction.then(call(()=>{
                if(this.poisonEffect) {
                    this.poisonEffect.getComponent(ParticleSystem2D).emissionRate = 0;
                }
            }));
            listAction.then(scaleTo(1, 0));
        }
        else {
            listAction.then(delay(1));
            listAction.call(()=>{
                tween(this.fishAnim.node).then(fadeOut(0.5)).start();
            })
            listAction.then(fadeOut(0.5));
        }
       
        listAction.then(call(() => { this.onDie(); }));
        listAction.start();
    }

    isAvailable() {
        return !this.checkDie() && !this.checkOutScene() && !this.isFake();
    }

    isFake(){
        return this._isFake;
    }

    moveOut(delayTime) {
        if(!delayTime) {
            delayTime = 0.0;
        }
        if (this.checkDie()) return;
        if(this.checkOutScene()) {
            this.onDie();
            return;
        }
        tween(this.node)
            .delay(delayTime)
            .then(gfMoveByDistance(8, GameConfig.instance.AppSize.Width * 1.5))
            .call(()=>{
                this.onDie();
            })
            .start()
    }

    unuse() {
        super.unuse();
        Tween.stopAllByTarget(this.fishAnim.node);
        setOpacity(this.fishAnim.node, 255); 
        if(this.poisonEffect) {
            this.poisonEffect.returnPool();
            this.poisonEffect = null;
        }
    }

}
