
import { _decorator, Component, Node, ParticleSystem2D } from 'cc';
import gfNode from '../../../cc30-fishbase/Scripts/Common/gfNode';
import { gfBaseFish } from '../../../cc30-fishbase/Scripts/Components/Fishes/gfBaseFish';
const { ccclass, property } = _decorator;
 
@ccclass('PoisonEffect1988')
export class PoisonEffect1988 extends gfNode {

    unuse() {
        super.unuse();
        this.getComponent(ParticleSystem2D).emissionRate = 5;
    }
}

