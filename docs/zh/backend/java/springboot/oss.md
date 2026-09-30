# OSS

先引入依赖

```xml
		<!-- 阿里云 OSS -->
       <dependency>
            <groupId>com.aliyun.oss</groupId>
            <artifactId>aliyun-sdk-oss</artifactId>
            <version>3.18.1</version>
        </dependency>
```

先在`application.yaml`里面配置

```yaml
oss:
  endpoint: oss-cn-beijing.aliyuncs.com
  access-key-id:
  access-key-secret:
  bucket-name: java-demo-hsh
  url-prefix: https://java-demo-hsh.oss-cn-beijing.aliyuncs.com/
```

再配置

```java
package com.demo.sessiondemo.config;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "oss")
public class OssConfig {
    @Value("${oss.endpoint}")
    private String endpoint;
    @Value("${oss.access-key-id}")
    private String accessKeyId;
    @Value("${oss.access-key-secret}")
    private String accessKeySecret;
    @Value("${oss.bucket-name}")
    private String bucketName;
    @Value("${oss.url-prefix}")
    private String urlPrefix;

    @Bean
    public OSS ossClient() {
        // 客户端是线程安全的 做成单例Bean复用
        return new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
    }
}

```

这里直接写实现类

```java
package com.demo.sessiondemo.service.impl;

import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.StrUtil;
import com.aliyun.oss.OSS;
import com.demo.sessiondemo.config.OssConfig;
import com.demo.sessiondemo.exception.BusinessException;
import com.demo.sessiondemo.service.OssService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class OssServiceImpl implements OssService {

    private final OSS ossClient;
    private final OssConfig ossConfig;
    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("文件不能为空");
        }

        // 生成对象key uuid文件名 避免同名覆盖
        String originalFilename = file.getOriginalFilename();
        String ext = StrUtil.subAfter(originalFilename, ".", true); // 取扩展名
        String key = UUID.randomUUID() + (StrUtil.isNotBlank(ext) ? "." + ext : "");

        // 上传到OSS
        try {
            ossClient.putObject(ossConfig.getBucketName(), key, file.getInputStream());
        } catch (IOException e) {
            throw new BusinessException("文件上传失败");
        }
        // 返回完整URL给前端用
        return ossConfig.getUrlPrefix() + key;
    }
}

```

