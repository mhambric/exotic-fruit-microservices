const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const DATA_FILE = "notifications.json";

// Load notifications
function loadNotifications() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Save notifications
function saveNotifications(notifications) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2));
}

// Add a new notification
app.post("/notifications", (req, res) => {
  const { user, message } = req.body;

  if (!user || !message) {
    return res.status(400).json({ status: "Error Request Not Valid." });
  }

  const notifications = loadNotifications();
  const newId = notifications.length + 1;
  const newItem = { id: newId, user, message };

  notifications.push(newItem);
  saveNotifications(notifications);

  res.json({ message: `Item_${newId} was Added!!` });
});

// Retrieve notifications for a specific user
app.get("/notifications/:user", (req, res) => {
  const user = req.params.user.toLowerCase();
  const notifications = loadNotifications();

  const userNotes = notifications.filter(n => n.user.toLowerCase() === user);

  if (userNotes.length === 0) {
    return res.json({ message: "No notifications found" });
  }

  res.json(userNotes);
});

app.listen(4000, () => {
  console.log("Notification microservice running on port 4000");
});
