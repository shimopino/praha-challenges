# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [SOLID原則とは](#solid%E5%8E%9F%E5%89%87%E3%81%A8%E3%81%AF)
- [単一責任の原則](#%E5%8D%98%E4%B8%80%E8%B2%AC%E4%BB%BB%E3%81%AE%E5%8E%9F%E5%89%87)
- [Open-Closed-Principleの原則](#open-closed-principle%E3%81%AE%E5%8E%9F%E5%89%87)
- [リスコフの置換原則](#%E3%83%AA%E3%82%B9%E3%82%B3%E3%83%95%E3%81%AE%E7%BD%AE%E6%8F%9B%E5%8E%9F%E5%89%87)
- [インターフェースのメリット](#%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E3%81%AE%E3%83%A1%E3%83%AA%E3%83%83%E3%83%88)
- [依存性の逆転](#%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E9%80%86%E8%BB%A2)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## SOLID原則とは

**SOLID原則** とは、Robert C. Martinにより考案されたものであり、プログラムを開発者にとって読みやすく、メンテナンスしやすい設計にするための5つのガイドラインである。

5つの原則の頭文字をとってSOLID原則と呼ばれている。

- Single Responsibility Principle (SRP): 単一責任原則
- Open-Closed-Principle (OCP): 解法閉鎖の原則
- Liskov Substitution Pricinples (LSP): リスコフの置換原則
- Interface Separation Principle (ISP): インターフェース分離の原則
- Dependancy Inversion Principle (DIP): 依存性逆転の原則

## 単一責任の原則

> A class should have only one reason to change
> 「クラスは変更する理由を1つだけ持つべきである」

これはクラスを変更する理由は1つの「役割」だけであるという意味である。

例えば、学校の生徒や先生を1つにまとめたクラスを作成してしまうと、生徒や先生といった異なる役割を起因として、クラスが変更されてしまうため、それぞれの責任を分離させようというものである。

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

## リスコフの置換原則

## インターフェースのメリット

## 依存性の逆転

## 参考資料

- [開発者が知っておくべきSOLIDの原則](https://postd.cc/solid-principles-every-developer-should-know/)
- [SOLID原則について簡単に書く](https://qiita.com/yui_mop/items/93fef037a787318e7067)
- [オブジェクト指向のその前に-凝集度と結合度/Coheision-Coupling](https://speakerdeck.com/sonatard/coheision-coupling)
- [TypeScript with SOLID Architecture](https://learn.uno/learning/typescript-solid/)
- [Implementing SOLID and the onion architecture in Node.js with TypeScript and InversifyJS](https://dev.to/remojansen/implementing-the-onion-architecture-in-nodejs-with-typescript-and-inversifyjs-10ad)
- [イラストで理解するSOLID原則](https://qiita.com/baby-degu/items/d058a62f145235a0f007)
