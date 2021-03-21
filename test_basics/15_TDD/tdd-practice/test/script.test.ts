import * as functions from '../src/script';

// 掛け算
describe('TDDの練習', () => {
  describe('multiply', () => {
    it('引数に3と2を渡して6が返る', () => {
      // Arrange
      const arg1 = 3;
      const arg2 = 2;
      const expected = 6;
      // Act
      const actual = functions.multiply(arg1, arg2);
      // Assert
      expect(actual).toBe(expected);
    });
    it('引数を30個まで受け取ってその掛け算を返す', () => {
      // Arrange
      const args: number[] = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
      ];
      const expected = args.reduce(
        (previousValue: number, currentValue: number): number => {
          return previousValue * currentValue;
        },
      );
      // Act
      const actual = functions.multiply(...args);
      // Assert
      expect(actual).toBe(expected);
    });
    it('引数を31個まで受け取ってエラーが発生する', () => {
      // Arrange
      const args: number[] = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
      ];
      const expectedErrorMessage = '引数の数は30個以内にしてください';
      // Act & Assert
      expect(() => {
        functions.multiply(...args);
      }).toThrow(new Error(expectedErrorMessage));
    });
    it('引数を渡さなかった場合にエラーが発生する', () => {
      // Arrange
      const args: number[] = [];
      // Act & Assert
      expect(() => functions.multiply(...args)).toThrow(
        new Error('引数の数は1個以上30個以内にしてください'),
      );
    });
    it.todo('引数が数字以外の場合にエラーが発生する');
    it.todo('計算結果が1000を超える場合に「big big number」を表示する');
  });
});
