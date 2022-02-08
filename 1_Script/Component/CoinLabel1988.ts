import { Label, _decorator } from 'cc';
import { gfCoinLabel } from '../../../cc30-fishbase/Scripts/Components/gfCoinLabel';
const { ccclass, property } = _decorator;

@ccclass('CoinLabel1988') 
export class CoinLabel1988 extends gfCoinLabel {

    @property(Label)
    myTxt: Label = null;
    @property(Label)
    otherTxt: Label = null;

    initAssets(isMe) {
        this.myTxt.node.active = !!isMe;
        this.otherTxt.node.active = !isMe;
    }

    setString(value) {
        this.myTxt.string = value;
        this.otherTxt.string = value;
    }
};