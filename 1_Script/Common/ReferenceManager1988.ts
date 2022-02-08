
import gfReferenceManager from '../../../cc30-fishbase/Scripts/Common/gfReferenceManager';
import { _decorator } from 'cc';
import { Player1988 } from '../Component/Player1988';
const { ccclass, property } = _decorator;


@ccclass('ReferenceManager1988')
export default class ReferenceManager1988 extends gfReferenceManager {
    public static instance: ReferenceManager1988 = null;
    private PanelJackpotLayer: any;
    FishEffectLayer: Node = null;
    constructor () {
        super();
        ReferenceManager1988.instance = this;
        this.PanelJackpotLayer = null;
    }

    public getPanelJackpotLayer(){
        return this.PanelJackpotLayer;
    }
    
    getPlayerByDeskStation(deskStation): Player1988{
        return this.getPlayerLayer().getPlayerByDeskStation(deskStation);
    }

    getFishEffectLayer() {
        return this.FishEffectLayer;
    }

    destroy(){
        ReferenceManager1988.instance = null;
    }
}
