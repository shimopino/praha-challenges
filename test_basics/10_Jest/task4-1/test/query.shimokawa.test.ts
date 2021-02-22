import {parseQuery} from '../src/query';

describe('query test suite', () => {
  test(' test を入力する', (): void => {
    // Arrange
    const queries = 'test';
    const expected = {
      keywords: {
        positive: ['test'],
        negative: [],
      },
      phrases: {
        positive: [],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' "test" を入力する', (): void => {
    // Arrange
    const queries = '"test"';
    const expected = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: ['test'],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' -test を入力する', (): void => {
    // Arrange
    const queries = '-test';
    const expected = {
      keywords: {
        positive: [],
        negative: ['test'],
      },
      phrases: {
        positive: [],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' -"test" を入力する', (): void => {
    // Arrange
    const queries = '-"test"';
    const expected = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: [],
        negative: ['test'],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' --test を入力する', (): void => {
    // Arrange
    const queries = '--test';
    const expected = {
      keywords: {
        positive: [],
        negative: ['-test'],
      },
      phrases: {
        positive: [],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' - を入力する', (): void => {
    // Arrange
    const queries = '-';
    const expected = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: [],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' -"" を入力する', (): void => {
    // Arrange
    const queries = '-""';
    const expected = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: [],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' "-test" を入力する', (): void => {
    // Arrange
    const queries = '"-test"';
    const expected = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: ['-test'],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' "-" を入力する', (): void => {
    // Arrange
    const queries = '"-"';
    const expected = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: ['-'],
        negative: [],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });

  test(' 組み合わせ を入力する', (): void => {
    // Arrange
    const queries = 'positive "p-phrase" -negative -"n-phrase"';
    const expected = {
      keywords: {
        positive: ['positive'],
        negative: ['negative'],
      },
      phrases: {
        positive: ['p-phrase'],
        negative: ['n-phrase'],
      },
    };
    // Act
    const actual = parseQuery(queries);
    // Assert
    expect(actual).toEqual(expected);
  });
});
