
import { _decorator, Component, Node } from 'cc';
import { GfWifiStatus } from '../../../cc30-fishbase/Scripts/Components/gfWifiStatus';
const { ccclass, property } = _decorator;

@ccclass('WifiStatus1988')
export class WifiStatus1988 extends GfWifiStatus {
    onPingUpdate(ms) {
        super.onPingUpdate(ms);
        this.labelPing.string = this._averagePing + "ms";
    }

    _enableLbl(status) {
        this.ping.active = status;
    }
}
