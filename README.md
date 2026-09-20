# VLA Benchmark Results 页面

RoboTwin 2.0 与 LIBERO 开源具身模型测评结果展示页，风格参考 TermiBrain-VL 站
（浅色背景 + 红色强调 + 左侧导航 + 卡片布局）。

- **线上地址**：https://chancjy.github.io/vla-benchmark-results/
- **源码仓库**：https://github.com/ChanCJY/vla-benchmark-results

## 页面功能

- **结果表**：RoboTwin 2.0 与 LIBERO 各套件逐任务成功率，自动标出每行最优（★）、自动计算平均值与排名（🥇🥈🥉）；
- **雷达图**：RoboTwin 2.0 任务类别雷达（按任务名归类、各类别等权）与 LIBERO 套件雷达（Spatial / Object / Goal / Long），悬停顶点可看具体数值；
- **条形图与结论卡片**：按各基准的平均成功率自动生成；
- 移动端自适应：窄屏下侧栏收起、表格可横向滚动、图表改为单列。

页面为纯静态实现，不依赖任何外部库或 CDN，离线打开也能正常显示。

## 数据概览

各基准的模型覆盖情况：

| 基准 | 模型 | 规模 |
| --- | --- | --- |
| RoboTwin 2.0 | LingBot-VLA（无深度 / 有深度）、ACT、RDT、X-VLA 80k / 40k | 50 个双臂任务；RDT 仅 31 个 |
| LIBERO | Pi0.5、StarVLA-FAST / OFT(Qwen2.5-VL) / GR00T / OFT(Qwen3-VL) / π(Qwen3-VL) | 40 个任务 × 50 episodes |

说明：

- 未测评或文档未提供的任务不填分数（页面显示 “—”），也不计入平均值；
- LIBERO 一共 4 个套件：Spatial / Object / Goal / Long（其中 Long 在文档中也写作 LIBERO-10，是同一个套件）；
- X-VLA 两个 checkpoint 分别为 80k / bs16 / 2×A100 与 40k / bs56 / 6×A100；
- 页面分数统一保留一位小数，平均值与最高分由 `main.js` 实时计算。

## 目录结构

```text
.
├── index.html    # 页面骨架与文案
├── styles.css    # 样式（含卡片、表格、雷达图）
├── data.js       # ⭐ 所有测评数据（模型、任务、分数）都维护在这里
├── main.js       # 渲染逻辑（统计 / 表格 / 雷达图 / 条形图 / 结论）
├── update.js     # 一键更新线上页面的脚本
├── favicon.svg
└── README.md
```

## 本地预览

直接双击 `index.html` 即可，无需启动服务器。若内容没有刷新，强制刷新一次
（Windows/Linux：`Ctrl + Shift + R`，macOS：`Cmd + Shift + R`）。

## 如何修改数据

所有分数都在 `data.js` 里，改完刷新页面即可生效。

### 填写 / 修改分数

每个基准的 `tasks` 数组代表一行任务，`scores` 里的键对应 `models` 中的模型 `id`：

```js
{
  task: "open_drawer",          // 任务名，与文档 / 数据目录保持一致
  label: "打开抽屉",             // 可选：页面上显示的中文说明
  scores: {
    starvla_oft: 88.0,          // 已测评：填成功率（%）
    xvla_40k: null,             // 未测评：填 null，页面显示 “—” 且不计入平均
  },
}
```

### 新增任务

在对应基准的 `tasks` 数组里追加一行即可，表格会多出一行。
RoboTwin 2.0 官方的 50 个任务名可参考仓库中的
`RoboTwin/description/task_instruction/` 目录。

### 新增模型

1. 在 `models` 数组里追加一条，`id` 全局唯一；
2. 在需要展示该模型的每个基准的 `models` 数组里加入这个 `id`（决定表格列与顺序）；
3. 在各任务的 `scores` 里补上以该 `id` 为键的分数。

### 其他可改项（`data.js` 的 `meta`）

| 字段 | 说明 |
| --- | --- |
| `updatedAt` | 页面顶部与页脚显示的更新日期 |
| `evalNotes` | “结果分析”里的测评说明列表 |
| `sourceRepo` | 顶部黄框中的源码仓库链接（留空则不显示该黄框） |
| `isSample` | 设为 `true` 时黄框会提示“当前为示例数据” |
| `subtitle` / `metricNote` | 页面副标题与指标说明 |

## 更新线上页面

### 方式一：一键脚本（推荐，在本机执行）

```bash
cd /data1/chan/vla-benchmark-site
GH_TOKEN=ghp_你的令牌 node update.js
```

脚本会读取本目录下的 `index.html`、`styles.css`、`data.js`、`main.js`、`README.md`、
`update.js`，通过 GitHub API 提交到 `ChanCJY/vla-benchmark-results`，然后等待
GitHub Pages 重新构建（约 1~3 分钟），构建完成后会打印线上地址。

令牌在 https://github.com/settings/tokens 生成（classic 类型，勾选 `repo` 权限），
用完后可以随时删除，下次更新再生成即可。

> 本服务器直连 github.com 可能超时，所以脚本走的是 `api.github.com`，更稳定。

### 方式二：标准 git 推送（在自己电脑上）

```bash
git clone https://github.com/ChanCJY/vla-benchmark-results.git
cd vla-benchmark-results
# 编辑 data.js 等文件 …
git add -A
git commit -m "update benchmark results"
git push origin main
```

仓库已配置 GitHub Pages（源分支 `main`、目录 `/ (root)`），推送后会自动重新构建，
无需再手动设置。
