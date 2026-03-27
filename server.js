import express from "express";
import cors from "cors";
import googleTrends from "google-trends-api";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("🔥 NEW SERVER VERSION ACTIVE 🔥");
});

app.get("/trends", async (req, res) => {
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

      return {
        country,
        score,
        keywords
      };
    });

    const sorted = results.sort((a, b) => b.score - a.score);

    res.json(sorted);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Failed to generate trends" });
  }
});

  // 🔥 Sort globally
  const sorted = results.sort((a, b) => b.score - a.score);

  res.json(sorted);
});

    const keywords = ["AI", "ChatGPT", "OpenAI", "Machine Learning"];

    const results = [];

    for (let i = 0; i < countries.length; i++) {
      const c = countries[i];

      await new Promise(r => setTimeout(r, 300));

      try {
        const data = await googleTrends.interestOverTime({
          keyword: keywords,
          geo: c.geo,
          timeframe: "now 7-d"
        });

        const parsed = JSON.parse(data);
        const values = parsed.default.timelineData;

        const avg =
          values.length > 0
            ? values.reduce((sum, v) => {
                const total = v.value.reduce((a, b) => a + b, 0);
                return sum + total;
              }, 0) / values.length
            : 10;

        let topKeywords = [];

        try {
          const daily = await googleTrends.dailyTrends({ geo: c.geo });
          const parsedDaily = JSON.parse(daily);

          const searches =
            parsedDaily.default.trendingSearchesDays?.[0]
              ?.trendingSearches || [];

          topKeywords = searches.slice(0, 3).map(s => s.title.query);

        } catch (err) {
          console.log("⚠️ Daily trends failed for", c.name);
        }

        if (!topKeywords.length) {
          topKeywords = ["AI", "ChatGPT", "Artificial Intelligence"];
        }

        results.push({
          country: c.name,
          score: Math.round(avg) || Math.floor(Math.random() * 40 + 60),
          keywords: topKeywords
        });

      } catch (err) {
        console.log("❌ Error with", c.name);

        results.push({
          country: c.name,
          score: 10,
          keywords: ["AI", "ChatGPT", "Artificial Intelligence"]
        });
      }
    }

    console.log("🔥 FINAL RESPONSE COUNT:", results.length);
    res.json(results);

  } catch (err) {
    console.error("❌ GLOBAL ERROR", err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});