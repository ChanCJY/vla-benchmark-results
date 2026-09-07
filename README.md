# VLA Benchmark Results 页面

RoboTwin 2.0 与 LIBERO 开源模型测评结果展示页，页面风格参考 TermiBrain-VL 站（浅色背景 + 红色强调 + 左侧导航 + 卡片布局）。

📎 线上地址（GitHub Pages）：https://ChanCJY.github.io/vla-benchmark-results/

## 目录结构

```text
.
├── index.html    # 页面骨架与文案
├── styles.css    # 样式
├── data.js       # ⭐ 所有测评数据（模型、任务、分数）都维护在这里
├── main.js       # 渲染逻辑（自动生成统计 / 表格 / 分析 / 图表）
├── favicon.svg
└── README.md
```

## 如何填写真实分数

1. 打开 `data.js`，把 `meta.isSample` 保持为 `true` 期间，页面顶部会显示示例数据提示；
2. 每个基准下 `tasks` 数组里的 `scores` 对应各模型得分（成功率 %）；
3. 没测的任务填 `null`（显示 “—”），不会计入平均值；
4. 平均值、行内最高分、🏆 最优模型、条形图全部由 `main.js` 自动计算；
5. 全部替换为真实结果后，将 `meta.isSample` 改为 `false`。

### 新增任务

在某个基准的 `tasks` 数组追加一行：

```js
{
  task: "open_drawer",
  label: "打开抽屉",              // 可选
  scores: { starvla: 88.0, pi05: 82.0, xvla: 80.0 }
}
```

RoboTwin 2.0 官方 50 个任务名可参考仓库中的
`RoboTwin/description/task_instruction/` 目录（共 50 个 yml/json 文件名）。

### 新增模型

先在 `models` 数组追加一条（`id` 需唯一），再把该 `id` 作为键补到每个
`scores` 对象中；表格列会自动出现。

## 本地预览

直接双击打开 `index.html` 即可（无需服务器）。若在浏览器里打开没有更新，
请强制刷新（Ctrl/Cmd + Shift + R）。

## 发布到 GitHub Pages

本项目是纯静态站点，部署方式：

```bash
cd vla-benchmark-site
git init
git add .
git commit -m "init benchmark page"
# 在 GitHub 新建仓库后：
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

然后在仓库 Settings → Pages 中把分支设为 `main`、目录设为 `/ (root)`，
即可通过 `https://<用户名>.github.io/<仓库名>/` 访问。
