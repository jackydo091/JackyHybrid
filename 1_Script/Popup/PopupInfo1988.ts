
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
    
    private _currentPage = null;
    private _pageIndex = 0;
    private _pageViewEvent = null;

    @property(Node)
    viewInfo: Node;

    update() {
        this.viewInfo.position = new Vec3(0, 0, 1);
    }

    public initObj() {
        if (this.getInitialized()) {
            if (this._pageIndex > 0) {
                this.initPage();
            }
            return;
        }
        super.initObj();
        this.initPage();
    };

    private initPage() {
        this._pageViewEvent = this.pageViewEvent.bind(this);
    };

    show(){
        super.show()
        this._currentPage = this.lstPageView[0];
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
        this._pageIndex = 0;
    };

    pageViewEvent(pageView) {
        this._pageIndex = pageView._curPageIdx;
    };

    onClick(event, data){
        const currentPage = this.lstPageView[Number(data)];
        if(currentPage) {
            this._currentPage = currentPage;
        }
        if(this.getInitialized() && event.isChecked){
            event.interactable = false;
            gfEventEmitter.instance.emit(gfBaseEvents.SOUND.CLICK);
        }
        else if(this.getInitialized() && !event.isChecked){
            event.interactable = true;
        }
    }

    _getMaxItemPerPage() {
        return this._currentPage.content.children.length;
    };


    hide(animStyle = GameConfig.instance.POPUP_ANIMATION.DEFAULT) {
        super.hide(animStyle);
        this.setInitialized(false);
    };

    onClose() {
        super.onClose();
    };
}


