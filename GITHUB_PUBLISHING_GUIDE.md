# 发布到 GitHub 前的准备清单

## 先确认这些信息

- 仓库名称：建议 `boss-job-capture` 或 `boss-notion-capture`
- 仓库简介：例如“点击采集 BOSS 直聘当前岗位，可保存到本地或 Notion”
- 可见范围：公开仓库会让任何人查看源代码；是否公开由仓库所有者决定
- 许可证：MIT、Apache-2.0 等需由作者选择；不确定时先不要声称他人可自由复用
- 支持范围：目前是 Chrome Manifest V3；其他 Chromium 浏览器是否支持需单独验证
- Notion 连接方式：每位使用者自行创建并保管凭据；不得把你的 Token 分享给下载者
- 当前状态：本地解压安装；未上架 Chrome 网上应用店

## 发布前必须做的整理

1. 统一产品名称、按钮文案和 README。代码当前支持本地保存和可选 Notion 写入，文案应保持一致。
2. 用全新 Chrome 扩展配置实际走一遍：加载扩展、采集岗位、修正字段、本地保存、CSV 导出。
3. 如公开宣称支持 Notion，再用测试数据库验证授权、创建页面、字段映射、重复链接处理和错误提示。
4. 搜索整个待发布目录，确认没有 API Token、Cookie、个人岗位链接参数、个人邮箱或本地测试数据。
5. 检查 `manifest.json` 权限只保留功能所需项，并在 README 解释为什么要读取 BOSS 页面和访问 Notion API。
6. 添加 `LICENSE`（作者确认许可证）、`.gitignore`（忽略本机配置、日志、导出文件）及版本记录。
7. 准备不含个人信息与凭据的截图/GIF，展示采集、修改字段、本地记录和导出流程。
8. 写清楚问题反馈方式、支持的 Chrome 版本、已知限制和隐私说明。

## GitHub 网页发布步骤

1. 登录 GitHub，点击右上角 `+` → `New repository`。
2. 填写仓库名、简介，按计划选择 Public 或 Private。
3. README 已由本项目提供；若选择 GitHub 页面初始化 README，后续需避免重复文件。
4. 创建仓库后按 GitHub 页面给出的说明上传 `boss-notion-capture` 文件夹内的扩展文件，或使用 Git 推送。
5. 创建首个 Release，例如 `v1.2.0`，附上源码 ZIP，并注明这是开发者模式安装版。
6. 从 Release 下载 ZIP，按 README 的安装说明重新安装一次，确认 ZIP 内层级正确：解压后选择的文件夹中直接包含 `manifest.json`。

## 给使用者的安装教程要点

1. 下载 Release ZIP 并解压。
2. 打开 `chrome://extensions`，开启开发者模式。
3. 点击“加载已解压的扩展程序”，选择包含 `manifest.json` 的文件夹。
4. 打开 BOSS 岗位详情页，点击扩展图标并核对采集结果。
5. 可只用本地保存；需要 Notion 时，使用者自行创建令牌、授权数据库并在扩展设置中输入。
6. 将岗位链接等个人信息发 Issue 前先打码；绝不提交 Token。

## 公开仓库前的凭据处理

- 只发布扩展源代码，不发布自己的 Notion Token、浏览器配置目录、Cookie、岗位导出 CSV 或用户数据。
- 如果 Token 曾经进过 Git 历史，即使后来删除文件，也应立即在 Notion 撤销该 Token，并清理 Git 历史后再公开。
- 不要让用户把 Token 发给仓库作者或贴到 Issue；凭据只应在用户自己的浏览器扩展设置中输入。
- 当前 Token 使用 `chrome.storage.local` 保存。它不等同于操作系统级密钥库；公开说明需提醒用户只使用可信、自己检查过的扩展代码。
