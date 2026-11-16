const Scan = require("../models/Scan");

/* ============================================================
   DIET RULES ENGINE
   Input : latest scan (severity + acne type + questionnaire)
   Output: personalised eat / avoid / focus areas
   ============================================================ */

const BASE = {
  Mild: {
    eat: ["Oats", "Beans, lentils or chickpeas", "Whole-wheat roti", "Brown rice", "Leafy vegetables", "Fresh fruit", "Unsweetened green tea"],
    avoid: ["Sugary drinks and soda", "Candy and mithai", "White bread and naan", "Pastries and biscuits", "Chips and fries", "Large portions of white rice"],
    note: "Your acne is mild. A balanced diet may support your skin, but food changes are not a substitute for treatment.",
  },
  Moderate: {
    eat: ["Oats", "Beans, lentils or chickpeas", "Whole-wheat roti", "Brown rice", "Leafy vegetables", "Fresh fruit", "Eggs or fish", "Walnuts or pumpkin seeds"],
    avoid: ["Sugary drinks and soda", "Candy and mithai", "White bread and naan", "Pastries and biscuits", "Chips and fries", "Large portions of white rice", "Cow's milk if you notice a personal flare"],
    note: "Moderate acne may benefit from balanced food choices alongside a dermatologist's treatment plan.",
  },
  Severe: {
    eat: ["Oats", "Beans, lentils or chickpeas", "Whole-wheat roti", "Brown rice", "Dark leafy vegetables", "Fresh fruit", "Eggs or fish", "Walnuts or pumpkin seeds"],
    avoid: ["Sugary drinks and soda", "Candy and mithai", "White bread and naan", "Pastries and biscuits", "Chips and fries", "Large portions of white rice", "Cow's milk if you notice a personal flare"],
    note: "Severe acne needs medical treatment alongside diet. Diet alone will not be enough.",
  },
};

const SKIN = {
  Oily: {
    tip: "Skin type does not require a special diet. Choose a varied, balanced mix of foods.",
    eat: ["Pumpkin seeds", "Chickpeas", "Lentils"],
    avoid: [],
  },
  Dry: {
    tip: "A balanced diet supports general health; no specific food is proven to treat dry skin.",
    eat: ["Olive oil", "Almonds", "Chia seeds"],
    avoid: [],
  },
  Combination: {
    tip: "A varied diet is a good general choice for combination skin.",
    eat: ["Cucumber", "Herbal teas", "Leafy greens"],
    avoid: [],
  },
  Sensitive: {
    tip: "Avoid restricting foods for sensitivity unless you have a known personal trigger or medical advice.",
    eat: ["Turmeric", "Ginger", "Oats", "Chamomile tea"],
    avoid: [],
  },
  Normal: {
    tip: "A varied, balanced diet supports general health.",
    eat: ["Mixed berries", "Colourful vegetables", "Green tea"],
    avoid: [],
  },
};

const buildPlan = (scan) => {
  const q = scan.questionnaire || {};
  const scanSeverity = scan.severity || "Clear";
  const sev = BASE[scanSeverity] ? scanSeverity : "Mild";
  const base = BASE[sev];
  const skin = SKIN[scan.skinType] || SKIN.Normal;

  const eat = new Set([...base.eat, ...skin.eat]);
  const avoid = new Set(base.avoid);
  const focus = [];      // personalised action points
  const factors = [];    // what we actually used

  factors.push(`${scanSeverity} scan result`, `${scan.skinType || "Normal"} skin`);

  focus.push(
    {
      icon: "🌾",
      title: "Choose higher-fibre carbs",
      text: "Try oats, beans, lentils or whole-wheat roti in place of some refined grains. Lower-glycemic eating may help some people with acne, though evidence is still limited.",
      priority: "medium",
    },
    {
      icon: "📝",
      title: "Notice your own food patterns",
      text: "If you suspect a food trigger, keep a simple note of what you ate and when breakouts happen. Avoid cutting out whole food groups without a clinician's advice.",
      priority: "low",
    },
  );

  // ---- hydration ----
  if (q.waterIntake !== undefined && q.waterIntake < 6) {
    focus.push({
      icon: "💧",
      title: "Increase your water intake",
      text: `You reported ${q.waterIntake} glasses a day. Drink regularly to stay hydrated; extra water has not been shown to treat acne.`,
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
      text: `${q.sleep} hours a night is below the usual sleep recommendation. A regular sleep routine can support your overall wellbeing.`,
      priority: "high",
    });
    eat.add("Almonds");
    eat.add("Bananas");
    eat.add("Pumpkin seeds");
    factors.push(`${q.sleep} hours sleep`);
  }

  // ---- stress ----
  if (q.stress !== undefined && q.stress >= 7) {
    focus.push({
      icon: "😰",
      title: "Make time for stress care",
      text: `You reported a stress level of ${q.stress}/10. Stress can affect wellbeing; food alone is not a proven treatment for stress-related acne.`,
      priority: "high",
    });
    eat.add("Dark chocolate (70%+)");
    eat.add("Fatty fish");
    eat.add("Spinach");
    factors.push(`stress level ${q.stress}/10`);
  }

  // ---- exercise ----
  if (q.exercise === "Rarely/None") {
    focus.push({
      icon: "🏃",
      title: "Add light activity",
      text: "If it is suitable for you, add gentle movement such as a short walk for general health. Exercise is not a standalone acne treatment.",
      priority: "medium",
    });
    factors.push("low activity level");
  }

  // ---- hormonal ----
  if (Array.isArray(q.conditions) && q.conditions.includes("hormonal")) {
    focus.push({
      icon: "⚕️",
      title: "Hormonal support",
      text: "You reported hormonal concerns. Discuss persistent acne and possible hormonal causes with your dermatologist; food changes cannot replace medical care.",
      priority: "high",
    });
    eat.add("Spearmint tea");
    eat.add("Flaxseeds");
    eat.add("Whole grains");
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
    }
  }

  // sort: high priority first
  const rank = { high: 0, medium: 1, low: 2 };
  focus.sort((a, b) => rank[a.priority] - rank[b.priority]);

  return {
    severity: scanSeverity,
    acneType: scan.acneType,
    skinType: scan.skinType || "Normal",
    summary: scanSeverity === "Clear"
      ? "Your latest scan showed clear skin. Keep following your usual care routine; these food ideas support general health and are not acne treatment."
      : base.note,
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
