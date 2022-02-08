import gfMainController from '../../../cc30-fishbase/Scripts/Common/gfMainController';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventCode from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import EventCode1988 from './EventsCode1988';
import GameConfig from './Config1988';
import MainFSM from '../../../cc30-fishbase/Scripts/Common/gfMainFSM';
import loadConfigAsync from '../../../../cc-common/cc-share/shareServices/loadConfigAsync';
import gameCommonUtils from '../../../../cc-common/cc-share/common/gameCommonUtils';
import { sys } from 'cc';
import { mock } from '../../../../mock/mock';
import serviceRest from '../../../../cc-common/cc-share/shareServices/serviceRest';
const { getUrlParam, handleCloseGameIframe, handleFlowOutGame } = gameCommonUtils;

export default class MainController1988 extends gfMainController {
    public static instance: MainController1988 = null;
    
    constructor() {
        super();
        MainController1988.instance = this;
    }

    onCatchFishSkill(data) {
        switch (data.SkillID) {
        case GameConfig.instance.SkillConfig.LASER:
            data.fishKind = GameConfig.instance.FISH_KIND.LASER_CRAB;
            break;
        case GameConfig.instance.SkillConfig.FISH_BOMB:
            data.fishKind = GameConfig.instance.FISH_KIND.BOMB;
            break;
        case GameConfig.instance.SkillConfig.DRILL:
            data.fishKind = GameConfig.instance.FISH_KIND.DRILL;
            break;
        }
        Emitter.instance.emit(EventCode.GAME_LAYER.CATCH_FISH_BY_SKILL, data);
    }

    onListUserOnBoard(data) {
        super.onListUserOnBoard(data);
        const {performingSkills} = data;
        const {DRILL, FISH_BOMB} = GameConfig.instance.SkillConfig;
        if(performingSkills){
            if(performingSkills[DRILL] && performingSkills[DRILL].length > 0){
                Emitter.instance.emit(EventCode1988.GAME_LAYER.RESUME_DRILL, performingSkills[DRILL]);
            }
            if(performingSkills[FISH_BOMB] && performingSkills[FISH_BOMB].length > 0){
                Emitter.instance.emit(EventCode1988.GAME_LAYER.RESUME_POISON_FLOWER, performingSkills[FISH_BOMB]);
            }
        }
    }   

    initToken() {
        const CONFIG = loadConfigAsync.getConfig();
        const { LOGIN_IFRAME, URL_TOKEN, USER_TOKEN, DEV_ENV, TOKEN_VALUE, IS_FINISHED_REMOTE, API_URL, IS_PRODUCTION } = CONFIG;
        if (!IS_FINISHED_REMOTE) {
            setTimeout(() => {
                this.initToken();
            }, 100);
            return;
        }
        GameConfig.instance.IsDevMode = DEV_ENV != null && DEV_ENV == true;
        GameConfig.instance.IPMaster = CONFIG[GameConfig.instance.IPMasterName];
        let token = '';
        let clientType = '1';
        GameConfig.instance.RoomVersion = IS_PRODUCTION ? GameConfig.instance.ProdVersion : GameConfig.instance.RoomVersion;
        if (LOGIN_IFRAME) {
            GameConfig.instance.GameId = getUrlParam('gameId') ? getUrlParam('gameId') : GameConfig.instance.GameId;
            GameConfig.instance.RoomVersion = getUrlParam('version') ? (`|${getUrlParam('version')}`) : GameConfig.instance.RoomVersion;
            if(getUrlParam('clientType')) {
                clientType = getUrlParam('clientType');
            }
        } else {
            clientType = '2';
        }
        clientType = '|' + clientType;
        if (!GameConfig.instance.IsDevMode) {
            if (!sys.isNative && LOGIN_IFRAME) {
                if (URL_TOKEN) token = getUrlParam(URL_TOKEN);
            } else {
                token = sys.localStorage.getItem(USER_TOKEN);
                if (!token && TOKEN_VALUE) token = TOKEN_VALUE;
            }
            GameConfig.instance.userToken = token;
            token += GameConfig.instance.RoomVersion + clientType;
            GameConfig.instance.token4Master = token;
            MainFSM.instance._fsm.goLoginLobby();
        } else {
            const dataPost = {
                userName: mock.userText,
                password: mock.pwText,
                fingerPrint: 'test',
            };
            serviceRest.post({
                url: 'auth/login',
                apiUrl: API_URL,
                data: dataPost,
                callback: ({ data }) => {
                    GameConfig.instance.token4Master = data.data.token + GameConfig.instance.RoomVersion;
                    MainFSM.instance._fsm.goLoginLobby();
                }
            });
        }
    }
}