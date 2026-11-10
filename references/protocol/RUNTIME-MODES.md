# 运行模式：同一套团队，三种跑法

通用形态的关键不是“让所有平台长得一样”，而是把团队定义和运行方式分开。平台能力不同，跑法分三档。

## 模式 A · 原生多 Agent（保真最高）

适用：WorkBuddy 专家团、Claude Code Subagents、Codex Subagents、DeepSeek Harness Agent Teams、Qoder（带 Agent 工具）。

做法：

1. 主会话就是项目开发部门主管，或把主管角色作为第一个子 Agent 拉起。
2. 主管用平台原生的“派子 Agent / Task / spawn”能力派给四位组长。
3. 组长继续派组员；平台支持嵌套就嵌套，不支持就由主管代转。
4. 每个子 Agent 使用 `agents/<id>.md` 的角色提示词，按 `protocol/ORCHESTRATION.md` 交付。

平台差异：

- **WorkBuddy**：`teamInfo.leadAgent` + `memberAgents`，原生卡片与成员列表。
- **Claude Code**：`.claude/agents/*.md`，`Task` 工具派活；v2.1.172+ 支持子 Agent 再派子 Agent。
- **Codex CLI**：`~/.codex/agents/*.toml`，`[agents] max_depth` 控制嵌套；组长需要至少 2 层深度。
- **DeepSeek Harness**：`team.yaml` + `dsh-agent-teams` / `dsh run-team`，或原生子 Agent。
- **Qoder**：Skill 加载角色库，主代理用 Agent 工具派子代理；子代理不能嵌套时由主代理代转。

## 模式 B · Skill 驱动（保真中）

适用：只有 Skill/提示词加载、没有稳定子 Agent API 的宿主（Qoder、Claude Skills、DSH Skills）。

做法：

1. 加载 `skills/codeforge-team/SKILL.md`。
2. 主代理按协议自己扮演主管，按需“切换角色帽”或调用可用的子代理。
3. 每个角色仍读自己的 `agents/<id>.md`，交付包格式不变。
4. 没有并行就串行，但阶段、门禁、证据链不能省。

## 模式 C · 单模型角色扮演（保真最低，但最通用）

适用：任何能读 Markdown 的聊天模型/IDE 助手，没有子 Agent、没有 Skill 机制。

做法：

1. 把 `AGENTS.md` 放到项目根目录，作为团队总规则。
2. 模型按“主管 → 组长 → 专家”顺序切换角色，每次切换显式标注：
   `【当前角色：工程实现组长 / engineering-lead】`
3. 每个角色只做自己职责内的事，交付包照模板写。
4. 没有真并行，必须按依赖串行；禁止假装已经并行完成。

## 保真度对照

| 能力 | A 原生 | B Skill | C 角色扮演 |
|---|---|---|---|
| 角色提示词 | 完整 | 完整 | 完整 |
| 独立上下文 | 有 | 部分 | 无 |
| 真并行 | 有 | 视宿主 | 无 |
| 三层汇报 | 原生/代转 | 代转 | 显式切换 |
| 工具权限隔离 | 平台级 | 提示词级 | 提示词级 |
| 证据链与门禁 | 完整 | 完整 | 完整 |

选择原则：能用 A 不用 B，能用 B 不用 C；但无论哪档，交付契约和验收门禁必须一致。
