import express from "express";
import cors from "cors";
import googleTrends from "google-trends-api";

const app = express();
app.use(cors());

// 🌍 helper
function mapKeywordToCountry(keyword) {
  keyword = keyword.toLowerCase();

  if (keyword.includes("india")) return "India";
  if (keyword.includes("china")) return "China";
  if (keyword.includes("usa") || keyword.includes("america")) return "United States";
  if (keyword.includes("mexico")) return "Mexico";
  if (keyword.includes("brazil")) return "Brazil";
  if (keyword.includes("germany")) return "Germany";
  if (keyword.includes("france")) return "France";
  if (keyword.includes("japan")) return "Japan";

  return null;
}

app.get("/trends", async (req, res) => {
  try {
    const countries = [
      { name: "United States", geo: "US" },
      { name: "Mexico", geo: "MX" },
      { name: "Brazil", geo: "BR" },
      { name: "Germany", geo: "DE" },
      { name: "India", geo: "IN" },
      { name: "France", geo: "FR" },
      { name: "Japan", geo: "JP" },
      { name: "Canada", geo: "CA" },
      { name: "Australia", geo: "AU" },
      { name: "China", geo: "CN" }
    ];

    // 🧠 AI KEYWORDS (core of your product)
    const keywords = ["AI", "ChatGPT", "OpenAI", "Machine Learning"];

    const results = await Promise.all(
      countries.map(async (c) => {
        try {
          const data = await googleTrends.interestOverTime({
            keyword: keywords,
            geo: c.geo,
            timeframe: "now 7-d"
          });

          const parsed = JSON.parse(data);
          const values = parsed.default.timelineData;

          if (!values.length) {
            return { country: c.name, score: 0 };
          }

          // 📊 Average interest across time
          const avg =
            values.reduce((sum, v) => {
              const total = v.value.reduce((a, b) => a + b, 0);
              return sum + total;
            }, 0) / values.length;

          return {
            country: c.name,
            score: Math.round(avg)
          };

        } catch (err) {
          console.log(`Error with ${c.name}`);
          return { country: c.name, score: 0 };
        }
      })
    );

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});