# Tencent COS

## 引入依赖

在`pox.xml`中添加腾讯云COS的官方Java SDK，建议使用稳定版本

```xml
<!--腾讯云 COS-->
<dependency>
    <groupId>com.qcloud</groupId>
    <artifactId>cos_api</artifactId>
    <version>5.6.155</version> <!-- 或更新的稳定版本 -->
</dependency>
```

## 配置参数

在`application.yml`中配置COS连接信息，**不要硬编码在代码中**，采用配置或环境变量注入

```xml
tencent:
  cos:
    access-key: ${COS_SECRET_ID:your-secret-id}      # 建议通过环境变量注入
    secret-key: ${COS_SECRET_KEY:your-secret-key}
    region: ap-guangzhou                              # 存储桶地域，如 ap-shanghai
    bucket-name: example-1250000000                   # 存储桶名称，格式：名称-APPID
```

需要从腾讯云控制台获取三个核心信息：

- SecretId/SecretKey：访问管理->API密钥管理
- Bucket（存储桶名称）：格式通常为`名称-APPID`，如`esther-1393670083`
- Region（区域代码）：如`ap-shanghai`

## 创建类

创建一个配置类，从配置文件读取参数，并向Spring容器注册一个`COSClient`Bean

```java
package com.demo.redisdemo.config;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.region.Region;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "tencent.cos")
public class CosConfig {

    private String accessKey;
    private String secretKey;
    private String region;
    private String bucketName;

    @Bean
    public COSClient cosClient() {
        BasicCOSCredentials cred = new BasicCOSCredentials(accessKey, secretKey);
        ClientConfig clientConfig = new ClientConfig(new Region(region));
        return new COSClient(cred, clientConfig);
    }
}

```

