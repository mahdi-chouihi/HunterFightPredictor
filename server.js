const express = require("express");
const cors = require("cors");
const { simulateFight } = require("./fightEngine");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/simulate", (req, res) => {
  const { fighterA, fighterB } = req.body;

  if (!fighterA || !fighterB) {
    return res.status(400).json({ error: "Both fighters required." });
  }

  const result = simulateFight(fighterA, fighterB);
  res.json(result);
});

app.listen(3000, () => {
  console.log("Fight Predictor running on http://localhost:3000");
});
