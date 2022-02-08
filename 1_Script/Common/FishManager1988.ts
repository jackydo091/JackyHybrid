import { instantiate, v2, warn, Vec2, BoxCollider2D, Intersection2D } from 'cc';
import gfFishManager from '../../../cc30-fishbase/Scripts/Common/gfFishManager';
import ReferenceManager from './ReferenceManager1988';
import { getRandomInt } from '../../../../cc-common/cc-share/common/utils';
import PoolManager from './PoolManager1988';
import EventCode from './EventsCode1988';
import gfBaseEvents from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import { registerEvent, removeEvents, v2Distance } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import GameConfig from './Config1988';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import { BossBoris1988 } from "../Component/Boss/BossBoris1988";
import DataStore from '../../1_Script/Common/DataStore1988';
import { gfBaseFish } from '../../../cc30-fishbase/Scripts/Components/Fishes/gfBaseFish';



const CONFIG_POS_CREATE_FISH_FAKE = {
    LEFT: -220,
    RIGHT: 1680,
    TOP: 840,
    BOT: -120
};

const FISH_CIRCLE_KIND = 2;
const MAX_FISH_CIRCLE = 21;
export default class FishManager1988 extends gfFishManager {
    public static instance: FishManager1988 = null;
    protected fishDataForDrill: Object = null;
    constructor() {
        super();
        FishManager1988.instance = this;
        this.fishDataForDrill = {};
    }

    initEvent() {
        super.initEvent();
        registerEvent(EventCode.FISH_LAYER.CREATE_LIST_FISH_FAKE, this.createListFishFake, this);
        registerEvent(EventCode.FISH_LAYER.CATCH_BORIS, this.catchBoris, this);
        registerEvent(EventCode.FISH_LAYER.CREATE_CIRCLE_FISH, this.createListCircleFish, this)
    }

    setDataFishDrill(dataCatchFish) {
        const { DeskStation, ListFish } = dataCatchFish;
        if (!this.fishDataForDrill[DeskStation]) {
            this.fishDataForDrill[DeskStation] = {};
        }
        this.fishDataForDrill[DeskStation].listFishCircleData = [];
        this.fishDataForDrill[DeskStation].listFishFakeData = [];

        for (let i = 0; i < ListFish.length; i++) {
            let fishData = ListFish[i];
            if (fishData && fishData.FishKind === FISH_CIRCLE_KIND && this.fishDataForDrill[DeskStation].listFishCircleData.length <= MAX_FISH_CIRCLE) {
                this.fishDataForDrill[DeskStation].listFishCircleData.push(fishData);
            } else {
                const fish = this.getFishById(fishData.FishID);
                if (!fish || fish.checkDie() || fish.checkOutScene()) {
                    if (fish && !fish.checkDie()) fish.onDie();
                    const fakeData = this.createFakeData(fishData);
                    fishData = fakeData ? fakeData : fishData;
                    this.fishDataForDrill[DeskStation].listFishFakeData.push(fishData);
                }
            }
        }

        this.fishDataForDrill[DeskStation].countCircle = 0;
    }


    createBoss(data: any, bossName: string): any {
        Emitter.instance.emit(gfBaseEvents.DRAGON.CREATE, data);
        return super.createBoss(data, bossName);
    }

    dragonDropBall(data) {
        const bossBoris = this.getBossByKind(GameConfig.instance.FISH_KIND.DRAGON);
        if (!bossBoris) return;
        data.position = bossBoris.getComponent(BossBoris1988).getChipDropPosition();
        Emitter.instance.emit(gfBaseEvents.DRAGON.DROP_BALL, data);
        Emitter.instance.emit(gfBaseEvents.SOUND.DRAGON_HIT_BALL);
        bossBoris.getComponent(BossBoris1988).updateSkinDamaged(data.damageLevel);
    }

    endDragon(data) {
        const bossBoris = this.getBossByKind(GameConfig.instance.FISH_KIND.DRAGON);

        if (bossBoris) {
            bossBoris.getComponent(BossBoris1988).onBossEnd(data);
        }
        else {
            warn("Boss Boris has been deleted");
        }
    }

    catchBoris() {
        const bossBoris = this.getBossByKind(GameConfig.instance.FISH_KIND.DRAGON);
        if (bossBoris) {
            bossBoris.getComponent(BossBoris1988).onCatch();
        }
    }

    getArrFishID() {
        const listFish = this.getListFish();
        const arrFishID = [];
        listFish.forEach(fish => {
            if (fish.isAvailable()) {
                arrFishID.push(fish.getId());
            }
        });
        return arrFishID;
    }

    //Data nhằm diễn hoặc cho đúng quy trình
    createFakeData(data) {
        if (data.Position && data.Position.length > 0) return;
        data.InitCount = 3;
        const randomTBLR = getRandomInt(0, 1); // random bot, left = 0, top, right = 1
        const randomHV = getRandomInt(0, 1); // random horizontal = 0, vertical = 1
        const Pos1 = {
            PosX: randomHV ? getRandomInt(0, 1280) : (randomTBLR ? CONFIG_POS_CREATE_FISH_FAKE.RIGHT : CONFIG_POS_CREATE_FISH_FAKE.LEFT),
            PosY: randomHV ? (randomTBLR ? CONFIG_POS_CREATE_FISH_FAKE.TOP : CONFIG_POS_CREATE_FISH_FAKE.BOT) : getRandomInt(0, 720),
        };
        const Pos2 = {
            PosX: getRandomInt(426, 853), // 1/3 -> 2/3 Width
            PosY: getRandomInt(240, 480), // 1/3 -> 2/3 Height
        };
        const Pos3 = {
            PosX: randomHV ? getRandomInt(0, 1280) : (randomTBLR ? CONFIG_POS_CREATE_FISH_FAKE.LEFT : CONFIG_POS_CREATE_FISH_FAKE.RIGHT),
            PosY: randomHV ? (randomTBLR ? CONFIG_POS_CREATE_FISH_FAKE.BOT : CONFIG_POS_CREATE_FISH_FAKE.TOP) : getRandomInt(0, 720),
        };
        data.Position = [Pos1, Pos2, Pos3];
        return data;
    }

    //array chứa các thông số FishID, FishKind, InitCount, Position [ {PosX, PosY} {PosX, PosY} {PosX, PosY}], BuildTick

    createListFishFake(DeskStation) {
        if (!this.fishDataForDrill[DeskStation]) {
            return;
        }
        let { listFishFakeData } = this.fishDataForDrill[DeskStation];
        for (let i = 0; i < listFishFakeData.length; ++i) {
            let fishData = listFishFakeData[i];
            this.createFishFakeWithData(fishData);
        }
    }

    createFishFakeWithData(data) {
        let fish = null;
        data.isFake = true;
        data.BuildTick = DataStore.instance.getTime();
        const prefabFish = ReferenceManager.instance.getPrefabFishByKind(parseInt(data.FishKind));
        if (prefabFish) { // Create by prefab
            fish = instantiate(prefabFish);
            fish.setParent(ReferenceManager.instance.getNodeFishLayer());
            fish = fish.getComponent("gfBaseFish");
            fish.initFishData(data);
        } else { // Create by pool
            fish = PoolManager.instance.getFishWithData(data);
        }
        if (fish) {
            this.listFish.push(fish);
        }
    }

    createListCircleFish(DeskStation) {
        if (!this.fishDataForDrill[DeskStation]) {
            return;
        }
        let { listFishCircleData } = this.fishDataForDrill[DeskStation];
        const radius = 800;
        const listFishFake = [];
        for (let i = 0; i < listFishCircleData.length; ++i) {
            let fishData = listFishCircleData[i];
            const fish = this.getFishById(fishData.FishID);
            if (!fish || fish.checkDie() || fish.checkOutScene()) {
                if (fish && !fish.checkDie()) fish.onDie();
                listFishFake.push(fishData);
            }
        }
        const listFish = [];
        let maxFish = 8 - this.fishDataForDrill[DeskStation].countCircle;
        while (maxFish > 0) {
            if (listFishFake.length <= 0) {
                maxFish = 0;
                break;
            }
            const dataFish = listFishFake.shift();
            if (dataFish) {
                listFish.push(dataFish);
            }
            maxFish--;
        }
        this.createCircleFish(listFish, radius);
        this.fishDataForDrill[DeskStation].countCircle++;
    }

    createCircleFish(listData, radius) {
        const numFish = listData.length;
        const angleStep = 360 / numFish;
        const startPost = { PosX: 640, PosY: 360 };
        for (let i = 0; i < numFish; ++i) {
            const data = listData[i]
            data.Position = [startPost];
            const endPos = {
                PosX: startPost.PosX + Math.cos((i * angleStep) * Math.PI / 180) * radius,
                PosY: startPost.PosY + Math.sin((i * angleStep) * Math.PI / 180) * radius
            };
            data.Position.push(endPos);
            let fish = null;
            data.isFake = true;
            data.BuildTick = DataStore.instance.getTime();
            const prefabFish = ReferenceManager.instance.getPrefabFishByKind(parseInt(data.FishKind));
            if (prefabFish) { // Create by prefab
                fish = instantiate(prefabFish);
                fish.setParent(ReferenceManager.instance.getNodeFishLayer());
                fish = fish.getComponent("gfBaseFish");
                fish.initFishData(data);
            } else { // Create by pool
                fish = PoolManager.instance.getFishWithData(data);
            }
            if (fish) {
                this.listFish.push(fish);
            }
        }
    }

    moveOutAllFishes(data?) {
        let timeDelay = 4.0;
        if (!data) {
            timeDelay = 0.0;
        }
        for (let i = this.listFish.length - 1; i >= 0; --i) {
            this.listFish[i].moveOut(timeDelay);
        }

    }

    getBossBoris() {
        const bossBoris = this.getBossByKind(GameConfig.instance.FISH_KIND.DRAGON);
        if (!bossBoris) return null;
        return bossBoris;
    }

    catchFish(data) {
        if (data.FishID === 0) return;
        const { SkillConfig } = GameConfig.instance;
        const player = ReferenceManager.instance.getPlayerByDeskStation(data.DeskStation);
        if (player && player.isMe && (!data.skillID || (data.skillID && data.skillID == SkillConfig.FISH_BOMB))) {
            player.addGoldReward(data.GoldReward);
        }
        const fish = this.getFishById(data.FishID);
        if (fish) {
            fish.onCatch(data);
        } else if (player && player.isMe) {
            Emitter.instance.emit(gfBaseEvents.EFFECT_LAYER.PLAY_REWARD_EFFECT, { data });
        }
    }

    catchFishSkill(data) {
        const listFish = data.ListFish;
        // eslint-disable-next-line no-unused-vars
        listFish.sort(function (a, b) {
            return 0.5 - Math.random();
        });
        const { SkillConfig } = GameConfig.instance;
        const player = ReferenceManager.instance.getPlayerByDeskStation(data.DeskStation);
        if (player && player.isMe && data.SkillID == SkillConfig.LASER) {
            player.addGoldReward(data.TotalReward);
        }

        if (data.SkillID && (data.SkillID === SkillConfig.FISH_BOMB) && data.isLastPhase) {
            Emitter.instance.emit(EventCode.EFFECT_LAYER.END_PHASE_POISON_FLOWER);
        }
        for (let i = 0; i < listFish.length; ++i) {
            const fish = listFish[i];
            let delay = 0;
            if (data.SkillID === SkillConfig.FISH_BOMB) {
                delay = 0.85;
            }

            const infoDetail = {
                DeskStation: data.DeskStation,
                FishID: fish.FishID,
                GoldReward: fish.GoldReward,
                BulletMultiple: data.BulletMultiple,
                itemInfo: fish.itemInfo,
                isSkill: true,
                skillID: data.SkillID,
                delayTimeDie: delay
            };
            this.catchFish(infoDetail);
        }
    }

    getFishByDistanceWidthNode(nodePos, distanceConfig) {
        nodePos = nodePos.convertToWorldSpaceAR(v2(0, 0));
        let arrayFish = [...this.listFish];
        const arrFishOutput = [];
        arrayFish.forEach(fish => {
            const distance = v2Distance(nodePos, fish.node.worldPosition);
            if (distance < distanceConfig) {
                arrFishOutput.push(fish.getId());
            }
        });
        return arrFishOutput;
    }

    sendListFishPoison(listFish) {
        const data = {
            Angle: 0,
            ListFish: listFish.length > 0 ? listFish : [-1],
            SkillID: GameConfig.instance.SkillConfig.FISH_BOMB,
        };
        Emitter.instance.emit(gfBaseEvents.GAME_LAYER.SEND_FIRE_LASER, data);
    }

    GetFishByPoint(point: Vec2) {
        let fishResult = null;
        const selfInfo = DataStore.instance.getSelfInfo();
        for (let i = 0; i < this.listFish.length; ++i) {
            const fish = this.listFish[i];
            if (fish && fish.isAvailable() && ((!selfInfo.LockFish) || (selfInfo.LockFish && selfInfo.LockFish.getId() !== fish.getId()))) {
                const boxList = fish.getComponents(BoxCollider2D);
                if (boxList) {
                    for (let j = 0; j < boxList.length; ++j) {
                        if (boxList[j].worldPoints && Intersection2D.pointInPolygon(point, boxList[j].worldPoints)) {
                            if ((!fishResult) || (fishResult && fish.getZIndex() > fishResult.getZIndex())) {
                                fishResult = fish;
                            }
                        }
                    }
                }

            }
        }
        return fishResult;
    }

    destroy() {
        removeEvents(this);
        super.destroy();
    }
}