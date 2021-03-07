# FAQ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [パッケージ関係](#%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E9%96%A2%E4%BF%82)
  - [Q: 特定のパッケージの依存関係をどのように確認できるのか](#q-%E7%89%B9%E5%AE%9A%E3%81%AE%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%AE%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82%E3%82%92%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E7%A2%BA%E8%AA%8D%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%AE%E3%81%8B)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
