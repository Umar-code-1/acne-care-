const Scan = require("../models/Scan");

/* ============================================================
   DIET RULES ENGINE
   Input : latest scan (severity + acne type + questionnaire)
   Output: personalised eat / avoid / focus areas
   ============================================================ */

const BASE = {
  Mild: {
    eat: ["Green tea", "Blueberries", "Oats", "Sweet potato", "Spinach", "Brown rice"],
    avoid: ["Candy & soda", "White bread", "Chips", "Pastries"],
    note: "Your acne is mild. Small, consistent dietary changes are usually enough.",
  },
  Moderate: {
    eat: ["Salmon", "Walnuts", "Turmeric", "Broccoli", "Bell peppers", "Olive oil", "Avocado"],
    avoid: ["All dairy products", "Refined carbs", "Sugary drinks", "Pizza & white pasta", "Processed snacks"],
    note: "Moderate acne responds well to an anti-inflammatory diet. Give it 6–8 weeks.",
  },
  Severe: {
    eat: ["Fatty fish (salmon, mackerel)", "Avocado", "Dark leafy greens", "Brazil nuts", "Flaxseeds", "Fermented vegetables"],
    avoid: ["ALL dairy (strictly)", "High-glycemic foods", "Processed meats", "Seed oils", "Fried foods", "Alcohol"],
    note: "Severe acne needs medical treatment alongside diet. Diet alone will not be enough.",
  },
};

const SKIN = {
  Oily: {
    tip: "Zinc-rich foods help regulate sebum production.",
    eat: ["Pumpkin seeds", "Chickpeas", "Lentils"],
    avoid: ["Greasy foods", "Excess omega-6 oils"],
  },
  Dry: {
    tip: "Healthy fats support your skin barrier.",
    eat: ["Olive oil", "Almonds", "Chia seeds"],
    avoid: ["Excess caffeine", "Alcohol"],
  },
  Combination: {
    tip: "Balance and hydration matter most for combination skin.",
    eat: ["Cucumber", "Herbal teas", "Leafy greens"],
    avoid: ["Added sugar", "Ultra-processed foods"],
  },
  Sensitive: {
    tip: "Anti-inflammatory foods reduce reactivity.",
    eat: ["Turmeric", "Ginger", "Oats", "Chamomile tea"],
    avoid: ["Spicy foods", "Alcohol", "Citrus"],
  },
  Normal: {
    tip: "Maintain a balanced, antioxidant-rich diet.",
    eat: ["Mixed berries", "Colourful vegetables", "Green tea"],
    avoid: ["Excess sugar", "Processed snacks"],
  },
};

const buildPlan = (scan) => {
  const q = scan.questionnaire || {};
  const sev = BASE[scan.severity] ? scan.severity : "Mild";
  const base = BASE[sev];
  const skin = SKIN[scan.skinType] || SKIN.Normal;

  const eat = new Set([...base.eat, ...skin.eat]);
  const avoid = new Set([...base.avoid, ...skin.avoid]);
  const focus = [];      // personalised action points
  const factors = [];    // what we actually used

  factors.push(`${sev} severity`, `${scan.skinType || "Normal"} skin`);

  // ---- hydration ----
  if (q.waterIntake !== undefined && q.waterIntake < 6) {
    focus.push({
      icon: "💧",
      title: "Increase your water intake",
      text: `You reported ${q.waterIntake} glasses a day. Aim for 8–10. Dehydrated skin produces more oil to compensate, which worsens congestion.`,
      priority: "high",
    });
    eat.add("Cucumber");
    eat.add("Watermelon");
    factors.push(`${q.waterIntake} glasses of water/day`);
  }

  // ---- sleep ----
  if (q.sleep !== undefined && q.sleep < 6) {
    focus.push({
      icon: "😴",
      title: "Prioritise sleep",
      text: `${q.sleep} hours a night raises cortisol, which increases oil production and inflammation. Add magnesium-rich foods to support sleep quality.`,
      priority: "high",
    });
    eat.add("Almonds");
    eat.add("Bananas");
    eat.add("Pumpkin seeds");
    avoid.add("Caffeine after 4pm");
    factors.push(`${q.sleep} hours sleep`);
  }

  // ---- stress ----
  if (q.stress !== undefined && q.stress >= 7) {
    focus.push({
      icon: "😰",
      title: "Manage stress through diet",
      text: `A stress level of ${q.stress}/10 is strongly linked to acne flare-ups. Omega-3s and magnesium help regulate the stress response.`,
      priority: "high",
    });
    eat.add("Dark chocolate (70%+)");
    eat.add("Fatty fish");
    eat.add("Spinach");
    avoid.add("Excess caffeine");
    avoid.add("Energy drinks");
    factors.push(`stress level ${q.stress}/10`);
  }

  // ---- exercise ----
  if (q.exercise === "Rarely/None") {
    focus.push({
      icon: "🏃",
      title: "Add light activity",
      text: "Even 20 minutes of walking daily improves circulation and helps regulate the hormones that drive acne.",
      priority: "medium",
    });
    factors.push("low activity level");
  }

  // ---- hormonal ----
  if (Array.isArray(q.conditions) && q.conditions.includes("hormonal")) {
    focus.push({
      icon: "⚕️",
      title: "Hormonal support",
      text: "You reported hormonal issues. Low-glycemic eating and spearmint tea have evidence for reducing androgen-driven acne. Discuss with your dermatologist.",
      priority: "high",
    });
    eat.add("Spearmint tea");
    eat.add("Flaxseeds");
    eat.add("Whole grains");
    avoid.add("High-sugar foods");
    avoid.add("Refined flour");
    factors.push("hormonal factors reported");
  }

  // ---- age ----
  if (q.age && q.age >= 13 && q.age <= 19) {
    focus.push({
      icon: "🧒",
      title: "Teenage skin",
      text: "Hormonal changes during adolescence drive most teenage acne. Diet helps, but consistency over months matters more than any single food.",
      priority: "low",
    });
    factors.push(`age ${q.age}`);
  }

  // ---- duration ----
  if (q.duration === "5+ years" || q.duration === "2-5 years") {
    focus.push({
      icon: "⏱️",
      title: "Long-standing acne",
      text: `You've had acne for ${q.duration}. Persistent acne rarely resolves through diet alone — a dermatologist consultation is strongly recommended.`,
      priority: "high",
    });
    factors.push(`duration: ${q.duration}`);
  }

  // ---- reported problems ----
  if (Array.isArray(q.problems)) {
    if (q.problems.includes("Oily Skin")) {
      eat.add("Zinc-rich nuts");
      avoid.add("Fried food");
    }
    if (q.problems.includes("Dark Spots") || q.problems.includes("Hyperpigmentation")) {
      focus.push({
        icon: "🍊",
        title: "Support skin repair",
        text: "You reported pigmentation concerns. Vitamin C aids collagen formation and helps fade post-acne marks.",
        priority: "medium",
      });
      eat.add("Oranges");
      eat.add("Bell peppers");
      eat.add("Kiwi");
    }
    if (q.problems.includes("Redness")) {
      eat.add("Ginger");
      eat.add("Turmeric");
      avoid.add("Spicy foods");
    }
  }

  // sort: high priority first
  const rank = { high: 0, medium: 1, low: 2 };
  focus.sort((a, b) => rank[a.priority] - rank[b.priority]);

  return {
    severity: sev,
    acneType: scan.acneType,
    skinType: scan.skinType || "Normal",
    summary: base.note,
    skinTip: skin.tip,
    eat: [...eat],
    avoid: [...avoid],
    focus,
    factors,
    personalisation: Math.min(100, Math.round((factors.length / 8) * 100)),
    basedOnScan: scan.createdAt,
  };
};

// GET /api/diet/my   (patient)
const getMyDiet = async (req, res) => {
  try {
    const scan = await Scan.findOne({ patient: req.user._id }).sort({ createdAt: -1 });

    if (!scan) {
      return res.status(404).json({
        message: "No scan found. Run a skin analysis first to get your personalised diet plan.",
      });
    }

    res.json(buildPlan(scan));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyDiet, buildPlan };