import { _decorator, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { GfBaseHistory } from '../../../../cc30-fishbase/Scripts/Components/Popup/PopupHistoryJackpot/gfBaseHistory'

@ccclass('JackpotHistory1988')
export class JackpotHistory1988 extends GfBaseHistory {

    @property(Node)
    private viewTable: Node = null;

    playLoading(){
        this.loading.active = true;
    };

    stopLoading(){
        this.loading.active = false;
    };
}
