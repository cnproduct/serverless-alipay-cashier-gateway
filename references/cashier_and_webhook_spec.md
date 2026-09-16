# 接口规范与收银台设计文档 (Cashier & Webhook Specification)

## 1. 收银台界面 (`/pay`)
- **设计风格**: 现代暗黑极简科技风 (Tailwind-like Dark Theme)；
- **核心交互**:
  1. 用户输入目标电脑机器码 (`mid`)；
  2. 点击选择套餐（月度 ¥299 / 季度 ¥799 / 年度 ¥2499）；
  3. 点击「支付宝一键安全支付」，前端发起 `POST /api/pay/create-order` 请求，收到跳转链接后自动重定向至支付宝收银台；
  4. 支付完成后，支付宝同步跳转回 `/pay?order_id=WB_ORD_...`，页面自动开启 2 秒轮询；
  5. 识别到订单已支付后，页面平滑弹出发卡成功弹窗，展示专属授权码并提供「一键复制」。

---

## 2. 订单创建接口 (`POST /api/pay/create-order`)
- **请求体**:
  ```json
  {
    "mid": "MID-ABCD-1234-5678-EF01",
    "name": "张先生",
    "plan_id": "quarterly"
  }
  ```
- **响应体**:
  ```json
  {
    "ok": true,
    "order_id": "WB_ORD_20260916124021_JCR7V",
    "amount": "799.00",
    "plan_name": "季度进阶版 (90 天)",
    "pay_url": "https://openapi.alipay.com/gateway.do?app_id=2021007100687379&method=alipay.trade.page.pay..."
  }
  ```

---

## 3. 支付宝异步通知 Webhook (`POST /api/pay/alipay-callback`)
- **处理逻辑**:
  1. 接收 `application/x-www-form-urlencoded` 表单数据；
  2. 提取除 `sign` 与 `sign_type` 外的所有参数，按字典序升序排列待签名串；
  3. 使用支付宝官方公钥进行 RSA-SHA256 验签；
  4. 验证通过后，读取 `passback_params` 中的机器码与天数；
  5. 使用 RSA-PSS 2048-bit 私钥签发 `LIC-RSA-...` 商业授权码；
  6. 保存授权记录到 KV 并将订单标记为 `PAID`；
  7. 响应纯文本 `success` 告知支付宝。

---

## 4. 管理控制台 (`GET /admin?key=YOUR_SECRET`)
- **功能**:
  - 授权总量、在线有效授权数、支付成交订单数、累计销售额统计卡片；
  - 授权管理表格：查看客户、机器码、授权码、到期时间、使用量，支持一键「在线封禁」、「解封」、「续期+30天」；
  - 财务订单表格：商户订单号、套餐名称、实付金额、客户名、机器码、支付宝流水号、支付时间、状态。
