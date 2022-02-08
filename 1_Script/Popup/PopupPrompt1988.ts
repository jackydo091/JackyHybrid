
import { _decorator, Component, Node } from 'cc';
import { GfPopupPrompt } from '../../../cc30-fishbase/Scripts/Components/Popup/gfPopupPrompt';
import GameConfig from '../../../cc30-fishbase/Scripts/Config/gfBaseConfig';
import gfLocalize from '../../../cc30-fishbase/Scripts/Common/gfLocalize';
import Emitter from '../../../cc30-fishbase/Scripts/Common/gfEventEmitter';
import EventCode from '../../../cc30-fishbase/Scripts/Config/gfBaseEvents';
import gfNetworkGameEvent from '../../../cc30-fishbase/Scripts/Network/gfNetworkGameEvent';
import loadConfigAsync from '../../../../cc-common/cc-share/shareServices/loadConfigAsync';
const { ccclass, property } = _decorator;

@ccclass('PopupPrompt1988')
export class PopupPrompt1988 extends GfPopupPrompt {

    protected onPromptHandler(eventData) {
        const {
            customMsg, customType, customCallbacks, Code, ArrayParam
        } = eventData;
        const eventCode = customMsg || (Code || eventData);
        let msg = null;
        let type = null;
        let callbacks = null;
        const { LOGIN_IFRAME } = loadConfigAsync.getConfig();
        switch (eventCode) {
        case gfNetworkGameEvent.NETWORK_ERROR:
        case gfNetworkGameEvent.NETWORK_DIE:
            msg = gfLocalize.instance.NETWORK_MESSAGE.NETWORK_DIE;
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            this._animStyleHide = GameConfig.instance.POPUP_ANIMATION.DEFAULT;
            callbacks = {
                confirmCallback: () => {
                    Emitter.instance.emit(EventCode.COMMON.REFRESH_PAGE);
                },
            };
            break;
        case gfNetworkGameEvent.AUTHEN_FAIL:
            msg = gfLocalize.instance.NETWORK_MESSAGE.AUTHEN_FAIL;
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            this._animStyleHide = GameConfig.instance.POPUP_ANIMATION.DEFAULT;
            callbacks = {
                confirmCallback: () => {
                    Emitter.instance.emit(EventCode.COMMON.REFRESH_PAGE);
                },
            };
            break;
        case gfNetworkGameEvent.LOGIN_IN_OTHER_DEVICE:
            msg = gfLocalize.instance.NETWORK_MESSAGE.LOGIN_IN_OTHER_DEVICE;
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            this._animStyleHide = GameConfig.instance.POPUP_ANIMATION.DEFAULT;
            callbacks = {
                confirmCallback: () => {
                    Emitter.instance.emit(EventCode.COMMON.REFRESH_PAGE);
                },
            };
            break;
        case gfNetworkGameEvent.NETWORK_POOR:
            msg = gfLocalize.instance.NETWORK_MESSAGE.NETWORK_POOR;
            type = GameConfig.instance.POPUP_PROMPT.NONE_BUTTON;
            break;
        case gfNetworkGameEvent.MSG_CODE.DUPLICATE_LOGIN:
        case gfNetworkGameEvent.MSG_CODE.IG_DUPLICATE_LOGIN:
            msg = gfLocalize.instance.MessagesSystem[gfNetworkGameEvent.MSG_CODE.DUPLICATE_LOGIN];
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            this._animStyleHide = GameConfig.instance.POPUP_ANIMATION.DEFAULT;
            callbacks = {
                confirmCallback: () => {
                    Emitter.instance.emit(EventCode.COMMON.REFRESH_PAGE);
                },
            };
            break;
        case gfNetworkGameEvent.MSG_CODE.CANT_FIND_ROOM:
        case gfNetworkGameEvent.MSG_CODE.ROOM_FULL:
            msg = gfLocalize.instance.MessagesSystem[eventCode];
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            break;
        case gfNetworkGameEvent.MSG_CODE.OWN_LASER:
            msg = gfLocalize.instance.MessagesSystem[eventCode][ArrayParam[0]];
            msg = msg.replace("xxx", gfLocalize.instance.txtGameMode[eventData.roomCode]);
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            break;
        case gfNetworkGameEvent.MSG_CODE.NO_MONEY_LOBBY:
            if (LOGIN_IFRAME && typeof (ingameDeposit) === 'function') {
                msg = gfLocalize.instance.MessagesSystem[gfNetworkGameEvent.MSG_CODE.CHARGE_MONEY];
                type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
                callbacks = {
                    confirmCallback: () => {
                        ingameDeposit();
                    },
                };
            } else {
                msg = gfLocalize.instance.MessagesSystem[gfNetworkGameEvent.MSG_CODE.NO_MONEY_LOBBY];
                type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            }
            break;
        case gfNetworkGameEvent.MSG_CODE.NO_MONEY_IN_GAME:
            if (LOGIN_IFRAME && typeof (ingameDeposit) === 'function') {
                msg = gfLocalize.instance.MessagesSystem[gfNetworkGameEvent.MSG_CODE.CHARGE_MONEY];
                type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
                callbacks = {
                    confirmCallback: () => {
                        ingameDeposit();
                    },
                };
            } else {
                msg = gfLocalize.instance.MessagesSystem[gfNetworkGameEvent.MSG_CODE.NO_MONEY_IN_GAME];
                type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
                callbacks = {
                    confirmCallback: () => {
                        // Emitter.instance.emit(EventCode.COMMON.GO_LOBBY);
                        Emitter.instance.emit(EventCode.COMMON.SEND_EXIT_GAME_SERVER);
                    },
                };
            }
            Emitter.instance.emit(EventCode.GAME_LAYER.OFF_ALL_TARGET);
            break;
        case gfNetworkGameEvent.MSG_CODE.NO_ACTION:
            this.scheduleOnce(this.goToLobby, 4);
            msg = gfLocalize.instance.MessagesSystem[gfNetworkGameEvent.MSG_CODE.NO_ACTION];
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            callbacks = {
                confirmCallback: () => {
                    this.unschedule(this.goToLobby);
                    Emitter.instance.emit(EventCode.COMMON.GO_LOBBY);
                },
            };
            break;
        case gfNetworkGameEvent.MSG_CODE.SERVER_MAINTAIN:
            this.scheduleOnce(this.goToLobby, 2);
            msg = gfLocalize.instance.MessagesSystem[gfNetworkGameEvent.MSG_CODE.SERVER_MAINTAIN];
            type = GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            callbacks = {
                confirmCallback: () => {
                    this.unschedule(this.goToLobby);
                    Emitter.instance.emit(EventCode.COMMON.GO_LOBBY);
                },
            };
            break;
        case gfNetworkGameEvent.MSG_CODE.WAITING_TIMEOUT:
            this.scheduleOnce(()=>{
                Emitter.instance.emit(EventCode.COMMON.REFRESH_PAGE);
            },2);
            msg = gfLocalize.instance.NETWORK_MESSAGE.NETWORK_DIE;
            type = GameConfig.instance.POPUP_PROMPT.NONE_BUTTON;
            break;
        default:
            msg = eventCode;
            type = customType || GameConfig.instance.POPUP_PROMPT.JUST_CONFIRM_BUTTON;
            if (customCallbacks) {
                callbacks = customCallbacks;
            }
        }
        return { msg, type, callbacks };
    }
}

