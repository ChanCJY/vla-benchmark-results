/* =========================================================
 *  VLA Benchmark Results —— 渲染逻辑
 *  读取 data.js 中的 BENCH_DATA，渲染统计、模型卡片、
 *  两个基准的结果表与自动分析。
 * ========================================================= */

(function () {
  "use strict";

  var data = window.BENCH_DATA;
  if (!data || !data.benchmarks || !data.models) {
    console.error("data.js 加载失败：请检查 window.BENCH_DATA 是否存在。");
    return;
  }

  /* ---------- 小工具 ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) {
      node.textContent = text;
    }
    return node;
  }

  function linkEl(href, className, text) {
    var node = el("a", className, text);
    node.href = href;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    return node;
  }

  function fmt(value) {
    if (value === undefined || value === null || value === "") return null;
    var n = Number(value);
    if (Number.isNaN(n)) return null;
    return n.toFixed(1);
  }

  function scoreText(value) {
    var s = fmt(value);
    return s === null ? "—" : s;
  }

  function modelById(id) {
    for (var i = 0; i < data.models.length; i++) {
      if (data.models[i].id === id) return data.models[i];
    }
    return null;
  }

  /* 某基准实际参与对比的模型（可按 bench.models 限定列） */
  function benchModels(bench) {
    if (bench.models && bench.models.length) {
      var wanted = {};
      bench.models.forEach(function (id) {
        wanted[id] = true;
      });
      return data.models.filter(function (m) {
        return wanted[m.id];
      });
    }
    return data.models.slice();
  }

  function isRollup(task) {
    return task.isRollup === true;
  }

  /* 每个模型在某基准上的平均分（rollup 行不计入） */
  function benchmarkAverages(bench) {
    var sums = {};
    var counts = {};
    var list = benchModels(bench);
    bench.tasks.forEach(function (task) {
      if (isRollup(task)) return;
      list.forEach(function (m) {
        var v = task.scores ? task.scores[m.id] : undefined;
        if (v === undefined || v === null) return;
        sums[m.id] = (sums[m.id] || 0) + Number(v);
        counts[m.id] = (counts[m.id] || 0) + 1;
      });
    });
    var result = {};
    list.forEach(function (m) {
      if (counts[m.id]) {
        result[m.id] = sums[m.id] / counts[m.id];
      }
    });
    return result;
  }

  function topModels(avgs) {
    var entries = [];
    Object.keys(avgs).forEach(function (id) {
      if (avgs[id] !== undefined && avgs[id] !== null) {
        entries.push({ id: id, avg: avgs[id] });
      }
    });
    entries.sort(function (a, b) {
      return b.avg - a.avg;
    });
    return entries;
  }

  var rankMedals = ["🥇", "🥈", "🥉"];

  /* ---------- 顶部元信息 ---------- */
  function renderMeta() {
    var meta = data.meta || {};

    document.getElementById("sidebarUpdated").textContent =
      "更新于 " + (meta.updatedAt || "—");

    var statUpdated = document.getElementById("statUpdated");
    statUpdated.textContent = meta.updatedAt || "—";
    statUpdated.classList.add("small");

    document.getElementById("overviewLead").textContent =
      meta.subtitle || "";
    document.getElementById("metricNote").textContent =
      meta.metricNote || "";

    var noteList = document.getElementById("evalNotes");
    (meta.evalNotes || []).forEach(function (n) {
      noteList.appendChild(el("li", null, n));
    });

    var footer = document.getElementById("footerText");
    var footerParts = [];
    if (meta.organizer) footerParts.push(meta.organizer);
    footerParts.push(
      "最近更新：" + (meta.updatedAt || "—") + " · 数据维护于 data.js"
    );
    footer.textContent = footerParts.join(" · ");

    if (meta.isSample || meta.sourceRepo) {
      var banner = document.getElementById("sampleBanner");
      banner.hidden = false;
      document.getElementById("sampleBannerText").textContent =
        meta.sampleText || "";
      var sourceLink = document.getElementById("sourceRepoLink");
      if (sourceLink && meta.sourceRepo) {
        sourceLink.href = meta.sourceRepo;
        sourceLink.textContent = meta.sourceRepo.replace(/^https?:\/\//, "");
      }
    }

    if (meta.title) document.title = meta.title;
  }

  /* ---------- Hero 统计 ---------- */
  function renderStats() {
    var taskCount = 0;
    var groups = {};
    data.benchmarks.forEach(function (b) {
      groups[b.group || b.id] = true;
      if (!b.isSummary) {
        taskCount += b.tasks.length;
      }
    });
    document.getElementById("statBenchmarks").textContent =
      Object.keys(groups).length;
    document.getElementById("statModels").textContent = data.models.length;
    document.getElementById("statTasks").textContent = taskCount;
  }

  /* ---------- 模型卡片 ---------- */
  function avatarLetters(name) {
    var clean = String(name || "?").replace(/[^A-Za-z0-9]/g, "");
    if (!clean) return "?";
    return clean.slice(0, 2).toUpperCase();
  }

  function renderModelCards() {
    var root = document.getElementById("modelCards");
    data.models.forEach(function (m, idx) {
      var card = el("article", "card model-card");

      var top = el("div", "model-top");
      var avatar = el(
        "div",
        "model-avatar",
        avatarLetters(m.name)
      );
      avatar.style.background =
        "linear-gradient(135deg, " +
        (m.color || "#dc2626") +
        ", " +
        (m.color || "#dc2626") +
        "cc)";
      top.appendChild(avatar);

      var nameWrap = el("div");
      nameWrap.appendChild(el("h3", "model-name", m.name));
      nameWrap.appendChild(
        el(
          "p",
          "model-base",
          (m.base || "") + (m.size ? " · " + m.size : "")
        )
      );
      top.appendChild(nameWrap);
      card.appendChild(top);

      card.appendChild(el("p", "model-desc", m.desc || ""));

      var tags = el("div", "model-tags");
      (m.tags || []).forEach(function (t) {
        tags.appendChild(el("span", "model-tag", t));
      });
      card.appendChild(tags);

      if (m.repo) {
        card.appendChild(
          linkEl(m.repo, "model-link", "🔗 " + m.repo.replace(/^https?:\/\//, ""))
        );
      }

      root.appendChild(card);
    });
  }

  /* ---------- 结果表 ---------- */
  function renderBenchmark(bench) {
    var rootHost = null;
    if (bench.group === "libero") {
      rootHost = document.getElementById("liberoBenchRoot");
    } else {
      rootHost = document.getElementById("bench-" + bench.id);
    }
    if (!rootHost) return;

    /* 每个基准使用独立子容器，避免共用容器时互相清空 */
    var block = document.getElementById("host-" + bench.id);
    if (!block) {
      block = el("div", "bench-block");
      block.id = "host-" + bench.id;
      rootHost.appendChild(block);
    }
    block.textContent = "";

    var list = benchModels(bench);
    var card = el("div", "card bench-card");
    var avgs = benchmarkAverages(bench);
    var ranking = topModels(avgs);
    var bestAvg = ranking.length ? ranking[0].avg : null;

    /* 表头 */
    var head = el("div", "bench-head");
    head.appendChild(el("div", "bench-icon", bench.icon || "📋"));
    var titleBox = el("div", "bench-title");
    titleBox.appendChild(el("h3", null, bench.name));
    titleBox.appendChild(el("p", null, bench.tagline || bench.metric || ""));
    head.appendChild(titleBox);

    var chip = el("div", "bench-chip");
    chip.appendChild(el("div", "chip-label", ranking.length ? "当前最优平均" : "暂无数据"));
    if (ranking.length) {
      var topModel = modelById(ranking[0].id);
      chip.appendChild(
        el(
          "div",
          "chip-value",
          (topModel ? topModel.name : ranking[0].id) +
            " · " +
            fmt(ranking[0].avg) +
            "%"
        )
      );
    }
    head.appendChild(chip);
    card.appendChild(head);

    /* 表格 */
    var wrap = el("div", "table-wrap");
    var table = el("table", "results-table");
    var thead = el("thead");
    var headRow = el("tr");
    headRow.appendChild(el("th", null, "#"));
    headRow.appendChild(el("th", null, "任务 Task"));

    list.forEach(function (m, i) {
      var th = el("th", "model-col", m.name);
      if (m.base) {
        var sub = el("span", "th-sub", m.base);
        th.appendChild(sub);
      }
      var isTop = ranking.length && ranking[0].id === m.id;
      if (isTop) {
        th.appendChild(el("span", "trophy", "🏆 平均最优"));
      }
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = el("tbody");

    bench.tasks.forEach(function (task, idx) {
      var tr = el("tr");
      tr.appendChild(el("td", null, String(idx + 1)));

      var taskCell = el("td", "task-cell", task.task);
      if (task.label) {
        taskCell.appendChild(el("span", "task-sub", task.label));
      }
      if (isRollup(task)) tr.className = "rollup-row";
      tr.appendChild(taskCell);

      var rowMax = null;
      list.forEach(function (m) {
        var v = task.scores ? task.scores[m.id] : undefined;
        var n = fmt(v);
        if (n !== null) {
          var num = Number(n);
          if (rowMax === null || num > rowMax) rowMax = num;
        }
      });

      list.forEach(function (m) {
        var v = task.scores ? task.scores[m.id] : undefined;
        var n = fmt(v);
        var td = el("td", "score-cell", n === null ? "—" : n + "%");
        if (n === null) {
          td.classList.add("na");
        } else if (rowMax !== null && Number(n) === rowMax) {
          td.classList.add("is-best");
          var flag = el("span", "best-flag", "★");
          flag.title = "该行最优";
          td.appendChild(flag);
        }
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    /* 平均行 */
    if (ranking.length) {
      var avgTr = el("tr", "avg-row");
      avgTr.appendChild(el("td", null, ""));
      avgTr.appendChild(el("td", "avg-label", "📊 平均 Average"));
      var rankMap = {};
      ranking.forEach(function (r, i) {
        rankMap[r.id] = i;
      });
      list.forEach(function (m) {
        var td = el("td", "score-cell");
        if (avgs[m.id] === undefined) {
          td.textContent = "—";
          td.classList.add("na");
        } else {
          var chipSmall = el("span", "avg-chip");
          var medal = rankMedals[rankMap[m.id]];
          chipSmall.textContent =
            (medal ? medal + " " : "") + fmt(avgs[m.id]) + "%";
          td.appendChild(chipSmall);
        }
        avgTr.appendChild(td);
      });
      tbody.appendChild(avgTr);
    }

    table.appendChild(tbody);
    wrap.appendChild(table);
    card.appendChild(wrap);

    /* 表尾说明 */
    var foot = el("div", "bench-foot");
    var legend = el("div", "legend");
    var legend1 = el("span", "legend-item");
    legend1.appendChild(el("span", "legend-swatch", null));
    legend1.lastChild.style.background = "#fef2f2";
    legend1.lastChild.style.border = "1px solid #fecaca";
    legend1.appendChild(document.createTextNode("每行最高分"));
    var legend2 = el("span", "legend-item");
    legend2.appendChild(document.createTextNode("— 未测评 / 未记录"));
    legend.appendChild(legend1);
    legend.appendChild(legend2);
    foot.appendChild(legend);
    foot.appendChild(el("span", null, bench.footNote || bench.metric || ""));
    card.appendChild(foot);

    block.appendChild(card);
  }

  /* ---------- 分析区 ---------- */
  function renderAnalysis() {
    var benchWinners = [];

    data.benchmarks.forEach(function (b) {
      /* 汇总卡片只是套件平均一览，不参与“最优模型”卡片与柱状图 */
      if (b.isSummary) return;
      var avgs = benchmarkAverages(b);
      var ranking = topModels(avgs);
      benchWinners.push({
        bench: b,
        ranking: ranking,
      });
    });

    var cardsRoot = document.getElementById("analysisCards");
    function analysisCard(icon, title, num, desc) {
      var card = el("div", "card analysis-card");
      var iconBox = el("div", "mini-icon", icon);
      iconBox.style.margin = "0 auto";
      card.appendChild(iconBox);
      card.appendChild(el("h3", null, title));
      card.appendChild(el("div", "big-num", num));
      card.appendChild(el("p", null, desc));
      cardsRoot.appendChild(card);
    }

    benchWinners.forEach(function (w) {
      var b = w.bench;
      if (w.ranking.length) {
        var best = modelById(w.ranking[0].id);
        analysisCard(
          b.icon || "📋",
          b.name + " 最优",
          (best ? best.name : w.ranking[0].id) + " · " + fmt(w.ranking[0].avg) + "%",
          "平均成功率最高"
        );
      } else {
        analysisCard(b.icon || "📋", b.name + " 最优", "—", "暂无可计算数据");
      }
    });

    /* 条形图 */
    var chartRoot = document.getElementById("chartRoot");
    benchWinners.forEach(function (w) {
      var card = el("div", "card chart-card");
      card.appendChild(el("h4", null, (w.bench.icon || "") + " " + w.bench.name));
      var ranking = w.ranking.slice().sort(function (a, b) {
        return b.avg - a.avg;
      });
      var maxVal = ranking.length ? ranking[0].avg : 100;
      ranking.forEach(function (r) {
        var row = el("div", "bar-row");
        var model = modelById(r.id);
        row.appendChild(
          el("div", "bar-name", model ? model.name : r.id)
        );
        var track = el("div", "bar-track");
        var fill = el("div", "bar-fill");
        fill.style.width = Math.max(3, (r.avg / maxVal) * 100) + "%";
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(el("div", "bar-value", fmt(r.avg) + "%"));
        card.appendChild(row);
      });
      if (!ranking.length) {
        card.appendChild(el("p", "muted", "暂无可计算的平均数据"));
      }
      chartRoot.appendChild(card);
    });
  }

  /* ---------- 雷达图 ---------- */
  function findBench(id) {
    for (var i = 0; i < data.benchmarks.length; i++) {
      if (data.benchmarks[i].id === id) return data.benchmarks[i];
    }
    return null;
  }

  function svgNode(tag, attrs) {
    var node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      tag
    );
    Object.keys(attrs || {}).forEach(function (k) {
      node.setAttribute(k, attrs[k]);
    });
    return node;
  }

  function polar(cx, cy, radius, angleDeg) {
    var a = ((angleDeg - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  }

  /* 一组轴 + 多条模型曲线 → SVG 雷达图 */
  function radarSVG(axes, series) {
    var W = 520;
    var H = 430;
    var cx = 260;
    var cy = 205;
    var R = 140;
    var n = axes.length;
    var step = 360 / n;

    var svg = svgNode("svg", {
      viewBox: "0 0 " + W + " " + H,
      class: "radar-svg",
      role: "img",
      "aria-label":
        "雷达图：" +
        axes.map(function (a) {
          return a.label;
        }).join("、"),
    });

    /* 网格环 */
    [0.2, 0.4, 0.6, 0.8, 1].forEach(function (k) {
      var pts = axes
        .map(function (_, i) {
          var p = polar(cx, cy, R * k, step * i);
          return p[0].toFixed(1) + "," + p[1].toFixed(1);
        })
        .join(" ");
      svg.appendChild(
        svgNode("polygon", {
          points: pts,
          fill: "none",
          stroke: k === 1 ? "#d1d5db" : "#eceff3",
          "stroke-width": k === 1 ? 1.5 : 1,
        })
      );
    });

    /* 轴线与轴标签 */
    axes.forEach(function (ax, i) {
      var p = polar(cx, cy, R, step * i);
      svg.appendChild(
        svgNode("line", {
          x1: cx,
          y1: cy,
          x2: p[0].toFixed(1),
          y2: p[1].toFixed(1),
          stroke: "#eceff3",
          "stroke-width": 1,
        })
      );

      var lp = polar(cx, cy, R + 20, step * i);
      var anchor =
        Math.abs(lp[0] - cx) < 1 ? "middle" : lp[0] > cx ? "start" : "end";
      var label = svgNode("text", {
        x: lp[0].toFixed(1),
        y: lp[1].toFixed(1),
        "text-anchor": anchor,
        "dominant-baseline": "middle",
        class: "radar-axis-label",
      });
      label.textContent = ax.label;
      svg.appendChild(label);
    });

    /* 模型多边形 */
    series.forEach(function (s) {
      var pts = s.values.map(function (v, i) {
        var value = Math.max(0, Math.min(100, Number(v) || 0));
        return polar(cx, cy, (R * value) / 100, step * i);
      });
      svg.appendChild(
        svgNode("polygon", {
          points: pts
            .map(function (p) {
              return p[0].toFixed(1) + "," + p[1].toFixed(1);
            })
            .join(" "),
          fill: s.color,
          "fill-opacity": 0.12,
          stroke: s.color,
          "stroke-width": 2,
          "stroke-linejoin": "round",
        })
      );
      pts.forEach(function (p, i) {
        var dot = svgNode("circle", {
          cx: p[0].toFixed(1),
          cy: p[1].toFixed(1),
          r: 3.2,
          fill: s.color,
          class: "radar-point",
          "data-tip":
            s.name + " · " + axes[i].label + "：" + fmt(s.values[i]) + "%",
        });
        svg.appendChild(dot);
      });
    });

    return svg;
  }

  function radarLegend(series) {
    var legend = el("div", "radar-legend");
    series.forEach(function (s) {
      var item = el("span", "radar-legend-item");
      var swatch = el("span", "legend-swatch");
      swatch.style.background = s.color;
      item.appendChild(swatch);
      item.appendChild(el("span", null, s.name));
      var mean =
        s.values.reduce(function (a, b) {
          return a + Number(b);
        }, 0) / s.values.length;
      item.appendChild(el("span", "legend-mean", "均值 " + fmt(mean) + "%"));
      legend.appendChild(item);
    });
    return legend;
  }

  function modelLabel(id) {
    var m = modelById(id);
    if (!m) return id;
    return m.name + (m.base ? "（" + m.base + "）" : "");
  }

  /* RoboTwin：按任务名归类后的类别平均 */
  function robotwinRadarCard() {
    var rules = [
      { label: "抓取", test: /^(grab_|pick_|lift_)/ },
      { label: "放置", test: /^(place_|put_)/ },
      { label: "堆叠", test: /^(stack_|blocks_ranking_)/ },
      { label: "开合", test: /^open_/ },
      { label: "移动", test: /^move_/ },
      { label: "交接", test: /^handover_/ },
      { label: "交互/其它", test: /^(click_|press_|turn_|rotate_|scan_|stamp_|shake_|dump_|adjust_|beat_|hanging_)/ },
    ];

    var bench = findBench("robotwin2");
    if (!bench) return null;

    /* 只画 50 个任务全覆盖的模型 */
    var complete = benchModels(bench).filter(function (m) {
      var n = 0;
      bench.tasks.forEach(function (t) {
        if (t.scores && t.scores[m.id] !== undefined && t.scores[m.id] !== null) {
          n += 1;
        }
      });
      return n === bench.tasks.length;
    });

    var series = complete.map(function (m) {
      var values = rules.map(function (rule) {
        var sum = 0;
        var count = 0;
        bench.tasks.forEach(function (t) {
          if (!rule.test.test(t.task)) return;
          var v = t.scores ? t.scores[m.id] : undefined;
          if (v === undefined || v === null) return;
          sum += Number(v);
          count += 1;
        });
        return count ? sum / count : 0;
      });
      return { name: modelLabel(m.id), color: m.color || "#dc2626", values: values };
    });

    var counts = rules.map(function (rule) {
      return (
        rule.label +
        " " +
        bench.tasks.filter(function (t) {
          return rule.test.test(t.task);
        }).length
      );
    });

    var card = el("div", "card radar-card");
    card.appendChild(el("h4", null, "🕸️ RoboTwin 2.0 任务类别雷达"));
    card.appendChild(
      el(
        "p",
        "radar-sub",
        "按任务名归类的类别平均成功率（%），各类别等权，仅含测满 50 任务的模型"
      )
    );
    card.appendChild(
      radarSVG(
        rules.map(function (r) {
          return { label: r.label };
        }),
        series
      )
    );
    card.appendChild(radarLegend(series));
    card.appendChild(
      el(
        "p",
        "radar-note",
        "分类任务数：" +
          counts.join("、") +
          "。仅 RDT（31/50）未测满 50 任务，未入图。"
      )
    );
    return card;
  }

  /* LIBERO：四个套件的雷达（Long 即文档中的 LIBERO-10 / LIBERO_Long） */
  function liberoRadarCard() {
    var summary = findBench("libero_summary");
    if (!summary) return null;

    var axes = [
      { label: "Spatial", task: "Spatial" },
      { label: "Object", task: "Object" },
      { label: "Goal", task: "Goal" },
      { label: "Long", task: "Long" },
    ];

    var series = benchModels(summary).map(function (m) {
      var values = axes.map(function (ax) {
        var row = summary.tasks.filter(function (t) {
          return t.task === ax.task;
        })[0];
        return row && row.scores ? Number(row.scores[m.id]) : 0;
      });
      return { name: modelLabel(m.id), color: m.color || "#dc2626", values: values };
    });

    var card = el("div", "card radar-card");
    card.appendChild(el("h4", null, "🕸️ LIBERO 套件雷达"));
    card.appendChild(
      el(
        "p",
        "radar-sub",
        "Spatial / Object / Goal / Long 平均成功率（%）"
      )
    );
    card.appendChild(
      radarSVG(
        axes.map(function (a) {
          return { label: a.label };
        }),
        series
      )
    );
    card.appendChild(radarLegend(series));
    card.appendChild(
      el(
        "p",
        "radar-note",
        "Pi0.5 仅测 LIBERO-Spatial，不满足多轴对比，未入雷达图（Spatial 99.1%，见上方表格）。"
      )
    );
    return card;
  }

  function initRadarTooltip() {
    if (document.getElementById("radarTooltip")) return;
    var tip = el("div", "radar-tooltip");
    tip.id = "radarTooltip";
    document.body.appendChild(tip);

    document.addEventListener("mouseover", function (e) {
      var target =
        e.target && e.target.closest ? e.target.closest(".radar-point") : null;
      if (!target) return;
      tip.textContent = target.getAttribute("data-tip") || "";
      tip.classList.add("show");
    });
    document.addEventListener("mousemove", function (e) {
      if (!tip.classList.contains("show")) return;
      tip.style.left = e.clientX + "px";
      tip.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseout", function (e) {
      var target =
        e.target && e.target.closest ? e.target.closest(".radar-point") : null;
      if (target) tip.classList.remove("show");
    });
  }

  function renderRadars() {
    var root = document.getElementById("radarRoot");
    if (!root) return;
    initRadarTooltip();
    var robotwin = robotwinRadarCard();
    var libero = liberoRadarCard();
    if (robotwin) root.appendChild(robotwin);
    if (libero) root.appendChild(libero);
  }

  /* ---------- 导航高亮 ---------- */
  function initNav() {
    var ids = [
      "home",
      "overview",
      "models",
      "robotwin2",
      "libero",
      "analysis",
      "guide",
    ];
    var desktopLinks = document.querySelectorAll(".nav-menu a");
    var mobileLinks = document.querySelectorAll(".mobile-tabs a");

    function setActive(id) {
      desktopLinks.forEach(function (a) {
        var active = a.getAttribute("href") === "#" + id;
        a.classList.toggle("active", active);
      });
      mobileLinks.forEach(function (a) {
        var active = a.getAttribute("href") === "#" + id;
        a.classList.toggle("active", active);
      });
    }

    function onScroll() {
      var pos = window.scrollY + 130;
      var current = "home";
      ids.forEach(function (id) {
        var section = document.getElementById(id);
        if (section && section.offsetTop <= pos) current = id;
      });
      setActive(current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 启动 ---------- */
  function init() {
    renderMeta();
    renderStats();
    renderModelCards();
    data.benchmarks.forEach(renderBenchmark);
    renderAnalysis();
    renderRadars();
    initNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
