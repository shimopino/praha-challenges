# モジュールの動作検証

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [Module](#module)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Module

以下の依存関係を有するアプリケーションを作成する。

- `computer`
  - `cpu`
    - `power`
  - `disc`
    - `power`

この依存関係を再現するために以下のコマンドでコードを生成する。

```bash
# 4つ分のモジュールを作成する
nest g module computer
nest g module cpu
nest g module disc
nest g module power

# 依存先で使用するビジネスロジック
nest g service cpu
nest g service power
nest g service disc

# トップレベルでのコントローラーは1つのみ
nest g controller computer
```

他のモジュールでも使用するモジュールであり、その内部のサービスも使用したい場合は以下のように外部に出力しておく必要がある。

```ts
@Module({
  providers: [PowerService],
  exports: [PowerService],
})
export class PowerModule {}
```

また読み込みたい場合は、以下のように読み込めばいい。

```ts
@Module({
  providers: [DiscService],
  exports: [DiscService],
  imports: [PowerModule],
})
export class DiscModule {}
```

これでモジュールから出力されているサービスを利用することができる。

```ts
@Injectable()
export class DiscService {
  constructor(private discService: DiscService) {}
}
```
