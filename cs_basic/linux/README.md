# Linuxの基礎

<!-- START doctoc -->
<!-- END doctoc -->

## CPU周りのコマンド

まずはLinux環境を模擬するためにDockerを使用する。
なお使用環境としては、8コア8スレッドのApple Silicon搭載のMacbook Airから4コアだけ割り当てている。

```bash
# Macbook AirのCPU情報を簡易的に確認する
$ sysctl machdep.cpu.brand_string
>
machdep.cpu.brand_string: Apple M1

# より詳細な情報を確認する
$ sysctl -a machdep.cpu
>
machdep.cpu.cores_per_package: 8
machdep.cpu.core_count: 8
machdep.cpu.logical_per_package: 8
machdep.cpu.thread_count: 8
machdep.cpu.brand_string: Apple M1
```

以下の実験ではUbuntuのコンテナイメージを使用している。
なお、コマンドの出力結果をパイプして`pbcopy`に渡した際の結果を載せている。

```bash
# 18.04のUbuntuイメージをインストールする
$ docker image pull ubuntu:18.04

# 取り込んだイメージからバックグラウンド状態でコンテナを起動する
$ docker container run -itd --rm --name ubuntu18 ubuntu:18.04
> 
58eeaf0af51d52f360212b03a07de2330828fdb8eac51af6815e99f22685f825

# コンテナが起動していることを確認する
$ docker container ls
> 
CONTAINER ID   IMAGE          COMMAND       CREATED          STATUS          PORTS     NAMES
58eeaf0af51d   ubuntu:18.04   "/bin/bash"   17 seconds ago   Up 16 seconds             ubuntu18

# 起動中のコンテナに標準入出力を繋げる
# `exec`は`attach`と異なり、コンテナ内で別のプロセスを起動している
$ docker container exec -it ubuntu18 /bin/bash
>
root@58eeaf0af51d:/# 
```

これでUbuntuOSの操作を実行することが可能になった。
簡単に起動中のコンテナのOS関係の情報を確認する。

```bash
root@58eeaf0af51d:/ $ uname -r
>
4.19.104-linuxkit

root@58eeaf0af51d:/ $ cat /etc/os-release
>
NAME="Ubuntu"
VERSION="18.04.5 LTS (Bionic Beaver)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 18.04.5 LTS"
VERSION_ID="18.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=bionic
UBUNTU_CODENAME=bionic
```

では簡単にCPU周りのコマンド操作を実行していく。
なおコマンドの実行サンプルに関しては、シェル名は省略表記する。

### `cat /proc/cpuinfo`

下記では起動中のUbuntuコンテナ内でコマンドを実行した場合の結果である。

```bash
# CPUに関する情報を取得する
$ cat /proc/cpuinfo
>
processor       : 0
BogoMIPS        : 48.00
Features        : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma lrcpc dcpop sha3 asimddp sha512 asimdfhm dit uscat ilrcpc flagm ssbs
CPU implementer : 0x00
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0x000
CPU revision    : 0

processor       : 1
BogoMIPS        : 48.00
Features        : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma lrcpc dcpop sha3 asimddp sha512 asimdfhm dit uscat ilrcpc flagm ssbs
CPU implementer : 0x00
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0x000
CPU revision    : 0

processor       : 2
BogoMIPS        : 48.00
Features        : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma lrcpc dcpop sha3 asimddp sha512 asimdfhm dit uscat ilrcpc flagm ssbs
CPU implementer : 0x00
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0x000
CPU revision    : 0

processor       : 3
BogoMIPS        : 48.00
Features        : fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma lrcpc dcpop sha3 asimddp sha512 asimdfhm dit uscat ilrcpc flagm ssbs
CPU implementer : 0x00
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0x000
CPU revision    : 0
```

出力結果を確認してみると、4つのコアが割り当てられていることがわかる。
`Features`に対応している機能が表示されている。この機能に関しては以下のリンクに詳細が記載されている。

- [What do the flags in /proc/cpuinfo mean?](https://unix.stackexchange.com/questions/43539/what-do-the-flags-in-proc-cpuinfo-mean)

そのほかにも`BogoMIPS`といった情報が記載されている。
これはLinuxカーネルのブート時にCPU速度をビジーループを使って測定した結果である。異なる種類のCPU間での性能比較には使用できないため注意が必要である。

- [BogoMips](https://ja.wikipedia.org/wiki/BogoMips#:~:text=BogoMips%EF%BC%88%22bogus%22%3D%E3%80%8C,%E5%9B%9E%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%8B%E3%80%8D%E3%81%A7%E3%81%82%E3%82%8B%E3%80%82)

### `nproc`

CPUのプロセッサの数を確認したい場合は、`nproc`コマンドでも代用することができる。

```bash
# プロセッサの数を確認する
$ nproc
>
4
```

上記の`nproc`コマンドは、Unix系のOSで中心的な`cat`や`ls`、`rm`などのユーティリティ群のパッケージに含まれている。
実際に以下のコマンドでどのパッケージに格納されているのか確認してみる。

```bash
# nprocコマンドがどのパッケージに登録されているのか確認する
$ dpkg -S $(which nproc)
>
coreutils: /usr/bin/nproc
```

- [GNU Core Utils](https://ja.wikipedia.org/wiki/GNU_Core_Utilities)
- [nproc manpage](https://man7.org/linux/man-pages/man1/nproc.1.html)

### `lscpu`

`lscpu`コマンドを使用すれば、割り当てられているCPUの情報を一覧できる。

```bash
$ lscpu
>
Architecture:        aarch64
Byte Order:          Little Endian
CPU(s):              4
On-line CPU(s) list: 0-3
Thread(s) per core:  4
Core(s) per socket:  1
Socket(s):           1
Vendor ID:           0x00
Model:               0
Stepping:            0x0
BogoMIPS:            48.00
Flags:               fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics fphp asimdhp cpuid asimdrdm jscvt fcma lrcpc dcpop sha3 asimddp sha512 asimdfhm dit uscat ilrcpc flagm ssbs
```

なお`lscpu`コマンドは`util-linux`というパッケージに格納されている。

```bash
$ dpkg -S $(which lscpu)
>
util-linux: /usr/bin/lscpu
```

- [lscpu manpage](https://man7.org/linux/man-pages/man1/lscpu.1.html)

### `top`

`top`コマンドでは、実行中のプログラムの状況をリアルタイムで確認することができる。
表示される情報は、Linuxカーネルが管理しているプロセスやスレッドに関するシステム情報の一覧になる。

コマンドの実行結果を確認するために、簡易的な無限ループを作成する。

```bash
# `yes`は文字"y"を連続で表示するコマンド
# `/dev/null`で標準出力に結果を表示しないようにしている
# '&'でバックグラウンドでコマンドを実行する
$ yes > /dev/null &
```

この状態で`top`コマンドを実行すれば、実行中の`yes`の状態を確認することができる。
実際に`yes`を実行しているプロセスがCPUをフルに使用していることがわかる。

```bash
$ top
>
top - 05:11:06 up  4:51,  0 users,  load average: 2.53, 2.29, 1.17
Tasks:   3 total,   2 running,   1 sleeping,   0 stopped,   0 zombie
%Cpu(s):  7.2 us, 17.9 sy,  0.0 ni, 74.9 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  2028608 total,  1349560 free,   220544 used,   458504 buff/cache
KiB Swap:  1048572 total,   490064 free,   558508 used.  1691544 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                        
  577 root      20   0    1820    404    340 R 100.0  0.0   0:04.45 yes                            
    1 root      20   0    3784   3036   2600 S   0.0  0.1   0:00.08 bash                           
  578 root      20   0    5380   2500   2120 R   0.0  0.1   0:00.00 top 
```

上記の実行結果が出力されている最中に`1`を入力すれば、各CPUの実行状況が確認できる。

```bash
top - 05:12:48 up  4:52,  0 users,  load average: 1.26, 1.90, 1.15
Tasks:   3 total,   2 running,   1 sleeping,   0 stopped,   0 zombie
%Cpu0  :  0.3 us,  0.0 sy,  0.0 ni, 99.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu1  :  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu2  : 27.9 us, 72.1 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu3  :  0.3 us,  0.3 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  2028608 total,  1349656 free,   220220 used,   458732 buff/cache
KiB Swap:  1048572 total,   490064 free,   558508 used.  1691868 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                        
  577 root      20   0    1820    404    340 R 100.0  0.0   1:47.14 yes                            
    1 root      20   0    3784   3036   2600 S   0.0  0.1   0:00.08 bash                           
  578 root      20   0    5380   2500   2120 R   0.0  0.1   0:00.01 top 
```

各CPUに表示されている内容は以下になる。
  
| CPU情報 | 内容                                              | 
| ------- | ------------------------------------------------- | 
| `us`    | ユーザ空間で実行されているプロセスのCPU使用率     | 
| `sy`    | カーネル空間で実行されているプロセスのCPU使用率   | 
| `ni`    | ユーザが優先順位を決定しているプロセスのCPU使用率 | 
| `id`    | アイドリング率                                    | 
| `wa`    | ファイルI/Oの待ち時間                             | 
| `hi`    | ?                                                 | 
| `si`    | ?                                                 | 
| `st`    | ?                                                 | 

追加で無限ループのコマンドを実行すれば、追加したコマンドの数だけCPUが使用されていることがわかる。

```bash
# 2回分追加で実行
$ yes > /dev/null &
$ yes > /dev/null &

# topでCPU使用状況を確認する
$ top
>
top - 05:28:40 up  5:08,  0 users,  load average: 2.78, 1.77, 1.33
Tasks:   5 total,   4 running,   1 sleeping,   0 stopped,   0 zombie
%Cpu0  :  0.3 us,  0.0 sy,  0.0 ni, 97.4 id,  1.3 wa,  0.0 hi,  1.0 si,  0.0 st
%Cpu1  : 27.6 us, 72.4 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu2  : 27.0 us, 73.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
%Cpu3  : 28.2 us, 71.8 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  2028608 total,  1304420 free,   221684 used,   502504 buff/cache
KiB Swap:  1048572 total,   490064 free,   558508 used.  1688544 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                        
  577 root      20   0    1820    404    340 R 100.0  0.0  17:38.94 yes                            
  896 root      20   0    1820    416    352 R 100.0  0.0   2:15.59 yes                            
  897 root      20   0    1820    428    368 R  99.7  0.0   2:12.48 yes                            
    1 root      20   0    3784   3036   2600 S   0.0  0.1   0:00.10 bash                           
  898 root      20   0    5380   2612   2232 R   0.0  0.1   0:00.01 top
```

これで4つ存在しているプロセッサのうち、1つだけアイドリング率が100％近いままとなっており、残りの3つのプロセッサは`yes`コマンドでCPUが使用されていることがわかる。

- [top manpage](https://man7.org/linux/man-pages/man1/top.1.html)

### `taskset`

```bash
$ taskset -c 4 <command>
```

### `online` / `offline`

```bash
# cpuを認識させない
echo 0 > /sys/devices/system/cpu/cpu0/online

# cpuを認識させる
echo 1 > /sys/devices/system/cpu/cpu0/online
```

## 参考資料一覧

- [Linux基礎に関する動画集](https://www.youtube.com/channel/UCgrUyRFiHhV607Orhriau6w)

