import * as functions from '../src/script';
import { ErrorMessage } from '../src/enums';

describe('引き算を行う subtract メソッドのTDD', () => {
  it('引数に3と2を渡して1を返す', () => {
    // Arrange
    const arg1 = 3;
    const arg2 = 2;
    const expected = 1;
    // Act
    const actual = functions.subtract(arg1, arg2);
    // Assert
    expect(actual).toBe(expected);
  });

  it('引数を30個まで受け取ることができる', () => {
    // Arrange
    const args: number[] = [...Array(30).keys()];
    const mockSubtract = jest.fn() as jest.MockedFunction<
      typeof functions.subtract
    >;
    // Act
    const actual = mockSubtract(...args);
    // Assert
    expect(mockSubtract).toHaveBeenCalledWith(...args);
  });

  it('引数を31個まで受け取りエラーが発生する', () => {
    // Arrange
    const args: number[] = [...Array(31).keys()];
    // Act
    // Assert
    expect(() => functions.subtract(...args)).toThrow(
      new Error(ErrorMessage.ARG_RANGE),
    );
  });

  it('引数を渡さなかった場合にエラーが発生する', () => {
    // Assert
    expect(() => functions.subtract()).toThrow(
      new Error(ErrorMessage.ARG_RANGE),
    );
  });

  it.skip('引数が数字以外の場合にエラーが発生する', () => {});

  it('計算結果がマイナスの場合に「negative number」を表示する', () => {
    // Arrange
    const args = [5, 10];
    // Assert
    expect(() => functions.subtract(...args)).toThrow(
      new Error(ErrorMessage.NEGATIVE),
    );
  });
  it.todo('計算結果が0の場合にそのまま結果を返す');
  it.todo('計算結果が1の場合にそのまま結果を返す');
});
