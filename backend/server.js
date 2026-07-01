require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/autocomplete", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.json({ suggestion: "" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are an autocomplete engine. Return ONLY the continuation of the user's text. Do not repeat the original text. Keep the completion short (5-20 words)."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    res.json({
      suggestion: response.output_text.trim()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      suggestion: ""
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});