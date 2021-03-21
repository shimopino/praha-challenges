# Nginx

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [概要](#%E6%A6%82%E8%A6%81)
  - [&#035;1 NGINX とは](#1-nginx-%E3%81%A8%E3%81%AF)
  - [Nginxはどのように動いているの?](#nginx%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB%E5%8B%95%E3%81%84%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE)
  - [mine.typesってなにもの?](#minetypes%E3%81%A3%E3%81%A6%E3%81%AA%E3%81%AB%E3%82%82%E3%81%AE)
  - [Dockerでnginxを起動してみましょう](#docker%E3%81%A7nginx%E3%82%92%E8%B5%B7%E5%8B%95%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
  - [Nginxをリバースプロキシとして動作させましょう](#nginx%E3%82%92%E3%83%AA%E3%83%90%E3%83%BC%E3%82%B9%E3%83%97%E3%83%AD%E3%82%AD%E3%82%B7%E3%81%A8%E3%81%97%E3%81%A6%E5%8B%95%E4%BD%9C%E3%81%95%E3%81%9B%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)
- [参考資料](#%E5%8F%82%E8%80%83%E8%B3%87%E6%96%99)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 概要

ここではクイズを通して Nginx と Docker を使ったアプリケーションの構築への理解力を高めることを目的とする。

なお Docker に関しては基礎知識を有していることを前提にクイズを作成している。

### #1 NGINX とは



<details>
<summary>回答例</summary>

</details>








### Nginxはどのように動いているの?



<details>
<summary>回答例</summary>



</details>


### mine.typesってなにもの?


<details>
<summary>回答例</summary>

```bash
types {
    text/html                                        html htm shtml;
    text/css                                         css;
    text/xml                                         xml;
    image/gif                                        gif;
    image/jpeg                                       jpeg jpg;
    application/javascript                           js;
    ...
}
```

</details>

### Dockerでnginxを起動してみましょう

Dockerコンテナでnginxを立ち上げて、`http://localhost`からWelcomeページを閲覧してみましょう

<details>
<summary>回答例</summary>

80番ポートでコンテナを起動する

```bash
$ docker container run -it -p 80:80 --rm --name nginx-container nginx:1.19.6-alpine
>>
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
172.17.0.1 - - [04/Feb/2021:14:19:32 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36" "-"
```

これで`http://localhost`にアクセスすれば、NginxのWelcomeページが確認できる。

</details>


### Nginxをリバースプロキシとして動作させましょう





<details>
<summary>回答例</summary>



</details>



## 参考資料

- [[Nginx] NGINX Documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-docker/)
- [[Nginx] Admin Guide](https://docs.nginx.com/nginx/admin-guide/)
- [[Andrew Alexeev's Blog] nginx](https://aosabook.org/en/nginx.html)
- [[Antoine Bonavita's Blog] nginx](https://www.nginx-discovery.com/)
- [Deploying NGINX and NGINX Plus on Docker](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-docker/)


