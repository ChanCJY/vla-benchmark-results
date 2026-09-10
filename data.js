/* =========================================================
 *  VLA Benchmark Results —— 数据配置文件
 *  所有测评分数都维护在这个文件里，改完刷新页面即可。
 *
 *  数据来源：
 *    1) lingbotvla+ACT+pi05+RDT_eval_result.docx（RoboTwin 2.0 等，同步于 2026-09-07）
 *    2) starVLA.docx（StarVLA LIBERO 全套结果，同步于 2026-09-07）
 *    3) (完整)XVLA-RoboTwin.docx（X-VLA RoboTwin 2.0，同步于 2026-09-07）
 *  口径说明：仅收录每张表格的 “Ours” 列，“Author’s” 列未收录；
 *            未测 / 未提供数据的任务不写分数或填 null（页面显示 “—”）。
 *  冲突处理：starVLA.docx 与上一份文档中 StarVLA-π (Qwen3-VL) 的
 *            LIBERO-Goal 数值不一致，本页以更新的 starVLA.docx 为准。
 *
 *  使用说明：
 *   1) scores 中的值表示成功率（%），如 89.6 会显示为 89.6%；
 *   2) 新增任务：在对应 benchmark 的 tasks 数组里加一行；
 *   3) 新增模型：先在 models 里加模型，再在 tasks 的 scores 里补键，
 *      并在对应 benchmark 的 models 数组里加入该模型 id；
 *   4) 平均值、行内最高分、最优模型与图表由 main.js 自动计算。
 * ========================================================= */

window.BENCH_DATA = {
  meta: {
    title: "VLA Benchmark Results",
    subtitle: "RoboTwin 2.0 × LIBERO 开源具身大模型测评结果",
    updatedAt: "2026-09-07",
    organizer: "", // 可选：负责人 / 组名，会显示在页脚
    metricNote: "所有分数统一为成功率 Success Rate (%)，越高越好。",
    evalNotes: [
      "RoboTwin 2.0：官方 50 个双臂灵巧操作任务，逐任务记录成功率。",
      "RDT 文档仅提供前 31 个任务；X-VLA 80k checkpoint 提供前 41 个任务，其余任务显示 “—” 且不计入平均值。",
      "X-VLA 两个 checkpoint：80k / bs16 / 2×A100（41/50 任务）与 40k / bs56 / 6×A100（50 任务）。",
      "LIBERO：每个套件 10 个任务 × 50 episodes，StarVLA 各变体按套件记录逐任务 Ours 结果。",
      "LIBERO 汇总卡片中的 Long 与各套件平均值来自 starVLA.docx 汇总表；Long 无逐任务明细。",
      "StarVLA-π (Qwen3-VL) 的 LIBERO-Goal 与上一份文档不一致，本页以更新的 starVLA.docx（97.6）为准。",
      "所有数值仅取自原文档 “Ours” 列，“Author’s” 列未收录。",
    ],
    isSample: false, // 已替换为真实测评数据
    sampleText: "",
  },

  /* ---------- 被测模型 ---------- */
  models: [
    {
      id: "lingbot_nodepth",
      name: "LingBot-VLA",
      base: "w/o depth",
      size: "",
      desc: "无深度输入版本，RoboTwin 2.0 50 任务实测。",
      tags: ["RoboTwin 2.0"],
      repo: "",
      color: "#dc2626",
    },
    {
      id: "lingbot_depth",
      name: "LingBot-VLA",
      base: "w/ depth",
      size: "",
      desc: "带深度输入版本，RoboTwin 2.0 50 任务实测。",
      tags: ["RoboTwin 2.0"],
      repo: "",
      color: "#b91c1c",
    },
    {
      id: "act",
      name: "ACT",
      base: "A Simple Policy for Complex Tasks",
      size: "",
      desc: "机器人操作基线方法，RoboTwin 2.0 50 任务实测。",
      tags: ["基线", "RoboTwin 2.0"],
      repo: "",
      color: "#2563eb",
    },
    {
      id: "pi05",
      name: "Pi0.5",
      base: "π0.5（PaliGemma 底座 + flow matching）",
      size: "3.3B",
      desc: "Physical Intelligence 开源的通用 VLA，LIBERO-Spatial 10 任务实测。",
      tags: ["开源", "openpi", "LIBERO-Spatial"],
      repo: "https://github.com/physical-intelligence/openpi",
      color: "#0d9488",
    },
    {
      id: "rdt",
      name: "RDT",
      base: "Robotics Diffusion Transformer",
      size: "",
      desc: "扩散 Transformer 策略基线，RoboTwin 2.0 文档提供 31/50 任务实测。",
      tags: ["基线", "RoboTwin 2.0"],
      repo: "",
      color: "#7c3aed",
    },
    {
      id: "xvla_80k",
      name: "X-VLA",
      base: "80k / bs16 / 2×A100",
      size: "0.9B",
      desc: "X-VLA soft-prompted Transformer，RoboTwin 2.0 前 41 个任务实测。",
      tags: ["开源", "跨本体", "RoboTwin 2.0"],
      repo: "https://github.com/2toinf/X-VLA",
      color: "#4f46e5",
    },
    {
      id: "xvla_40k",
      name: "X-VLA",
      base: "40k / bs56 / 6×A100",
      size: "0.9B",
      desc: "X-VLA soft-prompted Transformer，RoboTwin 2.0 全部 50 任务实测。",
      tags: ["开源", "跨本体", "RoboTwin 2.0"],
      repo: "https://github.com/2toinf/X-VLA",
      color: "#6366f1",
    },
    {
      id: "starvla_fast_q25",
      name: "StarVLA-FAST",
      base: "Qwen2.5-VL · 30K",
      size: "",
      desc: "StarVLA FAST 动作头版本，LIBERO Spatial / Object / Goal / Long 全套件实测。",
      tags: ["开源", "StarVLA", "Qwen2.5-VL"],
      repo: "https://github.com/starVLA/starVLA",
      color: "#ca8a04",
    },
    {
      id: "starvla_oft_q25",
      name: "StarVLA-OFT",
      base: "Qwen2.5-VL · 30K",
      size: "",
      desc: "StarVLA OFT 版本（Qwen2.5-VL），LIBERO 全套件实测。",
      tags: ["开源", "StarVLA", "Qwen2.5-VL"],
      repo: "https://github.com/starVLA/starVLA",
      color: "#0891b2",
    },
    {
      id: "starvla_groot_q25",
      name: "StarVLA-GR00T",
      base: "Qwen2.5-VL · 30K",
      size: "",
      desc: "StarVLA GR00T 动作头版本，LIBERO 全套件实测。",
      tags: ["开源", "StarVLA", "Qwen2.5-VL"],
      repo: "https://github.com/starVLA/starVLA",
      color: "#16a34a",
    },
    {
      id: "starvla_oft",
      name: "StarVLA-OFT",
      base: "Qwen3-VL · 50K",
      size: "",
      desc: "StarVLA OFT 版本（Qwen3-VL），LIBERO Goal / Object / Spatial / 10 共 40 任务实测。",
      tags: ["开源", "StarVLA", "Qwen3-VL"],
      repo: "https://github.com/starVLA/starVLA",
      color: "#2563eb",
    },
    {
      id: "starvla_pi",
      name: "StarVLA-π",
      base: "Qwen3-VL · 100K",
      size: "",
      desc: "StarVLA π 动作头版本（Qwen3-VL），LIBERO 全套件实测（以 starVLA.docx 为准）。",
      tags: ["开源", "StarVLA", "Qwen3-VL"],
      repo: "https://github.com/starVLA/starVLA",
      color: "#ea580c",
    },
  ],

  /* ---------- 基准与分数 ---------- */
  benchmarks: [
    {
      id: "robotwin2",
      group: "robotwin",
      name: "RoboTwin 2.0 — 50 Bimanual Tasks",
      icon: "🦾",
      tagline:
        "双臂灵巧操作 50 任务。LingBot-VLA（无深度 / 有深度）、ACT、RDT、X-VLA（80k / 40k）的 Ours 成功率（%）。",
      metric: "成功率 Success Rate (%)",
      models: [
        "lingbot_nodepth",
        "lingbot_depth",
        "act",
        "rdt",
        "xvla_80k",
        "xvla_40k",
      ],
      tasks: [
        { task: "adjust_bottle", label: "调整瓶", scores: { lingbot_nodepth: 99, lingbot_depth: 100, act: 98, rdt: 84, xvla_80k: 81, xvla_40k: 76 } },
        { task: "beat_block_hammer", label: "击块锤", scores: { lingbot_nodepth: 84, lingbot_depth: 91, act: 53, rdt: 66, xvla_80k: 41, xvla_40k: 30 } },
        { task: "blocks_ranking_rgb", label: "红绿蓝块摆放(等大)", scores: { lingbot_nodepth: 96, lingbot_depth: 95, act: 0, rdt: 2, xvla_80k: 4, xvla_40k: 2 } },
        { task: "blocks_ranking_size", label: "大中小块摆放(随机色)", scores: { lingbot_nodepth: 71, lingbot_depth: 69, act: 1, rdt: 0, xvla_80k: 2, xvla_40k: 3 } },
        { task: "click_alarmclock", label: "点击闹钟", scores: { lingbot_nodepth: 23, lingbot_depth: 73, act: 32, rdt: 56, xvla_80k: 67, xvla_40k: 63 } },
        { task: "click_bell", label: "点击铃铛", scores: { lingbot_nodepth: 38, lingbot_depth: 84, act: 56, rdt: 77, xvla_80k: 87, xvla_40k: 83 } },
        { task: "dump_bin_bigbin", label: "拿起小桶，把球倒入大桶", scores: { lingbot_nodepth: 78, lingbot_depth: 80, act: 60, rdt: 61, xvla_80k: 60, xvla_40k: 39 } },
        { task: "grab_roller", label: "抓取滚筒", scores: { lingbot_nodepth: 100, lingbot_depth: 100, act: 94, rdt: 74, xvla_80k: 69, xvla_40k: 55 } },
        { task: "handover_block", label: "交接块", scores: { lingbot_nodepth: 97, lingbot_depth: 87, act: 40, rdt: 26, xvla_80k: 0, xvla_40k: 0 } },
        { task: "handover_mic", label: "交接麦克风", scores: { lingbot_nodepth: 92, lingbot_depth: 96, act: 88, rdt: 89, xvla_80k: 13, xvla_40k: 11 } },
        { task: "hanging_mug", label: "悬挂的杯子", scores: { lingbot_nodepth: 44, lingbot_depth: 49, act: 11, rdt: 18, xvla_80k: 0, xvla_40k: 0 } },
        { task: "lift_pot", label: "抬锅", scores: { lingbot_nodepth: 100, lingbot_depth: 100, act: 85, rdt: 75, xvla_80k: 3, xvla_40k: 20 } },
        { task: "move_can_pot", label: "移动罐头", scores: { lingbot_nodepth: 87, lingbot_depth: 70, act: 25, rdt: 22, xvla_80k: 21, xvla_40k: 32 } },
        { task: "move_pillbottle_pad", label: "移动药瓶到垫", scores: { lingbot_nodepth: 89, lingbot_depth: 92, act: 0, rdt: 4, xvla_80k: 22, xvla_40k: 19 } },
        { task: "move_playingcard_away", label: "移开扑克牌", scores: { lingbot_nodepth: 100, lingbot_depth: 99, act: 38, rdt: 41, xvla_80k: 56, xvla_40k: 43 } },
        { task: "move_stapler_pad", label: "移动订书机到垫", scores: { lingbot_nodepth: 68, lingbot_depth: 66, act: 0, rdt: 1, xvla_80k: 2, xvla_40k: 4 } },
        { task: "open_laptop", label: "打开笔记本电脑", scores: { lingbot_nodepth: 95, lingbot_depth: 95, act: 59, rdt: 63, xvla_80k: 39, xvla_40k: 35 } },
        { task: "open_microwave", label: "打开微波炉", scores: { lingbot_nodepth: 57, lingbot_depth: 73, act: 85, rdt: 53, xvla_80k: 2, xvla_40k: 3 } },
        { task: "pick_diverse_bottles", label: "两臂拿不同款瓶", scores: { lingbot_nodepth: 87, lingbot_depth: 77, act: 5, xvla_80k: 14, xvla_40k: 23 } },
        { task: "pick_dual_bottles", label: "两臂拿同款瓶", scores: { lingbot_nodepth: 92, lingbot_depth: 86, act: 30, xvla_80k: 30, xvla_40k: 21 } },
        { task: "place_a2b_left", label: "把a放在b左边", scores: { lingbot_nodepth: 87, lingbot_depth: 82, act: 0, rdt: 4, xvla_80k: 22, xvla_40k: 19 } },
        { task: "place_a2b_right", label: "把a放在b右边", scores: { lingbot_nodepth: 80, lingbot_depth: 77, act: 0, rdt: 2, xvla_80k: 19, xvla_40k: 16 } },
        { task: "place_bread_basket", label: "放置面包到篮", scores: { lingbot_nodepth: 91, lingbot_depth: 92, act: 3, rdt: 6, xvla_80k: 39, xvla_40k: 24 } },
        { task: "place_bread_skillet", label: "放置面包到煎锅", scores: { lingbot_nodepth: 88, lingbot_depth: 86, act: 8, rdt: 7, xvla_80k: 46, xvla_40k: 13 } },
        { task: "place_burger_fries", label: "放置汉堡薯条到盘", scores: { lingbot_nodepth: 99, lingbot_depth: 99, act: 53, rdt: 49, xvla_80k: 60, xvla_40k: 44 } },
        { task: "place_can_basket", label: "放置罐头到篮，提起", scores: { lingbot_nodepth: 86, lingbot_depth: 58, act: 2, rdt: 20, xvla_80k: 10, xvla_40k: 3 } },
        { task: "place_cans_plasticbox", label: "放置罐头到塑料盒", scores: { lingbot_nodepth: 97, lingbot_depth: 100, act: 18, rdt: 5, xvla_80k: 34, xvla_40k: 8 } },
        { task: "place_container_plate", label: "放置容器到板", scores: { lingbot_nodepth: 99, lingbot_depth: 99, act: 63, rdt: 78, xvla_80k: 70, xvla_40k: 62 } },
        { task: "place_dual_shoes", label: "放置双鞋", scores: { lingbot_nodepth: 77, lingbot_depth: 83, act: 4, rdt: 6, xvla_80k: 3, xvla_40k: 2 } },
        { task: "place_empty_cup", label: "放置空杯子", scores: { lingbot_nodepth: 100, lingbot_depth: 100, act: 62, rdt: 54, xvla_80k: 35, xvla_40k: 27 } },
        { task: "place_fan", label: "放置风扇", scores: { lingbot_nodepth: 81, lingbot_depth: 83, act: 1, rdt: 17, xvla_80k: 14, xvla_40k: 13 } },
        { task: "place_mouse_pad", label: "放置鼠标到垫", scores: { lingbot_nodepth: 88, lingbot_depth: 85, act: 0, rdt: 1, xvla_80k: 8, xvla_40k: 10 } },
        { task: "place_object_basket", label: "放置物品到篮", scores: { lingbot_nodepth: 89, lingbot_depth: 87, act: 14, rdt: 31, xvla_80k: 15, xvla_40k: 7 } },
        { task: "place_object_scale", label: "放置物品到秤", scores: { lingbot_nodepth: 89, lingbot_depth: 88, act: 0, xvla_80k: 13, xvla_40k: 9 } },
        { task: "place_object_stand", label: "放置物体到支架", scores: { lingbot_nodepth: 96, lingbot_depth: 95, act: 0, xvla_80k: 25, xvla_40k: 28 } },
        { task: "place_phone_stand", label: "放置手机到支架", scores: { lingbot_nodepth: 89, lingbot_depth: 87, act: 1, xvla_80k: 22, xvla_40k: 25 } },
        { task: "place_shoe", label: "放置鞋子", scores: { lingbot_nodepth: 91, lingbot_depth: 90, act: 2, xvla_80k: 32, xvla_40k: 28 } },
        { task: "press_stapler", label: "压订书机", scores: { lingbot_nodepth: 93, lingbot_depth: 90, act: 30, xvla_80k: 58, xvla_40k: 68 } },
        { task: "put_bottles_dustbin", label: "把瓶子放在垃圾桶里", scores: { lingbot_nodepth: 83, lingbot_depth: 85, act: 29, xvla_80k: 3, xvla_40k: 1 } },
        { task: "put_object_cabinet", label: "放置物品到柜", scores: { lingbot_nodepth: 86, lingbot_depth: 82, act: 5, xvla_80k: 14, xvla_40k: 6 } },
        { task: "rotate_qrcode", label: "旋转二维码", scores: { lingbot_nodepth: 85, lingbot_depth: 83, act: 0, xvla_80k: 26, xvla_40k: 18 } },
        { task: "scan_object", label: "扫描对象", scores: { lingbot_nodepth: 93, lingbot_depth: 94, act: 2, xvla_80k: 7, xvla_40k: 7 } },
        { task: "shake_bottle_horizontally", label: "水平摇晃瓶子", scores: { lingbot_nodepth: 100, lingbot_depth: 100, act: 60, xvla_80k: 89, xvla_40k: 91 } },
        { task: "shake_bottle", label: "摇晃瓶子", scores: { lingbot_nodepth: 100, lingbot_depth: 100, act: 74, xvla_80k: 91, xvla_40k: 94 } },
        { task: "stack_blocks_three", label: "红绿蓝块堆叠", scores: { lingbot_nodepth: 93, lingbot_depth: 89, act: 0, xvla_80k: 0, xvla_40k: 0 } },
        { task: "stack_blocks_two", label: "红绿块堆叠", scores: { lingbot_nodepth: 98, lingbot_depth: 99, act: 28, xvla_80k: 6, xvla_40k: 7 } },
        { task: "stack_bowls_three", label: "堆叠三个碗", scores: { lingbot_nodepth: 86, lingbot_depth: 74, act: 59, xvla_40k: 0 } },
        { task: "stack_bowls_two", label: "堆叠两个碗", scores: { lingbot_nodepth: 98, lingbot_depth: 97, act: 85, xvla_40k: 36 } },
        { task: "stamp_seal", label: "盖章", scores: { lingbot_nodepth: 74, lingbot_depth: 77, act: 3, xvla_40k: 50 } },
        { task: "turn_switch", label: "拨动开关", scores: { lingbot_nodepth: 55, lingbot_depth: 62, act: 3, xvla_40k: 15 } },
      ],
      footNote:
        "仅收录文档 Ours 列；RDT 仅 31/50、X-VLA(80k) 仅 41/50 个任务，未测任务 “—” 不计入平均值。",
    },

    /* LIBERO 汇总（starVLA.docx 汇总表，含 Long 总平均） */
    {
      id: "libero_summary",
      group: "libero",
      isSummary: true,
      name: "LIBERO 汇总（含 Long）",
      icon: "🧾",
      tagline:
        "starVLA.docx 汇总表：各套件平均与 Long 总平均；Long 无逐任务明细，其余套件的逐任务表见下方卡片。",
      metric: "平均成功率 Average Success Rate (%)",
      models: [
        "starvla_fast_q25",
        "starvla_oft_q25",
        "starvla_groot_q25",
        "starvla_oft",
        "starvla_pi",
      ],
      tasks: [
        { task: "LIBERO-Spatial", label: "10 tasks 平均", scores: { starvla_fast_q25: 89.6, starvla_oft_q25: 98.0, starvla_groot_q25: 97.6, starvla_oft: 98.6, starvla_pi: 98.6 } },
        { task: "LIBERO-Object", label: "10 tasks 平均", scores: { starvla_fast_q25: 97.4, starvla_oft_q25: 98.0, starvla_groot_q25: 99.2, starvla_oft: 100.0, starvla_pi: 97.8 } },
        { task: "LIBERO-Goal", label: "10 tasks 平均", scores: { starvla_fast_q25: 90.0, starvla_oft_q25: 97.2, starvla_groot_q25: 97.2, starvla_oft: 98.6, starvla_pi: 97.6 } },
        { task: "LIBERO-Long", label: "Long 总平均（无逐任务明细）", scores: { starvla_fast_q25: 84.4, starvla_oft_q25: 90.2, starvla_groot_q25: 90.2, starvla_oft: 95.4, starvla_pi: 95.6 } },
      ],
      footNote:
        "综合平均行由 Spatial / Object / Goal / Long 四套件均值自动计算；StarVLA-π 计算值 97.4（文档汇总表标注 97.5）。",
    },

    /* LIBERO-Spatial：逐任务 */
    {
      id: "libero_spatial",
      group: "libero",
      name: "LIBERO-Spatial",
      icon: "🧩",
      tagline: "10 任务 × 50 episodes 逐任务 Ours 成功率（%）：Pi0.5 与 StarVLA 各变体。",
      metric: "成功率 Success Rate (%)",
      models: [
        "pi05",
        "starvla_fast_q25",
        "starvla_oft_q25",
        "starvla_groot_q25",
        "starvla_oft",
        "starvla_pi",
      ],
      tasks: [
        { task: "pick_up_the_black_bowl_between_the_plate_and_the_ramekin_and_place_it_on_the_plate", scores: { pi05: 100, starvla_fast_q25: 78, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "pick_up_the_black_bowl_next_to_the_ramekin_and_place_it_on_the_plate", scores: { pi05: 100, starvla_fast_q25: 88, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 98, starvla_pi: 98 } },
        { task: "pick_up_the_black_bowl_from_table_center_and_place_it_on_the_plate", scores: { pi05: 100, starvla_fast_q25: 94, starvla_oft_q25: 98, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "pick_up_the_black_bowl_on_the_cookie_box_and_place_it_on_the_plate", scores: { pi05: 100, starvla_fast_q25: 84, starvla_oft_q25: 100, starvla_groot_q25: 94, starvla_oft: 100, starvla_pi: 100 } },
        { task: "pick_up_the_black_bowl_in_the_top_drawer_of_the_wooden_cabinet_and_place_it_on_the_plate", scores: { pi05: 96, starvla_fast_q25: 92, starvla_oft_q25: 100, starvla_groot_q25: 98, starvla_oft: 94, starvla_pi: 96 } },
        { task: "pick_up_the_black_bowl_next_to_the_cookie_box_and_place_it_on_the_plate", scores: { pi05: 100, starvla_fast_q25: 100, starvla_oft_q25: 98, starvla_groot_q25: 98, starvla_oft: 100, starvla_pi: 98 } },
        { task: "pick_up_the_black_bowl_on_the_ramekin_and_place_it_on_the_plate", scores: { pi05: 99, starvla_fast_q25: 92, starvla_oft_q25: 96, starvla_groot_q25: 94, starvla_oft: 96, starvla_pi: 98 } },
        { task: "pick_up_the_black_bowl_on_the_stove_and_place_it_on_the_plate", scores: { pi05: 100, starvla_fast_q25: 92, starvla_oft_q25: 92, starvla_groot_q25: 92, starvla_oft: 98, starvla_pi: 98 } },
        { task: "pick_up_the_black_bowl_next_to_the_plate_and_place_it_on_the_plate", scores: { pi05: 100, starvla_fast_q25: 94, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "pick_up_the_black_bowl_on_the_wooden_cabinet_and_place_it_on_the_plate", scores: { pi05: 96, starvla_fast_q25: 82, starvla_oft_q25: 96, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 98 } },
      ],
      footNote: "仅收录 Ours 列（每任务 ×50 episodes）。",
    },

    /* LIBERO-Object：逐任务 */
    {
      id: "libero_object",
      group: "libero",
      name: "LIBERO-Object",
      icon: "📦",
      tagline: "10 任务 × 50 episodes 逐任务 Ours 成功率（%）：StarVLA 各变体。",
      metric: "成功率 Success Rate (%)",
      models: [
        "starvla_fast_q25",
        "starvla_oft_q25",
        "starvla_groot_q25",
        "starvla_oft",
        "starvla_pi",
      ],
      tasks: [
        { task: "pick_up_the_alphabet_soup_and_place_it_in_the_basket", scores: { starvla_fast_q25: 96, starvla_oft_q25: 98, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 98 } },
        { task: "pick_up_the_cream_cheese_and_place_it_in_the_basket", scores: { starvla_fast_q25: 98, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 98 } },
        { task: "pick_up_the_salad_dressing_and_place_it_in_the_basket", scores: { starvla_fast_q25: 100, starvla_oft_q25: 98, starvla_groot_q25: 98, starvla_oft: 100, starvla_pi: 96 } },
        { task: "pick_up_the_bbq_sauce_and_place_it_in_the_basket", scores: { starvla_fast_q25: 86, starvla_oft_q25: 94, starvla_groot_q25: 96, starvla_oft: 100, starvla_pi: 100 } },
        { task: "pick_up_the_ketchup_and_place_it_in_the_basket", scores: { starvla_fast_q25: 98, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "pick_up_the_tomato_sauce_and_place_it_in_the_basket", scores: { starvla_fast_q25: 98, starvla_oft_q25: 98, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 92 } },
        { task: "pick_up_the_butter_and_place_it_in_the_basket", scores: { starvla_fast_q25: 100, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 98 } },
        { task: "pick_up_the_milk_and_place_it_in_the_basket", scores: { starvla_fast_q25: 100, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "pick_up_the_chocolate_pudding_and_place_it_in_the_basket", scores: { starvla_fast_q25: 98, starvla_oft_q25: 92, starvla_groot_q25: 98, starvla_oft: 100, starvla_pi: 96 } },
        { task: "pick_up_the_orange_juice_and_place_it_in_the_basket", scores: { starvla_fast_q25: 100, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
      ],
      footNote: "仅收录 Ours 列（每任务 ×50 episodes）。",
    },

    /* LIBERO-Goal：逐任务 */
    {
      id: "libero_goal",
      group: "libero",
      name: "LIBERO-Goal",
      icon: "🎯",
      tagline: "10 任务 × 50 episodes 逐任务 Ours 成功率（%）：StarVLA 各变体。",
      metric: "成功率 Success Rate (%)",
      models: [
        "starvla_fast_q25",
        "starvla_oft_q25",
        "starvla_groot_q25",
        "starvla_oft",
        "starvla_pi",
      ],
      tasks: [
        { task: "open_the_middle_drawer_of_the_cabinet", scores: { starvla_fast_q25: 92, starvla_oft_q25: 100, starvla_groot_q25: 98, starvla_oft: 100, starvla_pi: 100 } },
        { task: "put_the_bowl_on_the_stove", scores: { starvla_fast_q25: 90, starvla_oft_q25: 92, starvla_groot_q25: 94, starvla_oft: 100, starvla_pi: 100 } },
        { task: "put_the_wine_bottle_on_top_of_the_cabinet", scores: { starvla_fast_q25: 96, starvla_oft_q25: 98, starvla_groot_q25: 98, starvla_oft: 100, starvla_pi: 96 } },
        { task: "open_the_top_drawer_and_put_the_bowl_inside", scores: { starvla_fast_q25: 90, starvla_oft_q25: 96, starvla_groot_q25: 92, starvla_oft: 96, starvla_pi: 92 } },
        { task: "put_the_bowl_on_top_of_the_cabinet", scores: { starvla_fast_q25: 96, starvla_oft_q25: 96, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 96 } },
        { task: "push_the_plate_to_the_front_of_the_stove", scores: { starvla_fast_q25: 96, starvla_oft_q25: 100, starvla_groot_q25: 96, starvla_oft: 94, starvla_pi: 96 } },
        { task: "put_the_cream_cheese_in_the_bowl", scores: { starvla_fast_q25: 82, starvla_oft_q25: 96, starvla_groot_q25: 98, starvla_oft: 100, starvla_pi: 98 } },
        { task: "turn_on_the_stove", scores: { starvla_fast_q25: 100, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "put_the_bowl_on_the_plate", scores: { starvla_fast_q25: 98, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "put_the_wine_bottle_on_the_rack", scores: { starvla_fast_q25: 60, starvla_oft_q25: 94, starvla_groot_q25: 96, starvla_oft: 96, starvla_pi: 98 } },
      ],
      footNote:
        "仅收录 Ours 列；StarVLA-π 的 Goal 以 starVLA.docx（97.6）为准。",
    },

    /* LIBERO-10：逐任务 */
    {
      id: "libero_10",
      group: "libero",
      name: "LIBERO-10",
      icon: "🏅",
      tagline: "10 个跨套件任务 × 50 episodes 逐任务 Ours 成功率（%）：StarVLA 各变体。",
      metric: "成功率 Success Rate (%)",
      models: [
        "starvla_fast_q25",
        "starvla_oft_q25",
        "starvla_groot_q25",
        "starvla_oft",
        "starvla_pi",
      ],
      tasks: [
        { task: "put_both_the_alphabet_soup_and_the_tomato_sauce_in_the_basket", scores: { starvla_fast_q25: 78, starvla_oft_q25: 98, starvla_groot_q25: 92, starvla_oft: 100, starvla_pi: 96 } },
        { task: "put_both_the_cream_cheese_box_and_the_butter_in_the_basket", scores: { starvla_fast_q25: 92, starvla_oft_q25: 100, starvla_groot_q25: 96, starvla_oft: 100, starvla_pi: 96 } },
        { task: "turn_on_the_stove_and_put_the_moka_pot_on_it", scores: { starvla_fast_q25: 94, starvla_oft_q25: 98, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "put_the_black_bowl_in_the_bottom_drawer_of_the_cabinet_and_close_it", scores: { starvla_fast_q25: 92, starvla_oft_q25: 94, starvla_groot_q25: 96, starvla_oft: 88, starvla_pi: 98 } },
        { task: "put_the_white_mug_on_the_left_plate_and_put_the_yellow_and_white_mug_on_the_right_plate", scores: { starvla_fast_q25: 86, starvla_oft_q25: 92, starvla_groot_q25: 92, starvla_oft: 94, starvla_pi: 100 } },
        { task: "pick_up_the_book_and_place_it_in_the_back_compartment_of_the_caddy", scores: { starvla_fast_q25: 100, starvla_oft_q25: 100, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "put_the_white_mug_on_the_plate_and_put_the_chocolate_pudding_to_the_right_of_the_plate", scores: { starvla_fast_q25: 80, starvla_oft_q25: 80, starvla_groot_q25: 66, starvla_oft: 86, starvla_pi: 80 } },
        { task: "put_both_the_alphabet_soup_and_the_cream_cheese_box_in_the_basket", scores: { starvla_fast_q25: 98, starvla_oft_q25: 82, starvla_groot_q25: 100, starvla_oft: 100, starvla_pi: 100 } },
        { task: "put_both_moka_pots_on_the_stove", scores: { starvla_fast_q25: 46, starvla_oft_q25: 62, starvla_groot_q25: 66, starvla_oft: 92, starvla_pi: 94 } },
        { task: "put_the_yellow_and_white_mug_in_the_microwave_and_close_it", scores: { starvla_fast_q25: 78, starvla_oft_q25: 96, starvla_groot_q25: 94, starvla_oft: 94, starvla_pi: 92 } },
      ],
      footNote: "仅收录 Ours 列（每任务 ×50 episodes）。",
    },
  ],
};
