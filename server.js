import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("✅ Hybrid AI Pulse API Running");
});

// ✅ HYBRID ENGINE
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

let momentum = {};

Object.keys(baseWeights).forEach(c => {
  momentum[c] = 0;
});

function getKeywords() {
  const pool = [
    "ChatGPT","OpenAI","Grok","Perplexity",
    "DeepSeek","Agents","LLMs","Automation","AI"
  ];
  return pool.sort(() => 0.5 - Math.random()).slice(0, 3);
}

app.get("/trends", (req, res) => {
  try {
    const results = Object.keys(baseWeights).map(country => {
      
      momentum[country] += (Math.random() * 4 - 2);

      const score =
        baseWeights[country] +
        momentum[country] +
        Math.random() * 5;
        

      return {
        country,
        score: Math.round(score),
        keywords: getKeywords()
      };
    });

    const sorted = results.sort((a, b) => b.score - a.score);

    res.json(sorted);

  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: "Failed to generate trends" });
  }
});

  const sorted = results.sort((a, b) => b.score - a.score);

  res.json(sorted);
});

    const sorted = results.sort((a, b) => b.score - a.score);

    res.json(sorted);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Failed to generate trends" });
  }
});

// ✅ PORT (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});