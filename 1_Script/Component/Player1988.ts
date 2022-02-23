
import { _decorator, Component, Node, v3, UITransform, sp, Sprite, Animation } from 'cc';
import { gfPlayer } from '../../../cc30-fishbase/Scripts/Components/gfPlayer';
import DataStore1988 from '../Common/DataStore1988';
import { SetZIndex } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import Config1988 from '../Common/Config1988';
import NodePoolConfig1988 from '../Common/NodePoolConfig1988';
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventsCode1988 from '../Common/EventsCode1988';
import { loadAvatarFacebook } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;

const CONFG_Z_INDEX = {
    GUN: 10,
    COUNT_DOWN_SKILL: 20,
    BET: 5
};
@ccclass('Player1988')
export class Player1988 extends gfPlayer {
    @property(Node)
    myGunBackground:Node = null;
    @property(Node)
    gunBackgroundOther:Node = null;
    
    public effectCircleIsMe = null;

    initObj(data): any {
        this.gun.active = true;
        this.gun.getChildByName("Gun").scale = v3(1, 1, 1);
        SetZIndex(this.gun, CONFG_Z_INDEX.GUN);
        this.isMe = data.DeskStation === DataStore1988.instance.getSelfDeskStation();
        this.txtBet.node.active = true;
        SetZIndex(this.txtBet.node, CONFG_Z_INDEX.BET);
        //this.txtBet.node.zIndex = CONFG_Z_INDEX.BET;
        super.initObj(data);
        if(this.isMe){
            this.effectIsMe.setPosition(this.node.getPosition());
        }
        this.updateGunBackGround();
        
    }

    updateAvatar(data){
        if(this.avatarAtlas){
            if(this.avatarAtlas && loadAvatarFacebook){
                if (data.Avatar && data.Avatar.indexOf('Avatar') === 0) {
                    data.Avatar = data.Avatar.replace('Avatar', '');
                }
                loadAvatarFacebook(this.avatar, data.Avatar, this.avatarAtlas, 'avatar_', 2);
            }
        }
    }

    updateGunBackGround(){
        this.gunBackgroundOther.active = !this.isMe;
        this.myGunBackground && (this.myGunBackground.active = this.isMe);
    }

    onUserFire(data) {
        super.onUserFire(data);
        if(this.isMe && this.effectCircleIsMe.active){
            this.effectCircleIsMe.active = false;
        }
    }

    _playEffectFire(gunName?) {
        const spriteGunNode = this.gun.getChildByName('Gun');
        console.warn('spriteGunNode: ', spriteGunNode);
        
        if (spriteGunNode) {
            if (!gunName) gunName = `gun${this.getGunIndex() + 1}`;
            this.setIsGunSkill(Object.values(Config1988.instance.GunSkill).indexOf(gunName) > -1);

            spriteGunNode.getComponent(Sprite).spriteFrame = this.gunSprite[gunName];
            spriteGunNode.getComponent(Animation).play();
            console.warn("Animation: ", spriteGunNode.getComponent(Animation));
            
        }
    }

    resetGunDrillToNormal(){
        if(this.isMe){
            DataStore1988.instance.setSelfInfo({ isLockGun: false, currentSkillID: -1});
            DataStore1988.instance.setDataStore({
                targetState: Config1988.instance.TARGET_LOCK.NONE,
                currentTargetState: Config1988.instance.TARGET_LOCK.NONE,
            });
            gfEventEmitter.instance.emit(EventsCode1988.GAME_LAYER.INTERACTABLE_HUD, true);
            gfEventEmitter.instance.emit(EventsCode1988.GAME_LAYER.RESUME_OLD_TARGET);
        }
        this.gun.active = true;
        SetZIndex(this.txtBet.node, CONFG_Z_INDEX.BET);
        this.gun.getChildByName("Gun").setScale(v3(1, 1, 1));
        this._updateGun();
    }
    
    resetOnExit(){
        super.resetOnExit();
        this.gun.active = false;
        this.txtBet.node.active = false;
    }
}
