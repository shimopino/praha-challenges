# 課題 1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [前回の課題の振り返り](#%E5%89%8D%E5%9B%9E%E3%81%AE%E8%AA%B2%E9%A1%8C%E3%81%AE%E6%8C%AF%E3%82%8A%E8%BF%94%E3%82%8A)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 前回の課題の振り返り

前回の課題では、下記の構成のインフラを構築した。

![](assets/design_private.drawio.svg)

## NAT ゲートウェイ

### プライベートな EC2 の公開

現在の構成では、プライベートサブネット内に配置されている EC2 インスタンスをインターネットに公開しようとすると以下の課題が存在している。

- EC2 インスタンスにパブリック IP アドレスを割り当てていないためインターネットと通信できない
- トラフィックがパブリックサブネット内の EC2 インスタンスからの SSH アクセスのみを許可している

それぞれの課題を解決するために、NAT ゲートウェイとセキュリティグループを設定する必要がある。

