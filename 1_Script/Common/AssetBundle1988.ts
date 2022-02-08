import gfAssetBundle from "../../../cc30-fishbase/Scripts/Common/gfAssetBundle";

export default class AssetBundle1988 extends gfAssetBundle {
    public static instance: AssetBundle1988 = null;

    constructor() {
        super();
        AssetBundle1988.instance = this;
    }

    destroy() {
        super.destroy();
        AssetBundle1988.instance = null;
    }
}

