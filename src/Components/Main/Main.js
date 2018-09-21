import React, { Component } from 'react';
import { Stage, Text } from "react-pixi-fiber";
import * as PIXI from 'pixi.js';

class Main extends Component {

    state = {
        w: window.innerWidth,
        h: window.innerHeight-6,
        loader: PIXI.loader,
        resource: PIXI.loader.resources,
        loadingImage: '',
        loadingProgress: 0,
    }

    componentDidMount() {
        window.onresize = () => {
            this.setState({
                w: window.innerWidth,
                h: window.innerHeight-6
            })
        }

        this.state.loader.add([
            "../../images/bg1/1.png",
            "../../images/bg1/2.png",
            "../../images/bg1/3.png",
            "../../images/bg1/4.png",
            "../../images/bg1/5.png",
            "../../images/bg1/6.png",
            "../../images/bg1/7.png",
            "../../images/bg2/1.png",
            "../../images/bg2/2.png",
            "../../images/bg2/3.png",
            "../../images/bg2/4.png",
            "../../images/bg2/5.png",
            "../../images/bg2/6.png",
            "../../images/bg2/7.png",
            "../../images/bg2/8.png",
            "../../images/bg2/9.png",
            "../../images/bg3/1.png",
            "../../images/bg3/2.png",
            "../../images/bg3/3.png",
            "../../images/bg3/4.png",
            "../../images/bg3/5.png",
            "../../images/bg3/6.png",
            "../../images/bg3/7.png",
            "../../images/bg3/8.png",
            "../../images/bg4/1.png",
            "../../images/bg4/2.png",
            "../../images/bg4/3.png",
            "../../images/bg4/4.png",
            "../../images/bg4/5.png",
        ])
        .on("progress", this.loadProgressHandler)
        .load(this.setup);
    }

    loadProgressHandler = (loader, resource) => {
        this.setState({ loadingImage: resource.url, loadingProgress: Math.floor(loader.progress) })
    }
      
    setup = () => {
        console.log("setup"); 
      
    }

    render() {
        const { w, h, loadingImage, loadingProgress } = this.state;
        return (
            <div style={{ background: 'black', overflow: 'hidden'}}>
                <Stage options={{ backgroundColor: 0x0 }} width={this.state.w} height={this.state.h} >
                    <Text text={`로딩 중...${loadingProgress}%\n${loadingImage}`} style={{ fill: 0xffff00, fontSize: 14 }} x={w/2} y={h/2}/>
                </Stage>
            </div>
        );
    }
}

export default Main;