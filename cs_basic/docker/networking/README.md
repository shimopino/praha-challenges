# Dockerのネットワーク

<!-- START doctoc -->
<!-- END doctoc -->

## ネットワークの基礎

Dockerではネットワークの機能を提供するために、ネットワークドライバというものを実装している。
Dockerをインストールした段階で複数のドライバを使用することが可能である。

- `bridge`
  - デフォルトのネットワークドライバ
  - 明示的にドライバを指定しない場合は、このドライバが使用される
  - 通信が必要なスタンドアロンなアプリに必要である
- `host`
  - コンテナとdockerホスト間のネットワーク分離を削除する
  - dockerホストのネットワークを直接利用する場合に使用する
  - Docker for Mac／Windows では使用できない
- `overlay`
  - 複数のdockerデーモンを接続する
  - このドライバを使用すれば、コンテナ間通信でOSレベルのルーティングを行う必要がなくなる
- `macvlan`
  - コンテナに対してMACアドレスを割り当てる
  - ネットワーク上で物理デバイスとして認識させることができる
  - dockerデーモンがMACアドレスをもとにトラフィックを分散させるために使用する
- `none`
  - ネットワークを使用しないコンテナを作成する際に使用する

### スタンドアロンなアプリを構築する

では1つのdockerホスト上でalpineイメージをもとにしたコンテナ同士を通信できるようにしてみる。

まずはデフォルトで利用可能なネットワークを確認する。
以下のように3つのドライバが作成されていることがわかる。

```bash
NETWORK ID     NAME      DRIVER    SCOPE
2c8af3a4e21c   bridge    bridge    local
c84172d418d0   host      host      local
9e51067f96f4   none      null      local
```

では実際にコンテナを作成してみる。
その際にalpineのデフォルトシェルである`ash`を使用する。

```bash
$ docker container run -itd --rm --name alpine1 alpine ash
$ docker container run -itd --rm --name alpine2 alpine ash
```

ネットワークドライバを指定していないため、このコンテナはデフォルトで作成されている`bridge`ドライバに所属している。
実際にこのドライバに詳細を確認してみる。

```bash
[
    {
        "Name": "bridge",
        "Id": "2c8af3a4e21c92eb4f014793c7e1ff228e804b613cd4502b52d9f9294edd58cc",
        "Created": "2021-01-16T17:42:15.337827542Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "afbbe2975b641bf02fe5cb3d670974f23d9b8afee4f3bbf70bc284b7e0efe8f3": {
                "Name": "alpine2",
                "EndpointID": "2b7d09e8ac9d2603950cec65b00f39f0f4861d9edfbd3066bdb49987dc779e66",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
            "b44198c686c776dd564aae33174c64c7dfd0bc5b968f0d3377e1639c588493e3": {
                "Name": "alpine1",
                "EndpointID": "a736def86efabbe833fbed7e81b11b3cdff6c5148fdc2b317de40d53c16828df",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
```

確認するとわかるように、このドライバに対してサブネットのIPアドレスが割り当てられ、ゲートウェイが登録されていることがわかる。
また、作成した2つのコンテナが登録されており、それぞれにIPアドレスが割り当てられていることがわかる。

では次に、コンテナ内部にアクセスして、コンテナ内部からネットワーク情報を確認してみる。

```bash
$ docker container exec -it alpine1 ash
/ ip addr show
>
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: tunl0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN qlen 1000
    link/ipip 0.0.0.0 brd 0.0.0.0
3: ip6tnl0@NONE: <NOARP> mtu 1452 qdisc noop state DOWN qlen 1000
    link/tunnel6 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00 brd 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00
180: eth0@if181: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

1つ目のインターフェースはループバックデバイスである。
このループバックデバイスはループバックIPアドレスが紐づいている。

3つの仮想インターフェースに割り当てられているアドレスを確認すると、コンテナ自身のIPアドレスが紐づいていることがわかる。

このネットワークデバイスに紐づいているコンテナからは、インターネットにアクセスすることが可能である。

```bash
/ ping -c 2 google.com
>
PING google.com (216.58.199.238): 56 data bytes
64 bytes from 216.58.199.238: seq=0 ttl=116 time=20.314 ms
64 bytes from 216.58.199.238: seq=1 ttl=116 time=18.625 ms

--- google.com ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 18.625/19.469/20.314 ms
```

では接続されているもう一方のコンテナに対してもICMPメッセージを投げてみます。

```bash
/ ping -c 2 172.17.0.3
>
PING 172.17.0.3 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.338 ms
64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.416 ms

--- 172.17.0.3 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.338/0.377/0.416 ms
```

同じデバイスに所属しているコンテナは、相互に通信することが可能であることがわかる。

ただし注意点としてはIPアドレスでしか相手を指定することができず、コンテナ名で通信することはできないことである。

```bash
/ ping -c 2 alpine2
>
ping: bad address 'alpine2'
```

この性質のため、Production環境ではデフォルトの`bridge`を使用せずに、カスタムネットワークを使用することが推奨される。

### カスタムネットワークを作成する

カスタムネットワークを作成してその挙動を確認するために、以下のような状況設定を再現する。

- 使用するネットワーク
  - デフォルトの`bridge`ネットワーク
  - カスタムネットワーク
- 使用するコンテナ
  - alpine1
    - カスタムネットワークに所属
  - alpine2
    - カスタムネットワークに所属
  - alpine3
    - bridgeネットワークに所属
  - alpine4
    - カスタムネットワークに所属
    - bridgeネットワークに所属

ではまずはカスタムネットワークを作成してみる。

```bash
$ docker network create --driver bridge alpine-net
$ docker network ls
>
NETWORK ID     NAME         DRIVER    SCOPE
dae5673d894f   alpine-net   bridge    local
2c8af3a4e21c   bridge       bridge    local
c84172d418d0   host         host      local
9e51067f96f4   none         null      local
```

これでbridgeドライバのカスタムネットワークが作成されていることがわかる。

この状態でカスタムネットワークの詳細を確認してみる。

```bash
$ docker network inspect alpine-net
>
[
    {
        "Name": "alpine-net",
        "Id": "dae5673d894f9721814b42ad904d5386f0904bd095cab7b60c87ec000d244b25",
        "Created": "2021-01-17T03:55:32.095855709Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.22.0.0/16",
                    "Gateway": "172.22.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {},
        "Labels": {}
    }
]
```

IPアドレスを確認すると、bridgeドライバとは異なるネットワークアドレスになっていることがわかる。

では条件に従ってコンテナを作成する。

```bash
$ docker container run -itd -rm --name alpine1 --network alpine-net alpine ash
$ docker container run -itd -rm --name alpine2 --network alpine-net alpine ash
$ docker container run -itd -rm --name alpine3 --network bridge alpine ash
$ docker container run -itd -rm --name alpine4 --network alpine-net alpine ash
$ docker network connect bridge alpine4
```

この状態でもう一度カスタムネットワークの詳細を確認する。

```bash
$ docker network inspect alpine-net
>
[
    {
        "Name": "alpine-net",
        "Id": "dae5673d894f9721814b42ad904d5386f0904bd095cab7b60c87ec000d244b25",
        "Created": "2021-01-17T03:55:32.095855709Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.22.0.0/16",
                    "Gateway": "172.22.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "94014a37aab3c2b1ffa8644a63af3061573b55a86a627252e9b6cdc0c4e45166": {
                "Name": "alpine2",
                "EndpointID": "d1039cc246074129dea34f4a8b5f8792cb62ebd363bb847cd8bd1a4540ea03c5",
                "MacAddress": "02:42:ac:16:00:03",
                "IPv4Address": "172.22.0.3/16",
                "IPv6Address": ""
            },
            "b90c0988da0d07f56ecedf3ae9d4a80e1810b9ca7e1607e42d7158529b3dcc35": {
                "Name": "alpine1",
                "EndpointID": "915271ac4c63f713ce329164e1a6b6b0d7f82851a8bff2c48b42ca7d8d78de68",
                "MacAddress": "02:42:ac:16:00:02",
                "IPv4Address": "172.22.0.2/16",
                "IPv6Address": ""
            },
            "d827df0e0c682b15e70c05123208a33f96eca42f6a9d585e920e17b2be8ee163": {
                "Name": "alpine4",
                "EndpointID": "2e95be411ecfb4b6b4e381eafe8bd4153162dad395080f21ea009acffb1f0506",
                "MacAddress": "02:42:ac:16:00:04",
                "IPv4Address": "172.22.0.4/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

先ほどとは異なり、新規に作成したコンテナが3つ所属していることがわかる。

デフォルトのbridgeドライバとは異なり、コンテナ名で通信を行うことが可能である。

```bash
$ docker container exec -it alpine1 ash
/ ping -c 2 alpine2
>
OK

/ ping -c 2 alpine4
>
OK

/ ping -c 2 alpine1
>
OK

/ ping -c 2 alpine1
>
NO

/ ping -c 2 172.17.0.3
>
NO
```

カスタムネットワークを使用すればコンテナ名で通信できるため、こちらの方が便利である。

では実験の後片付けを行う。

```bash
$ docker container stop alpine1 alpine2 alpine3 alpine4
$ docker network rm alpine-net
```

## references

- [Networking Overview](https://docs.docker.com/network/)
- [bridge](https://docs.docker.com/network/bridge/)
- [host](https://docs.docker.com/network/host/)
- [overlay](https://docs.docker.com/network/overlay/)
- [macvlan](https://docs.docker.com/network/macvlan/)
- [none](https://docs.docker.com/network/none/)
