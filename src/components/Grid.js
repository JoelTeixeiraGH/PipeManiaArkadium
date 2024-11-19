import { Container, Assets } from 'pixi.js';
import Tile from './Tile'; // Import the Tile class
import NewBlocksRow from './NewBlocksRow';

// Tiles
import basicTile from '../assets/bg_basic_tile.png';
import explosion5Tile from '../assets/bg_explosion_5.png';
import startingPointRightTile from '../assets/starting_point_right.png';
import blockedTile from '../assets/blocked_tile.png';

export default class Grid {
  constructor({ app }) {
    this.app = app;
    // Grid size
    this.gridRows = 9;
    this.gridCols = 7;
    // Tile size
    this.spriteWidth = 26;
    this.spriteHeight = 26;
    this.spriteScale = 2;

    // Calculate scale for responsive grid
    const scaleX = window.innerWidth / (this.gridCols * this.spriteWidth);
    const scaleY = window.innerHeight / (this.gridRows * this.spriteHeight);
    this.scaleFactor = Math.min(scaleX, scaleY);

    // Grid container
    this.gridContainer = new Container();
    app.stage.addChild(this.gridContainer);

    // Other properties
    this.blockedCells = [];
    this.startingPoint = null;
    this.newBlocksRow = new NewBlocksRow({ app, grid: this });
  }

  async init() {
    // Load textures
    const basicGridTileTexture = await Assets.load(basicTile);
    basicGridTileTexture.source.scaleMode = 'nearest';
    const explosion5TileTexture = await Assets.load(explosion5Tile);
    const startingPointTexture = await Assets.load(startingPointRightTile);
    startingPointTexture.source.scaleMode = 'nearest';
    const blockedTileTexture = await Assets.load(blockedTile);
    blockedTileTexture.source.scaleMode = 'nearest';

    // Create grid tiles
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const tile = new Tile({
          texture: basicGridTileTexture,
          row,
          col,
          label: 'Basic',
        });

        // Scale and position the tile
        tile.scale.set(this.spriteScale);
        tile.x = col * this.spriteWidth * this.spriteScale;
        tile.y = row * this.spriteHeight * this.spriteScale;

        // Randomly block tiles
        if (Math.random() < 0.05) {
          tile.blockTile(blockedTileTexture); // Use the Tile class method
          this.blockedCells.push({ row, col });
        } else {
          tile.on('pointerdown', (event) => this.onPointerDown(event, explosion5TileTexture));
        }

        // Add the tile to the container
        this.gridContainer.addChild(tile);
      }
    }

    this.startingPoint = this.placeStartingPoint(startingPointTexture);

    // Center the grid on the screen
    this.gridContainer.x = (this.app.renderer.width - this.gridContainer.width) / 2;
    this.gridContainer.y = (this.app.renderer.height - this.gridContainer.height) / 2;
  }

  placeStartingPoint(startingPointTexture) {
    let validStartPosition = false;
    let startRow, startCol;

    while (!validStartPosition) {
      startRow = Math.floor(Math.random() * (this.gridRows - 1)); // Exclude the last row
      startCol = Math.floor(Math.random() * (this.gridCols - 1)); // Exclude the last column

      // Check if the below and right cells are blocked
      const isBlockedBelow = this.blockedCells.some((cell) => cell.row === startRow + 1 && cell.col === startCol);
      const isBlockedRight = this.blockedCells.some((cell) => cell.row === startRow && cell.col === startCol + 1);

      if (!isBlockedBelow && !isBlockedRight) {
        validStartPosition = true;
      }
    }

    const startingTile = this.getTileAt(startRow, startCol);
    startingTile.texture = startingPointTexture;
    startingTile.interactive = false;
    startingTile.buttonMode = false;

    return startingTile;
  }

  getTileAt(row, col) {
    if (row < 0 || row >= this.gridRows || col < 0 || col >= this.gridCols) {
      return null; // Return null if out of bounds
    }
    const index = row * this.gridCols + col;
    return this.gridContainer.getChildAt(index); // This will return a Tile instance
  }

  onPointerDown(event, newTexture) {
    const tile = event.currentTarget;
    const newTile = this.newBlocksRow.replaceTileInGrid();

    // Update the clicked tile
    tile.texture = newTile.texture;
    tile.label = newTile.label;

    // Shift new blocks row to the left
    this.newBlocksRow.shiftToLeft();
  }
}
