
import { _decorator, ToggleContainer,PageView, Node, Vec3} from 'cc';
import { GfPopupInfo } from '../../../cc30-fishbase/Scripts/Components/Popup/gfPopupInfo';
const { ccclass, property } = _decorator;
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import  GameConfig  from '../Common/Config1988';


@ccclass('PopupInfo1988')
export class PopupInfo1988 extends GfPopupInfo {

    @property(ToggleContainer)
    private toggleContainer: ToggleContainer = null;
    @property(PageView)
    private lstPageView : PageView[] = [];
    
    @property(Node)
    viewInfo: Node;

    update() {
        this.viewInfo.position = new Vec3(0, 0, 1);
    }

    public initObj() {
        if (this.getInitialized()) {
            return;
        }
        super.initObj();
    };

    show(){
        super.show();
        this.resetInfo();
        this.setInitialized(true);
    };

    resetInfo() {
        this.toggleContainer.toggleItems[0].isChecked = true;
        this.toggleContainer.toggleItems[0].interactable = false;
        for(let i = 0; i < this.toggleContainer.toggleItems.length - 1; ++i){
            const toggle = this.toggleContainer.toggleItems[i];
            if(i == 0){
                toggle.isChecked = true;
                toggle.interactable = false;
            }
            else{
                toggle.interactable = true;
            }
        }
    };

    hide(animStyle = GameConfig.instance.POPUP_ANIMATION.DEFAULT) {
        super.hide(animStyle);
        this.setInitialized(false);
    };

    onClose() {
        super.onClose();
    };
}


