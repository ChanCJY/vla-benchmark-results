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

    if (meta.isSample) {
      var banner = document.getElementById("sampleBanner");
      banner.hidden = false;
      document.getElementById("sampleBannerText").textContent =
        meta.sampleText || "";
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
    initNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
