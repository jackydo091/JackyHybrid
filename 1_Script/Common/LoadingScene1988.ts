
import { _decorator, Label, director, ProgressBar, UITransform, sys, view, Prefab, Scene, instantiate, Node } from 'cc';
import {gfLoadingScene} from '../../../cc30-fishbase/Scripts/Common/gfLoadingScene';
import GameConfig from '../Common/Config1988';
import AssetBundle1988 from './AssetBundle1988';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene1988')
export class LoadingScene1988 extends gfLoadingScene {
    @property(Label)
    loadingText: Label = null!;
    @property(Node)
    effectLoading: Node;

    onLoad() {
        super.onLoad();
        if(sys.isNative) {
            this.effectLoading.active = false; 
        }
    }

    initGameConfig(){
        if(!GameConfig.instance) {
            new GameConfig();
        }
    }

    initAssetBundle() {
        if(!AssetBundle1988.instance) {
            new AssetBundle1988();
        }
    }

    updateLoadingProgressDisplay() {
        const percent = Math.min(100, Math.floor(this._currentProgress * 100));
        if (percent < 1) {
            this.loadingText.string = '01%';
        } else if (percent < 10) {
            this.loadingText.string = '0' + percent + '%';
        } else {
            this.loadingText.string = percent + '%';
        }
    }
    
}

