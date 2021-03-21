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
    it.todo('引数を30個まで受け取れるようにする');
    it.todo('引数を30個まで受け取ってその掛け算を返す');
    it.todo('引数を31個まで受け取ってエラーが発生する');
    it.todo('引数を渡さなかった場合にエラーが発生する');
    it.todo('引数が数字以外の場合にエラーが発生する');
    it.todo('計算結果が1000を超える場合に「big big number」を表示する');
  });
});
