import FishGroup1 from '../../../cc30-fishbase/Scripts/FishGroup/Groups/gfFishGroup15';
import FishGroup2 from '../../../cc30-fishbase/Scripts/FishGroup/Groups/gfFishGroup16';
import FishGroup3 from '../../../cc30-fishbase/Scripts/FishGroup/Groups/gfFishGroup12';
import FishGroup4 from '../../../cc30-fishbase/Scripts/FishGroup/Groups/gfFishGroup13';
import gfFishGroupMgr from '../../../cc30-fishbase/Scripts/FishGroup/gfFishGroupMgr';
import { _decorator } from 'cc';


const { ccclass } = _decorator;
@ccclass('FishGroupMgr1988')
export class FishGroupMgr1988 extends gfFishGroupMgr {
    createFishGroup1() {
        FishGroup1.create();
    }

    createFishGroup2() {
        FishGroup2.create();
    }

    createFishGroup3() { 
        FishGroup3.create();
    }

    createFishGroup4() { 
        FishGroup4.create();
    }
}
