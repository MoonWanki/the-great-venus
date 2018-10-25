import React, { Component, Fragment } from 'react';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Statue from 'Client/Components/Statue';
import Animated from 'animated';

const AnimatedBlackBox = Animated.createAnimatedComponent(Box);
const AnimatedFlatButton = Animated.createAnimatedComponent(FlatButton);

class SignUpUI extends Component {

    state = {
        name: '',
        statueLook: {
            skin: 0,
            eye: 0,
            hair: 0,
        }
    }

    componentDidMount = () => {
        
    }
    
    render() {
        const { offset, stageWidth, stageHeight } = this.props;
        // const boxSize = { w: contentWidth*3/5, h: contentHeight*3/5 };
        return (
            <Fragment>
                <AnimatedBlackBox
                    color={0x0}
                    x={0}
                    y={0}
                    width={stageWidth}
                    height={stageHeight}
                    alpha={offset.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] })} />
                <Statue
                    x={100} y={300}
                    no={0}
                    skin={this.state.statueLook.skin}
                    eye={this.state.statueLook.eye}
                    hair={this.state.statueLook.hair} />

                {['머리1', '머리2', '머리3', '머리4', '머리5'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={800 + 110*i}
                    y={300}
                    alpha={offset}
                    width={100}
                    height={36}
                    text={name}
                    onClick={()=>this.setState(state=>({ statueLook: {...state.statueLook, hair: i }}))} />
                )}
                {['눈1', '눈2', '눈3', '눈4'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={800 + 110*i}
                    y={400}
                    alpha={offset}
                    width={100}
                    height={36}
                    text={name}
                    onClick={()=>this.setState(state=>({ statueLook: {...state.statueLook, eye: i }}))} />
                )}
                {['연한 회색', '회색', '짙은 회색'].map((name, i) => 
                    <AnimatedFlatButton
                    key={i}
                    x={800 + 110*i}
                    y={500}
                    alpha={offset}
                    width={100}
                    height={36}
                    text={name}
                    onClick={()=>this.setState(state=>({ statueLook: {...state.statueLook, skin: i }}))} />
                )}

                <AnimatedFlatButton
                    x={stageWidth - 280}
                    y={offset.interpolate({ inputRange: [0, 1], outputRange: [stageHeight, stageHeight - 86] })}
                    alpha={offset}
                    width={180}
                    height={36}
                    text={'GO'}
                    onClick={this.props.onFinish} />
            </Fragment>
        );
    }
}

export default SignUpUI;