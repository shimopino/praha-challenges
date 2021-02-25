# 公式のチュートリアルのリファクタリング

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [概要](#%E6%A6%82%E8%A6%81)
  - [v1: コンポーネントの分離](#v1-%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E5%88%86%E9%9B%A2)
  - [v2: カスタムフック](#v2-%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%95%E3%83%83%E3%82%AF)
  - [v3: インターフェースの定義](#v3-%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E3%81%AE%E5%AE%9A%E7%BE%A9)
  - [v4: データ構造を独立したカスタムフックに分離](#v4-%E3%83%87%E3%83%BC%E3%82%BF%E6%A7%8B%E9%80%A0%E3%82%92%E7%8B%AC%E7%AB%8B%E3%81%97%E3%81%9F%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%95%E3%83%83%E3%82%AF%E3%81%AB%E5%88%86%E9%9B%A2)
  - [v5: useState の代わりに useReducer を利用する](#v5-usestate-%E3%81%AE%E4%BB%A3%E3%82%8F%E3%82%8A%E3%81%AB-usereducer-%E3%82%92%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B)
  - [v6: Container コンポーネントと Presentational コンポーネントの分離](#v6-container-%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%A8-presentational-%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E5%88%86%E9%9B%A2)
- [まとめ](#%E3%81%BE%E3%81%A8%E3%82%81)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 概要

Qiita で提供されている [React Hooks とカスタムフックが実現する世界 - ロジックの分離と再利用性の向上](https://qiita.com/sonatard/items/617f324228f75b9c802f) をベースにリファクタリングを実践していく。

### v1: コンポーネントの分離

もともとは `index.tsx` に記載されていた各コンポーネントを全て `src/components/` 以下に配置するようにしている。

また `css` や `storybook` 自体も各コンポーネントのディレクトリに格納するようにしている。

```bash
src/components/
├── Board
│   ├── Board.css
│   ├── Board.stories.tsx
│   └── Board.tsx
├── Game
│   ├── Game.css
│   ├── Game.stories.tsx
│   └── Game.tsx
└── Square
    ├── Square.css
    ├── Square.stories.tsx
    └── Square.tsx
```

### v2: カスタムフック

現在のままだと `Game.tsx` にロジックも記載されており、View が非常にわかりずらい状態になってしまっている。

そこでロジックを View コンポーネントから分離するために、必要な情報をカスタムフックに隠蔽する。

依存している値と操作は以下になる。

- 値
  - `status`
  - `current`
  - `history`
- 操作
  - `handleClick`
  - `jumpTo`

その他の `stepNumber` や `xIsNext` などは直接 View コンポーネントでは使用しないため、カスタムフック側に隠蔽する構造にしておく。

そこでカスタムフック側を以下のように実装する。

```js
export const useTicTacToe = (): [
  string,
  BoardValue,
  BoardValue[],
  (i: number) => void,
  (step: number) => void,
] => {
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [history, setHistory] = useState<BoardValue[]>([
    {
      squares: Array(9).fill(null),
    },
  ]);

  const handleClick = (i: number): void => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(
      newHistory.concat([
        {
          squares: squares,
        },
      ]),
    );
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  return [status, current, history, handleClick, jumpTo];
};
```

これで Game コンポーネントは View に関する実装が中心となったため可読性が向上していることがわかる。

```js
export const Game: React.FC = () => {
  const [status, current, history, handleClick, jumpTo] = useTicTacToe();

  const moves = history.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};
```

### v3: インターフェースの定義

一連の関連する操作をインターフェースに統一することで、カスタムフックを使う側はコードがすっきりし、操作を関係性がわかりやすくなる。

ただし今回は値や操作に関して、盤面操作とタイムトラベル機能のロジックが混ざっているため、そのままインターフェースで統一させることが難しい。

ただし以下のように返り値をひとまとめにするために使用するというのもありだが、今回の場合はこの戦略は採用しない。

```js
// カスタムフックが返す値をインターフェースを介して提供する
interface TicTacToe {
  status: string;
  current: BoardValue;
  history: BoardValue[];
  handleClick: (i: number) => void;
  jumpTo: (step: number) => void;
}

export const useTicTacToe = (): TicTacToe => {
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [history, setHistory] = useState<BoardValue[]>([
    {
      squares: Array(9).fill(null),
    },
  ]);

  const handleClick = (i: number): void => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(
      newHistory.concat([
        {
          squares: squares,
        },
      ]),
    );
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  return { status, current, history, handleClick, jumpTo };
};
```

### v4: データ構造を独立したカスタムフックに分離

ここに関しても実行していることは `history` に関して、現在の状態を復元するための配列に切り出しと、新しい盤面状態の push だけなので、まとめる必要性がない。

### v5: useState の代わりに useReducer を利用する

`useReducer` 自体になじみがないためいったん飛ばします...

### v6: Container コンポーネントと Presentational コンポーネントの分離

現在の `Game` コンポーネントの構成は以下のようになっている。

```js
export const Game: React.FC = () => {
  const [status, current, history, handleClick, jumpTo] = useTicTacToe();

  // ...
};
```

Redux の設計方針に倣い、コンポーネントの内部状態を変化させてしまうような副作用を発生させてしまう部分を Container コンポーネントとして切り出す。

```js
export const Page = () => {
  const [status, current, history, handleClick, jumpTo] = useTicTacToe();

  return <Game {...{ status, current, history, handleClick, jumpTo }} />;
};
```

`Game` コンポーネントは以下のように定義すればいい。

```js
export interface Props {
  status: string;
  current: BoardValue;
  history: BoardValue[];
  handleClick: (i: number) => void;
  jumpTo: (step: number) => void;
}

export const Game = ({
  status,
  current,
  history,
  handleClick,
  jumpTo,
}: Props) => {
  const moves = history.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};
```

これで `Game` コンポーネント自体には何も状態を有しておらず、渡された引数に応じて JSX を返すのみを処理に変更することができた。

## まとめ

ひとまず記事の流れにしたがって、カスタムフックを利用したロジックと View の分離を行った。

Storybook ではコンポーネントの内部で `useState` を使用している際に、状態変数にどうやって値を設定するのか四苦八苦していたが、現在は Game コンポーネントは引数を介して副作用を受け取っているため、Storybook では単にこの引数で与える副作用を調整すればいいだけになった。

コンポーネントからロジックを分離することで、Storybook を使用してコンポーネントの UI を自由自在に操作できるようになった。

参考情報

- [React Hooks とカスタムフックが実現する世界 - ロジックの分離と再利用性の向上](https://qiita.com/sonatard/items/617f324228f75b9c802f)
- [[React Official] フック早わかり](https://ja.reactjs.org/docs/hooks-overview.html)
