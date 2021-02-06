# Nginx

<!-- START doctoc -->
<!-- END doctoc -->

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


