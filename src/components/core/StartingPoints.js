import StartingPointRight from '../pipes/StartingPointRight';
import StartingPointLeft from '../pipes/StartingPointLeft';
import StartingPointUp from '../pipes/StartingPointUp';
import StartingPointDown from '../pipes/StartingPointDown';

/**
 * Common validation functions used across all starting points
 * @type {Object}
 */
const commonValidations = {
  /**
   * Checks if the position is valid for all starting points
   * @param {number} row - The current row position
   * @param {number} gridRows - Total number of rows in the grid
   * @returns {boolean} True if position is valid
   */
  isValidPosition: (row, gridRows) => row < gridRows - 1,

  /**
   * Checks if there's a blocked cell below the current position
   * @param {number} row - The current row position
   * @param {number} col - The current column position
   * @param {Array<{row: number, col: number}>} blockedCells - Array of blocked cell positions
   * @returns {boolean} True if there's a blocked cell below
   */
  hasBlockedBelow: (row, col, blockedCells) => blockedCells.some((cell) => cell.row === row + 1 && cell.col === col),
};

/**
 * Direction-specific validation functions for each starting point type
 * @type {Object}
 */
const directionValidations = {
  /**
   * Validation rules for right-facing starting point
   */
  right: {
    /**
     * Checks if the column position is valid for right direction
     * Can't be the last column
     * @param {number} col - The current column position
     * @param {number} gridCols - Total number of columns in the grid
     * @returns {boolean} True if position is valid
     */
    isValidPosition: (col, gridCols) => col < gridCols - 1,

    /**
     * Checks if there's a blocked cell to the right
     * @param {number} row - The current row position
     * @param {number} col - The current column position
     * @param {Array<{row: number, col: number}>} blockedCells - Array of blocked cell positions
     * @returns {boolean} True if there's a blocked cell to the right
     */
    hasBlockedInDirection: (row, col, blockedCells) =>
      blockedCells.some((cell) => cell.row === row && cell.col === col + 1),
  },

  /**
   * Validation rules for left-facing starting point
   */
  left: {
    /**
     * Checks if the column position is valid for left direction
     * Can't be the first column
     * @param {number} col - The current column position
     * @returns {boolean} True if position is valid
     */
    isValidPosition: (col) => col > 0,

    /**
     * Checks if there's a blocked cell to the left
     * @param {number} row - The current row position
     * @param {number} col - The current column position
     * @param {Array<{row: number, col: number}>} blockedCells - Array of blocked cell positions
     * @returns {boolean} True if there's a blocked cell to the left
     */
    hasBlockedInDirection: (row, col, blockedCells) =>
      blockedCells.some((cell) => cell.row === row && cell.col === col - 1),
  },

  /**
   * Validation rules for upward-facing starting point
   */
  up: {
    /**
     * Checks if the row position is valid for upward direction
     * Can't be the first row
     * @param {number} row - The current row position
     * @returns {boolean} True if position is valid
     */
    isValidPosition: (row) => row > 0,

    /**
     * Checks if there's a blocked cell above
     * @param {number} row - The current row position
     * @param {number} col - The current column position
     * @param {Array<{row: number, col: number}>} blockedCells - Array of blocked cell positions
     * @returns {boolean} True if there's a blocked cell above
     */
    hasBlockedInDirection: (row, col, blockedCells) =>
      blockedCells.some((cell) => cell.row === row - 1 && cell.col === col),
  },

  /**
   * Validation rules for downward-facing starting point
   */
  down: {
    /**
     * Always returns true as downward position is covered by common validation
     * @returns {boolean} Always true
     */
    isValidPosition: () => true,

    /**
     * Uses common validation for checking blocked cell below
     * @param {number} row - The current row position
     * @param {number} col - The current column position
     * @param {Array<{row: number, col: number}>} blockedCells - Array of blocked cell positions
     * @returns {boolean} True if there's a blocked cell below
     */
    hasBlockedInDirection: (row, col, blockedCells) => commonValidations.hasBlockedBelow(row, col, blockedCells),
  },
};

/**
 * Configuration array for all starting point types
 * Each object contains the starting point type and its validation rules
 * @type {Array<{
 *   type: typeof StartingPoint,
 *   checkBlocked: Function,
 *   validPosition: Function
 * }>}
 */
export const STARTING_POINTS = [
  {
    type: StartingPointRight,
    checkBlocked: (row, col, blockedCells) =>
      commonValidations.hasBlockedBelow(row, col, blockedCells) ||
      directionValidations.right.hasBlockedInDirection(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) =>
      commonValidations.isValidPosition(row, gridRows) && directionValidations.right.isValidPosition(col, gridCols),
  },
  {
    type: StartingPointLeft,
    checkBlocked: (row, col, blockedCells) =>
      commonValidations.hasBlockedBelow(row, col, blockedCells) ||
      directionValidations.left.hasBlockedInDirection(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) =>
      commonValidations.isValidPosition(row, gridRows) && directionValidations.left.isValidPosition(col),
  },
  {
    type: StartingPointUp,
    checkBlocked: (row, col, blockedCells) =>
      commonValidations.hasBlockedBelow(row, col, blockedCells) ||
      directionValidations.up.hasBlockedInDirection(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) =>
      commonValidations.isValidPosition(row, gridRows) && directionValidations.up.isValidPosition(row),
  },
  {
    type: StartingPointDown,
    checkBlocked: (row, col, blockedCells) => commonValidations.hasBlockedBelow(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) => commonValidations.isValidPosition(row, gridRows),
  },
];