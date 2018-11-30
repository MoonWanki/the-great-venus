import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from "pixi.js";

export default CustomPIXIComponent({
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, newProps) => {
        const { color, x, y, width, height, alpha } = newProps;
        instance.clear();
        if(newProps.borderColor) instance.lineStyle(2, newProps.borderColor, 1);
        instance.beginFill(color||0x0);
        instance.drawRect(x||0, y||0, width||0, height||0);
        instance.endFill();
        instance.alpha = alpha||1;
    },
}, 'Box');