# 課題3

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [コンポーネントのライフサイクル](#%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB)
  - [マウントとアンマウント](#%E3%83%9E%E3%82%A6%E3%83%B3%E3%83%88%E3%81%A8%E3%82%A2%E3%83%B3%E3%83%9E%E3%82%A6%E3%83%B3%E3%83%88)
  - [constructor](#constructor)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## コンポーネントのライフサイクル

Reactが提供しているクラスコンポーネントのライフサイクルを例に、凝集度を考える。

![](../assets/react-component-lifecycle.png)

> 引用元: https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

### マウントとアンマウント

Reactにおけるマウントとアンマウントをまず理解する。

- マウント
  - コンポーネントが、最初にDOMとして描画されるときのこと
- アンマウント
  - コンポーネントに対して、生成されたDOMが削除されるときのこと

クラスコンポーネントでは、コンポーネントがマウントされたり、アンマウントされた際に、特別なメソッドを使用することでコードを実行することが可能である。

以下ではクラスコンポーネントにおける特別なメソッドの例を挙げる。

### constructor

Reactのコンポーネントのコンストラクタは、 **マウントされる前** に呼び出されるライフサイクルメソッドであり、コンポーネントに状態を持たせることが可能となる。

具体的には以下のように、コンストラクタ内でコンポーネントに持たせたい状態を定義することで、ライフサイクルにまたがって状態を管理することが可能となる。

```js
class Clock extends React.Component {
  constructor(props) {
    // 継承元に props を渡さないと this.props が未定義となってしまう
    super(props);

    // コンポーネントで管理したい状態を定義する
    this.state = { counter: 0 };

    // イベントハンドラは、インスタンスにバインドさせておく
    this.handleClick = this.handleClick.bind(this);
  }
}
```

## 参考資料

- [state とライフサイクル](https://ja.reactjs.org/docs/state-and-lifecycle.html)
