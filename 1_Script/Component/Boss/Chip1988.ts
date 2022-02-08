import {_decorator, Component, Node, SpriteFrame, v3, UIOpacity, tween, isValid, Sprite, warn, sp} from 'cc';
import GameConfig from "../../Common/Config1988";
import {isPointInScreen} from "../../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import {getRandomInt, setOpacity} from '../../../../../cc-common/cc-share/common/utils';
import {fadeOut, stopAllActions} from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";

const {ccclass, property} = _decorator;
const ANIM_EFFECT_DROP_CHIP_OTHER_PLAYER = "Chip_Xanh";
const ANIM_EFFECT_DROP_CHIP_MY_PLAYER = "Chip_Cam";

@ccclass('Chip1988')
export class Chip1988 extends Component {
    @property(Node)
    private nodeMain: Node = null;
    @property(Node)
    private effectDropChip: Node;
    @property(SpriteFrame)
    arrSpriteFrameChip: Array<SpriteFrame> = [];

    onLoad () {
        this.node['onChipFlyToPlayer'] = this.onChipFlyToPlayer.bind(this);
    }

    onChipFlyToPlayer(pos, index, isMe = false, callback) {
        this.nodeMain.active = true;
        this.nodeMain.scale.set(v3(0));
        this.effectDropChip.active = true;
        setOpacity(this.effectDropChip, 0);
        let opacity = 255;
        this.effectDropChip.scale.set(v3(0, 0, 1));
        this.setupSpriteChip(isMe);
        this.setupAnimEffectDropChip(isMe);
        const appearTime = 0.25;
        const moveTime = 0.5;
        const standTime = 0.75;
        const dest = this.calculateMovePoint();
        const tweenEffect = tween(this.effectDropChip).to(appearTime, {scale: v3(1.2, 1.2, 1)});
        const tweenEffect1 = tween(this.effectDropChip.getComponent(UIOpacity)).to(appearTime, {opacity: 255});

        const tweenMainItem = tween(this.nodeMain).to(appearTime, {scale: v3(1, 1, 1)});
        const tweenEffect2 = tween(this.effectDropChip).to(moveTime, {scale: v3(1.2, 1.2, 1)});
        const tweenMainItem2 = tween(this.nodeMain).to(moveTime, {scale: v3(1.5, 1.5, 1)});
        tweenEffect.start();
        tweenEffect1.start();
        tweenMainItem.start();
        tween(this.node)
            .to(appearTime, {position: dest})
            .delay(standTime)
            .call(() => {
                tweenEffect2.start();
                tweenMainItem2.start();
            })
            .delay(index * 0.25)
            .to(moveTime, {position: pos, scale: v3(0.3, 0.3, 1)}, {easing: "cubicOut"})
            .then(fadeOut(0.5))
            .removeSelf()
            .call(() => {
                callback && callback();
                if (isValid(this.node))
                    this.node.destroy();
            })
            .start();
    }


    setupSpriteChip(isMe) {
        const spriteFrame = isMe ? this.arrSpriteFrameChip[0] : this.arrSpriteFrameChip[1];
        if (!spriteFrame) {
            warn("Chip1988 setSpriteChip can not find spriteFrame, maybr missing data in prefab");
            return;
        }
        this.nodeMain.getComponent(Sprite).spriteFrame = spriteFrame;
    }


    setupAnimEffectDropChip(isMe) {
        const spine = this.effectDropChip.getComponent(sp.Skeleton);
        const animationName = isMe ? ANIM_EFFECT_DROP_CHIP_MY_PLAYER : ANIM_EFFECT_DROP_CHIP_OTHER_PLAYER;
        spine.setAnimation(0, animationName, true);
    }


    calculateMovePoint() {
        let x = this.node.position.x;
        let y = this.node.position.y;
        let pos = v3(this.node.position.x, GameConfig.instance.AppSize.Height / 2, 1);
        while (!isPointInScreen(pos)) {
            pos.x = pos.x < GameConfig.instance.AppSize.Width / 2 ? pos.x + 150 : pos.x - 150;
        }
        x = pos.x;
        pos = v3(GameConfig.instance.AppSize.Width / 2, this.node.position.y);

        while (!isPointInScreen(pos)) {
            pos.y = pos.y < GameConfig.instance.AppSize.Height / 2 ? pos.y + 150 : pos.y - 150;
        }
        let randX = getRandomInt(-100, 100);
        let randY = getRandomInt(-100, 100);
        randX = randX >= 0 ? randX + 100 : randX - 100;
        randY = randY >= 0 ? randY + 100 : randY - 100;
        return v3(x + randX, y + randY, 1);
    }


    onStopAllActions() {
        stopAllActions(this.node);
        stopAllActions(this.effectDropChip);
        stopAllActions(this.nodeMain);
    }


    onDestroy() {
        this.onStopAllActions();
    }
}

