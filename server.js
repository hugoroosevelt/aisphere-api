import express from "express";
import cors from "cors";
import googleTrends from "google-trends-api";

const app = express();
app.use(cors());

/* 👇 ADD IT HERE */
app.get("/", (req, res) => {
 res.send("🔥 NEW SERVER VERSION ACTIVE 🔥");
});

/* 👇 Your existing route */

app.get("/trends", async (req, res) => {
  console.log("🔥 NEW VERSION WITH KEYWORDS RUNNING");

  try {
    const countries = [
      { name: "United States", geo: "US" },
      { name: "Mexico", geo: "MX" },
      { name: "Brazil", geo: "BR" },
      { name: "Germany", geo: "DE" },
      { name: "India", geo: "IN" }
    ];

    const keywords = ["AI", "ChatGPT", "OpenAI", "Machine Learning"];

    const results = await Promise.all(
      countries.map(async (c) => {
        try {
          // 📊 Interest score (same as before)
          const data = await googleTrends.interestOverTime({
            keyword: keywords,
            geo: c.geo,
            timeframe: "now 7-d"
          });

          const parsed = JSON.parse(data);
          const values = parsed.default.timelineData;

          const avg =
            values.reduce((sum, v) => {
              const total = v.value.reduce((a, b) => a + b, 0);
              return sum + total;
            }, 0) / values.length;

          // 🔥 NEW: trending searches
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

  // 🔥 fallback so UI always shows something
  topKeywords = ["AI", "ChatGPT", "OpenAI"];
}

          return {
            country: c.name,
            score: Math.round(avg),
            keywords: topKeywords
          };

        } catch (err) {
          console.log(`Error with ${c.name}`);
          return {
            country: c.name,
            score: 0,
            keywords: []
          };
        }
      })
    );
    console.log("🔥 KEYWORDS ACTIVE", results[0]);
    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});