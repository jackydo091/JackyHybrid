import {_decorator, Component, Node, warn} from 'cc';
import {stopAllActions} from "../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";

const {ccclass, property} = _decorator;

@ccclass('PanelComponent1988')
export class PanelComponent1988 extends Component {
    @property(Node)
    protected arrTextJackpot: Array<Node> = [];
    @property(Node)
    protected arrEffectDecryption: Array<Node> = [];

    show() {
        if (this.node.active) return;
        this.node.active = true;
    }

    hide() {
        this.reset();
        if (!this.node.active) return;
        this.node.active = false;
    }


    getDecryptionByID(itemID) {
        return this.arrEffectDecryption[itemID - 1];
    }


    getNodeTextJackPotByID(itemID) {
        const node = this.arrTextJackpot[itemID - 1];
        if (!node) {
            warn("getNodeTextJackPotByID: =>> can not find node Text by ID: " + itemID);
            return null;
        }
        return node;
    }


    resumeData(data) {
    }


    resetAllNodeTextJP() {
    }


    resetArrayDecryption() {
        this.arrEffectDecryption.forEach(node => {
            node && (node.active = false);
        });
    }


    reset() {
        stopAllActions(this.node);
        this.unscheduleAllCallbacks();
        this.resetAllNodeTextJP();
        this.resetArrayDecryption();
    }

}

