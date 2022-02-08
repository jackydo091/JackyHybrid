
import { _decorator, Component, Node, Label, SpriteFrame, Sprite, instantiate, Vec3, Prefab, error, UITransform, Mask, Button, UI } from 'cc';
import { GfBaseCellHistory } from "../../../../cc30-fishbase/Scripts/Components/Popup/PopupHistoryJackpot/gfBaseCellHistory";
import { addZero, formatMoney, formatUserName } from '../../../../../cc-common/cc-share/common/utils';
import { InfoJackpotCellHistory1988 } from './InfoJackpotCellHistory1988';
import gfEventEmitter from '../../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import gfBaseEvents from '../../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
const { ccclass, property } = _decorator;

@ccclass('JackpotCellHistory1988')
export class JackpotCellHistory1988 extends GfBaseCellHistory {
    _isShow: boolean = false;

    updateData(data) {
        if(!data) return;
        const infoUser = data.pl[0];
        this.bet.getComponent(Label).string = formatMoney(infoUser.betAmt);
        this.winAmount.getComponent(Label).string = formatMoney(data.jpAmt);
        this.account.getComponent(Label).string = formatUserName(infoUser.dn);
        this.time.getComponent(Label).string = this._formatTime(data.time);
    }

    _formatTime(ts) {
        const d = new Date(ts);
        return addZero(d.getDate()) + '/' + addZero(d.getMonth()+1) + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds());
    }
}
