import { Cell, GameOfLife } from '../GameOfLife';

describe('GameOfLife', () => {
  let game: GameOfLife;

  beforeEach(() => {
    game = new GameOfLife(5, 5);
  });

  it('creates a 5x5 game with all cells being dead', () => {
    expect(game.getBoard()).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });

  describe('on setCell call', () => {
    it('sets cell on the specified location', () => {
      game.setCell({ x: 4, y: 0 }, Cell.Alive);
      game.setCell({ x: 4, y: 4 }, Cell.Alive);
      game.setCell({ x: 2, y: 2 }, Cell.Alive);

      expect(game.getBoard()).toEqual([
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1],
      ]);
    });

    it("doesn't change the cell if it's the same as specified", () => {
      game.setCell({ x: 4, y: 0 }, Cell.Dead);
      game.setCell({ x: 4, y: 4 }, Cell.Dead);
      game.setCell({ x: 2, y: 2 }, Cell.Dead);

      game.setCell({ x: 0, y: 0 }, Cell.Alive);
      game.setCell({ x: 0, y: 0 }, Cell.Alive);

      expect(game.getBoard()).toEqual([
        [1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
    });
  });

  it('returns cell at the specified location on getCell call ', () => {
    const location = { x: 2, y: 2 };
    game.setCell(location, Cell.Alive);
    expect(game.getCell(location)).toBe(Cell.Alive);
  });

  describe('on nextGeneration call', () => {
    it("doesn't change board if all cells are dead", () => {
      game.nextGeneration();

      expect(game.getBoard()).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
    });

    it('kills a cell if it has no alive neighbors', () => {
      const location = { x: 2, y: 2 };
      game.setCell(location, Cell.Alive);

      game.nextGeneration();

      expect(game.getCell(location)).toBe(Cell.Dead);
    });

    describe("doesn't kill cell if it has two alive neighbors", () => {
      test('on the left and on the right', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);
        game.setCell({ x: 1, y: 2 }, Cell.Alive);
        game.setCell({ x: 3, y: 2 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });

      test('on top and beneath', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);
        game.setCell({ x: 2, y: 1 }, Cell.Alive);
        game.setCell({ x: 2, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });

      test('on top left and bottom right', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);
        game.setCell({ x: 1, y: 1 }, Cell.Alive);
        game.setCell({ x: 3, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });

      test('on top right and on bottom left', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);
        game.setCell({ x: 3, y: 1 }, Cell.Alive);
        game.setCell({ x: 1, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });
    });

    describe("doesn't kill cell if it has three alive neighbors", () => {
      test('on the top', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);

        game.setCell({ x: 1, y: 1 }, Cell.Alive);
        game.setCell({ x: 2, y: 1 }, Cell.Alive);
        game.setCell({ x: 3, y: 1 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });

      test('on the bottom', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);

        game.setCell({ x: 1, y: 3 }, Cell.Alive);
        game.setCell({ x: 2, y: 3 }, Cell.Alive);
        game.setCell({ x: 3, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });

      test('on the left', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);

        game.setCell({ x: 1, y: 1 }, Cell.Alive);
        game.setCell({ x: 1, y: 2 }, Cell.Alive);
        game.setCell({ x: 1, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });

      test('on the right', () => {
        game.setCell({ x: 2, y: 2 }, Cell.Alive);

        game.setCell({ x: 3, y: 1 }, Cell.Alive);
        game.setCell({ x: 3, y: 2 }, Cell.Alive);
        game.setCell({ x: 3, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
      });
    });

    describe('makes a dead cell alive if it has three alive neighbors', () => {
      it('on the top', () => {
        game.setCell({ x: 1, y: 1 }, Cell.Alive);
        game.setCell({ x: 2, y: 1 }, Cell.Alive);
        game.setCell({ x: 3, y: 1 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
        expect(game.getCell({ x: 2, y: 0 })).toBe(Cell.Alive);
      });

      it('on the right', () => {
        game.setCell({ x: 3, y: 1 }, Cell.Alive);
        game.setCell({ x: 3, y: 2 }, Cell.Alive);
        game.setCell({ x: 3, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
        expect(game.getCell({ x: 4, y: 2 })).toBe(Cell.Alive);
      });

      it('on the bottom', () => {
        game.setCell({ x: 1, y: 3 }, Cell.Alive);
        game.setCell({ x: 2, y: 3 }, Cell.Alive);
        game.setCell({ x: 3, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
        expect(game.getCell({ x: 2, y: 4 })).toBe(Cell.Alive);
      });

      it('on the left', () => {
        game.setCell({ x: 1, y: 1 }, Cell.Alive);
        game.setCell({ x: 1, y: 2 }, Cell.Alive);
        game.setCell({ x: 1, y: 3 }, Cell.Alive);

        game.nextGeneration();

        expect(game.getCell({ x: 2, y: 2 })).toBe(Cell.Alive);
        expect(game.getCell({ x: 0, y: 2 })).toBe(Cell.Alive);
      });
    });
  });

  describe('integration', () => {
    describe('oscillators', () => {
      test('blinker', () => {
        const game = new GameOfLife(5, 5);
        game.setCell({ x: 1, y: 2 }, Cell.Alive);
        game.setCell({ x: 2, y: 2 }, Cell.Alive);
        game.setCell({ x: 3, y: 2 }, Cell.Alive);

        Array.from({ length: 10 }).forEach(() => {
          game.nextGeneration();
          expect(game.getBoard()).toEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
          ]);

          game.nextGeneration();
          expect(game.getBoard()).toEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
          ]);
        });
      });

      test('beacon', () => {
        const game = new GameOfLife(6, 6);

        game.setCell({ x: 1, y: 1 }, Cell.Alive);
        game.setCell({ x: 2, y: 1 }, Cell.Alive);
        game.setCell({ x: 1, y: 2 }, Cell.Alive);

        game.setCell({ x: 4, y: 4 }, Cell.Alive);
        game.setCell({ x: 3, y: 4 }, Cell.Alive);
        game.setCell({ x: 4, y: 3 }, Cell.Alive);

        Array.from({ length: 10 }).forEach(() => {
          game.nextGeneration();
          expect(game.getBoard()).toEqual([
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
          ]);

          game.nextGeneration();
          expect(game.getBoard()).toEqual([
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
          ]);
        });
      });
    });

    describe('still lifes', () => {
      test('block', () => {
        const game = new GameOfLife(4, 4);
        game.setCell({ x: 1, y: 1 }, Cell.Alive);
        game.setCell({ x: 2, y: 1 }, Cell.Alive);
        game.setCell({ x: 1, y: 2 }, Cell.Alive);
        game.setCell({ x: 2, y: 2 }, Cell.Alive);

        Array.from({ length: 10 }).forEach(() => {
          game.nextGeneration();
          expect(game.getBoard()).toEqual([
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
          ]);
        });
      });

      test('loaf', () => {
        const game = new GameOfLife(6, 6);

        game.setCell({ x: 2, y: 1 }, Cell.Alive);
        game.setCell({ x: 3, y: 1 }, Cell.Alive);

        game.setCell({ x: 4, y: 2 }, Cell.Alive);
        game.setCell({ x: 4, y: 3 }, Cell.Alive);

        game.setCell({ x: 1, y: 2 }, Cell.Alive);
        game.setCell({ x: 2, y: 3 }, Cell.Alive);
        game.setCell({ x: 3, y: 4 }, Cell.Alive);

        Array.from({ length: 10 }).forEach(() => {
          game.nextGeneration();
          expect(game.getBoard()).toEqual([
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 1, 0],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
          ]);
        });
      });
    });

    test('glider', () => {
      const game = new GameOfLife(5, 5);
      game.setCell({ x: 1, y: 1 }, Cell.Alive);
      game.setCell({ x: 1, y: 3 }, Cell.Alive);
      game.setCell({ x: 2, y: 3 }, Cell.Alive);
      game.setCell({ x: 2, y: 2 }, Cell.Alive);
      game.setCell({ x: 3, y: 2 }, Cell.Alive);

      game.nextGeneration();

      expect(game.getBoard()).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ]);

      game.nextGeneration();

      expect(game.getBoard()).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 0, 0],
      ]);

      game.nextGeneration();

      expect(game.getBoard()).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 1, 0],
      ]);

      game.nextGeneration();

      expect(game.getBoard()).toEqual([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1],
        [0, 0, 1, 1, 0],
      ]);
    });
  });
});
