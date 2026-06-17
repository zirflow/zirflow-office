# Zirflow 竞品监控系统

## 自动运行

### GitHub Actions（数据采集）
- **定时**：每周一、周四 8:00 (UTC+8)
- **动作**：检查 10 个竞品项目的 Release 和 Commit
- **产出**：`reports/latest.json` + `reports/history.json`

### Claude Code（深度分析）
- **定时**：每周一、周四 10:07 (UTC+8)
- **动作**：读取 latest.json → 浏览 GitHub 更新内容 → 做缝合分析
- **产出**：直接向用户汇报

## 监控清单（10 个项目）

| 项目 | ⭐ | 关注点 |
|---|---|---|
| crewAI | 30k+ | Agent编排、角色定义、Crew控制台 |
| MetaGPT | 45k+ | 多角色协作、任务流水线 |
| AutoGen | 40k+ | 多Agent对话、企业级部署 |
| ChatDev | 25k+ | 角色扮演流程、阶段化执行 |
| SuperAGI | 6k+ | Web界面、Agent管理、任务调度 |
| Hermes-Studio | 8k+ | Agent仪表盘、Crews管理 |
| OpenClaw-Admin | 813 | 中文UI、虚拟公司场景 |
| my-virtual-office | 163 | 2D可视化办公室 |
| CrewAI-Flows | — | 事件驱动工作流编排 |
| OpenCrew | — | OpenClaw多智能体协同 |

## 新增项目来源
GitHub 搜索关键词：
- multi-agent orchestration platform
- AI agent team management visual
- AI employee workspace dashboard
- agent-as-a-service platform
- llm agent workflow visual editor
