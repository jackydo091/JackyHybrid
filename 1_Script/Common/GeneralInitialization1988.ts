import { Component, _decorator, JsonAsset, Prefab } from 'cc';
const { ccclass, property } = _decorator;

import EventEmitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import NetworkParser from '../../../cc30-fishbase/Scripts/Network/gfNetworkParser';
import GameConfig from './Config1988';
import DataStore from './DataStore1988';
import MainFSM from '../../../cc30-fishbase/Scripts/Common/gfMainFSM';
import MainController from './MainController1988';
import ReferenceManager from './ReferenceManager1988';
import Localize from '../../../cc30-fishbase/Scripts/Common/gfLocalize';
import FishManager from './FishManager1988';
import PoolManager from './PoolManager1988';
import gfNodePoolConfig from './NodePoolConfig1988';

@ccclass('GeneralInitialization1988')
export class GeneralInitialization1988 extends Component 
{
    @property(JsonAsset)
    private jsonLocalize: JsonAsset = null;
    @property(Prefab)
    private gameObjectPrefabs: Prefab[] = [];
    @property(Prefab)
    private nodePoolAssetPrefab: Prefab;

    onLoad() : void {
        this.initInstances();
    }

    initInstances(){
        //Init Localize
        new Localize();
        Localize.instance.initLocalizeConfig(this.jsonLocalize.json);
        //Init Event Emitter
        new EventEmitter();
        //Init NetworkParser
        new NetworkParser();
        //Init GameConfig
        if(!GameConfig.instance) {
            new GameConfig();
        }
        //Init Datastore
        new DataStore();

        //Init ReferenceManager
        new ReferenceManager();

        //Init Main FSM
        new MainFSM();
        //Init Main Controller
        new MainController();
        //Init Popup Controller
        //new PopupController();

        //Init Notify Controller
        //new NotifyController();
        new FishManager();
        new PoolManager(this.gameObjectPrefabs);
        new gfNodePoolConfig(this.nodePoolAssetPrefab);
    }

    loginGame(){
        MainController.instance.initToken();
        DataStore.instance.setDataStore({"currentSceneName" : GameConfig.instance.SceneName.Lobby});
    }
};
