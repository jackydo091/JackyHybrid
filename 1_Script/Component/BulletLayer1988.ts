
import { gfBulletLayer } from '../../../cc30-fishbase/Scripts/Components/gfBulletLayer';
import { getPointByDegrees, registerEvent, removeEvents, SetZIndex } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { _decorator, Component, Node, Prefab, UITransform, v3, instantiate } from 'cc';
import EventsCode1988 from '../Common/EventsCode1988';
import ReferenceManager1988 from '../Common/ReferenceManager1988'
import Config1988 from '../Common/Config1988'
import { Drill1988 } from './Drill1988';
const { ccclass, property } = _decorator;

@ccclass('BulletLayer1988')
export class BulletLayer1988 extends gfBulletLayer {
    @property(Prefab)
    private drillPrefab: Prefab = null;

    private _arrDrillBullet = [];

    initEvent(){
        super.initEvent();
        registerEvent(EventsCode1988.GAME_LAYER.CREATE_BULLET_DRILL, this.createBulletDrill, this);
        registerEvent(EventsCode1988.EFFECT_LAYER.REMOVE_DRILL, this.removeBulletDrill, this);
    }

    createBulletDrill(data){
        const player = ReferenceManager1988.instance.getPlayerByDeskStation(data.DeskStation);
        if (player) {
            const posFire = this.node.getComponent(UITransform).convertToNodeSpaceAR(player.gun.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 1)));
            const realPosFire = getPointByDegrees(posFire.x, posFire.y, posFire.x + Config1988.instance.gunRadius, posFire.y, Number.parseFloat(data.Angle));
            const drillBullet = instantiate(this.drillPrefab);
            this.node.addChild(drillBullet);
            SetZIndex(drillBullet, 600);
            drillBullet.setPosition(realPosFire.x, realPosFire.y, drillBullet.position.z);
            drillBullet.angle = data.Angle;
            this.scheduleOnce(()=>{
                drillBullet.getComponent(Drill1988).initData(data);
            }, 0);
            this._arrDrillBullet.push(drillBullet);
        }
    }

    removeBulletDrill(data){
        const { nodeDrill } = data;
        const index = this._arrDrillBullet.indexOf(nodeDrill);
        if(index != -1) {
            this._arrDrillBullet.splice(index, 1);
        }
    }

    removeArrDrillBullet(){
        this._arrDrillBullet.forEach(drill => {
            drill.getComponent(Drill1988).setDie();
            drill.getComponent(Drill1988).removeAllTween();
            drill.removeFromParent();
            drill.destroy();
        });
        this._arrDrillBullet.length = 0;
    }

    onResumeGame() {
        this.unscheduleAllCallbacks();
        super.onResumeGame();
        this.removeArrDrillBullet();
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
        super.onDestroy();
        removeEvents(this);
    }
}
