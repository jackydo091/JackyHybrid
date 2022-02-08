
import { _decorator, ToggleContainer,PageView ,Button, Node, v3, Vec3, error} from 'cc';
import { GfPopupInfo } from '../../../cc30-fishbase/Scripts/Components/Popup/gfPopupInfo';
const { ccclass, property } = _decorator;
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import  GameConfig  from '../Common/Config1988';
import { v3f } from '../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';


@ccclass('PopupInfo1988')
export class PopupInfo1988 extends GfPopupInfo {

    @property(ToggleContainer)
    private toggleContainer: ToggleContainer = null;
    @property(PageView)
    private lstPageView : PageView[] = [];
    
    private _currentPage = null;
    private _pageIndex = 0;
    private _pageViewEvent = null;

    @property(Button)
    buttonNext: Button;
    @property(Button)
    buttonPreview: Button;
    @property(Button)
    buttonEnd: Button;
    @property(Button)
    buttonBegin: Button;
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
        this.lstPageView.forEach((pageView)=>{
            pageView.node.on('page-turning', this._pageViewEvent.bind(this));
        })
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
        this.onResetScrollView();
    };

    pageViewEvent(pageView) {
        this._pageIndex = pageView._curPageIdx;
        this._updateButtons();
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
        this.onResetScrollView();
    }

    onResetScrollView(){
        this._pageIndex = 0;
        this.lstPageView.forEach((pageView) => {
            pageView.scrollToPage(0,0);
        });
        this._updateButtons();
    };

    onNext() {
        let numberItemPerPage = this._getMaxItemPerPage();
        numberItemPerPage--;
        if(this._pageIndex >= numberItemPerPage) {
            this._pageIndex = numberItemPerPage;
            return;
        }
        this._pageIndex++;
        this._currentPage.scrollToPage(this._pageIndex);
        this._updateButtons();
        if(this.getInitialized()){
            gfEventEmitter.instance.emit(gfBaseEvents.SOUND.CLICK);
        }
    };

    onPreview() {
        if(this._pageIndex < 0) {
            this._pageIndex = 0;
            return;
        }
        this._pageIndex--;
        this._currentPage.scrollToPage(this._pageIndex);
        this._updateButtons();
        if(this.getInitialized()){
            gfEventEmitter.instance.emit(gfBaseEvents.SOUND.CLICK);
        }
    };

    _getMaxItemPerPage() {
        return this._currentPage.content.children.length;
    };

    onEnd() {
        if(this._currentPage) {
            this._pageIndex = this._getMaxItemPerPage();
            this._pageIndex--;
            this._currentPage.scrollToPage(this._pageIndex);
        }
        this._updateButtons();
        if(this.getInitialized()){
            gfEventEmitter.instance.emit(gfBaseEvents.SOUND.CLICK);
        }

    };

    onBegin() {
        if(this._currentPage) {
            this._pageIndex = 0;
            this._currentPage.scrollToPage(0);
        }
        this._updateButtons();
        if(this.getInitialized()){
            gfEventEmitter.instance.emit(gfBaseEvents.SOUND.CLICK);
        }
    };

    _updateButtons() {
        const { buttonBegin, buttonPreview, buttonEnd, buttonNext, _pageIndex } = this;
        let numberItemPerPage = this._getMaxItemPerPage();
        numberItemPerPage--;
        if(numberItemPerPage === 0) {
            buttonBegin.interactable = false;
            buttonPreview.interactable = false;
            buttonEnd.interactable = false;
            buttonNext.interactable = false;
        }else if(_pageIndex === 0) {
            buttonBegin.interactable = false;
            buttonPreview.interactable = false;
            buttonEnd.interactable = true;
            buttonNext.interactable = true;
        } else if(_pageIndex === numberItemPerPage) {
            buttonBegin.interactable = true;
            buttonPreview.interactable = true;
            buttonEnd.interactable = false;
            buttonNext.interactable = false;
        } else {
            buttonBegin.interactable = true;
            buttonPreview.interactable = true;
            buttonEnd.interactable = true;
            buttonNext.interactable = true;
        }
    };

    hide(animStyle = GameConfig.instance.POPUP_ANIMATION.DEFAULT) {
        super.hide(animStyle);
        this.setInitialized(false);
    };

    onClose() {
        super.onClose();
        this.lstPageView.forEach((pageView)=> {
            pageView.node.off('page-turning', this._pageViewEvent, this);
        });
    };
}


