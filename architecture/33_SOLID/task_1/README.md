# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [SOLID原則とは](#solid%E5%8E%9F%E5%89%87%E3%81%A8%E3%81%AF)
- [単一責任の原則](#%E5%8D%98%E4%B8%80%E8%B2%AC%E4%BB%BB%E3%81%AE%E5%8E%9F%E5%89%87)
- [Open-Closed-Principleの原則](#open-closed-principle%E3%81%AE%E5%8E%9F%E5%89%87)
- [リスコフの置換原則](#%E3%83%AA%E3%82%B9%E3%82%B3%E3%83%95%E3%81%AE%E7%BD%AE%E6%8F%9B%E5%8E%9F%E5%89%87)
- [インタフェース分離の原則](#%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E5%88%86%E9%9B%A2%E3%81%AE%E5%8E%9F%E5%89%87)
- [依存性逆転の原則](#%E4%BE%9D%E5%AD%98%E6%80%A7%E9%80%86%E8%BB%A2%E3%81%AE%E5%8E%9F%E5%89%87)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## SOLID原則とは

**SOLID原則** とは、Robert C. Martinにより考案されたものであり、プログラムを開発者にとって読みやすく、メンテナンスしやすい設計にするための5つのガイドラインである。

5つの原則の頭文字をとってSOLID原則と呼ばれている。

- Single Responsibility Principle (SRP): 単一責任原則
- Open-Closed-Principle (OCP): 開放閉鎖の原則
- Liskov Substitution Pricinples (LSP): リスコフの置換原則
- Interface Separation Principle (ISP): インターフェース分離の原則
- Dependancy Inversion Principle (DIP): 依存性逆転の原則

## 単一責任の原則

> A class should have only one reason to change
> 「クラスは変更する理由を1つだけ持つべきである」

これはクラスを変更する理由は1つの「役割」だけであるという意味である。

例えば、学校の生徒や先生を1つにまとめたクラスを作成してしまうと、生徒や先生といった異なる役割を起因として、クラスが変更されてしまうため、それぞれの責任を分離させようというものである。

これは単にファイルを分割するだけではできないものである。

しかしこの役割とは、画面の表示やデータベースへの保存、ドメインロジックなども含まれている。

以下に具体的なコードを示す。

```typescript
class Circle {
    radius: number;

    // 円の半径を計算するドメインロジック
    public calculateArea(): number {
        return Math.PI * (radius * radius);
    }

    public saveCircle(): void {
        // 円の半径をRDBMSに保存するロジック
    }

    public drawCircle(): void {
        // 円を画面に描画するためのロジック
    }
}
```

このクラスを変更しようとする場合、以下の理由が考えられる。

- ドメインロジックの変更
- 保存するRDBMSの変更
- 描画するロジックの変更

```typescript
class CircleEntity {
    radius: number;

    // 円の半径を計算するドメインロジック
    public calculateArea(): number {
        return Math.PI * (radius * radius);
    }
}

class CircleRepository {
    public saveCircle(): void {
        // 円の半径をRDBMSに保存するロジック
    }
}

class CircleUI {
    public drawCircle(): void {
        // 円を画面に描画するためのロジック
    }
}
```

これで1つの変更理由に対して、1つのクラスに対してのみ変更を加えるように設計することができた。

## Open-Closed-Principleの原則

> software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification
> 「ソフトウェアの実体（クラス、モジュール、関数など）は、拡張に対してはオープンであるが、修正に対してはクローズであるべきである」

実際の商品で考えると、リングフィットアドベンチャーは、Joy-Conを専用の機器につなぐだけで使用することができ、Joy-Con自体には何ら変更を食わせる必要がない。

これが開放閉鎖の原則である。

例えばWebサービスにおいて、会員の登録ランクに応じて商品の価格を下げるロジックを変更する場合を考える。

```typescript
class PriceCalculator {
    public discount(customer: Profile): number {
        if (customer.isLoyalCustomer()) {
            return 20;
        }
        return 0;
    }
}

class Profile {
    public isLoyalCustomer(): boolean {
        return true;
    }
}
```

ここで新しく `AnotherProfile` が追加された場合、新しくシグニチャを追加するしかなくなってしまう。

```typescript
class AnotherProfile {
    public isLoyalCustomer(): boolean {
        return true;
    }
}

// 新しく判定メソッドを追加する必要がある
class PriceCalculator {
    public discount(customer: Profile): number {
        if (customer.isLoyalCustomer()) {
            return 20;
        }
        return 0;
    }

    public discountAnother(customer: AnotherProfile): number {
        if (customer.isLoyalCustomer()) {
            return 50;
        }
        return 0;
    }
}
```

つまり既存に存在するメソッドに対して、新しい機能を拡張した場合に、元のソースことを修正する必要が出てきてしまう。

そこで開放閉鎖の原則にしたがって、新しい機能を拡張する際には、元のソースを修正することなく、新しい機能のコードを追加するのみで実現する必要がある。

これは、新しい機能を拡張しても共通となるインターフェースを使用することで実現できる。

```typescript
interface CustomerProfile {
    public isLoyalCustomer(): boolean;
}

class PriceCalculator {
    public discount(customer: CustomerProfile): number {
        if (customer.isLoyalCustomer()) {
            return 20;
        }
        return 0;
    }
}

class AnotherProfile implements CustomerProfile {
  public isLoyalCustomer(): boolean {
    return true;
  }
}

const simulator = new PriceCalculator();
const customer = new AnotherProfile();
console.log(simulator.discount(customer));
```

これで新しい会員のルールが増えたとしても、既存のコードを修正することなく、新しい会員自体を追加するだけで対応することが可能となる。

## リスコフの置換原則

> if S is a subtype of T, then objects of type T in a program may be replaced with objects of type S without altering any of the desirable properties of that program
> 「S型がT型のサブタイプであるならば、T型のオブジェクトを使用しているプログラムは、何も修正を加えることなくサブタイプのS型のオブジェクトに置き換えることができる」

これはオブジェクト指向における基底クラスと派生クラスの関係を表している。

この際に基底クラスに対して、派生クラスが基底クラスの仕様を超えてしまうような実装をしてしまうと、リスコフの置換原則に違反してしまう。

例えば基底クラスと派生クラスの関係性を間違ってしまうと、呼び出し型のクラスに修正を加える必要が発生してしまう。

```typescript
class WiredEarbuds {
    public getDeviceDriver(): number {
        return 20;
    }
}

class WirelessEarbuds extends WiredEarbuds {
    public getDeviceDriver(): number {
        throw new Error('not implemented');
    }

    public getBluetoothDriver(): number {
        return 100;
    }
}

// Javaの感覚で書いたけど動かないので修正が必要
class EarbudsUtils {
    public showEarbuds(): void {
        const earbuds_1: WiredEarbuds = new WiredEarbuds();
        const earbuds_2: WirelessEarbuds = new WirelessEarbuds();

        const list: Array<WiredEarbuds> = [];
        list.push(earbuds_1);
        list.push(earbuds_2);

        for (const earbuds in list) {
            console.log(earbuds.getDeviceDriver());
        }
    }
}
```

今回の場合はインターフェースを利用して、必ず共通メソッドの実装を加えるようにすればいい。

```typescript
interface Earbuds {
  getDeviceDriver(): number;
}

class WiredEarbuds implements Earbuds {
    public getDeviceDriver(): number {
        return 20;
    }
}

class WirelessEarbuds implements Earbuds {
    // ここで共通メソッドから派生クラス専用のメソッドを呼びだす
    public getDeviceDriver(): number {
        return this.getBluetoothDriver();
    }

    public getBluetoothDriver(): number {
        return 100;
    }
}
```

これで呼び出し元のコードを修正することなく、基底クラスと派生クラスを置換することが可能となった。

## インタフェース分離の原則

> Many client-specific interfaces are better than one general-purpose interface.
> 「1つの汎用的なインターフェーズよりも、クライアント固有のインターフェースを多く用意するほうがいい」

ありとあらゆる仕様を満たすようなインターフェースを作成してしまうと、実装クラスは本来は不必要な実装も行わなければならなくなり、無駄な実装を増やしてしまう。

そこでインターフェース分離の原則に従って、固有の仕様を満たすようなインターフェーズを作成するほうがいい。

例えば印刷機のインターフェースを以下のようにあらゆる仕様に対応するように設計してみる。

```typescript
interface Printer {
    print(): void;
    scan(): void;
    fax(): void;
}
```

しかしこの場合、Fax機能を持たない印刷機に `fax` 関数を実装する必要が発生してしまったり、スキャン機能を持たない印刷機に `scan` 関数を実装する必要が発生してしまう。

```typescript
class PrintOnlyPrinter implements Printer {
  public print(): void {
    console.log('印刷の実装');
  }

  public scan(): void {
    throw new Error('not implemented');
  }

  public fax(): void {
    throw new Error('not implemented');
  }
}
```

この場合、空実装が含まれていたり、凝集度が低くなってしまっているため、それぞれのデバイスごとにインターフェースを分離したほうがいい。

## 依存性逆転の原則

## 参考資料

- [開発者が知っておくべきSOLIDの原則](https://postd.cc/solid-principles-every-developer-should-know/)
- [SOLID原則について簡単に書く](https://qiita.com/yui_mop/items/93fef037a787318e7067)
- [オブジェクト指向のその前に-凝集度と結合度/Coheision-Coupling](https://speakerdeck.com/sonatard/coheision-coupling)
- [TypeScript with SOLID Architecture](https://learn.uno/learning/typescript-solid/)
- [Implementing SOLID and the onion architecture in Node.js with TypeScript and InversifyJS](https://dev.to/remojansen/implementing-the-onion-architecture-in-nodejs-with-typescript-and-inversifyjs-10ad)
- [イラストで理解するSOLID原則](https://qiita.com/baby-degu/items/d058a62f145235a0f007)
