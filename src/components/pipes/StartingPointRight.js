import { Texture } from 'pixi.js';
import Pipe from './Pipe';
import startingPointRight from '../../assets/sprites/starting_points/starting_point_right.png';

export default class StartingPointRight extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointRight',
    });

    this.canFlowRight = true;

    this.loadTexture(startingPointRight);

    this.makeInteractive();
  }

  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'not-allowed';
  }

  isLocked() {
    return true;
  }
}
