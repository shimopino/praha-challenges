# FAQ

<!-- START doctoc -->
<!-- END doctoc -->

## パッケージ関係

### Q: 特定のパッケージの依存関係をどのように確認できるのか

Ubuntu

```bash
# 対象パッケージが依存しているパッケージを確認する
apt-cache depends <package-name>

# 対象パッケージに依存しているパッケージを確認する
apt-cache rdepends <package-name>
```

参考情報

- [aptの依存関係を知りたいそんなときに](https://qiita.com/catatsuy/items/83ca8a5f85c14eac5cb7)
