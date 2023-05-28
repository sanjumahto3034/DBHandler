const express = require("express");
const route = express.Router();
const app = express();
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const userDB = require('./functions/DBManager')
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dbName = 'mydatabase';
var url = process.env.MONGO_URL || "mongodb+srv://testsanju001:owC4YRcC7FdRPZfB@db.qdmxhp7.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection failed:', error));
db.once('open', () => console.log('MongoDB connected successfully'));



app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000/'
  }));
  app.use(cors({
    methods: ['GET', 'POST']
  }));
  app.use(cors({
    allowedHeaders: ['Authorization', 'Content-Type']
  }));
  
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
const port = process.env.MONGO_URL || 4000;
app.listen(port,()=>{console.log("Server Is Started at port",port)});



