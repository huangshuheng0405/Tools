# application

```yml
spring:
  profiles:
    # 默认走 dev（本地开发直接运行即可）；部署时用 -Dspring.profiles.active=prod
    # 或环境变量 SPRING_PROFILES_ACTIVE=prod 覆盖，不要改这里
    active: dev
```

## dev

`application.dev.yml`，开发环境直接写配置即可

```yml
# 开发环境：本地 MySQL / Redis，凭据直接写在文件里（仅本地使用，不要用于生产）
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cloud?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&transformedBitIsBoolean=true&allowMultiQueries=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

  data:
    redis:
      host: localhost
      port: 6379
      password: 128128
      database: 0
      timeout: 10s

logging:
  level:
    com.demo.redisdemo: DEBUG

mybatis-plus:
  configuration:
    # 控制台打印 SQL，仅开发环境开启
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

## prod

```yml
# 生产环境：连接信息全部来自环境变量（不含明文凭据，可安全提交）
# 需要设置的环境变量：
#   DB_HOST / DB_PORT / DB_NAME / DB_USERNAME / DB_PASSWORD
#   REDIS_HOST / REDIS_PORT / REDIS_PASSWORD / REDIS_DATABASE
spring:
  datasource:
    # 库名、主机、端口带默认值；账号密码不给默认值，未注入时启动即报错（快速失败好过连错库）
    url: jdbc:mysql://${DB_HOST:127.0.0.1}:${DB_PORT:3306}/${DB_NAME:cloud}?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&transformedBitIsBoolean=true&allowMultiQueries=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=Asia/Shanghai
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  data:
    redis:
      host: ${REDIS_HOST:127.0.0.1}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD}
      database: ${REDIS_DATABASE:0}
      timeout: 10s

logging:
  level:
    com.demo.redisdemo: INFO
# 未显式配置 mybatis-plus.configuration.log-impl，生产不打印 SQL
```
