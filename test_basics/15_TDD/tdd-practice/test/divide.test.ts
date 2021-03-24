import * as functions from '../src/script';
import { ErrorMessage } from '../src/enums';

describe('割り算を行う divide メソッドのTDD', () => {
  it('引数に4と2を渡して2が返る', () => {
    // Arrange
    const arg1 = 4;
    const arg2 = 2;
    const expected = 2;
    // Act
    const actual = functions.divide(arg1, arg2);
    // Assert
    expect(actual).toBe(expected);
  });

  it('引数に5と2を渡して2.5が返る（有限小数）', () => {
    // Arrange
    const arg1 = 5;
    const arg2 = 2;
    const expected = 2.5;
    // Act
    const actual = functions.divide(arg1, arg2);
    // Assert
    expect(actual).toBe(expected);
  });

  it('引数に1と3を渡して0.333が返る（無限小数）', () => {
    // Arrange
    const arg1 = 1;
    const arg2 = 3;
    const expected = 0.333;
    // Act
    const actual = functions.divide(arg1, arg2);
    // Assert
    expect(actual).toBe(expected);
  });

  it('引数を30個まで受け取ることができる', () => {
    // Arrange
    const args: number[] = [...Array(30).keys()];
    const mockDivide = jest.fn() as jest.MockedFunction<
      typeof functions.divide
    >;
    // Act
    const actual = mockDivide(...args);
    // Assert
    expect(mockDivide).toHaveBeenCalledWith(...args);
  });

  it('引数を31個まで受け取った場合にエラーが発生する', () => {
    // Arrange
    const args: number[] = [...Array(31).keys()];
    // Act & Assert
    expect(() => functions.divide(...args)).toThrow(ErrorMessage.ARG_RANGE);
  });

  it('引数を渡さなかった場合にエラーが発生する', () => {
    // Act & Assert
    expect(() => functions.divide()).toThrow(ErrorMessage.ARG_RANGE);
  });

  it.todo('引数が数字以外の場合にエラーが発生する');
});
