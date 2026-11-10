# 安全策略

## 这个仓库里有什么

主体是 Markdown 提示词与 JSON 元数据，另有一个可选的 DSH 插件适配层：

- `lib/index.js`：唯一的可执行文件。零依赖、无安装钩子、无联网请求、无遥测；只读取包内的 `SKILL.md`，并把它注册给宿主的技能注册表。
- `cordis.patch.yml`：DSH 的挂载声明，只声明插件 id 与包名。
- 不安装任何东西时，它仍然只是一个纯提示词 Skill，可以手动复制使用。

它不会自行读取包外文件、调用工具或修改代码；它只影响加载它的 Agent 如何组织工作。

真正的权限来自宿主（DeepSeek Harness、Qoder、Claude Code、Codex 等）授予 Agent 的能力。请按最小权限原则配置宿主。

## 报告问题

如果你发现提示词中存在可能导致危险行为的指令（例如绕过审批、静默执行、越权访问），请通过 GitHub 的 [Private vulnerability reporting](https://github.com/lilinshuei/codeforge-team/security/advisories/new) 私下报告，不要开公开 issue。

请附上：文件路径、相关片段、触发条件、可能影响。

## 使用边界

- 安全测试、渗透验证只可用于你拥有或已获得书面授权的目标。
- 高危操作（删除数据、发布生产、修改权限、产生费用）应由人类确认。
- 「带证据交付」是流程约束，不是安全沙箱；不要把它当作隔离机制。
