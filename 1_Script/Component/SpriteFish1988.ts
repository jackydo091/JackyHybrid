
import { gfBaseFish } from '../../../cc30-fishbase/Scripts/Components/Fishes/gfBaseFish';
import { _decorator, Node, Animation, Sprite, BoxCollider2D, Color, Collider2D, Contact2DType, Tween, tween, ParticleSystem2D } from 'cc';
import { call, delay, fadeOut, scaleTo, stopAllActions, v3f } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import GameConfig from '../../../cc30-fishbase/Scripts/Config/gfBaseConfig';
import DataStore1988 from '../Common/DataStore1988';
import { PoisonEffect1988 } from './PoisonEffect1988';
import PoolManager1988 from '../Common/PoolManager1988';
import { setOpacity } from '../../../../cc-common/cc-share/common/utils';
import { gfSpriteFish } from '../../../cc30-fishbase/Scripts/Components/Fishes/gfSpriteFish';
const { ccclass, property } = _decorator;
const COLLIDER_POISON_TAG = 1001;

@ccclass('SpriteFish1988')
export class SpriteFish1988 extends gfSpriteFish {

    private poisonEffect: PoisonEffect1988 = null;
    private _isFake = false;

    onLoad() {
        this.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }

    initFishData(data) {
        super.initFishData(data);
        this._isFake = data.isFake;
        const { FISH_KIND } = GameConfig.instance;
        if (this.getKind() === FISH_KIND.BOMB || DataStore1988.instance.isPlayingPoison) {
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

    update(dt) {
        super.update(dt);
        if(this.poisonEffect) {
            this.updatePoisonPosition();
        }
    }

    onCollisionEnter (self: Collider2D, other: Collider2D) {
        if(other.tag == COLLIDER_POISON_TAG) {
            this.playPoisonEffect();
        }
    }

    isAvailable() {
        return !this.checkDie() && !this.checkOutScene() && !this.isFake();
    }

    isFake(){
        return this._isFake;
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
        
        if(data.isSkill && data.skillID == GameConfig.instance.FISH_KIND.BOMB){
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

