
import { _decorator, Label, director, ProgressBar, UITransform, sys, view, Prefab, Scene, instantiate, Node } from 'cc';
import {gfLoadingScene} from '../../../cc30-fishbase/Scripts/Common/gfLoadingScene';
import GameConfig from '../Common/Config1988';
import AssetBundle1988 from './AssetBundle1988';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene1988')
export class LoadingScene1988 extends gfLoadingScene {

    @property(Label)
    txtPercent: Label;
    onLoad() {
        super.onLoad();
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
        this.processBar.progress = Number(this._currentProgress.toFixed(2));
        const percent = Math.min(100, Math.floor(this._currentProgress * 100));
        if (this.processBar.progress > 1.0) this.processBar.progress = 1.0;
        if(this.loadingGlow){
            const currentPosGlow = this.loadingGlow.getPosition();
            const newPosX = Math.max(currentPosGlow.x, this.processBar.totalLength * this.processBar.progress * 0.9);
            this.loadingGlow.setPosition(newPosX, currentPosGlow.y, 0);
        }
        if (percent < 1) {
            this.txtPercent.string = '01%';
        }
        else if(percent <10){
            this.txtPercent.string =  "0"+ percent +"%";
        }
        else if(this.txtPercent.string != percent.toString() && percent <= 100){
            this.txtPercent.string = percent.toString() + "%";
        }
    }
    
}

