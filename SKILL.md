---
name: serverless-alipay-cashier-gateway
description: Enterprise-grade serverless Alipay payment integration & automated hardware-bound licensing on Cloudflare Workers edge. Features pure BigInt RSA2 signing and verification (RSASSA-PKCS1-v1_5 SHA-256), ¥600/store single-store licensing cashier UI (/pay), automated webhook license dispensing (/api/pay/alipay-callback), real-time financial admin dashboard (/admin), and hardware binding (MID-XXXX-XXXX). Use when implementing Alipay payments on edge runtimes, automating software licensing, or securing commercial agent skills.
license: MIT
metadata:
  author: cnproduct
  version: "1.1.0"
  pricing: "¥600 RMB per store (单店商业授权 ¥600/店铺)"
---

# Serverless Alipay Cashier & Licensing Gateway (支付宝无服务器收银与按店自动发卡网关)

基于 **Cloudflare Workers + KV** 边缘计算构建的零服务器运维、高并发、秒级响应的 **支付宝官方开放平台支付收银与单店专属硬件绑定自动发卡系统**。

---

## 核心商业与技术铁律

1. **按店铺计费与单店专属授权 (¥600 RMB / 店铺)**：
   - 收费模式：每家 Wildberries 店铺收费 600 元人民币；
   - 支付宝扫码支付 600 元，系统秒级自动签发 1 个专属商业授权码；
   - 单窗口 1:1 店铺互斥锁定，从物理根源杜绝商品串店误传与库存错乱隐患。

2. **零服务器与全球边缘低延迟 (Serverless Global Edge)**：
   - 基于 Cloudflare Workers，全球 300+ 边缘节点就近响应，冷启动时间 < 20ms，零服务器管理与运维成本。

3. **纯数学 BigInt 高精度抗异常加密引擎 (Pure BigInt RSA2 Engine)**：
   - 摆脱对 V8 / BoringSSL 严苛 ASN.1 DER 解析库的脆弱依赖；
   - 基于 RFC 8017 标准，采用纯数学大整数模幂运算 ($s = m^d \pmod n$) 实现 RSASSA-PKCS1-v1_5 与 SHA-256 签名及公钥验签，确保 100% 免疫任何私钥格式偏差与运行时环境故障。

4. **极简现代暗黑风自适应收银台 (`/pay`)**：
   - 适配 PC 浏览器与移动端手机屏幕；
   - 用户输入电脑机器码（`MID-XXXX-XXXX-XXXX-XXXX`）与 Wildberries 店铺名称，默认单店 ¥600.00，一键唤起支付宝扫码或手机 App 支付。

5. **异步 Webhook 自动发卡与防重放 (`/api/pay/alipay-callback`)**：
   - 严格验签支付宝公钥；
   - 验签成功后，自动根据客户机器码与店铺名称生成不可伪造的专属 RSA-PSS 2048-bit 商业授权码（`LIC-RSA-...`）并持久化至 Cloudflare KV。

6. **实时轮询秒级发卡响应 (`/api/pay/order-status`)**：
   - 支付完成后，收银台自动感知并秒级弹出「🎉 支付成功！专属店铺授权码已生成」，提供一键复制与激活指引。

7. **财务流水与授权云端管理控制台 (`/admin`)**：
   - 实时订单流水、店铺销售金额累计统计 (¥600/店)；
   - 在线远程封禁违规授权、在线解封与一键续期。

---

## 快速起步与部署指南

### 1. 配置准备
- 支付宝开放平台 AppID（例如 `2021007100687379`）；
- 应用私钥（PKCS#8 RSA 2048-bit）与支付宝公钥；
- Cloudflare 账号及已创建的 KV 命名空间（`WB_LICENSES`）。

### 2. 部署到 Cloudflare Workers
```bash
cd cloud
npx wrangler deploy
```

### 3. 配置支付宝开放平台回调
在支付宝开放平台应用后台设置：
- **应用网关**: `https://<YOUR_WORKER_DOMAIN>/api/pay/alipay-callback`
- **授权回调地址**: `https://<YOUR_WORKER_DOMAIN>/pay`

---

## 路由清单

| Method | Endpoint | 描述 |
| :--- | :--- | :--- |
| `GET` | `/pay` | 自助收银台前端页面 (¥600/店) |
| `POST` | `/api/pay/create-order` | 创建待支付订单并返回支付宝支付跳转 URL |
| `POST` | `/api/pay/alipay-callback` | 支付宝支付成功异步通知 Webhook (自动发码) |
| `GET` | `/api/pay/order-status` | 轮询订单支付状态与获取已发授权码 |
| `GET` | `/api/verify` | 客户端软件在线授权验真接口 |
| `POST` | `/api/report_usage` | 客户端使用量上报接口 |
| `GET` | `/admin` | 管理员财务与店铺授权云端可视化控制台 |
| `POST` | `/admin/api/ban` | 管理员远程在线封禁授权 |
| `POST` | `/admin/api/unban` | 管理员远程解封授权 |
| `POST` | `/admin/api/renew` | 管理员远程续期授权 |
