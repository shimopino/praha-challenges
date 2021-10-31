# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Atomic Design](#atomic-design)
  - [自然界からの着想](#%E8%87%AA%E7%84%B6%E7%95%8C%E3%81%8B%E3%82%89%E3%81%AE%E7%9D%80%E6%83%B3)
  - [Atom とは](#atom-%E3%81%A8%E3%81%AF)
  - [Molecules とは](#molecules-%E3%81%A8%E3%81%AF)
  - [Organisms とは](#organisms-%E3%81%A8%E3%81%AF)
  - [Templates とは](#templates-%E3%81%A8%E3%81%AF)
  - [Pages とは](#pages-%E3%81%A8%E3%81%AF)
  - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)
- [Class/Functional Component](#classfunctional-component)
  - [Functional Component](#functional-component)
  - [Class Component](#class-component)
  - [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99-1)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> TODO: 以下の画像例を課題 2 に合わせて修正する

## Atomic Design

### 自然界からの着想

自然界は、元素を組み合わせることで複雑な現実世界を構成しており、以下の要素で構成されている。

- 原子
  - 全ての物質の基本的な構成要素になる
  - 1 つ 1 つに固有の性質があり、これ以上分解すると機能的な意味が失われる
- 分子
  - 原子が 2 つ以上結合したグループである
  - 原子の有する基本的な性質よりも、より実用的なものとなる
- 分子の集合体
  - 様々な分子の集合体である
  - 1 つのユニットとして機能しており、代表例に人間が存在する

Web におけるインターフェースも同じように原子要素に分解することが可能であり、`Josh Duck` 氏は以下のような HTML 要素の周期表を提案している。

![](https://atomicdesign.bradfrost.com/images/content/html-periodic-table.png)

そこで **Atomic Design** では、Web のインターフェースを以下の 5 要素に分けて考えている。

1. Atom
2. Molecules
3. Organisms
4. Templates
5. Pages

![](https://atomicdesign.bradfrost.com/images/content/atomic-design-process.png)

### Atom とは

インターフェースにおける原子とは、ユーザーインターフェースを構成する基本的な要素のことであり、ラベルや入力欄、ボタンなどの、これ以上分解できない要素のことを表している。

![](https://atomicdesign.bradfrost.com/images/content/atoms-form-elements.png)

### Molecules とは

インターフェースにおける分子とは、組み合わせることで機能する UI 要素の単純なグループのことである。

原子同士を組み合わせることで、インターフェースに目的を持たせることが可能となる。ラベルやボタン、入力欄だけでは何もできないが、それぞれを組み合わせることでログインフォームやお問い合わせフォームなどの、目的を持った UI を構築することができる。

![](https://atomicdesign.bradfrost.com/images/content/molecule-search-form.png)

### Organisms とは

インタフェースにおける **Organisms** とは、目的を持たせた分子を組み合わせたものであり、以下のヘッダーのように独立したセクションを構築する。

![](https://atomicdesign.bradfrost.com/images/content/organism-header.png)

### Templates とは

インターフェースにおける **Templates** とは、ページレベルのオブジェクトの対してレイアウトを配置して、全体のコンテンツの構造を明確にしたものである。

以下を見るとわかるようにワイヤーフレームに近いものである。なお、画像のサイズの変更や見出しや文章の文字数の変更など、コンテンツの動的な性質を考慮する必要がある点に注意である。

![](https://atomicdesign.bradfrost.com/images/content/template.png)

### Pages とは

テンプレートに対して具体的にメディアなどを配置させた具体例である。

![](https://atomicdesign.bradfrost.com/images/content/page.png)

### 参考資料

- [Atomic Design](https://atomicdesign.bradfrost.com/table-of-contents/)

## Class/Functional Component

クラスコンポーネントと関数コンポーネントの違いを確認するために、数値をカウントアップ / カウントダウンさせるコンポーネントを作成する。

### Functional Component

関数コンポーネントでは、hooks を使用してコンポーネントの状態管理を行っており、props も関数を実行する際の引数として指定する形式である。

```ts
type FunctionalComponentProps = {
  initial: number;
  min: number;
  max: number;
};

export const FunctionalComponent = ({
  initial = 0,
  min = 0,
  max = 10,
}: FunctionalComponentProps) => {
  const [count, setCount] = useState(initial);

  const increment = () => {
    if (count < max) {
      setCount((prev) => prev + 1);
    }
  };
  const decrement = () => {
    if (count > min) {
      setCount((prev) => prev - 1);
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  );
};
```

### Class Component

クラスコンポーネントでは、状態管理をクラスのプロパティを通して行っており、クラスのインスタンス化の際の初期値として props を渡している。

また関数コンポーネントと異なり、`render()` 関数を使用して JSX を返す必要がある点や、イベント発生時に実行する関数の指定方法などで、クラスのスコープを考慮する必要がある。

```ts
type ClassComponentProps = {
  initial: number;
  min: number;
  max: number;
};

type ClassComponentState = {
  count: number;
};

export class ClassComponent extends Component<
  ClassComponentProps,
  ClassComponentState
> {
  state: ClassComponentState = {
    count: this.props.initial,
  };

  increment = () => {
    if (this.state.count < this.props.max) {
      this.setState({ count: this.state.count + 1 });
    }
  };

  decrement = () => {
    if (this.state.count > this.props.min) {
      this.setState({ count: this.state.count - 1 });
    }
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>increment</button>
        <button onClick={this.decrement}>decrement</button>
      </div>
    );
  }
}
```

### 参考資料

- [https://github.com/typescript-cheatsheets/react](https://github.com/typescript-cheatsheets/react)
