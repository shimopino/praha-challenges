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

  it.todo('引数を30個まで受け取ることができる');
  it.todo('引数を31個まで受け取りエラーが発生する');
  it.todo('引数を渡さなかった場合にエラーが発生する');
  it.todo('引数が数字以外の場合にエラーが発生する');
  it.todo('計算結果がマイナスの場合に「negative number」を表示する');
  it.todo('計算結果が0の場合にそのまま結果を返す');
  it.todo('計算結果が1の場合にそのまま結果を返す');
});
