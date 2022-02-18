 import { _decorator, Node, v3, Button, tween, Vec3, TweenEasing, Tween } from "cc";
import { GfSideMenu } from "../../../cc30-fishbase/Scripts/Common/gfSideMenu";
import EventCode from "../../../cc30-fishbase/Scripts/Config/gfBaseEvents";
import { stopAllActions } from "../../../cc30-fishbase/Scripts/Utilities/gfActionHelper";
import { flipX, registerEvent, removeEvents } from "../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import DataStore from "../Common/DataStore1988";
import EventsCode1988 from "../Common/EventsCode1988";

const {ccclass, property } = _decorator;

@ccclass('SideMenu1988')
export class SideMenu1988 extends GfSideMenu {
    @property(Node) override: true
    protected nodeMove: Node = null;

    onLoad(){
        super.onLoad();
        DataStore.instance.isSideMenuOpened = false;
    }

    initEvents(){
        super.initEvents();
    }

    hideSideBar() {
        super.hideSideBar();
    }

    onClose(){
        if(!DataStore.instance.isSideMenuOpened) return;
        else{
            this.hideSideBar();
        }
    }


    resetSideMenu() {
        this.unschedule(this.scheduleHide);
        this.isHide = true;
        this.iconHide.scale = v3(-1, 1, 1);
        this.isActionDone = true;
    }

    onDestroy() {
        super.onDestroy();
        removeEvents(this);
    }
}
