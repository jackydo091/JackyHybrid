import { _decorator, Node, v3, Button, tween } from "cc";
import { GfSideMenu } from "../../../cc30-fishbase/Scripts/Common/gfSideMenu";
import EventCode from "../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import { stopAllActions } from "../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";
import { flipX, registerEvent, removeEvents } from "../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import DataStore from "../Common/DataStore1988";
import EventsCode1988 from "../Common/EventsCode1988";

const {ccclass, property } = _decorator;

@ccclass('SideMenu1988')
export class SideMenu1988 extends GfSideMenu {

    @property(Node)
    arrNodeButton: Node[] = [];
    @property({type: Node, visible: false, override: true })
    nodeMove: Node = null;

    onLoad(){
        super.onLoad();
        DataStore.instance.isSideMenuOpened = false;
    }

    initEvents(){
        super.initEvents();
        registerEvent(EventsCode1988.GAME_LAYER.CLOSE_ALL_MENU, this.onClose, this);
    }

    hideSideBar() {
        if (!this.isActionDone)
            return;
        this.unschedule(this.scheduleHide);
        this.isActionDone = false;
        let posX = -19;
        this.isHide = !this.isHide;
        if (this.isHide) {
            posX = this.frameWidth * 1.2;
            DataStore.instance.isSideMenuOpened = false;
        } else {
            flipX(this.iconHide);
            DataStore.instance.isSideMenuOpened = true;
            this.scheduleOnce(this.scheduleHide, 3);
        }
        let baseEasing = this.isHide ? 'sineIn' : 'sineOut';
        //this.nodeMove.stopAllActions();
        this.runActionAllButton(posX, baseEasing);
    }

    onClose(){
        if(!DataStore.instance.isSideMenuOpened) return;
        else{
            this.hideSideBar();
        }
    }

    runActionAllButton(posX, easing){
        for(let i = 0; i < this.arrNodeButton.length; ++i){
            const button = this.arrNodeButton[i];
            button.getComponent(Button).interactable = false;
            tween(button)
                .delay(i * 0.15)
                .to(0.3, { position: v3(posX, button.position.y, button.position.z)}, { easing })
                .call(()=>{
                    if(i == this.arrNodeButton.length - 1){
                        this.isActionDone = true;
                        if(this.isHide){
                            flipX(this.iconHide);
                        }
                        this.arrNodeButton.forEach(node => {
                            node.getComponent(Button).interactable = true;
                        });
                    }
                })
                .start();
        }
    }

    stopActionAllButton(){
        for(let i = 0; i < this.arrNodeButton.length; ++i){
            const button = this.arrNodeButton[i];
            stopAllActions(button);
            button.position = v3(this.frameWidth * 1.2, button.position.y, button.position.z);
        }
    }

    onInfoClick() {
        super.onInfoClick();
        this.arrNodeButton[2].getComponent(Button).interactable = false;
    }

    onExitClick() {
        super.onExitClick();
        this.arrNodeButton[0].getComponent(Button).interactable = false;
    }

    onSettingClick() {
        super.onSettingClick();
        this.arrNodeButton[1].getComponent(Button).interactable = false;
    }

    onJPHistoryClick() {
        super.onJPHistoryClick();
        this.arrNodeButton[3].getComponent(Button).interactable = false;
    }

    resetSideMenu() {
        this.unschedule(this.scheduleHide);
        this.isHide = true;
        this.iconHide.scale = v3(-1, 1, 1);
        this.stopActionAllButton();
        this.isActionDone = true;
    }

    onDestroy() {
        super.onDestroy();
        removeEvents(this);
    }
}
