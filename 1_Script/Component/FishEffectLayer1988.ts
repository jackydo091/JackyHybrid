
import { _decorator, Component, Node } from 'cc';
import ReferenceManager1988 from '../Common/ReferenceManager1988';
const { ccclass, property } = _decorator;
 
@ccclass('FishEffectLayer1988')
export class FishEffectLayer1988 extends Component {


    start () {
        ReferenceManager1988.instance.setData({FishEffectLayer: this.node});
    }
}
