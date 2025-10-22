# Nova Creator CLI - SillyTavern 角色卡自动化创作工具

一个完全自动化的 SillyTavern 角色卡创作工作流，从需求到成品，只需两步。

## 核心特性

- **📝 一键生成待办清单**：通过 HTML 表单快速生成结构化的创作任务清单
- **🤖 AI 驱动创作**：将待办清单发送给 LLM，自动生成完整的角色卡内容
- **📦 自动打包**：使用 Node.js 程序将所有文件打包成标准 SillyTavern JSON 格式
- **🎯 支持高级功能**：内置 MVU 动态变量、分阶段人设、状态栏等高级特性

## 工作流程

### 第一步：生成待办清单

1. 在浏览器中打开 `to-do-generator.html`
2. 填写作品基本信息：
   - 作品名称
   - 角色信息
   - 背景设定
   - MVU 需求等
3. 点击"生成 To-Do 文件"，下载生成的 `to-do.md`

### 第二步：AI 全自动创作

1. 在 VS Code 或 Cursor 中打开项目
2. 将 `to-do.md` 文件发送给 AI（Gemini/Claude）
3. AI 会自动按照待办清单完成所有工作：
   - 创建作品目录结构
   - 生成所有必需的文件（角色设定、背景、开场白等）
   - 实现 MVU 变量系统
   - 完成分阶段人设
   - **编写 YAML 配置文件**
   - **运行打包程序生成 JSON 角色卡**
4. 完成后，你会得到：
   - `作品/[作品名称]/` 下的所有源文件
   - 可直接导入 SillyTavern 的 `.json` 文件

### 第三步：导入使用

将生成的 `.json` 文件导入 SillyTavern，开始使用!

## 前置要求

### 必需环境

- **Node.js**：用于运行打包程序
- **代码编辑器**：VS Code 或 Cursor
- **AI CLI**：Claude Code 或 Gemini CLI（任选其一）

### 推荐扩展

- VS Code 用户：安装对应的 AI 扩展（Claude Code / Gemini CLI Companion）
- 推荐安装：`XYAML Support`（用于 `.xyaml` 文件语法高亮）

## 配置文件说明

配置文件使用 YAML 格式，定义了如何将生成的文件映射到角色卡的各个字段。

示例配置：

```yaml
name: 与傲娇废宅妹妹的同居生活
fields:
  description: 作品/与傲娇废宅妹妹的同居生活/角色设定_橘ひなた.xyaml
  first_mes: 作品/与傲娇废宅妹妹的同居生活/开场白.md
extensions:
  status_bar: 作品/与傲娇废宅妹妹的同居生活/状态栏.html
character_book:
  entries:
    - comment: "[InitVar]初始化"
      content: 作品/与傲娇废宅妹妹的同居生活/变量初始化_beta.xyaml
      enabled: false
      position: before_char
      insertion_order: 100
```

详细说明参见 `config.example.yaml`

## 项目结构

```
nova-creator-cli/
├── to-do-generator.html    # 待办清单生成器
├── build-card.js            # 角色卡打包程序
├── config.example.yaml      # 配置文件示例
├── 基础模板/                # 创作参考模板
├── MVU组件包/               # MVU 系统说明文档
└── 作品/                    # AI 生成的角色卡文件存放处
```

## 版本控制建议

建议使用 Git 管理你的创作：

```bash
git init
git add .
git commit -m "完成角色设定"
```

每完成一个重要阶段就提交一次，方便回溯和对比。

## 示例作品

参见 `作品/与傲娇废宅妹妹的同居生活/` 目录，这是一个完整的角色卡示例，包含：
- 详细的角色设定
- 动态变量系统
- 分阶段人设
- 状态栏显示

## 许可证

MIT