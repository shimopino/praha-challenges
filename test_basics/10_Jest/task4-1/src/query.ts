// https://github.com/crowi/crowi/blob/master/lib/service/query.ts

/**
 * 検索対象の文字列が与えられた際、まず文字列の両端の空白を削除した後で、スペース、タブ、改ページ、改行を含むホワイトスペース文字を、半角空白に変換する
 *
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions
 *
 * @param query 検索対象の文字列
 */
export const normalize = (query: string) => {
  return query.trim().replace(/\s+/g, ' ');
};

/**
 * 検索文字列をキーワードとフレーズに分解する
 * -"" や "" にマッチする文字列を空文字に置換する
 * スペース、タブ、改ページ、改行を含むホワイトスペース文字で分割する
 *
 * @param query 検索対象の文字列
 */
export const splitKeywordsAndPhrases = (query: string) => {
  const phraseRegExp = /(-?"[^"]*")/g;
  const keywords = query
    .replace(phraseRegExp, '')
    .split(/\s+/g)
    .filter(Boolean);
  const phrases = (query.match(phraseRegExp) || []).map(normalize);
  return {keywords, phrases};
};

/**
 * 検索文字列が `-` で開始しているかどうかでネガポジ判定をする
 *
 * @param queries 検索対象としている複数の文字列
 */
export const splitPositiveAndNegative = (queries: string[]) => {
  const positive: string[] = [];
  const negative: string[] = [];
  queries.forEach(query => {
    const isNegative = query.startsWith('-');
    const target = isNegative ? negative : positive;
    const newQuery = isNegative ? query.substr(1) : query;

    if (newQuery) {
      target.push(newQuery);
    }
  });
  return {positive, negative};
};

/**
 * 引用として指定される "" の文字列を削除する
 * 検索文字列が `-` で開始している場合は最初の2文字と最後の1文字を除外
 * 違う場合は最初と最後の1文字を除外する
 *
 * @param query 検索対象の文字列
 */
export const unquote = (query: string) => {
  return query.startsWith('-') ? `-${query.slice(2, -1)}` : query.slice(1, -1);
};

type PositiveAndNegative<T> = {
  positive: T;
  negative: T;
};

export type SearchQuery = {
  keywords: PositiveAndNegative<string[]>;
  phrases: PositiveAndNegative<string[]>;
};

/**
 * まずは検索文字列をキーワードとフレーズに分割する
 * その後キーワードとフレーズをそれぞれネガポジに分割する
 * フレーズに関しては引用文字列 "" を削除する
 *
 * @param query 検索対象の文字列
 */
export const parseQuery = (query: string): SearchQuery => {
  const {keywords, phrases} = splitKeywordsAndPhrases(normalize(query));
  const {
    positive: positiveKeywords,
    negative: negativeKeywords,
  } = splitPositiveAndNegative(keywords);
  const {
    positive: positivePhrases,
    negative: negativePhrases,
  } = splitPositiveAndNegative(phrases);

  return {
    keywords: {
      positive: positiveKeywords,
      negative: negativeKeywords,
    },
    phrases: {
      positive: positivePhrases.map(unquote).filter(Boolean),
      negative: negativePhrases.map(unquote).filter(Boolean),
    },
  };
};
