
import { gfDragonBallAsset } from '../../../cc30-fishbase/Scripts/Common/gfCustomDataType';
import { gfNodePoolAssets } from '../../../cc30-fishbase/Scripts/Common/gfNodePoolAssets';
import { _decorator, Component, Node } from 'cc';
import { convertAssetArrayToObject } from '../../../../cc-common/cc-share/common/utils';
const { ccclass, property } = _decorator;

@ccclass('NodePoolAssets1988')
export class NodePoolAssets1988 extends gfNodePoolAssets {
    @property(gfDragonBallAsset)
    public dragonBall = [];

    public dragonBallAssets = null;

    initMapAssets(){
        super.initMapAssets();
        this.dragonBallAssets = convertAssetArrayToObject(this.dragonBall);
    }

    public getDragonBallAssets(kind: any) {
        if(this.dragonBallAssets[kind] && this.dragonBallAssets[kind].sprite) {
            return this.dragonBallAssets[kind].sprite;
        }
        return null;
    }
}
