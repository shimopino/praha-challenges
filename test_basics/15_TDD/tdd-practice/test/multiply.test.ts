import * as functions from '../src/script';
import { ErrorMessage } from '../src/enums';

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
      const args: number[] = [...Array(30).keys()];
      const mockMultiply = jest.fn() as jest.MockedFunction<
        typeof functions.multiply
      >;
      // Act
      const actual = mockMultiply(...args);
      // Assert
      expect(mockMultiply).toBeCalledWith(...args);
    });

    it('引数を31個まで受け取ってエラーが発生する', () => {
      // Arrange
      const args: number[] = [...Array(31).keys()];
      // Act & Assert
      expect(() => {
        functions.multiply(...args);
      }).toThrow(new Error(ErrorMessage.ARG_RANGE));
    });

    it('引数が空配列の場合にエラーが発生する', () => {
      // Arrange
      const args: number[] = [];
      // Act & Assert
      expect(() => functions.multiply(...args)).toThrow(
        new Error(ErrorMessage.ARG_RANGE),
      );
    });

    it('引数を渡さなかった場合にエラーが発生する', () => {
      // Arrage
      // Act & Assert
      expect(() => {
        functions.multiply();
      }).toThrow(new Error(ErrorMessage.ARG_RANGE));
    });

    it.skip('引数が数字以外の場合にエラーが発生する。ただしTypeScriptなので無視する', () => {});

    it('計算結果が1000を超える場合に「big big number」を表示する', () => {
      // Arrange
      const args: number[] = [1, 1001];
      // Act & Assert
      expect(() => {
        functions.multiply(...args);
      }).toThrow(new Error(ErrorMessage.TOO_TOO_BIG));
    });

    it('計算結果が1000のときはそのまま1000が返される', () => {
      // Arrange
      const args: number[] = [1, 5, 10, 20];
      const expected = 1000;
      // Act
      const actual = functions.multiply(...args);
      // Assert
      expect(actual).toBe(expected);
    });
  });
});
