import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🔥 AI SPHERE API RUNNING 🔥");
});

// 🌍 BASE MODEL
const baseWeights = {
  "United States": 90,
  "China": 88,
  "India": 85,
  "Germany": 80,
  "United Kingdom": 82,
  "France": 78,
  "Japan": 79,
  "South Korea": 81,
  "Canada": 77,
  "Australia": 75,

  "Mexico": 70,
  "Brazil": 72,
  "Argentina": 65,
  "Chile": 64,
  "Colombia": 63,

  "Spain": 76,
  "Italy": 74,
  "Netherlands": 77,
  "Sweden": 78,
  "Switzerland": 79,

  "United Arab Emirates": 73,
  "Saudi Arabia": 71,
  "South Africa": 66,
  "Nigeria": 60,
  "Singapore": 83
};

// 🔄 momentum memory
let momentum = {};
Object.keys(baseWeights).forEach(c => {
  momentum[c] = 0;
});

// 📈 HISTORY STORAGE
let historyStore = {};
const MAX_HISTORY = 10;

// 🔥 keyword generator
function getKeywords() {
  const pool = [
    "ChatGPT","OpenAI","Grok","Perplexity",
    "DeepSeek","Agents","LLMs","Automation","AI"
  ];
  return pool.sort(() => 0.5 - Math.random()).slice(0, 3);
}

// 🚀 MAIN ENDPOINT (WITH HISTORY + SPIKES)
app.get("/trends", (req, res) => {
  try {
    const results = [];

    for (const country of Object.keys(baseWeights)) {

      // smooth movement
      momentum[country] += (Math.random() * 4 - 2);

      // 🔥 spike
      let spike = 0;
      if (Math.random() < 0.1) {
        spike = 15 + Math.random() * 10;
        console.log("🚨 SPIKE EVENT in:", country);
      }

      const score =
        baseWeights[country] +
        momentum[country] +
        Math.random() * 5 +
        spike;

      const finalScore = Math.round(score);

      // 📊 STORE HISTORY
      if (!historyStore[country]) {
        historyStore[country] = [];
      }

      historyStore[country].push(finalScore);

      if (historyStore[country].length > MAX_HISTORY) {
        historyStore[country].shift();
      }

      results.push({
        country,
        score: finalScore,
        keywords: getKeywords()
      });
    }

    const sorted = results.sort((a, b) => b.score - a.score);

    res.json({
      current: sorted,
      history: historyStore
    });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({ error: "Failed to generate trends" });
  }
});

// 🟢 START SERVER
app.listen(3001, () => {
  console.log("🚀 Server running on port 3001");
});