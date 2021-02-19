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
  - [質問3: 依存性の注入によるモジュール同士の結合度の強さはどのように変化したのか](#%E8%B3%AA%E5%95%8F3-%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5%E3%81%AB%E3%82%88%E3%82%8B%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E5%90%8C%E5%A3%AB%E3%81%AE%E7%B5%90%E5%90%88%E5%BA%A6%E3%81%AE%E5%BC%B7%E3%81%95%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E5%A4%89%E5%8C%96%E3%81%97%E3%81%9F%E3%81%AE%E3%81%8B)
  - [質問4: 単体テストで外部サービスとの通信が発生する場合のデメリットは何か](#%E8%B3%AA%E5%95%8F4-%E5%8D%98%E4%BD%93%E3%83%86%E3%82%B9%E3%83%88%E3%81%A7%E5%A4%96%E9%83%A8%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%A8%E3%81%AE%E9%80%9A%E4%BF%A1%E3%81%8C%E7%99%BA%E7%94%9F%E3%81%99%E3%82%8B%E5%A0%B4%E5%90%88%E3%81%AE%E3%83%87%E3%83%A1%E3%83%AA%E3%83%83%E3%83%88%E3%81%AF%E4%BD%95%E3%81%8B)
  - [質問5: sumOfArrayを空配配列時に例外ではなく0を返すように修正してみましょう](#%E8%B3%AA%E5%95%8F5-sumofarray%E3%82%92%E7%A9%BA%E9%85%8D%E9%85%8D%E5%88%97%E6%99%82%E3%81%AB%E4%BE%8B%E5%A4%96%E3%81%A7%E3%81%AF%E3%81%AA%E3%81%8F0%E3%82%92%E8%BF%94%E3%81%99%E3%82%88%E3%81%86%E3%81%AB%E4%BF%AE%E6%AD%A3%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
  - [質問6: 質問5に対応する単体テストを実装してみましょう](#%E8%B3%AA%E5%95%8F6-%E8%B3%AA%E5%95%8F5%E3%81%AB%E5%AF%BE%E5%BF%9C%E3%81%99%E3%82%8B%E5%8D%98%E4%BD%93%E3%83%86%E3%82%B9%E3%83%88%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
- [課題4](#%E8%AA%B2%E9%A1%8C4)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

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

### 質問4: 単体テストで外部サービスとの通信が発生する場合のデメリットは何か

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
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |   95.45 |      100 |     100 |   95.24 |                   
 functions.ts |   95.45 |      100 |     100 |   95.24 | 30                
--------------|---------|----------|---------|---------|-------------------
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

## 課題4

 

## 参考資料

- [Facebook製のJavaScriptテストツール「Jest」の逆引き使用例](https://qiita.com/chimame/items/e97883fd46b67529d59f)