import {parseQuery, SearchQuery} from '../src/query';

describe('query test suite', () => {
  // test.todo('テストを実装してみましょう。');
  test('インプット：test', () => {
    const testData = 'test';
    const expected: SearchQuery = {
      keywords: {
        positive: ['test'],
        negative: [],
      },
      phrases: {
        positive: [],
        negative: [],
      },
    };

    const received = parseQuery(testData);

    expect(received).toEqual(expected);
  });

  test('インプット：-test', () => {
    const testData = '-test';
    const expected: SearchQuery = {
      keywords: {
        positive: [],
        negative: ['test'],
      },
      phrases: {
        positive: [],
        negative: [],
      },
    };

    const received = parseQuery(testData);

    expect(received).toEqual(expected);
  });

  test('インプット："test"', () => {
    const testData = '"test"';
    const expected: SearchQuery = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: ['test'],
        negative: [],
      },
    };

    const received = parseQuery(testData);

    expect(received).toEqual(expected);
  });

  test('インプット：-"test"', () => {
    const testData = '-"test"';
    const expected: SearchQuery = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: [],
        negative: ['test'],
      },
    };

    const received = parseQuery(testData);

    expect(received).toEqual(expected);
  });

  test('インプット：--"test"', () => {
    const testData = '--"test"';
    const expected: SearchQuery = {
      keywords: {
        positive: [],
        negative: [],
      },
      phrases: {
        positive: [],
        negative: ['test'],
      },
    };

    const received = parseQuery(testData);

    expect(received).toEqual(expected);
  });

  test('インプット：testa -testb "testc" -"testd" --"teste"', () => {
    const testData = 'testa -testb "testc" -"testd" --"teste"';
    const expected: SearchQuery = {
      keywords: {
        positive: ['testa'],
        negative: ['testb'],
      },
      phrases: {
        positive: ['testc'],
        negative: ['testd', 'teste'],
      },
    };

    const received = parseQuery(testData);

    expect(received).toEqual(expected);
  });
});
