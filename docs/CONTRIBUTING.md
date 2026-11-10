# 贡献指南

感谢你愿意改进 CodeForge。这个项目的核心不是代码，而是**协议的一致性**，所以贡献时最重要的两件事是：别破坏契约，别把规则写散。

## 可以提什么

- 角色职责边界不清、职责重叠、输入输出缺失；
- 判档评分不合理，或升级/降档规则有漏洞；
- 任务卡、交付包、打回格式在真实使用中不好用；
- 文档错误、安装步骤不准确；
- 新的宿主适配方式（并说明你实际验证过的版本与步骤）。

## 提交前

1. 先搜 issue，避免重复。
2. 一个 PR 只做一件事。
3. 改协议时，同步检查受影响的文件：
   - `SKILL.md` 的调度说明；
   - `references/team.json` 的组织与策略；
   - `references/protocol/` 下的对应协议；
   - `README.md` 中引用了该规则的部分。
4. 本地跑一遍校验（见下），确保 CI 会过。

## 新增一个角色

1. 在 `references/team.json` 的 `members` 中增加一条记录，字段与现有角色一致。
2. 新建 `references/agents/<id>.md`，包含 frontmatter：

   ```yaml
   ---
   name: <id>
   description: "一句话说明何时使用该角色"
   role: member
   group: <product-planning|engineering|quality-security|experience-delivery>
   reports_to: <组长 id>
   profile: <plan|build|review|verify|deliver|...>
   displayName:
     en: "..."
     zh: "..."
   profession:
     en: "..."
     zh: "..."
   ---
   ```

3. 角色正文只写：职责、输入输出、工作方法、交付标准、边界。不要把跨组流程写进角色文件。
4. 如果新增角色改变了组内规模，更新 `README.md` 名册与 `SKILL.md` 的人数描述。

## 修改判档

判档规则在 `references/protocol/INTAKE.md` 与 `team.json` 的 `policies.scaling`。两者必须一致：

- 维度名称、分值、档位边界；
- 覆盖优先级；
- 升级与降档条件。

只改一处会被 CI 之外的人工 review 拦下。

## 文风

- 中文为主，术语首次出现时给出英文。
- 用「必须 / 不允许」写硬规则，用「建议」写软约束。
- 不写无法验证的承诺（例如「保证零 bug」）。
- 示例数据一律使用虚构名称。

## 本地校验

```bash
python3 - <<'PY'
import json, pathlib, re, sys
root = pathlib.Path('.')
team = json.loads((root/'references/team.json').read_text(encoding='utf-8'))
ids = [m['id'] for m in team['members']]
assert len(ids) == len(set(ids)), 'duplicate role id'
for i in ids:
    assert (root/f'references/agents/{i}.md').exists(), f'missing agent file: {i}'
bad = re.compile(r'C:\\\\Users|/Users/|@qq\.com|sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}')
for p in root.rglob('*'):
    if p.is_file() and p.suffix in {'.md', '.json', '.yml', '.yaml'}:
        text = p.read_text(encoding='utf-8', errors='ignore')
        assert not bad.search(text), f'possible private data in {p}'
print(f'OK: {len(ids)} roles')
PY
```

## PR 检查清单

- [ ] 角色文件与 `team.json` 一一对应；
- [ ] 没有真实姓名、邮箱、绝对路径、Token 或内部项目名；
- [ ] 协议改动已同步到所有引用处；
- [ ] 文档里的命令能照抄执行；
- [ ] 没有引入脚本、依赖或网络请求。

## 行为准则

讨论对事不对人。可以尖锐，不要人身攻击。维护者有权拒绝不符合协议一致性的改动，并会说明理由。
