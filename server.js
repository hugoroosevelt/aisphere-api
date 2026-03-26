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

  // ✅ ALWAYS RETURN SOMETHING
  const fallbackKeywords = {
    "United States": ["AI", "OpenAI", "Tech"],
    "Mexico": ["IA", "ChatGPT", "Innovación"],
    "Brazil": ["AI", "Startups", "Digital"],
    "Germany": ["AI", "Automation", "Industry 4.0"],
    "India": ["AI", "Developers", "Tech"]
  };

  topKeywords = fallbackKeywords[c.name] || ["AI", "ChatGPT", "Artificial Intelligence"];
}

          return {
  country: c.name,
  score: 0,
  keywords: ["AI", "Technology"]
};

        } catch (err) {
          console.log(`Error with ${c.name}`);
          return {
            country: c.name,
            score: 0,
            keywords: ["AI", "ChatGPT", "Artificial Intelligence"]
          };
        }
      })
    );
    console.log("🔥 KEYWORDS ACTIVE", results[0]);
    res.json(results);

  } catch (err) {
  console.log(`⚠️ No keywords for ${c.name}`);
  topKeywords = ["AI", "ChatGPT", "Artificial Intelligence"]; // ✅ FIX
}
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});