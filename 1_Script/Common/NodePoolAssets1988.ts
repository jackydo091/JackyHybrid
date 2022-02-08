
import { gfGunSkeletonData } from '../../../cc30-fishbase/Scripts/Common/gfCustomDataType';
import { gfNodePoolAssets } from '../../../cc30-fishbase/Scripts/Common/gfNodePoolAssets';
import { _decorator, Component, Node } from 'cc';
import { convertAssetArrayToObject } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;

@ccclass('NodePoolAssets1988')
export class NodePoolAssets1988 extends gfNodePoolAssets {
    @property(gfGunSkeletonData)
    private gunSkeletonData = [];

    private gunAssets = null;

    initMapAssets(){
        super.initMapAssets();
        this.gunAssets = convertAssetArrayToObject(this.gunSkeletonData);
    }

    public getGunSkeletonData(name: any){ 
        if(this.gunAssets[name] && this.gunAssets[name].animation) {
            return this.gunAssets[name].animation;
        }
        return null;
    }
}
