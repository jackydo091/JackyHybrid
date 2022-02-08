import GameConfig from '../../Common/Config1988';
import { _decorator, tween, Layout } from 'cc';
import { fadeIn, fadeOut, stopAllActions } from '../../../../cc30-fishbase/Scripts/Utilities/gfActionHelper';
import Localize from '../../../../cc30-fishbase/Scripts/Common/gfLocalize';
import { formatString, formatUserName } from '../../../../cc30-fishbase/Scripts/Utilities/gfUtilities';
import { GfNotifyJackpot } from '../../../../cc30-fishbase/Scripts/Components/gfNotifyJackpot';
import { setOpacity } from '../../../../../cc-common/cc-share/common/utils';

const {ccclass, property} = _decorator
@ccclass('NotifyJackpot1988')
export class NotifyJackpot1988 extends GfNotifyJackpot {
    
    private _animHide: string;

    constructor() { 
        super();
        this._animAppear = 'animation1';
        this._animIdle = 'animation2';
        this._animHide = 'animation3';
    }

    setMixAll(){
        let arrAnimation = Object.keys(this.mainAnim.skeletonData._skeletonJson.animations);
        for (let i = 0; i < arrAnimation.length; ++i) {
            for (let j = i + 1; j < arrAnimation.length; j++) {
                if (this.mainAnim.findAnimation(arrAnimation[i])&& this.mainAnim.findAnimation(arrAnimation[j])) {
                    this.mainAnim.setMix(arrAnimation[i], arrAnimation[j], 0.25);
                }
            }
        }
    }

    play(dataInput) {
        const {data, type} = dataInput;
        this.node.active = true;
        stopAllActions(this.node);
        setOpacity(this.node, 255);
        stopAllActions(this.contentNode);

        this.setupSpineAnim(type);
        this.setMixAll();
        setOpacity(this.contentNode, 0);
        const { NOTIFY_CONFIG, NOTIFY_TYPE } = GameConfig.instance;

        this.mainAnim.setAnimation(0, this._animAppear, false);
        this.mainAnim.setCompleteListener(()=>{
            this.mainAnim.setCompleteListener(()=>{});
            const tweenShowRichText = tween(this.contentNode).then(fadeIn(0.25));
            const tweenHideRichText = tween(this.contentNode).then(fadeOut(0.25));

            tween(this.node)
                .delay(0.5)
                .call(() => {
                    let str = globalThis._.cloneDeep(Localize.instance.txtJPNotify);
                    const jackpotConfig = NOTIFY_CONFIG[NOTIFY_TYPE.JACKPOT];
                    str = formatString(str, [formatUserName(data[jackpotConfig.userName]), data[jackpotConfig.goldReward]]);
                    str = str.replace(/'/g, '"');
                    const objMessage = JSON.parse(str);
                    this.createNotifyMessage(objMessage);
                    this.contentNode.getComponent(Layout).updateLayout();

                    tweenShowRichText.start();
                })
                .delay(3.35)
                .call(()=>{
                    tweenHideRichText.start();
                })
                .delay(0.5)
                .call(() => {
                    this.mainAnim.setAnimation(0, this._animHide, false);
                    this.mainAnim.setCompleteListener(()=>{
                        this.mainAnim.clearTrack(0);
                        this.onStackMessage();
                    });
                })
                .start();
        });
        this.mainAnim.addAnimation(0, this._animIdle, true);
    }
}
