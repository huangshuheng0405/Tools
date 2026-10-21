# encrypt

密码加密

## 完整流程

```
前端                                          后端
 │
 │ ① GET /auth/publicKey  ─────────────────►  生成新密钥对
 │ ◄──────────  { keyId, publicKey }          私钥存 Redis（5 分钟）
 │
 │ ② JSEncrypt.encrypt(明文密码)               （前端本地完成加密）
 │        ↓ 得到 Base64 密文
 │
 │ ③ POST /auth/login  ────────────────────►  ④ 按 keyId 取私钥
 │    { username,                               解密 → 得到明文密码
 │      password: 密文,                          删掉私钥（一次一密）
 │      keyId }                                 ⑤ BCrypt.matches(明文, 库中哈希)
 │                                                   ↓ 通过
 │ ◄──────────  { tokenValue, ... }              签发 token 返回
```

前端：

1. 取公钥：`GET /auth/publicKey` → 拿到 `{ keyId, publicKey }`
2. 加密：`new JSEncrypt().setPublicKey(publicKey); .encrypt(明文)` → Base64 密文
3. 提交：body = `{ username, password: 密文, keyId }`

```bash [pnpm]
pnpm i jsencrypt
```

封装工具类

```ts [utils/crypto.ts]
import JSEncrypt from 'jsencrypt';

/**
 * 使用 RSA 公钥加密（PKCS#1 v1.5），返回 Base64 密文
 *
 * @param publicKey Base64 编码的 RSA 公钥，取自 /auth/publicKey
 * @param plainText 待加密明文
 */
export function rsaEncrypt(publicKey: string, plainText: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);

  const cipherText = encryptor.encrypt(plainText);

  if (!cipherText) {
    throw new Error('RSA encrypt failed: invalid public key or plain text');
  }

  return cipherText;
}
```



## 文件结构

| 类            | 对应文件              | 作用                             |
| ------------- | --------------------- | -------------------------------- |
| `RsaUtil`     | utils/RsaUtil         | 生成密钥、Base64编/解码、加/解密 |
| RsaKeyManager | service/RsaKeyManager | keyId、私钥存储、一次一密        |

::: code-group

```Java [RsaUtil.java]
/**
 * RSA 密码学运算工具类
 * 对应项目：com.demo.redisdemo.common.RsaUtil
 * 职责：只负责和密码学打交道，不关心 Redis、不关心业务
 */
class RsaUtil {

    /** 算法名称：告诉 JDK 我们要用 RSA */
    public static final String ALGORITHM = "RSA";

    /** 加解密变换串，格式是「算法/模式/填充」，必须与前端 JSEncrypt 的默认填充一致 */
    public static final String TRANSFORMATION = "RSA/ECB/PKCS1Padding";

    /** 密钥长度（位）：2048 是当前安全下限；越大越安全但越慢 */
    private static final int KEY_SIZE = 2048;

    /** 私有构造方法：工具类不允许被 new，全部通过静态方法调用 */
    private RsaUtil() {
    }

    /**
     * 生成一对 RSA 密钥（公钥 + 私钥）
     */
    public static KeyPair generateKeyPair() throws Exception {
        // 取得 RSA 算法的密钥对生成器
        KeyPairGenerator generator = KeyPairGenerator.getInstance(ALGORITHM);
        // 指定密钥长度，并传入密码学安全的随机源（随机源决定了大素数 p、q 的随机性）
        generator.initialize(KEY_SIZE, new SecureRandom());
        // 生成并返回密钥对（内部会完成"挑素数 → 算 N → 算 E、D"的全过程）
        return generator.generateKeyPair();
    }

    /**
     * 公钥 → Base64 字符串（下发给前端）
     */
    public static String encodePublicKey(PublicKey publicKey) {
        // getEncoded() 返回 X.509 标准编码的字节数组；Base64 编码后变成纯文本
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    /**
     * 私钥 → Base64 字符串（存入 Redis）
     */
    public static String encodePrivateKey(PrivateKey privateKey) {
        // getEncoded() 返回 PKCS#8 标准编码的字节数组；Base64 编码后变成纯文本
        return Base64.getEncoder().encodeToString(privateKey.getEncoded());
    }

    /**
     * Base64 字符串 → 公钥对象
     */
    public static PublicKey decodePublicKey(String base64PublicKey) throws Exception {
        // 先把 Base64 文本解回字节数组
        byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
        // 用 X.509 规格 + RSA 工厂，把字节数组还原成 PublicKey 对象
        return KeyFactory.getInstance(ALGORITHM).generatePublic(new X509EncodedKeySpec(keyBytes));
    }

    /**
     * Base64 字符串 → 私钥对象
     */
    public static PrivateKey decodePrivateKey(String base64PrivateKey) throws Exception {
        // 先把 Base64 文本解回字节数组
        byte[] keyBytes = Base64.getDecoder().decode(base64PrivateKey);
        // 用 PKCS#8 规格 + RSA 工厂，把字节数组还原成 PrivateKey 对象
        return KeyFactory.getInstance(ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
    }

    /**
     * 公钥加密：明文 → Base64 密文
     * 真实场景中这一步由前端 JSEncrypt 完成，后端只保留此方法用于自测
     */
    public static String encrypt(String plainText, PublicKey publicKey) throws Exception {
        // 按「RSA/ECB/PKCS1Padding」拿到一个 Cipher 实例
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        // 初始化为"加密模式"，并传入公钥
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        // 把明文字符串按 UTF-8 转成字节 → 执行加密 → 结果再 Base64 编码成文本
        return Base64.getEncoder().encodeToString(
                cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8)));
    }

    /**
     * 私钥解密：Base64 密文 → 明文
     */
    public static String decrypt(String base64CipherText, PrivateKey privateKey) throws Exception {
        // 同样按「RSA/ECB/PKCS1Padding」拿 Cipher 实例（填充方式必须和加密时一致）
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        // 初始化为"解密模式"，并传入私钥
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        // Base64 文本 → 字节 → 执行解密（Cipher 会自动剥掉填充）→ 按 UTF-8 还原成字符串
        return new String(
                cipher.doFinal(Base64.getDecoder().decode(base64CipherText)),
                StandardCharsets.UTF_8);
    }
}

```

```java [RsaKeyManager.java]
/**
 * RSA 密钥管理器：私钥集中托管，前端只会拿到公钥
 * 对应项目：com.demo.redisdemo.service.RsaKeyManager
 * 差异：真实项目用 StringRedisTemplate 存私钥并设置 5 分钟 TTL；本示例用 Map 模拟，便于直接运行
 */
class RsaKeyManagerAnnotated {

    /** Redis 中私钥 key 的前缀，最终键形如：auth:rsa:{keyId} */
    private static final String KEY_PREFIX = "auth:rsa:";

    /** 用 Map 模拟 Redis：键是 "auth:rsa:{keyId}"，值是私钥的 Base64 字符串 */
    private final Map<String, String> fakeRedis = new HashMap<>();

    /** 仅用于本示例：按 keyId 保存公钥，方便 main 里模拟"前端拿到公钥"（真实项目公钥直接返回给前端） */
    private final Map<String, PublicKey> publicKeyCache = new HashMap<>();

    /**
     * 生成新密钥对：私钥进"Redis"，返回 keyId
     * 真实项目签名：public PublicKeyVO generateKey()
     */
    public String generateKey() throws Exception {
        // 生成一对全新的密钥
        KeyPair keyPair = RsaUtil.generateKeyPair();
        // 生成一个去横线的 UUID 作为 keyId（前端要带回来用它定位私钥）
        String keyId = UUID.randomUUID().toString().replace("-", "");
        // 把私钥以 "auth:rsa:{keyId}" 为键写入"Redis"
        fakeRedis.put(KEY_PREFIX + keyId, RsaUtil.encodePrivateKey(keyPair.getPrivate()));
        // 本示例专用：暂存公钥，模拟"前端拿到公钥"（真实项目这一步是把公钥放进响应返回）
        publicKeyCache.put(keyId, keyPair.getPublic());
        // 把 keyId 返回给调用方（真实项目还会一起返回公钥）
        return keyId;
    }

    /** 仅用于本示例：取出某次生成的公钥 */
    public PublicKey getPublicKey(String keyId) {
        // 从缓存里读公钥
        return publicKeyCache.get(keyId);
    }

    /**
     * 用 keyId 对应的私钥解密密码密文
     * 一次一密：解密成功后立刻删除私钥，防止同一份密文被重放
     */
    public String decryptPassword(String keyId, String cipherText) throws Exception {
        // keyId 或密文为空 → 直接报错
        if (keyId == null || keyId.isBlank() || cipherText == null || cipherText.isBlank()) {
            // 抛出异常，交由上层统一处理
            throw new RuntimeException("缺少密钥标识或密码密文");
        }
        // 用 keyId 拼出键名，去"Redis"里取私钥
        String privateKeyBase64 = fakeRedis.get(KEY_PREFIX + keyId);
        // 取不到 → 说明私钥已被用过（一次一密）或已过期
        if (privateKeyBase64 == null) {
            // 给出明确提示，前端需重新获取公钥
            throw new RuntimeException("公钥已失效，请重新获取公钥后再试");
        }
        // 声明解密结果变量
        String plainPassword;
        try {
            // 还原私钥 → 解密 → 得到明文
            plainPassword = RsaUtil.decrypt(cipherText, RsaUtil.decodePrivateKey(privateKeyBase64));
        } catch (Exception e) {
            // 解不开（密文非法 / 密钥不匹配）→ 报错，注意此时"不删除"私钥，允许在 TTL 内重试
            throw new RuntimeException("密码解密失败，请重新获取公钥后再试");
        }
        // 解密成功 → 立刻删除私钥（这一步就是"一次一密"的关键）
        fakeRedis.remove(KEY_PREFIX + keyId);
        // 返回明文密码（调用方拿到后会再走 BCrypt 校验）
        return plainPassword;
    }
}

```

:::