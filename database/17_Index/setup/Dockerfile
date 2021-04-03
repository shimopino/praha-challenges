FROM mysql:8.0

RUN apt-get update && apt-get install -y \
    git \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/datacharmer/test_db.git

RUN mv /test_db/employees.sql /docker-entrypoint-initdb.d/ \
 && mv /test_db/show_elapsed.sql /docker-entrypoint-initdb.d/ \
 && mv /test_db/*.dump /docker-entrypoint-initdb.d/

EXPOSE 3306

# docker image build -t mysql8-employees .
# docker run -d \
#   --rm \
#   --name mysql-employees \
#   -p 3306:3306 \
#   -e MYSQL_ROOT_PASSWORD=college \
#   -v /db/data:/var/lib/mysql \
#   mysql8-employees
# > cd /docker-entrypoint-initdb.d
# > mysql -uroot -pcollege < employees.sql
