import React, { Component, Fragment } from 'react';
import { Container, Text } from 'react-pixi-fiber';
import Box from 'Client/Components/Box';
import FlatButton from 'Client/Components/FlatButton';
import Animated from 'animated';

const AnimatedBox = Animated.createAnimatedComponent(Box);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class EquipDisplay extends Component {

    state = {
        borderPointPosition: [
            new Animated.ValueXY({ x: 0, y: 0 }),
            new Animated.ValueXY({ x: this.props.width- 4, y: this.props.height*2/3 - 4 }),
        ]
    }

    componentDidMount = () => {
        this.runBorderFX();
    }

    runBorderFX = async () => {
        while(true) {
            Animated.timing(this.state.borderPointPosition[0].y, { toValue: this.props.height*2/3 - 4, duration: 400 }).start();
            Animated.timing(this.state.borderPointPosition[1].y, { toValue: 0, duration: 400 }).start();
            await sleep(400);
            Animated.timing(this.state.borderPointPosition[0].x, { toValue: this.props.width - 4, duration: 600 }).start();
            Animated.timing(this.state.borderPointPosition[1].x, { toValue: 0, duration: 600 }).start();
            await sleep(600);
            Animated.timing(this.state.borderPointPosition[0].y, { toValue: 0, duration: 400 }).start();
            Animated.timing(this.state.borderPointPosition[1].y, { toValue: this.props.height*2/3 - 4, duration: 400 }).start();
            await sleep(400);
            Animated.timing(this.state.borderPointPosition[0].x, { toValue: 0, duration: 600 }).start();
            Animated.timing(this.state.borderPointPosition[1].x, { toValue: this.props.width - 4, duration: 600 }).start();
            await sleep(600);
        }
    }

    render() {
        const { width, height, isWorking, valueName, lookNames } = this.props;
        const { value, level, look } = this.props.equip;
        return (
            <Container {...this.props}>
                <Text text={this.props.partName} anchor={[0, 1]} style={{ fill: 0xffffff, fontSize: 16 }} />
                {level ? // 강화
                    <Container interactive width={width} height={height*2/3}>
                        <Box width={width} height={height*2/3} alpha={0.5} />
                        <Text x={width/3} y={15} text={`+${level} ${lookNames[look - 1]}\n\n${valueName} +${value}`} style={{ fill: 0xffffff, fontSize: 16 }}/>
                    </Container>
                : <Container interactive width={width} height={height*2/3}>
                    <FlatButton
                        x={0}
                        width={width/3}
                        height={height*2/3}
                        text={this.props.lookNames[0]}
                        onClick={() => this.props.onBuyEquip(1)} />
                    <FlatButton
                        x={width/3}
                        width={width/3}
                        height={height*2/3}
                        text={this.props.lookNames[1]}
                        onClick={() => this.props.onBuyEquip(2)} />
                    <FlatButton
                        x={width*2/3}
                        width={width/3}
                        height={height*2/3}
                        text={this.props.lookNames[2]}
                        onClick={() => this.props.onBuyEquip(3)} />
                </Container>
                }
                {isWorking && <Fragment>
                    <Box interactive width={width} height={height*2/3} alpha={0.5} />
                    <AnimatedBox color={0xFFFFFF} x={this.state.borderPointPosition[0].x} y={this.state.borderPointPosition[0].y} width={4} height={4} />
                    <AnimatedBox color={0xFFFFFF} x={this.state.borderPointPosition[1].x} y={this.state.borderPointPosition[1].y} width={4} height={4} />
                </Fragment>}
                {level ?
                    isWorking ? <FlatButton y={height*2/3 + 4} width={width} height={height/3} text={'강화중입니다...'} onClick={null}/>
                        : <FlatButton y={height*2/3 + 4} width={width} height={height/3} text={'강화'} onClick={this.props.onUpgradeEquip}/>
                    :isWorking && <FlatButton y={height*2/3 + 4} width={width} height={height/3} text={'장착중입니다...'} />}
            </Container>
        );
    }
}

export default EquipDisplay;