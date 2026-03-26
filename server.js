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
    const countryCoords = {
  "United States": [-98, 39],
  "China": [104, 35],
  "India": [78.9, 21],
  "Germany": [10.4, 51],
  "United Kingdom": [-3, 55],
  "France": [2.2, 46],
  "Japan": [138, 36],
  "South Korea": [127.5, 36],
  "Canada": [-106, 56],
  "Australia": [134, -25],

  "Mexico": [-102, 23],
  "Brazil": [-51, -10],
  "Argentina": [-64, -34],
  "Chile": [-71, -35],
  "Colombia": [-74, 4],

  "Spain": [-3.7, 40],
  "Italy": [12.5, 42.8],
  "Netherlands": [5.3, 52.1],
  "Sweden": [18.6, 60.1],
  "Switzerland": [8.2, 46.8],

  "United Arab Emirates": [54, 24],
  "Saudi Arabia": [45, 24],
  "South Africa": [24, -29],
  "Nigeria": [8, 9],
  "Singapore": [103.8, 1.3]
};

    const keywords = ["AI", "ChatGPT", "OpenAI", "Machine Learning"];

    const results = await Promise.all(
      countries.map(async (c, i) => {
  await new Promise(r => setTimeout(r, i * 300)); // throttle
        try {
          // 📊 Interest score
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

          // 🔥 Trending keywords
          let topKeywords = [];

          try {
            const daily = await googleTrends.dailyTrends({
              geo: c.geo
            });

            const parsedDaily = JSON.parse(daily);

            const searches =
              parsedDaily.default.trendingSearchesDays?.[0]
                ?.trendingSearches || [];

            topKeywords = searches
              .slice(0, 3)
              .map((s) => s.title.query);

          } catch (err) {
            console.log(`⚠️ No keywords for ${c.name}`);
          }

          // ✅ FINAL SAFE FALLBACK
          if (!topKeywords || topKeywords.length === 0) {
            const fallbackKeywords = {
              "United States": ["AI", "OpenAI", "Tech"],
              "Mexico": ["IA", "ChatGPT", "Innovación"],
              "Brazil": ["AI", "Startups", "Digital"],
              "Germany": ["AI", "Automation", "Industry 4.0"],
              "India": ["AI", "Developers", "Tech"]
            };

            topKeywords =
              fallbackKeywords[c.name] ||
              ["AI", "ChatGPT", "Artificial Intelligence"];
          }

          return {
            country: c.name,
            score: Math.round(avg) || 10,
            keywords: topKeywords
          };

        } catch (err) {
          console.log(`❌ Error with ${c.name}`);

          return {
            country: c.name,
            score: 10,
            keywords: ["AI", "ChatGPT", "Artificial Intelligence"]
          };
        }
      })
    );

    console.log("🔥 FINAL RESPONSE", results);
    res.json(results);

  } catch (err) {
    console.error("❌ GLOBAL ERROR", err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});