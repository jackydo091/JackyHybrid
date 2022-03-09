import { Component, instantiate, isValid, Prefab, sp, UITransform, _decorator } from "cc";
import { stopAllActions } from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";
import { registerEvent, removeEvents } from "../../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import EventCode from "../../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import Emitter from "../../../../cc30-fishbase/Scripts/Common/gfEventEmitter";
import BaseConfig from "../../../../cc30-fishbase/Scripts/Config/gfBaseConfig";
import { getPostionInOtherNode } from "../../../../../cc-common/cc-share/common/utils";
const { ccclass, property } = _decorator;
const FINISHED = "finished";
const ANI_CRISTICAL = {
    CRISTICAL_R: 'cristicalMiniBossR',
    CRISTICAL_L: 'cristicalMiniBossL'
}
@ccclass('EffectMiniBoss1988')
export class EffectMiniBoss1988 extends Component {
    @property (Prefab)
    finMiniBoss: Prefab;
    @property (Prefab)
    itemMiniboss: Prefab;
    @property (Prefab)
    effHitMiniboss: Prefab;
    @property (Prefab)
    gemMiniBoss: Prefab;
    @property (Prefab)
    criticalMiniBoss: Prefab;
    _lstEffectMiniboss: any[];

    onLoad() {
        this.initEvent();
    }
    initEvent() {
        registerEvent(EventCode.EFFECT_LAYER.MINIBOSS_DROP_ITEM, this.playMiniBossDropItem, this);
        registerEvent(EventCode.EFFECT_LAYER.MINIBOSS_DROP_GEM, this.playMiniBossDropGem, this);
        registerEvent(EventCode.EFFECT_LAYER.MINIBOSS_CRITICAL, this.playCriticalMiniBoss, this);
        registerEvent(EventCode.EFFECT_LAYER.MINIBOSS_DROP_FIN, this.playMiniBossDropFin, this);
        registerEvent(EventCode.COMMON.EXIT_GAME_ROOM, this.resetOnExit, this);
        registerEvent(EventCode.GAME_LAYER.ON_ENTER_GAME_ROOM, this.resetOnExit, this);
    }

    playMiniBossDropFin(dataInput) {
        const { data, fishPos, fishKind } = dataInput;
        const finMiniBoss = instantiate(this.finMiniBoss);
        finMiniBoss.parent = this.node;
        finMiniBoss.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(fishPos);
        const angle: number = Math.random() * 360;
        finMiniBoss.getChildByName("image").angle = angle;
        const animFinDrop = finMiniBoss.getComponent(sp.Skeleton);
        animFinDrop.setAnimation(0, FINISHED, false);
        animFinDrop.setCompleteListener(() => {
            if(!data.isBigWin) {
                Emitter.instance.emit(EventCode.EFFECT_LAYER.PLAY_REWARD_EFFECT, {
                    data,
                    fishKind,
                    fishPos
                });
            }
            finMiniBoss.removeFromParent();
            finMiniBoss.destroy();
        });
        this._lstEffectMiniboss.push(finMiniBoss);
    }

    playCriticalMiniBoss(data) {
        const { worldPos, scaleX } = data;
        const criticalMiniBoss = instantiate(this.criticalMiniBoss);
        criticalMiniBoss.parent = this.node;
        criticalMiniBoss.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        if (scaleX == -1) {
            criticalMiniBoss.getComponent(sp.Skeleton).setAnimation(0,ANI_CRISTICAL.CRISTICAL_R, false);
        } else {
            criticalMiniBoss.getComponent(sp.Skeleton).setAnimation(0, ANI_CRISTICAL.CRISTICAL_L, false);
        }
        const animCrit = criticalMiniBoss.getComponent(sp.Skeleton);
        animCrit.setAnimation(0, FINISHED, false);
        animCrit.setCompleteListener(()=>{
            criticalMiniBoss.removeFromParent();
            criticalMiniBoss.destroy();
        })
        this._lstEffectMiniboss.push(criticalMiniBoss);
    }

    playMiniBossDropGem(dataInput) {
        const {
            data, worldPos, player, fishPos,
        } = dataInput;

        const gem = instantiate(this.gemMiniBoss);
        gem.parent = this.node;
        gem.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        gem.y -= 100;
        const dest = getPostionInOtherNode(this.node, player.node);
        gem.flyGemToPlayer(dest, () => {
            Emitter.instance.emit(EventCode.EFFECT_LAYER.PLAY_REWARD_EFFECT, {
                data,
                fishKind: BaseConfig.instance.FISH_KIND.MINIBOSS,
                fishPos,
                skipUpdateWallet: true,
            });
        });
        this._lstEffectMiniboss.push(gem);
    }

    playMiniBossHitEffect(worldPos) {
        const effHitMiniboss = instantiate(this.effHitMiniboss);
        effHitMiniboss.parent = this.node;
        effHitMiniboss.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        const animEffHit = effHitMiniboss.getComponent(sp.Skeleton);
        animEffHit.setAnimation(0, FINISHED, false);
        animEffHit.setCompleteListener(()=> {
            effHitMiniboss.removeFromParent();
            effHitMiniboss.destroy();
        });
        this._lstEffectMiniboss.push(effHitMiniboss);
    }

    playMiniBossDropItem(data) {
        const {
            itemName, worldPos, player, scaleX, GoldReward, isBigWin, ignoreItem,
        } = data;
        this.playMiniBossHitEffect(worldPos);
        if (ignoreItem) return;
        const item = instantiate(this.itemMiniboss);
        item.parent = this.node;
        item.position = this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        item.y -= 100;
        const pos = getPostionInOtherNode(this.node, player.node);
        item.flyItemToPlayer({
            item: itemName,
            pos,
            scaleX,
            playerIndex: player.index,
            GoldReward,
            isBigWin,
        });
        this._lstEffectMiniboss.push(item);
    }

    resetOnExit() {
        this.unscheduleAllCallbacks();
        this._lstEffectMiniboss.forEach((effect) => {
            stopAllActions(effect);
            effect.removeFromParent(true);
            if (isValid(effect)) {
                effect.destroy();
            }
        });
        this._lstEffectMiniboss.length = 0;
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
        removeEvents(this);
    }
};
