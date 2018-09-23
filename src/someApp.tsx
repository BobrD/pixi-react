import * as React from 'react';
import { Animated, Container, Text } from './reconciler/index';

export class SomeApp extends React.Component {

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
      <Container width={ this.state.width } height={ this.state.height } style={ styles.stage }>

        <Text text={`An Absolutely Positioned Header ${Math.random()}`} style={{ fill: 'blue', fontSize: 32 }} />

        <Animated.Rectangle
          style={{ color: this.color, width: this.width, height: '50%', alignItems: 'center', justifyContent: 'center' }}
          onClick={ this.onClick }
        >
        </Animated.Rectangle>
      </Container>
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

