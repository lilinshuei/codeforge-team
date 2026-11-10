# Changelog

所有值得记录的变更都会写在这里。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [1.0.2] - 2026-11-10

### Fixed

- 移除误入发布产物的发布者主机加固记录（含防火墙、内网端口与安全设置说明）。
- `SECURITY.md` 不再指向主机环境文档，安全策略只描述本包自身的行为边界。

## [1.0.1] - 2026-11-10

### Added

- DSH 插件适配层：`dsh plugin --profile web add github:lilinshuei/codeforge-team` 一条命令安装，自动注册 `codeforge-team` 技能。
- `package.json` 与 `cordis.patch.yml`，作为标准 DSH 插件包结构。
- README 顶部中英双语置顶语。

### Changed

- 安装文档以已经验证过的 GitHub 一行安装为准。

## [1.0.0] - 2026-11-10

首个公开版本。

### Added

- 40 人组织模型：1 位项目开发部门主管、4 位组长、35 位专家。
- 四级汇报链与「主理人只派组长、组长只派组员」的硬规则。
- 六阶段交付流程：受理分级 → 立项方案 → 架构实现 → 质量门禁 → 体验交付 → 终验复盘。
- 自动判档：六维 0~18 分，映射精简 / 标准 / 全量三档，支持执行中单向升级。
- 任务卡与交付包模板，要求交付必须带证据。
- 40 份角色提示词，覆盖产品规划、工程实现、质量安全、体验交付。
- 三种运行模式：原生多 Agent、Skill 驱动、单模型角色扮演。
- GitHub Actions 结构校验：角色文件完整性、JSON 可解析、隐私与密钥模式扫描。
