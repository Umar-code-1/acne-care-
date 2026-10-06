// src/data/mockData.js



/* ---------- LANDING PAGE CONTENT ---------- */

export const OFFERINGS = [
  { icon: "🤖", title: "AI Acne Analysis", text: "Upload a selfie and get an instant severity score, acne type breakdown and confidence rating — powered by our trained detection model." },
  { icon: "🥗", title: "Diet & Routine Plans", text: "Personalized morning and night skincare steps plus an eat/avoid food plan tuned to your severity level and skin type." },
  { icon: "👨‍⚕️", title: "Doctor Consultations", text: "Book certified dermatologists online or in person, share your scan history, and receive digital prescriptions you can access anytime." },
];

export const BLOGS = [
  { id: 1, tag: "Skin Science", title: "What your breakout pattern is telling you", excerpt: "Jawline, forehead or cheeks — location often points to the underlying trigger.", image: "", date: "2026-04-18", author: "Dr. Sarah Ahmed" },
  { id: 2, tag: "Nutrition", title: "Five foods that quietly worsen acne", excerpt: "A look at the dairy and high-glycemic evidence, minus the internet myths.", image: "", date: "2026-04-26", author: "Dr. Amna Tariq" },
  { id: 3, tag: "Routines", title: "Building a routine you will actually keep", excerpt: "Three products, four minutes a day — why minimal routines outperform long ones.", image: "", date: "2026-05-02", author: "Dr. Khalid Hassan" },
];





export const STORE_PRODUCTS = [
  { id: 1, name: "CeraVe Foaming Facial Cleanser", brand: "CeraVe", price: 2499, rating: 4.8, reviews: 342, category: "Cleanser", skinType: ["Oily", "Combination"], forSev: ["Mild", "Moderate", "Severe"], img: "🧴", desc: "Removes excess oil without disrupting skin barrier. Contains ceramides and hyaluronic acid.", tag: "Bestseller" },
  { id: 2, name: "Neutrogena Oil-Free Acne Wash", brand: "Neutrogena", price: 1899, rating: 4.6, reviews: 218, category: "Cleanser", skinType: ["Oily", "Combination", "Normal"], forSev: ["Mild", "Moderate"], img: "🫧", desc: "Salicylic acid formula that clears and prevents acne breakouts.", tag: "Doctor Recommended" },
  { id: 3, name: "La Roche-Posay Effaclar Duo", brand: "La Roche-Posay", price: 3999, rating: 4.9, reviews: 567, category: "Treatment", skinType: ["Oily", "Combination", "Sensitive"], forSev: ["Moderate", "Severe"], img: "💊", desc: "Dual-action acne treatment with benzoyl peroxide and micro-exfoliation.", tag: "Top Rated" },
  { id: 4, name: "Paula's Choice 2% BHA Exfoliant", brand: "Paula's Choice", price: 4499, rating: 4.7, reviews: 891, category: "Exfoliant", skinType: ["Oily", "Combination", "Normal"], forSev: ["Mild", "Moderate"], img: "✨", desc: "Salicylic acid exfoliant that unclogs pores and smooths skin texture.", tag: "Editor's Choice" },
  { id: 5, name: "EltaMD UV Clear SPF 46", brand: "EltaMD", price: 5299, rating: 4.9, reviews: 1204, category: "Sunscreen", skinType: ["All"], forSev: ["Mild", "Moderate", "Severe"], img: "☀️", desc: "Lightweight sunscreen with niacinamide for acne-prone and sensitive skin.", tag: "Bestseller" },
  { id: 6, name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", price: 1599, rating: 4.5, reviews: 2103, category: "Serum", skinType: ["Oily", "Combination", "Normal"], forSev: ["Mild", "Moderate"], img: "💧", desc: "Reduces blemishes and pore appearance. Controls sebum production.", tag: "Value Pick" },
];

export const MEDS = {
  Mild: [{ n: "Benzoyl Peroxide 2.5%", t: "Topical", u: "Apply thin layer once daily at night", d: "6 weeks" }],
  Moderate: [{ n: "Clindamycin+BP 5%", t: "Topical", u: "Apply twice daily", d: "10 weeks" }],
  Severe: [{ n: "Isotretinoin 20mg", t: "Oral", u: "Take with fatty meal daily", d: "5 months" }],
};

export const SKINCARE_STEPS = {
  Oily: { morning: ["Foaming cleanser", "Niacinamide serum", "Oil-free moisturizer", "SPF 46+ sunscreen"], night: ["Gel cleanser", "BHA exfoliant (3x/week)", "Retinoid (pea-size)", "Light gel moisturizer"] },
  Normal: { morning: ["Balanced cleanser", "Antioxidant serum", "Moisturizer", "SPF 30+ sunscreen"], night: ["Cleanser", "Retinol serum", "Night moisturizer"] },
};

export const ACNE_TYPES = ["Whiteheads", "Blackheads", "Papules", "Pustules", "Nodules", "Cysts"];
export const SEVERITIES = ["Clear", "Mild", "Moderate", "Severe"];

export const DIET_DATA = {
  Mild: {
    eat: [
      "Green tea",
      "Blueberries",
      "Salmon",
      "Walnuts",
      "Oats",
      "Sweet potato",
      "Plain yogurt (probiotic)",
      "Spinach",
      "Pumpkin seeds",
      "Brown rice",
    ],
    avoid: [
      "Candy & soda",
      "Milk & cheese",
      "White bread",
      "Fast food",
      "Chips",
      "Pastries",
      "Ice cream",
    ],
  },
  Moderate: {
    eat: [
      "Turmeric milk",
      "Ginger tea",
      "Oranges",
      "Bell peppers",
      "Broccoli",
      "Pumpkin seeds",
      "Spearmint tea",
      "Olive oil",
      "Kimchi",
      "Avocado",
    ],
    avoid: [
      "All dairy products",
      "Refined carbs",
      "Sugary drinks",
      "Alcohol",
      "Pizza & white pasta",
      "Excess caffeine",
      "Processed snacks",
    ],
  },
  Severe: {
    eat: [
      "Fatty fish (salmon)",
      "Avocado",
      "Bone broth",
      "Dark leafy greens",
      "Almonds",
      "Dark chocolate (70%+)",
      "Flaxseeds",
      "Fermented veggies",
      "Coconut water",
      "Brazil nuts",
    ],
    avoid: [
      "ALL dairy (strictly)",
      "High glycemic foods",
      "Processed meats",
      "Vegetable/seed oils",
      "Spicy foods",
      "Gluten (try eliminating)",
      "Alcohol",
      "Fried foods",
    ],
  },
};

export const SKIN_TYPE_DIET = {
  Oily: {
    tip: "Zinc-rich foods (pumpkin seeds, legumes) help regulate sebum. Avoid greasy and fried foods.",
    eatExtra: ["Pumpkin seeds", "Legumes", "Green tea", "Water"],
    avoidExtra: ["Greasy foods", "Excess omega-6 oils", "High-sodium snacks"],
  },
  Dry: {
    tip: "Healthy fats like avocado, olive oil, and nuts help maintain your skin barrier.",
    eatExtra: ["Avocado", "Olive oil", "Fatty fish", "Flaxseeds", "Nuts"],
    avoidExtra: ["Caffeine", "Alcohol", "Very hot water"],
  },
  Combination: {
    tip: "Balance is key. Focus on anti-inflammatory foods and stay hydrated.",
    eatExtra: ["Cucumber water", "Herbal teas", "Leafy greens"],
    avoidExtra: ["Sugar", "Processed foods", "Excess dairy"],
  },
  Sensitive: {
    tip: "Anti-inflammatory foods are your best friend. Avoid common allergens.",
    eatExtra: ["Turmeric", "Ginger", "Oats", "Chamomile tea"],
    avoidExtra: ["Spicy foods", "Alcohol", "Processed foods", "Citrus"],
  },
  Normal: {
    tip: "Maintain a balanced diet rich in antioxidants and vitamins.",
    eatExtra: ["Colorful vegetables", "Mixed berries", "Green tea"],
    avoidExtra: ["Excess sugar", "Processed snacks"],
  },
};