const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const DATA_FILE = "items.json";

// Load items from file
function loadItems() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// --------------------------------------------
// Search by keyword
// --------------------------------------------
app.get("/search", (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : "";
  if (!keyword) {
    return res.status(400).json({ status: "Error Request Not Valid." });
  }

  const items = loadItems();
  const results = items.filter(
    (i) =>
      i.name.toLowerCase().includes(keyword) ||
      i.description.toLowerCase().includes(keyword)
  );

  if (results.length === 0) {
    return res.json({ message: "No results found" });
  }

  res.json(results);
});

// --------------------------------------------
// Search by ID
// --------------------------------------------
app.get("/search/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const items = loadItems();
  const match = items.find((i) => i.id === id);

  if (!match) {
    return res.json({ message: "Item not found" });
  }

  res.json(match);
});

// --------------------------------------------
// Run microservice
// --------------------------------------------
app.listen(4001, () => {
  console.log("Search microservice running on port 4001");
});
