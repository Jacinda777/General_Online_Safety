const axios = require("axios");

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

exports.getSecurityNews = async (req, res) => {
  try {
    if (!process.env.NEWS_API_KEY) {
      console.error("NEWS_API_KEY is not defined in .env");
      return res.status(500).json({
        error: "Server configuration error",
        details: "Missing or invalid NEWS_API_KEY",
      });
    }

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: 'cybersecurity OR "cyber security" OR "data breach" OR "cyber attack" OR hacking',
        language: "en",
        sortBy: "publishedAt",
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 10,
      },
    });

    if (!response.data.articles || response.data.articles.length === 0) {
      return res.status(200).json([]);
    }

    const news = response.data.articles.map((article) => ({
      title: article.title || "No title available",
      source: article.source.name || "Unknown source",
      date: article.publishedAt
        ? formatDate(new Date(article.publishedAt))
        : "Unknown date",
      description:
        article.description ||
        article.content?.slice(0, 200) ||
        "No description available",
      url: article.url || "#",
    }));

    res.status(200).json(news);
  } catch (error) {
    console.error(
      "Full error fetching news:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch cybersecurity news",
      details: error.response?.data?.message || error.message,
    });
  }
};
