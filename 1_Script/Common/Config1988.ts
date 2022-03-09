
import { v2, Vec2 } from 'cc';
import gfBaseConfig from '../../../cc30-fishbase/Scripts/Config/gfBaseConfig';

export default class Config1988 extends gfBaseConfig {
    public static instance: Config1988 = null;
    SOUND_SLIDER: boolean;
    BOSS_PREFAB_NAME = {
        DRAGON : 'Dragon',
    };
    public GunSkill: { LASER: string; DRILL: string};

    constructor() {
        super();
        Config1988.instance = this;
        this.GameId = '1988';
        this.GameVersion = "0.0.1";
        this.SceneName.Lobby = 'ktfLobby1988';
        this.SceneName.Game = 'ktfGame1988';
        this.IPMasterName = "IPMaster8";
        this.IPMaster = "IPMaster8";
        this.RoomVersion = "|10";
        this.ProdVersion = "|1";
        this.ClientType = "|1";
        this.SOUND_SLIDER = true;
        this.BundleName = 'bundle1988';

        this.NOTIFY_MESSAGE = {
            position : {
                [this.SceneName.Game]   : v2(0, 330),
                [this.SceneName.Lobby]  : v2(0, 240)
            },
            limited_stack_size: 10
        };
        this.FISH_KIND = {
            LASER_CRAB: 27,
            DRAGON: 63,
            MINIBOSS: 33,
            BOMB: 47,
            DRILL: 46,
            SELENA: 30,
            ROACH: 24
        };
        this.GunSkill = {
            LASER: "GunLaser",
            DRILL: "GunDrill"
        };
        this.SkillConfig = {
            TIMEOUT: 30,
            LASER: 27,
            BOOM: 3,
            FISH_BOMB: 47,
            DRILL: 46 
        };
        this.SHAKE_SCREEN_STYLE = {
            HORIZONTAL: 0,
            VERTICAL: 1,
            CROSS_1: 2, //theo hình dấu cộng
            CROSS_2: 3, //theo hình dấu nhân
            FULL:4  //kết hợp cả 2 loại style CROSS
        };
        this.SOUND_BACKGROUND_CONFIG = {
            MINI_BOSS: "MINI_BOSS",
            DRAGON: "DRAGON",
            LOBBY: "LOBBY",
            IN_GAME: "IN_GAME",
            FISH_GROUP: "FISH_GROUP"
        };
        this.SOUND_SLIDER = true;
        this.POS_WIFI_STATUS = {
            LEFT: new Vec2(-402, -253),
            RIGHT: new Vec2(402, -253),
        };
        this.TURN_ON_WIFI_STATUS = true;
        this.DEFAULT_AVATAR = "avatar_default";
        this.LOCAL_STORE.MUSIC_VOLUME = "enableBackgroundMusic";
        this.LOCAL_STORE.EFFECT_VOLUME = "enableSound";
    }

    destroy() {
        super.destroy();
        Config1988.instance = null;
    }
}
