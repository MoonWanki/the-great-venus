import React, { Component } from 'react';
import { Container } from 'react-pixi-fiber';
import Animated from 'animated';
import Easing from 'animated/lib/Easing';
import StatueSpriteRoller from './StatueSpriteRoller';
import StatueEditor from './StatueEditor';
import StatueStatusView from './StatueStatusView';
import $ from 'jquery';

class MyStatueList extends Component {

    state = {
        currentSelected: 0,
        currentSelectedOffset: new Animated.Value(0),
        editorOn: false,
        editorOffset: new Animated.Value(0),
        statues: [
            {
                name: "HaeTae",
                hp: 20,
                atk: 30,
                def: 10,
                crt: 12,
                avd: 5
            },
            {
                name: "Guiliano",
                hp: 24,
                atk: 100,
                def: 29,
                crt: 15,
                avd: 5
            },
            {
                name: "Agrippa",
                hp: 32,
                atk: 150,
                def: 55,
                crt: 15,
                avd: 5
            },
        ]
    }

    componentDidMount = () => {
        $(document).on('mousewheel DOMMouseScroll', (e) => {
            const E = e.originalEvent;
            if (E.detail) { // if firefox
                if(E.detail > 0) this.onMouseWheelDown();
                else this.onMouseWheelUp();
            } else {
                if(E.wheelDelta < 0) this.onMouseWheelDown();
                else this.onMouseWheelUp();
            };
        });
    }

    componentWillUnmount = () => $(document).off('mousewheel DOMMouseScroll');

    onMouseWheelDown = () => {
        if(!this.state.editorOn && this.state.currentSelected < 10) this.toNthStatue(this.state.currentSelected + 1);
    }

    onMouseWheelUp = () => {
        if(!this.state.editorOn && this.state.currentSelected > 0) this.toNthStatue(this.state.currentSelected - 1);
    }

    toNthStatue = (N) => {
        this.setState({ currentSelected: N });
        Animated.timing(this.state.currentSelectedOffset, { toValue: N, duration: 1000, easing: Easing.bezier(0.1, 0.8, 0.3, 1) }).start();
    }

    onEditStart = (N) => {
        this.toNthStatue(N);
        this.setState({ editorOn: true });
        Animated.timing(this.state.editorOffset, { toValue: 1 }).start();
    }

    onEditFinish = () => {
        this.setState({ editorOn: false });
        Animated.timing(this.state.editorOffset, { toValue: 0 }).start();
    }

    render() {

        const { currentSelected, currentSelectedOffset, statues, editorOffset } = this.state;
        return (
            <Container {...this.props}>
                <StatueSpriteRoller
                    x={currentSelectedOffset.interpolate({
                        inputRange: [0, statues.length-1],
                        outputRange: [this.props.width/3, (statues.length-1) * (-this.props.width/3) + this.props.width/3]
                    })}
                    y={this.props.height/6}
                    width={this.props.width}
                    height={this.props.height}
                    statues={statues}
                    currentSelected={currentSelected}
                    offset={currentSelectedOffset._value}
                    onClickItem={this.onEditStart} />
                <StatueEditor
                    info={statues[currentSelected]}
                    offset={editorOffset} />
                <StatueStatusView
                    
                    status={statues[currentSelected]} />
            </Container>
        );
    }
}

export default Animated.createAnimatedComponent(MyStatueList);