# 安装与卸载

本仓库是一个 `SKILL.md` 形式的技能包，安装 = 把目录放到宿主会扫描的位置。

先决条件：宿主已安装并能正常使用；不需要额外 API Key、Node、Python 或任何依赖。

## DeepSeek Harness

### 插件安装（推荐）

```powershell
dsh plugin --profile web add codeforge-team
```

桌面端把 `web` 换成 `desktop`。也可以直接从 GitHub 安装：

```powershell
dsh plugin --profile web add github:lilinshuei/codeforge-team
```

装完重启对应 profile，新会话生效。卸载：

```powershell
dsh plugin --profile web remove codeforge-team
```

### 用户级（所有项目可用）

```bash
git clone https://github.com/lilinshuei/codeforge-team.git
mkdir -p ~/.dsh/skills
cp -r codeforge-team ~/.dsh/skills/
```

Windows PowerShell：

```powershell
git clone https://github.com/lilinshuei/codeforge-team.git
New-Item -ItemType Directory -Force "$HOME\.dsh\skills" | Out-Null
Copy-Item -Recurse -Force .\codeforge-team "$HOME\.dsh\skills\"
```

安装后路径：`~/.dsh/skills/codeforge-team/SKILL.md`（Windows：`%USERPROFILE%\.dsh\skills\codeforge-team\SKILL.md`）。

### 项目级（只在这个项目生效）

```bash
mkdir -p .dsh/skills
cp -r /path/to/codeforge-team .dsh/skills/
```

项目级优先级高于用户级。注意：项目根是「最近的包含 `.git` 的祖先目录」；把技能放在子目录里不会被发现。

### 验证

新开会话，输入：

> 用代码工坊专家团做个自检：报编制、档位、下一步。

预期报出：40 人组织、四位组长、三档判档逻辑，并等待一个真实任务。

如果没有任何反应，按顺序检查：

1. `SKILL.md` 是否在 `skills/codeforge-team/` 的**直接**下一层（扫描不递归）。
2. `SKILL.md` 是否以 `---` 开头，且 frontmatter 含 `name` 与 `description`。
3. 目录名与 `name` 是否都是 kebab-case（`codeforge-team`）。
4. 是否改过 `DSH_HOME`；改过的话放在新的 `$DSH_HOME/skills/` 下。
5. 宿主版本是否过旧；重启一次会话再试。

## 其他宿主

- **Qoder / Claude Code**：把 `codeforge-team/` 整个目录放进宿主的用户级或项目级技能目录，保持 `SKILL.md` 在目录根部。
- **Codex CLI**：若有 agents 目录，把 `references/agents/*.md` 转成宿主格式；没有的话直接用角色扮演模式。
- **任意聊天模型**：把 `SKILL.md`、`references/protocol/ORCHESTRATION.md`、`references/team.json` 和需要的角色文件一起提供给模型，要求它按「主管 → 组长 → 专家」顺序显式切换角色。

## 升级

```bash
cd ~/.dsh/skills/codeforge-team
git pull
```

如果是复制安装（没有 `.git`），重新下载并覆盖目录即可。升级前建议保留旧目录一份，便于回滚。

## 卸载

删除安装目录即可，不改动宿主配置：

```bash
rm -rf ~/.dsh/skills/codeforge-team
```

Windows PowerShell：

```powershell
Remove-Item -Recurse -Force "$HOME\.dsh\skills\codeforge-team"
```

## 最小权限建议

- 在独立分支或独立工作目录里运行，交付后再合并。
- 涉及生产发布、删除数据、修改权限、产生费用的动作，要求人工确认。
- 安全测试只对已授权目标执行。
