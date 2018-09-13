import * as React from 'react';
import {render} from 'react-dom';
import { Animated, Container, Rectangle, Stage, Text } from './index';

class App extends React.Component {

  state = {
    toggled: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  animatedValue = new Animated.Value(0);

  width = this.animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['50%', '100%']
  });

  color = this.animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 255, 0, 1)', 'rgba(255, 0, 0, 1)']
  });

  onClick = () => {
    const toggled = !this.state.toggled;
    const toValue = toggled ? 1 : 0;

    Animated
      .timing(this.animatedValue, { toValue, duration: 500, easing: Animated.Easing.linear })
      .start();

    // @ts-ignore
    this.setState({ toggled });
  };

  // @ts-ignore
  onResize = () => this.setState({ width: window.innerWidth, height: window.innerHeight });

  componentDidMount () {
    window.addEventListener('resize', this.onResize, false);
  }

  render () {

    return (
      <Stage width={ this.state.width } height={ this.state.height } style={ styles.stage }>

        {/*<Text text="An Absolutely Positioned Header" style={{ fill: 'blue', fontSize: 32 }} />*/}

        <Animated.Rectangle
          style={{ color: this.color, width: this.width, height: '50%', alignItems: 'center', justifyContent: 'center' }}
          onClick={ this.onClick }
        >
        </Animated.Rectangle>
      </Stage>
    );
  }
}

const styles = {

  stage: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  container: {
    width: '80%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },

  header: {
    width: '100%',
    height: 50,
    color: 'yellow',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  flexRight: {
    color: 'blue',
    height: '50%',
    flex: 1
  }

};

const mountNode = document.createElement('div');

document.body.appendChild(mountNode);

render(<App />, mountNode);
