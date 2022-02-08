
import { _decorator } from 'cc';
const { ccclass } = _decorator;
import { GfPopupJackpotHistory } from '../../../../cc30-fishbase/Scripts/Components/Popup/PopupHistoryJackpot/gfPopupJackpotHistory';
import gfLocalize from '../../../../cc30-fishbase/Scripts/Common/gfLocalize';
import Config1988 from '../../Common/Config1988';

@ccclass('PopupHistoryJackpot1988')
export class PopupHistoryJackpot1988 extends GfPopupJackpotHistory {

    getData(){
        return {
            gameId : Config1988.instance.GameId,
            jpList : "GRAND",
            jpPrefix : "ktf_",
            url : "jackpothistory/v2/multiple",
        }
    }
    
    initLanguage() {
        this.pageIndexLabel.string = gfLocalize.instance.txtPopup.txtPageIndex;
    }
}
