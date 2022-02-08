import GameConfig from '../../Common/Config1988';
import { _decorator, Node, UITransform } from 'cc';
import { gfNotifyItemStack } from '../../../../cc30-fishbase/Scripts/Components/gfNotifyItemStack';
import { v3f } from '../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';

const {ccclass, property} = _decorator;
@ccclass('NotifyItemStack1988')
export class NotifyItemStack extends gfNotifyItemStack {
    @property(Node) 
    vipIcon: Node = null;

    initObj(index) {
        this._index = index;
        this._config = {
            SPACING: 5,
            HEIGHT: this.node.getComponent(UITransform).height,
            WIDTH: this.node.getComponent(UITransform).width,
            TIME_MOVE: 0.25,
        };
        this.reset();
        this.extendInit();
    }

    extendInit() {
        this._iconPrefix = "Avatar_";
    }

    updateData(dataInput) {
        super.updateData(dataInput);
        let {RoomKind, data} = dataInput;
        //this.vipIcon.active = RoomKind && (RoomKind !== GameConfig.instance.RoomKind.Normal);
        let spriteFrameIcon = this.atlasIconFish.getSpriteFrame(this._iconPrefix + data.itemKind);
        this.iconImage.node.scale = v3f(1.0);
        if(!spriteFrameIcon) {
            spriteFrameIcon =  this.atlasIconFish.getSpriteFrame("Avatar_chip");
            this.iconImage.node.scale = v3f(0.8);
        } 
        this.iconImage.spriteFrame = spriteFrameIcon;
    }
}
