export enum Cell {
  Dead = 0,
  Alive = 1,
}

export type Board = Cell[][];

const createArray = <T>(length: number, mapFn: (v: unknown, n: number) => T) => {
  return Array.from({ length }, mapFn);
};

export type Location = {
  x: number;
  y: number;
};

export class GameOfLife {
  private readonly neighborsRelativeLocations: Location[] = [
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
  ];

  private board: Board;

  private readonly neighborsToStayAlive = [2, 3];

  private readonly neighborsToBecomeAlive = 3;

  constructor(private readonly width: number, private readonly height: number) {
    this.board = this.makeBoard(height, width);
  }

  private makeBoard(height: number, width: number): Board {
    return createArray(height, () => createArray(width, () => Cell.Dead));
  }

  getBoard() {
    return this.board;
  }

  setCell({ x, y }: Location, cell: Cell) {
    this.board[y][x] = cell;
  }

  getCell({ x, y }: Location): Cell | undefined {
    return this.board[y]?.[x];
  }

  nextGeneration() {
    const cellLocationsToKill: Location[] = [];
    const cellLocationsToMakeAlive: Location[] = [];

    this.forEachCell((cell, location) => {
      const aliveNeighborsCount = this.getAliveNeighborsCount(location);
      const hasEnoughNeighborsToStayAlive = this.neighborsToStayAlive.includes(aliveNeighborsCount);
      const hasEnoughNeighborsToBecomeAlive = aliveNeighborsCount === this.neighborsToBecomeAlive;

      if (cell === Cell.Alive) {
        if (!hasEnoughNeighborsToStayAlive) cellLocationsToKill.push(location);
      } else if (hasEnoughNeighborsToBecomeAlive) cellLocationsToMakeAlive.push(location);
    });

    cellLocationsToKill.forEach((l) => this.setCell(l, Cell.Dead));
    cellLocationsToMakeAlive.forEach((l) => this.setCell(l, Cell.Alive));
  }

  forEachCell(callback: (c: Cell, location: Location) => void): void {
    this.board.forEach((row, y) => row.forEach((cell, x) => callback(cell, { y, x })));
  }

  private getAliveNeighborsCount(location: Location): number {
    return this.getNeighbors(location).filter((c) => c === Cell.Alive).length;
  }

  private getNeighbors({ x: cX, y: cY }: Location): Cell[] {
    return this.neighborsRelativeLocations
      .map(({ x, y }) => this.getCell({ x: cX + x, y: cY + y }))
      .filter((c) => c !== undefined) as Cell[];
  }
}
