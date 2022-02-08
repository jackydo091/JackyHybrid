import gfPoolManager, { POOL_TYPE } from '../../../cc30-fishbase/Scripts/Common/gfPoolManager';
import NodePoolConfig from './NodePoolConfig1988';
import {instantiate, Prefab} from 'cc';
import {SetZIndex} from "../../../cc30-fishbase/Scripts/Utilities/gfUtilities";
import { gfCoinLabel } from '../../../cc30-fishbase/Scripts/Components/gfCoinLabel';
import ReferenceManager1988 from './ReferenceManager1988';

enum POOL_TYPE_EXTEND {
    BorisStatic = POOL_TYPE.FINAL_INDEX + 1,
    PoisonEffect = POOL_TYPE.FINAL_INDEX + 2
}

export default class PoolManager1988 extends gfPoolManager {
    public static instance: PoolManager1988 = null;

    constructor(listPrefab) {
        super(listPrefab);
        PoolManager1988.instance = this;
    }

    initPools(){
        this.pools = [];
        //type, prefabName, mainComponent, count
        this.initPool(POOL_TYPE.SpineFish, "SpineFish1988", "SpineFish1988", 25);
        this.initPool(POOL_TYPE.SpriteFish, "SpriteFish1988", "SpriteFish1988", 25);
        this.initPool(POOL_TYPE.Coin, "Coin", "gfCoinFX", 10);
        this.initPool(POOL_TYPE.Bullet, "Bullet", "gfBullet", 10);
        this.initPool(POOL_TYPE.NetFX, "NetFX1988", "NetFX1988", 20);
        this.initPool(POOL_TYPE.LabelCoin, "LabelCoin1988", "CoinLabel1988", 5);
        this.initPool(POOL_TYPE.SmallExplosion, "SmallExplosion", "gfExplosionSpine", 50);
        this.initPool(POOL_TYPE_EXTEND.BorisStatic, "BorisStatic1988", "BorisStatic1988", 10);
        this.initPool(POOL_TYPE_EXTEND.PoisonEffect, "PoisonEffect1988", "PoisonEffect1988", 10);
        //init done
        this.listPrefab = null;
    }

    getNetFX(kind) {
        const config = NodePoolConfig.instance.getNetFXConfig(kind.toString());
        if(!config) return null;
        const netfx = this.getObjectMainComponentByType(POOL_TYPE.NetFX);
        config.kind = kind;
        //netfx.initAssets(config);
        return { netFX: netfx, config: config };
    }

    getLabelCoin(isMe = true) : gfCoinLabel {
        const label =  this.getObjectMainComponentByType(POOL_TYPE.LabelCoin);
        label.initAssets(isMe);
        return label;
    }

    createBorisStatic({position, parent, zIndex, angle = 0, scale = {x:0.9, y:0.9, z : 0.9}}){
        const staticBoris = this.getObjectMainComponentByType(POOL_TYPE_EXTEND.BorisStatic);
        staticBoris.node.parent = parent;
        staticBoris.zIndex = zIndex;
        staticBoris.node.setPosition(position.x, position.y, zIndex);
        SetZIndex(staticBoris.node, zIndex);
        staticBoris.node.angle = angle;
        staticBoris.node.scale.x *= scale.x;
        staticBoris.node.scale.y *= scale.y;
        return staticBoris;
    }

    getPoisonEffect() {
        const effect = this.getObjectMainComponentByType(POOL_TYPE_EXTEND.PoisonEffect);
        effect.node.setParent(ReferenceManager1988.instance.getFishEffectLayer());
        return effect;
    }

    instantiateDragon(prefab: Prefab) {
        if (!this.dragon) {
            this.dragon = instantiate(prefab).getComponent('BossBoris1988');
        }
    }
}