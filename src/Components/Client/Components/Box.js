import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from "pixi.js";

export default CustomPIXIComponent({
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, { color, x, y, width, height, alpha }) => {
        if (typeof oldProps !== "undefined") {
            instance.clear();
        }
        instance.beginFill(color);
        instance.drawRect(x, y, width, height);
        instance.endFill();
        instance.alpha = alpha;
    },
}, 'BlackBox');