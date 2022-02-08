import GameConfig from '../../Common/Config1988';
import { _decorator, warn } from 'cc';
import { GfNotifyStack } from '../../../../cc30-fishbase/Scripts/Components/gfNotifyStack';

const {ccclass, property} = _decorator
@ccclass('NotifyStack1988')
export class NotifyStack1988 extends GfNotifyStack {
    SPECIAL_SKILL: any;

    extendInit() {
        this.SPECIAL_SKILL = {
            27: {name: "LASER", itemKind : GameConfig.instance.FISH_KIND.LASER_CRAB},
            47: {name: "BOMB", itemKind : GameConfig.instance.FISH_KIND.BOMB},
            46: {name: "DRILL", itemKind : GameConfig.instance.FISH_KIND.DRILL}
        };
        this.NOTIFY_CONFIG.IDLE_TIME = 3;
    }

    formatData(dataInput) {
        if(dataInput.formatted) return true;
        let { data, message, type } = dataInput;
        let format = this.NOTIFY_FORMAT[type];
        if (format) {
            let userName = data[format.userName];
            let itemKind = data[format.itemKind];
            if(type === this.NOTIFY_TYPE.SPECIAL_SKILL){
                itemKind = this.SPECIAL_SKILL[data[format.itemKind]].itemKind;
            }
            let goldReward = data[format.goldReward];
            let newData = {
                userName,
                itemKind,
                goldReward
            };
            dataInput.data = newData;
            dataInput.formatted = true;
            return true;
        }
        warn('Invalid message:', dataInput);
        return false;
    }

}
