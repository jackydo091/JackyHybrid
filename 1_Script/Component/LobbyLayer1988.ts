import { log, warn, _decorator } from 'cc';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventCode from '../Common/EventsCode1988';
import GameConfig from '../Common/Config1988';
import { gfLobbyLayer } from '../../../cc30-fishbase/Scripts/Components/gfLobbyLayer';
import DataStore from '../../../cc30-fishbase/Scripts/Common/gfDataStore';
import { formatMoney, loadAvatarFacebook } from '../../../../cc-common/cc-share/common/utils';
import { formatUserName, removeEvents } from '../../../cc30-fishbase/Scripts/Utilities/gfUtilities'; 
import gfNetworkParser from '../../../cc30-fishbase/Scripts/Network/gfNetworkParser';
const { ccclass } = _decorator;

@ccclass('LobbyLayer1988')
export class LobbyLayer1988 extends gfLobbyLayer {

    onUpdateInfo() {
        const selfInfo = DataStore.instance.getSelfInfo();
        this.txtUserName.string = formatUserName(selfInfo.Username);
        this.txtUserName.updateRenderData(true);
        this.txtWallet.string = "$" + formatMoney(selfInfo.Wallet);
        this.txtWallet.updateRenderData(true);

        if (this.avatarAtlas && loadAvatarFacebook) {
            if (selfInfo.Avatar && selfInfo.Avatar.indexOf('Avatar') === 0) {
                selfInfo.Avatar = selfInfo.Avatar.replace('Avatar', '');
            }
            loadAvatarFacebook(this.avatarSprite, selfInfo.Avatar, this.avatarAtlas, 'avatar_', 2);
        }
    }

    onUpdateLobbyWallet(data) {
        this.txtWallet.string = "$" + formatMoney(data);
        this.txtWallet.updateRenderData(true);
    }

    onRoomBossClick() {
        log("::LobbyLayer:: onRoomBossClick");
    }

    onRoomNormalClick() {
        if (!Emitter || !Emitter.instance) return;
        if(!gfNetworkParser.instance.isAvailable()){
            warn('Network socket closed');
            return;
        }
        super.onRoomNormalClick();
        Emitter.instance.emit(EventCode.SOUND.CLICK_BUTTON_JOIN_GAME);
    }

    onRoomVipClick() {
        if (!Emitter || !Emitter.instance) return;
        if(!gfNetworkParser.instance.isAvailable()){
            warn('Network socket closed');
            return;
        }
        super.onRoomVipClick();
        Emitter.instance.emit(EventCode.SOUND.CLICK_BUTTON_JOIN_GAME);
    }

    onDestroy() {
        removeEvents(this);
    }
  
}
