const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userDB = require("./functions/DBManager");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection failed:", error));
db.once("open", () => console.log("MongoDB connected successfully"));

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({extended: true})); // Parse URL-encoded bodies
app.use(cors());
app.use(
  cors({
    origin: process.env.MONGO_URL,
  })
);
app.use(
  cors({
    methods: ["GET", "POST"],
  })
);
app.use(
  cors({
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.get("/", userDB.check);
app.get("/api", userDB.check);
app.post("/api/show", userDB.show);
app.get("/api/index", userDB.index);
app.post("/api/register", userDB.register);
app.get("/api/check", userDB.check);
app.post("/api/update", userDB.update);
app.post("/api/remove", userDB.remove);
app.post("/api/find", userDB.find);
app.post("/api/login", userDB.login);
app.post("/api/add/inventory", userDB.addInventory);
app.post("/api/test", userDB.testAPI);
app.get("/api/login/token", userDB.loginWithToken);
app.get("/api/get/inventory", userDB.getInventory);
app.get("/api/remove/inventory", userDB.removeInventory);
app.get("/api/get/profile", userDB.userDetails);
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log("Server Is   at port", port);
});
