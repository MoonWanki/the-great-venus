import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import $ from 'jquery';
import Statue from 'Client/Components/Statue';

class StatueDisplayRoller extends Component {

    componentDidMount = () => {
        $(document).on('mousewheel DOMMouseScroll', (e) => {
            const E = e.originalEvent;
            if (E.detail) { // if firefox
                if(E.detail > 0) this.props.onMousewheel(1);
                else this.props.onMousewheel(-1);
            } else {
                if(E.wheelDelta < 0) this.props.onMousewheel(1);
                else this.props.onMousewheel(-1);
            };
        });
    }

    componentWillUnmount = () => $(document).off('mousewheel DOMMouseScroll');

    renderStatues = () => {
        let iterator = [];
        for(let i=0 ; i<=this.props.maxStatue ; i++) iterator.push(i);
        return iterator.map(i => {
            if(i<this.props.numStatues) {
                return <Statue
                    key={i}
                    click={()=>this.props.onClick(i)}
                    x={this.props.width/2 + i*this.props.gapBetweenStatues}
                    y={this.props.height}
                    no={0}
                    scale={1.4}
                    skin={this.props.defaultStatueLook.skin}
                    eye={this.props.defaultStatueLook.eye}
                    hair={this.props.defaultStatueLook.hair} />

            } else {
                return <Statue
                    key={i}
                    click={()=>this.props.onClick(i)}
                    x={this.props.width/2 + i*this.props.gapBetweenStatues}
                    y={this.props.height}
                    no={0}
                    scale={1.4}
                    skin={this.props.defaultStatueLook.skin}
                    eye={this.props.defaultStatueLook.eye}
                    hair={this.props.defaultStatueLook.hair}
                    tint={0x010101} />
            }
        })
    }

    render() {
        return (
            <Container {...this.props}>
                {this.renderStatues()}
            </Container>
        );
    }
}

export default StatueDisplayRoller;