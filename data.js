/* =========================================================
 *  VLA Benchmark Results —— 数据配置文件
 *  所有测评分数都维护在这个文件里，改完刷新页面即可。
 *
 *  使用说明：
 *   1) scores 中的值表示成功率（%），如 76.0；
 *   2) 没有测过 / 没有记录的任务填 null（页面显示 “—”），
 *      也可以直接不写这个键；
 *   3) 新增任务：在对应 benchmark 的 tasks 数组里加一行；
 *   4) 新增模型：先在 models 里加模型，再在 tasks 的 scores 里补键；
 *   5) 全部填成真实数据后，把 meta.isSample 改为 false，
 *      页面顶部的“示例数据”提示会自动消失。
 *
 *  ⚠️ 当前 scores 中的数字只是排版用的示例占位值。
 * ========================================================= */

window.BENCH_DATA = {
  meta: {
    title: "VLA Benchmark Results",
    subtitle: "RoboTwin 2.0 × LIBERO 开源具身大模型测评结果",
    updatedAt: "2026-09-07",
    organizer: "", // 可选：负责人 / 组名，会显示在页脚
    metricNote: "所有分数统一为成功率 Success Rate (%)，越高越好。",
    evalNotes: [
      "分数为多次 episode 的成功率（Success Rate，%），数值来自官方/自建评测脚本。",
      "RoboTwin 2.0 页面逐任务记录；未测任务显示 “—” 且不计入平均值。",
      "LIBERO 按套件记录：Spatial / Object / Goal / Long(LIBERO-90)，LIBERO-10 行可填四个套件的综合均值。",
      "评估环境、相机配置、动作空间等协议差异会影响分数对比，详见 README 中的记录模板。",
    ],
    // 当前页面分数为示例占位数据。替换为真实结果后改成 false。
    isSample: true,
    sampleText:
      "现在表格里的数字是占位示例，用来演示排版效果，不代表真实测评结果。",
  },

  /* ---------- 被测模型 ---------- */
  models: [
    {
      id: "starvla",
      name: "StarVLA",
      base: "Qwen-VL 系列底座 + Fast Action Tokens",
      size: "3B / 4B 级",
      desc: "乐高式 VLA 开发平台，提供模型改造与开源微调 checkpoint，支持 LIBERO 等多套件评测。",
      tags: ["开源", "LIBERO 套件"],
      repo: "https://github.com/starVLA/starVLA",
      color: "#7c3aed",
    },
    {
      id: "pi05",
      name: "Pi0.5",
      base: "π0.5（PaliGemma 底座 + flow matching）",
      size: "3.3B",
      desc: "Physical Intelligence 开源的通用 VLA，支持多种 embodiment 与动作模式，可通过 openpi 训练与评测。",
      tags: ["开源", "openpi", "多形态"],
      repo: "https://github.com/physical-intelligence/openpi",
      color: "#0d9488",
    },
    {
      id: "xvla",
      name: "X-VLA",
      base: "Soft-prompted Transformer（跨形态）",
      size: "0.9B",
      desc: "以 soft prompt 实现跨本体迁移的轻量 VLA，在多个仿真平台与真实机器人上验证，已集成进 LeRobot。",
      tags: ["开源", "跨本体", "LeRobot"],
      repo: "https://github.com/2toinf/X-VLA",
      color: "#dc2626",
    },
    // 新增模型示例：复制下面这段并补上 scores 键即可
    // {
    //   id: "eventvla",
    //   name: "EventVLA",
    //   base: "…",
    //   size: "…",
    //   desc: "…",
    //   tags: [],
    //   repo: "",
    //   color: "#2563eb",
    // },
  ],

  /* ---------- 基准与分数 ---------- */
  benchmarks: [
    {
      id: "robotwin2",
      name: "RoboTwin 2.0",
      icon: "🦾",
      tagline:
        "双臂灵巧操作仿真基准（官方 50 任务）。以下为示例行，可在 tasks 中按相同格式扩充全部任务。",
      metric: "成功率 Success Rate (%)",
      tasks: [
        {
          task: "place_bread_skillet",
          label: "放面包入锅",
          scores: { starvla: 78.0, xvla: null, pi05: 74.0 },
        },
        {
          task: "stack_blocks_three",
          label: "堆叠三个积木",
          scores: { starvla: 76.0, xvla: 72.0, pi05: 80.0 },
        },
        {
          task: "open_microwave",
          label: "打开微波炉",
          scores: { starvla: 88.0, xvla: 84.0, pi05: 86.0 },
        },
        {
          task: "put_bottles_dustbin",
          label: "瓶子放入垃圾桶",
          scores: { starvla: 84.0, xvla: 80.0, pi05: 82.0 },
        },
        {
          task: "beat_block_hammer",
          label: "锤子敲击积木",
          scores: { starvla: 72.0, xvla: 70.0, pi05: 76.0 },
        },
        {
          task: "grab_roller",
          label: "抓取滚筒",
          scores: { starvla: 90.0, xvla: 86.0, pi05: 88.0 },
        },
        {
          task: "hanging_mug",
          label: "悬挂马克杯",
          scores: { starvla: 66.0, xvla: 58.0, pi05: 62.0 },
        },
        {
          task: "open_laptop",
          label: "打开笔记本电脑",
          scores: { starvla: 86.0, xvla: 82.0, pi05: 84.0 },
        },
        {
          task: "place_object_stand",
          label: "物体放上支架",
          scores: { starvla: 64.0, xvla: 60.0, pi05: 66.0 },
        },
        {
          task: "press_stapler",
          label: "按压订书机",
          scores: { starvla: null, xvla: 78.0, pi05: 80.0 },
        },
        {
          task: "rotate_qrcode",
          label: "旋转二维码",
          scores: { starvla: 70.0, xvla: 66.0, pi05: null },
        },
        {
          task: "turn_switch",
          label: "转动开关",
          scores: { starvla: 92.0, xvla: 90.0, pi05: 88.0 },
        },
      ],
      footNote:
        "示例仅含 12 个任务；全部 50 个任务名见 RoboTwin/description/task_instruction/。",
    },
    {
      id: "libero",
      name: "LIBERO",
      icon: "🧩",
      tagline:
        "单臂操作仿真基准。Spatial / Object / Goal / Long(LIBERO-90) 按官方套件记录；LIBERO-10 为四套件综合成绩行。",
      metric: "成功率 Success Rate (%)",
      tasks: [
        {
          task: "LIBERO-Spatial",
          label: "空间理解",
          scores: { starvla: 92.5, xvla: 90.0, pi05: 91.2 },
        },
        {
          task: "LIBERO-Object",
          label: "物体属性",
          scores: { starvla: 88.3, xvla: 84.6, pi05: 87.0 },
        },
        {
          task: "LIBERO-Goal",
          label: "目标推断",
          scores: { starvla: 89.2, xvla: 86.1, pi05: 88.4 },
        },
        {
          task: "LIBERO-90",
          label: "长程 Long",
          scores: { starvla: 85.7, xvla: 81.9, pi05: 84.0 },
        },
        {
          task: "LIBERO-10",
          label: "四套件综合",
          scores: { starvla: 88.9, xvla: 85.7, pi05: 87.7 },
          isRollup: true,
        },
      ],
      footNote:
        "LIBERO-10 是综合成绩行，不计入平均值计算；官方口径为四套件各自平均后再取均值。",
    },
  ],
};
