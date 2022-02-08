
import gfDataStore from '../../../cc30-fishbase/Scripts/Common/gfDataStore';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataStore1988')
export default class DataStore1988 extends gfDataStore {
    public static instance: DataStore1988 = null;

    public isSideMenuOpened: boolean;
    public isCompoButtonAutoShow: boolean;
    public isPlayingPoison: boolean;
    public isPlayingBorisReward: boolean;
    constructor () {
        super();
        DataStore1988.instance = this;

        this.setSelfInfo({currentSkillID: -1});
        this.isSideMenuOpened = false;
        this.isCompoButtonAutoShow = false;
        this.isPlayingPoison = false;
        this.isPlayingBorisReward = false;
    }

    public getIsSideMenuOpened(): boolean {
        return this.isSideMenuOpened;
    }

    public setIsSideMenuOpened(isSideMenuOpened): void{
        this.isSideMenuOpened = isSideMenuOpened;
    }

    public getIsCompoButtonAutoShow(): boolean {
        return this.isCompoButtonAutoShow;
    }

    public setIsCompoButtonAutoShow(isCompoButtonAutoShow): void{
        this.isCompoButtonAutoShow = isCompoButtonAutoShow;
    }

    public getIsPlayingPoison(): boolean {
        return this.isPlayingPoison;
    }

    public setIsPlayingPoison(isPlayingPoison): void{
        this.isPlayingPoison = isPlayingPoison;
    }

    public getIsPlayingBorisReward(): boolean {
        return this.isPlayingBorisReward;
    }

    public setIsPlayingBorisReward(isPlayingBorisReward): void{
        this.isPlayingBorisReward = isPlayingBorisReward;
    }
}
