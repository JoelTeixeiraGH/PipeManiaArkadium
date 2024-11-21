import { Container, Graphics, Text } from 'pixi.js';

export default class GameOverScreen {
  constructor({ app, currentDistance, targetDistance }) {
    this.app = app;
    this.currentDistance = currentDistance;
    this.targetDistance = targetDistance;
    this.container = new Container();
    this.createScreen();
  }

  createScreen() {
    this.createOverlay();
    this.createMessage();
    this.createStats();
  }

  createOverlay() {
    const overlay = new Graphics()
      .fill({ color: 0x111111, alpha: 0.85 })
      .rect(0, 0, this.app.screen.width, this.app.screen.height);
    this.container.addChild(overlay);
  }

  createMessage() {
    const messageStyle = {
      fontFamily: 'Impact',
      fontSize: 64,
      fontWeight: 'bold',
      fill: '#FF3333',
      stroke: {
        color: '#2A2A2A',
        width: 6,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 6,
      letterSpacing: 4,
      lineJoin: 'bevel',
    };

    this.message = new Text({
      text: 'SYSTEM FAILURE',
      style: messageStyle,
    });

    this.message.anchor.set(0.5);
    this.message.position.set(this.app.screen.width / 2, this.app.screen.height / 2 - 20);
    this.message.scale.set(0);
    this.container.addChild(this.message);

    this.animateMessage();
  }

  createStats() {
    const statsStyle = {
      fontFamily: 'Impact',
      fontSize: 28,
      fill: '#A4A4A4',
      stroke: {
        color: '#2A2A2A',
        width: 2,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 3,
      letterSpacing: 2,
    };

    this.statsText = new Text({
      text: `SYSTEM HALT AT: ${this.currentDistance}/${this.targetDistance}`,
      style: statsStyle,
    });

    this.statsText.anchor.set(0.5);
    this.statsText.position.set(this.app.screen.width / 2, this.message.y + this.message.height + 40);
    this.statsText.alpha = 0;
    this.container.addChild(this.statsText);

    setTimeout(() => this.fadeInStats(), 500);
  }

  animateMessage() {
    let scale = 0;
    const animate = () => {
      if (scale < 1) {
        scale += 0.05;
        this.message.scale.set(scale);
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  fadeInStats() {
    const fadeIn = () => {
      if (this.statsText.alpha < 1) {
        this.statsText.alpha += 0.05;
        requestAnimationFrame(fadeIn);
      }
    };
    fadeIn();
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}