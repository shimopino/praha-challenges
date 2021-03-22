import * as functions from '../src/script';

describe('掛け算を行う add メソッドのTDD', () => {
  it('引数に1と2を渡して3が返る', () => {
    // Arrange
    const arg1 = 1;
    const arg2 = 2;
    const expected = 3;
    // Act
    const actual = functions.add(arg1, arg2);
    // Assert
    expect(actual).toBe(expected);
  });

  it.todo('引数を30個まで受け取る', () => {
    // Arrage
    const args: number[] = [...Array(30).keys()];
    const mockAdd = jest.fn() as jest.MockedFunction<typeof functions.add>;
    // Act
    const actual = mockAdd(...args);
    // Assert
    expect(mockAdd).toHaveBeenCalledWith(...args);
  });

  it.todo('引数を31個まで受け取った場合にエラーが発生する');
  it.todo('引数を渡さなかった場合にエラーが発生する');
  it.todo('引数が数字以外の場合にエラーが発生する');
  it.todo('計算結果が1001以上の場合に「too big」が返される');
  it.todo('計算結果が1000のときは1000がそのまま返される');
});
