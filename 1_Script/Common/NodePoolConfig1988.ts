
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
            "0" :  {speed: 100,   FishMultiple: -1,     zIndex: 300, visibleSize:   v2(50, 25),  targetPoint: v2(10, 0),       BoxCollider: new Rect(-2, 1, 40, 25)},
            "1" :  {speed: 100,   FishMultiple: -1,     zIndex: 309, visibleSize:   v2(60, 25),  targetPoint: v2(10, 0),       BoxCollider: new Rect(2.5, 0, 40, 20)},
            "2" :  {speed: 80,    FishMultiple: -1,     zIndex: 303, visibleSize:   v2(55, 42),  targetPoint: v2(10, 0),       BoxCollider: new Rect(-6.5, 0, 50, 20)},
            "3" :  {speed: 80,    FishMultiple: -1,     zIndex: 306, visibleSize:   v2(70, 45),  targetPoint: v2(10, 0),      BoxCollider: new Rect(-5, 0, 50, 25)},
            "4" :  {speed: 80,    FishMultiple: -1,     zIndex: 306, visibleSize:   v2(72, 55),  targetPoint: v2(10, 0),      BoxCollider: new Rect(-0.5, -0.5, 60, 40)},
            "5" :  {speed: 80,    FishMultiple: -1,     zIndex: 200, visibleSize:   v2(50, 52),  targetPoint: v2(10, 0),       BoxCollider: new Rect(-1, 3, 30, 35), haveWounded: true},
            "6" :  {speed: 40,    FishMultiple: -1,     zIndex: 305, visibleSize:   v2(95, 53),  targetPoint: v2(3, 15),       BoxCollider: new Rect(0, 0, 60, 25), haveWounded: true},
            "7" :  {speed: 60,    FishMultiple: -1,     zIndex: 301, visibleSize:   v2(105, 55),  targetPoint: v2(20, 0),      BoxCollider: [new Rect(0, 0, 80, 15), new Rect(15.6, 0, 66, 25)]},
            "8" :  {speed: 60,    FishMultiple: -1,     zIndex: 302, visibleSize:   v2(120, 80),  targetPoint: v2(10, 0),      BoxCollider: [new Rect(-8.5, 0, 111, 15), new Rect(6.6, 0, 66, 40)]},
            "9" :  {speed: 60,    FishMultiple: -1,     zIndex: 308, visibleSize:   v2(100, 70),  targetPoint: v2(-10, 0),       BoxCollider: new Rect(-15, 3, 70, 51)},
            "10" : {speed: 60,    FishMultiple: -1,     zIndex: 304, visibleSize:   v2(85, 90),  targetPoint: v2(10, 0),       BoxCollider: new Rect(12, 0, 40, 45)},
            "11" : {speed: 60,    FishMultiple: -1,     zIndex: 209, AnimationName: ['animation'], visibleSize:   v2(200, 70),  targetPoint: v2(10, 0),       BoxCollider: new Rect(-39.6, 0, 132, 35)},
            "12" : {speed: 60,    FishMultiple: -1,     zIndex: 206, visibleSize:   v2(160, 115),  targetPoint: v2(15, 0),       BoxCollider: new Rect(-2, 0, 117, 29)},
            "13" : {speed: 40,    FishMultiple: -1,     zIndex: 202, visibleSize:   v2(155, 75),  targetPoint: v2(10, 0),      BoxCollider: [new Rect(-12.4, 0, 120, 19), new Rect(6.5, 2, 66, 46)]},
            "14" : {speed: 40,    FishMultiple: -1,     zIndex: 203, visibleSize:   v2(130, 100),  targetPoint: v2(20, 0),      BoxCollider: new Rect(19, 0, 80, 80)},
            "15" : {speed: 40,    FishMultiple: -1,     zIndex: 209, visibleSize: v2(230, 80),   targetPoint: v2(20, 0),       BoxCollider: new Rect(10, 0, 140, 25)},
            "16" : {speed: 20,    FishMultiple: -1,     zIndex: 211, AnimationName: ['animation'], visibleSize: v2(200, 115),   targetPoint: v2(20, 0),        BoxCollider: [new Rect(6, 0, 127, 60), new Rect(-10, 0, 86.5, 101)]},
            "17" : {speed: 40,    FishMultiple: -1,     zIndex: 200, AnimationName: ['animation'], visibleSize: v2(150, 150),   targetPoint: v2(20, 0),      BoxCollider: [new Rect(6, 0, 127, 60), new Rect(-10, 0, 86.5, 101)]},
            "18" : {speed: 40,    FishMultiple: -1,     zIndex: 204, AnimationName: ['animation'], visibleSize: v2(210, 70),   targetPoint: v2(20, 0),        BoxCollider: new Rect(0, 13.5, 170, 55)},
            "19" : {speed: 75,    FishMultiple: -1,     zIndex: 203, AnimationName: ['animation'], visibleSize: v2(230, 80),   targetPoint: v2(70, 0),         BoxCollider: new Rect(0, 0, 180, 44)},
            "20" : {speed: 40,    FishMultiple: -1,     zIndex: 201, AnimationName: ['animation'], visibleSize: v2(200, 180),   targetPoint: v2(30, 0),       BoxCollider: [new Rect(-6.4, 0, 130, 41.9), new Rect(23.3, 0, 35.7, 150.3)], customAnimProp: {angle: -90}} ,
            "21" : {speed: 40,    FishMultiple: -1,     zIndex: 205, AnimationName: ['animation'], visibleSize: v2(150, 150),   targetPoint: v2(25, 0),        BoxCollider: [new Rect(0, 0, 100, 41.6), new Rect(23.3, 0.5, 35.7, 120)]},
            "22" : {speed: 20,    FishMultiple: -1,     zIndex: 107, AnimationName: ['animation'], visibleSize: v2(280, 120),   targetPoint: v2(55, 0),       BoxCollider: [new Rect(0, 0, 220, 50), new Rect(22.7, 0, 34.5, 141)]},
            "23" : {speed: 20,    FishMultiple: -1,     zIndex: 106, AnimationName: ['animation'], visibleSize: v2(265, 150),   targetPoint: v2(-60, 0),        BoxCollider: [new Rect(10, -3.6, 180.5, 77), new Rect(14.7, 0, 33.9, 148), new Rect(-60, 0, 43.8, 124.2)]},
            "24" : {speed: 20,   FishMultiple: -1,     zIndex: 102, AnimationName: ['animation'], visibleSize: v2(265, 220),   targetPoint: v2(55, 0),       BoxCollider: [new Rect(-8.2, 6, 240, 34.5), new Rect(70.1, 0.5, 123.5, 140)]},
            "25" : {speed: 20,    FishMultiple: -1,     zIndex: 105, AnimationName: ['animation'], visibleSize: v2(255, 190),   targetPoint: v2(30, 0),      BoxCollider: [new Rect(10, 1.4, 170, 114.3), new Rect(0, 1.7, 75.8, 175)]},
            "27" : {speed: 20,    FishMultiple: -1,     zIndex: 100, AnimationName: ['animation'], visibleSize: v2(200, 150),   targetPoint: v2(20, 0),        BoxCollider: new Rect(0, 0, 94, 118), skipRotate: true, cacheMode: sp.Skeleton.AnimationCacheMode.REALTIME},
            "30" : {speed: 100,   FishMultiple: -1,     zIndex: 103, AnimationName: ['animation'], visibleSize: v2(300, 250),   targetPoint: v2(10, 0),       BoxCollider: [new Rect(10, 0, 220, 70), new Rect(30, 0, 110, 110)], cacheMode: sp.Skeleton.AnimationCacheMode.REALTIME},
            "47" : {speed: 20,    FishMultiple: -1,     zIndex: 101, AnimationName: ['animation'], visibleSize: v2(205, 250),   targetPoint: v2(0, 30),       BoxCollider: new Rect(0, 30, 80, 80),   skipRotate: true, customComponent: 'FlowerPoison1988'},
            "43" : {speed: 20,    FishMultiple: -1,     zIndex: 310, AnimationName: ['animation'], visibleSize: v2(400, 230),    BoxCollider: [new Rect(-40.3, 0, 265.4, 63.1), new Rect(-14.1, -1.2, 151.3, 168.9)], haveWounded: false},
            "46" : {speed: 20,    FishMultiple: -1,     zIndex: 104, AnimationName: ['animation'], visibleSize: v2(350, 250),   targetPoint: v2(17, 0),       BoxCollider: [new Rect(0, 0, 230, 50),new Rect(-16.3, -41, 110.6, 32), new Rect(0, 41.4, 60, 33)]},
        };

        this.SPRITE_FISH_KIND = [0,1,2,3,4,5,6,7,8,9,10,12,13,14,15];
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
