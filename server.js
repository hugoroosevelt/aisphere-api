import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("✅ Hybrid AI Pulse API Running");
});

// ✅ HYBRID ENGINE
app.get("/trends", (req, res) => {
  try {
    const countries = [
      "United States","China","India","Germany","United Kingdom",
      "France","Japan","South Korea","Canada","Australia",
      "Mexico","Brazil","Argentina","Chile","Colombia",
      "Spain","Italy","Netherlands","Sweden","Switzerland",
      "United Arab Emirates","Saudi Arabia","South Africa","Nigeria","Singapore"
    ];

    const keywordPool = [
      "AI","ChatGPT","OpenAI","Machine Learning",
      "DeepSeek","Grok","Perplexity","LLMs","Automation","Agents"
    ];

    const results = countries.map((country) => {
      const base = 50 + Math.random() * 30;
      const pulse = Math.random() * 20;
      const score = Math.round(base + pulse);

      const keywords = Array.from({ length: 3 }, () =>
        keywordPool[Math.floor(Math.random() * keywordPool.length)]
      );

      return { country, score, keywords };
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