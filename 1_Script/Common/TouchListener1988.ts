
import gfEventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import { gfTouchListener } from '../../../cc30-fishbase/Scripts/Components/gfTouchListener';
import { _decorator, Component, Node } from 'cc';
import DataStore1988 from './DataStore1988';
import EventsCode1988 from './EventsCode1988';
import ReferenceManager1988 from './ReferenceManager1988';
const { ccclass, property } = _decorator;

@ccclass('TouchListener1988')
export class TouchListener1988 extends gfTouchListener {
    
    _onUserEndTouch() {
        super._onUserEndTouch();
        if(DataStore1988.instance.getIsSideMenuOpened() || DataStore1988.instance.getIsCompoButtonAutoShow()){
            gfEventEmitter.instance.emit(EventsCode1988.GAME_LAYER.CLOSE_ALL_MENU);
        }
    }

}