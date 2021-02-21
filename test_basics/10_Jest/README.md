# 課題10「jestで単体テストを書こう」

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [課題1](#%E8%AA%B2%E9%A1%8C1)
- [課題2](#%E8%AA%B2%E9%A1%8C2)
- [課題3](#%E8%AA%B2%E9%A1%8C3)
  - [質問1: なぜ元の関数はカバレッジが100％のテストを書けなかったのか](#%E8%B3%AA%E5%95%8F1-%E3%81%AA%E3%81%9C%E5%85%83%E3%81%AE%E9%96%A2%E6%95%B0%E3%81%AF%E3%82%AB%E3%83%90%E3%83%AC%E3%83%83%E3%82%B8%E3%81%8C100%EF%BC%85%E3%81%AE%E3%83%86%E3%82%B9%E3%83%88%E3%82%92%E6%9B%B8%E3%81%91%E3%81%AA%E3%81%8B%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%8B)
  - [質問2: 依存性の注入とは何か](#%E8%B3%AA%E5%95%8F2-%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B)
    - [単純に実装した場合の問題点](#%E5%8D%98%E7%B4%94%E3%81%AB%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%9F%E5%A0%B4%E5%90%88%E3%81%AE%E5%95%8F%E9%A1%8C%E7%82%B9)
    - [Dependancy Injection](#dependancy-injection)
    - [コンストラクタ・インジェクション](#%E3%82%B3%E3%83%B3%E3%82%B9%E3%83%88%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BB%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)
    - [セッター・インジェクション](#%E3%82%BB%E3%83%83%E3%82%BF%E3%83%BC%E3%83%BB%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)
  - [質問3: 依存性の注入によるモジュール同士の結合度の強さはどのように変化したのか](#%E8%B3%AA%E5%95%8F3-%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5%E3%81%AB%E3%82%88%E3%82%8B%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E5%90%8C%E5%A3%AB%E3%81%AE%E7%B5%90%E5%90%88%E5%BA%A6%E3%81%AE%E5%BC%B7%E3%81%95%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E5%A4%89%E5%8C%96%E3%81%97%E3%81%9F%E3%81%AE%E3%81%8B)
  - [質問4: 単体テストで外部サービスとの通信が発生する場合のデメリットは何か](#%E8%B3%AA%E5%95%8F4-%E5%8D%98%E4%BD%93%E3%83%86%E3%82%B9%E3%83%88%E3%81%A7%E5%A4%96%E9%83%A8%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%A8%E3%81%AE%E9%80%9A%E4%BF%A1%E3%81%8C%E7%99%BA%E7%94%9F%E3%81%99%E3%82%8B%E5%A0%B4%E5%90%88%E3%81%AE%E3%83%87%E3%83%A1%E3%83%AA%E3%83%83%E3%83%88%E3%81%AF%E4%BD%95%E3%81%8B)
  - [質問5: sumOfArrayを空配配列時に例外ではなく0を返すように修正してみましょう](#%E8%B3%AA%E5%95%8F5-sumofarray%E3%82%92%E7%A9%BA%E9%85%8D%E9%85%8D%E5%88%97%E6%99%82%E3%81%AB%E4%BE%8B%E5%A4%96%E3%81%A7%E3%81%AF%E3%81%AA%E3%81%8F0%E3%82%92%E8%BF%94%E3%81%99%E3%82%88%E3%81%86%E3%81%AB%E4%BF%AE%E6%AD%A3%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
  - [質問6: 質問5に対応する単体テストを実装してみましょう](#%E8%B3%AA%E5%95%8F6-%E8%B3%AA%E5%95%8F5%E3%81%AB%E5%AF%BE%E5%BF%9C%E3%81%99%E3%82%8B%E5%8D%98%E4%BD%93%E3%83%86%E3%82%B9%E3%83%88%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
  - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)
- [課題4](#%E8%AA%B2%E9%A1%8C4)
- [追加調査資料](#%E8%BF%BD%E5%8A%A0%E8%AA%BF%E6%9F%BB%E8%B3%87%E6%96%99)
  - [「xUnit Test Pattern」の「Test Double」](#xunit-test-pattern%E3%81%AEtest-double)
  - [Test Double Pattern](#test-double-pattern)
  - [間接入力と間接出力](#%E9%96%93%E6%8E%A5%E5%85%A5%E5%8A%9B%E3%81%A8%E9%96%93%E6%8E%A5%E5%87%BA%E5%8A%9B)
  - [Test Stub](#test-stub)
  - [Test Spy](#test-spy)
  - [Mock Object](#mock-object)
  - [Jestが対応しているTest Double](#jest%E3%81%8C%E5%AF%BE%E5%BF%9C%E3%81%97%E3%81%A6%E3%81%84%E3%82%8Btest-double)
  - [Jest で Stub を実装する](#jest-%E3%81%A7-stub-%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B)
  - [戦略1](#%E6%88%A6%E7%95%A51)
    - [spyOn](#spyon)
    - [mock](#mock)
  - [戦略2](#%E6%88%A6%E7%95%A52)
  - [Jest で Spy を実装する](#jest-%E3%81%A7-spy-%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 課題1

優良コースですが Udemy の [Unit Testing for Typescript & NodeJs Developers with Jest](https://www.udemy.com/course/unit-testing-typescript-nodejs/) を受講しました。

TypeScriptとNode.jsを使ったアプリに対して単体テストを行う内容で非常にわかりやすかったです。

上記コースを進めながら指定されていた以下のサイトを辞書的に使ってました。

- https://jestjs.io/docs/ja/getting-started
- https://jestjs.io/docs/ja/using-matchers
- https://jestjs.io/docs/ja/asynchronous
- https://jestjs.io/docs/ja/setup-teardown
- https://jestjs.io/docs/ja/mock-functions

## 課題2

https://github.com/KeisukeShimokawa/praha-challenge-templates/tree/feature/task10-jest-unittest/jestSample

## 課題3

### 質問1: なぜ元の関数はカバレッジが100％のテストを書けなかったのか

`asyncSumOfArraySometimesZero` と `getFirstNameThrowIfLong` でカバレッジが100％のテストを記述することができない理由は、それぞれの関数がほかのオブジェクトに依存する形で実装されているためである。

`asyncSumOfArraySometimesZero ` 関数の場合は、ランダムで例外を送出してしまう `DatabaseMock` オブジェクトに依存しており、単体テストを実行するたびに挙動が変化してしまい、常にカバレッジが100％のテストを実装することが難しい。

同様に `getFirstNameThrowIfLong` 関数の場合は、外部APIに通信を行い、その結果を受けてランダムに例外を送出してしまう `NameApiService` オブジェクトに依存しており、こちらでも単体テストを実行するたびに挙動が変化してしまい、常にカバレッジが100％のテストを実装することが難しい。

### 質問2: 依存性の注入とは何か

[[Martin Fowler] Inversion of Control Containers and the Dependency Injection pattern](https://www.martinfowler.com/articles/injection.html) の記事をもとに「依存性の注入」を説明する。

#### 単純に実装した場合の問題点

以下のような特定の監督が制作した映画の一覧を取得するクラスを構造を考える。

```java
class MovieLister {
  public Movie[] moviesDirectedBy(String director) {
    List allMovies = finder.findAll();
    for (Iterator it = allMovies.iterator(); it.hasNext();) {
      Movie movie = (Movie) it.next();
      if (!movie.getDirector().equals(director)) it.remove();
    }
    return (Movie[]) allMovies.toArray(new Movie[allMovies.size()]);
  }
}
```

`moviesDirectedBy` メソッド内部で使用している `finder` オブジェクトのインスタンスは、`MovieLister` から映画のリストをどのように保存するのかを隠蔽しており、それぞれの処理を独立させることができる。

そこで以下のように映画のリストのみが定義されたインターフェースを実装する形で、具象クラスを取り扱うことを考える。

```java
public interface MovieFinder {
  List findAll();
}
```

上記のインターフェースを実装した具象クラスを使うことで、`MovieLister` クラスは 異なる実装の `finder` クラスを使用することができるようになる。

```java
class MovieLister {
	private MovieFinder finder;
	public MovieLister() {
		finder = new ColonDelimitedMovieFinder("movies1.txt");
	}
}
```

ではこの `MovieLister` をほかの開発者が使用する場合を考えてみると、以下のような問題点があげられる。

- ファイル名が違うかもしれない
- SQLやXMLファイルなど映画のリストを保存するフォーマットが異なるかもしれない

現在の実装では、上記のような問題をうまく解決することができない。

これは `MovieLister` が以下のようにインターフェースと具象クラスの両方と依存関係を有しており、異なる実装の `finder` を使用したい場合にはそもそもの `MovieLister` のソースを変更しなければならなくなるためである。

![図1](https://kakutani.com/trans/fowler/naive.gif)

理想的には `MovieLister` が `MovieFinder` インターフェースの具象クラスならばなんでも受け入れることができれば、開発者は自身が実装したい内容の `finder` クラスを利用することができる。

#### Dependancy Injection

**依存性の注入** とは上記の課題を解決するための実装パターンである。

つまり `MovieLister` が `MovieFinder` インターフェースの具象クラスならばなんでも受け入れることができるようにしておき、ほかの開発者は外部から自身が利用したい具象クラスを **注入 (inject)** することで、`MovieLister` が具象クラスに依存しないようにするパターンである。

実際には以下のように、特定のインターフェース `MovieFinder` と開発者が利用したい具象クラス `MovieFinderImpl` を紐づける設定ファイルのような役割を有する `Assembler` を使用して、該当クラスに指定した具象クラスを注入する。

![](https://kakutani.com/trans/fowler/injector.gif)

以下では依存性の注入を行うための2つの方法を紹介する。

- コンストラクタ・インジェクション
- セッター・インジェクション

#### コンストラクタ・インジェクション

最初は特定の具象クラスのインスタンスを、対象のクラスのコンストラクタに注入する方法である。

```java
class MovieLister {
  public MovieLister(MovieFinder finder) {
    this.finder = finder;
  }
}
```

上記のパターンを使用することで、`MovieLister` は インターフェース `MovieFinder` を実装している具象クラスならば何でも使用することができるようになる。

`MovieFinder` の具象クラスも以下のように実装する。

```java
class ColonMovieFinder {
  public ColonMovieFinder(String filename) {
    this.filename = filename;
  }
}
```

あとはインターフェースと利用したい具象クラスを紐づけるための設定を実施する。
開発者はこの設定を変更することで、自由に具象クラスを選択することができるようになる。

```java
private MutablePicoContainer configureContainer() {
  MutablePicoContainer pico = new DefaultPicoContainer();
  Parameter[] finderParams =  {new ConstantParameter("movies1.txt")};
  pico.registerComponentImplementation(MovieFinder.class, ColonMovieFinder.class, finderParams);
  pico.registerComponentImplementation(MovieLister.class);
  return pico;
}
```

あとは `registerComponentImplementation` メソッドに使用したい具象クラスを指定すればいいだけである。

この軽量コンテナを利用する場合には以下のように指定する。

```java
public void testWithPico() {
  MutablePicoContainer pico = configureContainer();
  MovieLister lister = (MovieLister) pico.getComponentInstance(MovieLister.class);
  Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
  assertEquals("Once Upon a Time in the West", movies[0].getTitle());
}
```

これがコンストラクタ・インジェクションであり、今回の課題の実装でもこのパターンを採用している。

#### セッター・インジェクション

2つ目は特定の具象クラスのインスタンスを、対象のクラスのセッターから注入する方法である。

```java
class MovieLister {
    private MovieFinder finder;
    public void setFinder(MovieFinder finder) {
    this.finder = finder;
    }
}
```

上記のパターンを使用することで、`MovieLister` は インターフェース `MovieFinder` を実装している具象クラスならば何でも使用することができるようになる。

`MovieFinder` の具象クラスも以下のように実装する。

```java
class ColonMovieFinder {
  public ColonMovieFinder(String filename) {
    this.filename = filename;
  }
}
```

セッター・インジェクションのパターンを採用している `Spring` では、以下のような設定ファイルを記述することで、対象のクラスに特定の具象クラスを注入することができるようになる。

```xml
<beans>
  <bean id="MovieLister" class="spring.MovieLister">
    <property name="finder">
      <ref local="MovieFinder"/>
    </property>
  </bean>
  <bean id="MovieFinder" class="spring.ColonMovieFinder">
    <property name="filename">
      <value>movies1.txt</value>
    </property>
  </bean>
</beans>
```

あとは以下のように使用すればいい。

```java
public void testWithSpring() throws Exception {
  ApplicationContext ctx = new FileSystemXmlApplicationContext("spring.xml");
  MovieLister lister = (MovieLister) ctx.getBean("MovieLister");
  Movie[] movies = lister.moviesDirectedBy("Sergio Leone");
  assertEquals("Once Upon a Time in the West", movies[0].getTitle());
}
```

### 質問3: 依存性の注入によるモジュール同士の結合度の強さはどのように変化したのか

そもそもの用語を以下のようにまとめる。

| 用語   | 内容                                   |
|:-----|:-------------------------------------|
| 凝集度 | 1つのモジュールの内部の命令がどの程度関係しているのか示す |
| 結合度 | 2つのモジュール間のつながりの強さを示す                |

より良い設計とは、凝集度が高く、結合度が低い設計である。

依存性の注入を行うことで、結合度が低いクラスを設計することができる。

> 静的にモジュールの結合度や凝集度を調べるツールはあったりするのだろうか

参考資料

- [[Wikipedia] 結合度](https://ja.wikipedia.org/wiki/%E7%B5%90%E5%90%88%E5%BA%A6)
- [[Wikipedia] 凝集度](https://ja.wikipedia.org/wiki/%E5%87%9D%E9%9B%86%E5%BA%A6)
- [モジュール結合度について](https://qiita.com/eKushida/items/39bdb3f88fb68ecd66f6)

### 質問4: 単体テストで外部サービスとの通信が発生する場合のデメリットは何か

単体テストで外部サービスと通信してしまう場合のデメリットは以下が考えられる。

- 単体テストの結果が不定  
  - 通信している外部サービスのAPIの結果によって単体テストの結果が変化する
  - 例えば使用しているAPIの仕様が変更になった場合、単体テストが失敗することになる
- 単体テストの実行速度が遅くなる
  - ネットワークの通信速度は、CPUの実行速度と比較して非常に低速である
  - テストごとに毎回通信してしまう場合、単体テストの実行速度が低下してしまう

### 質問5: sumOfArrayを空配配列時に例外ではなく0を返すように修正してみましょう

そもそもの [`Array.prototype.reduce()`] メソッドの使い方を振り返る。

```js
/*
 * @param callback      : 配列の全ての要素に対して実行される関数
 * @param initialValue  : コールバックの最初の呼び出しの最初の引数として使用する値
*/
arr.reduce(callback( accumulator, currentValue[, index[, array]] ) {
  // return result from executing something for accumulator or currentValue
}[, initialValue]);
```

つまり `sumOfArray` を以下のように変更すればいい。

```js
export const sumOfArray = (numbers: number[]): number => {
  // コールバック関数の後で空配列時の初期値を0を指定すればいい
  return numbers.reduce((a: number, b: number): number => {
      return a + b;
  }, 0);
};
```

上記の変更を加えた後でテストを実行すると、以下のようにもともと例外を送出していることを検証しているテストケースが失敗していることがわかる。

```bash
Jestで単体テストを書こう
  sumOfArray
    ✓ [1, 1]を渡すと2が返ってくる (1 ms)
    ✕ 空の配列を渡すと例外が送出される (1 ms)
    ✓ [1]を渡すと1が返ってくる
    ✓ [-2, 2]を渡すと0が返ってくる
    ✓ [0.2, 0.1]を渡すと0.3が返ってくる (1 ms)
  asyncSumOfArray
    ✓ [1, 1]を渡すと2が返ってくる
    ✕ 空の配列を渡すと例外が送出される (2 ms)
    ✓ [1]を渡すと1が返ってくる
    ✓ [-2, 2]を渡すと0が返ってくる
    ✓ [0.2, 0.1]を渡すと0.3が返ってくる (1 ms)
  asyncSumOfArraySometimesZero
    ✓ デフォルト引数のコンストラクタ
    ✓ DI: [1, 1]を渡せば2が返ってくる (1 ms)
    ✓ DI: []を渡せば0が返ってくる (1 ms)
  getFirstNameThrowIfLong
    ✓ デフォルト引数のコンストラクタ (1 ms)
    ✓ 取得した名前の長さが指定した最大値よりも短い場合はそのまま返す
    ✓ 取得した名前の長さが指定した最大値よりも長い場合に例外送出 (1 ms)

--------------|---------|----------|---------|---------|-------------------
File           | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s
---------------|-----------|------------|-----------|-----------|--------------------
All files      | 95.45     | 100        | 100       | 95.24     |
functions.ts   | 95.45     | 100        | 100       | 95.24     | 30
-------------- | --------- | ---------- | --------- | --------- | -------------------
```

注意点としては、`asyncSumOfArraySometimesZero` 関数に関しても例外が送出されなくなってしまい、コードカバレッジが100%にならないので、以下のように変更する必要がある点である。

```js
export const asyncSumOfArraySometimesZero = (
  numbers: number[],
  database: DatabaseMock = new DatabaseMock(),
): Promise<number> => {
  return new Promise((resolve): void => {
    // try {
    //   database.save(numbers);
    //   resolve(sumOfArray(numbers));
    // } catch (error) {
    //   resolve(0);
    // }
    database.save(numbers);
    resolve(sumOfArray(numbers));
  });
};
```

### 質問6: 質問5に対応する単体テストを実装してみましょう

単体テストの実装では、以下のように空配列を渡した場合の返り値を検証すればいい。

```js
test('空の配列を渡すと0が返ってくる', () => {
  // Arrange
  const expected = 0;
  // Act
  const actual = sumOfArray([]);
  // Assert
  expect(actual).toBe(expected);
});
```

### 参考資料

- [Facebook製のJavaScriptテストツール「Jest」の逆引き使用例](https://qiita.com/chimame/items/e97883fd46b67529d59f)
- [jest で非同期関数をテストするときの注意点](https://qiita.com/rikegami/items/178ed17982b13535ad59)

## 課題4

- [クイズ1](./task4-1)
  - 正規表現を使った文字列をパースする関数の単体テストを実装する
  - 具体的な実装内容は OSS の [Crowi の関数](https://github.com/crowi/crowi/blob/master/lib/service/query.ts) である。
- [クイズ2](./task4-2)
  - Rest APIに関する単体テストを実装する
  - 基本的なMVC構成であり、NoSQL型のデータベースも使用している

## 追加調査資料

### 「xUnit Test Pattern」の「Test Double」

[xUnit Test PatternsのTest Doubleパターン(Mock、Stub、Fake、Dummy等の定義)](https://goyoki.hatenablog.com/entry/20120301/1330608789) の記事をもとに、Test Double の理解を深めていく。

テストを実行する際に、テスト対象が特定のコンポーネントに依存している場合、テスト結果が依存先のコンポーネントの実装によって変化してしまい、単体テストを正しく実行することができない。

こうした場合に使用するものが「**Test Double**」である。

今回の課題でいえば、以下のようにテスト対象メソッドである `getFirstNameThrowIfLong` は、外部のモジュールである `NameApiService` クラスに依存してしまっている。

```js
export const getFirstNameThrowIfLong = async (
  maxNameLength: number
): Promise<string> => {
  const nameApiSerivce = new NameApiService();
  const firstName = await nameApiSerivce.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error("first_name too long");
  }
  return firstName;
};
```

そこで依存しているクラス `NameApiService` の代わりとなる「Test Double」を使用することで単体テストの実装が可能となる。

### Test Double Pattern

Test Double の分類は以下のように分類されている。

- Test Stub
- Test Spy
- Mock Object
- Fake Obejct
- Dummy Object

![](http://xunitpatterns.com/Types%20Of%20Test%20Doubles.gif)

> Sketch Types Of Test Doubles embedded from Types Of Test Doubles.gif

参考資料

- [[xUnit Pattern] Test Double](http://xunitpatterns.com/Test%20Double.html)

### 間接入力と間接出力

Test Double の分類は、テスト対象に対する間接入力と間接出力の違いによって分類されている。

まずは **間接入力 (Indirect Input)** である。

間接入力では、テスト対象から外部メソッドを呼び出し、その返り値を使用しているような実装になる。なお間接入力には、テスト対象が依存するメソッドなどからの例外送出も含まれている。

今回の課題でいえば、`getFirstNameThrowIfLong` は、外部のメソッドを呼び出しており、その返り値が `nameApiService.getFirstName` からテスト対象へ入力される形式となっており、間接入力のパターンだと判断できる。

```js
export const getFirstNameThrowIfLong = async (
  maxNameLength: number
): Promise<string> => {
  const nameApiSerivce = new NameApiService();
  const firstName = await nameApiSerivce.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error("first_name too long");
  }
  return firstName;
};
```

次は **間接出力 (Indirect Output)** である。

間接出力では、テスト対象内で使用している変数を、外部のメソッドなどに出力しているような実装になる。なお間接出力には、外部メソッドが実行されたかどうかや、複数のメソッドが順番通り呼び出されているのかどうかも含まれている。

今回の課題でいえば、`asyncSumOfArraySometimesZero` は、外部のメソッド `database.save` に対して `numbers` という変数を出力している形になるため、間接出力のパターンだと判断できる。

```js
export const asyncSumOfArraySometimesZero = (
  numbers: number[]
): Promise<number> => {
  return new Promise((resolve): void => {
    try {
      const database = new DatabaseMock();
      database.save(numbers);
      resolve(sumOfArray(numbers));
    } catch (error) {
      resolve(0);
    }
  });
};
```

以下ではざっくりと Test Stub、Test Spy、Mock Objectについて説明する。

### Test Stub

**Test Stub** とは、テスト対象に任意の間接入力が出力されるように、事前に間接入力値を設定できるような Test Double になる。

!()[http://cdn-ak.f.st-hatena.com/images/fotolife/g/goyoki/20120301/20120301221310.png]

> [xUnit Test PatternsのTest Doubleパターン(Mock、Stub、Fake、Dummy等の定義)](https://goyoki.hatenablog.com/entry/20120301/1330608789)

今回の課題でいえば、以下のテスト対象である `getFirstNameThrowIfLong` に対して、テスト実行時に `nameApiSerivce.getFirstName()` の間接入力値を任意に設定できるようなオブジェクトが Test Stub に該当する。

```js
export const getFirstNameThrowIfLong = async (
  maxNameLength: number
): Promise<string> => {
  const nameApiSerivce = new NameApiService();
  const firstName = await nameApiSerivce.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error("first_name too long");
  }
  return firstName;
};
```

### Test Spy

**Test Spy** とは、テスト対象が依存先メソッドに間接出力した値を記録しておき、テストコードから参照可能にする Test Double になる。

!()[http://cdn-ak.f.st-hatena.com/images/fotolife/g/goyoki/20120301/20120301221311.png]

> [xUnit Test PatternsのTest Doubleパターン(Mock、Stub、Fake、Dummy等の定義)](https://goyoki.hatenablog.com/entry/20120301/1330608789)

### Mock Object

**Mock Object** とは、以下の用途で使用される Test Double になる。

- テスト対象の間接出力値を期待結果として有する
- テスト実行時に、実際のテスト対象の間接出力値を取得する
- Mock Object 内で期待結果とテスト結果を比較検証する
- テストコードは、Mock Object から検証の成功・失敗の判定を受け取る

!()[http://cdn-ak.f.st-hatena.com/images/fotolife/g/goyoki/20120301/20120301221312.png]

> [xUnit Test PatternsのTest Doubleパターン(Mock、Stub、Fake、Dummy等の定義)](https://goyoki.hatenablog.com/entry/20120301/1330608789)

### Jestが対応しているTest Double

Jest では下記の図の中の **Test Double の観点** で API を提供しており、厳密に Test Stub や Mock Object に該当する機能を提供しているわけではないため、使用の際には注意が必要である。

![](http://xunitpatterns.com/Types%20Of%20Test%20Doubles.gif)

### Jest で Stub を実装する

Stub ではテスト対象への間接入力値を外部メソッドに設定することである。

これは以下の関数の中で `nameApiService.getFirstName()` の間接入力値を設定することと同じである。

```js
export const getFirstNameThrowIfLongWithoutDependancies = async (
  maxNameLength: number,
): Promise<string> => {
  const nameApiSerivce = new NameApiService();
  const firstName = await nameApiSerivce.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error('first_name too long');
  }
  return firstName;
};
```

単体テストを実装するにあたっていくつかの戦略が存在している。

- 戦略1
  - Jest の `spyOn` や `mock` を使用して、外部メソッドを呼び出した際に実行される処理の中身をモック化する
- 戦略2
  - 依存性の注入を行って、外部から依存しているメソッドをモック化する

### 戦略1

戦略1の場合、元のテスト対象のコードを変更することはない。

```js
export const getFirstNameThrowIfLongWithoutDependancies = async (
  maxNameLength: number,
): Promise<string> => {
  const nameApiSerivce = new NameApiService();
  const firstName = await nameApiSerivce.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error('first_name too long');
  }
  return firstName;
};
```

上記の関数が依存している `NameApiService` クラスの `getFirstName` メソッドの間接入力値を、テスト実装から行うようにする。

これは Jest の `spyOn` と `mock` を使用することで実現できる。

#### spyOn

以下のようにテスト対象の `getFirstNameThrowIfLong` メソッドを実行した際に呼び出される外部メソッドの `getFirstName` をモック化させている。

```js
import * as functions from '../functions';
import { NameApiService } from '../nameApiService';

describe('Stubの使い方を学ぶ', (): void => {
  let spy: jest.SpyInstance;

  beforeEach((): void => {
    spy = jest.spyOn(NameApiService.prototype, 'getFirstName');
  });

  afterEach((): void => {
    spy.mockRestore();
  });

  test('getFirstNameThrowIfLong', async (): Promise<void> => {
    // Arrange
    const expected = '1234';
    const maxNameLength = 5;
    spy.mockResolvedValueOnce(expected);
    // Act
    const actual = await functions.getFirstNameThrowIfLongWithoutDependancies(
      maxNameLength,
    );
    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(actual).toBe(expected);
  });
});
```

- [`jest.spyOn`](https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname)
  - デフォルトではスパイさせたメソッドが呼び出される
  - `mock`と異なり、後から元の実装に戻すことも可能

#### mock

依存するモジュール自体をモック化させる方法も存在している。

```js
import * as functions from '../functions.stub';
import { NameApiService } from '../nameApiService';

jest.mock('../nameApiService');

describe('Stubの使い方を学ぶ', (): void => {
  const nameApiServiceMock = NameApiService as jest.MockedClass<
    typeof NameApiService
  >;

  afterEach((): void => {
    nameApiServiceMock.mockClear();
  });

  test('getFirstNameThrowIfLong', async (): Promise<void> => {
    // Arrange
    const expected = '1234';
    const maxNameLength = 5;
    nameApiServiceMock.prototype.getFirstName.mockResolvedValueOnce(expected);
    // Act
    const actual = await functions.getFirstNameThrowIfLongWithoutDependancies(
      maxNameLength,
    );
    // Assert
    expect(nameApiServiceMock).toHaveBeenCalledTimes(1);
    expect(actual).toBe(expected);
  });
});
```

### 戦略2

依存性の注入を行うことで、テスト対象が依存している外部メソッドを、テスト対象の内部ではなく外部から指定できるように関数やクラスを設計することである。

つまり以下のように関数呼び出し時に、依存しているオブジェクトを注入することである。

```js
export const getFirstNameThrowIfLongWithDependancies = async (
  maxNameLength: number,
  // 依存性の注入
  nameApiSerivce: NameApiService = new NameApiService(),
): Promise<string> => {
  const firstName = await nameApiSerivce.getFirstName();

  if (firstName.length > maxNameLength) {
    throw new Error('first_name too long');
  }
  return firstName;
};
```

これで後はモック化させた依存クラスをテストコードから、テスト対象メソッドに対して注入すればいい。

```js
describe('DIを使用するバージョン', (): void => {
  // 注入するクラスをモック化させておく
  const nameApiServiceMock = NameApiService as jest.MockedClass<
    typeof NameApiService
  >;

  afterEach((): void => {
    nameApiServiceMock.mockClear();
  });

  test('正常ケース', async (): Promise<void> => {
    // Arrange
    const expected = '1234';
    const maxNameLength = 5;
    // 外部メソッドの実装とその返り値を設定しテスト対象メソッドに注入する
    nameApiServiceMock.prototype.getFirstName.mockResolvedValueOnce(expected);
    // Act
    const actual = await functions.getFirstNameThrowIfLongWithDependancies(
      maxNameLength,
      nameApiServiceMock.prototype,
    );
    // Assert
    expect(actual).toBe(expected);
  });
})
```

### Jest で Spy を実装する

Spy ではテスト対象から外部メソッドへの間接出力値を記録しておく必要がある。

これは以下の関数の中で `database.save(numbers)` に対する間接出力値を設定することと同じである。

```js
export const asyncSumOfArraySometimesZeroWithoutDependancies = (
  numbers: number[],
): Promise<number> => {
  return new Promise((resolve): void => {
    try {
      const database = new DatabaseMock();
      database.save(numbers);
      resolve(sumOfArray(numbers));
    } catch (error) {
      resolve(0);
    }
  });
};
```

単体テストを実装するにあたっていくつかの戦略が存在している。

- 戦略1
  - Jest の `spyOn` や `mock` を使用して、外部メソッドを呼び出した際に実行される処理の中身をモック化する
- 戦略2
  - 依存性の注入を行って、外部から依存しているメソッドをモック化する

### 戦略1

Test Spy の場合、テスト対象から外部メソッドに対する間接出力値を検証する必要があるが、`spyOn` でも `mock` でも入出力値は保持しているので実装可能である。

#### spyOn

`spyOn` を使用する場合にはテスト対象から呼び出す外部メソッドの実装は、正常終了か異常終了かの違いさえわかっていればいい。

```js
describe('Diを使用しないバージョン', (): void => {
  let spy: jest.SpyInstance;

  beforeEach((): void => {
    spy = jest.spyOn(DatabaseMock.prototype, 'save');
  });

  afterEach((): void => {
    // spyして記録した入出力情報をクリアする
    spy.mockClear();
  });

  test('正常ケース', async (): Promise<void> => {
    // Arrange
    const expected = 2;
    const testData = [1, 1];
    spy.mockImplementation((): void => {});
    // Act
    const actual = await functions.asyncSumOfArraySometimesZeroWithoutDependancies(
      testData,
    );
    // Assert
    expect(spy.mock.calls[0][0]).toEqual(testData);
    expect(actual).toBe(expected);
  });
});
```

正常ケースの場合は以上のようにテスト用の実装を追加し、そのあとで Test Spy を呼び出した際の引数を検証すればいい。

異常ケースの場合には以下のように例外を送出るような実装を追加する。

なお送出する例外の種類によって処理が分岐する場合は、網羅できるように全パターンの例外送出を試すべきである。

```js
test('異常ケース', async (): Promise<void> => {
  // Arrange
  const expected = 0;
  const testData = [1, 1];
  // 例外を送出する実装
  spy.mockImplementationOnce((): void => {
    throw new Error('fail!');
  });
  // Act
  const actual = await functions.asyncSumOfArraySometimesZeroWithoutDependancies(
    testData,
  );
  // Assert
  expect(spy.mock.calls[0][0]).toEqual(testData);
  expect(actual).toBe(expected);
});
```

#### mock

`mock` を使用する場合もほとんど実装の形式に変化はない。

```js
describe('Diを使用しないバージョン', (): void => {
  const databaseMockMock = DatabaseMock as jest.MockedClass<
    typeof DatabaseMock
  >;

  beforeEach((): void => {
    databaseMockMock.mockClear();
  });

  test('正常ケース', async (): Promise<void> => {
    // Arrange
    const expected = 2;
    const testData = [1, 1];
    databaseMockMock.prototype.save.mockImplementationOnce((): void => {});
    // Act
    const actual = await functions.asyncSumOfArraySometimesZeroWithoutDependancies(
      testData,
    );
    // Assert
    expect(databaseMockMock.prototype.save.mock.calls[0][0]).toEqual(
      testData,
    );
    expect(actual).toBe(expected);
  });
});
```

### 戦略2

依存性の注入の場合には、以下のように実装できる。

それほど大きく形式が変化しているわけではない。

```js
describe('Diを使用するバージョン', (): void => {
  const databaseMockMock = DatabaseMock as jest.MockedClass<
    typeof DatabaseMock
  >;

  beforeEach((): void => {
    databaseMockMock.mockClear();
  });

  test('正常ケース', async (): Promise<void> => {
    // Arrange
    const expected = 2;
    const testData = [1, 1];
    databaseMockMock.prototype.save.mockImplementationOnce((): void => {});
    // Act
    const actual = await functions.asyncSumOfArraySometimesZeroWithDependancies(
      testData,
      databaseMockMock.prototype,
    );
    // Assert
    expect(databaseMockMock.prototype.save.mock.calls[0][0]).toEqual(
      testData,
    );
    expect(actual).toBe(expected);
  });
});
```