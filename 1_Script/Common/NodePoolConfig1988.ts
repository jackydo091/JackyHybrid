
import { _decorator, Component, Node, Rect, v2, instantiate, sp, warn } from 'cc';
import gfNodePoolConfig from '../../../cc30-fishbase/Scripts/Common/gfNodePoolConfig';
import { NodePoolAssets1988 } from './NodePoolAssets1988';
const { ccclass, property } = _decorator;

@ccclass('NodePoolConfig1988')
export default class NodePoolConfig1988 extends gfNodePoolConfig {
    public static instance: NodePoolConfig1988 = null;

    constructor(listAssets){
        super(listAssets);
        NodePoolConfig1988.instance = this;
        this.FISH_CONFIG = {
            "0" :  {speed: 100,   FishMultiple: -1,     zIndex: 309, visibleSize:   v2(100, 100),  targetPoint: v2(13, 15),       BoxCollider: new Rect(10, 12.5, 48.5, 14.9)},
            "1" :  {speed: 100,   FishMultiple: -1,     zIndex: 308, visibleSize:   v2(100, 100),  targetPoint: v2(7, 12),       BoxCollider: new Rect(10, 10, 42.8, 32.9)},
            "2" :  {speed: 80,    FishMultiple: -1,     zIndex: 310, visibleSize:   v2(100, 100),  targetPoint: v2(15, 10),       BoxCollider: [new Rect(10, 10, 43.7, 10.2), new Rect(15, 10, 20.7, 39.3)]},
            "3" :  {speed: 80,    FishMultiple: -1,     zIndex: 307, visibleSize:   v2(120, 100),  targetPoint: v2(20, 10),      BoxCollider: new Rect(15, 10, 76.4, 16.6)},
            "4" :  {speed: 80,    FishMultiple: -1,     zIndex: 306, visibleSize:   v2(120, 100),  targetPoint: v2(25, 13),      BoxCollider: new Rect(15, 11.5, 67.7, 18.3)},
            "5" :  {speed: 80,    FishMultiple: -1,     zIndex: 305, visibleSize:   v2(120, 100),  targetPoint: v2(17.5, 12.5),       BoxCollider: [new Rect(10.1, 10.2, 68.3, 15.8), new Rect(20.8, 9, 28.3, 51.4)]},
            "6" :  {speed: 40,    FishMultiple: -1,     zIndex: 209, visibleSize:   v2(180, 100),  targetPoint: v2(3, 15),       BoxCollider: new Rect(5, 15, 86.2, 30.2)},
            "7" :  {speed: 60,    FishMultiple: -1,     zIndex: 303, visibleSize:   v2(150, 100),  targetPoint: v2(25, 13.5),      BoxCollider: [new Rect(20.2, 12.5, 92.8, 11), new Rect(30, 12.5, 50.2, 33.8)]},
            "8" :  {speed: 60,    FishMultiple: -1,     zIndex: 304, visibleSize:   v2(180, 150),  targetPoint: v2(30, 12),      BoxCollider: [new Rect(15, 10, 92.8, 11), new Rect(35, 10, 51.9, 57.3)]},
            "9" :  {speed: 60,    FishMultiple: -1,     zIndex: 302, visibleSize:   v2(150, 150),  targetPoint: v2(23, 12),       BoxCollider: [new Rect(11.1, 16, 83, 9), new Rect(26.2, 15.6, 40.7, 45)]},
            "10" : {speed: 60,    FishMultiple: -1,     zIndex: 301, visibleSize:   v2(180, 150),  targetPoint: v2(25, 20),       BoxCollider: [new Rect(15, 20, 87.7, 9), new Rect(30, 20, 43.3, 30.9)]},
            "11" : {speed: 60,    FishMultiple: -1,     zIndex: 207, visibleSize:   v2(180, 100),  targetPoint: v2(15, 8),       BoxCollider: [new Rect(10, 10, 90.2 , 28.9), new Rect(20, 10, 41.8, 48.6)]},
            "12" : {speed: 60,    FishMultiple: -1,     zIndex: 208, visibleSize:   v2(180, 100),  targetPoint: v2(20, 8),       BoxCollider: new Rect(10, 7, 105.8, 19)},
            "13" : {speed: 40,    FishMultiple: -1,     zIndex: 210, visibleSize:   v2(150, 110),  targetPoint: v2(30, 10),      BoxCollider: [new Rect(13.3, 10, 110.5, 19.3), new Rect(34.6, 10, 60.3, 36.1)]},
            "14" : {speed: 40,    FishMultiple: -1,     zIndex: 300, visibleSize:   v2(200, 120),  targetPoint: v2(25, 7),      BoxCollider: [new Rect(10, 10, 124.4, 19.3), new Rect(20, 10, 55.1, 60.7)]},
            "15" : {speed: 40,    FishMultiple: -1,     zIndex: 206, AnimationName: ['animation'], visibleSize: v2(150, 150),   targetPoint: v2(20, 0),       BoxCollider: [new Rect(7.5, 0, 112.8, 19.3), new Rect(17.5, 0, 45.3, 85)]},
            "16" : {speed: 20,    FishMultiple: -1,     zIndex: 211, AnimationName: ['animation'], visibleSize: v2(150, 150),   targetPoint: v2(5, 0),        BoxCollider: [new Rect(13.3, 0, 101.2, 19.3), new Rect(0.8, 0, 65.4, 60.4)]},
            "17" : {speed: 40,    FishMultiple: -1,     zIndex: 200, AnimationName: ['animation'], visibleSize: v2(400, 250),   targetPoint: v2(-10, 0),      BoxCollider: [new Rect(-47.8, 0, 186.4, 19.3), new Rect(-24.9, 0, 103.9, 60.4)]},
            "18" : {speed: 40,    FishMultiple: -1,     zIndex: 204, AnimationName: ['animation'], visibleSize: v2(150, 100),   targetPoint: v2(30, 0),       BoxCollider: [new Rect(4, 0, 132.8, 20),new Rect(30, 0, 30, 62.4)]},
            "19" : {speed: 40,    FishMultiple: -1,     zIndex: 203, AnimationName: ['animation'], visibleSize: v2(250, 80),    targetPoint: v2(0, 0),        BoxCollider: new Rect(-35, 0, 149.3, 20)},
            "20" : {speed: 40,    FishMultiple: -1,     zIndex: 201, AnimationName: ['animation'], visibleSize: v2(160, 200),   targetPoint: v2(30, 0),       BoxCollider: new Rect(0, 0, 121.9, 60), customAnimProp: {angle: -90}} ,
            "21" : {speed: 40,    FishMultiple: -1,     zIndex: 205, AnimationName: ['animation'], visibleSize: v2(450, 180),   targetPoint: v2(0, 0),        BoxCollider: [new Rect(-5.8, 0, 114.9, 54.6), new Rect(-100, 0, 100, 54.8), new Rect(30, 10, 43.6, 97.5)]},
            "22" : {speed: 20,    FishMultiple: -1,     zIndex: 107, AnimationName: ['animation'], visibleSize: v2(450, 200),   targetPoint: v2(20, 0),       BoxCollider: [new Rect(-72.1, 0, 239.3, 40), new Rect(40, 0, 14, 160)]},
            "23" : {speed: 20,    FishMultiple: -1,     zIndex: 106, AnimationName: ['animation'], visibleSize: v2(450, 300),   targetPoint: v2(0, 0),        BoxCollider: [new Rect(-24.6, 0, 260, 60), new Rect(10, 0, 44.2, 172)]},
            "24" : {speed: 100,   FishMultiple: -1,     zIndex: 102, AnimationName: ['animation'], visibleSize: v2(300, 300),   targetPoint: v2(30, 0),       BoxCollider: [new Rect(-1.6, 0, 215, 60), new Rect(4.6, 0, 115.5, 84.2)]},
            "25" : {speed: 20,    FishMultiple: -1,     zIndex: 105, AnimationName: ['animation'], visibleSize: v2(420, 300),   targetPoint: v2(110, 0),      BoxCollider: [new Rect(80, 0, 250, 60), new Rect(100, 0, 100, 160), new Rect(-80, 0, 120, 30)]},
            "27" : {speed: 20,    FishMultiple: -1,     zIndex: 100, AnimationName: ['animation'], visibleSize: v2(200, 150),   targetPoint: v2(0, 0),        BoxCollider: new Rect(0, 0, 94, 118), skipRotate: true, cacheMode: sp.Skeleton.AnimationCacheMode.REALTIME},
            "30" : {speed: 100,   FishMultiple: -1,     zIndex: 103, AnimationName: ['animation'], visibleSize: v2(300, 250),   targetPoint: v2(10, 0),       BoxCollider: [new Rect(10, 0, 220, 70), new Rect(30, 0, 110, 110)], cacheMode: sp.Skeleton.AnimationCacheMode.REALTIME},
            "47" : {speed: 20,    FishMultiple: -1,     zIndex: 101, AnimationName: ['animation'], visibleSize: v2(205, 250),   targetPoint: v2(0, 30),       BoxCollider: new Rect(0, 30, 80, 80),   skipRotate: true, customComponent: 'FlowerPoison1988'},
            "46" : {speed: 20,    FishMultiple: -1,     zIndex: 104, AnimationName: ['animation'], visibleSize: v2(350, 250),   targetPoint: v2(17, 0),       BoxCollider: [new Rect(0, 0, 230, 50),new Rect(-16.3, -41, 110.6, 32), new Rect(0, 41.4, 60, 33)]},
        }

        this.SPRITE_FISH_KIND = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        this.BULLET_CONFIG = {
            "0" : {BoxCollider: new Rect(-25, 0, 50, 15)},
            "1" : {BoxCollider: new Rect(-30, 0, 60, 25)},
            "2" : {BoxCollider: new Rect(-30, 0, 50, 33)},
            "3" : {BoxCollider: new Rect(-25, 0, 50, 33)},
            "4" : {BoxCollider: new Rect(-25, 0, 50, 33)},
            "5" : {BoxCollider: new Rect(-55, 0, 80, 55)},
            "6" : {BoxCollider: new Rect(-55, 0, 100, 90)},
        };
    }

    initNodePoolAssets(listAssets){
        this.assetHolder = instantiate(listAssets).getComponent(NodePoolAssets1988);
        this.assetHolder.initMapAssets();
    }

    getGunSkeletonData(name){
        const gunData = (this.assetHolder as NodePoolAssets1988).getGunSkeletonData(name);
        return gunData;
    }
}
