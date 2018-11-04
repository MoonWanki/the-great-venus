import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from "pixi.js";

export default CustomPIXIComponent({
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, { color=0x0, x=0, y=0, width=100, height=100, alpha=1 }) => {
        if (typeof oldProps !== "undefined") {
            instance.clear();
        }
        instance.beginFill(color);
        instance.drawRect(x, y, width, height);
        instance.endFill();
        instance.alpha = alpha;
    },
}, 'Box');