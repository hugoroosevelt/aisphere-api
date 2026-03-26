import express from "express";
import cors from "cors";
import googleTrends from "google-trends-api";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("🔥 NEW SERVER VERSION ACTIVE 🔥");
});

app.get("/trends", async (req, res) => {
  console.log("🔥 NEW VERSION WITH KEYWORDS RUNNING");

  try {
    const countries = [
      { name: "United States", geo: "US" },
      { name: "China", geo: "CN" },
      { name: "India", geo: "IN" },
      { name: "Germany", geo: "DE" },
      { name: "United Kingdom", geo: "GB" },
      { name: "France", geo: "FR" },
      { name: "Japan", geo: "JP" },
      { name: "South Korea", geo: "KR" },
      { name: "Canada", geo: "CA" },
      { name: "Australia", geo: "AU" },

      { name: "Mexico", geo: "MX" },
      { name: "Brazil", geo: "BR" },
      { name: "Argentina", geo: "AR" },
      { name: "Chile", geo: "CL" },
      { name: "Colombia", geo: "CO" },

      { name: "Spain", geo: "ES" },
      { name: "Italy", geo: "IT" },
      { name: "Netherlands", geo: "NL" },
      { name: "Sweden", geo: "SE" },
      { name: "Switzerland", geo: "CH" },

      { name: "United Arab Emirates", geo: "AE" },
      { name: "Saudi Arabia", geo: "SA" },
      { name: "South Africa", geo: "ZA" },
      { name: "Nigeria", geo: "NG" },
      { name: "Singapore", geo: "SG" }
    ];

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
          score: Math.round(avg) || 10,
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