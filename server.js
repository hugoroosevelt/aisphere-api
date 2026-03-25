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
    const result = await googleTrends.realTimeTrends({
      geo: "US",
      category: "all",
    });

    const data = JSON.parse(result);
    const stories = data.storySummaries.trendingStories;

    const countryScores = {};

    stories.forEach(story => {
      const title = story.title;

      const country = mapKeywordToCountry(title);
      if (!country) return;

      countryScores[country] = (countryScores[country] || 0) + 10;
    });

    const formatted = Object.entries(countryScores).map(([country, score]) => ({
      country,
      score
    }));

    if (formatted.length === 0) throw new Error("No mapped countries");

    res.json(formatted);

  } catch (err) {
    console.log("⚠️ Using fallback data");

    const countries = [
      "China",
      "India",
      "United States",
      "Mexico",
      "Brazil",
      "Germany",
      "France",
      "Japan",
      "Canada",
      "Australia"
    ];

    const fallback = countries.map((c) => ({
      country: c,
      score: 60 + Math.floor(Math.random() * 40)
    }));

    res.json(fallback);
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});